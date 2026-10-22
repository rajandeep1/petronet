import { useState, useEffect } from 'react';
import type { Page, Application } from '../../types';
import { Logo } from '../Logo';
import { useAuth } from '../../lib/auth';
import {
  fetchApplicationsByEmail,
  fetchJobs,
  fetchStores,
  submitApplication,
} from '../../lib/data';
import type { Job, Store } from '../../types';
import {
  Mail, Lock, ArrowRight, AlertCircle, User, CheckCircle, Clock,
  XCircle, FileText, MapPin, UserPlus, Plus, Briefcase, ChevronDown,
} from 'lucide-react';

interface SignInPageProps {
  navigate: (page: Page) => void;
}

export function SignInPage({ navigate }: SignInPageProps) {
  const { signIn, signUp, session } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [signupSuccess, setSignupSuccess] = useState(false);

  if (session) {
    return <ApplicantDashboard navigate={navigate} email={session.user.email ?? ''} />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (mode === 'signup') {
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        setLoading(false);
        return;
      }
      if (password.length < 6) {
        setError('Password must be at least 6 characters long.');
        setLoading(false);
        return;
      }
      const { error: signUpError } = await signUp(email, password);
      if (signUpError) {
        setError(signUpError);
        setLoading(false);
      } else {
        setSignupSuccess(true);
        setLoading(false);
      }
    } else {
      const { error: signInError } = await signIn(email, password);
      if (signInError) {
        setError(signInError);
        setLoading(false);
      }
    }
  };

  if (signupSuccess) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">Account Created!</h2>
          <p className="text-gray-600 mb-6">
            Your applicant account has been created. You can now sign in to apply for jobs and track your applications.
          </p>
          <button
            onClick={() => { setSignupSuccess(false); setMode('signin'); }}
            className="bg-[#E30613] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
          >
            Sign In Now
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-12 bg-gray-50">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-br from-[#E30613] to-red-700 text-white px-6 py-8 text-center">
            <div className="bg-white rounded-xl p-3 inline-block mb-4 shadow-md">
              <Logo size={36} />
            </div>
            <h1 className="text-2xl font-bold">
              {mode === 'signin' ? 'Applicant Portal' : 'Create an Account'}
            </h1>
            <p className="text-red-100 text-sm mt-2">
              {mode === 'signin'
                ? 'Sign in to apply for jobs and track applications'
                : 'Sign up to apply for jobs at Petro-Canada'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="px-6 py-8 space-y-5">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div>
              <label className="text-sm font-semibold text-black mb-1.5 block">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="you@email.com"
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

            {mode === 'signup' && (
              <div>
                <label className="text-sm font-semibold text-black mb-1.5 block">Confirm Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg pl-11 pr-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-[#E30613] text-white font-bold py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {loading ? (
                'Please wait...'
              ) : mode === 'signin' ? (
                <>Sign In <ArrowRight className="w-4 h-4" /></>
              ) : (
                <><UserPlus className="w-4 h-4" /> Create Account</>
              )}
            </button>
          </form>

          <div className="px-6 pb-8 text-center border-t border-gray-100 pt-6">
            {mode === 'signin' ? (
              <p className="text-sm text-gray-600">
                Don't have an account?{' '}
                <button
                  onClick={() => { setMode('signup'); setError(null); }}
                  className="text-[#E30613] font-bold hover:underline"
                >
                  Sign Up
                </button>
              </p>
            ) : (
              <p className="text-sm text-gray-600">
                Already have an account?{' '}
                <button
                  onClick={() => { setMode('signin'); setError(null); }}
                  className="text-[#E30613] font-bold hover:underline"
                >
                  Sign In
                </button>
              </p>
            )}
          </div>
        </div>

        <p className="text-center text-sm text-gray-500 mt-6">
          Are you a manager?{' '}
          <button onClick={() => navigate({ name: 'adminLogin' })} className="text-[#E30613] font-semibold hover:underline">
            Admin Login
          </button>
        </p>
      </div>
    </div>
  );
}

