# Basit Netlify Setup (CDN Olmadan)

## 1. Netlify Dashboard'a Git
- https://app.netlify.com adresine git
- EventHubble projesini seç

## 2. Environment Variables Ekle
- "Site settings" → "Environment variables" sekmesine git
- "Add a variable" butonuna tıkla

## 3. Sadece Bu Variables'ları Ekle
```
Key: VITE_API_BASE_URL
Value: https://eventhubble-api.onrender.com/api
Scope: Production

Key: VITE_APP_ENV
Value: production
Scope: Production
```

## 4. Deploy Tetikle
- Environment variables eklendikten sonra
- "Deploys" sekmesine git
- "Trigger deploy" → "Deploy site" tıkla

## 5. Test Et
Deploy tamamlandıktan sonra:
- https://eventhubble.netlify.app adresine git
- Console'da hata olup olmadığını kontrol et

## Not: CDN Olmadan
- Image upload'lar direkt Render.com'da saklanacak
- URL: https://eventhubble-api.onrender.com/images/[filename]
- Bu da gayet iyi çalışır! 