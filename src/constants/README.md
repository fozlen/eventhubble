# EventHubble Dynamic Color System

Bu sistem, EventHubble uygulamasında renkleri dinamik olarak yönetmek için tasarlanmıştır. Hardcode renk değerleri yerine merkezi bir sistem kullanır.

## 🎨 Kullanım

### 1. JavaScript'te Renk Kullanımı

```javascript
import { COLORS, getCategoryColor } from '../constants/colors'

// Doğrudan renk kullanımı
const primaryColor = COLORS.PRIMARY
const backgroundColor = COLORS.BACKGROUND

// Kategori rengi alma
const musicColor = getCategoryColor('music')
```

### 2. React Hook ile Renk Yönetimi

```javascript
import { useColors } from '../hooks/useColors'

const MyComponent = () => {
  const { primary, getCategoryColor, updateColor } = useColors()
  
  // Direkt renk erişimi
  const style = { backgroundColor: primary }
  
  // Renk güncelleme
  const changeTheme = () => {
    updateColor('primary', '#FF5733')
  }
  
  return <div style={style}>Content</div>
}
```

### 3. CSS/Tailwind'de Renk Kullanımı

```css
/* CSS Variables */
.my-element {
  background-color: var(--color-primary);
  color: var(--color-text-primary);
}
```

```jsx
/* Tailwind Classes */
<div className="bg-primary text-text-primary">
  Content
</div>
```

### 4. Inline Styles'da Renk Kullanımı

```javascript
import { useColors } from '../hooks/useColors'

const MyComponent = () => {
  const { getCSSVar } = useColors()
  
  return (
    <div style={{ 
      backgroundColor: getCSSVar('primary'),
      color: getCSSVar('text-primary')
    }}>
      Content
    </div>
  )
}
```

## 🎯 Mevcut Renk Paleti

### Ana Renkler
- **Primary**: #3C2C7A (Deep Purple)
- **Primary Light**: #40B3E5 (Sky Blue)
- **Primary Accent**: #F390B5 (Pink)
- **Primary Cream**: #FCF2C5 (Light Cream)

### Arkaplan Renkleri
- **Background**: #FCF2C5 (Ana arkaplan)
- **Background Secondary**: #F8F6F0 (İkincil arkaplan)

### Metin Renkleri
- **Text Primary**: #3C2C7A (Ana metin)
- **Text Secondary**: #40B3E5 (İkincil metin)
- **Text Accent**: #F390B5 (Vurgu metni)

### Durum Renkleri
- **Success**: #10B981 (Başarı)
- **Error**: #EF4444 (Hata)
- **Warning**: #F59E0B (Uyarı)
- **Info**: #3B82F6 (Bilgi)

## 📝 Kategori Renkleri

Kategoriler için önceden tanımlı renkler:

```javascript
const categoryColors = {
  MUSIC: '#3C2C7A',
  THEATER: '#F390B5', 
  SPORTS: '#40B3E5',
  ART: '#FCF2C5',
  GASTRONOMY: '#EF4444',
  EDUCATION: '#3B82F6',
  TECHNOLOGY: '#6366F1',
  FASHION: '#EC4899',
  BUSINESS: '#F97316',
  HEALTH: '#10B981'
}
```

## 🛠 Admin Renk Paleti

Admin panelinde kullanılmak üzere hazır renk paleti:

```javascript
import { getAdminColors } from '../constants/colors'

const adminColors = getAdminColors()
// ['#3C2C7A', '#40B3E5', '#F390B5', '#FCF2C5', ...]
```

## 🔄 Tema Değiştirme

Gelecekte tema değiştirme özelliği için:

```javascript
import { useColors } from '../hooks/useColors'

const ThemeChanger = () => {
  const { changeTheme, updateColor } = useColors()
  
  const switchToDarkTheme = () => {
    updateColor('background', '#1F2937')
    updateColor('text-primary', '#F9FAFB')
  }
  
  return (
    <button onClick={switchToDarkTheme}>
      Dark Theme
    </button>
  )
}
```

## ✅ Avantajlar

1. **Merkezi Yönetim**: Tüm renkler tek yerden yönetiliyor
2. **Kolay Güncelleme**: Bir rengi değiştirdiğinizde tüm uygulamada güncelleniyor
3. **Tip Güvenliği**: TypeScript ile renk isimlerinde otomatik tamamlama
4. **Tema Desteği**: Gelecekte kolay tema değiştirme
5. **Performans**: CSS variables ile hızlı renk değişiklikleri
6. **Tutarlılık**: Tüm bileşenlerde aynı renk sistemini kullanma

## 🚫 Yapmayın

```javascript
// ❌ Hardcode renk kullanmayın
<div style={{ backgroundColor: '#3C2C7A' }}>

// ❌ Magic number kullanmayın  
<div className="bg-purple-600">

// ✅ Dinamik sistem kullanın
import { useColors } from '../hooks/useColors'
const { primary } = useColors()
<div style={{ backgroundColor: primary }}>

// ✅ CSS variables kullanın
<div className="bg-primary">
```

## 🔧 Yeni Renk Ekleme

1. `colors.js` dosyasına rengi ekleyin
2. CSS variables'a ekleyin (`index.css`)
3. Tailwind config'e ekleyin (gerekirse)
4. useColors hook'una ekleyin

```javascript
// colors.js
export const COLORS = {
  // ...mevcut renkler
  NEW_COLOR: '#FF5733'
}

// index.css
:root {
  --color-new-color: #FF5733;
}

// tailwind.config.js
colors: {
  'new-color': 'var(--color-new-color)'
}
``` 