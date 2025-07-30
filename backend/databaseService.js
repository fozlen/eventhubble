// DatabaseService for Supabase integration
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import supabaseService from './supabaseService.js'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Supabase credentials not found in environment variables')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

class DatabaseService {
  
  // =============================================
  // EXISTING METHODS (Keep all existing methods)
  // =============================================
  
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
      const { logos } = await this.getLogos()
      const logo = logos.find(l => l.logo_id === logoId)
      return { success: !!logo, logo }
    } catch (error) {
      return { success: false, error: error.message, logo: null }
    }
  }

  static async createLogo(logoData) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .insert({
          logo_id: logoData.logo_id,
          filename: logoData.filename,
          title: logoData.title_tr || logoData.title_en || logoData.title || 'Logo',
          alt_text: logoData.alt_text_tr || logoData.alt_text_en || logoData.alt_text || '',
          file_path: logoData.file_path,
          file_size: logoData.file_size || null,
          mime_type: logoData.mime_type || null,
          width: logoData.width || null,
          height: logoData.height || null,
          is_active: logoData.is_active !== undefined ? logoData.is_active : true,
          display_order: logoData.display_order || 0
        })
        .select()
        .single()
      
      if (error) throw error
      return { success: true, logo: data }
    } catch (error) {
      console.error('Error creating logo:', error)
      return { success: false, error: error.message, logo: null }
    }
  }

  static async updateLogo(logoId, logoData) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .update({
          logo_id: logoData.logo_id,
          filename: logoData.filename,
          title: logoData.title_tr || logoData.title_en || logoData.title || 'Logo',
          alt_text: logoData.alt_text_tr || logoData.alt_text_en || logoData.alt_text || '',
          file_path: logoData.file_path,
          file_size: logoData.file_size || null,
          mime_type: logoData.mime_type || null,
          width: logoData.width || null,
          height: logoData.height || null,
          is_active: logoData.is_active !== undefined ? logoData.is_active : true,
          display_order: logoData.display_order || 0,
          updated_at: new Date().toISOString()
        })
        .eq('logo_id', logoId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, logo: data }
    } catch (error) {
      console.error('Error updating logo:', error)
      return { success: false, error: error.message, logo: null }
    }
  }

  static async deleteLogo(logoId) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .delete()
        .eq('logo_id', logoId)
        .select()
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Logo not found' }
      }
      
      return { success: true, message: 'Logo deleted successfully', data }
    } catch (error) {
      console.error('Error deleting logo:', error)
      return { success: false, error: error.message }
    }
  }

  // ===== IMAGES =====
  static async getImages(category = null) {
    try {
      let query = supabase
        .from('images')
        .select('*')
        .eq('is_active', true)
      
      if (category) {
        query = query.eq('category', category)
      }
      
      const { data, error } = await query.order('created_at', { ascending: false })
      
      if (error) throw error
      return { success: true, images: data || [] }
    } catch (error) {
      console.error('Error fetching images:', error)
      return { success: false, error: error.message, images: [] }
    }
  }

  static async createImage(imageData) {
    try {
      const { data, error } = await supabase
        .from('images')
        .insert({
          image_id: imageData.image_id,
          category: imageData.category || null,
          title: imageData.title_tr || imageData.title_en || imageData.title || 'Image',
          alt_text: imageData.alt_text_tr || imageData.alt_text_en || imageData.alt_text || '',
          filename: imageData.filename,
          file_path: imageData.file_path,
          file_size: imageData.file_size || null,
          mime_type: imageData.mime_type || null,
          width: imageData.width || null,
          height: imageData.height || null,
          tags: imageData.tags || [],
          metadata: imageData.metadata || {},
          is_active: imageData.is_active !== undefined ? imageData.is_active : true
        })
        .select()
        .single()
      
      if (error) throw error
      return { success: true, image: data }
    } catch (error) {
      console.error('Error creating image:', error)
      return { success: false, error: error.message, image: null }
    }
  }

  static async updateImage(imageId, imageData) {
    try {
      const { data, error } = await supabase
        .from('images')
        .update({
          image_id: imageData.image_id,
          category: imageData.category || null,
          title: imageData.title_tr || imageData.title_en || imageData.title || 'Image',
          alt_text: imageData.alt_text_tr || imageData.alt_text_en || imageData.alt_text || '',
          filename: imageData.filename,
          file_path: imageData.file_path,
          file_size: imageData.file_size || null,
          mime_type: imageData.mime_type || null,
          width: imageData.width || null,
          height: imageData.height || null,
          tags: imageData.tags || [],
          metadata: imageData.metadata || {},
          is_active: imageData.is_active !== undefined ? imageData.is_active : true,
          updated_at: new Date().toISOString()
        })
        .eq('image_id', imageId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, image: data }
    } catch (error) {
      console.error('Error updating image:', error)
      return { success: false, error: error.message, image: null }
    }
  }

  static async deleteImage(imageId) {
    try {
      const { data, error } = await supabase
        .from('images')
        .delete()
        .eq('image_id', imageId)
        .select()
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Image not found' }
      }
      
      return { success: true, message: 'Image deleted successfully', data }
    } catch (error) {
      console.error('Error deleting image:', error)
      return { success: false, error: error.message }
    }
  }

  static async getImageById(imageId) {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('image_id', imageId)
        .single()
      
      if (error) throw error
      return { success: true, image: data }
    } catch (error) {
      console.error('Error fetching image by ID:', error)
      return { success: false, error: error.message, image: null }
    }
  }

  // ===== EVENTS =====
  static async getEvents(filters = {}) {
    try {
      let query = supabase
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
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })
      
      if (error) throw error
      return { success: true, categories: data || [] }
    } catch (error) {
      console.error('Error fetching categories:', error)
      return { success: false, error: error.message, categories: [] }
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('category_id', categoryId)
        .single()
      
      if (error) throw error
      return { success: true, category: data }
    } catch (error) {
      console.error('Error fetching category by ID:', error)
      return { success: false, error: error.message, category: null }
    }
  }

  static async createCategory(categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .insert({
          category_id: categoryData.category_id,
          name_tr: categoryData.name_tr,
          name_en: categoryData.name_en,
          description_tr: categoryData.description_tr || null,
          description_en: categoryData.description_en || null,
          color_code: categoryData.color_code || null,
          icon_image_id: categoryData.icon_image_id || null,
          cover_image_id: categoryData.cover_image_id || null,
          parent_id: categoryData.parent_id || null,
          is_active: categoryData.is_active !== undefined ? categoryData.is_active : true,
          display_order: categoryData.display_order || 0
        })
        .select()
        .single()
      
      if (error) throw error
      return { success: true, category: data }
    } catch (error) {
      console.error('Error creating category:', error)
      return { success: false, error: error.message, category: null }
    }
  }

  static async updateCategory(categoryId, categoryData) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .update({
          ...categoryData,
          updated_at: new Date().toISOString()
        })
        .eq('category_id', categoryId)
        .select()
        .single()
      
      if (error) throw error
      return { success: true, category: data }
    } catch (error) {
      console.error('Error updating category:', error)
      return { success: false, error: error.message, category: null }
    }
  }

  static async deleteCategory(categoryId) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .delete()
        .eq('category_id', categoryId)
        .select()
      
      if (error) throw error
      
      if (!data || data.length === 0) {
        return { success: false, error: 'Category not found' }
      }
      
      return { success: true, message: 'Category deleted successfully', data }
    } catch (error) {
      console.error('Error deleting category:', error)
      return { success: false, error: error.message }
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
        const { data: existing, error: checkError } = await supabase
          .from('site_settings')
          .select('id')
          .eq('setting_key', setting_key)
          .single()
        
        let result
        if (existing) {
          // Update existing setting
          const { data, error } = await supabase
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
          const { data, error } = await supabase
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
      const { data, error } = await supabase
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

  // =============================================
  // CONTACT SUBMISSIONS METHODS
  // =============================================
  
  static async createContactSubmission(submissionData) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .insert([submissionData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        submission: data
      }
    } catch (error) {
      console.error('Create contact submission error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async getContactSubmissions(filters = {}) {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*')
        .order('created_at', { ascending: false })

      if (filters.status) {
        query = query.eq('status', filters.status)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      if (filters.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 50) - 1)
      }

      const { data, error, count } = await query

      if (error) throw error

      return {
        success: true,
        submissions: data || [],
        total: count
      }
    } catch (error) {
      console.error('Get contact submissions error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async updateContactSubmission(id, updateData) {
    try {
      const { data, error } = await supabase
        .from('contact_submissions')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        submission: data
      }
    } catch (error) {
      console.error('Update contact submission error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // ANALYTICS METHODS
  // =============================================

  static async trackAnalytics(analyticsData) {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .upsert([analyticsData], {
          onConflict: 'metric_name,metric_date,metric_category',
          ignoreDuplicates: false
        })
        .select()

      if (error) throw error

      return {
        success: true,
        analytics: data
      }
    } catch (error) {
      console.error('Track analytics error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async getAnalytics(filters = {}) {
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .order('metric_date', { ascending: false })

      if (filters.metric_name) {
        query = query.eq('metric_name', filters.metric_name)
      }

      if (filters.category) {
        query = query.eq('metric_category', filters.category)
      }

      if (filters.start_date) {
        query = query.gte('metric_date', filters.start_date)
      }

      if (filters.end_date) {
        query = query.lte('metric_date', filters.end_date)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        analytics: data || []
      }
    } catch (error) {
      console.error('Get analytics error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // NEWSLETTER METHODS
  // =============================================

  static async subscribeNewsletter(subscriptionData) {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .upsert([subscriptionData], {
          onConflict: 'email',
          ignoreDuplicates: false
        })
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        subscription: data
      }
    } catch (error) {
      console.error('Subscribe newsletter error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async unsubscribeNewsletter(unsubscribeData) {
    try {
      const { data, error } = await supabase
        .from('newsletters')
        .update({
          status: 'unsubscribed',
          unsubscribed_at: new Date().toISOString(),
          unsubscribe_reason: unsubscribeData.reason
        })
        .eq('email', unsubscribeData.email)
        .select()

      if (error) throw error

      return {
        success: true,
        subscription: data
      }
    } catch (error) {
      console.error('Unsubscribe newsletter error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // FAQ METHODS
  // =============================================

  static async getFAQs(filters = {}) {
    try {
      let query = supabase
        .from('faqs')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true })

      if (filters.category) {
        query = query.eq('category', filters.category)
      }

      if (filters.featured) {
        query = query.eq('is_featured', true)
      }

      const { data, error } = await query

      if (error) throw error

      // Format response based on language
      const formattedData = data?.map(faq => ({
        id: faq.id,
        question: filters.language === 'EN' ? faq.question_en || faq.question_tr : faq.question_tr,
        answer: filters.language === 'EN' ? faq.answer_en || faq.answer_tr : faq.answer_tr,
        category: faq.category,
        display_order: faq.display_order,
        is_featured: faq.is_featured,
        view_count: faq.view_count,
        helpful_count: faq.helpful_count
      }))

      return {
        success: true,
        faqs: formattedData || []
      }
    } catch (error) {
      console.error('Get FAQs error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // TESTIMONIALS METHODS
  // =============================================

  static async getTestimonials(filters = {}) {
    try {
      let query = supabase
        .from('testimonials')
        .select('*')
        .eq('is_active', true)
        .eq('status', 'approved')
        .order('created_at', { ascending: false })

      if (filters.featured) {
        query = query.eq('is_featured', true)
      }

      if (filters.limit) {
        query = query.limit(filters.limit)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        testimonials: data || []
      }
    } catch (error) {
      console.error('Get testimonials error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async createTestimonial(testimonialData) {
    try {
      const { data, error } = await supabase
        .from('testimonials')
        .insert([testimonialData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        testimonial: data
      }
    } catch (error) {
      console.error('Create testimonial error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // PARTNERS METHODS
  // =============================================

  static async getPartners(filters = {}) {
    try {
      let query = supabase
        .from('partners')
        .select('*')
        .eq('status', 'active')
        .order('display_order', { ascending: true })

      if (filters.partner_type) {
        query = query.eq('partner_type', filters.partner_type)
      }

      if (filters.featured) {
        query = query.eq('featured', true)
      }

      const { data, error } = await query

      if (error) throw error

      return {
        success: true,
        partners: data || []
      }
    } catch (error) {
      console.error('Get partners error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // USERS METHODS (Admin Authentication)
  // =============================================

  static async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .eq('is_active', true)
        .single()

      if (error) throw error

      return {
        success: true,
        user: data
      }
    } catch (error) {
      console.error('Get user by email error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  static async updateUserLoginInfo(userId, loginData) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          last_login: new Date().toISOString(),
          login_count: loginData.login_count + 1
        })
        .eq('id', userId)
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        user: data
      }
    } catch (error) {
      console.error('Update user login info error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // AUDIT LOGS METHODS
  // =============================================

  static async createAuditLog(logData) {
    try {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert([logData])
        .select()
        .single()

      if (error) throw error

      return {
        success: true,
        log: data
      }
    } catch (error) {
      console.error('Create audit log error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }

  // =============================================
  // UTILITY METHODS
  // =============================================

  static async getDashboardStats() {
    try {
      const today = new Date().toISOString().split('T')[0]
      
      // Get various statistics
      const [
        totalEvents,
        totalContacts,
        totalNewsletters,
        totalTestimonials,
        todayAnalytics
      ] = await Promise.all([
        supabase.from('events').select('id', { count: 'exact' }),
        supabase.from('contact_submissions').select('id', { count: 'exact' }),
        supabase.from('newsletters').select('id', { count: 'exact' }).eq('status', 'active'),
        supabase.from('testimonials').select('id', { count: 'exact' }).eq('status', 'approved'),
        supabase.from('analytics').select('*').eq('metric_date', today)
      ])

      return {
        success: true,
        stats: {
          total_events: totalEvents.count || 0,
          total_contacts: totalContacts.count || 0,
          total_newsletters: totalNewsletters.count || 0,
          total_testimonials: totalTestimonials.count || 0,
          today_analytics: todayAnalytics.data || []
        }
      }
    } catch (error) {
      console.error('Get dashboard stats error:', error)
      return {
        success: false,
        error: error.message
      }
    }
  }
}

export default DatabaseService 