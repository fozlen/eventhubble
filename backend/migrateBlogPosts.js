const database = require('./database')

// Örnek blog yazıları - localStorage'dan alınan veriler
const sampleBlogPosts = [
  {
    title_tr: "Müzik Festivali Sezonu Başlıyor",
    title_en: "Music Festival Season Begins",
    excerpt_tr: "Bu yılın en büyük müzik festivalleri hakkında detaylı bilgi ve bilet satışları başladı.",
    excerpt_en: "Detailed information about this year's biggest music festivals and ticket sales have begun.",
    content_tr: "Müzik festivali sezonu resmen başladı! Bu yıl Türkiye'nin dört bir yanında gerçekleşecek festivaller, müzikseverlere unutulmaz deneyimler sunacak.\n\nRock, pop, elektronik müzik ve daha birçok türde sanatçı, sahne alacak. Festival alanlarında sadece müzik değil, aynı zamanda yemek, sanat ve eğlence de bulacaksınız.\n\nBiletler sınırlı sayıda olduğu için erken rezervasyon yapmanızı öneriyoruz. Festival tarihleri ve detaylı program için web sitemizi takip edin.",
    content_en: "The music festival season has officially begun! This year's festivals taking place across Turkey will offer unforgettable experiences to music lovers.\n\nArtists from rock, pop, electronic music and many other genres will take the stage. At festival venues, you'll find not only music but also food, art and entertainment.\n\nWe recommend early booking as tickets are limited. Follow our website for festival dates and detailed program.",
    category: "Music",
    image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
    url: "https://example.com/music-festival-season",
    tags: ["müzik", "festival", "konser", "music", "festival", "concert"],
    author: "Admin",
    date: "2024-01-15"
  },
  {
    title_tr: "Spor Dünyasından Son Gelişmeler",
    title_en: "Latest News from the Sports World",
    excerpt_tr: "Futbol, basketbol ve diğer spor dallarından en güncel haberler ve transfer gelişmeleri.",
    excerpt_en: "Latest news and transfer developments from football, basketball and other sports.",
    content_tr: "Spor dünyası bu hafta da hareketli geçiyor. Transfer döneminde büyük sürprizler yaşanıyor ve takımlar güçlerini artırmak için yoğun çaba gösteriyor.\n\nFutbolda, büyük kulüpler arasında rekabet kızışıyor. Basketbolda ise play-off heyecanı dorukta. Diğer spor dallarında da önemli gelişmeler yaşanıyor.\n\nSporcuların performansları ve takımların stratejileri hakkında detaylı analizler için bizi takip etmeye devam edin.",
    content_en: "The sports world continues to be busy this week. Big surprises are happening during the transfer period and teams are working hard to increase their strength.\n\nIn football, competition is heating up between big clubs. In basketball, playoff excitement is at its peak. Important developments are also happening in other sports.\n\nContinue to follow us for detailed analysis of athletes' performances and team strategies.",
    category: "Sports",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    url: "https://example.com/sports-news",
    tags: ["spor", "futbol", "basketbol", "sports", "football", "basketball"],
    author: "Admin",
    date: "2024-01-14"
  },
  {
    title_tr: "Sanat Galerilerinde Yeni Sergiler",
    title_en: "New Exhibitions in Art Galleries",
    excerpt_tr: "İstanbul'un önde gelen sanat galerilerinde açılan yeni sergiler ve sanat etkinlikleri hakkında bilgi.",
    excerpt_en: "Information about new exhibitions and art events opening in Istanbul's leading art galleries.",
    content_tr: "İstanbul'un sanat dünyası bu ay çok hareketli! Şehrin önde gelen galerilerinde yeni sergiler açılıyor ve sanatseverler için özel etkinlikler düzenleniyor.\n\nÇağdaş sanat, klasik resim, heykel ve dijital sanat alanlarında çeşitli sergiler bulabilirsiniz. Ayrıca sanatçılarla buluşma ve workshop etkinlikleri de düzenleniyor.\n\nBu sergileri kaçırmamak için rezervasyon yapmanızı ve galeri programlarını takip etmenizi öneriyoruz.",
    content_en: "Istanbul's art world is very busy this month! New exhibitions are opening in the city's leading galleries and special events are organized for art lovers.\n\nYou can find various exhibitions in contemporary art, classical painting, sculpture and digital art. There are also artist meetings and workshop events.\n\nWe recommend making reservations and following gallery programs to not miss these exhibitions.",
    category: "Art",
    image: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
    url: "https://example.com/art-exhibitions",
    tags: ["sanat", "galeri", "sergi", "art", "gallery", "exhibition"],
    author: "Admin",
    date: "2024-01-13"
  }
]

async function migrateBlogPosts() {
  try {
    console.log('🚀 Blog yazıları migration başlıyor...')
    
    // Database bağlantısını kur
    await database.connect()
    console.log('✅ Database bağlantısı kuruldu')
    
    // Mevcut blog yazılarını temizle
    const collection = database.getCollection('blog_posts')
    await collection.deleteMany({})
    console.log('✅ Mevcut blog yazıları temizlendi')
    
    // Örnek blog yazılarını ekle
    for (const post of sampleBlogPosts) {
      await database.createBlogPost(post)
      console.log(`✅ Blog yazısı eklendi: ${post.title_tr}`)
    }
    
    console.log('🎉 Migration tamamlandı!')
    console.log(`📊 Toplam ${sampleBlogPosts.length} blog yazısı eklendi`)
    
  } catch (error) {
    console.error('❌ Migration hatası:', error)
  } finally {
    await database.disconnect()
    process.exit(0)
  }
}

// Script'i çalıştır
if (require.main === module) {
  migrateBlogPosts()
}

module.exports = { migrateBlogPosts } 