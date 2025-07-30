-- EventHubble Database Migration Script
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Clean up existing dummy data (if any)
DROP TABLE IF EXISTS public.blog_posts CASCADE;
DROP TABLE IF EXISTS public.events CASCADE;
DROP TABLE IF EXISTS public.categories CASCADE;
DROP TABLE IF EXISTS public.images CASCADE;
DROP TABLE IF EXISTS public.logos CASCADE;
DROP TABLE IF EXISTS public.site_settings CASCADE;

-- =============================================
-- LOGOS TABLE
-- =============================================
CREATE TABLE public.logos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    logo_id VARCHAR(50) UNIQUE NOT NULL,
    filename VARCHAR(255) NOT NULL,
    title VARCHAR(255) NOT NULL,
    alt_text TEXT,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(50),
    width INTEGER,
    height INTEGER,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- IMAGES TABLE  
-- =============================================
CREATE TABLE public.images (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    image_id VARCHAR(100) UNIQUE NOT NULL,
    category VARCHAR(50),
    title VARCHAR(255) NOT NULL,
    alt_text TEXT,
    filename VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    mime_type VARCHAR(50),
    width INTEGER,
    height INTEGER,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- CATEGORIES TABLE
-- =============================================
CREATE TABLE public.categories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id VARCHAR(50) UNIQUE NOT NULL,
    name_tr VARCHAR(100) NOT NULL,
    name_en VARCHAR(100) NOT NULL,
    description_tr TEXT,
    description_en TEXT,
    color_code VARCHAR(7),
    icon_image_id UUID REFERENCES public.images(id),
    cover_image_id UUID REFERENCES public.images(id),
    parent_id UUID REFERENCES public.categories(id),
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- EVENTS TABLE
-- =============================================
CREATE TABLE public.events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_id VARCHAR(100) UNIQUE NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    description_tr TEXT,
    description_en TEXT,
    short_description_tr TEXT,
    short_description_en TEXT,
    category VARCHAR(50) NOT NULL,
    subcategory VARCHAR(50),
    price_min DECIMAL(10,2),
    price_max DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'TRY',
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE,
    venue_name VARCHAR(255),
    venue_address TEXT,
    city VARCHAR(100),
    country VARCHAR(100) DEFAULT 'Turkey',
    latitude DECIMAL(10,8),
    longitude DECIMAL(11,8),
    image_url TEXT,
    cover_image_id UUID REFERENCES public.images(id),
    gallery_image_ids UUID[] DEFAULT '{}',
    ticket_url TEXT,
    organizer_name VARCHAR(255),
    organizer_contact JSONB,
    source_platform VARCHAR(50),
    source_id VARCHAR(255),
    source_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- BLOG_POSTS TABLE
-- =============================================
CREATE TABLE public.blog_posts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(255) UNIQUE NOT NULL,
    title_tr VARCHAR(255) NOT NULL,
    title_en VARCHAR(255),
    excerpt_tr TEXT,
    excerpt_en TEXT,
    content_tr TEXT NOT NULL,
    content_en TEXT,
    category VARCHAR(50),
    cover_image_id UUID REFERENCES public.images(id),
    gallery_image_ids UUID[] DEFAULT '{}',
    author_name VARCHAR(255),
    author_bio TEXT,
    is_published BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    published_at TIMESTAMP WITH TIME ZONE,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    seo_title VARCHAR(255),
    seo_description TEXT,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- SITE_SETTINGS TABLE
-- =============================================
CREATE TABLE public.site_settings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    setting_key VARCHAR(100) UNIQUE NOT NULL,
    setting_value TEXT NOT NULL,
    setting_type VARCHAR(20) DEFAULT 'string',
    category VARCHAR(50) DEFAULT 'general',
    description TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES FOR PERFORMANCE
-- =============================================

-- Logos indexes
CREATE INDEX idx_logos_logo_id ON public.logos(logo_id);
CREATE INDEX idx_logos_active ON public.logos(is_active, display_order);

-- Images indexes
CREATE INDEX idx_images_image_id ON public.images(image_id);
CREATE INDEX idx_images_category ON public.images(category);
CREATE INDEX idx_images_active ON public.images(is_active);

-- Categories indexes
CREATE INDEX idx_categories_category_id ON public.categories(category_id);
CREATE INDEX idx_categories_parent ON public.categories(parent_id);
CREATE INDEX idx_categories_active ON public.categories(is_active, display_order);

-- Events indexes
CREATE INDEX idx_events_event_id ON public.events(event_id);
CREATE INDEX idx_events_category ON public.events(category);
CREATE INDEX idx_events_city ON public.events(city);
CREATE INDEX idx_events_dates ON public.events(start_date, end_date);
CREATE INDEX idx_events_featured ON public.events(is_featured, is_active);
CREATE INDEX idx_events_active ON public.events(is_active);

-- Blog posts indexes
CREATE INDEX idx_blog_posts_slug ON public.blog_posts(slug);
CREATE INDEX idx_blog_posts_published ON public.blog_posts(is_published, published_at);
CREATE INDEX idx_blog_posts_category ON public.blog_posts(category);
CREATE INDEX idx_blog_posts_featured ON public.blog_posts(is_featured);

-- Site settings indexes
CREATE INDEX idx_site_settings_key ON public.site_settings(setting_key);
CREATE INDEX idx_site_settings_category ON public.site_settings(category);

-- =============================================
-- SAMPLE DATA INSERTS
-- =============================================

-- Site Settings Sample Data
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description) VALUES
-- Contact Information
('contact_email_main', 'info@eventhubble.com', 'string', 'contact', 'Ana e-posta adresi'),
('contact_email_support', 'support@eventhubble.com', 'string', 'contact', 'Destek e-posta adresi'),
('contact_phone_main', '+90 (212) 123 45 67', 'string', 'contact', 'Ana telefon numarası'),
('contact_phone_mobile', '+90 (532) 123 45 67', 'string', 'contact', 'Mobil telefon numarası'),
('contact_address_tr', 'Maslak Mahallesi, Büyükdere Caddesi No:123\nŞişli, İstanbul, Türkiye', 'text', 'contact', 'Türkçe adres'),
('contact_address_en', 'Maslak District, Büyükdere Street No:123\nŞişli, Istanbul, Turkey', 'text', 'contact', 'İngilizce adres'),

