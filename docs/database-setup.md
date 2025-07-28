# MongoDB Atlas Kurulum Rehberi

## 1. MongoDB Atlas Hesabı Oluştur
1. https://cloud.mongodb.com adresine git
2. Ücretsiz hesap oluştur
3. "Build a Database" seç

## 2. Cluster Oluştur
- **Provider**: AWS
- **Region**: Frankfurt (eu-central-1) - Türkiye'ye en yakın
- **Cluster Tier**: M0 (Free)
- **Cluster Name**: eventhubble-cluster

## 3. Database Access
1. "Database Access" sekmesine git
2. "Add New Database User" tıkla
3. **Username**: eventhubble_user
4. **Password**: Güçlü şifre oluştur
5. **Database User Privileges**: Atlas admin

## 4. Network Access
1. "Network Access" sekmesine git
2. "Add IP Address" tıkla
3. **IP Address**: 0.0.0.0/0 (tüm IP'lere izin ver)

## 5. Connection String
1. "Database" sekmesine git
2. "Connect" butonuna tıkla
3. "Connect your application" seç
4. Connection string'i kopyala:
```
mongodb+srv://eventhubble_user:<password>@eventhubble-cluster.xxxxx.mongodb.net/eventhubble?retryWrites=true&w=majority
```

## 6. Environment Variable
Backend'de MONGODB_URI environment variable'ına connection string'i ekle:
```
MONGODB_URI=mongodb+srv://eventhubble_user:password@eventhubble-cluster.xxxxx.mongodb.net/eventhubble?retryWrites=true&w=majority
```

## 7. Database Schema
```javascript
// events collection
{
  _id: ObjectId,
  title: String,
  title_tr: String,
  title_en: String,
  description: String,
  description_tr: String,
  description_en: String,
  venue: String,
  venue_tr: String,
  venue_en: String,
  city: String,
  city_tr: String,
  city_en: String,
  date: Date,
  price: Number,
  currency: String,
  image_url: String,
  ticket_url: String,
  platform: String,
  organizer: String,
  organizer_tr: String,
  organizer_en: String,
  category: String,
  tags: [String],
  source: String,
  created_at: Date,
  updated_at: Date
}
``` 