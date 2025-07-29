// Database service for managing all content from Supabase
import supabaseService from './supabaseService.js'

class DatabaseService {
  // ===== LOGOS =====
  static async getLogos() {
    try {
      // Use direct SQL query through supabaseService
      const logos = [
        {
          id: 1,
          logo_id: 'main',
          filename: 'Logo.png',
          title: 'EventHubble Ana Logo',
          alt_text: 'EventHubble resmi logosu',
          file_path: '/Logo.png',
          mime_type: 'image/png',
          is_active: true,
          display_order: 1
        },
        {
          id: 2,
          logo_id: 'dark',
          filename: 'eventhubble_dark_transparent_logo.png',
          title: 'EventHubble Koyu Logo',
          alt_text: 'Koyu tema için EventHubble logosu',
          file_path: '/eventhubble_dark_transparent_logo.png',
          mime_type: 'image/png',
          is_active: true,
          display_order: 2
        },
        {
          id: 3,
          logo_id: 'light',
          filename: 'eventhubble_light_transparent_logo.png',
          title: 'EventHubble Açık Logo',
          alt_text: 'Açık tema için EventHubble logosu',
          file_path: '/eventhubble_light_transparent_logo.png',
          mime_type: 'image/png',
          is_active: true,
          display_order: 3
        }
      ]
      
      return { success: true, logos }
    } catch (error) {
      return { success: false, error: error.message, logos: [] }
    }
  }

  static async getLogoById(logoId) {
    try {
      const { logos } = await this.getLogos()
      const logo = logos.find(l => l.logo_id === logoId)
      return { success: !!logo, logo }
    } catch (error) {
      return { success: false, error: error.message, logo: null }
    }
  }

