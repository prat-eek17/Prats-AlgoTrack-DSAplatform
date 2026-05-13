import { useMemo, useState, useEffect } from 'react';
import { TrendingUp, BarChart2, Calendar, Target } from 'lucide-react';
import { useTracker } from '../context/TrackerContext';
import { QUESTIONS, CATEGORIES, TOTAL_QUESTIONS } from '../data/questions';

function BarChart({
  data,
  color = '#3b82f6',
  maxVal,
  animated = false,
}: {
  data: { label: string; value: number }[];
  color?: string;
  maxVal?: number;
  animated?: boolean;
}) {
  const [hovered, setHovered] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, [data]);

  const max = maxVal ?? Math.max(...data.map(d => d.value), 1);

  return (
    <div className="flex items-end gap-1.5 h-36 relative">
      {data.map((d, i) => {
        const heightPct = (d.value / max) * 100;
        const isHovered = hovered === i;
        return (
          <div
            key={i}
            className="flex flex-col items-center gap-1 flex-1 relative"
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
          >
            {isHovered && (
              <div className="absolute -top-9 left-1/2 -translate-x-1/2 bg-[#1a1a2e] border border-white/10 rounded-lg px-2.5 py-1.5 text-xs text-white whitespace-nowrap z-10 pointer-events-none shadow-xl">
                <span className="font-semibold">{d.value}</span>
                <span className="text-gray-400 ml-1">{d.value === 1 ? 'problem' : 'problems'}</span>
                <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-[#1a1a2e]" />
              </div>
            )}
            <div className="w-full flex items-end justify-center" style={{ height: '108px' }}>
              <div
                className="w-full rounded-t-sm"
                style={{
                  height: mounted ? `${heightPct > 0 ? Math.max(heightPct, 3) : 0}%` : '0%',
                  backgroundColor: isHovered ? '#ffffff' : color,
                  minHeight: 0,
                  opacity: hovered !== null && !isHovered ? 0.35 : 1,
                  transition: animated
                    ? `height 550ms cubic-bezier(0.34,1.56,0.64,1) ${i * 55}ms, background-color 150ms ease, opacity 150ms ease`
                    : 'height 300ms ease, background-color 150ms ease, opacity 150ms ease',
                }}
              />
            </div>
            <span className="text-[9px] text-gray-600 truncate w-full text-center">{d.label}</span>
          </div>
        );
      })}
    </div>
  );
}

