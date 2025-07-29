# CDN Kurulum Rehberi - Cloudflare

## 1. Cloudflare Hesabı Oluştur
1. https://cloudflare.com adresine git
2. Ücretsiz hesap oluştur
3. Domain'i ekle (eventhubble.com veya subdomain)

## 2. DNS Ayarları
```
Type: CNAME
Name: cdn
Target: eventhubble.onrender.com
Proxy: Enabled (Orange Cloud)
```

## 3. Page Rules (Opsiyonel)
```
URL: cdn.eventhubble.com/images/*
Settings:
- Cache Level: Cache Everything
- Edge Cache TTL: 1 day
- Browser Cache TTL: 1 week
```

## 4. SSL/TLS Ayarları
- SSL/TLS Mode: Full (strict)
- Always Use HTTPS: On
- HSTS: On

## 5. Cache Ayarları
- Cache Level: Standard
- Browser Cache TTL: 1 week
- Edge Cache TTL: 1 day

## 6. Security Ayarları
- Security Level: Medium
- Bot Fight Mode: On
- Browser Integrity Check: On 