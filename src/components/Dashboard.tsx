import { useMemo } from 'react';
import {
  Flame, Trophy, Target, TrendingUp, Star,
  CheckCircle2, Clock, Zap, Award
} from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { TOTAL_QUESTIONS, MOTIVATIONAL_QUOTES, CATEGORIES, QUESTIONS, ACHIEVEMENTS } from '../data/questions';

function CircularProgress({ value, size = 80, stroke = 6, color = '#3b82f6', bg = 'rgba(255,255,255,0.05)' }: {
  value: number; size?: number; stroke?: number; color?: string; bg?: string;
}) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const offset = circ - (value / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={bg} strokeWidth={stroke} />
      <circle
        cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color}
        strokeWidth={stroke} strokeDasharray={circ} strokeDashoffset={offset}
        strokeLinecap="round" style={{ transition: 'stroke-dashoffset 1s ease' }}
      />
    </svg>
  );
}

function StatCard({ icon: Icon, label, value, sub, color, gradient }: {
  icon: typeof Flame; label: string; value: string | number;
  sub?: string; color: string; gradient: string;
}) {
  return (
    <div className="bg-white/5 backdrop-blur border border-white/8 rounded-2xl p-5 hover:bg-white/8 transition-all hover:border-white/12 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center`}>
          <Icon size={18} className="text-white" />
        </div>
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-white/5 ${color}`}>{label}</span>
      </div>
      <div className="text-3xl font-bold text-white mb-1 tabular-nums">{value}</div>
      {sub && <p className="text-xs text-gray-500">{sub}</p>}
    </div>
  );
}

function HeatmapCalendar({ activity }: { activity: { activity_date: string; questions_solved: number }[] }) {
  const weeks = useMemo(() => {
    const actMap = new Map<string, number>();
    for (const a of activity) actMap.set(a.activity_date, a.questions_solved);

    const today = new Date();
    const cells: { date: string; count: number; isToday: boolean }[] = [];

    for (let i = 364; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const key = d.toISOString().split('T')[0];
      cells.push({ date: key, count: actMap.get(key) ?? 0, isToday: i === 0 });
    }

    const weeks: typeof cells[] = [];
    const startPad = cells[0] ? new Date(cells[0].date).getDay() : 0;
    const padded = [...Array(startPad).fill(null), ...cells];
    for (let i = 0; i < padded.length; i += 7) weeks.push(padded.slice(i, i + 7) as typeof cells);
    return weeks;
  }, [activity]);

  const getColor = (count: number, isToday: boolean) => {
    if (isToday && count === 0) return 'bg-blue-500/20 ring-1 ring-blue-500/50';
    if (count === 0) return 'bg-white/5';
    if (count === 1) return 'bg-emerald-600/40';
    if (count === 2) return 'bg-emerald-500/60';
    if (count >= 3) return 'bg-emerald-400/80';
    return 'bg-white/5';
  };

  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const days = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
      <h3 className="text-sm font-semibold text-white mb-4">Activity Heatmap</h3>
      <div className="overflow-x-auto">
        <div className="flex gap-1 min-w-max">
          <div className="flex flex-col gap-1 mr-1">
            {days.map((d, i) => (
              <div key={i} className="h-3 w-3 text-[9px] text-gray-600 flex items-center justify-center">{d}</div>
            ))}
          </div>
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-1">
              {week.map((cell, di) =>
                cell ? (
                  <div
                    key={di}
                    title={`${cell.date}: ${cell.count} solved`}
                    className={`w-3 h-3 rounded-sm ${getColor(cell.count, cell.isToday)} transition-colors`}
                  />
                ) : <div key={di} className="w-3 h-3" />
              )}
            </div>
          ))}
        </div>
        <div className="flex items-center gap-3 mt-3">
          <span className="text-xs text-gray-600">Less</span>
          {[0, 1, 2, 3].map(i => (
            <div key={i} className={`w-3 h-3 rounded-sm ${['bg-white/5', 'bg-emerald-600/40', 'bg-emerald-500/60', 'bg-emerald-400/80'][i]}`} />
          ))}
          <span className="text-xs text-gray-600">More</span>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { profile, totalSolved, todaySolved, dailyActivity, achievements, questionStates } = useTracker();

  const progressPct = Math.round((totalSolved / TOTAL_QUESTIONS) * 100);
  const dailyGoal = profile?.daily_goal ?? 1;
  const dailyPct = Math.min(100, (todaySolved / dailyGoal) * 100);

  const quote = useMemo(() => MOTIVATIONAL_QUOTES[new Date().getDay() % MOTIVATIONAL_QUOTES.length], []);

  const categoryProgress = useMemo(() =>
    CATEGORIES.map(cat => {
      const solved = cat.questionIds.filter(id => questionStates.get(id)?.solved).length;
      return { ...cat, solved, total: cat.questionIds.length, pct: Math.round((solved / cat.questionIds.length) * 100) };
    }),
    [questionStates]
  );

  const difficultyCounts = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    let solvedEasy = 0, solvedMedium = 0, solvedHard = 0;
    for (const q of QUESTIONS) {
      if (q.difficulty === 'Easy') { easy++; if (questionStates.get(q.id)?.solved) solvedEasy++; }
      else if (q.difficulty === 'Medium') { medium++; if (questionStates.get(q.id)?.solved) solvedMedium++; }
      else { hard++; if (questionStates.get(q.id)?.solved) solvedHard++; }
    }
    return { easy, medium, hard, solvedEasy, solvedMedium, solvedHard };
  }, [questionStates]);

  const recentSolves = useMemo(() => {
    const solved: { id: number; title: string; difficulty: string; solved_at: string }[] = [];
    for (const [id, state] of questionStates) {
      if (state.solved && state.solved_at) {
        const q = QUESTIONS.find(x => x.id === id);
        if (q) solved.push({ id, title: q.title, difficulty: q.difficulty, solved_at: state.solved_at });
      }
    }
    return solved.sort((a, b) => new Date(b.solved_at).getTime() - new Date(a.solved_at).getTime()).slice(0, 5);
  }, [questionStates]);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </p>
        </div>
        {todaySolved >= dailyGoal ? (
          <div className="flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-xl px-4 py-2.5">
            <CheckCircle2 size={16} className="text-emerald-400" />
            <span className="text-sm font-medium text-emerald-300">Daily goal achieved!</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 bg-orange-500/10 border border-orange-500/20 rounded-xl px-4 py-2.5">
            <Flame size={16} className="text-orange-400" />
            <span className="text-sm font-medium text-orange-300">Solve {dailyGoal - todaySolved} more today</span>
          </div>
        )}
      </div>

      {/* Quote */}
      <div className="bg-gradient-to-r from-blue-600/10 to-emerald-600/10 border border-white/8 rounded-2xl p-5 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-2xl" />
        <p className="text-white font-medium mb-1">"{quote.quote}"</p>
        <p className="text-gray-500 text-sm">— {quote.author}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={CheckCircle2} label="Solved" value={totalSolved} sub={`of ${TOTAL_QUESTIONS} total`} color="text-emerald-400" gradient="from-emerald-600 to-teal-600" />
        <StatCard icon={Flame} label="Streak" value={`${profile?.current_streak ?? 0}d`} sub={`Best: ${profile?.longest_streak ?? 0} days`} color="text-orange-400" gradient="from-orange-500 to-red-600" />
        <StatCard icon={Trophy} label="Longest" value={`${profile?.longest_streak ?? 0}d`} sub="personal best" color="text-amber-400" gradient="from-amber-500 to-orange-500" />
        <StatCard icon={Zap} label="XP" value={profile?.total_xp ?? 0} sub={`Level ${profile?.level ?? 1}`} color="text-blue-400" gradient="from-blue-600 to-cyan-600" />
      </div>

      {/* Progress row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Overall */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5 flex items-center gap-5">
          <div className="relative">
            <CircularProgress value={progressPct} size={88} stroke={7} color="#3b82f6" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{progressPct}%</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Overall Progress</p>
            <p className="text-2xl font-bold text-white">{totalSolved}<span className="text-gray-500 text-base font-normal">/{TOTAL_QUESTIONS}</span></p>
            <p className="text-xs text-gray-600 mt-0.5">{TOTAL_QUESTIONS - totalSolved} remaining</p>
          </div>
        </div>

        {/* Daily */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5 flex items-center gap-5">
          <div className="relative">
            <CircularProgress value={dailyPct} size={88} stroke={7} color={dailyPct >= 100 ? '#10b981' : '#f59e0b'} />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-lg font-bold text-white">{todaySolved}</span>
            </div>
          </div>
          <div>
            <p className="text-xs text-gray-500 mb-1">Today's Goal</p>
            <p className="text-2xl font-bold text-white">{todaySolved}<span className="text-gray-500 text-base font-normal">/{dailyGoal}</span></p>
            <p className="text-xs text-gray-600 mt-0.5">{dailyPct >= 100 ? 'Goal complete!' : 'Keep going!'}</p>
          </div>
        </div>

        {/* Difficulty */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <p className="text-xs text-gray-500 mb-3">By Difficulty</p>
          <div className="space-y-2.5">
            {[
              { label: 'Easy', solved: difficultyCounts.solvedEasy, total: difficultyCounts.easy, color: 'bg-emerald-500' },
              { label: 'Medium', solved: difficultyCounts.solvedMedium, total: difficultyCounts.medium, color: 'bg-amber-500' },
              { label: 'Hard', solved: difficultyCounts.solvedHard, total: difficultyCounts.hard, color: 'bg-red-500' },
            ].map(d => (
              <div key={d.label}>
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">{d.label}</span>
                  <span className="text-gray-500">{d.solved}/{d.total}</span>
                </div>
                <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${d.color} rounded-full transition-all duration-700`}
                    style={{ width: `${(d.solved / d.total) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Heatmap */}
      <HeatmapCalendar activity={dailyActivity} />

      {/* Category Grid */}
      <div>
        <h3 className="text-sm font-semibold text-white mb-3">Category Progress</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {categoryProgress.map(cat => (
            <div key={cat.id} className="bg-white/5 border border-white/8 rounded-xl p-3 hover:bg-white/8 transition-all">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-400 truncate font-medium">{cat.name}</span>
                <span className="text-xs text-gray-600">{cat.pct}%</span>
              </div>
              <div className="h-1 bg-white/5 rounded-full overflow-hidden mb-1.5">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                />
              </div>
              <p className="text-xs text-gray-600">{cat.solved}/{cat.total}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Recent */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Clock size={14} className="text-gray-500" /> Recent Solves
          </h3>
          {recentSolves.length === 0 ? (
            <p className="text-sm text-gray-600 text-center py-4">No solves yet — start coding!</p>
          ) : (
            <div className="space-y-2">
              {recentSolves.map(r => (
                <div key={r.id} className="flex items-center gap-3 py-1.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />
                  <span className="text-sm text-gray-300 flex-1 truncate">#{r.id} {r.title}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${
                    r.difficulty === 'Easy' ? 'bg-emerald-500/15 text-emerald-400' :
                    r.difficulty === 'Medium' ? 'bg-amber-500/15 text-amber-400' :
                    'bg-red-500/15 text-red-400'
                  }`}>{r.difficulty}</span>
                  <span className="text-xs text-gray-600">{new Date(r.solved_at).toLocaleDateString()}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Achievements */}
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-3 flex items-center gap-2">
            <Award size={14} className="text-gray-500" /> Achievements
          </h3>
          <div className="grid grid-cols-3 gap-2">
            {ACHIEVEMENTS.map(a => {
              const unlocked = achievements.includes(a.id);
              return (
                <div
                  key={a.id}
                  title={a.description}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl border transition-all ${
                    unlocked
                      ? 'bg-white/8 border-white/10 hover:bg-white/12'
                      : 'bg-white/2 border-white/5 opacity-40'
                  }`}
                >
                  <span className="text-xl">{a.icon}</span>
                  <span className="text-[9px] text-gray-400 text-center leading-tight">{a.title}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
