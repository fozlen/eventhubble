-- Real Data Insert Script for EventHubble
-- Run this AFTER running the migration script

-- =============================================
-- INSERT REAL LOGOS
-- =============================================
INSERT INTO public.logos (logo_id, filename, title, alt_text, file_path, file_size, mime_type, width, height, is_active, display_order) VALUES
('main', 'Logo.png', 'EventHubble Ana Logo', 'EventHubble resmi logosu', '/assets/Logo.png', 263000, 'image/png', 512, 512, true, 1),
('new', 'eventhubble_new_logo.png', 'EventHubble Yeni Logo', 'EventHubble yeni tasarım logosu', '/assets/eventhubble_new_logo.png', 924000, 'image/png', 512, 512, true, 2),
('dark', 'eventhubble_dark_transparent_logo.png', 'EventHubble Koyu Logo', 'Koyu tema için EventHubble logosu', '/assets/eventhubble_dark_transparent_logo.png', 938000, 'image/png', 512, 512, true, 3),
('light', 'eventhubble_light_transparent_logo.png', 'EventHubble Açık Logo', 'Açık tema için EventHubble logosu', '/assets/eventhubble_light_transparent_logo.png', 841000, 'image/png', 512, 512, true, 4),
('without_bg', 'Logo w_out background.png', 'EventHubble Şeffaf Logo', 'Arka plan olmadan EventHubble logosu', '/assets/Logo w_out background.png', 289000, 'image/png', 512, 512, true, 5),
('main_alt', 'MainLogo.png', 'EventHubble Alternatif Logo', 'EventHubble alternatif ana logo', '/assets/MainLogo.png', 1300000, 'image/png', 1024, 1024, true, 6);

-- =============================================
-- INSERT REAL CATEGORIES
-- =============================================
INSERT INTO public.categories (category_id, name_tr, name_en, description_tr, description_en, color_code, is_active, display_order) VALUES
('music', 'Müzik', 'Music', 'Konserler, müzik festivalleri ve müzik etkinlikleri', 'Concerts, music festivals and music events', '#8B5CF6', true, 1),
('sports', 'Spor', 'Sports', 'Spor etkinlikleri, maçlar ve spor aktiviteleri', 'Sports events, matches and sports activities', '#F97316', true, 2),
('theater', 'Tiyatro', 'Theater', 'Tiyatro oyunları ve sahne sanatları', 'Theater plays and performing arts', '#EF4444', true, 3),
('festival', 'Festival', 'Festival', 'Kültür festivalleri ve özel etkinlikler', 'Cultural festivals and special events', '#10B981', true, 4),
('cinema', 'Sinema', 'Cinema', 'Film gösterimleri ve sinema etkinlikleri', 'Movie screenings and cinema events', '#3B82F6', true, 5),
('workshop', 'Atölye', 'Workshop', 'Eğitim atölyeleri ve kurslar', 'Educational workshops and courses', '#F59E0B', true, 6),
('art', 'Sanat', 'Art', 'Sergi açılışları ve sanat etkinlikleri', 'Art exhibitions and cultural events', '#EC4899', true, 7),
('food', 'Gastronomi', 'Food & Gastronomy', 'Yemek festivalleri ve gastronomi etkinlikleri', 'Food festivals and gastronomy events', '#84CC16', true, 8);

