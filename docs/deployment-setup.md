# EventHubble Auto-Deployment Setup Guide

Bu rehber, EventHubble projesinin GitHub'dan Netlify ve Render'a otomatik deployment kurulumunu açıklar.

## 🚀 Kurulum Adımları

### 1. GitHub Repository Ayarları

#### GitHub Secrets Ekleme
GitHub repository'nizde aşağıdaki secrets'ları eklemeniz gerekiyor:

1. **Settings > Secrets and variables > Actions** bölümüne gidin
2. Aşağıdaki secrets'ları ekleyin:

```
NETLIFY_AUTH_TOKEN=your_netlify_auth_token
NETLIFY_SITE_ID=your_netlify_site_id
RENDER_API_KEY=your_render_api_key
RENDER_SERVICE_ID=your_render_service_id
```

### 2. Netlify Kurulumu

#### Netlify Auth Token Alma:
1. Netlify hesabınıza giriş yapın
2. **User Settings > Applications > Personal access tokens**
3. "New access token" butonuna tıklayın
4. Token'ı kopyalayın ve GitHub secrets'a ekleyin

#### Site ID Alma:
1. Netlify dashboard'da sitenizi seçin
2. **Site settings > General > Site information**
3. "Site ID" değerini kopyalayın

#### GitHub Integration:
1. Netlify dashboard'da sitenizi seçin
2. **Site settings > Build & deploy > Continuous Deployment**
3. "Connect to Git provider" butonuna tıklayın
4. GitHub'ı seçin ve repository'nizi bağlayın
5. Branch olarak `main` seçin

### 3. Render Kurulumu

#### Render API Key Alma:
1. Render dashboard'a giriş yapın
2. **Account > API Keys**
3. "Create API Key" butonuna tıklayın
4. Key'i kopyalayın ve GitHub secrets'a ekleyin

#### Service ID Alma:
1. Render dashboard'da servisinizi seçin
2. **Settings > General**
3. "Service ID" değerini kopyalayın

#### GitHub Integration:
1. Render dashboard'da servisinizi seçin
2. **Settings > General > Build & Deploy**
3. "Connect to GitHub" butonuna tıklayın
4. Repository'nizi seçin
5. Branch olarak `main` seçin

## 🔧 Konfigürasyon Dosyaları

### GitHub Actions Workflows
- `.github/workflows/deploy.yml` - Ana deployment workflow'u
- `.github/workflows/test.yml` - Test ve lint workflow'u

### Netlify Konfigürasyonu
- `netlify.toml` - Netlify build ve deploy ayarları

### Render Konfigürasyonu
- `render.yaml` - Render servis konfigürasyonu

## 📋 Deployment Süreci

### Otomatik Deployment Tetikleyicileri:
1. **Push to main branch** - Otomatik deployment
2. **Pull Request to main** - Preview deployment
3. **Manual trigger** - GitHub Actions'dan manuel tetikleme

### Deployment Sırası:
1. **Test ve Lint** - Kod kalitesi kontrolü
2. **Frontend Build** - React uygulaması build edilir
3. **Netlify Deployment** - Frontend Netlify'a deploy edilir
4. **Backend Build** - Backend test edilir
5. **Render Deployment** - Backend Render'a deploy edilir

## 🔍 Troubleshooting

### Yaygın Sorunlar:

#### 1. Build Hatası
```bash
# Local test için:
npm run build
cd backend && npm test
```

#### 2. Secrets Hatası
- GitHub secrets'ların doğru eklendiğinden emin olun
- Token'ların geçerli olduğunu kontrol edin

#### 3. CORS Hatası
- Backend'de CORS ayarlarını kontrol edin
- Frontend URL'lerinin doğru olduğundan emin olun

#### 4. Environment Variables
- Render'da environment variables'ları kontrol edin
- Netlify'da build environment variables'ları kontrol edin

## 📊 Monitoring

### Deployment Durumu Kontrolü:
1. **GitHub Actions** - `.github/actions` sekmesinde
2. **Netlify** - Dashboard'da deployment logları
3. **Render** - Dashboard'da deployment logları

### Health Check:
- Backend: `https://your-render-app.onrender.com/health`
- Frontend: `https://your-netlify-app.netlify.app`

## 🔄 Manual Deployment

### GitHub Actions'dan Manuel Tetikleme:
1. GitHub repository'de **Actions** sekmesine gidin
2. **Deploy to Netlify and Render** workflow'unu seçin
3. **Run workflow** butonuna tıklayın

### Komut Satırından:
```bash
# Local build test
npm run build
cd backend && npm test

# Git push (otomatik deployment tetikler)
git add .
git commit -m "Update deployment"
git push origin main
```

## 📝 Notlar

- Deployment süresi yaklaşık 5-10 dakika
- İlk deployment daha uzun sürebilir
- Pull request'ler preview deployment oluşturur
- Production deployment sadece main branch'e push'ta tetiklenir

## 🆘 Destek

Sorun yaşarsanız:
1. GitHub Actions loglarını kontrol edin
2. Netlify/Render deployment loglarını kontrol edin
3. Environment variables'ları doğrulayın
4. Build komutlarını local'de test edin 