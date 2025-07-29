-- EventHubble Logos Insert Query
-- Bu sorguyu veritabanında çalıştırarak logo tablonuzu doldurun

-- Önce mevcut logoları temizle (opsiyonel)
-- DELETE FROM public.logos;

-- Logo verilerini ekle
INSERT INTO public.logos (logo_id, filename, title, alt_text, file_path, file_size, mime_type, width, height, is_active, display_order) 
VALUES 
-- Ana Logo
('main', 'Logo.png', 'EventHubble Ana Logo', 'EventHubble resmi logosu', '/assets/Logo.png', 263000, 'image/png', 989, 989, true, 1),

-- Koyu Tema Logo
('dark', 'eventhubble_dark_transparent_logo.png', 'EventHubble Koyu Logo', 'Koyu tema için EventHubble logosu', '/assets/eventhubble_dark_transparent_logo.png', 938000, 'image/png', 1024, 1024, true, 2),

-- Açık Tema Logo
('light', 'eventhubble_light_transparent_logo.png', 'EventHubble Açık Logo', 'Açık tema için EventHubble logosu', '/assets/eventhubble_light_transparent_logo.png', 841000, 'image/png', 1024, 1024, true, 3),

-- Büyük Ana Logo
('large', 'MainLogo.png', 'EventHubble Büyük Logo', 'Büyük boyut ana logo', '/assets/MainLogo.png', 1300000, 'image/png', 1200, 1200, true, 4),

-- Arka Plan Olmayan Logo
('transparent', 'Logo w_out background.png', 'EventHubble Şeffaf Logo', 'Arka plan olmayan logo', '/assets/Logo w_out background.png', 289000, 'image/png', 1242, 1242, true, 5),

-- Yeni Logo
('new', 'eventhubble_new_logo.png', 'EventHubble Yeni Logo', 'Güncellenmiş EventHubble logosu', '/assets/eventhubble_new_logo.png', 924000, 'image/png', 1024, 1024, true, 6);

-- Sonucu kontrol et
-- SELECT * FROM public.logos ORDER BY display_order; 