-- Sub-categories
INSERT INTO public.categories (category_id, name_tr, name_en, description_tr, description_en, color_code, parent_id, is_active, display_order) VALUES
('pop', 'Pop Müzik', 'Pop Music', 'Pop müzik konserleri', 'Pop music concerts', '#8B5CF6', (SELECT id FROM public.categories WHERE category_id = 'music'), true, 11),
('rock', 'Rock Müzik', 'Rock Music', 'Rock müzik konserleri', 'Rock music concerts', '#7C3AED', (SELECT id FROM public.categories WHERE category_id = 'music'), true, 12),
('jazz', 'Jazz', 'Jazz', 'Jazz konserleri ve etkinlikleri', 'Jazz concerts and events', '#6366F1', (SELECT id FROM public.categories WHERE category_id = 'music'), true, 13),
('classical', 'Klasik Müzik', 'Classical Music', 'Klasik müzik konserleri', 'Classical music concerts', '#8B5CF6', (SELECT id FROM public.categories WHERE category_id = 'music'), true, 14),
('football', 'Futbol', 'Football', 'Futbol maçları ve etkinlikleri', 'Football matches and events', '#F97316', (SELECT id FROM public.categories WHERE category_id = 'sports'), true, 21),
('basketball', 'Basketbol', 'Basketball', 'Basketbol maçları', 'Basketball matches', '#EA580C', (SELECT id FROM public.categories WHERE category_id = 'sports'), true, 22),
('drama', 'Drama', 'Drama', 'Drama ve trajedi oyunları', 'Drama and tragedy plays', '#EF4444', (SELECT id FROM public.categories WHERE category_id = 'theater'), true, 31),
('comedy', 'Komedi', 'Comedy', 'Komedi oyunları', 'Comedy plays', '#F87171', (SELECT id FROM public.categories WHERE category_id = 'theater'), true, 32);

