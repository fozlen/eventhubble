// Database service for managing all content from Supabase
import supabaseService from './supabaseService.js'

class DatabaseService {
  // ===== LOGOS =====
  static async getLogos() {
    try {
      const { data, error } = await supabaseService.supabase
        .from('logos')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return { success: true, logos: data || [] }
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
      let query = supabaseService.supabase
        .from('events')
        .select('*')
        .eq('is_active', true)
        .order('start_date', { ascending: true })
      
      // Apply filters
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.city) {
        query = query.eq('city', filters.city)
      }
      if (filters.is_featured) {
        query = query.eq('is_featured', true)
      }
      if (filters.date_from) {
        query = query.gte('start_date', filters.date_from)
      }
      if (filters.date_to) {
        query = query.lte('start_date', filters.date_to)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, events: data || [] }
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