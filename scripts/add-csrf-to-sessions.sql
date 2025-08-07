-- Add CSRF token column to sessions table for hybrid authentication
-- Run this in Supabase Dashboard > SQL Editor

-- Add csrf_token column to sessions table
ALTER TABLE public.sessions 
ADD COLUMN IF NOT EXISTS csrf_token TEXT;

-- Create index for CSRF token lookups
CREATE INDEX IF NOT EXISTS idx_sessions_csrf_token ON public.sessions(csrf_token);

-- Update existing sessions to have a placeholder CSRF token (optional)
-- UPDATE public.sessions SET csrf_token = 'legacy_session' WHERE csrf_token IS NULL;

-- Verify the column was added
SELECT 
    column_name,
    data_type,
    is_nullable
FROM information_schema.columns 
WHERE table_name = 'sessions' 
AND column_name = 'csrf_token'
AND table_schema = 'public'; 