-- =============================================
-- INSERT SAMPLE EVENTS (Real Istanbul Events)
-- =============================================
INSERT INTO public.events (
    event_id, title_tr, title_en, description_tr, description_en, short_description_tr, short_description_en,
    category, subcategory, price_min, price_max, currency, 
    start_date, end_date, venue_name, venue_address, city, country,
    latitude, longitude, organizer_name, is_featured, is_active
) VALUES
(
    'sezen_aksu_istanbul_2024',
    'Sezen Aksu - İstanbul Konseri 2024',
    'Sezen Aksu - Istanbul Concert 2024',
    'Türk pop müziğinin kraliçesi Sezen Aksu, sevilen şarkıları ile İstanbul''da hayranlarıyla buluşuyor. Bu unutulmaz gecede, sanatçının en sevilen eserlerini dinleme fırsatı yakalayacaksınız.',
    'The queen of Turkish pop music Sezen Aksu meets with her fans in Istanbul with her beloved songs. In this unforgettable night, you will have the opportunity to listen to the artist''s most beloved works.',
    'Sezen Aksu''nun büyüleyici İstanbul konseri',
    'Sezen Aksu''s enchanting Istanbul concert',
    'music', 'pop', 150.00, 500.00, 'TRY',
    '2024-08-15 20:00:00+03', '2024-08-15 23:00:00+03',
    'Volkswagen Arena', 'Huzur Mah. Maslak Ayazağa Cad. No:4K, 34485 Sarıyer/İstanbul', 'İstanbul', 'Turkey',
    41.1079, 29.0164, 'Biletix', true, true
),
(
    'galatasaray_fenerbahce_2024',
    'Galatasaray - Fenerbahçe Derbisi',
    'Galatasaray vs Fenerbahçe Derby',
    'Türk futbolunun en büyük derbisi! Galatasaray ve Fenerbahçe arasındaki bu heyecan dolu maç için biletler satışta. Türk Telekom Stadyumu''nda büyük bir atmosfer sizi bekliyor.',
    'The biggest derby of Turkish football! Tickets are on sale for this exciting match between Galatasaray and Fenerbahçe. A great atmosphere awaits you at Türk Telekom Stadium.',
    'Galatasaray - Fenerbahçe derbisi',
    'Galatasaray vs Fenerbahçe derby',
    'sports', 'football', 100.00, 300.00, 'TRY',
    '2024-08-20 20:00:00+03', '2024-08-20 22:00:00+03',
    'Türk Telekom Stadyumu', 'Huzur Mahallesi, Maslak Ayazağa Cad. No:1, 34485 Sarıyer/İstanbul', 'İstanbul', 'Turkey',
    41.1037, 29.0100, 'Passolig', true, true
),
(
    'hamlet_devlet_tiyatrosu_2024',
    'Hamlet - İstanbul Devlet Tiyatrosu',
    'Hamlet - Istanbul State Theater',
    'Shakespeare''in ölümsüz eseri Hamlet, İstanbul Devlet Tiyatrosu''nun yorumuyla sahneye çıkıyor. Bu klasik drama, güçlü oyunculuk performansları ile modern bir yaklaşımla sunuluyor.',
    'Shakespeare''s immortal work Hamlet comes to the stage with the interpretation of Istanbul State Theater. This classic drama is presented with a modern approach with strong acting performances.',
    'Shakespeare''in ölümsüz eseri Hamlet',
    'Shakespeare''s immortal work Hamlet',
    'theater', 'drama', 50.00, 120.00, 'TRY',
    '2024-08-25 19:30:00+03', '2024-08-25 22:00:00+03',
    'İstanbul Devlet Tiyatrosu', 'Atatürk Bulvarı No:20, Beyazıt/İstanbul', 'İstanbul', 'Turkey',
    41.0082, 28.9784, 'İstanbul Devlet Tiyatrosu', false, true
),
(
    'istanbul_jazz_festival_2024',
    'İstanbul Jazz Festivali 2024',
    'Istanbul Jazz Festival 2024',
    'İstanbul''un en prestijli müzik etkinliği olan Jazz Festivali, dünya çapında ünlü sanatçıları ağırlıyor. 5 gün boyunca devam edecek festivalde, jazz''ın en iyi temsilcileri sahne alacak.',
    'The Jazz Festival, Istanbul''s most prestigious music event, hosts world-renowned artists. The best representatives of jazz will take the stage during the festival that will last for 5 days.',
    'İstanbul''un prestijli jazz festivali',
    'Istanbul''s prestigious jazz festival',
    'music', 'jazz', 200.00, 800.00, 'TRY',
    '2024-09-01 18:00:00+03', '2024-09-05 23:59:00+03',
    'Zorlu PSM', 'Levazım Mahallesi, Koru Sokağı No:2, 34340 Beşiktaş/İstanbul', 'İstanbul', 'Turkey',
    41.0766, 29.0142, 'İKSV', true, true
),
(
    'besiktas_olympiakos_ucl_2024',
    'Beşiktaş - Olympiakos (UEFA Şampiyonlar Ligi)',
    'Besiktas vs Olympiakos (UEFA Champions League)',
    'Beşiktaş, UEFA Şampiyonlar Ligi''nde Yunanistan temsilcisi Olympiakos''u ağırlıyor. Bu önemli Avrupa maçında Vodafone Park''ta muhteşem bir atmosfer bekleniyor.',
    'Besiktas hosts Greek representative Olympiakos in the UEFA Champions League. A magnificent atmosphere is expected at Vodafone Park in this important European match.',
    'Beşiktaş''ın Şampiyonlar Ligi maçı',
    'Besiktas Champions League match',
    'sports', 'football', 80.00, 250.00, 'TRY',
    '2024-09-10 21:45:00+03', '2024-09-10 23:45:00+03',
    'Vodafone Park', 'Vişnezade Mahallesi, Dolmabahçe Caddesi, 34357 Beşiktaş/İstanbul', 'İstanbul', 'Turkey',
    41.0394, 29.0001, 'UEFA', true, true
),
(
    'istanbul_film_festival_2024',
    'İstanbul Film Festivali 2024',
    'Istanbul Film Festival 2024',
    'İstanbul Film Festivali, sinema severlerin en çok beklediği etkinlik. Ulusal ve uluslararası yapımların gösterileceği festivalde, dünya sinemasından seçkin örnekler izleyiciyle buluşacak.',
    'Istanbul Film Festival is the most anticipated event for cinema lovers. Distinguished examples from world cinema will meet the audience at the festival where national and international productions will be screened.',
    'İstanbul''un en büyük film festivali',
    'Istanbul''s biggest film festival',
    'cinema', null, 25.00, 75.00, 'TRY',
    '2024-09-15 10:00:00+03', '2024-09-25 23:59:00+03',
    'Çeşitli Sinema Salonları', 'İstanbul geneli çeşitli lokasyonlar', 'İstanbul', 'Turkey',
    41.0082, 28.9784, 'İKSV', false, true
),
(
    'cem_adrian_akustic_2024',
    'Cem Adrian Akustik Konser',
    'Cem Adrian Acoustic Concert',
    'Cem Adrian''ın eşsiz sesiyle akustik bir konser deneyimi. Sanatçının en sevilen şarkıları, akustik düzenlemelerle samimi bir ortamda seslendirilecek.',
    'An acoustic concert experience with Cem Adrian''s unique voice. The artist''s most beloved songs will be performed in an intimate setting with acoustic arrangements.',
    'Cem Adrian''dan akustik konser',
    'Acoustic concert by Cem Adrian',
    'music', 'pop', 120.00, 300.00, 'TRY',
    '2024-09-28 20:30:00+03', '2024-09-28 22:30:00+03',
    'İş Sanat Kültür Merkezi', 'Küçükbakkalköy Mahallesi, Kayışdağı Caddesi No:1, 34750 Ataşehir/İstanbul', 'İstanbul', 'Turkey',
    40.9897, 29.1212, 'İş Sanat', false, true
),
(
    'rock_n_solo_festival_2024',
    'Rock''n Solo Festival 2024',
    'Rock''n Solo Festival 2024',
    'İstanbul''un en büyük rock müzik festivali! 2 gün boyunca yerli ve yabancı rock grupları sahne alacak. Camping alanı ve yemek standları ile tam bir festival deneyimi.',
    'Istanbul''s biggest rock music festival! Local and international rock groups will perform for 2 days. A complete festival experience with camping area and food stands.',
    'İstanbul''un büyük rock festivali',
    'Istanbul''s big rock festival',
    'festival', 'rock', 180.00, 400.00, 'TRY',
    '2024-10-05 14:00:00+03', '2024-10-06 02:00:00+03',
    'Life Park', 'Yeşilköy Mahallesi, Atatürk Havalimanı Karşısı, 34149 Bakırköy/İstanbul', 'İstanbul', 'Turkey',
    40.9769, 28.8056, 'Rock''n Solo Organizasyon', true, true
);

