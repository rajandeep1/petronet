import { useState } from 'react';
import type { Page } from './types';
import { AuthProvider } from './lib/auth';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { HomePage } from './components/pages/HomePage';
import { JobDetailPage } from './components/pages/JobDetailPage';
import { ApplyPage } from './components/pages/ApplyPage';
import { SignInPage } from './components/pages/SignInPage';
import { AdminLoginPage } from './components/pages/AdminLoginPage';
import { AdminDashboard } from './components/pages/AdminDashboard';

function AppContent() {
  const [page, setPage] = useState<Page>({ name: 'home' });

  const navigate = (next: Page) => {
    setPage(next);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const isAdminPage = page.name === 'adminDashboard';

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navbar current={page} navigate={navigate} />
      <main className="flex-grow">
        {page.name === 'home' && <HomePage navigate={navigate} />}
        {page.name === 'jobDetail' && <JobDetailPage jobId={page.jobId} navigate={navigate} />}
        {page.name === 'apply' && <ApplyPage jobId={page.jobId} navigate={navigate} />}
        {page.name === 'signIn' && <SignInPage navigate={navigate} />}
        {page.name === 'applicantDashboard' && <SignInPage navigate={navigate} />}
        {page.name === 'adminLogin' && <AdminLoginPage navigate={navigate} />}
        {page.name === 'adminDashboard' && <AdminDashboard navigate={navigate} />}
      </main>
      {!isAdminPage && <Footer />}
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
