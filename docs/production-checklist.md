# Production Deployment Checklist

## ✅ Backend (Render.com)
- [ ] Render.com hesabı oluştur
- [ ] Yeni web service oluştur
- [ ] GitHub repository'yi bağla
- [ ] Environment variables ayarla:
  - [ ] NODE_ENV=production
  - [ ] PORT=10000
  - [ ] CORS_ORIGINS=https://eventhubble.netlify.app
  - [ ] CDN_BASE_URL=https://cdn.eventhubble.com
  - [ ] MONGODB_URI=mongodb+srv://...
- [ ] Deploy et ve URL'i al: https://eventhubble.onrender.com

## ✅ Database (MongoDB Atlas)
- [ ] MongoDB Atlas hesabı oluştur
- [ ] Free cluster oluştur (M0)
- [ ] Database user oluştur
- [ ] Network access ayarla (0.0.0.0/0)
- [ ] Connection string'i al
- [ ] Backend'e MONGODB_URI ekle

## ✅ CDN (Cloudflare)
- [ ] Cloudflare hesabı oluştur
- [ ] Domain ekle (eventhubble.com veya subdomain)
- [ ] DNS ayarları:
  - [ ] CNAME: cdn → eventhubble.onrender.com
  - [ ] Proxy: Enabled (Orange Cloud)
- [ ] SSL/TLS ayarları
- [ ] Cache ayarları
- [ ] Security ayarları

## ✅ Frontend (Netlify)
- [ ] Environment variables güncelle:
  - [ ] VITE_API_BASE_URL=https://eventhubble.onrender.com/api
  - [ ] VITE_CDN_BASE_URL=https://cdn.eventhubble.com
- [ ] Production build oluştur
- [ ] Deploy et

## ✅ Testing
- [ ] API health check: https://eventhubble.onrender.com/health
- [ ] API status: https://eventhubble.onrender.com/api/status
- [ ] Image upload test
- [ ] CDN image access test
- [ ] Frontend API bağlantısı test

## ✅ Monitoring
- [ ] Render.com monitoring aktif
- [ ] Cloudflare analytics aktif
- [ ] Error logging aktif
- [ ] Performance monitoring aktif

## 🔗 URLs
- **API**: https://eventhubble.onrender.com
- **CDN**: https://cdn.eventhubble.com
- **Frontend**: https://eventhubble.netlify.app
- **Health Check**: https://eventhubble.onrender.com/health 