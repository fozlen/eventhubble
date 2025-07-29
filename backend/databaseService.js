// Database service for managing all content from Supabase
import supabaseService from './supabaseService.js'
const { supabase } = supabaseService

class DatabaseService {
  // ===== LOGOS =====
  static async getLogos() {
    try {
      const { data, error } = await supabase
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
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('logo_id', logoId)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return { success: true, logo: data }
    } catch (error) {
      return { success: false, error: error.message, logo: null }
    }
  }

  static async createLogo(logoData) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .insert([{
          logo_id: logoData.logo_id,
          filename: logoData.filename,
          title: logoData.title,
          alt_text: logoData.alt_text,
          file_path: logoData.file_path,
          file_size: logoData.file_size,
          mime_type: logoData.mime_type,
          is_active: logoData.is_active ?? true,
          display_order: logoData.display_order ?? 0
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, logo: data }
    } catch (error) {
      return { success: false, error: error.message, logo: null }
    }
  }

  // ===== IMAGES =====
  static async getImages(category = null) {
    try {
      let query = supabase
        .from('images')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false })
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, images: data || [] }
    } catch (error) {
      return { success: false, error: error.message, images: [] }
    }
  }

  static async getImageById(imageId) {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('image_id', imageId)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return { success: true, image: data }
    } catch (error) {
      return { success: false, error: error.message, image: null }
    }
  }

  static async createImage(imageData) {
    try {
      const { data, error } = await supabase
        .from('images')
        .insert([{
          image_id: imageData.image_id,
          category: imageData.category,
          title: imageData.title,
          alt_text: imageData.alt_text,
          filename: imageData.filename,
          file_path: imageData.file_path,
          file_size: imageData.file_size,
          mime_type: imageData.mime_type,
          width: imageData.width,
          height: imageData.height,
          tags: imageData.tags || [],
          metadata: imageData.metadata || {},
          is_active: imageData.is_active ?? true
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, image: data }
    } catch (error) {
      return { success: false, error: error.message, image: null }
    }
  }

  // ===== EVENTS =====
  static async getEvents(filters = {}) {
    try {
      let query = supabase
        .from('events')
        .select(`
          *,
          cover_image:cover_image_id(*)
        `)
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
      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          cover_image:cover_image_id(*),
          gallery_images:gallery_image_ids(*)
        `)
        .eq('event_id', eventId)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      
      // Increment view count
      await supabase
        .from('events')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
      
      return { success: true, event: data }
    } catch (error) {
      return { success: false, error: error.message, event: null }
    }
  }

  static async createEvent(eventData) {
    try {
      const { data, error } = await supabase
        .from('events')
        .insert([{
          event_id: eventData.event_id,
          title_tr: eventData.title_tr,
          title_en: eventData.title_en,
          description_tr: eventData.description_tr,
          description_en: eventData.description_en,
          short_description_tr: eventData.short_description_tr,
          short_description_en: eventData.short_description_en,
          category: eventData.category,
          subcategory: eventData.subcategory,
          price_min: eventData.price_min,
          price_max: eventData.price_max,
          currency: eventData.currency || 'TRY',
          start_date: eventData.start_date,
          end_date: eventData.end_date,
          venue_name: eventData.venue_name,
          venue_address: eventData.venue_address,
          city: eventData.city,
          country: eventData.country || 'Turkey',
          latitude: eventData.latitude,
          longitude: eventData.longitude,
          image_url: eventData.image_url,
          cover_image_id: eventData.cover_image_id,
          gallery_image_ids: eventData.gallery_image_ids || [],
          ticket_url: eventData.ticket_url,
          organizer_name: eventData.organizer_name,
          organizer_contact: eventData.organizer_contact,
          source_platform: eventData.source_platform,
          source_id: eventData.source_id,
          source_url: eventData.source_url,
          is_featured: eventData.is_featured ?? false,
          tags: eventData.tags || [],
          metadata: eventData.metadata || {},
          is_active: eventData.is_active ?? true
        }])
        .select()
        .single()
      
      if (error) throw error
      return { success: true, event: data }
    } catch (error) {
      return { success: false, error: error.message, event: null }
    }
  }

  // ===== CATEGORIES =====
  static async getCategories() {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          icon_image:icon_image_id(*),
          cover_image:cover_image_id(*)
        `)
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return { success: true, categories: data || [] }
    } catch (error) {
      return { success: false, error: error.message, categories: [] }
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select(`
          *,
          icon_image:icon_image_id(*),
          cover_image:cover_image_id(*)
        `)
        .eq('category_id', categoryId)
        .eq('is_active', true)
        .single()
      
      if (error) throw error
      return { success: true, category: data }
    } catch (error) {
      return { success: false, error: error.message, category: null }
    }
  }

  // ===== SITE SETTINGS =====
  static async getSiteSettings(category = null) {
    try {
      let query = supabase
        .from('site_settings')
        .select('*')
        .eq('is_active', true)
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      
      // Convert to key-value object
      const settings = {}
      data?.forEach(setting => {
        let value = setting.setting_value
        
        // Parse based on type
        if (setting.setting_type === 'json') {
          try {
            value = JSON.parse(value)
          } catch (e) {
            value = setting.setting_value
          }
        } else if (setting.setting_type === 'boolean') {
          value = value === 'true'
        } else if (setting.setting_type === 'number') {
          value = Number(value)
        }
        
        settings[setting.setting_key] = value
      })
      
      return { success: true, settings }
    } catch (error) {
      return { success: false, error: error.message, settings: {} }
    }
  }

  // ===== BLOG POSTS (Enhanced) =====
  static async getBlogPosts(filters = {}) {
    try {
      let query = supabase
        .from('blog_posts')
        .select(`
          *,
          cover_image:cover_image_id(*)
        `)
        .eq('is_published', true)
        .order('published_at', { ascending: false })
      
      if (filters.category) {
        query = query.eq('category', filters.category)
      }
      if (filters.is_featured) {
        query = query.eq('is_featured', true)
      }
      
      const { data, error } = await query
      
      if (error) throw error
      return { success: true, posts: data || [] }
    } catch (error) {
      return { success: false, error: error.message, posts: [] }
    }
  }

  static async getBlogPostBySlug(slug) {
    try {
      const { data, error } = await supabase
        .from('blog_posts')
        .select(`
          *,
          cover_image:cover_image_id(*),
          gallery_images:gallery_image_ids(*)
        `)
        .eq('slug', slug)
        .eq('is_published', true)
        .single()
      
      if (error) throw error
      
      // Increment view count
      await supabase
        .from('blog_posts')
        .update({ view_count: (data.view_count || 0) + 1 })
        .eq('id', data.id)
      
      return { success: true, post: data }
    } catch (error) {
      return { success: false, error: error.message, post: null }
    }
  }
}

export default DatabaseService 