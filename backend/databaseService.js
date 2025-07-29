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
      let query = supabaseService.supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query.order('setting_key', { ascending: true })
      
      if (error) throw error
      
      // Convert array to key-value object for easier use
      const settings = {}
      if (data) {
        data.forEach(setting => {
          let value = setting.setting_value
          // Convert based on setting_type
          if (setting.setting_type === 'number') {
            value = Number(value)
          } else if (setting.setting_type === 'boolean') {
            value = value === 'true' || value === true
          } else if (setting.setting_type === 'json') {
            try {
              value = JSON.parse(value)
            } catch (e) {
              // Keep as string if JSON parsing fails
            }
          }
          settings[setting.setting_key] = value
        })
      }
      
      return { success: true, settings, raw_data: data || [] }
    } catch (error) {
      console.error('Error fetching site settings:', error)
      return { success: false, error: error.message, settings: {}, raw_data: [] }
    }
  }

  static async updateSiteSettings(settingsArray) {
    try {
      const results = []
      
      for (const setting of settingsArray) {
        const { setting_key, setting_value, setting_type, category, description } = setting
        
        // Check if setting exists
        const { data: existing, error: checkError } = await supabaseService.supabase
          .from('site_settings')
          .select('id')
          .eq('setting_key', setting_key)
          .single()
        
        let result
        if (existing) {
          // Update existing setting
          const { data, error } = await supabaseService.supabase
            .from('site_settings')
            .update({
              setting_value: String(setting_value),
              setting_type: setting_type || 'string',
              category: category || 'general',
              description: description || null,
              updated_at: new Date().toISOString()
            })
            .eq('setting_key', setting_key)
            .select()
          
          if (error) throw error
          result = { action: 'updated', setting_key, data }
        } else {
          // Create new setting
          const { data, error } = await supabaseService.supabase
            .from('site_settings')
            .insert({
              setting_key,
              setting_value: String(setting_value),
              setting_type: setting_type || 'string',
              category: category || 'general',
              description: description || null,
              is_active: true
            })
            .select()
          
          if (error) throw error
          result = { action: 'created', setting_key, data }
        }
        
        results.push(result)
      }
      
      return { success: true, results, message: 'Settings updated successfully' }
    } catch (error) {
      console.error('Error updating site settings:', error)
      return { success: false, error: error.message, results: [] }
    }
  }

  static async deleteSiteSetting(settingKey) {
    try {
      const { data, error } = await supabaseService.supabase
        .from('site_settings')
        .delete()
        .eq('setting_key', settingKey)
        .select()
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Setting not found' }
      }
      
      return { success: true, message: 'Setting deleted successfully', data }
    } catch (error) {
      console.error('Error deleting site setting:', error)
      return { success: false, error: error.message }
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