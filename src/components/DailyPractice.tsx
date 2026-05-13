import { useMemo, useState } from 'react';
import { Flame, Shuffle, ExternalLink, CheckCircle2, Target, Trophy, Zap } from 'lucide-react';
import { QUESTIONS, CATEGORIES, getLeetCodeUrl, ACHIEVEMENTS } from '../data/questions';
import { useTracker } from '../context/TrackerContext';
import QuestionCard from './QuestionCard';

export default function DailyPractice() {
  const { questionStates, profile, todaySolved, achievements, totalSolved } = useTracker();
  const [refreshKey, setRefreshKey] = useState(0);

  const dailyGoal = profile?.daily_goal ?? 1;
  const streak = profile?.current_streak ?? 0;
  const xp = profile?.total_xp ?? 0;
  const level = profile?.level ?? 1;
  const xpProgress = Math.round(((xp % 200) / 200) * 100);

  const suggestions = useMemo(() => {
    const unsolved = QUESTIONS.filter(q => !questionStates.get(q.id)?.solved);
    if (unsolved.length === 0) return [];

    // Prioritize weak categories
    const categoryScores = CATEGORIES.map(cat => {
      const total = cat.questionIds.length;
      const solved = cat.questionIds.filter(id => questionStates.get(id)?.solved).length;
      return { ...cat, score: solved / total };
    }).sort((a, b) => a.score - b.score);

    const weakCategoryIds = new Set(categoryScores.slice(0, 3).flatMap(c => c.questionIds));

    const seedDate = new Date().toDateString() + refreshKey;
    const rng = (() => {
      let seed = seedDate.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
      return () => { seed = (seed * 16807 + refreshKey * 1000) % 2147483647; return seed / 2147483647; };
    })();

    const weakUnsolved = unsolved.filter(q => weakCategoryIds.has(q.id));
    const otherUnsolved = unsolved.filter(q => !weakCategoryIds.has(q.id));

    const pool = [...weakUnsolved, ...otherUnsolved];
    const shuffled = [...pool].sort(() => rng() - 0.5);
    return shuffled.slice(0, 5);
  }, [questionStates, refreshKey]);

  const todayActivity = useMemo(() => {
    const today = new Date().toISOString().split('T')[0];
    return { solved: todaySolved, goal: dailyGoal };
  }, [todaySolved, dailyGoal]);

  const nextAchievements = ACHIEVEMENTS.filter(a => !achievements.includes(a.id)).slice(0, 3);

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Practice</h1>
        <p className="text-gray-500 text-sm mt-0.5">Stay consistent, stay sharp</p>
      </div>

      {/* Streak & Goal row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {/* Streak card */}
        <div className="bg-gradient-to-br from-orange-600/15 to-red-600/10 border border-orange-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Flame size={18} className="text-orange-400" />
            <span className="text-sm font-medium text-gray-300">Current Streak</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{streak}</div>
          <p className="text-xs text-gray-500">days in a row</p>
          {streak === 0 && (
            <p className="text-xs text-orange-400 mt-2">Solve a problem today to start your streak!</p>
          )}
        </div>

        {/* Daily goal */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Target size={18} className="text-blue-400" />
            <span className="text-sm font-medium text-gray-300">Today's Goal</span>
          </div>
          <div className="text-4xl font-bold text-white mb-2">{todayActivity.solved}<span className="text-gray-600 text-xl">/{todayActivity.goal}</span></div>
          <div className="h-2 bg-white/5 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-700 ${todayActivity.solved >= todayActivity.goal ? 'bg-emerald-500' : 'bg-blue-500'}`}
              style={{ width: `${Math.min(100, (todayActivity.solved / todayActivity.goal) * 100)}%` }}
            />
          </div>
          <p className="text-xs text-gray-600 mt-1.5">
            {todayActivity.solved >= todayActivity.goal ? 'Goal achieved!' : `${todayActivity.goal - todayActivity.solved} more to go`}
          </p>
        </div>

        {/* XP */}
        <div className="bg-gradient-to-br from-amber-600/15 to-yellow-600/10 border border-amber-500/15 rounded-2xl p-5">
          <div className="flex items-center gap-2 mb-3">
            <Zap size={18} className="text-amber-400" />
            <span className="text-sm font-medium text-gray-300">Experience</span>
          </div>
          <div className="text-4xl font-bold text-white mb-1">{xp}</div>
          <div className="h-1.5 bg-white/5 rounded-full overflow-hidden mb-1">
            <div className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" style={{ width: `${xpProgress}%` }} />
          </div>
          <p className="text-xs text-gray-500">Level {level} · {200 - (xp % 200)} XP to next</p>
        </div>
      </div>

      {/* Today's suggestions */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            Suggested for Today
          </h2>
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-gray-300 bg-white/4 border border-white/8 rounded-lg px-3 py-1.5 transition-all hover:bg-white/8"
          >
            <Shuffle size={12} />
            Shuffle
          </button>
        </div>

        {suggestions.length === 0 ? (
          <div className="bg-white/5 border border-white/8 rounded-2xl p-8 text-center">
            <Trophy size={32} className="text-amber-400 mx-auto mb-3" />
            <p className="text-white font-semibold mb-1">All Done!</p>
            <p className="text-gray-500 text-sm">You've solved all available problems. Amazing work!</p>
          </div>
        ) : (
          <div className="space-y-2">
            {suggestions.map(q => <QuestionCard key={q.id} question={q} />)}
          </div>
        )}
      </div>

      {/* Next achievements */}
      {nextAchievements.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-white mb-3 flex items-center gap-2">
            <Trophy size={14} className="text-gray-500" />
            Next Achievements
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {nextAchievements.map(a => (
              <div key={a.id} className="bg-white/4 border border-white/8 rounded-xl p-4 flex items-start gap-3">
                <span className="text-2xl">{a.icon}</span>
                <div>
                  <p className="text-sm font-medium text-gray-200">{a.title}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{a.description}</p>
                  <p className="text-xs text-amber-400 mt-1">+{a.xpReward} XP</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick links */}
      <div className="bg-white/4 border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-3">Quick Open on LeetCode</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
          {[
            { label: 'Random Easy', url: 'https://leetcode.com/problemset/all/?difficulty=EASY', diff: 'Easy' },
            { label: 'Random Medium', url: 'https://leetcode.com/problemset/all/?difficulty=MEDIUM', diff: 'Medium' },
            { label: 'Random Hard', url: 'https://leetcode.com/problemset/all/?difficulty=HARD', diff: 'Hard' },
            { label: 'Daily Challenge', url: 'https://leetcode.com/problemset/all/?page=1', diff: null },
            { label: 'Explore DP', url: 'https://leetcode.com/tag/dynamic-programming/', diff: null },
            { label: 'Explore Graphs', url: 'https://leetcode.com/tag/graph/', diff: null },
          ].map(item => (
            <a
              key={item.label}
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-400 hover:text-white hover:bg-white/8 hover:border-white/12 transition-all"
            >
              <ExternalLink size={12} />
              {item.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
