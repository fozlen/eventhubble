# 🗄️ EventHubble Database Setup Guide

Bu rehber, EventHubble uygulaması için gerekli database tablolarını oluşturmak ve yapılandırmak için hazırlanmıştır.

## 📊 Tablo Yapıları

### 1. `logos` Tablosu
```sql
CREATE TABLE logos (
  id SERIAL PRIMARY KEY,
  logo_id VARCHAR(50) UNIQUE NOT NULL,
  filename VARCHAR(255) NOT NULL,
  title VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  file_path VARCHAR(500),
  file_size INTEGER,
  mime_type VARCHAR(100),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_logos_logo_id ON logos(logo_id);
CREATE INDEX idx_logos_is_active ON logos(is_active);
```

### 2. `images` Tablosu
```sql
CREATE TABLE images (
  id SERIAL PRIMARY KEY,
  image_id VARCHAR(100) UNIQUE NOT NULL,
  category VARCHAR(100) NOT NULL,
  title VARCHAR(255) NOT NULL,
  alt_text VARCHAR(255),
  filename VARCHAR(255) NOT NULL,
  file_path VARCHAR(500),
  file_size INTEGER,
  mime_type VARCHAR(100),
  width INTEGER,
  height INTEGER,
  is_active BOOLEAN DEFAULT true,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_images_image_id ON images(image_id);
CREATE INDEX idx_images_category ON images(category);
CREATE INDEX idx_images_is_active ON images(is_active);
CREATE INDEX idx_images_tags ON images USING GIN(tags);
CREATE INDEX idx_images_metadata ON images USING GIN(metadata);
```

### 3. `events` Tablosu
```sql
CREATE TABLE events (
  id SERIAL PRIMARY KEY,
  event_id VARCHAR(100) UNIQUE NOT NULL,
  title_tr VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  description_tr TEXT,
  description_en TEXT,
  short_description_tr VARCHAR(1000),
  short_description_en VARCHAR(1000),
  category VARCHAR(100) NOT NULL,
  subcategory VARCHAR(100),
  price_min DECIMAL(10,2),
  price_max DECIMAL(10,2),
  currency VARCHAR(10) DEFAULT 'TRY',
  start_date TIMESTAMP NOT NULL,
  end_date TIMESTAMP,
  venue_name VARCHAR(255),
  venue_address TEXT,
  city VARCHAR(100),
  country VARCHAR(100) DEFAULT 'Turkey',
  latitude DECIMAL(10,8),
  longitude DECIMAL(11,8),
  image_url VARCHAR(500),
  cover_image_id INTEGER REFERENCES images(id),
  gallery_image_ids INTEGER[],
  ticket_url VARCHAR(500),
  organizer_name VARCHAR(255),
  organizer_contact VARCHAR(255),
  source_platform VARCHAR(100),
  source_id VARCHAR(255),
  source_url VARCHAR(500),
  is_featured BOOLEAN DEFAULT false,
  is_active BOOLEAN DEFAULT true,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  tags TEXT[],
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_events_event_id ON events(event_id);
CREATE INDEX idx_events_category ON events(category);
CREATE INDEX idx_events_city ON events(city);
CREATE INDEX idx_events_start_date ON events(start_date);
CREATE INDEX idx_events_is_featured ON events(is_featured);
CREATE INDEX idx_events_is_active ON events(is_active);
CREATE INDEX idx_events_tags ON events USING GIN(tags);
CREATE INDEX idx_events_metadata ON events USING GIN(metadata);
```

### 4. `blog_posts` Tablosu
```sql
CREATE TABLE blog_posts (
  id SERIAL PRIMARY KEY,
  post_id VARCHAR(100) UNIQUE NOT NULL,
  title_tr VARCHAR(500) NOT NULL,
  title_en VARCHAR(500),
  content_tr TEXT NOT NULL,
  content_en TEXT,
  excerpt_tr VARCHAR(1000),
  excerpt_en VARCHAR(1000),
  slug VARCHAR(255) UNIQUE NOT NULL,
  author_name VARCHAR(255),
  author_email VARCHAR(255),
  category VARCHAR(100),
  tags TEXT[],
  cover_image_id INTEGER REFERENCES images(id),
  gallery_image_ids INTEGER[],
  seo_title_tr VARCHAR(255),
  seo_title_en VARCHAR(255),
  seo_description_tr VARCHAR(500),
  seo_description_en VARCHAR(500),
  is_published BOOLEAN DEFAULT false,
  is_featured BOOLEAN DEFAULT false,
  published_at TIMESTAMP,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_blog_posts_post_id ON blog_posts(post_id);
CREATE INDEX idx_blog_posts_slug ON blog_posts(slug);
CREATE INDEX idx_blog_posts_category ON blog_posts(category);
CREATE INDEX idx_blog_posts_is_published ON blog_posts(is_published);
CREATE INDEX idx_blog_posts_is_featured ON blog_posts(is_featured);
CREATE INDEX idx_blog_posts_published_at ON blog_posts(published_at);
CREATE INDEX idx_blog_posts_tags ON blog_posts USING GIN(tags);
```

