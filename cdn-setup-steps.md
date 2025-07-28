# Cloudflare CDN Kurulum Adımları

## 1. Cloudflare Hesabı Oluştur
- https://cloudflare.com adresine git
- "Sign Up" butonuna tıkla
- Email ve şifre ile hesap oluştur

## 2. Domain Ekle
- Dashboard'da "Add a Site" butonuna tıkla
- Domain adını gir: `eventhubble.com` veya subdomain
- Free plan seç

## 3. DNS Ayarları
- "DNS" sekmesine git
- "Add record" butonuna tıkla
- Şu ayarları yap:
  ```
  Type: CNAME
  Name: cdn
  Target: eventhubble-api.onrender.com
  Proxy status: Proxied (Orange Cloud)
  ```

## 4. SSL/TLS Ayarları
- "SSL/TLS" sekmesine git
- "Overview" altında:
  - SSL/TLS encryption mode: Full (strict)
  - Always Use HTTPS: On
  - HSTS: On

## 5. Cache Ayarları
- "Caching" sekmesine git
- "Configuration" altında:
  - Cache Level: Standard
  - Browser Cache TTL: 1 week
  - Edge Cache TTL: 1 day

## 6. Security Ayarları
- "Security" sekmesine git
- "Settings" altında:
  - Security Level: Medium
  - Bot Fight Mode: On
  - Browser Integrity Check: On

## 7. Test Et
Deploy tamamlandıktan sonra:
- https://cdn.eventhubble.com/health
- https://cdn.eventhubble.com/api/status 