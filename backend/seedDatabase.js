// Script to seed database with sample data
import DatabaseService from './databaseService.js'

async function seedDatabase() {
  console.log('🌱 Database seed başlatılıyor...')

  try {
    // ===== SAMPLE LOGOS =====
    console.log('📝 Logolar ekleniyor...')
    
    const sampleLogos = [
      {
        logo_id: 'main',
        filename: 'Logo.png',
        title: 'EventHubble Ana Logo',
        alt_text: 'EventHubble Ana Logo',
        file_path: '/Logo.png',
        mime_type: 'image/png',
        display_order: 1
      },
      {
        logo_id: 'dark',
        filename: 'eventhubble_dark_transparent_logo.png',
        title: 'EventHubble Koyu Logo',
        alt_text: 'EventHubble Koyu Tema Logo',
        file_path: '/eventhubble_dark_transparent_logo.png',
        mime_type: 'image/png',
        display_order: 2
      },
      {
        logo_id: 'light',
        filename: 'eventhubble_light_transparent_logo.png',
        title: 'EventHubble Açık Logo',
        alt_text: 'EventHubble Açık Tema Logo',
        file_path: '/eventhubble_light_transparent_logo.png',
        mime_type: 'image/png',
        display_order: 3
      },
      {
        logo_id: 'large',
        filename: 'MainLogo.png',
        title: 'EventHubble Büyük Logo',
        alt_text: 'EventHubble Büyük Ana Logo',
        file_path: '/MainLogo.png',
        mime_type: 'image/png',
        display_order: 4
      }
    ]

    for (const logo of sampleLogos) {
      const result = await DatabaseService.createLogo(logo)
      if (result.success) {
        console.log(`✅ Logo eklendi: ${logo.title}`)
      } else {
        console.log(`⚠️ Logo eklenirken hata: ${logo.title} - ${result.error}`)
      }
    }

    // ===== SAMPLE IMAGES =====
    console.log('🖼️ Resimler ekleniyor...')
    
    const sampleImages = [
      {
        image_id: 'hero_main',
        category: 'hero',
        title: 'Ana Sayfa Hero Resmi',
        alt_text: 'EventHubble Ana Sayfa Hero',
        filename: 'hero-events.jpg',
        file_path: '/images/hero-events.jpg',
        mime_type: 'image/jpeg',
        width: 1920,
        height: 1080,
        tags: ['hero', 'main', 'events']
      },
      {
        image_id: 'category_music',
        category: 'icon',
        title: 'Müzik Kategorisi İkonu',
        alt_text: 'Müzik Etkinlikleri İkonu',
        filename: 'music-icon.svg',
        file_path: '/images/icons/music.svg',
        mime_type: 'image/svg+xml',
        width: 64,
        height: 64,
        tags: ['category', 'music', 'icon']
      },
      {
        image_id: 'category_sports',
        category: 'icon',
        title: 'Spor Kategorisi İkonu',
        alt_text: 'Spor Etkinlikleri İkonu',
        filename: 'sports-icon.svg',
        file_path: '/images/icons/sports.svg',
        mime_type: 'image/svg+xml',
        width: 64,
        height: 64,
        tags: ['category', 'sports', 'icon']
      }
    ]

    for (const image of sampleImages) {
      const result = await DatabaseService.createImage(image)
      if (result.success) {
        console.log(`✅ Resim eklendi: ${image.title}`)
      } else {
        console.log(`⚠️ Resim eklenirken hata: ${image.title} - ${result.error}`)
      }
    }

    // ===== SAMPLE EVENTS =====
    console.log('🎪 Etkinlikler ekleniyor...')
    
    const sampleEvents = [
      {
        event_id: 'sample_concert_001',
        title_tr: 'Sezen Aksu Konseri',
        title_en: 'Sezen Aksu Concert',
        description_tr: 'Türk pop müziğinin kraliçesi Sezen Aksu, büyüleyici şarkılarıyla sahne alıyor.',
        description_en: 'The queen of Turkish pop music Sezen Aksu takes the stage with her enchanting songs.',
        short_description_tr: 'Sezen Aksu\'nun unutulmaz konseri',
        short_description_en: 'Sezen Aksu\'s unforgettable concert',
        category: 'music',
        subcategory: 'pop',
        price_min: 150.00,
        price_max: 500.00,
        currency: 'TRY',
        start_date: '2024-06-15T20:00:00Z',
        end_date: '2024-06-15T23:00:00Z',
        venue_name: 'Volkswagen Arena',
        venue_address: 'Küçükçekmece, İstanbul',
        city: 'İstanbul',
        country: 'Turkey',
        latitude: 41.0082,
        longitude: 28.9784,
        ticket_url: 'https://biletix.com/sezen-aksu',
        organizer_name: 'Biletix',
        source_platform: 'manual',
        is_featured: true,
        tags: ['music', 'pop', 'concert', 'sezen-aksu'],
        metadata: {
          seating_plan: 'available',
          accessibility: true,
          parking: true
        }
      },
      {
        event_id: 'sample_theater_001',
        title_tr: 'Hamlet Tiyatro Oyunu',
        title_en: 'Hamlet Theater Play',
        description_tr: 'Shakespeare\'in ölümsüz eseri Hamlet, modern yorumuyla sahne alıyor.',
        description_en: 'Shakespeare\'s immortal work Hamlet takes the stage with a modern interpretation.',
        short_description_tr: 'Modern yorumlu Hamlet oyunu',
        short_description_en: 'Hamlet play with modern interpretation',
        category: 'theater',
        subcategory: 'drama',
        price_min: 80.00,
        price_max: 200.00,
        currency: 'TRY',
        start_date: '2024-07-20T19:30:00Z',
        end_date: '2024-07-20T22:00:00Z',
        venue_name: 'İstanbul Devlet Tiyatrosu',
        venue_address: 'Beyoğlu, İstanbul',
        city: 'İstanbul',
        country: 'Turkey',
        latitude: 41.0369,
        longitude: 28.9850,
        ticket_url: 'https://devtiyatro.gov.tr/hamlet',
        organizer_name: 'İstanbul Devlet Tiyatrosu',
        source_platform: 'manual',
        is_featured: false,
        tags: ['theater', 'drama', 'shakespeare', 'hamlet'],
        metadata: {
          language: 'turkish',
          duration: '150 minutes',
          intermission: true
        }
      }
    ]

    for (const event of sampleEvents) {
      const result = await DatabaseService.createEvent(event)
      if (result.success) {
        console.log(`✅ Etkinlik eklendi: ${event.title_tr}`)
      } else {
        console.log(`⚠️ Etkinlik eklenirken hata: ${event.title_tr} - ${result.error}`)
      }
    }

    console.log('🎉 Database seed tamamlandı!')

  } catch (error) {
    console.error('❌ Database seed hatası:', error)
  }
}

// Run the seed function
if (import.meta.url === `file://${process.argv[1]}`) {
  seedDatabase()
}

export default seedDatabase 