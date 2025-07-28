// Event Service - Gerçek Backend API entegrasyonu
const API_BASE_URL = 'http://localhost:3001/api'

export class EventService {
  // Gerçek etkinlik verilerini çek
  static async getEvents(filters = {}, language = 'EN') {
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
      const manualEvents = this.getManualEvents(language)
      const allEvents = [...(data.events || []), ...manualEvents]
      
      return allEvents
    } catch (error) {
      console.error('❌ API Error:', error)
      console.log('🔄 Fallback: Sadece manuel etkinlikler kullanılıyor...')
      // Fallback: Sadece manuel etkinlikler
      const manualEvents = this.getManualEvents(language)
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
  static async getEventDetails(eventId, language = 'EN') {
    try {
      // Önce manuel etkinliklerde ara
      const manualEvents = this.getManualEvents(language)
      const manualEvent = manualEvents.find(event => event.id === eventId)
      if (manualEvent) {
        return manualEvent
      }

      // Backend API'de ara
      const response = await fetch(`${API_BASE_URL}/events/${eventId}`)
      if (!response.ok) {
        throw new Error('Etkinlik detayları alınamadı')
      }
      
      const event = await response.json()
      return this.localizeEvent(event, language)
    } catch (error) {
      console.error('Event Details Error:', error)
      throw error
    }
  }

  // Etkinliği diline göre localize et
  static localizeEvent(event, language = 'EN') {
    if (!event) return event

    const localizedEvent = { ...event }
    
    // Çoklu dil alanları varsa kullan
    if (event.title_tr && event.title_en) {
      localizedEvent.title = language === 'TR' ? event.title_tr : event.title_en
    }
    
    if (event.description_tr && event.description_en) {
      localizedEvent.description = language === 'TR' ? event.description_tr : event.description_en
    }
    
    if (event.venue_tr && event.venue_en) {
      localizedEvent.venue = language === 'TR' ? event.venue_tr : event.venue_en
    }
    
    if (event.city_tr && event.city_en) {
      localizedEvent.city = language === 'TR' ? event.city_tr : event.city_en
    }
    
    if (event.organizer_tr && event.organizer_en) {
      localizedEvent.organizer = language === 'TR' ? event.organizer_tr : event.organizer_en
    }

    return localizedEvent
  }

  // Bilet URL'sini al
  static getTicketUrl(event) {
    if (event.url) {
      return event.url
    }
    
    // Platform bazlı URL oluştur
    const platform = event.platform?.toLowerCase()
    const eventTitle = encodeURIComponent(event.title || '')
    
    switch (platform) {
      case 'mobilet':
        return `https://www.mobilet.com/search?q=${eventTitle}`
      case 'biletinial':
        return `https://www.biletinial.com/search?q=${eventTitle}`
      case 'biletix':
        return `https://www.biletix.com/search?q=${eventTitle}`
      case 'passo':
        return `https://www.passo.com.tr/search?q=${eventTitle}`
      default:
        return '#'
    }
  }

  // Manuel etkinlikleri al
  static getManualEvents(language = 'EN') {
    try {
      const storedEvents = localStorage.getItem('manualEvents')
      if (!storedEvents) return []
      
      const events = JSON.parse(storedEvents)
      return events.map(event => this.localizeEvent(event, language))
    } catch (error) {
      console.error('Manual Events Error:', error)
      return []
    }
  }

  // Manuel etkinlik ekle
  static addManualEvent(eventData) {
    try {
      const events = this.getManualEvents()
      const newEvent = {
        ...eventData,
        id: `manual_${Date.now()}`,
        created_at: new Date().toISOString(),
        source: 'manual'
      }
      
      events.push(newEvent)
      localStorage.setItem('manualEvents', JSON.stringify(events))
      return newEvent
    } catch (error) {
      console.error('Add Manual Event Error:', error)
      throw error
    }
  }

  // Manuel etkinlik güncelle
  static updateManualEvent(eventId, eventData) {
    try {
      const events = this.getManualEvents()
      const eventIndex = events.findIndex(event => event.id === eventId)
      
      if (eventIndex === -1) {
        throw new Error('Etkinlik bulunamadı')
      }
      
      events[eventIndex] = {
        ...events[eventIndex],
        ...eventData,
        updated_at: new Date().toISOString()
      }
      
      localStorage.setItem('manualEvents', JSON.stringify(events))
      return events[eventIndex]
    } catch (error) {
      console.error('Update Manual Event Error:', error)
      throw error
    }
  }

  // Manuel etkinlik sil
  static deleteManualEvent(eventId) {
    try {
      const events = this.getManualEvents()
      const filteredEvents = events.filter(event => event.id !== eventId)
      localStorage.setItem('manualEvents', JSON.stringify(filteredEvents))
      return true
    } catch (error) {
      console.error('Delete Manual Event Error:', error)
      throw error
    }
  }
} 