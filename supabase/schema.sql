-- 50 DAYS DSA CHALLENGE - PRODUCTION DATABASE SCHEMA FOR SUPABASE
-- Run this script in the Supabase SQL Editor to set up all tables, constraints, RLS policies, and triggers.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. CHALLENGE SETTINGS TABLE
CREATE TABLE IF NOT EXISTS public.challenge_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    challenge_name TEXT NOT NULL DEFAULT '50 Days DSA Challenge',
    start_date DATE NOT NULL DEFAULT '2026-11-21',
    end_date DATE NOT NULL DEFAULT '2027-01-09',
    timezone TEXT NOT NULL DEFAULT 'Asia/Kolkata',
    total_days INT NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 2. ALLOWED EMAILS (Access Control Allowlist)
CREATE TABLE IF NOT EXISTS public.allowed_emails (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('admin', 'participant')),
    is_active BOOLEAN NOT NULL DEFAULT true,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 3. PARTICIPANTS TABLE
CREATE TABLE IF NOT EXISTS public.participants (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    auth_user_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'participant' CHECK (role IN ('admin', 'participant')),
    avatar_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 4. PROBLEMS TABLE (50 Days DSA Roadmap)
CREATE TABLE IF NOT EXISTS public.problems (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    day_number INT UNIQUE NOT NULL CHECK (day_number BETWEEN 1 AND 50),
    week_number INT NOT NULL CHECK (week_number BETWEEN 1 AND 8),
    title TEXT NOT NULL,
    leetcode_url TEXT NOT NULL,
    topic TEXT NOT NULL,
    difficulty TEXT NOT NULL CHECK (difficulty IN ('Easy', 'Medium', 'Hard')),
    description TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- 5. SUBMISSIONS TABLE
CREATE TABLE IF NOT EXISTS public.submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id UUID NOT NULL REFERENCES public.participants(id) ON DELETE CASCADE,
    challenge_day INT NOT NULL CHECK (challenge_day BETWEEN 1 AND 50),
    assigned_problem_id UUID NOT NULL REFERENCES public.problems(id) ON DELETE RESTRICT,
    solved_previously BOOLEAN NOT NULL DEFAULT false,
    alternative_problem_name TEXT,
    alternative_problem_url TEXT,
    github_url TEXT NOT NULL,
    notes TEXT,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    verification_status TEXT NOT NULL DEFAULT 'verified' CHECK (verification_status IN ('verified', 'pending', 'flagged')),
    reviewed_at TIMESTAMPTZ,
    reviewed_by UUID REFERENCES public.participants(id),
    is_day_50_assessment BOOLEAN DEFAULT false,
    day_50_data JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
    -- CRITICAL RULE: Prevent duplicate submissions for the same participant and challenge day
    CONSTRAINT unique_participant_challenge_day UNIQUE (participant_id, challenge_day)
);

-- 6. ADMIN AUDIT LOGS
CREATE TABLE IF NOT EXISTS public.admin_audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    admin_id UUID REFERENCES public.participants(id),
    action TEXT NOT NULL,
    target_type TEXT NOT NULL,
    target_id TEXT,
    details JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- INDEXES FOR PERFORMANCE
CREATE INDEX IF NOT EXISTS idx_submissions_participant_id ON public.submissions(participant_id);
CREATE INDEX IF NOT EXISTS idx_submissions_challenge_day ON public.submissions(challenge_day);
CREATE INDEX IF NOT EXISTS idx_submissions_submitted_at ON public.submissions(submitted_at DESC);
CREATE INDEX IF NOT EXISTS idx_problems_day_number ON public.problems(day_number);
CREATE INDEX IF NOT EXISTS idx_participants_email ON public.participants(email);
CREATE INDEX IF NOT EXISTS idx_allowed_emails_email ON public.allowed_emails(email);

-- ROW LEVEL SECURITY (RLS) POLICIES
ALTER TABLE public.challenge_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.allowed_emails ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.problems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.admin_audit_logs ENABLE ROW LEVEL SECURITY;

-- Helper function to check if current auth user is admin
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.participants
    WHERE auth_user_id = auth.uid() AND role = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to check if an email is on the active allowlist
CREATE OR REPLACE FUNCTION public.is_email_allowed(user_email TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM public.allowed_emails
    WHERE LOWER(email) = LOWER(user_email) AND is_active = true
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 1. challenge_settings: Read by all authenticated users, write only by admins
CREATE POLICY "Allow public read of settings"
    ON public.challenge_settings FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow admin write of settings"
    ON public.challenge_settings FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 2. allowed_emails: Read allowed for auth checking, manage only by admins
CREATE POLICY "Allow authenticated read allowed_emails"
    ON public.allowed_emails FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow admin manage allowed_emails"
    ON public.allowed_emails FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 3. problems: Read by everyone, manage only by admins
CREATE POLICY "Allow read problems"
    ON public.problems FOR SELECT
    TO authenticated, anon
    USING (true);

CREATE POLICY "Allow admin manage problems"
    ON public.problems FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- 4. participants: Read by all authenticated users (for community & leaderboard)
CREATE POLICY "Allow read participants"
    ON public.participants FOR SELECT
    TO authenticated
    USING (true);

CREATE POLICY "Allow users update own participant profile"
    ON public.participants FOR UPDATE
    TO authenticated
    USING (auth_user_id = auth.uid() OR public.is_admin())
    WITH CHECK (auth_user_id = auth.uid() OR public.is_admin());

-- 5. submissions:
-- Read: all authenticated participants can view submissions (community feed, leaderboard)
CREATE POLICY "Allow read submissions"
    ON public.submissions FOR SELECT
    TO authenticated
    USING (true);

-- Insert: participant can only insert their own submission
CREATE POLICY "Allow insert own submission"
    ON public.submissions FOR INSERT
    TO authenticated
    WITH CHECK (
        participant_id IN (
            SELECT id FROM public.participants WHERE auth_user_id = auth.uid()
        )
    );

-- Update: only admin can modify submission (verify / flag / edit)
CREATE POLICY "Allow admin update submissions"
    ON public.submissions FOR UPDATE
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());

-- Delete: only admin can delete submissions
CREATE POLICY "Allow admin delete submissions"
    ON public.submissions FOR DELETE
    TO authenticated
    USING (public.is_admin());

-- 6. audit logs: only admin can read and insert
CREATE POLICY "Admin audit log access"
    ON public.admin_audit_logs FOR ALL
    TO authenticated
    USING (public.is_admin())
    WITH CHECK (public.is_admin());
