-- =============================================
-- Minimal Admin Kullanıcısı Oluşturma
-- =============================================
-- 
-- Şifre: admin12345
-- Email: admin@eventhubble.com
-- =============================================

-- Admin kullanıcısını oluştur
INSERT INTO users (
    email,
    password_hash,
    role,
    is_active
) VALUES (
    'admin@eventhubble.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi',
    'admin',
    true
) ON CONFLICT (email) DO NOTHING;

-- Oluşturulan kullanıcıyı göster
SELECT * FROM users WHERE email = 'admin@eventhubble.com'; 