# Netlify Environment Variables Kurulum

## 1. Netlify Dashboard'a Git
- https://app.netlify.com adresine git
- EventHubble projesini seç

## 2. Environment Variables Ekle
- "Site settings" → "Environment variables" sekmesine git
- "Add a variable" butonuna tıkla

## 3. Variables Ekle
Şu environment variables'ları ekle:

### Production Variables
```
Key: VITE_API_BASE_URL
Value: https://eventhubble-api.onrender.com/api
Scope: Production

Key: VITE_CDN_BASE_URL  
Value: https://cdn.eventhubble.com
Scope: Production

Key: VITE_APP_ENV
Value: production
Scope: Production
```

### Development Variables (Opsiyonel)
```
Key: VITE_API_BASE_URL
Value: http://localhost:3001/api
Scope: Development

Key: VITE_CDN_BASE_URL
Value: http://localhost:3001/images
Scope: Development
```

## 4. Deploy Tetikle
- Environment variables eklendikten sonra
- "Deploys" sekmesine git
- "Trigger deploy" → "Deploy site" tıkla

## 5. Test Et
Deploy tamamlandıktan sonra:
- https://eventhubble.netlify.app adresine git
- Console'da hata olup olmadığını kontrol et
- API bağlantısını test et 