function DonutChart({
  slices,
  size = 120,
}: {
  slices: { value: number; color: string; label: string }[];
  size?: number;
}) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 120);
    return () => clearTimeout(t);
  }, []);

  const total = slices.reduce((s, x) => s + x.value, 0);
  const cx = size / 2, cy = size / 2, r = size / 2 - 13, stroke = 20;
  const circumference = 2 * Math.PI * r;
  let offset = 0;

  return (
    <div className="flex items-center gap-6">
      <div className="relative flex-shrink-0">
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          <circle cx={cx} cy={cy} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
          {total > 0 && slices.map((s, i) => {
            const pct = s.value / total;
            const dash = mounted ? pct * circumference : 0;
            const el = (
              <circle
                key={i}
                cx={cx} cy={cy} r={r}
                fill="none"
                stroke={s.color}
                strokeWidth={stroke}
                strokeDasharray={`${dash} ${circumference - dash}`}
                strokeDashoffset={-offset * circumference}
                strokeLinecap="butt"
                style={{
                  transition: `stroke-dasharray 750ms cubic-bezier(0.34,1.2,0.64,1) ${i * 160}ms`,
                }}
              />
            );
            offset += pct;
            return el;
          })}
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center">
            <div className="text-lg font-bold text-white">{total}</div>
            <div className="text-[9px] text-gray-500 uppercase tracking-wide">solved</div>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 flex-1">
        {slices.map((s, i) => (
          <div key={i} className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: s.color }} />
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
              <span className="text-xs font-semibold text-white">{s.value}</span>
            </div>
            <div className="h-1 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full rounded-full"
                style={{
                  width: mounted && total > 0 ? `${(s.value / total) * 100}%` : '0%',
                  backgroundColor: s.color,
                  transition: `width 750ms cubic-bezier(0.34,1.2,0.64,1) ${i * 160}ms`,
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ActivityHeatmap({
  dailyActivity,
}: {
  dailyActivity: { activity_date: string; questions_solved: number }[];
}) {
  const days = useMemo(() => {
    const result = [];
    for (let i = 29; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().split('T')[0];
      const found = dailyActivity.find(a => a.activity_date === key);
      const count = found?.questions_solved ?? 0;
      result.push({
        date: key,
        count,
        label: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      });
    }
    return result;
  }, [dailyActivity]);

  const maxCount = Math.max(...days.map(d => d.count), 1);

  const getColor = (count: number) => {
    if (count === 0) return 'rgba(255,255,255,0.04)';
    const intensity = count / maxCount;
    if (intensity < 0.35) return '#1e3a5f';
    if (intensity < 0.65) return '#1d4ed8';
    return '#3b82f6';
  };

  return (
    <div>
      <div className="flex gap-1 flex-wrap">
        {days.map(day => (
          <div
            key={day.date}
            className="w-6 h-6 rounded-sm cursor-default transition-transform duration-150 hover:scale-110"
            style={{ backgroundColor: getColor(day.count) }}
            title={`${day.label}: ${day.count} ${day.count === 1 ? 'problem' : 'problems'}`}
          />
        ))}
      </div>
      <div className="flex items-center gap-1.5 mt-2.5">
        <span className="text-[10px] text-gray-700">Less</span>
        {[0, 0.3, 0.65, 1].map((v, i) => (
          <div
            key={i}
            className="w-3.5 h-3.5 rounded-sm"
            style={{ backgroundColor: getColor(Math.round(v * maxCount)) }}
          />
        ))}
        <span className="text-[10px] text-gray-700">More</span>
      </div>
    </div>
  );
}

export default function Analytics() {
  const { dailyActivity, questionStates, totalSolved, profile } = useTracker();
  const [chartView, setChartView] = useState<'daily' | 'weekly'>('daily');
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 40);
    return () => clearTimeout(t);
  }, []);

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

  const catCompletion = useMemo(() =>
    CATEGORIES.map(cat => ({
      ...cat,
      solved: cat.questionIds.filter(id => questionStates.get(id)?.solved).length,
      total: cat.questionIds.length,
      pct: Math.round(
        (cat.questionIds.filter(id => questionStates.get(id)?.solved).length /
          cat.questionIds.length) *
          100
      ),
    })).sort((a, b) => b.pct - a.pct),
    [questionStates]
  );

  const totalDaysActive = new Set(
    dailyActivity.filter(a => a.questions_solved > 0).map(a => a.activity_date)
  ).size;
  const avgPerDay = totalDaysActive > 0 ? (totalSolved / totalDaysActive).toFixed(1) : '0';
  const solvedPct = Math.round((totalSolved / TOTAL_QUESTIONS) * 100);

  const kpiItems = [
    {
      label: 'Problems Solved',
      value: totalSolved,
      sub: `of ${TOTAL_QUESTIONS} · ${solvedPct}%`,
      icon: Target,
      colorClass: 'text-emerald-400',
      accent: 'rgba(16,185,129,0.08)',
    },
    {
      label: 'Days Active',
      value: totalDaysActive,
      sub: 'all time',
      icon: Calendar,
      colorClass: 'text-blue-400',
      accent: 'rgba(59,130,246,0.08)',
    },
    {
      label: 'Avg / Active Day',
      value: avgPerDay,
      sub: 'problems solved',
      icon: TrendingUp,
      colorClass: 'text-amber-400',
      accent: 'rgba(245,158,11,0.08)',
    },
    {
      label: 'Total XP',
      value: profile?.total_xp ?? 0,
      sub: `Level ${profile?.level ?? 1}`,
      icon: BarChart2,
      colorClass: 'text-rose-400',
      accent: 'rgba(244,63,94,0.08)',
    },
  ];

  const streakStats = [
    { label: 'Current streak', value: profile?.current_streak ?? 0, colorClass: 'text-orange-400' },
    { label: 'Longest streak', value: profile?.longest_streak ?? 0, colorClass: 'text-amber-400' },
    { label: 'Active days', value: totalDaysActive, colorClass: 'text-blue-400' },
    { label: 'Avg per day', value: avgPerDay, colorClass: 'text-emerald-400' },
  ];

  return (
    <div className="p-6 space-y-5 max-w-6xl mx-auto">
      {/* Header */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(-6px)',
          transition: 'opacity 400ms ease, transform 400ms ease',
        }}
      >
        <h1 className="text-2xl font-bold text-white">Analytics</h1>
        <p className="text-gray-500 text-sm mt-0.5">Your coding journey in numbers</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiItems.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div
              key={item.label}
              className="relative overflow-hidden bg-white/5 border border-white/8 rounded-2xl p-4 group cursor-default hover:border-white/15 transition-all duration-300 hover:scale-[1.02]"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0)' : 'translateY(14px)',
                transition: `opacity 500ms ease ${idx * 75}ms, transform 500ms ease ${idx * 75}ms, border-color 200ms, scale 200ms`,
              }}
            >
              <div
                className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                style={{ background: item.accent }}
              />
              <div className="relative">
                <div className="flex items-center gap-2 mb-2">
                  <Icon size={14} className={item.colorClass} />
                  <span className="text-xs text-gray-500">{item.label}</span>
                </div>
                <div className="text-2xl font-bold text-white">{item.value}</div>
                <p className="text-xs text-gray-600 mt-0.5">{item.sub}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Activity Chart with view toggle */}
      <div
        className="bg-white/5 border border-white/8 rounded-2xl p-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 500ms ease 280ms',
        }}
      >
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-sm font-semibold text-white">Activity</h3>
          <div className="flex items-center bg-white/5 rounded-lg p-0.5 gap-0.5">
            <button
              onClick={() => setChartView('daily')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                chartView === 'daily'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-pressed={chartView === 'daily'}
            >
              7 Days
            </button>
            <button
              onClick={() => setChartView('weekly')}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all duration-200 ${
                chartView === 'weekly'
                  ? 'bg-white/10 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
              aria-pressed={chartView === 'weekly'}
            >
              4 Weeks
            </button>
          </div>
        </div>
        <BarChart
          data={chartView === 'daily' ? last7Days : last4Weeks}
          color={chartView === 'daily' ? '#3b82f6' : '#10b981'}
          animated
        />
      </div>

      {/* 30-day Heatmap */}
      <div
        className="bg-white/5 border border-white/8 rounded-2xl p-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 500ms ease 360ms',
        }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">30-Day Activity</h3>
        <ActivityHeatmap dailyActivity={dailyActivity} />
      </div>

      {/* Difficulty + Streak */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div
          className="bg-white/5 border border-white/8 rounded-2xl p-5"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 500ms ease 400ms',
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Difficulty Breakdown</h3>
          {totalSolved === 0 ? (
            <div className="py-8 text-center">
              <Target size={28} className="text-gray-700 mx-auto mb-2.5" />
              <p className="text-gray-600 text-sm">Solve problems to see breakdown</p>
            </div>
          ) : (
            <DonutChart slices={diffBreakdown} size={120} />
          )}
        </div>

        <div
          className="bg-white/5 border border-white/8 rounded-2xl p-5"
          style={{
            opacity: visible ? 1 : 0,
            transition: 'opacity 500ms ease 440ms',
          }}
        >
          <h3 className="text-sm font-semibold text-white mb-4">Streak Overview</h3>
          <div className="grid grid-cols-2 gap-3">
            {streakStats.map((stat, i) => (
              <div
                key={i}
                className="bg-white/4 rounded-xl p-3 text-center hover:bg-white/8 transition-colors duration-200 cursor-default"
              >
                <div className={`text-2xl font-bold ${stat.colorClass}`}>{stat.value}</div>
                <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Category Progress */}
      <div
        className="bg-white/5 border border-white/8 rounded-2xl p-5"
        style={{
          opacity: visible ? 1 : 0,
          transition: 'opacity 500ms ease 480ms',
        }}
      >
        <h3 className="text-sm font-semibold text-white mb-4">Category Completion</h3>
        <div className="space-y-3">
          {catCompletion.map((cat, i) => (
            <div key={cat.id} className="grid grid-cols-[140px_1fr_60px] items-center gap-4 group">
              <div className="flex items-center gap-2 min-w-0">
                <div
                  className="w-2 h-2 rounded-full flex-shrink-0"
                  style={{ backgroundColor: cat.color }}
                />
                <span className="text-xs text-gray-400 truncate group-hover:text-gray-200 transition-colors duration-200">
                  {cat.name}
                </span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full"
                  style={{
                    width: visible ? `${cat.pct}%` : '0%',
                    backgroundColor: cat.color,
                    transition: `width 700ms cubic-bezier(0.4,0,0.2,1) ${500 + i * 35}ms`,
                  }}
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
