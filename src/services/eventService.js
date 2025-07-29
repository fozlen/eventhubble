import CacheService from './cacheService'

// API base URL - Production vs Development
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://eventhubble-backend.onrender.com'
  : 'http://localhost:3001';

// Blog posts API
export const getBlogPosts = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog-posts`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog posts');
    }
    return await response.json();
  } catch (error) {
          // Error fetching blog posts
    return [];
  }
};

export const getBlogPostById = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog-posts/${id}`);
    if (!response.ok) {
      throw new Error('Failed to fetch blog post');
    }
    return await response.json();
  } catch (error) {
          // Error fetching blog post
    return null;
  }
};

export const createBlogPost = async (blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog-posts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    if (!response.ok) {
      throw new Error('Failed to create blog post');
    }
    return await response.json();
  } catch (error) {
          // Error creating blog post
    throw error;
  }
};

export const updateBlogPost = async (id, blogData) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog-posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(blogData),
    });
    if (!response.ok) {
      throw new Error('Failed to update blog post');
    }
    return await response.json();
  } catch (error) {
          // Error updating blog post
    throw error;
  }
};

export const deleteBlogPost = async (id) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/blog-posts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete blog post');
    }
    return await response.json();
  } catch (error) {
          // Error deleting blog post
    throw error;
  }
};

export class EventService {
  // Gerçek etkinlik verilerini çek (cached)
  static async getEvents(filters = {}, language = 'EN') {
    return CacheService.getEvents(filters, language)
  }

  // Backend durumunu kontrol et
  static async getStatus() {
    // Production'da backend kontrolü yapma
    if (import.meta.env.PROD) {
      return { status: 'production', message: 'Backend kontrolü production\'da devre dışı' }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/status`)
      if (!response.ok) {
        throw new Error('Status API çağrısı başarısız')
      }
      return await response.json()
    } catch (error) {
      if (!import.meta.env.PROD) {
        // Status Error
      }
      return { error: 'Backend bağlantısı yok' }
    }
  }

  // İstatistikleri al
  static async getStats() {
    // Production'da stats kontrolü yapma
    if (import.meta.env.PROD) {
      return { totalEvents: 0, message: 'Stats production\'da devre dışı' }
    }

    try {
      const response = await fetch(`${API_BASE_URL}/stats`)
      if (!response.ok) {
        throw new Error('Stats API çağrısı başarısız')
      }
      return await response.json()
    } catch (error) {
      if (!import.meta.env.PROD) {
        // Stats Error
      }
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
      if (!import.meta.env.PROD) {
        // Scraping Error
      }
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
      if (!import.meta.env.PROD) {
        // Event Details Error
      }
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
      if (!storedEvents) {
        // Production'da boş array döndür - sadece admin'den girilen veriler
        return []
      }
      
      const events = JSON.parse(storedEvents)
      return events.map(event => this.localizeEvent(event, language))
    } catch (error) {
      if (!import.meta.env.PROD) {
        // Manual Events Error
      }
      // Hata durumunda boş array döndür
      return []
    }
  }

  // Varsayılan etkinlikler (Development için)
  static getDefaultEvents(language = 'EN') {
    return [
      {
        id: 'default_1',
        title: language === 'TR' ? 'İstanbul Müzik Festivali' : 'Istanbul Music Festival',
        description: language === 'TR' ? 'Yılın en büyük müzik festivali' : 'The biggest music festival of the year',
        date: '2024-08-15',
        time: '19:00',
        venue: language === 'TR' ? 'Küçükçiftlik Park' : 'Kucukciftlik Park',
        city: 'Istanbul',
        category: 'music',
        price_min: 150,
        price_max: 500,
        image: '/assets/eventhubble_new_logo.png',
        platform: 'mobilet',
        source: 'default'
      },
      {
        id: 'default_2',
        title: language === 'TR' ? 'Ankara Tiyatro Festivali' : 'Ankara Theater Festival',
        description: language === 'TR' ? 'Klasik ve modern tiyatro oyunları' : 'Classic and modern theater plays',
        date: '2024-08-20',
        time: '20:00',
        venue: language === 'TR' ? 'Ankara Devlet Tiyatrosu' : 'Ankara State Theater',
        city: 'Ankara',
        category: 'theater',
        price_min: 80,
        price_max: 200,
        image: '/assets/eventhubble_new_logo.png',
        platform: 'biletix',
        source: 'default'
      },
      {
        id: 'default_3',
        title: language === 'TR' ? 'İzmir Spor Turnuvası' : 'Izmir Sports Tournament',
        description: language === 'TR' ? 'Çeşitli spor dallarında yarışmalar' : 'Competitions in various sports',
        date: '2024-08-25',
        time: '14:00',
        venue: language === 'TR' ? 'İzmir Atatürk Spor Salonu' : 'Izmir Ataturk Sports Hall',
        city: 'Izmir',
        category: 'sports',
        price_min: 50,
        price_max: 150,
        image: '/assets/eventhubble_new_logo.png',
        platform: 'biletinial',
        source: 'default'
      }
    ]
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
      if (!import.meta.env.PROD) {
        // Add Manual Event Error
      }
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
      if (!import.meta.env.PROD) {
        // Update Manual Event Error
      }
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
      if (!import.meta.env.PROD) {
        // Delete Manual Event Error
      }
      throw error
    }
  }
} 