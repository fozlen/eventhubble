-- =============================================
-- EVENTHUBBLE ADDITIONAL TABLES CREATION SCRIPT
-- =============================================
-- Run this script to create all recommended additional tables
-- Author: EventHubble Team
-- Date: 2025-01-30
-- Version: 1.0

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================
-- 1. CONTACT_SUBMISSIONS TABLE (Priority: High)
-- =============================================
-- Stores contact form submissions from the website
CREATE TABLE IF NOT EXISTS public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'read', 'replied', 'closed')),
    language VARCHAR(5) DEFAULT 'TR' CHECK (language IN ('TR', 'EN')),
    ip_address INET,
    user_agent TEXT,
    referrer_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    replied_at TIMESTAMP WITH TIME ZONE,
    replied_by UUID -- Will reference users table when created
);

-- Contact submissions indexes
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status ON public.contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_created_at ON public.contact_submissions(created_at);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_email ON public.contact_submissions(email);

-- =============================================
-- 2. USERS TABLE (Priority: High)
-- =============================================
-- Admin panel users for authentication and authorization
CREATE TABLE IF NOT EXISTS public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin' CHECK (role IN ('super_admin', 'admin', 'editor', 'viewer')),
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    email_verified BOOLEAN DEFAULT false,
    last_login TIMESTAMP WITH TIME ZONE,
    login_count INTEGER DEFAULT 0,
    password_reset_token VARCHAR(255),
    password_reset_expires TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id)
);

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_role ON public.users(role);
CREATE INDEX IF NOT EXISTS idx_users_active ON public.users(is_active);
CREATE INDEX IF NOT EXISTS idx_users_last_login ON public.users(last_login);

-- =============================================
-- 3. ANALYTICS TABLE (Priority: High)
-- =============================================
-- Stores site analytics and metrics
CREATE TABLE IF NOT EXISTS public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    metric_date DATE NOT NULL,
    metric_category VARCHAR(50) DEFAULT 'general' CHECK (metric_category IN ('general', 'events', 'users', 'performance', 'traffic', 'conversion')),
    metadata JSONB DEFAULT '{}',
    source VARCHAR(50) DEFAULT 'system' CHECK (source IN ('system', 'google_analytics', 'manual', 'api')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(metric_name, metric_date, metric_category)
);

-- Analytics indexes
CREATE INDEX IF NOT EXISTS idx_analytics_metric_name ON public.analytics(metric_name);
CREATE INDEX IF NOT EXISTS idx_analytics_metric_date ON public.analytics(metric_date);
CREATE INDEX IF NOT EXISTS idx_analytics_category ON public.analytics(metric_category);
CREATE INDEX IF NOT EXISTS idx_analytics_source ON public.analytics(source);

-- =============================================
-- 4. NEWSLETTERS TABLE (Priority: Medium)
-- =============================================
-- Email subscription management
CREATE TABLE IF NOT EXISTS public.newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'unsubscribed', 'bounced', 'pending')),
    subscription_type VARCHAR(50) DEFAULT 'general' CHECK (subscription_type IN ('general', 'events', 'news', 'promotions')),
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    unsubscribe_reason TEXT,
    ip_address INET,
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'admin', 'api', 'import')),
    preferences JSONB DEFAULT '{}',
    verified BOOLEAN DEFAULT false,
    verification_token VARCHAR(255),
    last_email_sent TIMESTAMP WITH TIME ZONE,
    email_count INTEGER DEFAULT 0
);

-- Newsletter indexes
CREATE INDEX IF NOT EXISTS idx_newsletters_email ON public.newsletters(email);
CREATE INDEX IF NOT EXISTS idx_newsletters_status ON public.newsletters(status);
CREATE INDEX IF NOT EXISTS idx_newsletters_subscribed_at ON public.newsletters(subscribed_at);
CREATE INDEX IF NOT EXISTS idx_newsletters_source ON public.newsletters(source);

-- =============================================
-- 5. FAQS TABLE (Priority: Medium)
-- =============================================
-- Frequently Asked Questions management
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_tr TEXT NOT NULL,
    question_en TEXT,
    answer_tr TEXT NOT NULL,
    answer_en TEXT,
    category VARCHAR(50) DEFAULT 'general' CHECK (category IN ('general', 'events', 'tickets', 'technical', 'account', 'payment')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    view_count INTEGER DEFAULT 0,
    helpful_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id),
    updated_by UUID REFERENCES public.users(id)
);

