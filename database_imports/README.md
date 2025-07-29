# 📊 CSV Import Rehberi

Bu klasörde Supabase'e import edilecek gerçekçi sample data'ları bulunuyor.

## 📁 Dosyalar

1. **`logos.csv`** - Logo yönetimi (6 kayıt)
2. **`images.csv`** - Resim yönetimi (10 kayıt)  
3. **`categories.csv`** - Kategori sistemi (11 kayıt)
4. **`events.csv`** - Etkinlik verileri (8 kayıt)
5. **`blog_posts.csv`** - Blog yazıları (5 kayıt)
6. **`site_settings.csv`** - Site ayarları (30 kayıt)

## 🚀 Import Sırası

**ÖNEMLİ:** Tabloları doğru sırayla import edin (foreign key ilişkileri nedeniyle):

### 1. Önce Temel Tablolar
```
1. logos.csv → logos tablosu
2. images.csv → images tablosu  
3. site_settings.csv → site_settings tablosu
```

### 2. Sonra Bağımlı Tablolar
```
4. categories.csv → categories tablosu (images'a referans)
5. events.csv → events tablosu (images'a referans)
6. blog_posts.csv → blog_posts tablosu (images'a referans)
```

## 📋 Supabase Import Adımları

### 1. Supabase Dashboard'a Git
- Proje dashboard'unda Table Editor sekmesini aç

### 2. Her Tablo İçin
1. İlgili tabloyu seç
2. "Insert" → "Import data from CSV" 
3. CSV dosyasını yükle
4. Column mapping'i kontrol et
5. "Import" butonuna tıkla

### 3. Hata Durumunda
- Foreign key hatası alırsanız önce referenced tabloları import edin
- Timestamp formatında sorun varsa Supabase'de otomatik convert aktif olmalı
- JSON field'ları otomatik parse edilmeli

## 🔍 Veri Özellikleri

### Gerçekçi İçerikler
- ✅ **Etkinlikler**: Sezen Aksu konseri, Hamlet tiyatrosu, Jazz festivali
- ✅ **Mekanlar**: Volkswagen Arena, Zorlu PSM, İstanbul Devlet Tiyatrosu  
- ✅ **Fiyatlar**: Gerçek piyasa fiyatları (80-800 TL arası)
- ✅ **Tarihler**: 2024 yılı gerçekçi etkinlik tarihleri
- ✅ **Blog İçerikleri**: SEO optimized, gerçek yazı kalitesi

### Teknik Özellikler
- ✅ **Çok dilli içerik** (Türkçe/İngilizce)
- ✅ **JSON metadata** (JSONB uyumlu)
- ✅ **Array field'ları** (PostgreSQL array syntax)
- ✅ **Foreign key referansları** (images, categories)
- ✅ **SEO meta bilgileri** (title, description, slug)

## 🛠️ Alternatif Import Yöntemleri

### 1. SQL Insert Script'i
```sql
-- Örnek insert komutu
INSERT INTO logos (logo_id, filename, title, alt_text, file_path, mime_type, is_active, display_order)
VALUES ('main', 'Logo.png', 'EventHubble Ana Logo', 'EventHubble resmi logosu', '/Logo.png', 'image/png', true, 1);
```

### 2. Programatik Import (Backend Script)
```bash
cd backend
node seedDatabase.js
```

### 3. Supabase CLI
```bash
supabase db reset --linked
# CSV'leri import et
```

## 📊 Veri İstatistikleri

| Tablo | Kayıt Sayısı | Öne Çıkan Özellikler |
|-------|-------------|---------------------|
| logos | 6 | Ana logo, dark/light tema, favicon |
| images | 10 | Hero, kategori ikonları, etkinlik afişleri |  
| categories | 11 | Ana kategoriler + alt kategoriler |
| events | 8 | Müzik, spor, tiyatro, festival |
| blog_posts | 5 | Rehber yazıları, featured içerikler |
| site_settings | 30 | Genel ayarlar, sosyal medya, SEO |

## ⚠️ Önemli Notlar

1. **Timestamp Format**: `YYYY-MM-DD HH:MM:SS` formatı kullanılıyor
2. **JSON Fields**: Çift tırnak kullanın (`"key": "value"`)
3. **Array Fields**: PostgreSQL array syntax (`{item1,item2}`)
4. **Boolean Values**: `true`/`false` (küçük harf)
5. **NULL Values**: Boş bırakın veya `NULL` yazın

## 🔧 Troubleshooting

### CSV Import Hataları
- **Encoding**: UTF-8 encoding kullandığınızdan emin olun
- **Delimiter**: Comma (`,`) kullanın
- **Quotes**: Text field'larda çift tırnak kullanın
- **Line Endings**: Unix style (`\n`) tercih edin

### Foreign Key Hataları  
- Parent tabloları önce import edin
- ID değerlerinin doğru olduğunu kontrol edin
- NULL değerleri kabul edilen field'larda boş bırakabilirsiniz

### JSON/Array Hataları
- JSON syntax'ı kontrol edin (JSON validator kullanın)  
- Array'lerde tek tırnak yerine çift tırnak kullanın
- Escape karakterleri (\") doğru kullanın

## ✅ Import Sonrası Kontrol

```sql
-- Kayıt sayılarını kontrol et
SELECT 'logos' as table_name, count(*) as records FROM logos
UNION ALL
SELECT 'images', count(*) FROM images  
UNION ALL
SELECT 'categories', count(*) FROM categories
UNION ALL
SELECT 'events', count(*) FROM events
UNION ALL  
SELECT 'blog_posts', count(*) FROM blog_posts
UNION ALL
SELECT 'site_settings', count(*) FROM site_settings;

-- Foreign key ilişkilerini kontrol et
SELECT e.title_tr, i.title 
FROM events e 
LEFT JOIN images i ON e.cover_image_id = i.id
WHERE e.cover_image_id IS NOT NULL;
```

Başarılı import sonrası API endpoint'leri test edin! 🚀 