-- Business Hours
('business_hours_weekdays', '09:00 - 18:00', 'string', 'contact', 'Hafta içi çalışma saatleri'),
('business_hours_saturday', '10:00 - 16:00', 'string', 'contact', 'Cumartesi çalışma saatleri'),
('business_hours_sunday', 'closed', 'string', 'contact', 'Pazar günü durumu'),

-- Social Media & Links
('social_twitter', 'https://twitter.com/eventhubble', 'string', 'social', 'Twitter hesabı'),
('social_instagram', 'https://instagram.com/eventhubble', 'string', 'social', 'Instagram hesabı'),
('social_facebook', 'https://facebook.com/eventhubble', 'string', 'social', 'Facebook hesabı'),
('social_linkedin', 'https://linkedin.com/company/eventhubble', 'string', 'social', 'LinkedIn hesabı'),

-- Site Information
('site_title_tr', 'EventHubble - Her Deneyime Açılan Kapınız', 'string', 'site', 'Site başlığı Türkçe'),
('site_title_en', 'EventHubble - Your Gateway to Every Experience', 'string', 'site', 'Site başlığı İngilizce'),
('site_description_tr', 'Harika deneyimler keşfetmenin kolay olması gerektiğine inanıyoruz. Konserler, festivaller, spor etkinlikleri, buluşmalar, kültürel toplantılar ve küresel gösterileri tek bir yerde.', 'text', 'site', 'Site açıklaması Türkçe'),
('site_description_en', 'We believe discovering great experiences should be effortless. We bring together concerts, festivals, sports events, meetups, cultural gatherings, and global spectacles all in one place.', 'text', 'site', 'Site açıklaması İngilizce'),

