# Production Setup - Blog Yazıları

## Backend (Render.com) Setup

### 1. Environment Variables
Render.com dashboard'unda aşağıdaki environment variables'ları ekleyin:

```
NODE_ENV=production
PORT=10000
CORS_ORIGINS=https://eventhubble.netlify.app,https://eventhubble.com,http://localhost:5173,http://localhost:3000
MONGODB_URI=mongodb+srv://fozlenn:<your_password>@cluster0.nzkre9w.mongodb.net/eventhubble?retryWrites=true&w=majority&appName=Cluster0
```

### 2. Build & Deploy Settings
- **Build Command:** `npm install`
- **Start Command:** `npm start`
- **Root Directory:** `backend`

### 3. Migration Çalıştırma
Deploy sonrası blog yazılarını eklemek için:

```bash
# Render.com shell'inde
cd backend
npm run migrate-blog
```

## Frontend (Netlify) Setup

### 1. Environment Variables
Netlify dashboard'unda aşağıdaki environment variables'ları ekleyin:

```
VITE_API_BASE_URL=https://eventhubble.onrender.com/api
```

### 2. Build Settings
- **Build Command:** `npm run build`
- **Publish Directory:** `dist`
- **Node Version:** `18` (veya daha yeni)

## Test Etme

### 1. API Test
```bash
# Blog yazılarını getir
curl https://eventhubble.onrender.com/api/blog-posts

# Health check
curl https://eventhubble.onrender.com/health
```

### 2. Frontend Test
1. `https://eventhubble.com/world-news` sayfasını ziyaret edin
2. Blog yazılarının göründüğünü kontrol edin
3. Admin panelinden (`/admin/login`) giriş yapın
4. Yeni blog yazısı ekleyin
5. Yeni yazının herkeste göründüğünü kontrol edin

## Troubleshooting

### API Çalışmıyor
1. Render.com loglarını kontrol edin
2. MongoDB bağlantısını kontrol edin
3. Environment variables'ları kontrol edin

### Frontend Blog Yazıları Görünmüyor
1. Browser console'da hata var mı kontrol edin
2. Network tab'ında API çağrılarını kontrol edin
3. Environment variables'ları kontrol edin

### CORS Hatası
1. Backend'de CORS_ORIGINS environment variable'ını kontrol edin
2. Frontend domain'inin CORS listesinde olduğundan emin olun

## Monitoring

### Backend Logs
- Render.com dashboard'unda logları takip edin
- MongoDB Atlas'ta connection'ları kontrol edin

### Frontend Monitoring
- Netlify analytics'i kullanın
- Browser console'da hataları takip edin

## Backup & Recovery

### Database Backup
```bash
# MongoDB Atlas'ta otomatik backup aktif
# Manuel backup için MongoDB Compass kullanın
```

### Code Backup
- GitHub'da tüm kodlar mevcut
- Migration script'i `backend/migrateBlogPosts.js` dosyasında

## Performance Optimization

### Backend
- MongoDB connection pooling
- API response caching
- Image optimization

### Frontend
- Lazy loading
- Image optimization
- Code splitting

## Security

### Backend
- CORS ayarları sadece gerekli domain'ler
- MongoDB connection string güvenli
- Input validation

### Frontend
- Environment variables güvenli
- API calls HTTPS üzerinden
- XSS protection 