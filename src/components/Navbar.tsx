import type { Page } from '../types';
import { Logo } from './Logo';
import { useAuth } from '../lib/auth';
import { LogOut, LayoutDashboard, User, MapPin } from 'lucide-react';

interface NavbarProps {
  current: Page;
  navigate: (page: Page) => void;
}

export function Navbar({ current, navigate }: NavbarProps) {
  const { session, signOut } = useAuth();

  const goHome = () => navigate({ name: 'home' });

  return (
    <header className="sticky top-0 z-50 bg-white border-b-4 border-[#E30613] shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button onClick={goHome} className="flex items-center hover:opacity-80 transition-opacity">
            <Logo size={36} />
          </button>

          <nav className="flex items-center gap-1 sm:gap-3">
            {current.name === 'adminDashboard' ? (
              <>
                <span className="text-xs sm:text-sm font-semibold text-red-600 bg-red-50 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <LayoutDashboard className="w-4 h-4" /> Admin
                </span>
                <button
                  onClick={() => { signOut(); navigate({ name: 'home' }); }}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : current.name === 'applicantDashboard' ? (
              <>
                <span className="text-xs sm:text-sm font-semibold text-gray-700 bg-gray-100 px-3 py-1.5 rounded-full flex items-center gap-1.5">
                  <User className="w-4 h-4" /> My Applications
                </span>
                <button
                  onClick={() => { signOut(); navigate({ name: 'home' }); }}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="w-4 h-4" /> Sign Out
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={goHome}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  Home
                </button>
                <button
                  onClick={() => navigate({ name: 'home' })}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors flex items-center gap-1.5"
                >
                  <MapPin className="w-4 h-4" /> Locations
                </button>
                <button
                  onClick={() => navigate({ name: 'signIn' })}
                  className="text-sm font-medium text-gray-700 hover:text-red-600 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  My Applications
                </button>
                <button
                  onClick={() => navigate({ name: 'adminLogin' })}
                  className="text-sm font-bold text-white bg-[#E30613] hover:bg-red-700 px-4 py-2 rounded-lg transition-colors"
                >
                  Admin Login
                </button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
