/*
# Petro-Canada Hiring Platform — Database Schema

## Overview
Creates the complete schema for a job hiring platform with three main tables:
- **stores**: Petro-Canada retail locations in Winnipeg, Manitoba
- **jobs**: Job postings tied to specific stores, categorized by position type and schedule
- **applications**: Job applications submitted by applicants, tied to a specific job posting

## Tables

### 1. stores
- `id` (uuid, primary key)
- `name` (text) — display name of the store/brand
- `address` (text) — street address
- `city` (text) — always "Winnipeg"
- `province` (text) — always "MB"
- `postal_code` (text) — Canadian postal code
- `phone` (text) — store phone number
- `created_at` (timestamptz)

### 2. jobs
- `id` (uuid, primary key)
- `store_id` (uuid, foreign key → stores.id)
- `title` (text) — e.g. "Guest Service Attendant", "Cleaner", "Supervisor", "Inventory Manager"
- `description` (text) — detailed job description
- `requirements` (text) — job requirements / qualifications
- `employment_type` (text) — "Part-time" or "Full-time"
- `salary_range` (text) — e.g. "$17.00 - $19.00 / hr"
- `status` (text) — "open" or "closed", defaults to "open"
- `created_at` (timestamptz)

### 3. applications
- `id` (uuid, primary key)
- `job_id` (uuid, foreign key → jobs.id)
- `full_name` (text) — applicant's full name
- `email` (text) — applicant's email
- `phone` (text) — applicant's phone number
- `address` (text) — applicant's address
- `cover_letter` (text) — optional cover letter / message
- `experience` (text) — relevant experience description
- `availability` (text) — availability info (e.g. "Weekdays, Weekends, Evenings")
- `status` (text) — "pending", "reviewing", "accepted", "rejected", defaults to "pending"
- `created_at` (timestamptz)

## Security (RLS)
This app has two user roles:
- **Applicants**: sign up/in via Supabase auth (email/password). They can view open jobs and submit applications.
- **Admins**: sign in via Supabase auth. They can manage stores, jobs, and review applications.

Since the frontend uses the anon key, and we need both public job browsing and authenticated admin access:
- stores: SELECT is public (anon + authenticated); INSERT/UPDATE/DELETE are authenticated only (admin manages)
- jobs: SELECT is public (anon + authenticated); INSERT/UPDATE/DELETE are authenticated only (admin manages)
- applications: SELECT/INSERT available to anon + authenticated (applicants can submit without login, and view by email); UPDATE/DELETE authenticated only (admin manages)

Note: For simplicity in this hiring platform, applicants can apply without creating an account. Admin login uses Supabase auth. All write operations to stores/jobs require authentication.

## Seed Data
After table creation, inserts 8 Petro-Canada store locations in Winnipeg, then creates job postings across those stores.
*/

-- ============================================================
-- 1. STORES TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS stores (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL DEFAULT 'Petro-Canada',
  address text NOT NULL,
  city text NOT NULL DEFAULT 'Winnipeg',
  province text NOT NULL DEFAULT 'MB',
  postal_code text,
  phone text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE stores ENABLE ROW LEVEL SECURITY;

-- Public can read store listings
DROP POLICY IF EXISTS "public_read_stores" ON stores;
CREATE POLICY "public_read_stores" ON stores FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated (admin) can insert/update/delete stores
DROP POLICY IF EXISTS "auth_insert_stores" ON stores;
CREATE POLICY "auth_insert_stores" ON stores FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_stores" ON stores;
CREATE POLICY "auth_update_stores" ON stores FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_stores" ON stores;
CREATE POLICY "auth_delete_stores" ON stores FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 2. JOBS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS jobs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  store_id uuid NOT NULL REFERENCES stores(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text NOT NULL,
  requirements text,
  employment_type text NOT NULL CHECK (employment_type IN ('Part-time', 'Full-time')),
  salary_range text,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open', 'closed')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE jobs ENABLE ROW LEVEL SECURITY;

-- Public can read job listings
DROP POLICY IF EXISTS "public_read_jobs" ON jobs;
CREATE POLICY "public_read_jobs" ON jobs FOR SELECT
  TO anon, authenticated USING (true);

-- Only authenticated (admin) can insert/update/delete jobs
DROP POLICY IF EXISTS "auth_insert_jobs" ON jobs;
CREATE POLICY "auth_insert_jobs" ON jobs FOR INSERT
  TO authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "auth_update_jobs" ON jobs;
CREATE POLICY "auth_update_jobs" ON jobs FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "auth_delete_jobs" ON jobs;
CREATE POLICY "auth_delete_jobs" ON jobs FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 3. APPLICATIONS TABLE
-- ============================================================
CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  job_id uuid NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  address text,
  cover_letter text,
  experience text,
  availability text,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'reviewing', 'accepted', 'rejected')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Public + authenticated can read applications (applicants check status by email, admin sees all)
DROP POLICY IF EXISTS "public_read_applications" ON applications;
CREATE POLICY "public_read_applications" ON applications FOR SELECT
  TO anon, authenticated USING (true);

-- Anyone can submit an application (no account required to apply)
DROP POLICY IF EXISTS "public_insert_applications" ON applications;
CREATE POLICY "public_insert_applications" ON applications FOR INSERT
  TO anon, authenticated WITH CHECK (true);

-- Only authenticated (admin) can update application status
DROP POLICY IF EXISTS "auth_update_applications" ON applications;
CREATE POLICY "auth_update_applications" ON applications FOR UPDATE
  TO authenticated USING (true) WITH CHECK (true);

-- Only authenticated (admin) can delete applications
DROP POLICY IF EXISTS "auth_delete_applications" ON applications;
CREATE POLICY "auth_delete_applications" ON applications FOR DELETE
  TO authenticated USING (true);

-- ============================================================
-- 4. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_jobs_store_id ON jobs(store_id);
CREATE INDEX IF NOT EXISTS idx_jobs_employment_type ON jobs(employment_type);
CREATE INDEX IF NOT EXISTS idx_jobs_status ON jobs(status);
CREATE INDEX IF NOT EXISTS idx_applications_job_id ON applications(job_id);
CREATE INDEX IF NOT EXISTS idx_applications_email ON applications(email);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);

