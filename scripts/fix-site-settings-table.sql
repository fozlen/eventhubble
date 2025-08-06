-- Fix site_settings table structure
-- Run this in Supabase Dashboard > SQL Editor

-- First, let's see what columns exist in site_settings table
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'site_settings' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Add missing columns if they don't exist
ALTER TABLE public.site_settings 
ADD COLUMN IF NOT EXISTS is_public BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS is_required BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS validation_rules JSONB DEFAULT '{}',
ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Insert some default settings if table is empty
INSERT INTO public.site_settings (
  setting_key,
  setting_value,
  setting_type,
  category,
  description,
  is_public,
  is_required
) VALUES 
  ('site_name', 'EventHubble', 'text', 'general', 'Site name', true, true),
  ('site_description', 'Event management platform', 'text', 'general', 'Site description', true, false),
  ('contact_email', 'admin@eventhubble.com', 'email', 'contact', 'Contact email', true, true),
  ('max_file_size', '10485760', 'number', 'upload', 'Maximum file upload size in bytes', false, false),
  ('enable_analytics', 'true', 'boolean', 'features', 'Enable analytics tracking', false, false),
  ('maintenance_mode', 'false', 'boolean', 'system', 'Enable maintenance mode', false, false)
ON CONFLICT (setting_key) DO NOTHING;

-- Verify the table structure
SELECT 
  setting_key,
  setting_value,
  setting_type,
  category,
  is_public,
  is_required
FROM public.site_settings
ORDER BY category, setting_key; 