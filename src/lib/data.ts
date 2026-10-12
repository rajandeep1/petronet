import { supabase } from './supabase';
import type { Store, Job, Application } from '../types';

// ---- Stores ----
export async function fetchStores(): Promise<Store[]> {
  const { data, error } = await supabase
    .from('stores')
    .select('*')
    .order('address', { ascending: true });
  if (error) throw error;
  return data ?? [];
}

export async function createStore(input: Omit<Store, 'id' | 'created_at' | 'name' | 'city' | 'province'> & { name?: string }): Promise<Store> {
  const { data, error } = await supabase
    .from('stores')
    .insert({
      name: input.name || 'Petro-Canada',
      address: input.address,
      city: 'Winnipeg',
      province: 'MB',
      postal_code: input.postal_code,
      phone: input.phone,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStore(id: string): Promise<void> {
  const { error } = await supabase.from('stores').delete().eq('id', id);
  if (error) throw error;
}

// ---- Jobs ----
export async function fetchJobs(filters?: { employmentType?: string; storeId?: string; status?: string }): Promise<Job[]> {
  let query = supabase
    .from('jobs')
    .select('*, store:stores(*)')
    .order('created_at', { ascending: false });

  if (filters?.employmentType && filters.employmentType !== 'all') {
    query = query.eq('employment_type', filters.employmentType);
  }
  if (filters?.storeId && filters.storeId !== 'all') {
    query = query.eq('store_id', filters.storeId);
  }
  if (filters?.status && filters.status !== 'all') {
    query = query.eq('status', filters.status);
  }

  const { data, error } = await query;
  if (error) throw error;
  return data ?? [];
}

export async function fetchJobById(id: string): Promise<Job | null> {
  const { data, error } = await supabase
    .from('jobs')
    .select('*, store:stores(*)')
    .eq('id', id)
    .maybeSingle();
  if (error) throw error;
  return data;
}

export async function createJob(input: {
  store_id: string;
  title: string;
  description: string;
  requirements: string;
  employment_type: 'Part-time' | 'Full-time';
  salary_range: string;
}): Promise<Job> {
  const { data, error } = await supabase
    .from('jobs')
    .insert({ ...input, status: 'open' })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateJob(id: string, input: Partial<Pick<Job, 'title' | 'description' | 'requirements' | 'employment_type' | 'salary_range' | 'status'>>): Promise<void> {
  const { error } = await supabase.from('jobs').update(input).eq('id', id);
  if (error) throw error;
}

export async function deleteJob(id: string): Promise<void> {
  const { error } = await supabase.from('jobs').delete().eq('id', id);
  if (error) throw error;
}

// ---- Applications ----
export async function submitApplication(input: {
  job_id: string;
  full_name: string;
  email: string;
  phone: string;
  address: string;
  cover_letter: string;
  experience: string;
  availability: string;
}): Promise<Application> {
  const { data, error } = await supabase
    .from('applications')
    .insert(input)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function fetchApplicationsByEmail(email: string): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(*, store:stores(*))')
    .ilike('email', email)
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function fetchAllApplications(): Promise<Application[]> {
  const { data, error } = await supabase
    .from('applications')
    .select('*, job:jobs(*, store:stores(*))')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function updateApplicationStatus(id: string, status: Application['status']): Promise<void> {
  const { error } = await supabase.from('applications').update({ status }).eq('id', id);
  if (error) throw error;
}

export async function deleteApplication(id: string): Promise<void> {
  const { error } = await supabase.from('applications').delete().eq('id', id);
  if (error) throw error;
}
