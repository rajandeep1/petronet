import { useState, useEffect } from 'react';
import type { Page, Job } from '../../types';
import { fetchJobById } from '../../lib/data';
import { MapPin, Clock, DollarSign, ChevronLeft, CheckCircle, FileText } from 'lucide-react';

interface JobDetailPageProps {
  jobId: string;
  navigate: (page: Page) => void;
}

export function JobDetailPage({ jobId, navigate }: JobDetailPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchJobById(jobId)
      .then(data => { setJob(data); setLoading(false); })
      .catch(() => { setError('Unable to load job details.'); setLoading(false); });
  }, [jobId]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-[#E30613] rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg">{error ?? 'Job not found.'}</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-[#E30613] font-semibold hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  const isFullTime = job.employment_type === 'Full-time';

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: 'home' })}
          className="text-sm font-medium text-gray-600 hover:text-[#E30613] flex items-center gap-1.5 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to all positions
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-[#E30613] to-red-700 text-white px-6 sm:px-8 py-8">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xs font-bold bg-white/20 px-3 py-1 rounded-full">
                {job.employment_type}
              </span>
              <span className="text-xs font-bold bg-green-400/30 px-3 py-1 rounded-full">
                {job.status === 'open' ? 'Hiring Now' : 'Position Closed'}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold mb-3">{job.title}</h1>
            <div className="flex flex-wrap gap-4 text-red-100">
              <span className="flex items-center gap-1.5 text-sm">
                <MapPin className="w-4 h-4" /> {job.store?.name}, {job.store?.city}, {job.store?.province}
              </span>
              {job.salary_range && (
                <span className="flex items-center gap-1.5 text-sm">
                  <DollarSign className="w-4 h-4" /> {job.salary_range}
                </span>
              )}
              <span className="flex items-center gap-1.5 text-sm">
                <Clock className="w-4 h-4" /> {isFullTime ? 'Full-time (40 hrs/week)' : 'Part-time (15-25 hrs/week)'}
              </span>
            </div>
          </div>

          {/* Body */}
          <div className="px-6 sm:px-8 py-8 space-y-8">
            <Section title="Job Description" icon={<FileText className="w-5 h-5" />}>
              <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.description}</p>
            </Section>

            {job.requirements && (
              <Section title="Requirements & Qualifications" icon={<CheckCircle className="w-5 h-5" />}>
                <p className="text-gray-700 whitespace-pre-line leading-relaxed">{job.requirements}</p>
              </Section>
            )}

            <Section title="Location Details" icon={<MapPin className="w-5 h-5" />}>
              <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                <p className="font-semibold text-black">{job.store?.name}</p>
                <p className="text-gray-600 text-sm mt-1">{job.store?.name}</p>
                <p className="text-gray-600 text-sm">{job.store?.city}, {job.store?.province} {job.store?.postal_code}</p>
                {job.store?.phone && <p className="text-gray-600 text-sm mt-1">Phone: {job.store.phone}</p>}
              </div>
            </Section>

            {job.status === 'open' && (
              <div className="pt-4">
                <button
                  onClick={() => navigate({ name: 'apply', jobId: job.id })}
                  className="w-full sm:w-auto bg-[#E30613] text-white font-bold px-8 py-3.5 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl"
                >
                  Apply Now
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="text-lg font-bold text-black mb-3 flex items-center gap-2">
        <span className="text-[#E30613]">{icon}</span> {title}
      </h2>
      {children}
    </div>
  );
}