### 5. `categories` Tablosu
```sql
CREATE TABLE categories (
  id SERIAL PRIMARY KEY,
  category_id VARCHAR(100) UNIQUE NOT NULL,
  name_tr VARCHAR(255) NOT NULL,
  name_en VARCHAR(255),
  description_tr TEXT,
  description_en TEXT,
  parent_id INTEGER REFERENCES categories(id),
  icon_image_id INTEGER REFERENCES images(id),
  cover_image_id INTEGER REFERENCES images(id),
  color_code VARCHAR(10),
  is_active BOOLEAN DEFAULT true,
  display_order INTEGER DEFAULT 0,
  metadata JSONB,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_categories_category_id ON categories(category_id);
CREATE INDEX idx_categories_parent_id ON categories(parent_id);
CREATE INDEX idx_categories_is_active ON categories(is_active);
CREATE INDEX idx_categories_display_order ON categories(display_order);
```

### 6. `site_settings` Tablosu
```sql
CREATE TABLE site_settings (
  id SERIAL PRIMARY KEY,
  setting_key VARCHAR(255) UNIQUE NOT NULL,
  setting_value TEXT,
  setting_type VARCHAR(50) DEFAULT 'string',
  category VARCHAR(100),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- İndeksler
CREATE INDEX idx_site_settings_setting_key ON site_settings(setting_key);
CREATE INDEX idx_site_settings_category ON site_settings(category);
CREATE INDEX idx_site_settings_is_active ON site_settings(is_active);
```

## 🚀 Kurulum Adımları

### 1. Supabase'de Tabloları Oluştur
Yukarıdaki SQL komutlarını Supabase SQL Editor'de çalıştırın.

### 2. RLS (Row Level Security) Ayarları
```sql
-- Logos tablosu için RLS
ALTER TABLE logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read logos" ON logos FOR SELECT USING (is_active = true);

-- Images tablosu için RLS
ALTER TABLE images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read images" ON images FOR SELECT USING (is_active = true);

-- Events tablosu için RLS
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read events" ON events FOR SELECT USING (is_active = true);

-- Blog posts tablosu için RLS
ALTER TABLE blog_posts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read published posts" ON blog_posts FOR SELECT USING (is_published = true);

-- Categories tablosu için RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (is_active = true);

-- Site settings tablosu için RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read settings" ON site_settings FOR SELECT USING (is_active = true);
```

### 3. Sample Data Ekleme
Backend'de seed script'i çalıştırın:
```bash
cd backend
node seedDatabase.js
```

## 🔧 API Endpoint'leri

### Logos
- `GET /api/logos` - Tüm logo'ları getir
- `GET /api/logos/:logoId` - Belirli logo'yu getir

### Images
- `GET /api/images` - Tüm resimleri getir
- `GET /api/images?category=hero` - Kategoriye göre filtrele
- `GET /api/images/:imageId` - Belirli resmi getir

### Events
- `GET /api/events/db` - Database'den etkinlikleri getir
- `GET /api/events/db?category=music` - Kategoriye göre filtrele
- `GET /api/events/db?featured=true` - Öne çıkan etkinlikler
- `GET /api/events/db/:eventId` - Belirli etkinliği getir

### Categories
- `GET /api/categories` - Tüm kategorileri getir
- `GET /api/categories/:categoryId` - Belirli kategoriyi getir

### Site Settings
- `GET /api/settings` - Tüm ayarları getir
- `GET /api/settings?category=general` - Kategoriye göre filtrele

### Blog Posts
- `GET /api/blog-posts/db` - Database'den blog yazılarını getir
- `GET /api/blog-posts/db?featured=true` - Öne çıkan yazılar
- `GET /api/blog-posts/db/:slug` - Slug'a göre yazı getir

## 📝 Sample Data Örnekleri

### Logo Örneği
```json
{
  "logo_id": "main",
  "filename": "Logo.png",
  "title": "EventHubble Ana Logo",
  "alt_text": "EventHubble Ana Logo",
  "file_path": "/Logo.png",
  "mime_type": "image/png",
  "is_active": true,
  "display_order": 1
}
```

### Event Örneği
```json
{
  "event_id": "sample_concert_001",
  "title_tr": "Sezen Aksu Konseri",
  "title_en": "Sezen Aksu Concert",
  "category": "music",
  "subcategory": "pop",
  "price_min": 150.00,
  "price_max": 500.00,
  "start_date": "2024-06-15T20:00:00Z",
  "venue_name": "Volkswagen Arena",
  "city": "İstanbul",
  "is_featured": true,
  "tags": ["music", "pop", "concert"]
}
```

## 🔄 Migration Scripts

### Update Timestamp Trigger
```sql
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Her tablo için trigger oluştur
CREATE TRIGGER update_logos_updated_at BEFORE UPDATE ON logos FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_images_updated_at BEFORE UPDATE ON images FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_events_updated_at BEFORE UPDATE ON events FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_blog_posts_updated_at BEFORE UPDATE ON blog_posts FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_categories_updated_at BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_site_settings_updated_at BEFORE UPDATE ON site_settings FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

## ✅ Kontrol Listesi

- [ ] Tüm tabloları oluştur
- [ ] İndeksleri ekle
- [ ] RLS ayarlarını yap
- [ ] Trigger'ları oluştur
- [ ] Sample data'yı ekle
- [ ] API endpoint'lerini test et
- [ ] Frontend'de database service'i kullan

## 🔗 İlgili Dosyalar

- `backend/databaseService.js` - Backend database service
- `src/services/databaseService.js` - Frontend database service
- `backend/seedDatabase.js` - Sample data script
- `backend/uploadServer.js` - API endpoints 