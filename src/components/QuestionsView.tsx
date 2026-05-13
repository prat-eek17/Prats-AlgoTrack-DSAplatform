import { useState, useMemo } from 'react';
import { Search, Filter, ChevronDown, ChevronRight } from 'lucide-react';
import { CATEGORIES, QUESTIONS, getQuestionsByCategory } from '../data/questions';
import { useTracker } from '../context/TrackerContext';
import QuestionCard from './QuestionCard';

type FilterDiff = 'All' | 'Easy' | 'Medium' | 'Hard';
type FilterStatus = 'All' | 'Solved' | 'Unsolved';

export default function QuestionsView() {
  const { questionStates } = useTracker();
  const [search, setSearch] = useState('');
  const [filterDiff, setFilterDiff] = useState<FilterDiff>('All');
  const [filterStatus, setFilterStatus] = useState<FilterStatus>('All');
  const [activeCat, setActiveCat] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let qs = activeCat ? getQuestionsByCategory(activeCat) : QUESTIONS;

    if (search.trim()) {
      const s = search.toLowerCase();
      qs = qs.filter(q =>
        q.title.toLowerCase().includes(s) ||
        q.id.toString().includes(s) ||
        q.tags.some(t => t.toLowerCase().includes(s))
      );
    }
    if (filterDiff !== 'All') qs = qs.filter(q => q.difficulty === filterDiff);
    if (filterStatus === 'Solved') qs = qs.filter(q => questionStates.get(q.id)?.solved);
    if (filterStatus === 'Unsolved') qs = qs.filter(q => !questionStates.get(q.id)?.solved);

    return qs;
  }, [search, filterDiff, filterStatus, activeCat, questionStates]);

  const categoryProgress = useMemo(() =>
    CATEGORIES.map(cat => ({
      ...cat,
      solved: cat.questionIds.filter(id => questionStates.get(id)?.solved).length,
    })),
    [questionStates]
  );

  return (
    <div className="flex flex-col lg:flex-row h-full">
      {/* Left sidebar - categories */}
      <div className="w-full lg:w-60 flex-shrink-0 border-b lg:border-b-0 lg:border-r border-white/5 p-3 bg-[#0d0d14]">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider px-2 mb-2">Categories</p>
        <div className="space-y-0.5">
          <button
            onClick={() => setActiveCat(null)}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
              activeCat === null ? 'bg-white/8 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
            }`}
          >
            <span>All Problems</span>
            <span className="text-xs text-gray-600">{QUESTIONS.length}</span>
          </button>
          {categoryProgress.map(cat => (
            <button
              key={cat.id}
              onClick={() => setActiveCat(activeCat === cat.id ? null : cat.id)}
              className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-sm transition-all ${
                activeCat === cat.id ? 'bg-white/8 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/4'
              }`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
                <span className="truncate text-xs">{cat.name}</span>
              </div>
              <span className={`text-xs ml-1 flex-shrink-0 ${cat.solved === cat.questionIds.length ? 'text-emerald-400' : 'text-gray-600'}`}>
                {cat.solved}/{cat.questionIds.length}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="flex-1 min-w-0 p-5 overflow-y-auto">
        {/* Search + Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
            <input
              type="text"
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search problems, tags..."
              className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/15 transition-all"
            />
          </div>
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm border transition-all ${
              showFilters ? 'bg-white/8 border-white/15 text-white' : 'bg-white/4 border-white/8 text-gray-400 hover:text-white'
            }`}
          >
            <Filter size={14} />
            Filters
            <ChevronDown size={12} className={`transition-transform ${showFilters ? 'rotate-180' : ''}`} />
          </button>
        </div>

        {showFilters && (
          <div className="flex flex-wrap gap-2 mb-4 p-3 bg-white/3 rounded-xl border border-white/5">
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 mr-1">Difficulty:</span>
              {(['All', 'Easy', 'Medium', 'Hard'] as FilterDiff[]).map(d => (
                <button
                  key={d}
                  onClick={() => setFilterDiff(d)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    filterDiff === d
                      ? d === 'Easy' ? 'bg-emerald-500/20 border-emerald-500/30 text-emerald-400'
                        : d === 'Medium' ? 'bg-amber-500/20 border-amber-500/30 text-amber-400'
                        : d === 'Hard' ? 'bg-red-500/20 border-red-500/30 text-red-400'
                        : 'bg-white/10 border-white/15 text-white'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <div className="flex items-center gap-1">
              <span className="text-xs text-gray-500 mr-1">Status:</span>
              {(['All', 'Solved', 'Unsolved'] as FilterStatus[]).map(s => (
                <button
                  key={s}
                  onClick={() => setFilterStatus(s)}
                  className={`text-xs px-2.5 py-1 rounded-lg border transition-all ${
                    filterStatus === s
                      ? 'bg-white/10 border-white/15 text-white'
                      : 'bg-white/4 border-white/8 text-gray-500 hover:text-gray-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-semibold text-white">
            {activeCat ? CATEGORIES.find(c => c.id === activeCat)?.name : 'All Problems'}
            <span className="text-gray-600 font-normal text-sm ml-2">({filtered.length})</span>
          </h2>
          <div className="flex items-center gap-2 text-xs text-gray-600">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            {filtered.filter(q => questionStates.get(q.id)?.solved).length} solved
          </div>
        </div>

        {/* Question list - group by category if showing all */}
        {activeCat ? (
          <div className="space-y-2">
            {filtered.map(q => <QuestionCard key={q.id} question={q} />)}
          </div>
        ) : (
          <div className="space-y-6">
            {CATEGORIES.map(cat => {
              const catQs = filtered.filter(q => q.category === cat.name);
              if (catQs.length === 0) return null;
              const solvedCount = catQs.filter(q => questionStates.get(q.id)?.solved).length;
              return (
                <CategorySection
                  key={cat.id}
                  cat={cat}
                  questions={catQs}
                  solvedCount={solvedCount}
                />
              );
            })}
            {filtered.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No problems match your filters.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function CategorySection({ cat, questions, solvedCount }: {
  cat: { name: string; color: string }; questions: ReturnType<typeof getQuestionsByCategory>; solvedCount: number;
}) {
  const [open, setOpen] = useState(true);
  const pct = Math.round((solvedCount / questions.length) * 100);

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center gap-3 mb-2 group"
      >
        {open ? <ChevronDown size={14} className="text-gray-500" /> : <ChevronRight size={14} className="text-gray-500" />}
        <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ backgroundColor: cat.color }} />
        <span className="text-sm font-semibold text-gray-200">{cat.name}</span>
        <div className="flex-1 h-0.5 bg-white/5 rounded-full overflow-hidden mx-2">
          <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, backgroundColor: cat.color }} />
        </div>
        <span className="text-xs text-gray-500">{solvedCount}/{questions.length}</span>
      </button>
      {open && (
        <div className="space-y-1.5 pl-7">
          {questions.map(q => <QuestionCard key={q.id} question={q} />)}
        </div>
      )}
    </div>
  );
}