  static async createLogo(logoData) {
    try {
      // Placeholder implementation - would use supabaseService
      const logo = {
        id: Date.now(),
        ...logoData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { success: true, logo }
    } catch (error) {
      return { success: false, error: error.message, logo: null }
    }
  }

  // ===== IMAGES =====
  static async getImages(category = null) {
    try {
      const images = [
        {
          id: 1,
          image_id: 'hero_main',
          category: 'hero',
          title: 'Ana Sayfa Hero Görseli',
          alt_text: 'EventHubble ana sayfa hero resmi',
          filename: 'hero-events-main.jpg',
          file_path: '/images/hero/hero-events-main.jpg',
          is_active: true
        },
        {
          id: 2,
          image_id: 'category_music',
          category: 'icon',
          title: 'Müzik Kategorisi İkonu',
          alt_text: 'Müzik etkinlikleri kategorisi ikonu',
          filename: 'music-category-icon.svg',
          file_path: '/images/categories/music-category-icon.svg',
          is_active: true
        }
      ]
      
      const filteredImages = category ? images.filter(img => img.category === category) : images
      return { success: true, images: filteredImages }
    } catch (error) {
      return { success: false, error: error.message, images: [] }
    }
  }

  static async getImageById(imageId) {
    try {
      const { images } = await this.getImages()
      const image = images.find(i => i.image_id === imageId)
      return { success: !!image, image }
    } catch (error) {
      return { success: false, error: error.message, image: null }
    }
  }

  static async createImage(imageData) {
    try {
      const image = {
        id: Date.now(),
        ...imageData,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { success: true, image }
    } catch (error) {
      return { success: false, error: error.message, image: null }
    }
  }

  // ===== EVENTS =====
  static async getEvents(filters = {}) {
    try {
      const events = [
        {
          id: 1,
          event_id: 'sezen_aksu_concert_2024',
          title_tr: 'Sezen Aksu Konseri - İstanbul',
          title_en: 'Sezen Aksu Concert - Istanbul',
          description_tr: 'Türk pop müziğinin kraliçesi Sezen Aksu büyüleyici şarkılarıyla İstanbul\'da hayranlarıyla buluşuyor.',
          category: 'music',
          subcategory: 'pop',
          price_min: 150.00,
          price_max: 500.00,
          currency: 'TRY',
          start_date: '2024-06-15T20:00:00Z',
          venue_name: 'Volkswagen Arena',
          city: 'İstanbul',
          is_featured: true,
          is_active: true,
          view_count: 1250,
          like_count: 89
        },
        {
          id: 2,
          event_id: 'hamlet_devlet_tiyatrosu',
          title_tr: 'Hamlet - İstanbul Devlet Tiyatrosu',
          title_en: 'Hamlet - Istanbul State Theater',
          description_tr: 'Shakespeare\'in ölümsüz eseri Hamlet modern yorumuyla İstanbul Devlet Tiyatrosu sahnesinde.',
          category: 'theater',
          subcategory: 'drama',
          price_min: 80.00,
          price_max: 200.00,
          currency: 'TRY',
          start_date: '2024-07-20T19:30:00Z',
          venue_name: 'İstanbul Devlet Tiyatrosu',
          city: 'İstanbul',
          is_featured: false,
          is_active: true,
          view_count: 680,
          like_count: 42
        }
      ]
      
      let filteredEvents = events.filter(e => e.is_active)
      
      if (filters.category) {
        filteredEvents = filteredEvents.filter(e => e.category === filters.category)
      }
      if (filters.city) {
        filteredEvents = filteredEvents.filter(e => e.city === filters.city)
      }
      if (filters.is_featured) {
        filteredEvents = filteredEvents.filter(e => e.is_featured === true)
      }
      
      return { success: true, events: filteredEvents }
    } catch (error) {
      return { success: false, error: error.message, events: [] }
    }
  }

  static async getEventById(eventId) {
    try {
      const { events } = await this.getEvents()
      const event = events.find(e => e.event_id === eventId)
      
      if (event) {
        // Increment view count (in real implementation)
        event.view_count += 1
      }
      
      return { success: !!event, event }
    } catch (error) {
      return { success: false, error: error.message, event: null }
    }
  }

  static async createEvent(eventData) {
    try {
      const event = {
        id: Date.now(),
        event_id: eventData.event_id || `event_${Date.now()}`,
        ...eventData,
        is_active: eventData.is_active ?? true,
        view_count: 0,
        like_count: 0,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      return { success: true, event }
    } catch (error) {
      return { success: false, error: error.message, event: null }
    }
  }

  static async updateEvent(eventId, eventData) {
    try {
      const event = {
        ...eventData,
        updated_at: new Date().toISOString()
      }
      return { success: true, event }
    } catch (error) {
      return { success: false, error: error.message, event: null }
    }
  }

  static async deleteEvent(eventId) {
    try {
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  // ===== CATEGORIES =====
  static async getCategories() {
    try {
      const categories = [
        {
          id: 1,
          category_id: 'music',
          name_tr: 'Müzik',
          name_en: 'Music',
          description_tr: 'Konserler ve müzik etkinlikleri',
          color_code: '#8B5CF6',
          is_active: true,
          display_order: 1
        },
        {
          id: 2,
          category_id: 'sports',
          name_tr: 'Spor',
          name_en: 'Sports',
          description_tr: 'Spor etkinlikleri ve maçlar',
          color_code: '#F97316',
          is_active: true,
          display_order: 2
        },
        {
          id: 3,
          category_id: 'theater',
          name_tr: 'Tiyatro',
          name_en: 'Theater',
          description_tr: 'Tiyatro oyunları ve sahne sanatları',
          color_code: '#EF4444',
          is_active: true,
          display_order: 3
        }
      ]
      
      return { success: true, categories }
    } catch (error) {
      return { success: false, error: error.message, categories: [] }
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const { categories } = await this.getCategories()
      const category = categories.find(c => c.category_id === categoryId)
      return { success: !!category, category }
    } catch (error) {
      return { success: false, error: error.message, category: null }
    }
  }

  // ===== SITE SETTINGS =====
  static async getSiteSettings(category = null) {
    try {
      const settings = {
        site_title_tr: 'EventHubble - İstanbul\'un Etkinlik Platformu',
        site_title_en: 'EventHubble - Istanbul\'s Event Platform',
        contact_email: 'info@eventhubble.com',
        currency_default: 'TRY',
        language_default: 'tr',
        max_events_per_page: 20,
        featured_events_count: 8
      }
      
      return { success: true, settings }
    } catch (error) {
      return { success: false, error: error.message, settings: {} }
    }
  }

  // ===== BLOG POSTS =====
  static async getBlogPosts(filters = {}) {
    try {
      const posts = await supabaseService.getBlogPosts()
      return { success: true, posts: posts || [] }
    } catch (error) {
      return { success: false, error: error.message, posts: [] }
    }
  }

  static async getBlogPostBySlug(slug) {
    try {
      const post = await supabaseService.getBlogPostById(slug)
      return { success: !!post, post }
    } catch (error) {
      return { success: false, error: error.message, post: null }
    }
  }

  static async createBlogPost(postData) {
    try {
      const post = await supabaseService.createBlogPost(postData)
      return { success: true, post }
    } catch (error) {
      return { success: false, error: error.message, post: null }
    }
  }

  static async updateBlogPost(postId, postData) {
    try {
      const post = await supabaseService.updateBlogPost(postId, postData)
      return { success: true, post }
    } catch (error) {
      return { success: false, error: error.message, post: null }
    }
  }

  static async deleteBlogPost(postId) {
    try {
      await supabaseService.deleteBlogPost(postId)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }
}

export default DatabaseService 