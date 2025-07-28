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
      console.log('🔄 Fallback: Sadece manuel etkinlikler kullanılıyor...')
      // Fallback: Sadece manuel etkinlikler
      const manualEvents = this.getManualEvents()
      return manualEvents
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


} 