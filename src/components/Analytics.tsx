import { useMemo } from 'react';
import { TrendingUp, BarChart2, Calendar, Target } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { QUESTIONS, CATEGORIES, TOTAL_QUESTIONS } from '../data/questions';

function BarChart({ data, color = '#3b82f6', maxVal }: { data: { label: string; value: number }[]; color?: string; maxVal?: number }) {
  const max = maxVal ?? Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1 h-28">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full flex items-end justify-center" style={{ height: '88px' }}>
            <div
              className="w-full rounded-t-sm transition-all duration-700 opacity-80 hover:opacity-100"
              style={{ height: `${(d.value / max) * 88}px`, backgroundColor: color, minHeight: d.value > 0 ? 4 : 0 }}
              title={`${d.label}: ${d.value}`}
            />
          </div>
          <span className="text-[9px] text-gray-600 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ slices, size = 120 }: { slices: { value: number; color: string; label: string }[]; size?: number }) {
  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 12, stroke = 18;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-5">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {total === 0 ? null : slices.map((s, i) => {
          const pct = s.value / total;
          const dash = pct * circumference;
          const el = (
            <circle key={i} cx={cx} cy={cy} r={r} fill="none"
              stroke={s.color} strokeWidth={stroke}
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              strokeLinecap="butt"
            />
          );
          offset += pct;
          return el;
        })}
      </svg>
      <div className="space-y-1.5">
        {slices.map((s, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
            <span className="text-xs text-gray-400">{s.label}</span>
            <span className="text-xs font-semibold text-white ml-auto">{s.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Analytics() {
  const { dailyActivity, questionStates, totalSolved, profile } = useTracker();

  // Last 7 days activity
  const last7Days = useMemo(() => {
    const result = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const label = d.toLocaleDateString('en-US', { weekday: 'short' });
      const found = dailyActivity.find(a => a.activity_date === key);
      result.push({ label, value: found?.questions_solved ?? 0 });
    }
    return result;
  }, [dailyActivity]);

  // Last 4 weeks
  const last4Weeks = useMemo(() => {
    const result = [];
    for (let i = 3; i >= 0; i--) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - weekStart.getDay() - i * 7);
      let count = 0;
      for (let d = 0; d < 7; d++) {
        const day = new Date(weekStart);
        day.setDate(weekStart.getDate() + d);
        const key = day.toISOString().split('T')[0];
        const found = dailyActivity.find(a => a.activity_date === key);
        count += found?.questions_solved ?? 0;
      }
      result.push({ label: `W${4 - i}`, value: count });
    }
    return result;
  }, [dailyActivity]);

  // Difficulty breakdown
  const diffBreakdown = useMemo(() => {
    let easy = 0, medium = 0, hard = 0;
    for (const q of QUESTIONS) {
      if (!questionStates.get(q.id)?.solved) continue;
      if (q.difficulty === 'Easy') easy++;
      else if (q.difficulty === 'Medium') medium++;
      else hard++;
    }
    return [
      { value: easy, color: '#10b981', label: 'Easy' },
      { value: medium, color: '#f59e0b', label: 'Medium' },
      { value: hard, color: '#ef4444', label: 'Hard' },
    ];
  }, [questionStates]);

  // Category completion
  const catCompletion = useMemo(() =>
    CATEGORIES.map(cat => ({
      ...cat,
      solved: cat.questionIds.filter(id => questionStates.get(id)?.solved).length,
      total: cat.questionIds.length,
      pct: Math.round((cat.questionIds.filter(id => questionStates.get(id)?.solved).length / cat.questionIds.length) * 100),
    })).sort((a, b) => b.pct - a.pct),
    [questionStates]
  );

  const totalDaysActive = new Set(dailyActivity.filter(a => a.questions_solved > 0).map(a => a.activity_date)).size;
  const avgPerDay = totalDaysActive > 0 ? (totalSolved / totalDaysActive).toFixed(1) : '0';
  const totalXp = dailyActivity.reduce((s, a) => s + a.xp_earned, 0);

  return (
    <div className="p-6 space-y-6 max-w-6xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your coding journey in numbers</p>
      </div>

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Problems Solved', value: totalSolved, sub: `of ${TOTAL_QUESTIONS}`, icon: Target, color: 'text-emerald-400' },
          { label: 'Days Active', value: totalDaysActive, sub: 'all time', icon: Calendar, color: 'text-blue-400' },
          { label: 'Avg / Active Day', value: avgPerDay, sub: 'problems', icon: TrendingUp, color: 'text-amber-400' },
          { label: 'Total XP', value: profile?.total_xp ?? 0, sub: `Level ${profile?.level ?? 1}`, icon: BarChart2, color: 'text-purple-400' },
        ].map(item => {
          const Icon = item.icon;
          return (
            <div key={item.label} className="bg-white/5 border border-white/8 rounded-2xl p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={14} className={item.color} />
                <span className="text-xs text-gray-500">{item.label}</span>
              </div>
              <div className="text-2xl font-bold text-white">{item.value}</div>
              <p className="text-xs text-gray-600">{item.sub}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Last 7 Days</h3>
          <BarChart data={last7Days} color="#3b82f6" />
        </div>
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Weekly Breakdown</h3>
          <BarChart data={last4Weeks} color="#10b981" />
        </div>
      </div>

      {/* Difficulty + Category */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Difficulty Breakdown</h3>
          {totalSolved === 0 ? (
            <p className="text-gray-600 text-sm text-center py-6">Solve problems to see breakdown</p>
          ) : (
            <DonutChart slices={diffBreakdown} size={130} />
          )}
        </div>
        <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
          <h3 className="text-sm font-semibold text-white mb-4">Streak Timeline</h3>
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-white/4 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-orange-400">{profile?.current_streak ?? 0}</div>
              <p className="text-xs text-gray-500 mt-1">Current streak</p>
            </div>
            <div className="bg-white/4 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-amber-400">{profile?.longest_streak ?? 0}</div>
              <p className="text-xs text-gray-500 mt-1">Longest streak</p>
            </div>
            <div className="bg-white/4 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-blue-400">{totalDaysActive}</div>
              <p className="text-xs text-gray-500 mt-1">Active days</p>
            </div>
            <div className="bg-white/4 rounded-xl p-3 text-center">
              <div className="text-2xl font-bold text-emerald-400">{avgPerDay}</div>
              <p className="text-xs text-gray-500 mt-1">Avg per day</p>
            </div>
          </div>
        </div>
      </div>

      {/* Category progress table */}
      <div className="bg-white/5 border border-white/8 rounded-2xl p-5">
        <h3 className="text-sm font-semibold text-white mb-4">Category Completion</h3>
        <div className="space-y-3">
          {catCompletion.map(cat => (
            <div key={cat.id} className="grid grid-cols-[140px_1fr_60px] items-center gap-4">
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="text-xs text-gray-400 truncate">{cat.name}</span>
              </div>
              <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${cat.pct}%`, backgroundColor: cat.color }}
                />
              </div>
              <div className="text-right">
                <span className="text-xs font-semibold text-white">{cat.solved}</span>
                <span className="text-xs text-gray-600">/{cat.total}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
