import { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from './AuthContext';
import { QUESTIONS, ACHIEVEMENTS } from '../data/questions';

export interface QuestionState {
  question_id: number;
  solved: boolean;
  starred: boolean;
  marked_for_revision: boolean;
  notes: string;
  time_taken_minutes: number | null;
  last_revised_at: string | null;
  solved_at: string | null;
}

export interface DailyActivity {
  activity_date: string;
  questions_solved: number;
  xp_earned: number;
}

export interface UserProfile {
  current_streak: number;
  longest_streak: number;
  total_xp: number;
  level: number;
  last_active_date: string | null;
  display_name: string;
  avatar_url: string;
  daily_goal: number;
}

interface TrackerContextType {
  questionStates: Map<number, QuestionState>;
  dailyActivity: DailyActivity[];
  profile: UserProfile | null;
  achievements: string[];
  todaySolved: number;
  totalSolved: number;
  loadingData: boolean;
  updateQuestion: (qId: number, updates: Partial<QuestionState>) => Promise<void>;
  markSolved: (qId: number, timeTaken?: number) => Promise<void>;
  refreshData: () => Promise<void>;
}

const TrackerContext = createContext<TrackerContextType | undefined>(undefined);

const XP_PER_SOLVE: Record<string, number> = { Easy: 10, Medium: 20, Hard: 40 };

export function TrackerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [questionStates, setQuestionStates] = useState<Map<number, QuestionState>>(new Map());
  const [dailyActivity, setDailyActivity] = useState<DailyActivity[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [achievements, setAchievements] = useState<string[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  const todaySolved = (() => {
    const today = new Date().toISOString().split('T')[0];
    return dailyActivity.find(d => d.activity_date === today)?.questions_solved ?? 0;
  })();

  const totalSolved = Array.from(questionStates.values()).filter(q => q.solved).length;

  const fetchData = useCallback(async () => {
    if (!user) { setLoadingData(false); return; }
    setLoadingData(true);

    const [progressRes, activityRes, profileRes, achievementsRes] = await Promise.all([
      supabase.from('question_progress').select('*').eq('user_id', user.id),
      supabase.from('daily_activity').select('*').eq('user_id', user.id).order('activity_date', { ascending: false }).limit(365),
      supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle(),
      supabase.from('user_achievements').select('achievement_id').eq('user_id', user.id),
    ]);

    if (progressRes.data) {
      const map = new Map<number, QuestionState>();
      for (const row of progressRes.data) {
        map.set(row.question_id, {
          question_id: row.question_id,
          solved: row.solved,
          starred: row.starred,
          marked_for_revision: row.marked_for_revision,
          notes: row.notes,
          time_taken_minutes: row.time_taken_minutes,
          last_revised_at: row.last_revised_at,
          solved_at: row.solved_at,
        });
      }
      setQuestionStates(map);
    }

    if (activityRes.data) setDailyActivity(activityRes.data);
    if (profileRes.data) setProfile(profileRes.data);
    if (achievementsRes.data) setAchievements(achievementsRes.data.map(a => a.achievement_id));

    setLoadingData(false);
  }, [user]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const ensureProfile = async () => {
    if (!user) return;
    const { data } = await supabase.from('user_profiles').select('id').eq('id', user.id).maybeSingle();
    if (!data) {
      await supabase.from('user_profiles').insert({ id: user.id });
    }
  };

  const updateQuestion = async (qId: number, updates: Partial<QuestionState>) => {
    if (!user) return;
    await ensureProfile();

    const existing = questionStates.get(qId);
    const now = new Date().toISOString();

    const upsertData = {
      user_id: user.id,
      question_id: qId,
      solved: existing?.solved ?? false,
      starred: existing?.starred ?? false,
      marked_for_revision: existing?.marked_for_revision ?? false,
      notes: existing?.notes ?? '',
      time_taken_minutes: existing?.time_taken_minutes ?? null,
      last_revised_at: existing?.last_revised_at ?? null,
      solved_at: existing?.solved_at ?? null,
      updated_at: now,
      ...updates,
    };

    await supabase.from('question_progress').upsert(upsertData, { onConflict: 'user_id,question_id' });

    setQuestionStates(prev => {
      const next = new Map(prev);
      next.set(qId, { ...(existing ?? { question_id: qId, solved: false, starred: false, marked_for_revision: false, notes: '', time_taken_minutes: null, last_revised_at: null, solved_at: null }), ...updates });
      return next;
    });
  };

  const markSolved = async (qId: number, timeTaken?: number) => {
    if (!user) return;
    await ensureProfile();

    const question = QUESTIONS.find(q => q.id === qId);
    const xp = question ? (XP_PER_SOLVE[question.difficulty] ?? 20) : 20;
    const now = new Date().toISOString();
    const today = now.split('T')[0];

    await updateQuestion(qId, { solved: true, solved_at: now, time_taken_minutes: timeTaken ?? null });

    // Update daily activity
    const { data: existing } = await supabase.from('daily_activity').select('*').eq('user_id', user.id).eq('activity_date', today).maybeSingle();
    if (existing) {
      await supabase.from('daily_activity').update({ questions_solved: existing.questions_solved + 1, xp_earned: existing.xp_earned + xp, updated_at: now }).eq('id', existing.id);
    } else {
      await supabase.from('daily_activity').insert({ user_id: user.id, activity_date: today, questions_solved: 1, xp_earned: xp });
    }

    // Update streak and XP
    const { data: prof } = await supabase.from('user_profiles').select('*').eq('id', user.id).maybeSingle();
    if (prof) {
      const lastDate = prof.last_active_date;
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];

      let newStreak = prof.current_streak;
      if (lastDate === today) {
        // already counted today
      } else if (lastDate === yesterdayStr) {
        newStreak = prof.current_streak + 1;
      } else {
        newStreak = 1;
      }

      const newXp = prof.total_xp + xp;
      const newLevel = Math.floor(newXp / 200) + 1;

      await supabase.from('user_profiles').update({
        current_streak: newStreak,
        longest_streak: Math.max(prof.longest_streak, newStreak),
        total_xp: newXp,
        level: newLevel,
        last_active_date: today,
        updated_at: now,
      }).eq('id', user.id);

      setProfile(prev => prev ? { ...prev, current_streak: newStreak, longest_streak: Math.max(prev.longest_streak, newStreak), total_xp: newXp, level: newLevel, last_active_date: today } : prev);
    }

    // Check achievements
    await checkAchievements(qId);
    await fetchData();
  };

  const checkAchievements = async (latestQId: number) => {
    if (!user) return;
    const solvedCount = Array.from(questionStates.values()).filter(q => q.solved).length + 1;
    const toUnlock: string[] = [];

    if (solvedCount === 1) toUnlock.push('first_solve');
    if (solvedCount >= 10) toUnlock.push('solved_10');
    if (solvedCount >= 25) toUnlock.push('solved_25');
    if (solvedCount >= 50) toUnlock.push('solved_50');
    if (solvedCount >= 90) toUnlock.push('solved_90');

    const q = QUESTIONS.find(x => x.id === latestQId);
    if (q?.difficulty === 'Hard') {
      const hardSolved = Array.from(questionStates.values()).filter(s => {
        const qData = QUESTIONS.find(x => x.id === s.question_id);
        return s.solved && qData?.difficulty === 'Hard';
      }).length + 1;
      if (hardSolved >= 5) toUnlock.push('hard_solver');
    }

    const dpCat = ['dp', 'advanced-dp'];
    const dpIds = QUESTIONS.filter(q => dpCat.some(c => q.category.toLowerCase().includes('dp'))).map(q => q.id);
    const dpSolved = dpIds.every(id => questionStates.get(id)?.solved);
    if (dpSolved) toUnlock.push('dp_master');

    const graphIds = QUESTIONS.filter(q => q.category === 'Graph').map(q => q.id);
    const graphSolved = graphIds.every(id => questionStates.get(id)?.solved);
    if (graphSolved) toUnlock.push('graph_explorer');

    for (const id of toUnlock) {
      if (!achievements.includes(id)) {
        await supabase.from('user_achievements').upsert({ user_id: user.id, achievement_id: id }, { onConflict: 'user_id,achievement_id' });
        const ach = ACHIEVEMENTS.find(a => a.id === id);
        if (ach) {
          await supabase.from('user_profiles').update({ total_xp: (profile?.total_xp ?? 0) + ach.xpReward }).eq('id', user.id);
        }
      }
    }
  };

  return (
    <TrackerContext.Provider value={{ questionStates, dailyActivity, profile, achievements, todaySolved, totalSolved, loadingData, updateQuestion, markSolved, refreshData: fetchData }}>
      {children}
    </TrackerContext.Provider>
  );
}

export function useTracker() {
  const ctx = useContext(TrackerContext);
  if (!ctx) throw new Error('useTracker must be used within TrackerProvider');
  return ctx;
}
