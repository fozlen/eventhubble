# Database Tables Roadmap

## 📊 Mevcut Tablolar (6 adet)
✅ blog_posts
✅ categories  
✅ events
✅ images
✅ logos
✅ site_settings

## 🚀 Öncelikli Eklenecek Tablolar

### 1️⃣ **contact_submissions** (İletişim Formu)
```sql
CREATE TABLE public.contact_submissions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    subject VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(20) DEFAULT 'new', -- new, read, replied, closed
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 2️⃣ **users** (Admin Panel Kullanıcıları)
```sql
CREATE TABLE public.users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'admin', -- admin, super_admin, editor
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    is_active BOOLEAN DEFAULT true,
    last_login TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 3️⃣ **analytics** (Site İstatistikleri)
```sql
CREATE TABLE public.analytics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    metric_name VARCHAR(100) NOT NULL,
    metric_value BIGINT NOT NULL,
    metric_date DATE NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 4️⃣ **newsletters** (Email Abonelikleri)
```sql
CREATE TABLE public.newsletters (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    status VARCHAR(20) DEFAULT 'active', -- active, unsubscribed, bounced
    subscribed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    unsubscribed_at TIMESTAMP WITH TIME ZONE,
    ip_address INET,
    source VARCHAR(50) DEFAULT 'website'
);
```

## 🔮 Gelecekte Eklenebilecek Tablolar

### 5️⃣ **faqs** (Sık Sorulan Sorular)
```sql
CREATE TABLE public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_tr TEXT NOT NULL,
    question_en TEXT,
    answer_tr TEXT NOT NULL,
    answer_en TEXT,
    category VARCHAR(50) DEFAULT 'general',
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 6️⃣ **testimonials** (Kullanıcı Yorumları)
```sql
CREATE TABLE public.testimonials (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    title VARCHAR(255),
    content_tr TEXT NOT NULL,
    content_en TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    avatar_url TEXT,
    is_featured BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 7️⃣ **partners** (Ortaklar/Sponsorlar)
```sql
CREATE TABLE public.partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo_url TEXT,
    website_url TEXT,
    description_tr TEXT,
    description_en TEXT,
    partner_type VARCHAR(50) DEFAULT 'sponsor', -- sponsor, partner, venue
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### 8️⃣ **audit_logs** (Admin Panel Logları)
```sql
CREATE TABLE public.audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES public.users(id),
    action VARCHAR(100) NOT NULL,
    table_name VARCHAR(100),
    record_id UUID,
    old_values JSONB,
    new_values JSONB,
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## 📈 Öncelik Sıralaması

1. **contact_submissions** - Hemen gerekli (Contact form için)
2. **users** - Admin panel güvenliği için
3. **analytics** - Site performans takibi için  
4. **newsletters** - Marketing için
5. **faqs** - Müşteri desteği için
6. **testimonials** - Sosyal kanıt için
7. **partners** - İş geliştirme için
8. **audit_logs** - Güvenlik/compliance için 