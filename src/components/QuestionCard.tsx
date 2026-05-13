import { useState } from 'react';
import {
  ExternalLink, Star, RefreshCw, CheckCircle2, Circle,
  ChevronDown, ChevronUp, Clock, Tag, Save
} from 'lucide-react';
import { Question, getLeetCodeUrl } from '../data/questions';
import { useTracker, QuestionState } from '../context/TrackerContext';

interface QuestionCardProps {
  question: Question;
}

const DIFF_STYLES: Record<string, string> = {
  Easy: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  Medium: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  Hard: 'text-red-400 bg-red-500/10 border-red-500/20',
};

export default function QuestionCard({ question }: QuestionCardProps) {
  const { questionStates, updateQuestion, markSolved } = useTracker();
  const state: QuestionState = questionStates.get(question.id) ?? {
    question_id: question.id, solved: false, starred: false,
    marked_for_revision: false, notes: '', time_taken_minutes: null,
    last_revised_at: null, solved_at: null,
  };

  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(state.notes);
  const [timeTaken, setTimeTaken] = useState(state.time_taken_minutes?.toString() ?? '');
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleToggleSolved = async () => {
    if (!state.solved) {
      await markSolved(question.id, timeTaken ? parseInt(timeTaken) : undefined);
    } else {
      await updateQuestion(question.id, { solved: false, solved_at: null });
    }
  };

  const handleSaveNotes = async () => {
    setSaving(true);
    await updateQuestion(question.id, { notes, time_taken_minutes: timeTaken ? parseInt(timeTaken) : null });
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
  };

  const handleMarkRevision = async () => {
    await updateQuestion(question.id, {
      marked_for_revision: !state.marked_for_revision,
      last_revised_at: !state.marked_for_revision ? new Date().toISOString() : state.last_revised_at,
    });
  };

  return (
    <div className={`bg-white/4 border rounded-xl transition-all ${
      state.solved ? 'border-emerald-500/15 bg-emerald-500/3' : 'border-white/8 hover:border-white/12'
    }`}>
      <div className="flex items-center gap-3 p-3.5">
        {/* Checkbox */}
        <button onClick={handleToggleSolved} className="flex-shrink-0 transition-transform hover:scale-110">
          {state.solved
            ? <CheckCircle2 size={18} className="text-emerald-400" />
            : <Circle size={18} className="text-gray-600 hover:text-gray-400" />
          }
        </button>

        {/* ID + Title */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-gray-600 font-mono">#{question.id}</span>
            <span className={`text-sm font-medium ${state.solved ? 'text-gray-400 line-through decoration-gray-600' : 'text-gray-200'}`}>
              {question.title}
            </span>
          </div>
          {state.solved && state.solved_at && (
            <p className="text-xs text-gray-600 mt-0.5">
              Solved {new Date(state.solved_at).toLocaleDateString()}
              {state.time_taken_minutes && ` · ${state.time_taken_minutes}m`}
            </p>
          )}
        </div>

        {/* Badges & actions */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full border ${DIFF_STYLES[question.difficulty]}`}>
            {question.difficulty}
          </span>

          <button
            onClick={async () => await updateQuestion(question.id, { starred: !state.starred })}
            className={`p-1 rounded-lg transition-colors ${state.starred ? 'text-amber-400' : 'text-gray-600 hover:text-gray-400'}`}
          >
            <Star size={14} fill={state.starred ? 'currentColor' : 'none'} />
          </button>

          <button
            onClick={handleMarkRevision}
            className={`p-1 rounded-lg transition-colors ${state.marked_for_revision ? 'text-blue-400' : 'text-gray-600 hover:text-gray-400'}`}
            title="Mark for revision"
          >
            <RefreshCw size={14} />
          </button>

          <a
            href={getLeetCodeUrl(question.slug)}
            target="_blank"
            rel="noopener noreferrer"
            className="p-1 rounded-lg text-gray-600 hover:text-blue-400 transition-colors"
          >
            <ExternalLink size={14} />
          </a>

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-1 rounded-lg text-gray-600 hover:text-gray-400 transition-colors"
          >
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      {/* Tags */}
      <div className="flex flex-wrap gap-1 px-3.5 pb-2 -mt-1">
        {question.tags.slice(0, 3).map(tag => (
          <span key={tag} className="inline-flex items-center gap-1 text-[10px] text-gray-600 bg-white/4 rounded-md px-1.5 py-0.5">
            <Tag size={9} />
            {tag}
          </span>
        ))}
        {question.acceptance && (
          <span className="text-[10px] text-gray-700 px-1.5 py-0.5">
            {question.acceptance} accept.
          </span>
        )}
      </div>

      {/* Expanded notes */}
      {expanded && (
        <div className="px-3.5 pb-3.5 border-t border-white/5 pt-3 space-y-3">
          <div>
            <label className="text-xs text-gray-500 mb-1.5 block">Notes & Approach</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Add your approach, insights, or common mistakes..."
              rows={4}
              className="w-full bg-white/4 border border-white/8 rounded-lg px-3 py-2 text-sm text-gray-300 placeholder:text-gray-700 resize-none focus:outline-none focus:border-blue-500/40 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white/4 border border-white/8 rounded-lg px-3 py-1.5">
              <Clock size={12} className="text-gray-500" />
              <input
                type="number"
                value={timeTaken}
                onChange={e => setTimeTaken(e.target.value)}
                placeholder="Time (min)"
                className="w-20 bg-transparent text-sm text-gray-300 placeholder:text-gray-700 focus:outline-none"
              />
            </div>
            <button
              onClick={handleSaveNotes}
              disabled={saving}
              className="flex items-center gap-1.5 text-xs bg-blue-600/20 border border-blue-500/30 text-blue-400 rounded-lg px-3 py-1.5 hover:bg-blue-600/30 transition-all"
            >
              <Save size={12} />
              {saved ? 'Saved!' : saving ? 'Saving...' : 'Save'}
            </button>
            {state.last_revised_at && (
              <span className="text-xs text-gray-600">
                Last revised: {new Date(state.last_revised_at).toLocaleDateString()}
              </span>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
