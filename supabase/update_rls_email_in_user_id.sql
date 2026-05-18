-- Run this in Supabase SQL Editor (required for saving emails in user_id)
-- Allows user_id format: "your-uuid|you@email.com"

DROP POLICY IF EXISTS "Users can insert own progress" ON public.user_sdg_progress;

CREATE POLICY "Users can insert own progress"
ON public.user_sdg_progress
FOR INSERT
TO authenticated
WITH CHECK (
  user_id IS NULL
  OR user_id = auth.uid()::text
  OR split_part(user_id, '|', 1) = auth.uid()::text
);
