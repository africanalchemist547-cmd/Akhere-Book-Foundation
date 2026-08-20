-- ============================================================
-- Akhere Book Foundation (ABF) — Authoritative Database Schema
-- Stage 3A: Production Preparation
-- Version: 2.0 (Corrected — Security Review Pass)
-- ============================================================
-- IMPORTANT: Run this entire script in one pass in the
-- Supabase SQL Editor. Do not split it into parts.
-- ============================================================


-- ─── EXTENSIONS ──────────────────────────────────────────────
-- Enable pgcrypto for gen_random_uuid() (available by default in Supabase)
-- uuid-ossp is not strictly required but included for compatibility
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";


-- ─── SHARED TRIGGER: AUTO-UPDATE updated_at ──────────────────
-- This function is reused by all tables that have an updated_at column.
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;


-- ─── ADMIN CHECK HELPER FUNCTION ─────────────────────────────
-- PURPOSE: Provides a safe, non-recursive way for RLS policies to check
-- whether the currently authenticated user is an ABF administrator.
--
-- WHY SECURITY DEFINER?
-- Without SECURITY DEFINER, a function called from inside an RLS policy
-- runs with the permissions of the calling user (the anon/authenticated role).
-- That means the function itself would be blocked by the RLS policy on
-- admin_users when it tries to query it — causing infinite recursion or
-- permission errors. SECURITY DEFINER causes the function to execute with
-- the permissions of the function OWNER (postgres/service role), bypassing
-- RLS on the admin_users table safely from within the function body only.
--
-- WHY search_path = ''?
-- Setting an empty search_path prevents search_path injection attacks
-- where a malicious user creates a schema that shadows system functions.
-- All references inside the function use fully qualified names (public.admin_users).
--
-- BEHAVIOUR:
-- - Returns false if the user is not authenticated (auth.uid() is null)
-- - Returns false if the user's UID is not in admin_users
-- - Returns true only if the user's UID exists in admin_users
CREATE OR REPLACE FUNCTION public.abf_is_admin()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = ''
AS $$
DECLARE
  _uid uuid;
BEGIN
  -- Get the current authenticated user's UUID
  _uid := auth.uid();

  -- If not authenticated at all, return false immediately
  IF _uid IS NULL THEN
    RETURN false;
  END IF;

  -- Check if this UID exists in the admin allowlist
  -- Uses EXISTS for efficiency — stops at first match
  RETURN EXISTS (
    SELECT 1
    FROM public.admin_users
    WHERE id = _uid
  );
END;
$$;

-- Restrict execution of this function to authenticated users only.
-- Anonymous users cannot call this function directly.
REVOKE ALL ON FUNCTION public.abf_is_admin() FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.abf_is_admin() TO authenticated;


-- ─── ADMIN USERS TABLE ───────────────────────────────────────
-- This is the ABF administrator allowlist.
-- It maps Supabase Auth user UUIDs to their email addresses.
-- Only UIDs listed here gain admin privileges via abf_is_admin().
--
-- BOOTSTRAP: The first admin row MUST be inserted using the Supabase
-- Dashboard > Table Editor (or SQL Editor with service-role connection)
-- after creating your first Supabase Auth user.
-- See the setup guide Section 6 for exact steps.
-- There is deliberately no public INSERT policy on this table.
CREATE TABLE public.admin_users (
  id         uuid        PRIMARY KEY,  -- Must match auth.users.id exactly
  email      text        NOT NULL UNIQUE,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS on admin_users
ALTER TABLE public.admin_users ENABLE ROW LEVEL SECURITY;

-- Admins can read the admin list (uses the safe helper — no recursion)
-- Note: abf_is_admin() uses SECURITY DEFINER so it safely reads admin_users
-- without being blocked by this policy.
CREATE POLICY "Admins can view admin list"
  ON public.admin_users
  FOR SELECT
  TO authenticated
  USING (public.abf_is_admin());

-- Admins can manage the admin list (e.g. add/remove admins via dashboard)
CREATE POLICY "Admins can insert admins"
  ON public.admin_users
  FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete admins"
  ON public.admin_users
  FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());

-- IMPORTANT: There is NO public (anon) policy on admin_users.
-- Anonymous visitors cannot read, insert, update, or delete admin records.


