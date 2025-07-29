# 🚀 EventHubble Production Deployment Checklist

## ✅ Backend (Render.com)

### 1. **Render.com Setup**
- [ ] Render.com hesabı oluştur
- [ ] Yeni Web Service oluştur
- [ ] GitHub repository'yi bağla
- [ ] Root Directory: `backend` olarak ayarla

### 2. **Environment Variables (Render.com)**
```bash
NODE_ENV=production
PORT=3001
CORS_ORIGINS=https://eventhubble.com,https://eventhubble.netlify.app
SUPABASE_URL=https://wzuvofowdjvtakgmqqgg.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6dXZvZm93ZGp2dGFrZ21xcWdnIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4MDg1OTksImV4cCI6MjA2OTM4NDU5OX0.1Kqh9SsSz3_V4YKnlXSXewuA0yIr-Twp4FEkr20TE_I
MAX_FILE_SIZE=10485760
UPLOAD_DIR=uploads
```

### 3. **Build Settings**
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Auto Deploy:** Enabled

## ✅ Frontend (Netlify)

### 1. **Netlify Setup**
- [ ] Netlify hesabı oluştur
- [ ] GitHub repository'yi bağla
- [ ] Build settings ayarla

### 2. **Build Settings (Netlify)**
- **Base directory:** (boş bırak)
- **Build command:** `npm run build`
- **Publish directory:** `dist`

### 3. **Environment Variables (Netlify)**
```bash
NODE_ENV=production
VITE_API_BASE_URL=https://eventhubble-backend.onrender.com
```

### 4. **Domain Settings**
- [ ] Custom domain: `eventhubble.com`
- [ ] SSL certificate otomatik
- [ ] Redirects ayarla

## ✅ Supabase Database

### 1. **Database Setup**
- [ ] ✅ Tablo oluşturuldu: `blog_posts`
- [ ] ✅ CSV import edildi
- [ ] ✅ 12 column tanımlandı

### 2. **Row Level Security (RLS)**
- [ ] RLS disabled (şimdilik)
- [ ] Public read access
- [ ] Admin write access

### 3. **API Keys**
- [ ] ✅ URL: `https://wzuvofowdjvtakgmqqgg.supabase.co`
- [ ] ✅ Anon Key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

## 🔧 Testing Checklist

### 1. **Backend API Tests**
- [ ] Health check: `GET /health`
- [ ] Blog posts: `GET /api/blog-posts`
- [ ] Blog post detail: `GET /api/blog-posts/:id`
- [ ] Create blog post: `POST /api/blog-posts`
- [ ] Update blog post: `PUT /api/blog-posts/:id`
- [ ] Delete blog post: `DELETE /api/blog-posts/:id`

### 2. **Frontend Tests**
- [ ] Homepage loads
- [ ] Blog posts display
- [ ] Admin panel works
- [ ] Create/edit/delete blog posts
- [ ] Image uploads work
- [ ] Language switching works

### 3. **Production Tests**
- [ ] HTTPS redirects work
- [ ] CORS headers correct
- [ ] Database connections stable
- [ ] Error handling works
- [ ] Performance acceptable

## 🚀 Deployment Steps

### 1. **Backend Deployment**
```bash
# Render.com'da deploy et
git add .
git commit -m "Supabase migration complete"
git push origin main
```

### 2. **Frontend Deployment**
```bash
# Netlify'da deploy et
npm run build
# Netlify otomatik deploy edecek
```

### 3. **Domain Configuration**
- [ ] DNS records ayarla
- [ ] SSL certificates aktif
- [ ] Redirects çalışıyor

## 📊 Monitoring

### 1. **Health Checks**
- [ ] Backend health: `https://eventhubble-backend.onrender.com/health`
- [ ] Frontend loads: `https://eventhubble.com`
- [ ] API responses: `https://eventhubble-backend.onrender.com/api/blog-posts`

### 2. **Error Monitoring**
- [ ] Render.com logs
- [ ] Netlify function logs
- [ ] Supabase logs

## 🎯 Success Criteria

- [ ] Blog posts admin panel'den oluşturulabiliyor
- [ ] Blog posts tüm kullanıcılarda görünüyor
- [ ] Production'da localStorage kullanılmıyor
- [ ] Supabase database çalışıyor
- [ ] API endpoints çalışıyor
- [ ] Frontend-backend iletişimi çalışıyor

## 🔄 Rollback Plan

Eğer sorun çıkarsa:
1. MongoDB'ye geri dön
2. localStorage fallback aktif
3. Eski API endpoints restore et

---

**Status:** 🟡 In Progress
**Last Updated:** 2024-07-29
**Next Step:** Render.com deployment 