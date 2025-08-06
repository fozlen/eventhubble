-- =============================================
-- EventHubble Admin Kullanıcısı Oluşturma Script'i
-- =============================================
-- 
-- Bu script EventHubble veritabanında admin kullanıcısı oluşturur.
-- Şifre: admin12345 (bcrypt ile hash'lenmiş)
-- 
-- Kullanım:
-- 1. Supabase SQL Editor'da çalıştırın
-- 2. Veya psql ile: psql -d your_database -f create-admin-user.sql
-- =============================================

-- Önce mevcut admin kullanıcısını kontrol et
DO $$
BEGIN
    -- Eğer admin kullanıcısı zaten varsa, script'i durdur
    IF EXISTS (
        SELECT 1 FROM users 
        WHERE email = 'admin@eventhubble.com'
    ) THEN
        RAISE NOTICE '⚠️  Admin kullanıcısı zaten mevcut!';
        RAISE NOTICE '📧 Email: admin@eventhubble.com';
        RAISE NOTICE '🔑 Rol: admin';
        RETURN;
    END IF;
END $$;

-- Admin kullanıcısını oluştur
INSERT INTO users (
    email,
    password_hash,
    role,
    is_active,
    created_at,
    updated_at
) VALUES (
    'admin@eventhubble.com',
    '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', -- admin12345 (bcrypt)
    'admin',
    true,
    NOW(),
    NOW()
);

-- Başarı mesajı
DO $$
BEGIN
    RAISE NOTICE '✅ Admin kullanıcısı başarıyla oluşturuldu!';
    RAISE NOTICE '📋 Kullanıcı Bilgileri:';
    RAISE NOTICE '   📧 Email: admin@eventhubble.com';
    RAISE NOTICE '   👤 Ad: Admin';
    RAISE NOTICE '   🔑 Rol: admin';
    RAISE NOTICE '   📅 Oluşturulma: %', NOW();
    RAISE NOTICE '';
    RAISE NOTICE '🔐 Giriş Bilgileri:';
    RAISE NOTICE '   📧 Email: admin@eventhubble.com';
    RAISE NOTICE '   🔑 Şifre: admin12345';
    RAISE NOTICE '';
    RAISE NOTICE '⚠️  Güvenlik Uyarısı:';
    RAISE NOTICE '   - İlk girişten sonra şifrenizi değiştirmeyi unutmayın!';
    RAISE NOTICE '   - Production ortamında daha güçlü bir şifre kullanın.';
END $$;

-- Oluşturulan kullanıcıyı göster
SELECT 
    id,
    email,
    role,
    is_active,
    created_at
FROM users 
WHERE email = 'admin@eventhubble.com'; 