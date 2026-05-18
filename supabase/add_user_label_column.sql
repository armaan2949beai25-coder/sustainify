-- Run once in Supabase SQL Editor (stores visitor email for Live Community Impact)
ALTER TABLE public.user_sdg_progress
ADD COLUMN IF NOT EXISTS user_label text;

COMMENT ON COLUMN public.user_sdg_progress.user_label IS 'Logged-in user email at time of click';