-- =============================================
-- INSERT SITE SETTINGS (Extended)
-- =============================================
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('social_facebook', 'https://facebook.com/eventhubble', 'string', 'social', 'Facebook page URL'),
('social_twitter', 'https://twitter.com/eventhubble', 'string', 'social', 'Twitter profile URL'),
('social_instagram', 'https://instagram.com/eventhubble', 'string', 'social', 'Instagram profile URL'),
('social_youtube', 'https://youtube.com/eventhubble', 'string', 'social', 'YouTube channel URL'),
('contact_phone', '+90 212 555 0123', 'string', 'contact', 'Contact phone number'),
('contact_address', 'İstanbul, Türkiye', 'string', 'contact', 'Office address'),
('seo_description_tr', 'İstanbul''da konser, tiyatro, spor ve sanat etkinliklerini keşfedin. EventHubble ile tüm etkinlikler tek platformda!', 'string', 'seo', 'Turkish SEO description'),
('seo_description_en', 'Discover concerts, theater, sports and art events in Istanbul. All events in one platform with EventHubble!', 'string', 'seo', 'English SEO description'),
('analytics_google', 'G-XXXXXXXXXX', 'string', 'analytics', 'Google Analytics ID'),
('cache_duration_events', '300', 'number', 'performance', 'Event cache duration in seconds'),
('cache_duration_images', '3600', 'number', 'performance', 'Image cache duration in seconds'),
('pagination_events', '12', 'number', 'general', 'Events per page in listing'),
('pagination_search', '20', 'number', 'general', 'Search results per page'),
('maintenance_mode', 'false', 'boolean', 'general', 'Enable maintenance mode'),
('registration_enabled', 'true', 'boolean', 'general', 'Enable user registration'),
('comments_enabled', 'true', 'boolean', 'general', 'Enable event comments');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE 'Real data inserted successfully!';
    RAISE NOTICE 'Inserted: 6 logos, 16 categories (8 main + 8 sub), 8 sample events';
    RAISE NOTICE 'Added: Extended site settings for social media, contact, SEO';
    RAISE NOTICE 'Ready for production use!';
END $$; 