// ============================================================
// Applicant Dashboard — shows existing apps + new application form
// ============================================================
function ApplicantDashboard({ navigate, email }: { navigate: (page: Page) => void; email: string }) {
  const { session } = useAuth();
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [lookupEmail, setLookupEmail] = useState(email);
  const [searchedEmail, setSearchedEmail] = useState(email);
  const [showForm, setShowForm] = useState(false);

  const loadData = async (em: string) => {
    try {
      setLoading(true);
      const [apps, j, s] = await Promise.all([
        fetchApplicationsByEmail(em),
        fetchJobs({ status: 'open' }),
        fetchStores(),
      ]);
      setApplications(apps);
      setJobs(j);
      setStores(s);
    } catch {
      // ignore
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!searchedEmail) { setLoading(false); return; }
    loadData(searchedEmail);
  }, [searchedEmail]);

  const handleLookup = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchedEmail(lookupEmail);
  };

  const appliedJobIds = new Set(applications.map(a => a.job_id));

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8 sm:py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-3xl font-bold text-black">My Applications</h1>
            <p className="text-gray-600 mt-1">
              Signed in as <span className="font-semibold text-black">{email}</span>
            </p>
          </div>
          {session && (
            <button
              onClick={() => setShowForm(v => !v)}
              className="bg-[#E30613] text-white font-bold px-5 py-2.5 rounded-lg hover:bg-red-700 transition-colors flex items-center justify-center gap-2 text-sm whitespace-nowrap"
            >
              {showForm ? <>Cancel</> : <><Plus className="w-4 h-4" /> New Application</>}
            </button>
          )}
        </div>

        {/* Email lookup for non-logged-in users */}
        {!session && (
          <form onSubmit={handleLookup} className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
            <div className="flex gap-3">
              <input
                type="email"
                value={lookupEmail}
                onChange={e => setLookupEmail(e.target.value)}
                placeholder="Enter your email to find your applications"
                className="flex-grow border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
              <button type="submit" className="bg-[#E30613] text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors whitespace-nowrap">
                Find Applications
              </button>
            </div>
          </form>
        )}

        {/* New Application Form */}
        {showForm && session && (
          <NewApplicationForm
            email={email}
            jobs={jobs}
            stores={stores}
            appliedJobIds={appliedJobIds}
            onSubmitted={() => {
              setShowForm(false);
              loadData(email);
            }}
            navigate={navigate}
          />
        )}

        {/* Existing Applications */}
        <div className="mt-6">
          <h2 className="text-lg font-bold text-black mb-4">
            Submitted Applications {applications.length > 0 && `(${applications.length})`}
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="w-12 h-12 border-4 border-red-200 border-t-[#E30613] rounded-full animate-spin" />
            </div>
          ) : applications.length === 0 ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">You haven't submitted any applications yet.</p>
              {session && (
                <button
                  onClick={() => setShowForm(true)}
                  className="mt-4 text-[#E30613] font-semibold hover:underline"
                >
                  Apply for a position
                </button>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {applications.map(app => (
                <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <h3 className="text-lg font-bold text-black">{app.job?.title}</h3>
                        <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${app.job?.employment_type === 'Full-time' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                          {app.job?.employment_type}
                        </span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500 mt-1">
                        <MapPin className="w-4 h-4 mr-1" />
                        {app.job?.store?.name}, {app.job?.store?.city}
                      </div>
                      {app.experience && (
                        <p className="text-sm text-gray-600 mt-2 line-clamp-2">{app.experience}</p>
                      )}
                      <p className="text-xs text-gray-400 mt-2">
                        Applied on {new Date(app.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric' })}
                      </p>
                    </div>
                    <StatusBadge status={app.status} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ============================================================
// New Application Form with dropdowns
// ============================================================
function NewApplicationForm({
  email,
  jobs,
  stores,
  appliedJobIds,
  onSubmitted,
  navigate,
}: {
  email: string;
  jobs: Job[];
  stores: Store[];
  appliedJobIds: Set<string>;
  onSubmitted: () => void;
  navigate: (page: Page) => void;
}) {
  const [selectedStoreId, setSelectedStoreId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [form, setForm] = useState({
    full_name: '',
    phone: '',
    address: '',
    experience: '',
    availability: '',
    cover_letter: '',
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Jobs available for the selected store, that are open, and not already applied to
  const availableJobs = jobs.filter(j => {
    if (j.status !== 'open') return false;
    if (selectedStoreId && j.store_id !== selectedStoreId) return false;
    if (appliedJobIds.has(j.id)) return false;
    return true;
  });

  const selectedJob = jobs.find(j => j.id === selectedJobId);
  const alreadyApplied = selectedJobId && appliedJobIds.has(selectedJobId);

  const update = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!selectedJobId) {
      setError('Please select a job position to apply for.');
      return;
    }
    if (alreadyApplied) {
      setError('You have already applied for this position. Check your applications above.');
      return;
    }
    if (!form.full_name.trim() || !form.phone.trim()) {
      setError('Please fill in your full name and phone number.');
      return;
    }

    setSubmitting(true);
    try {
      await submitApplication({
        job_id: selectedJobId,
        full_name: form.full_name,
        email,
        phone: form.phone,
        address: form.address,
        cover_letter: form.cover_letter,
        experience: form.experience,
        availability: form.availability,
      });
      setSuccess(true);
      setTimeout(() => onSubmitted(), 1800);
    } catch {
      setError('Unable to submit your application. Please try again.');
      setSubmitting(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-green-200 p-8 text-center">
        <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle className="w-7 h-7 text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-black mb-2">Application Submitted!</h3>
        <p className="text-gray-600">Your application has been received. You can track its status below.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#E30613] border-opacity-30 overflow-hidden">
      <div className="bg-red-50 border-b border-red-100 px-6 py-4">
        <h3 className="text-lg font-bold text-black flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-[#E30613]" /> New Job Application
        </h3>
        <p className="text-sm text-gray-600 mt-0.5">Select a position and fill in your details below.</p>
      </div>

      <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {/* Store Dropdown */}
        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block flex items-center gap-1.5">
            <MapPin className="w-4 h-4 text-[#E30613]" /> Store Location
          </label>
          <div className="relative">
            <select
              value={selectedStoreId}
              onChange={e => { setSelectedStoreId(e.target.value); setSelectedJobId(''); }}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white pr-10"
            >
              <option value="">All Stores (Winnipeg)</option>
              {stores.map(s => (
                <option key={s.id} value={s.id}>{s.name} — {s.city}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>

        {/* Job Dropdown */}
        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block flex items-center gap-1.5">
            <Briefcase className="w-4 h-4 text-[#E30613]" /> Job Position *
          </label>
          <div className="relative">
            <select
              value={selectedJobId}
              onChange={e => setSelectedJobId(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none appearance-none bg-white pr-10"
            >
              <option value="">Select a position...</option>
              {availableJobs.map(j => (
                <option key={j.id} value={j.id}>
                  {j.title} ({j.employment_type}) - {j.store?.name}
                </option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          {availableJobs.length === 0 && (
            <p className="text-sm text-gray-500 mt-2">
              No new open positions available{selectedStoreId ? ' for this store' : ''}. You may have already applied to all available jobs.
            </p>
          )}
        </div>

        {/* Selected Job Info */}
        {selectedJob && !alreadyApplied && (
          <div className="bg-gray-50 rounded-lg p-4 border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${selectedJob.employment_type === 'Full-time' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                {selectedJob.employment_type}
              </span>
              {selectedJob.salary_range && (
                <span className="text-sm font-semibold text-gray-700">{selectedJob.salary_range}</span>
              )}
            </div>
            <p className="text-sm text-gray-600 line-clamp-3">{selectedJob.description}</p>
          </div>
        )}

        {alreadyApplied && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 text-yellow-600 flex-shrink-0" />
            <p className="text-sm text-yellow-700">You have already applied for this position. See your applications below.</p>
          </div>
        )}

        {/* Applicant Details */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2 border-t border-gray-100">
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Full Name *</label>
            <input
              type="text"
              value={form.full_name}
              onChange={e => update('full_name', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="John Smith"
              required
            />
          </div>
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Phone Number *</label>
            <input
              type="tel"
              value={form.phone}
              onChange={e => update('phone', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="(204) 123-4567"
              required
            />
          </div>
          <div className="sm:col-span-2">
            <label className="text-sm font-semibold text-black mb-1.5 block">Home Address</label>
            <input
              type="text"
              value={form.address}
              onChange={e => update('address', e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              placeholder="123 Main St, Winnipeg, MB"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Relevant Experience</label>
          <textarea
            value={form.experience}
            onChange={e => update('experience', e.target.value)}
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
            placeholder="Describe your previous work experience..."
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Availability</label>
          <input
            type="text"
            value={form.availability}
            onChange={e => update('availability', e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
            placeholder="e.g. Weekdays 8am-4pm, Weekends, Evenings"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Cover Letter / Message</label>
          <textarea
            value={form.cover_letter}
            onChange={e => update('cover_letter', e.target.value)}
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
            placeholder="Tell us why you'd be a great fit..."
          />
        </div>

        <div className="flex gap-3 pt-2">
          <button
            type="submit"
            disabled={submitting || !selectedJobId || !!alreadyApplied}
            className="bg-[#E30613] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
          >
            {submitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Submitting...
              </>
            ) : (
              <>Submit Application</>
            )}
          </button>
          <button
            type="button"
            onClick={() => onSubmitted()}
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-3 rounded-lg hover:bg-gray-50 transition-colors text-sm"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const config = {
    pending: { label: 'Pending Review', icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    reviewing: { label: 'Under Review', icon: Clock, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rejected: { label: 'Not Selected', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full ${c.bg} ${c.text} ${c.border} border whitespace-nowrap`}>
      <Icon className="w-3.5 h-3.5" /> {c.label}
    </span>
  );
}
