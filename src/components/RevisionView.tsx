import { useMemo, useState } from 'react';
import { RefreshCw, Star, BookOpen, AlertTriangle, Search } from 'lucide-react';
import { QUESTIONS } from '../data/questions';
import { useTracker } from '../context/TrackerContext';
import QuestionCard from './QuestionCard';

type Tab = 'revision' | 'starred' | 'notes';

export default function RevisionView() {
  const { questionStates } = useTracker();
  const [tab, setTab] = useState<Tab>('revision');
  const [search, setSearch] = useState('');

  const revisionList = useMemo(() =>
    QUESTIONS.filter(q => {
      const s = questionStates.get(q.id);
      return s?.marked_for_revision;
    }),
    [questionStates]
  );

  const starredList = useMemo(() =>
    QUESTIONS.filter(q => {
      const s = questionStates.get(q.id);
      return s?.starred;
    }),
    [questionStates]
  );

  const withNotes = useMemo(() =>
    QUESTIONS.filter(q => {
      const s = questionStates.get(q.id);
      return s?.notes && s.notes.trim().length > 0;
    }),
    [questionStates]
  );

  const filtered = useMemo(() => {
    const base = tab === 'revision' ? revisionList : tab === 'starred' ? starredList : withNotes;
    if (!search.trim()) return base;
    const s = search.toLowerCase();
    return base.filter(q => q.title.toLowerCase().includes(s) || q.id.toString().includes(s));
  }, [tab, revisionList, starredList, withNotes, search]);

  const TABS: { id: Tab; label: string; icon: typeof RefreshCw; count: number }[] = [
    { id: 'revision', label: 'For Revision', icon: RefreshCw, count: revisionList.length },
    { id: 'starred', label: 'Starred', icon: Star, count: starredList.length },
    { id: 'notes', label: 'With Notes', icon: BookOpen, count: withNotes.length },
  ];

  return (
    <div className="p-6 space-y-5 max-w-4xl mx-auto">
      <div>
        <h1 className="text-2xl font-bold text-white">Revision</h1>
        <p className="text-gray-500 text-sm mt-0.5">Review marked problems and your notes</p>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-white/4 border border-white/8 rounded-xl p-1">
        {TABS.map(t => {
          const Icon = t.icon;
          return (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-lg text-sm font-medium transition-all ${
                tab === t.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Icon size={13} />
              {t.label}
              <span className={`text-xs rounded-full px-1.5 py-0 ${tab === t.id ? 'bg-white/15 text-white' : 'bg-white/6 text-gray-600'}`}>
                {t.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" />
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="Search..."
          className="w-full bg-white/5 border border-white/8 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white placeholder:text-gray-600 focus:outline-none focus:border-white/15 transition-all"
        />
      </div>

      {/* Content */}
      {filtered.length === 0 ? (
        <div className="bg-white/4 border border-white/8 rounded-2xl p-10 text-center">
          {tab === 'revision' ? <RefreshCw size={28} className="text-gray-600 mx-auto mb-3" /> :
           tab === 'starred' ? <Star size={28} className="text-gray-600 mx-auto mb-3" /> :
           <BookOpen size={28} className="text-gray-600 mx-auto mb-3" />}
          <p className="text-gray-400 font-medium mb-1">Nothing here yet</p>
          <p className="text-gray-600 text-sm">
            {tab === 'revision' ? 'Mark problems for revision using the cycle icon on any problem card.' :
             tab === 'starred' ? 'Star your important problems using the star icon on any problem card.' :
             'Add notes to problems by clicking the expand arrow on any problem card.'}
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map(q => (
            <QuestionCard key={q.id} question={q} />
          ))}
        </div>
      )}

      {/* Tip */}
      {tab === 'revision' && revisionList.length > 0 && (
        <div className="bg-blue-500/8 border border-blue-500/15 rounded-xl p-4 flex gap-3">
          <AlertTriangle size={15} className="text-blue-400 flex-shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-300">Spaced Repetition Tip</p>
            <p className="text-xs text-gray-500 mt-0.5">
              Review marked problems regularly. After revising, uncheck the revision marker to indicate you've reviewed it recently.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