-- Analytics & SEO
('google_analytics_id', '', 'string', 'analytics', 'Google Analytics ID'),
('google_search_console_verification', '', 'string', 'analytics', 'Google Search Console verification code'),
('facebook_pixel_id', '', 'string', 'analytics', 'Facebook Pixel ID'),

-- Contact Form Settings
('contact_form_enabled', 'true', 'boolean', 'contact', 'İletişim formu aktif mi'),
('contact_form_recipient', 'info@eventhubble.com', 'string', 'contact', 'İletişim formu alıcı e-posta'),
('contact_form_subject_prefix', '[EventHubble Contact]', 'string', 'contact', 'E-posta konu ön eki'),

-- System Settings
('site_maintenance_mode', 'false', 'boolean', 'system', 'Site bakım modu'),
('site_language_default', 'TR', 'string', 'system', 'Varsayılan dil'),
('site_timezone', 'Europe/Istanbul', 'string', 'system', 'Site saat dilimi');

-- =============================================
-- UPDATE TRIGGERS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply to all tables
CREATE TRIGGER update_logos_updated_at BEFORE UPDATE ON public.logos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON public.images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON public.categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON public.events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON public.blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON public.site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

-- Enable RLS on all tables
ALTER TABLE public.logos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blog_posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;

-- Public read access for active content
CREATE POLICY "Public read access for active logos" ON public.logos FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active images" ON public.images FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active categories" ON public.categories FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for active events" ON public.events FOR SELECT USING (is_active = true);
CREATE POLICY "Public read access for published blog posts" ON public.blog_posts FOR SELECT USING (is_published = true);
CREATE POLICY "Public read access for active site settings" ON public.site_settings FOR SELECT USING (is_active = true);

-- Admin full access (you'll need to set up authentication)
-- For now, allow all operations - restrict later with proper auth
CREATE POLICY "Admin full access to logos" ON public.logos FOR ALL USING (true);
CREATE POLICY "Admin full access to images" ON public.images FOR ALL USING (true);
CREATE POLICY "Admin full access to categories" ON public.categories FOR ALL USING (true);
CREATE POLICY "Admin full access to events" ON public.events FOR ALL USING (true);
CREATE POLICY "Admin full access to blog posts" ON public.blog_posts FOR ALL USING (true);
CREATE POLICY "Admin full access to site settings" ON public.site_settings FOR ALL USING (true);

-- =============================================
-- INITIAL DATA INSERTION
-- =============================================

-- Insert default site settings
INSERT INTO public.site_settings (setting_key, setting_value, setting_type, category, description) VALUES
('site_title_tr', 'EventHubble - İstanbul''un Etkinlik Platformu', 'string', 'general', 'Turkish site title'),
('site_title_en', 'EventHubble - Istanbul''s Event Platform', 'string', 'general', 'English site title'),
('contact_email', 'info@eventhubble.com', 'string', 'contact', 'Main contact email'),
('currency_default', 'TRY', 'string', 'general', 'Default currency'),
('language_default', 'tr', 'string', 'general', 'Default language'),
('max_events_per_page', '20', 'number', 'general', 'Events per page'),
('featured_events_count', '8', 'number', 'general', 'Featured events to show');

-- =============================================
-- SUCCESS MESSAGE
-- =============================================
DO $$
BEGIN
    RAISE NOTICE 'EventHubble database migration completed successfully!';
    RAISE NOTICE 'Tables created: logos, images, categories, events, blog_posts, site_settings';
    RAISE NOTICE 'RLS enabled with public read access for active content';
    RAISE NOTICE 'Indexes and triggers configured for performance';
END $$; 