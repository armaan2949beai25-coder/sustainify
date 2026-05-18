-- =============================================================================
-- FIRST-TIME SETUP (no DROP) — Supabase will NOT show "destructive" warning
-- Run this in Supabase Dashboard → SQL Editor → Run
-- =============================================================================

ALTER TABLE public.user_sdg_progress ENABLE ROW LEVEL SECURITY;

-- Logged-in users can save their SDG clicks
CREATE POLICY "Users can insert own progress"
ON public.user_sdg_progress
FOR INSERT
TO authenticated
WITH CHECK (user_id IS NULL OR user_id = auth.uid()::text);

-- Anonymous inserts (only if user_id is null)
CREATE POLICY "Allow anon inserts for tracking"
ON public.user_sdg_progress
FOR INSERT
TO anon
WITH CHECK (user_id IS NULL);

-- Live Community Impact feed can read all rows
CREATE POLICY "Anyone can read community feed"
ON public.user_sdg_progress
FOR SELECT
TO anon, authenticated
USING (true);
