import { useState, useEffect, useCallback } from 'react';
import type { Page, Application, Job, Store } from '../../types';
import { useAuth } from '../../lib/auth';
import {
  fetchAllApplications,
  updateApplicationStatus,
  deleteApplication,
  fetchJobs,
  fetchStores,
  createStore,
  deleteStore,
  createJob,
  updateJob,
  deleteJob,
} from '../../lib/data';
import {
  LayoutDashboard,
  Users,
  Briefcase,
  MapPin,
  CheckCircle,
  Clock,
  XCircle,
  Trash2,
  Plus,
  X,
  AlertCircle,
  TrendingUp,
} from 'lucide-react';

interface AdminDashboardProps {
  navigate: (page: Page) => void;
}

type Tab = 'overview' | 'applications' | 'jobs' | 'stores';

export function AdminDashboard({ navigate }: AdminDashboardProps) {
  const { session, loading: authLoading } = useAuth();
  const [tab, setTab] = useState<Tab>('overview');
  const [applications, setApplications] = useState<Application[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      const [apps, j, s] = await Promise.all([fetchAllApplications(), fetchJobs(), fetchStores()]);
      setApplications(apps);
      setJobs(j);
      setStores(s);
    } catch {
      setError('Unable to load dashboard data.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!authLoading && !session) {
      navigate({ name: 'adminLogin' });
      return;
    }
    if (session) loadData();
  }, [session, authLoading, loadData, navigate]);

  if (authLoading || !session) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-[#E30613] rounded-full animate-spin" />
      </div>
    );
  }

  const pendingCount = applications.filter(a => a.status === 'pending').length;
  const reviewingCount = applications.filter(a => a.status === 'reviewing').length;
  const acceptedCount = applications.filter(a => a.status === 'accepted').length;
  const openJobsCount = jobs.filter(j => j.status === 'open').length;

  return (
    <div className="min-h-[70vh] bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="bg-[#E30613] rounded-lg p-2.5">
            <LayoutDashboard className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-black">Manager Dashboard</h1>
            <p className="text-sm text-gray-500">Signed in as {session.user.email}</p>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 bg-white rounded-xl shadow-sm border border-gray-200 p-1.5 overflow-x-auto">
          <TabButton active={tab === 'overview'} onClick={() => setTab('overview')} icon={<LayoutDashboard className="w-4 h-4" />}>Overview</TabButton>
          <TabButton active={tab === 'applications'} onClick={() => setTab('applications')} icon={<Users className="w-4 h-4" />}>
            Applications {pendingCount > 0 && <span className="ml-1 bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">{pendingCount}</span>}
          </TabButton>
          <TabButton active={tab === 'jobs'} onClick={() => setTab('jobs')} icon={<Briefcase className="w-4 h-4" />}>Jobs</TabButton>
          <TabButton active={tab === 'stores'} onClick={() => setTab('stores')} icon={<MapPin className="w-4 h-4" />}>Stores</TabButton>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3 mb-6">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
            <p className="text-sm text-red-700">{error}</p>
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="w-12 h-12 border-4 border-red-200 border-t-[#E30613] rounded-full animate-spin" />
          </div>
        ) : (
          <>
            {tab === 'overview' && (
              <OverviewTab
                totalApps={applications.length}
                pendingCount={pendingCount}
                reviewingCount={reviewingCount}
                acceptedCount={acceptedCount}
                openJobsCount={openJobsCount}
                totalJobs={jobs.length}
                totalStores={stores.length}
                recentApps={applications.slice(0, 5)}
              />
            )}
            {tab === 'applications' && (
              <ApplicationsTab applications={applications} onRefresh={loadData} />
            )}
            {tab === 'jobs' && (
              <JobsTab jobs={jobs} stores={stores} onRefresh={loadData} />
            )}
            {tab === 'stores' && (
              <StoresTab stores={stores} jobs={jobs} onRefresh={loadData} />
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ---- Overview Tab ----
function OverviewTab({
  totalApps, pendingCount, reviewingCount, acceptedCount, openJobsCount, totalJobs, totalStores, recentApps,
}: {
  totalApps: number; pendingCount: number; reviewingCount: number; acceptedCount: number;
  openJobsCount: number; totalJobs: number; totalStores: number; recentApps: Application[];
}) {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard label="Total Applications" value={totalApps} icon={<Users className="w-6 h-6" />} color="red" />
        <MetricCard label="Pending Review" value={pendingCount} icon={<Clock className="w-6 h-6" />} color="yellow" />
        <MetricCard label="Open Jobs" value={openJobsCount} icon={<Briefcase className="w-6 h-6" />} color="blue" />
        <MetricCard label="Stores" value={totalStores} icon={<MapPin className="w-6 h-6" />} color="green" />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-bold text-black mb-4 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-[#E30613]" /> Recent Applications
        </h3>
        {recentApps.length === 0 ? (
          <p className="text-gray-400 text-sm py-8 text-center">No applications yet.</p>
        ) : (
          <div className="space-y-3">
            {recentApps.map(app => (
              <div key={app.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="font-semibold text-black text-sm">{app.full_name}</p>
                  <p className="text-sm text-gray-500">{app.job?.title} - {app.job?.store?.name}</p>
                </div>
                <StatusBadge status={app.status} />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <StatBox label="Under Review" value={reviewingCount} icon={<Clock className="w-5 h-5" />} />
        <StatBox label="Accepted" value={acceptedCount} icon={<CheckCircle className="w-5 h-5" />} />
        <StatBox label="Total Job Postings" value={totalJobs} icon={<Briefcase className="w-5 h-5" />} />
      </div>
    </div>
  );
}

// ---- Applications Tab ----
function ApplicationsTab({ applications, onRefresh }: { applications: Application[]; onRefresh: () => void }) {
  const [filter, setFilter] = useState<string>('all');

  const filtered = filter === 'all' ? applications : applications.filter(a => a.status === filter);

  const handleStatusChange = async (id: string, status: Application['status']) => {
    try {
      await updateApplicationStatus(id, status);
      onRefresh();
    } catch {
      alert('Unable to update application status.');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this application? This cannot be undone.')) return;
    try {
      await deleteApplication(id);
      onRefresh();
    } catch {
      alert('Unable to delete application.');
    }
  };

  return (
    <div>
      <div className="flex gap-2 mb-4 flex-wrap">
        {['all', 'pending', 'reviewing', 'accepted', 'rejected'].map(f => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`text-sm font-semibold px-4 py-2 rounded-lg transition-colors capitalize ${
              filter === f ? 'bg-[#E30613] text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
            }`}
          >
            {f === 'all' ? 'All' : f}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
          <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500">No applications to display.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map(app => (
            <div key={app.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="flex flex-col lg:flex-row lg:items-start gap-4">
                <div className="flex-grow">
                  <div className="flex items-center gap-3 flex-wrap mb-2">
                    <h3 className="text-lg font-bold text-black">{app.full_name}</h3>
                    <StatusBadge status={app.status} />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                    <p><span className="font-semibold">Email:</span> {app.email}</p>
                    <p><span className="font-semibold">Phone:</span> {app.phone}</p>
                    <p><span className="font-semibold">Position:</span> {app.job?.title}</p>
                    <p><span className="font-semibold">Store:</span> {app.job?.store?.name}</p>
                    {app.address && <p><span className="font-semibold">Address:</span> {app.address}</p>}
                    {app.availability && <p><span className="font-semibold">Availability:</span> {app.availability}</p>}
                  </div>
                  {app.experience && (
                    <div className="bg-gray-50 rounded-lg p-3 mb-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Experience</p>
                      <p className="text-sm text-gray-700">{app.experience}</p>
                    </div>
                  )}
                  {app.cover_letter && (
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-xs font-semibold text-gray-500 uppercase mb-1">Cover Letter</p>
                      <p className="text-sm text-gray-700">{app.cover_letter}</p>
                    </div>
                  )}
                  <p className="text-xs text-gray-400 mt-3">
                    Applied on {new Date(app.created_at).toLocaleDateString('en-CA', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                <div className="flex flex-row lg:flex-col gap-2 flex-shrink-0">
                  <select
                    value={app.status}
                    onChange={e => handleStatusChange(app.id, e.target.value as Application['status'])}
                    className="border border-gray-300 rounded-lg px-3 py-2 text-sm font-semibold focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="accepted">Accepted</option>
                    <option value="rejected">Rejected</option>
                  </select>
                  <button
                    onClick={() => handleDelete(app.id)}
                    className="text-red-600 hover:bg-red-50 rounded-lg p-2 transition-colors"
                    title="Delete application"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ---- Jobs Tab ----
function JobsTab({ jobs, stores, onRefresh }: { jobs: Job[]; stores: Store[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);
  const [editingJob, setEditingJob] = useState<Job | null>(null);

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this job posting? All related applications will also be deleted.')) return;
    try {
      await deleteJob(id);
      onRefresh();
    } catch {
      alert('Unable to delete job.');
    }
  };

  const handleToggleStatus = async (job: Job) => {
    try {
      await updateJob(job.id, { status: job.status === 'open' ? 'closed' : 'open' });
      onRefresh();
    } catch {
      alert('Unable to update job status.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black">Job Postings ({jobs.length})</h2>
        <button
          onClick={() => { setEditingJob(null); setShowForm(true); }}
          className="bg-[#E30613] text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Job
        </button>
      </div>

      {showForm && (
        <JobForm
          job={editingJob}
          stores={stores}
          onClose={() => { setShowForm(false); setEditingJob(null); }}
          onSaved={() => { setShowForm(false); setEditingJob(null); onRefresh(); }}
        />
      )}

      <div className="space-y-3">
        {jobs.map(job => (
          <div key={job.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-grow">
                <div className="flex items-center gap-2 flex-wrap mb-1">
                  <h3 className="text-lg font-bold text-black">{job.title}</h3>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${job.employment_type === 'Full-time' ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
                    {job.employment_type}
                  </span>
                  <span className={`text-xs font-bold px-2.5 py-0.5 rounded-full ${job.status === 'open' ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-500'}`}>
                    {job.status}
                  </span>
                </div>
                <p className="text-sm text-gray-500 flex items-center gap-1.5 mb-1">
                  <MapPin className="w-4 h-4" /> {job.store?.name}, {job.store?.city}
                </p>
                <p className="text-sm text-gray-600 line-clamp-2">{job.description}</p>
                {job.salary_range && <p className="text-sm font-semibold text-gray-700 mt-1">{job.salary_range}</p>}
              </div>
              <div className="flex flex-col gap-2 flex-shrink-0">
                <button
                  onClick={() => { setEditingJob(job); setShowForm(true); }}
                  className="text-sm font-semibold text-gray-700 border border-gray-300 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleToggleStatus(job)}
                  className="text-sm font-semibold border rounded-lg px-3 py-1.5 transition-colors"
                  style={{
                    color: job.status === 'open' ? '#E30613' : '#16a34a',
                    borderColor: job.status === 'open' ? '#fecaca' : '#bbf7d0',
                  }}
                >
                  {job.status === 'open' ? 'Close' : 'Reopen'}
                </button>
                <button
                  onClick={() => handleDelete(job.id)}
                  className="text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors flex items-center justify-center"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function JobForm({
  job, stores, onClose, onSaved,
}: {
  job: Job | null; stores: Store[]; onClose: () => void; onSaved: () => void;
}) {
  const [form, setForm] = useState({
    store_id: job?.store_id ?? stores[0]?.id ?? '',
    title: job?.title ?? '',
    description: job?.description ?? '',
    requirements: job?.requirements ?? '',
    employment_type: job?.employment_type ?? 'Part-time' as 'Part-time' | 'Full-time',
    salary_range: job?.salary_range ?? '',
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.title.trim() || !form.description.trim() || !form.store_id) {
      setError('Please fill in all required fields.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      if (job) {
        await updateJob(job.id, form);
      } else {
        await createJob(form);
      }
      onSaved();
    } catch {
      setError('Unable to save job posting.');
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#E30613] border-opacity-30 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black">{job ? 'Edit Job' : 'New Job Posting'}</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Job Title *</label>
            <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Guest Service Attendant" required />
          </div>
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Store Location *</label>
            <select value={form.store_id} onChange={e => setForm({ ...form, store_id: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Employment Type *</label>
            <select value={form.employment_type} onChange={e => setForm({ ...form, employment_type: e.target.value as 'Part-time' | 'Full-time' })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none">
              <option value="Part-time">Part-time</option>
              <option value="Full-time">Full-time</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Salary Range</label>
            <input type="text" value={form.salary_range} onChange={e => setForm({ ...form, salary_range: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="Salary based on experience" />
          </div>
        </div>
        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Job Description *</label>
          <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="Describe the role..." required />
        </div>
        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Requirements</label>
          <textarea value={form.requirements} onChange={e => setForm({ ...form, requirements: e.target.value })} rows={3}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none resize-none" placeholder="List qualifications and requirements..." />
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-[#E30613] text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : 'Save Job'}
          </button>
          <button type="button" onClick={onClose}
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- Stores Tab ----
function StoresTab({ stores, jobs, onRefresh }: { stores: Store[]; jobs: Job[]; onRefresh: () => void }) {
  const [showForm, setShowForm] = useState(false);

  const handleDelete = async (id: string) => {
    const storeJobs = jobs.filter(j => j.store_id === id);
    if (storeJobs.length > 0) {
      alert(`This store has ${storeJobs.length} job postings. Please delete or reassign those jobs first.`);
      return;
    }
    if (!confirm('Delete this store location?')) return;
    try {
      await deleteStore(id);
      onRefresh();
    } catch {
      alert('Unable to delete store.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-black">Store Locations ({stores.length})</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-[#E30613] text-white font-bold px-4 py-2 rounded-lg hover:bg-red-700 transition-colors flex items-center gap-2 text-sm"
        >
          <Plus className="w-4 h-4" /> Add Store
        </button>
      </div>

      {showForm && <StoreForm stores={stores} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); onRefresh(); }} />}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {stores.map(store => {
          const storeJobs = jobs.filter(j => j.store_id === store.id);
          return (
            <div key={store.id} className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="bg-red-50 rounded-lg p-2 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#E30613]" />
                  </div>
                  <div>
                    <p className="font-bold text-black text-sm">{store.name}</p>
                    <p className="text-xs font-semibold text-[#E30613] mt-0.5">{store.location_type}</p>
                    <p className="text-sm text-gray-500">{store.city}, {store.province} {store.postal_code}</p>
                    {store.phone && <p className="text-sm text-gray-500 mt-1">{store.phone}</p>}
                    <p className="text-xs text-gray-400 mt-2">{storeJobs.length} job posting{storeJobs.length !== 1 ? 's' : ''}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleDelete(store.id)}
                  className="text-red-600 hover:bg-red-50 rounded-lg p-1.5 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function StoreForm({ onClose, onSaved }: { stores: Store[]; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ address: '', postal_code: '', phone: '' });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.address.trim()) {
      setError('Please enter a store address.');
      return;
    }
    setSaving(true);
    setError(null);
    try {
      await createStore(form);
      onSaved();
    } catch {
      setError('Unable to add store.');
      setSaving(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border-2 border-[#E30613] border-opacity-30 p-6 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-black">Add New Store</h3>
        <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><X className="w-5 h-5" /></button>
      </div>
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && <div className="bg-red-50 border border-red-200 rounded-lg p-3 text-sm text-red-700">{error}</div>}
        <div>
          <label className="text-sm font-semibold text-black mb-1.5 block">Street Address *</label>
          <input type="text" value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="123 Main Street" required />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Postal Code</label>
            <input type="text" value={form.postal_code} onChange={e => setForm({ ...form, postal_code: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="R3L 2C4" />
          </div>
          <div>
            <label className="text-sm font-semibold text-black mb-1.5 block">Phone Number</label>
            <input type="text" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-red-500 outline-none" placeholder="(204) 123-4567" />
          </div>
        </div>
        <div className="flex gap-3">
          <button type="submit" disabled={saving}
            className="bg-[#E30613] text-white font-bold px-6 py-2.5 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm">
            {saving ? 'Saving...' : 'Add Store'}
          </button>
          <button type="button" onClick={onClose}
            className="border border-gray-300 text-gray-700 font-semibold px-6 py-2.5 rounded-lg hover:bg-gray-50 transition-colors text-sm">
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

// ---- Shared Components ----
function TabButton({ active, onClick, icon, children }: { active: boolean; onClick: () => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-2 text-sm font-semibold px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap ${
        active ? 'bg-[#E30613] text-white' : 'text-gray-600 hover:bg-gray-100'
      }`}
    >
      {icon} {children}
    </button>
  );
}

function MetricCard({ label, value, icon, color }: { label: string; value: number; icon: React.ReactNode; color: string }) {
  const colors: Record<string, string> = {
    red: 'bg-red-50 text-[#E30613]',
    yellow: 'bg-yellow-50 text-yellow-600',
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
      <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <div className="text-3xl font-extrabold text-black">{value}</div>
      <div className="text-sm text-gray-500 mt-1">{label}</div>
    </div>
  );
}

function StatBox({ label, value, icon }: { label: string; value: number; icon: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div className="text-gray-400">{icon}</div>
      <div>
        <div className="text-2xl font-bold text-black">{value}</div>
        <div className="text-sm text-gray-500">{label}</div>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: Application['status'] }) {
  const config = {
    pending: { label: 'Pending', icon: Clock, bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
    reviewing: { label: 'Reviewing', icon: Clock, bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
    accepted: { label: 'Accepted', icon: CheckCircle, bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
    rejected: { label: 'Rejected', icon: XCircle, bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
  };
  const c = config[status];
  const Icon = c.icon;
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${c.bg} ${c.text} ${c.border} border whitespace-nowrap`}>
      <Icon className="w-3.5 h-3.5" /> {c.label}
    </span>
  );
}