-- FAQ indexes
CREATE INDEX IF NOT EXISTS idx_faqs_category ON public.faqs(category);
CREATE INDEX IF NOT EXISTS idx_faqs_active ON public.faqs(is_active, display_order);
CREATE INDEX IF NOT EXISTS idx_faqs_featured ON public.faqs(is_featured);

-- =============================================
-- 6. TESTIMONIALS TABLE (Priority: Medium)
-- =============================================
-- User testimonials and reviews
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255),
    title VARCHAR(255),
    company VARCHAR(255),
    content_tr TEXT NOT NULL,
    content_en TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'rejected')),
    source VARCHAR(50) DEFAULT 'website' CHECK (source IN ('website', 'email', 'social', 'manual')),
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES public.users(id),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Testimonials indexes
CREATE INDEX IF NOT EXISTS idx_testimonials_featured ON public.testimonials(is_featured);
CREATE INDEX IF NOT EXISTS idx_testimonials_active ON public.testimonials(is_active);
CREATE INDEX IF NOT EXISTS idx_testimonials_status ON public.testimonials(status);
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON public.testimonials(rating);

-- =============================================
-- 7. PARTNERS TABLE (Priority: Medium)
-- =============================================
-- Partners, sponsors, and venue relationships
CREATE TABLE IF NOT EXISTS public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description_tr TEXT,
    description_en TEXT,
    partner_type VARCHAR(50) DEFAULT 'sponsor' CHECK (partner_type IN ('sponsor', 'partner', 'venue', 'media', 'vendor')),
    contact_email VARCHAR(255),
    contact_phone VARCHAR(50),
    contact_person VARCHAR(255),
    status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'pending')),
    featured BOOLEAN DEFAULT false,
    display_order INTEGER DEFAULT 0,
    contract_start DATE,
    contract_end DATE,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    created_by UUID REFERENCES public.users(id)
);

-- Partners indexes
CREATE INDEX IF NOT EXISTS idx_partners_slug ON public.partners(slug);
CREATE INDEX IF NOT EXISTS idx_partners_type ON public.partners(partner_type);
CREATE INDEX IF NOT EXISTS idx_partners_status ON public.partners(status);
CREATE INDEX IF NOT EXISTS idx_partners_featured ON public.partners(featured, display_order);