-- ─── TEAM MEMBERS ────────────────────────────────────────────
CREATE TABLE public.team_members (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  slug          text        NOT NULL UNIQUE,
  role          text        NOT NULL,
  short_bio     text        NOT NULL,
  full_story    text        NOT NULL,
  image_url     text        NOT NULL,
  featured      boolean     NOT NULL DEFAULT false,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_team_members_slug  ON public.team_members(slug);
CREATE INDEX idx_team_members_order ON public.team_members(display_order);

CREATE TRIGGER trg_team_members_updated_at
  BEFORE UPDATE ON public.team_members
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

-- Public visitors can read all team members (no draft state required at this stage)
CREATE POLICY "Public can read team members"
  ON public.team_members FOR SELECT
  USING (true);

-- Only verified ABF admins can write
CREATE POLICY "Admins can insert team members"
  ON public.team_members FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update team members"
  ON public.team_members FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete team members"
  ON public.team_members FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── PROJECTS ────────────────────────────────────────────────
-- status values: 'pending' | 'in_progress' | 'finished'
CREATE TABLE public.projects (
  id               uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title            text        NOT NULL,
  slug             text        NOT NULL UNIQUE,
  status           text        NOT NULL DEFAULT 'pending'
                               CHECK (status IN ('pending', 'in_progress', 'finished')),
  short_description text       NOT NULL,
  full_description  text       NOT NULL,
  location         text        NOT NULL,
  start_date       date,
  completion_date  date,
  cover_image      text        NOT NULL,
  youtube_url      text,
  featured         boolean     NOT NULL DEFAULT false,
  display_order    integer     NOT NULL DEFAULT 0,
  created_at       timestamptz NOT NULL DEFAULT now(),
  updated_at       timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_projects_slug   ON public.projects(slug);
CREATE INDEX idx_projects_status ON public.projects(status);
CREATE INDEX idx_projects_order  ON public.projects(display_order);

CREATE TRIGGER trg_projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- All projects are publicly visible (no draft states at this stage)
CREATE POLICY "Public can read projects"
  ON public.projects FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert projects"
  ON public.projects FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update projects"
  ON public.projects FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete projects"
  ON public.projects FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── POSTS (LATEST FROM ABF / BLOG) ─────────────────────────
-- category values: 'projects' | 'events' | 'news_impact'
--
-- published column: false = draft, true = live
-- Public SELECT policy only returns published posts.
-- Drafts are only visible to admins.
--
-- project_id FK: ON DELETE SET NULL preserves posts if a project is deleted.
-- The post remains but loses its project association.
CREATE TABLE public.posts (
  id           uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  title        text        NOT NULL,
  slug         text        NOT NULL UNIQUE,
  category     text        NOT NULL
               CHECK (category IN ('projects', 'events', 'news_impact')),
  excerpt      text        NOT NULL,
  content      text        NOT NULL,
  cover_image  text        NOT NULL,
  youtube_url  text,
  published_at timestamptz NOT NULL DEFAULT now(),
  published    boolean     NOT NULL DEFAULT true,
  featured     boolean     NOT NULL DEFAULT false,
  project_id   uuid        REFERENCES public.projects(id) ON DELETE SET NULL,
  author       text        NOT NULL,
  created_at   timestamptz NOT NULL DEFAULT now(),
  updated_at   timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_posts_slug      ON public.posts(slug);
CREATE INDEX idx_posts_published ON public.posts(published_at DESC);
CREATE INDEX idx_posts_category  ON public.posts(category);

CREATE TRIGGER trg_posts_updated_at
  BEFORE UPDATE ON public.posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.posts ENABLE ROW LEVEL SECURITY;

-- Public visitors only see published posts
CREATE POLICY "Public can read published posts"
  ON public.posts FOR SELECT
  USING (published = true);

-- Admins can see all posts including drafts
CREATE POLICY "Admins can read all posts"
  ON public.posts FOR SELECT
  TO authenticated
  USING (public.abf_is_admin());

CREATE POLICY "Admins can insert posts"
  ON public.posts FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update posts"
  ON public.posts FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete posts"
  ON public.posts FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── PARTNERS ────────────────────────────────────────────────
CREATE TABLE public.partners (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  name          text        NOT NULL,
  logo_url      text        NOT NULL,
  website_url   text,
  display_order integer     NOT NULL DEFAULT 0,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_partners_order ON public.partners(display_order);

CREATE TRIGGER trg_partners_updated_at
  BEFORE UPDATE ON public.partners
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.partners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read partners"
  ON public.partners FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert partners"
  ON public.partners FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update partners"
  ON public.partners FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete partners"
  ON public.partners FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── LIBRARY / IMPACT STATISTICS ─────────────────────────────
-- Controlled key-value store for named impact statistics.
-- Allows the Admin Dashboard to update numbers without touching React code.
CREATE TABLE public.library_statistics (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  metric_key    text        NOT NULL UNIQUE,
  label         text        NOT NULL,
  value         text        NOT NULL,
  description   text,
  display_order integer     NOT NULL DEFAULT 0,
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_statistics_key   ON public.library_statistics(metric_key);
CREATE INDEX idx_statistics_order ON public.library_statistics(display_order);

CREATE TRIGGER trg_statistics_updated_at
  BEFORE UPDATE ON public.library_statistics
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.library_statistics ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read statistics"
  ON public.library_statistics FOR SELECT
  USING (true);

CREATE POLICY "Admins can insert statistics"
  ON public.library_statistics FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update statistics"
  ON public.library_statistics FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete statistics"
  ON public.library_statistics FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── DONATION FAQS ───────────────────────────────────────────
CREATE TABLE public.donation_faqs (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  question      text        NOT NULL,
  answer        text        NOT NULL,
  display_order integer     NOT NULL DEFAULT 0,
  active        boolean     NOT NULL DEFAULT true,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_donation_faqs_order ON public.donation_faqs(display_order);

CREATE TRIGGER trg_donation_faqs_updated_at
  BEFORE UPDATE ON public.donation_faqs
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE public.donation_faqs ENABLE ROW LEVEL SECURITY;

-- Public visitors only see active FAQs
CREATE POLICY "Public can read active donation FAQs"
  ON public.donation_faqs FOR SELECT
  USING (active = true);

CREATE POLICY "Admins can insert donation FAQs"
  ON public.donation_faqs FOR INSERT
  TO authenticated
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can update donation FAQs"
  ON public.donation_faqs FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete donation FAQs"
  ON public.donation_faqs FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── VOLUNTEER SUBMISSIONS ───────────────────────────────────
-- Security model:
--   anon: INSERT only (submit form). Cannot read any submissions.
--   authenticated non-admin: no access.
--   admin: full read/update/delete access.
--
-- Status is enforced by a database DEFAULT and CHECK constraint.
-- Even if an anonymous visitor passes status = 'contacted' in their
-- INSERT, the WITH CHECK on the policy enforces status = 'new',
-- meaning the database rejects any row where status != 'new' from anon.
CREATE TABLE public.volunteer_submissions (
  id                     uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name              text        NOT NULL,
  email                  text        NOT NULL,
  phone                  text        NOT NULL,
  age_range              text        NOT NULL,
  location               text        NOT NULL,
  motivation             text        NOT NULL,
  contribution_areas     text[]      NOT NULL,
  skills                 text,
  availability           text        NOT NULL,
  additional_information text,
  consent                boolean     NOT NULL CHECK (consent = true),
  status                 text        NOT NULL DEFAULT 'new'
                         CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
  created_at             timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.volunteer_submissions ENABLE ROW LEVEL SECURITY;

-- Public visitors (anon and authenticated) can submit but ONLY with status = 'new'
-- This prevents a visitor from manipulating their own status on submission
CREATE POLICY "Public can submit volunteer application"
  ON public.volunteer_submissions FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent = true
    AND status = 'new'
  );

-- Admins can read all submissions
CREATE POLICY "Admins can read volunteer submissions"
  ON public.volunteer_submissions FOR SELECT
  TO authenticated
  USING (public.abf_is_admin());

-- Admins can update status fields
CREATE POLICY "Admins can update volunteer submissions"
  ON public.volunteer_submissions FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

-- Admins can delete submissions
CREATE POLICY "Admins can delete volunteer submissions"
  ON public.volunteer_submissions FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── PARTNERSHIP INQUIRIES ───────────────────────────────────
-- partnership_areas values (stored as text array):
--   financial_support, books_resources, skills_expertise,
--   volunteer_support, project_partnership, corporate_partnership, other
--
-- person_type values: individual | business | other
CREATE TABLE public.partnership_inquiries (
  id                 uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  person_type        text        NOT NULL
                     CHECK (person_type IN ('individual', 'business', 'other')),
  name               text        NOT NULL,
  organisation       text,
  email              text        NOT NULL,
  phone              text        NOT NULL,
  partnership_areas  text[]      NOT NULL,
  message            text        NOT NULL,
  consent            boolean     NOT NULL CHECK (consent = true),
  status             text        NOT NULL DEFAULT 'new'
                     CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
  created_at         timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.partnership_inquiries ENABLE ROW LEVEL SECURITY;

-- Public visitors (anon and authenticated) can submit partnership inquiries with status = 'new' only
CREATE POLICY "Public can submit partnership inquiry"
  ON public.partnership_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (
    consent = true
    AND status = 'new'
  );

CREATE POLICY "Admins can read partnership inquiries"
  ON public.partnership_inquiries FOR SELECT
  TO authenticated
  USING (public.abf_is_admin());

CREATE POLICY "Admins can update partnership inquiries"
  ON public.partnership_inquiries FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete partnership inquiries"
  ON public.partnership_inquiries FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ─── DONATION INQUIRIES ──────────────────────────────────────
-- donation_type: 'money' | 'books'
-- amount and frequency are nullable (not applicable for book donations)
-- This is NOT a payment processing table. No payment data is stored here.
CREATE TABLE public.donation_inquiries (
  id            uuid        PRIMARY KEY DEFAULT gen_random_uuid(),
  donation_type text        NOT NULL
                CHECK (donation_type IN ('money', 'books')),
  amount        numeric,
  frequency     text
                CHECK (frequency IN ('one-time', 'weekly', 'bi-weekly', 'monthly')),
  name          text        NOT NULL,
  email         text        NOT NULL,
  phone         text        NOT NULL,
  question      text,
  status        text        NOT NULL DEFAULT 'new'
                CHECK (status IN ('new', 'reviewed', 'contacted', 'archived')),
  created_at    timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.donation_inquiries ENABLE ROW LEVEL SECURITY;

-- Public visitors (anon and authenticated) can submit donation inquiries with status = 'new' only
CREATE POLICY "Public can submit donation inquiry"
  ON public.donation_inquiries FOR INSERT
  TO anon, authenticated
  WITH CHECK (status = 'new');

CREATE POLICY "Admins can read donation inquiries"
  ON public.donation_inquiries FOR SELECT
  TO authenticated
  USING (public.abf_is_admin());

CREATE POLICY "Admins can update donation inquiries"
  ON public.donation_inquiries FOR UPDATE
  TO authenticated
  USING (public.abf_is_admin())
  WITH CHECK (public.abf_is_admin());

CREATE POLICY "Admins can delete donation inquiries"
  ON public.donation_inquiries FOR DELETE
  TO authenticated
  USING (public.abf_is_admin());


-- ============================================================
-- STORAGE POLICIES NOTE
-- ============================================================
-- Supabase Storage bucket policies are managed separately from
-- table RLS policies. After creating the Supabase project and
-- running this SQL:
--
-- 1. Go to Storage > New Bucket
-- 2. Name it: abf-assets
-- 3. Set it to PUBLIC (so the website can display images via URL)
-- 4. In Storage > Policies, add the following policies:
--
--    Bucket: abf-assets
--    Policy 1 — Public read access:
--      Operation: SELECT
--      Target roles: anon, authenticated
--      USING: bucket_id = 'abf-assets'
--
--    Policy 2 — Admin upload access:
--      Operation: INSERT
--      Target roles: authenticated
--      WITH CHECK: bucket_id = 'abf-assets' AND public.abf_is_admin()
--
--    Policy 3 — Admin update access:
--      Operation: UPDATE
--      Target roles: authenticated
--      USING: bucket_id = 'abf-assets' AND public.abf_is_admin()
--
--    Policy 4 — Admin delete access:
--      Operation: DELETE
--      Target roles: authenticated
--      USING: bucket_id = 'abf-assets' AND public.abf_is_admin()
--
-- Anonymous visitors have NO upload, update, or delete access.
-- ============================================================


-- ============================================================
-- FIRST ADMIN BOOTSTRAP INSTRUCTIONS
-- ============================================================
-- Because admin_users has no public INSERT policy, the first
-- administrator cannot self-register. This is intentional.
-- Follow these steps after running this SQL:
--
-- STEP 1: Create your first Supabase Auth user
--   Go to: Supabase Dashboard > Authentication > Users
--   Click "Add user" > "Create new user"
--   Enter the admin email and a secure password.
--   Copy the generated UUID shown in the Users table.
--
-- STEP 2: Insert the admin row using the SQL Editor
--   In Supabase Dashboard > SQL Editor, run:
--
--   INSERT INTO public.admin_users (id, email)
--   VALUES (
--     'PASTE-THE-UUID-HERE',
--     'admin@youremail.com'
--   );
--
--   Replace PASTE-THE-UUID-HERE with the exact UUID from Step 1.
--   Replace admin@youremail.com with the matching email address.
--
-- STEP 3: Verify
--   SELECT * FROM public.admin_users;
--   You should see one row.
--
-- All subsequent admin management can be done through the
-- Stage 4 Admin Dashboard (once built) or directly via the
-- Supabase Dashboard SQL Editor.
-- ============================================================
