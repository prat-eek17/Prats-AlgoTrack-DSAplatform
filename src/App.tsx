import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TrackerProvider } from './context/TrackerContext';
import AuthPage from './components/AuthPage';
import Layout, { Page } from './components/Layout';
import Dashboard from './components/Dashboard';
import QuestionsView from './components/QuestionsView';
import DailyPractice from './components/DailyPractice';
import Analytics from './components/Analytics';
import RevisionView from './components/RevisionView';
import { Loader2 } from 'lucide-react';

function AppContent() {
  const { user, loading } = useAuth();
  const [page, setPage] = useState<Page>('dashboard');

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0f] flex items-center justify-center">
        <Loader2 size={24} className="text-blue-400 animate-spin" />
      </div>
    );
  }

  if (!user) return <AuthPage />;

  return (
    <TrackerProvider>
      <Layout page={page} onNavigate={setPage}>
        {page === 'dashboard' && <Dashboard />}
        {page === 'questions' && <QuestionsView />}
        {page === 'daily' && <DailyPractice />}
        {page === 'analytics' && <Analytics />}
        {page === 'revision' && <RevisionView />}
      </Layout>
    </TrackerProvider>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
