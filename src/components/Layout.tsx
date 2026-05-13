import { useState } from 'react';
import {
  Code2, LayoutDashboard, BookOpen, Target, BarChart2,
  BookMarked, LogOut, Menu, X, ChevronRight, Flame, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTracker } from '../context/TrackerContext';

export type Page = 'dashboard' | 'questions' | 'daily' | 'analytics' | 'revision';

interface LayoutProps {
  children: React.ReactNode;
  page: Page;
  onNavigate: (page: Page) => void;
}

const NAV_ITEMS: { id: Page; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'questions', label: 'Problems', icon: BookOpen },
  { id: 'daily', label: 'Daily Practice', icon: Target },
  { id: 'analytics', label: 'Analytics', icon: BarChart2 },
  { id: 'revision', label: 'Revision', icon: BookMarked },
];

export default function Layout({ children, page, onNavigate }: LayoutProps) {
  const { user, signOut } = useAuth();
  const { profile, totalSolved } = useTracker();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const displayName = profile?.display_name || user?.email?.split('@')[0] || 'Coder';
  const level = profile?.level ?? 1;
  const xp = profile?.total_xp ?? 0;
  const xpForNext = level * 200;
  const xpProgress = Math.min(100, ((xp % 200) / 200) * 100);

  return (
    <div className="min-h-screen bg-[#0a0a0f] flex">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 bg-black/60 z-30 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed lg:sticky top-0 h-screen w-64 bg-[#0d0d14] border-r border-white/5 flex flex-col z-40 transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}>
        {/* Logo */}
        <div className="flex items-center gap-3 px-5 py-5 border-b border-white/5">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
            <Code2 size={16} className="text-white" />
          </div>
          <span className="font-bold text-white tracking-tight">AlgoTrack</span>
          <button className="ml-auto lg:hidden text-gray-500 hover:text-white" onClick={() => setSidebarOpen(false)}>
            <X size={18} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(item => {
            const Icon = item.icon;
            const active = page === item.id;
            return (
              <button
                key={item.id}
                onClick={() => { onNavigate(item.id); setSidebarOpen(false); }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group ${
                  active
                    ? 'bg-white/10 text-white'
                    : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'
                }`}
              >
                <Icon size={16} className={active ? 'text-blue-400' : 'text-current'} />
                {item.label}
                {active && <ChevronRight size={14} className="ml-auto text-gray-500" />}
              </button>
            );
          })}
        </nav>

        {/* User section */}
        <div className="px-3 pb-4 border-t border-white/5 pt-4 space-y-3">
          {/* Level bar */}
          <div className="bg-white/5 rounded-xl p-3">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                  <Zap size={12} className="text-white" />
                </div>
                <span className="text-xs font-semibold text-white">Level {level}</span>
              </div>
              <span className="text-xs text-gray-500">{xp} XP</span>
            </div>
            <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 rounded-full transition-all duration-500"
                style={{ width: `${xpProgress}%` }}
              />
            </div>
            <p className="text-xs text-gray-600 mt-1">{xpForNext - (xp % 200)} XP to Level {level + 1}</p>
          </div>

          {/* Streak mini */}
          <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-gray-300">{profile?.current_streak ?? 0} day streak</span>
            <span className="ml-auto text-xs text-gray-600">{totalSolved} solved</span>
          </div>

          {/* User */}
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center flex-shrink-0">
              <span className="text-xs font-bold text-white">{displayName[0].toUpperCase()}</span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-white truncate">{displayName}</p>
              <p className="text-[10px] text-gray-600 truncate">{user?.email}</p>
            </div>
            <button onClick={signOut} className="text-gray-600 hover:text-red-400 transition-colors" title="Sign out">
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 min-w-0 flex flex-col">
        {/* Mobile header */}
        <header className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-[#0d0d14] sticky top-0 z-20">
          <button onClick={() => setSidebarOpen(true)} className="text-gray-400 hover:text-white">
            <Menu size={20} />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-blue-500 to-emerald-500 flex items-center justify-center">
              <Code2 size={12} className="text-white" />
            </div>
            <span className="font-bold text-white text-sm">AlgoTrack</span>
          </div>
          <div className="ml-auto flex items-center gap-2">
            <Flame size={14} className="text-orange-400" />
            <span className="text-xs text-white font-semibold">{profile?.current_streak ?? 0}</span>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
