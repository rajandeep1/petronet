import { useState, useEffect } from 'react';
import type { Page, Job } from '../../types';
import { fetchJobById, submitApplication } from '../../lib/data';
import { ChevronLeft, CheckCircle, MapPin, Briefcase, AlertCircle } from 'lucide-react';

interface ApplyPageProps {
  jobId: string;
  navigate: (page: Page) => void;
}

export function ApplyPage({ jobId, navigate }: ApplyPageProps) {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    full_name: '',
    email: '',
    phone: '',
    address: '',
    cover_letter: '',
    experience: '',
    availability: '',
  });

  useEffect(() => {
    fetchJobById(jobId)
      .then(data => { setJob(data); setLoading(false); })
      .catch(() => { setError('Unable to load job details.'); setLoading(false); });
  }, [jobId]);

  const update = (field: keyof typeof form, value: string) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.full_name.trim() || !form.email.trim() || !form.phone.trim()) {
      setError('Please fill in your name, email, and phone number.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await submitApplication({
        job_id: jobId,
        full_name: form.full_name,
        email: form.email,
        phone: form.phone,
        address: form.address,
        cover_letter: form.cover_letter,
        experience: form.experience,
        availability: form.availability,
      });
      setSuccess(true);
    } catch {
      setError('Unable to submit your application. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-red-200 border-t-[#E30613] rounded-full animate-spin" />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center px-4 py-16">
        <div className="max-w-lg w-full bg-white rounded-2xl shadow-lg border border-gray-200 p-8 text-center">
          <div className="w-16 h-16 bg-green-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-black mb-3">Application Submitted!</h2>
          <p className="text-gray-600 mb-2">
            Thank you for applying to <span className="font-semibold text-black">{job?.title}</span> at Petro-Canada.
          </p>
          <p className="text-gray-500 text-sm mb-6">
            We've received your application and will contact you at <span className="font-medium text-gray-700">{form.email}</span> if your qualifications match our needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={() => navigate({ name: 'home' })}
              className="bg-[#E30613] text-white font-bold px-6 py-3 rounded-lg hover:bg-red-700 transition-colors"
            >
              Back to Jobs
            </button>
            <button
              onClick={() => navigate({ name: 'signIn' })}
              className="border-2 border-gray-300 text-gray-700 font-bold px-6 py-3 rounded-lg hover:border-gray-400 transition-colors"
            >
              Track My Application
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center">
        <p className="text-red-600 text-lg">Job not found.</p>
        <button onClick={() => navigate({ name: 'home' })} className="mt-4 text-[#E30613] font-semibold hover:underline">
          Back to Home
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-[70vh] bg-gray-50 py-8 sm:py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <button
          onClick={() => navigate({ name: 'jobDetail', jobId })}
          className="text-sm font-medium text-gray-600 hover:text-[#E30613] flex items-center gap-1.5 mb-6 transition-colors"
        >
          <ChevronLeft className="w-4 h-4" /> Back to job details
        </button>

        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 border-b border-gray-200 px-6 sm:px-8 py-6">
            <h1 className="text-2xl font-bold text-black mb-2">Apply for: {job.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-gray-500">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-4 h-4" /> {job.employment_type}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="w-4 h-4" /> {job.store?.address}, Winnipeg
              </span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="px-6 sm:px-8 py-8 space-y-6">
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                <p className="text-sm text-red-700">{error}</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Full Name" required>
                <input
                  type="text"
                  value={form.full_name}
                  onChange={e => update('full_name', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="John Smith"
                  required
                />
              </Field>
              <Field label="Email Address" required>
                <input
                  type="email"
                  value={form.email}
                  onChange={e => update('email', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="john.smith@email.com"
                  required
                />
              </Field>
              <Field label="Phone Number" required>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={e => update('phone', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="(204) 123-4567"
                  required
                />
              </Field>
              <Field label="Home Address">
                <input
                  type="text"
                  value={form.address}
                  onChange={e => update('address', e.target.value)}
                  className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                  placeholder="123 Main St, Winnipeg, MB"
                />
              </Field>
            </div>

            <Field label="Relevant Experience">
              <textarea
                value={form.experience}
                onChange={e => update('experience', e.target.value)}
                rows={4}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                placeholder="Describe your previous work experience, especially in retail, customer service, or gas station operations..."
              />
            </Field>

            <Field label="Availability">
              <input
                type="text"
                value={form.availability}
                onChange={e => update('availability', e.target.value)}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none"
                placeholder="e.g. Weekdays 8am-4pm, Weekends, Evenings, Full-time availability"
              />
            </Field>

            <Field label="Cover Letter / Message to Hiring Manager">
              <textarea
                value={form.cover_letter}
                onChange={e => update('cover_letter', e.target.value)}
                rows={5}
                className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:ring-2 focus:ring-red-500 focus:border-red-500 outline-none resize-none"
                placeholder="Tell us why you'd be a great fit for this role at Petro-Canada..."
              />
            </Field>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#E30613] text-white font-bold py-3.5 rounded-xl hover:bg-red-700 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                {submitting ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Submitting...
                  </>
                ) : (
                  'Submit Application'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div>
      <label className="text-sm font-semibold text-black mb-1.5 block">
        {label} {required && <span className="text-[#E30613]">*</span>}
      </label>
      {children}
    </div>
  );
}