-- ============================================================
-- 5. SEED DATA — WINNIPEG STORES
-- ============================================================
INSERT INTO stores (address, postal_code, phone) VALUES
  ('747 Osborne St.', 'R3L 2C4', '(204) 452-5541'),
  ('1701 Ellice Avenue', 'R3H 0A9', '(204) 775-8805'),
  ('490 Madison Street', 'R3M 0S1', '(204) 772-2355'),
  ('1284 Portage Avenue', 'R3C 0Y9', '(204) 775-0013'),
  ('2012 Pembina Highway', 'R3T 2G1', '(204) 275-3456'),
  ('670 St. Anne''s Road', 'R2N 2C6', '(204) 256-6611'),
  ('1622 St Mary''s Road', 'R2N 3N5', '(204) 985-0179'),
  ('107 Pandora Ave W', 'R2C 1M4', '(204) 222-4086')
ON CONFLICT DO NOTHING;

-- ============================================================
-- 6. SEED DATA — JOB POSTINGS
-- ============================================================
INSERT INTO jobs (store_id, title, description, requirements, employment_type, salary_range, status)
SELECT s.id, j.title, j.description, j.requirements, j.employment_type, j.salary_range, j.status
FROM stores s
CROSS JOIN (VALUES
  ('Guest Service Attendant', 'Provide exceptional customer service at the fuel pumps and convenience store. Handle transactions, assist customers with fuel purchases, loyalty program sign-ups, and maintain a clean welcoming environment.', 'Previous customer service experience preferred. Strong communication skills. Ability to work in a fast-paced environment. Must be able to stand for extended periods.', 'Part-time', '$17.00 - $19.00 / hr', 'open'),
  ('Cleaner', 'Responsible for maintaining cleanliness of the store, restrooms, fuel island area, and parking lot. Includes cleaning windows, floors, restrooms, and disposing of trash regularly.', 'Attention to detail. Ability to work independently. Physical ability to perform cleaning tasks. Reliable and punctual.', 'Part-time', '$16.50 - $18.00 / hr', 'open'),
  ('Supervisor', 'Oversee daily store operations, manage staff schedules, ensure customer satisfaction, handle inventory ordering, and manage cash reconciliation. Report to the store manager.', '1-2 years of retail or gas station experience. Leadership skills. Proficient with point-of-sale systems. Available for flexible scheduling.', 'Full-time', '$22.00 - $26.00 / hr', 'open'),
  ('Inventory Manager', 'Manage all aspects of store inventory including ordering, receiving, stocking, cycle counts, and loss prevention. Coordinate with suppliers and maintain accurate records.', 'Experience in inventory management or retail logistics. Organizational skills. Proficiency with inventory management software. Valid driver''s license preferred.', 'Full-time', '$24.00 - $28.00 / hr', 'open')
) AS j(title, description, requirements, employment_type, salary_range, status)
WHERE NOT EXISTS (SELECT 1 FROM jobs);