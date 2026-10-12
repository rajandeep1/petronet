import { useState } from 'react';
import type { Page } from '../../types';
import { Logo } from '../Logo';
import { useAuth } from '../../lib/auth';
import { Mail, Lock, ArrowRight, AlertCircle, Shield } from 'lucide-react';

interface AdminLoginPageProps {
  navigate: (page: Page) => void;
}

export function AdminLoginPage({ navigate }: AdminLoginPageProps) {
  const { signIn, session } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  if (session) {
    // Redirect to admin dashboard
    setTimeout(() => navigate({ name: 'adminDashboard' }), 0);
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const { error: signInError } = await signIn(email, password);
    if (signInError) {
      setError(signInError);
      setLoading(false);
    } else {
      navigate({ name: 'adminDashboard' });
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-gray-900 to-gray-800 text-white px-6 py-8 text-center">
            <div className="bg-white rounded-xl p-3 inline-block mb-4 shadow-md">
              <Logo size={36} />
            </div>
            <div className="flex items-center justify-center gap-2 mb-1">
              <Shield className="w-5 h-5 text-[#E30613]" />
              <h1 className="text-2xl font-bold">Manager Portal</h1>
            </div>
            <p className="text-gray-400 text-sm mt-2">Sign in to manage jobs and applications</p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-black mb-1.5 block">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="admin@petro-canada.ca"
                  required
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-semibold text-black mb-1.5 block">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E30613] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? 'Signing in...' : <>Admin Sign In <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Looking for jobs?{' '}
          <button onClick={() => navigate({ name: 'home' })} className="text-[#E30613] font-semibold hover:underline">
            Back to Home
          </button>
        </p>
      </div>
    </div>
  );
}
