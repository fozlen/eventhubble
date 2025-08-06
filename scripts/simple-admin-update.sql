-- Simple Admin Password Update (without full_name)
-- Run this in Supabase Dashboard > SQL Editor

-- First, let's see what columns exist in users table
SELECT 
  column_name,
  data_type
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Then update only the password
UPDATE users 
SET 
  password_hash = '$2a$10$Chr8xPNyuvP5swOdAyO9yepzfKoHNhF8UueFnFpheE1GFEPHz7PAC',
  is_active = true,
  updated_at = NOW()
WHERE email = 'admin@eventhubble.com';

-- Verify the update
SELECT 
  id,
  email,
  role,
  is_active,
  created_at,
  updated_at
FROM users 
WHERE email = 'admin@eventhubble.com'; 