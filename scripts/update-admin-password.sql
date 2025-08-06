-- Event Hubble Admin Password Update Script
-- Run this in Supabase Dashboard > SQL Editor

-- Option 1: Update existing admin user with 'admin123' password
UPDATE users 
SET 
  password_hash = '$2a$10$Chr8xPNyuvP5swOdAyO9yepzfKoHNhF8UueFnFpheE1GFEPHz7PAC',
  full_name = 'Event Hubble Admin',
  role = 'admin',
  is_active = true,
  updated_at = NOW()
WHERE email = 'admin@eventhubble.com';

-- Option 2: If admin doesn't exist, create new admin user
INSERT INTO users (
  email,
  password_hash,
  full_name,
  role,
  is_active,
  preferences,
  created_at,
  updated_at
)
SELECT 
  'admin@eventhubble.com',
  '$2a$10$Chr8xPNyuvP5swOdAyO9yepzfKoHNhF8UueFnFpheE1GFEPHz7PAC',
  'Event Hubble Admin',
  'admin',
  true,
  '{}',
  NOW(),
  NOW()
WHERE NOT EXISTS (
  SELECT 1 FROM users WHERE email = 'admin@eventhubble.com'
);

-- Verify the update
SELECT 
  id,
  email,
  full_name,
  role,
  is_active,
  created_at,
  updated_at
FROM users 
WHERE email = 'admin@eventhubble.com';

-- Alternative: Simple password update (if you want 'password' as password)
-- UPDATE users 
-- SET password_hash = '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi'
-- WHERE email = 'admin@eventhubble.com'; 