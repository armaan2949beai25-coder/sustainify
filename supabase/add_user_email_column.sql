-- Run once in Supabase → SQL Editor (stores visitor email on each click)
ALTER TABLE public.user_sdg_progress
ADD COLUMN IF NOT EXISTS user_email text;
