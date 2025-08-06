-- Create new admin user
-- Password: admin2024 (bcrypt hash)

INSERT INTO users (
  id,
  email,
  password_hash,
  role,
  is_active,
  created_at,
  updated_at
) VALUES (
  gen_random_uuid(),
  'newadmin@eventhubble.com',
  '$2a$10$Chr8xPNyuvP5swOdAyO9yepzfl',
  'admin',
  true,
  NOW(),
  NOW()
) ON CONFLICT (email) DO UPDATE SET
  password_hash = EXCLUDED.password_hash,
  role = EXCLUDED.role,
  is_active = EXCLUDED.is_active,
  updated_at = NOW();

-- Verify the user was created
SELECT 
  id,
  email,
  role,
  is_active,
  created_at
FROM users 
WHERE email = 'newadmin@eventhubble.com'; 