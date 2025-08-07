import { createClient } from '@supabase/supabase-js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'

dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Supabase environment variables missing!')
  console.error('Please set SUPABASE_URL and SUPABASE_ANON_KEY in your .env file')
}

if (!supabaseServiceKey) {
  console.error('⚠️  SUPABASE_SERVICE_ROLE_KEY not set - authenticated operations may fail')
}

const supabase = createClient(supabaseUrl || '', supabaseAnonKey || '')
const supabaseAdmin = createClient(supabaseUrl || '', supabaseServiceKey || '')

class SupabaseService {
  // =====================================
  // CONNECTION TEST
  // =====================================
  
  async testConnection() {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('setting_key')
        .limit(1)
      
      return !error
    } catch (error) {
      console.error('Supabase connection test failed:', error)
      return false
    }
  }

  // =====================================
  // USERS & AUTHENTICATION
  // =====================================
  
  async getUserById(id) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user:', error)
      throw error
    }
  }

  async getUserByEmail(email) {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('email', email)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching user by email:', error)
      throw error
    }
  }

  async createUser(userData) {
    try {
      // Hash password
      const password_hash = await bcrypt.hash(userData.password, 10)
      
      const userInsertData = {
        email: userData.email,
        password_hash,
        role: userData.role || 'viewer'
      }
      
      // Only add full_name if it exists in database
      if (userData.full_name) {
        userInsertData.full_name = userData.full_name
      }
      
      const { data, error } = await supabaseAdmin
        .from('users')
        .insert([userInsertData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating user:', error)
      throw error
    }
  }

  async updateUser(id, updates) {
    try {
      // Hash password if provided
      if (updates.password) {
        updates.password_hash = await bcrypt.hash(updates.password, 10)
        delete updates.password
      }

      const { data, error } = await supabaseAdmin
        .from('users')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating user:', error)
      throw error
    }
  }

  async deleteUser(id) {
    try {
      const { error } = await supabaseAdmin
        .from('users')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting user:', error)
      throw error
    }
  }

  async login(email, password) {
    try {
      // Find user by email
      const user = await this.getUserByEmail(email)
      if (!user || !user.is_active) {
        throw new Error('Invalid credentials')
      }

      // Check if account is locked (only if locked_until column exists)
      if (user.locked_until && new Date() < new Date(user.locked_until)) {
        throw new Error('Account is temporarily locked')
      }

      // Verify password
      const isValid = await bcrypt.compare(password, user.password_hash)
      if (!isValid) {
        // Increment login attempts (only if login_attempts column exists)
        try {
          await this.incrementLoginAttempts(user.id)
        } catch (attemptError) {
          console.warn('Could not increment login attempts:', attemptError.message)
        }
        throw new Error('Invalid credentials')
      }

      // Reset login attempts on successful login (only if columns exist)
      try {
        await this.resetLoginAttempts(user.id)
      } catch (resetError) {
        console.warn('Could not reset login attempts:', resetError.message)
      }

      // Update last login (only if last_login column exists)
      try {
        await supabase
          .from('users')
          .update({ last_login: new Date().toISOString() })
          .eq('id', user.id)
      } catch (lastLoginError) {
        console.warn('Could not update last login:', lastLoginError.message)
      }

      return {
        user: {
          id: user.id,
          email: user.email,
          full_name: user.full_name || null,
          role: user.role,
          avatar_url: user.avatar_url || null,
          preferences: user.preferences || {}
        }
      }
    } catch (error) {
      console.error('Error logging in:', error)
      throw error
    }
  }

  async incrementLoginAttempts(userId) {
    try {
      const user = await this.getUserById(userId)
      const newAttempts = (user.login_attempts || 0) + 1
      
      const settings = await this.getSettings({ category: 'security' })
      const maxAttempts = parseInt(settings.max_login_attempts?.value || '5')
      const lockoutDuration = parseInt(settings.lockout_duration?.value || '900') * 1000

      let updates = { login_attempts: newAttempts }
      
      if (newAttempts >= maxAttempts) {
        updates.locked_until = new Date(Date.now() + lockoutDuration)
      }

      await supabase
        .from('users')
        .update(updates)
        .eq('id', userId)
    } catch (error) {
      console.error('Error incrementing login attempts:', error)
    }
  }

  async resetLoginAttempts(userId) {
    try {
      await supabase
        .from('users')
        .update({ 
          login_attempts: 0,
          locked_until: null
        })
        .eq('id', userId)
    } catch (error) {
      console.error('Error resetting login attempts:', error)
    }
  }

  // =====================================
  // SESSION MANAGEMENT
  // =====================================
  
  async createSession(userId, tokenHash, refreshTokenHash, clientInfo = {}) {
    try {
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .insert([{
          user_id: userId,
          token_hash: tokenHash,
          refresh_token_hash: refreshTokenHash,
          csrf_token: clientInfo.csrf_token || null,
          expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          ip_address: clientInfo.ip_address || '127.0.0.1',
          user_agent: clientInfo.user_agent || 'Unknown',
          is_active: true
        }])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating session:', error)
      throw error
    }
  }

  async getSessionByUserId(userId) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching session:', error)
      throw error
    }
  }

  async getSessionByCsrfToken(csrfToken) {
    try {
      const { data, error } = await supabase
        .from('sessions')
        .select('*')
        .eq('csrf_token', csrfToken)
        .eq('is_active', true)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching session by CSRF token:', error)
      return null
    }
  }

  async updateSession(sessionId, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('sessions')
        .update(updates)
        .eq('id', sessionId)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating session:', error)
      throw error
    }
  }

  async deleteSession(sessionId) {
    try {
      const { error } = await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('id', sessionId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting session:', error)
      throw error
    }
  }

  async deleteAllUserSessions(userId) {
    try {
      const { error } = await supabaseAdmin
        .from('sessions')
        .delete()
        .eq('user_id', userId)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting user sessions:', error)
      throw error
    }
  }

  // =====================================
  // AUDIT LOGGING
  // =====================================
  
  async createAuditLog(auditData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('audit_logs')
        .insert([auditData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating audit log:', error)
      throw error
    }
  }

  async getAuditLogs({ userId, action, resourceType, limit = 100, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('audit_logs')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (userId) {
        query = query.eq('user_id', userId)
      }
      if (action) {
        query = query.eq('action', action)
      }
      if (resourceType) {
        query = query.eq('resource_type', resourceType)
      }

      const { data, error, count } = await query
      if (error) throw error
      
      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      throw error
    }
  }

  // =====================================
  // LOGOS
  // =====================================
  
  async getLogos({ variant, active } = {}) {
    try {
      let query = supabase
        .from('logos')
        .select('*')
        .order('created_at', { ascending: false })

      if (active !== undefined) {
        query = query.eq('is_active', active === 'true' || active === true)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching logos:', error)
      throw error
    }
  }

  async getLogoById(id) {
    try {
      const { data, error } = await supabase
        .from('logos')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching logo:', error)
      throw error
    }
  }

  async createLogo(logoData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('logos')
        .insert([logoData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating logo:', error)
      throw error
    }
  }

  async updateLogo(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('logos')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating logo:', error)
      throw error
    }
  }

  async deleteLogo(id) {
    try {
      const { error } = await supabaseAdmin
        .from('logos')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting logo:', error)
      throw error
    }
  }

  // =====================================
  // BLOGS (Enhanced with new fields)
  // =====================================
  
  async getBlogs({ limit = 50, offset = 0, category, featured } = {}) {
    try {
      let query = supabase
        .from('blog_posts')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }
      if (featured !== undefined) {
        query = query.eq('is_featured', featured)
      }

      const { data, error, count } = await query
      if (error) throw error
      
      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Error fetching blogs:', error)
      throw error
    }
  }

  async getBlogBySlugOrId(identifier) {
    try {
      // Try to find by slug first
      let { data, error } = await supabase
        .from('blog_posts')
        .select('*')
        .eq('slug', identifier)
        .single()

      // If not found by slug, try by ID
      if (!data) {
        const result = await supabase
          .from('blog_posts')
          .select('*')
          .eq('id', identifier)
          .single()
        
        data = result.data
        error = result.error
      }

      if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
      return data
    } catch (error) {
      console.error('Error fetching blog:', error)
      throw error
    }
  }

  async createBlog(blogData) {
    try {
      // Generate slug if not provided
      if (!blogData.slug) {
        blogData.slug = this.generateSlug(blogData.title)
      }

      // Calculate reading time and word count
      if (blogData.content) {
        const wordCount = blogData.content.split(/\s+/).length
        blogData.word_count = wordCount
        blogData.reading_time = Math.ceil(wordCount / 200) // Average reading speed
      }

      // Set published_at if publishing
      if (blogData.status === 'published' && !blogData.published_at) {
        blogData.published_at = new Date().toISOString()
      }

      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .insert([blogData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating blog:', error)
      throw error
    }
  }

  async updateBlog(id, updates) {
    try {
      // Handle publishing state change
      if (updates.status === 'published') {
        const existing = await this.getBlogBySlugOrId(id)
        if (existing && existing.status !== 'published') {
          updates.published_at = new Date().toISOString()
        }
      }

      // Recalculate reading time and word count if content changed
      if (updates.content) {
        const wordCount = updates.content.split(/\s+/).length
        updates.word_count = wordCount
        updates.reading_time = Math.ceil(wordCount / 200)
      }

      const { data, error } = await supabaseAdmin
        .from('blog_posts')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating blog:', error)
      throw error
    }
  }

  async deleteBlog(id) {
    try {
      const { error } = await supabaseAdmin
        .from('blog_posts')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting blog:', error)
      throw error
    }
  }

  async incrementBlogViews(id) {
    try {
      const { data: blog } = await supabase
        .from('blog_posts')
        .select('view_count')
        .eq('id', id)
        .single()

      if (blog) {
        await supabase
          .from('blog_posts')
          .update({ view_count: (blog.view_count || 0) + 1 })
          .eq('id', id)
      }
    } catch (error) {
      console.error('Error incrementing blog views:', error)
    }
  }

  // =====================================
  // EVENTS (Enhanced with recurring events and ticketing)
  // =====================================
  
  async getEvents({ 
    category, 
    city, 
    featured, 
    date_from,
    date_to,
    limit = 50, 
    offset = 0 
  } = {}) {
    try {
      let query = supabase
        .from('events')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: true })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }
      if (city) {
        query = query.eq('city', city)
      }
      if (featured !== undefined) {
        query = query.eq('is_featured', featured)
      }
      if (date_from) {
        query = query.gte('created_at', date_from)
      }
      if (date_to) {
        query = query.lte('created_at', date_to)
      }

      const { data, error, count } = await query
      if (error) throw error
      
      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Error fetching events:', error)
      throw error
    }
  }

  async getEventById(id) {
    try {
      const { data, error } = await supabase
        .from('events')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching event:', error)
      throw error
    }
  }

  async createEvent(eventData) {
    try {
      // Generate slug if not provided
      if (!eventData.slug) {
        eventData.slug = this.generateSlug(eventData.title)
      }

      // Set published_at if publishing
      if (eventData.status === 'published' && !eventData.published_at) {
        eventData.published_at = new Date().toISOString()
      }

      const { data, error } = await supabaseAdmin
        .from('events')
        .insert([eventData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating event:', error)
      throw error
    }
  }

  async updateEvent(id, updates) {
    try {
      // Handle publishing state change
      if (updates.status === 'published') {
        const existing = await this.getEventById(id)
        if (existing && existing.status !== 'published') {
          updates.published_at = new Date().toISOString()
        }
      }

      const { data, error } = await supabaseAdmin
        .from('events')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating event:', error)
      throw error
    }
  }

  async deleteEvent(id) {
    try {
      const { error } = await supabaseAdmin
        .from('events')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting event:', error)
      throw error
    }
  }

  async incrementEventViews(id) {
    try {
      const { data: event } = await supabase
        .from('events')
        .select('view_count')
        .eq('id', id)
        .single()

      if (event) {
        await supabase
          .from('events')
          .update({ view_count: (event.view_count || 0) + 1 })
          .eq('id', id)
      }
    } catch (error) {
      console.error('Error incrementing event views:', error)
    }
  }

  // =====================================
  // IMAGES (Enhanced for CDN management)
  // =====================================
  
  async getImages({ category, limit = 50, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('images')
        .select('*', { count: 'exact' })
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (category) {
        query = query.eq('category', category)
      }

      const { data, error, count } = await query
      if (error) throw error
      
      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Error fetching images:', error)
      throw error
    }
  }

  async getImageById(id) {
    try {
      const { data, error } = await supabase
        .from('images')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching image:', error)
      throw error
    }
  }

  async createImage(imageData) {
    try {
      const { data, error } = await supabaseAdmin
        .from('images')
        .insert([imageData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating image:', error)
      throw error
    }
  }

  async updateImage(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('images')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating image:', error)
      throw error
    }
  }

  async deleteImage(id) {
    try {
      const { error } = await supabaseAdmin
        .from('images')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting image:', error)
      throw error
    }
  }

  async incrementImageUsage(id) {
    try {
      const { data: image } = await supabase
        .from('images')
        .select('usage_count')
        .eq('id', id)
        .single()

      if (image) {
        await supabase
          .from('images')
          .update({ usage_count: (image.usage_count || 0) + 1 })
          .eq('id', id)
      }
    } catch (error) {
      console.error('Error incrementing image usage:', error)
    }
  }

  // =====================================
  // CATEGORIES (Enhanced with parent-child relationships)
  // =====================================
  
  async getCategories({ includeInactive = false } = {}) {
    try {
      let query = supabase
        .from('categories')
        .select('*')
        .order('created_at', { ascending: true })

      if (!includeInactive) {
        query = query.eq('is_active', true)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching categories:', error)
      throw error
    }
  }

  async getCategoryById(id) {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('id', id)
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error fetching category:', error)
      throw error
    }
  }

  async createCategory(categoryData) {
    try {
      // Generate slug if not provided
      if (!categoryData.slug) {
        categoryData.slug = this.generateSlug(categoryData.name)
      }

      const { data, error } = await supabaseAdmin
        .from('categories')
        .insert([categoryData])
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error creating category:', error)
      throw error
    }
  }

  async updateCategory(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('categories')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating category:', error)
      throw error
    }
  }

  async deleteCategory(id) {
    try {
      const { error } = await supabaseAdmin
        .from('categories')
        .delete()
        .eq('id', id)

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error deleting category:', error)
      throw error
    }
  }

  // =====================================
  // SITE SETTINGS (Enhanced for dynamic configuration)
  // =====================================
  
  async getSettings({ category, isPublic = true } = {}) {
    try {
      let query = supabase
        .from('site_settings')
        .select('*')
        .order('setting_key', { ascending: true })

      if (isPublic) {
        query = query.eq('is_public', true)
      }
      if (category) {
        query = query.eq('category', category)
      }

      const { data, error } = await query
      if (error) throw error
      
      // Transform to key-value object for easier use
      const settings = {}
      data?.forEach(item => {
        settings[item.setting_key] = {
          value: item.setting_value,
          type: item.setting_type,
          category: item.category,
          description: item.description,
          is_required: item.is_required,
          validation_rules: item.validation_rules
        }
      })
      
      return settings
    } catch (error) {
      console.error('Error fetching settings:', error)
      throw error
    }
  }

  async updateSettings(settings) {
    try {
      const updates = []
      
      for (const setting of settings) {
        const { data, error } = await supabaseAdmin
          .from('site_settings')
          .upsert({
            setting_key: setting.key,
            setting_value: setting.value,
            setting_type: setting.type || 'text',
            category: setting.category || 'general',
            description: setting.description,
            is_public: setting.is_public !== false,
            is_required: setting.is_required || false,
            validation_rules: setting.validation_rules || {}
          })
          .select()
        
        if (error) throw error
        if (data) updates.push(...data)
      }
      
      return updates
    } catch (error) {
      console.error('Error updating settings:', error)
      throw error
    }
  }

  // =====================================
  // CONTACT & NEWSLETTER
  // =====================================
  
  async createContactSubmission(data) {
    try {
      const { data: submission, error } = await supabaseAdmin
        .from('contact_submissions')
        .insert([data])
        .select()
        .single()

      if (error) throw error
      return submission
    } catch (error) {
      console.error('Error creating contact submission:', error)
      throw error
    }
  }

  async getContactSubmissions({ status, limit = 50, offset = 0 } = {}) {
    try {
      let query = supabase
        .from('contact_submissions')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range(offset, offset + limit - 1)

      if (status) {
        query = query.eq('status', status)
      }

      const { data, error, count } = await query
      if (error) throw error
      
      return {
        data: data || [],
        total: count || 0,
        limit,
        offset
      }
    } catch (error) {
      console.error('Error fetching contact submissions:', error)
      throw error
    }
  }

  async updateContactSubmission(id, updates) {
    try {
      const { data, error } = await supabaseAdmin
        .from('contact_submissions')
        .update(updates)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error updating contact submission:', error)
      throw error
    }
  }

  async subscribeNewsletter({ email, name }) {
    try {
      const { data, error } = await supabaseAdmin
        .from('newsletters')
        .upsert({
          email,
          name,
          is_active: true,
          subscribed_at: new Date().toISOString()
        })
        .select()
        .single()

      if (error) throw error
      return data
    } catch (error) {
      console.error('Error subscribing to newsletter:', error)
      throw error
    }
  }

  // =====================================
  // ANALYTICS (Enhanced for better tracking)
  // =====================================
  
  async trackAnalytics(data) {
    try {
      // Parse user agent for device info
      const userAgent = data.user_agent || ''
      const deviceInfo = this.parseUserAgent(userAgent)
      
      const analyticsData = {
        ...data,
        ...deviceInfo
      }

      const { error } = await supabaseAdmin
        .from('analytics')
        .insert([analyticsData])

      if (error) throw error
      return true
    } catch (error) {
      console.error('Error tracking analytics:', error)
      // Don't throw error for analytics, just log it
      return false
    }
  }

  async getAnalytics({ event_type, date_from, date_to, limit = 100 } = {}) {
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(limit)

      if (event_type) {
        query = query.eq('event_type', event_type)
      }
      if (date_from) {
        query = query.gte('created_at', date_from)
      }
      if (date_to) {
        query = query.lte('created_at', date_to)
      }

      const { data, error } = await query
      if (error) throw error
      return data || []
    } catch (error) {
      console.error('Error fetching analytics:', error)
      throw error
    }
  }

  // =====================================
  // UTILITY METHODS
  // =====================================
  
  generateSlug(text) {
    return text
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100)
  }

  parseUserAgent(userAgent) {
    const ua = userAgent.toLowerCase()
    
    let deviceType = 'desktop'
    let browserName = 'unknown'
    let os = 'unknown'

    // Detect device type
    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) {
      deviceType = 'mobile'
    } else if (ua.includes('tablet') || ua.includes('ipad')) {
      deviceType = 'tablet'
    }

    // Detect browser
    if (ua.includes('chrome')) browserName = 'chrome'
    else if (ua.includes('firefox')) browserName = 'firefox'
    else if (ua.includes('safari')) browserName = 'safari'
    else if (ua.includes('edge')) browserName = 'edge'
    else if (ua.includes('opera')) browserName = 'opera'

    // Detect OS
    if (ua.includes('windows')) os = 'windows'
    else if (ua.includes('mac')) os = 'macos'
    else if (ua.includes('linux')) os = 'linux'
    else if (ua.includes('android')) os = 'android'
    else if (ua.includes('ios')) os = 'ios'

    return { device_type: deviceType, browser_name: browserName, os }
  }
}

const supabaseService = new SupabaseService()
export { supabase }
export default supabaseService 