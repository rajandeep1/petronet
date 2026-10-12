export interface Store {
  id: string;
  name: string;
  address: string;
  city: string;
  province: string;
  postal_code: string | null;
  phone: string | null;
  created_at: string;
}

export interface Job {
  id: string;
  store_id: string;
  title: string;
  description: string;
  requirements: string | null;
  employment_type: 'Part-time' | 'Full-time';
  salary_range: string | null;
  status: 'open' | 'closed';
  created_at: string;
  store?: Store;
}

export interface Application {
  id: string;
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string | null;
  cover_letter: string | null;
  experience: string | null;
  availability: string | null;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  created_at: string;
  job?: Job;
}

export type Page =
  | { name: 'home' }
  | { name: 'jobDetail'; jobId: string }
  | { name: 'apply'; jobId: string }
  | { name: 'signIn' }
  | { name: 'applicantDashboard' }
  | { name: 'adminLogin' }
  | { name: 'adminDashboard' };
