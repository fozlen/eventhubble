// Event Service - Gerçek Backend API entegrasyonu
const API_BASE_URL = 'http://localhost:3001/api'

export class EventService {
  // Gerçek etkinlik verilerini çek
  static async getEvents(filters = {}) {
    try {
      console.log('🔄 Backend API\'den veriler çekiliyor...')
      
      const response = await fetch(`${API_BASE_URL}/events`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error(`API çağrısı başarısız: ${response.status}`)
      }
      
      const data = await response.json()
      console.log(`✅ ${data.events?.length || 0} etkinlik alındı`)
      
      // Manuel etkinlikleri de ekle
      const manualEvents = this.getManualEvents()
      const allEvents = [...(data.events || []), ...manualEvents]
      
      return allEvents
    } catch (error) {
      console.error('❌ API Error:', error)
      console.log('🔄 Fallback: Mock data kullanılıyor...')
      // Fallback: Mock data + manuel etkinlikler
      const mockEvents = this.getMockEvents()
      const manualEvents = this.getManualEvents()
      return [...mockEvents, ...manualEvents]
    }
  }

  // Backend durumunu kontrol et
  static async getStatus() {
    try {
      const response = await fetch(`${API_BASE_URL}/status`)
      if (!response.ok) {
        throw new Error('Status API çağrısı başarısız')
      }
      return await response.json()
    } catch (error) {
      console.error('Status Error:', error)
      return { error: 'Backend bağlantısı yok' }
    }
  }

  // İstatistikleri al
  static async getStats() {
    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (!response.ok) {
        throw new Error('Stats API çağrısı başarısız')
      }
      return await response.json()
    } catch (error) {
      console.error('Stats Error:', error)
      return null
    }
  }

  // Manuel scraping tetikle
  static async triggerScraping() {
    try {
      const response = await fetch(`${API_BASE_URL}/scrape`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })
      
      if (!response.ok) {
        throw new Error('Scraping tetikleme başarısız')
      }
      
      return await response.json()
    } catch (error) {
      console.error('Scraping Error:', error)
      throw error
    }
  }

  // Etkinlik detaylarını çek
  static async getEventDetails(eventId) {
    try {
      // Önce manuel etkinliklerde ara
      const manualEvents = this.getManualEvents()
      const manualEvent = manualEvents.find(event => event.id === eventId)
      if (manualEvent) {
        return manualEvent
      }

      // Backend API'de ara
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`)
      if (!response.ok) {
        throw new Error('Etkinlik detayları alınamadı')
      }
      return await response.json()
    } catch (error) {
      console.error('Event Details Error:', error)
      return null
    }
  }

  // Gerçek bilet satış URL'sini al
  static getTicketUrl(event) {
    if (event.url) {
      return event.url
    }
    
    // Platform bazlı fallback URL'ler
    const platformUrls = {
      mobilet: 'https://mobilet.com/tr/events',
      biletinial: 'https://biletinial.com/etkinlikler',
      biletix: 'https://www.biletix.com/etkinlik'
    }
    
    if (event.platform && platformUrls[event.platform]) {
      return platformUrls[event.platform]
    }
    
    // Google arama fallback
    return `https://www.google.com/search?q=${encodeURIComponent(event.title)} bilet`
  }

  // Manuel etkinlikleri getir
  static getManualEvents() {
    try {
      const storedEvents = localStorage.getItem('manualEvents')
      return storedEvents ? JSON.parse(storedEvents) : []
    } catch (error) {
      console.error('Manuel etkinlikler yüklenirken hata:', error)
      return []
    }
  }

  // Mock data (gerçek API olmadığında)
  static getMockEvents() {
    return [
      {
        id: "event_1",
        title: "The Groove Festival",
        description: "Türkiye'nin en büyük müzik festivali, 3 gün boyunca sürecek muhteşem performanslar.",
        date: "2025-08-15",
        time: "18:00",
        venue: "Küçükçiftlik Park",
        city: "İstanbul",
        price_min: 150,
        price_max: 450,
        currency: "TRY",
        category: "müzik",
        platform: "mobilet",
        image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
        status: "active",
        url: "https://mobilet.com/tr/event/the-groove-festival-46834/",
        attendees: 6795,
        rating: 4.2,
        available_tickets: 1250,
        organizer: "Groove Productions",
        contact: "+90 212 555 0123",
        website: "https://groovefestival.com"
      },
      {
        id: "event_2", 
        title: "Calibre Fest Bodrum - Tiësto",
        description: "Bodrum'un en büyük elektronik müzik festivali, dünya çapında DJ'ler.",
        date: "2025-07-20",
        time: "22:00",
        venue: "Bodrum Kalesi",
        city: "Bodrum",
        price_min: 200,
        price_max: 600,
        currency: "TRY",
        category: "festival",
        platform: "mobilet",
        image_url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
        status: "active",
        url: "https://mobilet.com/tr/event/calibre-fest-bodrum-tisto-45330/",
        attendees: 4500,
        rating: 4.8,
        available_tickets: 800,
        organizer: "Calibre Events",
        contact: "+90 252 555 0456",
        website: "https://calibrefest.com"
      },
      {
        id: "event_3",
        title: "Romeo ve Juliet",
        description: "Shakespeare'in ölümsüz eseri, modern yorumla.",
        date: "2025-09-05",
        time: "19:30",
        venue: "İstanbul Devlet Tiyatrosu",
        city: "İstanbul",
        price_min: 60,
        price_max: 180,
        currency: "TRY",
        category: "tiyatro",
        platform: "biletinial",
        image_url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
        status: "active",
        url: "https://biletinial.com/event/romeo-ve-juliet-2025",
        attendees: 1200,
        rating: 4.5,
        available_tickets: 150,
        organizer: "İstanbul Devlet Tiyatrosu",
        contact: "+90 212 555 0789",
        website: "https://istanbuldt.gov.tr"
      },
      {
        id: "event_4",
        title: "Fenerbahçe vs Galatasaray",
        description: "Türkiye'nin en büyük derbisi, unutulmaz atmosfer.",
        date: "2025-10-15",
        time: "20:00",
        venue: "Ülker Stadyumu",
        city: "İstanbul",
        price_min: 200,
        price_max: 800,
        currency: "TRY",
        category: "spor",
        platform: "mobilet",
        image_url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
        status: "active",
        url: "https://mobilet.com/tr/event/fenerbahce-galatasaray-2025",
        attendees: 52000,
        rating: 4.9,
        available_tickets: 5000,
        organizer: "TFF",
        contact: "+90 212 555 0321",
        website: "https://tff.org"
      }
    ]
  }
} 