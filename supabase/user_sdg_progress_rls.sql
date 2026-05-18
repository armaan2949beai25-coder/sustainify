-- =============================================================================
-- Run this in Supabase Dashboard → SQL Editor
-- Fixes: "new row violates row-level security policy" on user_sdg_progress
-- =============================================================================

-- Optional: create table if you have not already
-- CREATE TABLE IF NOT EXISTS public.user_sdg_progress (
--   id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
--   user_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
--   action_type text NOT NULL,
--   goal_id text,
--   created_at timestamptz NOT NULL DEFAULT now()
-- );

ALTER TABLE public.user_sdg_progress ENABLE ROW LEVEL SECURITY;

-- Remove old policies if re-running (adjust names if yours differ)
DROP POLICY IF EXISTS "Allow public inserts for tracking" ON public.user_sdg_progress;
DROP POLICY IF EXISTS "Allow public read for live feed" ON public.user_sdg_progress;
DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_sdg_progress;
DROP POLICY IF EXISTS "Anyone can read community feed" ON public.user_sdg_progress;

-- Allow signed-in users to log their own clicks
-- Note: user_id column is TEXT in this project; auth.uid() is UUID — cast required
CREATE POLICY "Users can insert own progress"
ON public.user_sdg_progress
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NULL
  OR user_id = auth.uid()::text
  OR split_part(user_id, '|', 1) = auth.uid()::text
);

-- Allow anonymous visitors to log clicks (optional; remove if you require login only)
CREATE POLICY "Allow anon inserts for tracking"
ON public.user_sdg_progress
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Everyone can read the live community feed
CREATE POLICY "Anyone can read community feed"
ON public.user_sdg_progress
FOR SELECT
TO anon, authenticated
USING (true);