-- =============================================
-- 8. AUDIT_LOGS TABLE (Priority: Low)
-- =============================================
-- Audit trail for admin panel actions
CREATE TABLE IF NOT EXISTS public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    session_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Audit logs indexes
CREATE INDEX IF NOT EXISTS idx_audit_logs_user_id ON public.audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_logs_action ON public.audit_logs(action);
CREATE INDEX IF NOT EXISTS idx_audit_logs_table_name ON public.audit_logs(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_logs_created_at ON public.audit_logs(created_at);
CREATE INDEX IF NOT EXISTS idx_audit_logs_record_id ON public.audit_logs(record_id);

-- =============================================
-- SAMPLE DATA INSERTS
-- =============================================

-- Insert default super admin user (password: admin123 - CHANGE IN PRODUCTION!)
INSERT INTO public.users (email, password_hash, role, first_name, last_name, is_active, email_verified) VALUES
('admin@eventhubble.com', '$2b$10$rKzfLwPzLbGkh5Q2h1K9w.K9mKzfLwPzLbGkh5Q2h1K9w.K9mKzfLw', 'super_admin', 'Admin', 'User', true, true)
ON CONFLICT (email) DO NOTHING;

-- Insert sample FAQ categories
INSERT INTO public.faqs (question_tr, question_en, answer_tr, answer_en, category, display_order, is_active) VALUES
('EventHubble nedir?', 'What is EventHubble?', 
'EventHubble, İstanbul''daki tüm etkinlikleri tek platformda toplayan bir etkinlik keşif platformudur.', 
'EventHubble is an event discovery platform that brings together all events in Istanbul on a single platform.', 
'general', 1, true),

('Nasıl etkinlik arayabilirim?', 'How can I search for events?', 
'Ana sayfadaki arama kutusunu kullanarak kategori, tarih, konum veya fiyata göre etkinlik arayabilirsiniz.', 
'You can search for events by category, date, location, or price using the search box on the homepage.', 
'events', 2, true),

('Bilet nasıl satın alabilirim?', 'How can I buy tickets?', 
'EventHubble bilet satışı yapmaz, sizi güvenilir bilet satış platformlarına yönlendirir.', 
'EventHubble does not sell tickets directly, it redirects you to trusted ticket sales platforms.', 
'tickets', 3, true)
ON CONFLICT DO NOTHING;

-- Insert sample testimonials
INSERT INTO public.testimonials (name, title, content_tr, content_en, rating, is_featured, is_active, status, approved_at) VALUES
('Ahmet Yılmaz', 'Müzik Sevdalısı', 
'EventHubble sayesinde İstanbul''daki tüm konser ve etkinlikleri tek yerden takip edebiliyorum. Harika bir platform!', 
'Thanks to EventHubble, I can follow all concerts and events in Istanbul from one place. Great platform!', 
5, true, true, 'approved', NOW()),

('Elif Koç', 'Tiyatro Oyuncusu', 
'Kendi tiyatro oyunlarımızı tanıtmak için mükemmel bir platform. Kolay kullanımlı ve etkili.', 
'Perfect platform to promote our theater plays. Easy to use and effective.', 
5, true, true, 'approved', NOW()),

('Mehmet Özkan', 'Etkinlik Organizatörü', 
'EventHubble ile etkinliklerimize daha fazla katılımcı ulaştırabiliyoruz. Teşekkürler!', 
'We can reach more participants to our events with EventHubble. Thank you!', 
4, false, true, 'approved', NOW())
ON CONFLICT DO NOTHING;

-- Insert sample partners
INSERT INTO public.partners (name, slug, description_tr, description_en, partner_type, status, featured, display_order) VALUES
('Zorlu PSM', 'zorlu-psm', 
'İstanbul''un prestijli kültür ve sanat merkezi', 
'Istanbul''s prestigious culture and arts center', 
'venue', 'active', true, 1),

('Cemal Reşit Rey Konser Salonu', 'crr-konser-salonu', 
'İstanbul''un köklü konser salonu', 
'Istanbul''s established concert hall', 
'venue', 'active', true, 2),

('Maximum Kart', 'maximum-kart', 
'Etkinlik biletleme partneri', 
'Event ticketing partner', 
'partner', 'active', false, 3)
ON CONFLICT (slug) DO NOTHING;

-- Insert sample analytics data
INSERT INTO public.analytics (metric_name, metric_value, metric_date, metric_category, source) VALUES
('page_views', 1250, CURRENT_DATE, 'traffic', 'google_analytics'),
('unique_visitors', 890, CURRENT_DATE, 'traffic', 'google_analytics'),
('event_views', 456, CURRENT_DATE, 'events', 'system'),
('contact_form_submissions', 12, CURRENT_DATE, 'conversion', 'system'),
('newsletter_signups', 34, CURRENT_DATE, 'conversion', 'system')
ON CONFLICT (metric_name, metric_date, metric_category) DO NOTHING;

-- =============================================
-- FOREIGN KEY CONSTRAINTS (Add after data insertion)
-- =============================================

-- Add foreign key for contact_submissions replied_by
ALTER TABLE public.contact_submissions 
ADD CONSTRAINT fk_contact_submissions_replied_by 
FOREIGN KEY (replied_by) REFERENCES public.users(id);

-- =============================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply triggers to tables with updated_at columns
CREATE TRIGGER update_contact_submissions_updated_at BEFORE UPDATE ON public.contact_submissions 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON public.users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_faqs_updated_at BEFORE UPDATE ON public.faqs 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_testimonials_updated_at BEFORE UPDATE ON public.testimonials 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_partners_updated_at BEFORE UPDATE ON public.partners 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- PERMISSIONS (Adjust as needed for your setup)
-- =============================================

-- Grant necessary permissions to your application user
-- GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO your_app_user;
-- GRANT USAGE ON ALL SEQUENCES IN SCHEMA public TO your_app_user;

-- =============================================
-- SCRIPT COMPLETION
-- =============================================

-- Log completion
DO $$
BEGIN
    RAISE NOTICE 'EventHubble additional tables creation script completed successfully!';
    RAISE NOTICE 'Tables created: contact_submissions, users, analytics, newsletters, faqs, testimonials, partners, audit_logs';
    RAISE NOTICE 'Sample data inserted for testing purposes';
    RAISE NOTICE 'Remember to update default passwords and configure permissions for production use';
END $$; 