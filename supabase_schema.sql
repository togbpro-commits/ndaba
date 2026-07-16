-- ==========================================
-- NDABAS ATTORNEYS - SUPABASE DATABASE SETUP
-- ==========================================
-- This script completely instantiates the required tables, enables RLS, 
-- creates storage buckets, and sets up row-level security (RLS) policies 
-- to resolve PGRST205 / PostgREST schema cache errors.
--
-- INSTRUCTIONS:
-- 1. Open your Supabase Dashboard (https://supabase.com).
-- 2. Go to the "SQL Editor" section on the left sidebar.
-- 3. Create a "New Query", paste this entire script, and click "Run".
-- 4. PostgREST will instantly cache the new schema, making tables active!

-- --------------------------------------------------
-- 1. DROP EXISTING TABLES (Safe Cascade for Fresh Run)
-- --------------------------------------------------
DROP TABLE IF EXISTS public.cases CASCADE;
DROP TABLE IF EXISTS public.leads CASCADE;

-- --------------------------------------------------
-- 2. CREATE TABLE: LEADS (Client Contact & Inquiries)
-- --------------------------------------------------
CREATE TABLE public.leads (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT NOT NULL,
    service_type TEXT NOT NULL,
    message TEXT,
    status TEXT NOT NULL DEFAULT 'New' CHECK (status IN ('New', 'Contacted', 'Consultation Booked', 'Client', 'Closed/Lost')),
    notes TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);
-- Create a sequence for sequential case numbers starting at 1001
CREATE SEQUENCE IF NOT EXISTS public.case_number_seq START 1001;

-- --------------------------------------------------
-- 3. CREATE TABLE: CASES (Litigation & Practice Matters)
-- --------------------------------------------------
DROP TABLE IF EXISTS public.cases CASCADE;

CREATE TABLE public.cases (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_number TEXT UNIQUE NOT NULL DEFAULT ('NDB-' || to_char(now(), 'YYYY') || '-' || nextval('public.case_number_seq')::text),
    access_key TEXT NOT NULL DEFAULT upper(substring(gen_random_uuid()::text from 1 for 8)),
    client_name TEXT NOT NULL,
    case_title TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Open' CHECK (status IN ('Open', 'In Progress', 'Awaiting Documents', 'Complete')),
    practice_area TEXT NOT NULL,
    key_dates TEXT,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
    documents JSONB DEFAULT '[]'::jsonb
);
-- --------------------------------------------------
-- 4. ENABLE ROW LEVEL SECURITY (RLS)
-- --------------------------------------------------
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cases ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------
-- 5. ACCESS POLICIES: LEADS TABLE
-- --------------------------------------------------
-- Enable public (anon) and authenticated users to submit leads/forms
CREATE POLICY "Enable insert access for all users" ON public.leads
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Enable public select access so the staff CRM dashboard and tracker can retrieve leads
CREATE POLICY "Enable read access for all users" ON public.leads
    FOR SELECT TO anon, authenticated
    USING (true);

-- Enable updates (like status changes or notes edits) from staff controls
CREATE POLICY "Enable update access for all users" ON public.leads
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Enable deletions from the admin dashboard
CREATE POLICY "Enable delete access for all users" ON public.leads
    FOR DELETE TO anon, authenticated
    USING (true);

-- --------------------------------------------------
-- 6. ACCESS POLICIES: CASES TABLE
-- --------------------------------------------------
-- Enable public insert for new self-onboarding case matters
CREATE POLICY "Enable insert access for cases" ON public.cases
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- Enable public read access so the Client Case Tracker can search and view status timeline
CREATE POLICY "Enable read access for cases" ON public.cases
    FOR SELECT TO anon, authenticated
    USING (true);

-- Enable public updates from admin status selectors
CREATE POLICY "Enable update access for cases" ON public.cases
    FOR UPDATE TO anon, authenticated
    USING (true)
    WITH CHECK (true);

-- Enable delete access from admin dashboard
CREATE POLICY "Enable delete access for cases" ON public.cases
    FOR DELETE TO anon, authenticated
    USING (true);

-- --------------------------------------------------
-- 7. SETUP STORAGE BUCKET: fica-documents
-- --------------------------------------------------
-- Insert storage bucket configuration if it doesn't already exist
INSERT INTO storage.buckets (id, name, public)
VALUES ('fica-documents', 'fica-documents', true)
ON CONFLICT (id) DO UPDATE SET public = true;

-- Configure storage policies for public client uploading of FICA documents

-- Drop existing storage policies if they exist
DROP POLICY IF EXISTS "Allow public inserts on FICA documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public select on FICA documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public updates on FICA documents" ON storage.objects;
DROP POLICY IF EXISTS "Allow public deletes on FICA documents" ON storage.objects;

-- Allow anyone to upload new FICA files
CREATE POLICY "Allow public inserts on FICA documents" ON storage.objects
    FOR INSERT TO anon, authenticated
    WITH CHECK (bucket_id = 'fica-documents');

-- Allow anyone to read/download FICA files
CREATE POLICY "Allow public select on FICA documents" ON storage.objects
    FOR SELECT TO anon, authenticated
    USING (bucket_id = 'fica-documents');

-- Allow anyone to update/replace FICA files
CREATE POLICY "Allow public updates on FICA documents" ON storage.objects
    FOR UPDATE TO anon, authenticated
    USING (bucket_id = 'fica-documents')
    WITH CHECK (bucket_id = 'fica-documents');

-- Allow anyone to delete FICA files
CREATE POLICY "Allow public deletes on FICA documents" ON storage.objects
    FOR DELETE TO anon, authenticated
    USING (bucket_id = 'fica-documents');

-- --------------------------------------------------
-- 8. CREATE TABLE: POPIA_AUDIT_LOGS (Security Compliance Ledger)
-- --------------------------------------------------
DROP TABLE IF EXISTS public.popia_audit_logs CASCADE;

CREATE TABLE public.popia_audit_logs (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    case_id TEXT NOT NULL,
    case_title TEXT NOT NULL,
    document_name TEXT NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('Viewed', 'Approved', 'Rejected', 'Uploaded')),
    user_email TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.popia_audit_logs ENABLE ROW LEVEL SECURITY;

-- Select policy
CREATE POLICY "Enable read access for logs" ON public.popia_audit_logs
    FOR SELECT TO anon, authenticated
    USING (true);

-- Insert policy
CREATE POLICY "Enable insert access for logs" ON public.popia_audit_logs
    FOR INSERT TO anon, authenticated
    WITH CHECK (true);

-- --------------------------------------------------
-- 9. EXPLICIT DATA API GRANTS (Satisfy PostgREST Exposure)
-- --------------------------------------------------
GRANT ALL ON TABLE public.leads TO anon, authenticated, postgres;
GRANT ALL ON TABLE public.cases TO anon, authenticated, postgres;
GRANT ALL ON TABLE public.popia_audit_logs TO anon, authenticated, postgres;

-- --------------------------------------------------
-- 10. RELOAD SCHEMA CACHE
-- --------------------------------------------------
NOTIFY pgrst, 'reload schema';

-- ==========================================
-- SETUP COMPLETE - SYSTEM IS FULLY SYNCED!
-- ==========================================
