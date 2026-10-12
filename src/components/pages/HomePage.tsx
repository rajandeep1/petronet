import { useState, useEffect, useCallback } from 'react';
import type { Page, Job, Store } from '../../types';
import { fetchJobs, fetchStores } from '../../lib/data';
import { Logo } from '../Logo';
import { MapPin, Clock, DollarSign, ChevronRight, Briefcase, Fuel, Filter, Search } from 'lucide-react';

interface HomePageProps {
  navigate: (page: Page) => void;
}

export function HomePage({ navigate }: HomePageProps) {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [employmentType, setEmploymentType] = useState('all');
  const [storeId, setStoreId] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const load = useCallback(async () => {
    try {
      setLoading(true);
      const [j, s] = await Promise.all([
        fetchJobs({ employmentType, storeId, status: 'open' }),
        fetchStores(),
      ]);
      setJobs(j);
      setStores(s);
    } catch {
      setError('Unable to load job listings. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [employmentType, storeId]);

  useEffect(() => { load(); }, [load]);

  const filteredJobs = searchQuery
    ? jobs.filter(j =>
        j.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        j.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (j.store?.address ?? '').toLowerCase().includes(searchQuery.toLowerCase())
      )
    : jobs;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#E30613] to-red-800 text-white overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-72 h-72 bg-white rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-white rounded-full blur-3xl" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-white rounded-xl p-4 inline-block mb-6 shadow-lg">
                <Logo size={48} />
              </div>
              <h1 className="text-4xl sm:text-5xl font-extrabold mb-4 leading-tight">
                Join the Petro-Canada Team in Winnipeg
              </h1>
              <p className="text-lg sm:text-xl text-red-100 mb-8">
                We're hiring across 8 store locations. Find your next career in retail fuel and convenience.
                Part-time and full-time positions available.
              </p>
              <div className="flex flex-wrap gap-4">
                <button
                  onClick={() => document.getElementById('job-listings')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-white text-[#E30613] font-bold px-6 py-3 rounded-lg hover:bg-gray-100 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
                >
                  <Briefcase className="w-5 h-5" /> View Open Positions
                </button>
                <button
                  onClick={() => document.getElementById('locations')?.scrollIntoView({ behavior: 'smooth' })}
                  className="bg-red-700/40 border-2 border-white/30 text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700/60 transition-all flex items-center gap-2"
                >
                  <MapPin className="w-5 h-5" /> Store Locations
                </button>
              </div>
            </div>
            <div className="hidden lg:block">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20">
                <div className="grid grid-cols-3 gap-4 text-center">
                  <Stat value={jobs.length} label="Open Jobs" />
                  <Stat value={stores.length} label="Winnipeg Stores" />
                  <Stat value="4" label="Job Types" />
                </div>
                <div className="mt-6 space-y-3">
                  <Highlight icon={<Briefcase className="w-5 h-5" />} text="Competitive hourly wages" />
                  <Highlight icon={<Clock className="w-5 h-5" />} text="Flexible part-time & full-time schedules" />
                  <Highlight icon={<Fuel className="w-5 h-5" />} text="Canada's leading gas station network" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Job Listings */}
      <section id="job-listings" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black mb-2">Open Positions</h2>
          <p className="text-gray-600">Browse available roles and apply online today.</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Filter className="w-3.5 h-3.5" /> Employment Type
              </label>
              <select
                value={employmentType}
                onChange={e => setEmploymentType(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="all">All Types</option>
                <option value="Full-time">Full-time</option>
                <option value="Part-time">Part-time</option>
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5" /> Store Location
              </label>
              <select
                value={storeId}
                onChange={e => setStoreId(e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              >
                <option value="all">All Locations</option>
                {stores.map(s => (
                  <option key={s.id} value={s.id}>{s.address}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Search className="w-3.5 h-3.5" /> Search
              </label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search by title or address..."
                className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="h-6 bg-gray-200 rounded w-3/4 mb-3" />
                <div className="h-4 bg-gray-100 rounded w-full mb-2" />
                <div className="h-4 bg-gray-100 rounded w-2/3 mb-6" />
                <div className="h-10 bg-gray-100 rounded" />
              </div>
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 border border-red-200 rounded-xl p-8 text-center">
            <p className="text-red-700 font-medium">{error}</p>
          </div>
        ) : filteredJobs.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <Briefcase className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">No open positions match your filters.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.map(job => (
              <JobCard key={job.id} job={job} navigate={navigate} />
            ))}
          </div>
        )}
      </section>

      {/* Store Locations */}
      <section id="locations" className="bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-black mb-2">Our Winnipeg Store Locations</h2>
            <p className="text-gray-600">8 Petro-Canada locations across Winnipeg, Manitoba.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {stores.map(store => (
              <div key={store.id} className="bg-gray-50 rounded-xl p-5 border border-gray-200 hover:border-red-300 hover:shadow-md transition-all">
                <div className="flex items-start gap-3">
                  <div className="bg-red-50 rounded-lg p-2 flex-shrink-0">
                    <MapPin className="w-5 h-5 text-[#E30613]" />
                  </div>
                  <div className="min-w-0">
                    <p className="font-semibold text-black text-sm">{store.address}</p>
                    <p className="text-sm text-gray-500">{store.city}, {store.province} {store.postal_code}</p>
                    {store.phone && <p className="text-sm text-gray-500 mt-1">{store.phone}</p>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}

function Stat({ value, label }: { value: string | number; label: string }) {
  return (
    <div>
      <div className="text-3xl font-extrabold text-white">{value}</div>
      <div className="text-xs text-red-100 uppercase tracking-wider mt-1">{label}</div>
    </div>
  );
}

function Highlight({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div className="flex items-center gap-3 text-white">
      <div className="bg-white/20 rounded-lg p-2 flex-shrink-0">{icon}</div>
      <span className="text-sm">{text}</span>
    </div>
  );
}

function JobCard({ job, navigate }: { job: Job; navigate: (page: Page) => void }) {
  const isFullTime = job.employment_type === 'Full-time';
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-lg hover:border-red-200 transition-all flex flex-col">
      <div className="p-6 flex-grow">
        <div className="flex items-center gap-2 mb-3">
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isFullTime ? 'bg-red-50 text-red-600' : 'bg-blue-50 text-blue-600'}`}>
            {job.employment_type}
          </span>
          <span className="text-xs text-green-600 font-semibold bg-green-50 px-2.5 py-1 rounded-full">
            Open
          </span>
        </div>
        <h3 className="text-xl font-bold text-black mb-2">{job.title}</h3>
        <div className="flex items-center text-sm text-gray-500 mb-3">
          <MapPin className="w-4 h-4 mr-1 flex-shrink-0" />
          {job.store?.address}, {job.store?.city}
        </div>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{job.description}</p>
        {job.salary_range && (
          <div className="flex items-center text-sm font-semibold text-gray-700">
            <DollarSign className="w-4 h-4 mr-1 text-green-600" />
            {job.salary_range}
          </div>
        )}
      </div>
      <div className="px-6 pb-6">
        <button
          onClick={() => navigate({ name: 'jobDetail', jobId: job.id })}
          className="w-full bg-white border-2 border-[#E30613] text-[#E30613] font-bold py-2.5 rounded-lg hover:bg-[#E30613] hover:text-white transition-all flex items-center justify-center gap-1.5"
        >
          View Details <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
