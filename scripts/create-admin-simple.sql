-- =============================================
-- Basit Admin Kullanıcısı Oluşturma
-- =============================================
-- 
-- Şifre: admin12345
-- Email: admin@eventhubble.com
-- =============================================

-- Önce users tablosunun yapısını kontrol et
\d users;

-- Admin kullanıcısını oluştur (eğer yoksa)
INSERT INTO users (
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'admin@eventhubble.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin',
    true,
    NOW(),
    NOW()
) ON CONFLICT (email) DO NOTHING;

-- Oluşturulan kullanıcıyı göster
SELECT 
    id,
    email,
    role,
    is_active,
    created_at
FROM users 
WHERE email = 'admin@eventhubble.com'; 