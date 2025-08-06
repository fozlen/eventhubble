-- Check users table structure
-- Run this first to see what columns exist

-- Show table structure
\d users;

-- Or use this query to see column names
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns 
WHERE table_name = 'users' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Show sample data
SELECT * FROM users LIMIT 5; 