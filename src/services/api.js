// Central API Service for Event Hubble
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

class ApiService {
  constructor() {
    this.csrfToken = null
  }

  // Set CSRF token
  setCsrfToken(token) {
    this.csrfToken = token
  }

  // Get headers with auth
  getHeaders(includeAuth = false) {
    const headers = {
      'Content-Type': 'application/json'
    }
    
    if (includeAuth && this.csrfToken) {
      headers['X-CSRF-Token'] = this.csrfToken
    }
    
    return headers
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`
    
    console.log('=== API REQUEST ===')
    console.log('URL:', url)
    console.log('Options:', options)
    console.log('Auth required:', options.auth)
    console.log('Headers:', this.getHeaders(options.auth))
    
    try {
      const response = await fetch(url, {
        ...options,
        credentials: 'include', // Include cookies
        headers: {
          ...this.getHeaders(options.auth),
          ...options.headers
        }
      })

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const error = await response.json()
        console.error('API Error Response:', error)
        throw new Error(error.error || `HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('API Response data:', data)
      return data
    } catch (error) {
      console.error(`API Error [${endpoint}]:`, error)
      throw error
    }
  }

  // =====================================
  // AUTHENTICATION
  // =====================================

  async login(email, password) {
    const result = await this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    })
    
    if (result.success && result.data.csrfToken) {
      this.setCsrfToken(result.data.csrfToken)
    }
    
    return result
  }

  async logout() {
    const result = await this.request('/api/auth/logout', {
      method: 'POST',
      auth: true
    })
    
    this.setCsrfToken(null)
    return result
  }

  async refreshToken() {
    const result = await this.request('/api/auth/refresh', {
      method: 'POST',
      auth: true
    })
    
    if (result.success && result.data.csrfToken) {
      this.setCsrfToken(result.data.csrfToken)
    }
    
    return result
  }

  async getCurrentUser() {
    try {
      console.log('=== GET CURRENT USER START ===')
      console.log('CSRF Token:', this.csrfToken)
      
      const result = await this.request('/api/auth/me', {
        auth: true
      })
      
      console.log('=== GET CURRENT USER RESULT ===', result)
      return result
    } catch (error) {
      console.warn('Get current user failed:', error.message)
      return { success: false, error: error.message }
    }
  }

  // =====================================
  // LOGOS
  // =====================================

  async getLogos(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/logos${queryString ? `?${queryString}` : ''}`)
  }

  async getLogo(id) {
    return this.request(`/api/logos/${id}`)
  }

  async getActiveLogo(variant) {
    const result = await this.getLogos({ variant, active: true })
    return result.data?.[0]
  }

  async createLogo(formData) {
    const url = `${API_BASE_URL}/api/logos`
    
    console.log('=== LOGO UPLOAD REQUEST ===')
    console.log('URL:', url)
    console.log('CSRF Token:', this.csrfToken)
    console.log('CSRF Token length:', this.csrfToken?.length)
    console.log('FormData entries:')
    for (let [key, value] of formData.entries()) {
      console.log(`  ${key}:`, value instanceof File ? `File(${value.name}, ${value.size} bytes)` : value)
    }
    
    try {
      const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'X-CSRF-Token': this.csrfToken
        },
        body: formData
      })

      console.log('Response status:', response.status)
      console.log('Response status text:', response.statusText)
      console.log('Response headers:', response.headers)

      if (!response.ok) {
        const error = await response.json()
        console.error('Logo upload error response:', error)
        throw new Error(error.error || 'Failed to create logo')
      }

      const result = await response.json()
      console.log('Logo upload success:', result)
      return result
    } catch (error) {
      console.error('API Error [/api/logos]:', error)
      throw error
    }
  }

  async updateLogo(id, data) {
    return this.request(`/api/logos/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async deleteLogo(id) {
    return this.request(`/api/logos/${id}`, {
      method: 'DELETE',
      auth: true
    })
  }

  // =====================================
  // BLOGS
  // =====================================

  async getBlogs(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/blogs${queryString ? `?${queryString}` : ''}`)
  }

  async getBlog(identifier) {
    return this.request(`/api/blogs/${identifier}`)
  }

  async createBlog(data) {
    return this.request('/api/blogs', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async updateBlog(id, data) {
    return this.request(`/api/blogs/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async deleteBlog(id) {
    return this.request(`/api/blogs/${id}`, {
      method: 'DELETE',
      auth: true
    })
  }

  // =====================================
  // EVENTS
  // =====================================

  async getEvents(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/events${queryString ? `?${queryString}` : ''}`)
  }

  async getEvent(id) {
    return this.request(`/api/events/${id}`)
  }

  async createEvent(data) {
    return this.request('/api/events', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async updateEvent(id, data) {
    return this.request(`/api/events/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async deleteEvent(id) {
    return this.request(`/api/events/${id}`, {
      method: 'DELETE',
      auth: true
    })
  }

  // =====================================
  // IMAGES
  // =====================================

  async uploadImage(file, metadata = {}) {
    const formData = new FormData()
    formData.append('image', file)
    
    Object.keys(metadata).forEach(key => {
      formData.append(key, metadata[key])
    })

    const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'X-CSRF-Token': this.csrfToken
      },
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.error || 'Failed to upload image')
    }
    
    return response.json()
  }

  async getImages(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/images${queryString ? `?${queryString}` : ''}`)
  }

  async deleteImage(id) {
    return this.request(`/api/images/${id}`, {
      method: 'DELETE',
      auth: true
    })
  }

  // =====================================
  // CATEGORIES
  // =====================================

  async getCategories() {
    return this.request('/api/categories')
  }

  async createCategory(data) {
    return this.request('/api/categories', {
      method: 'POST',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async updateCategory(id, data) {
    return this.request(`/api/categories/${id}`, {
      method: 'PUT',
      auth: true,
      body: JSON.stringify(data)
    })
  }

  async deleteCategory(id) {
    return this.request(`/api/categories/${id}`, {
      method: 'DELETE',
      auth: true
    })
  }

  // =====================================
  // SETTINGS
  // =====================================

  async getSettings(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      return await this.request(`/api/settings${queryString ? `?${queryString}` : ''}`)
    } catch (error) {
      console.warn('Settings request failed:', error.message)
      // Return default settings instead of throwing
      return { 
        success: true, 
        data: {
          site_name: { value: 'EventHubble', type: 'text', category: 'general' },
          site_description: { value: 'Event management platform', type: 'text', category: 'general' },
          contact_email: { value: 'admin@eventhubble.com', type: 'email', category: 'contact' }
        }
      }
    }
  }

  async updateSettings(settings) {
    return this.request('/api/settings', {
      method: 'PUT',
      auth: true,
      body: JSON.stringify({ settings })
    })
  }

  // =====================================
  // CONTACT & NEWSLETTER
  // =====================================

  async submitContact(data) {
    return this.request('/api/contact', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }

  async getContactSubmissions(params = {}) {
    const queryString = new URLSearchParams(params).toString()
    return this.request(`/api/contact${queryString ? `?${queryString}` : ''}`, {
      auth: true
    })
  }

  async subscribeNewsletter(email, name = '') {
    return this.request('/api/newsletter/subscribe', {
      method: 'POST',
      body: JSON.stringify({ email, name })
    })
  }

  // =====================================
  // ANALYTICS
  // =====================================

  async trackEvent(eventType, eventData = {}) {
    return this.request('/api/analytics/track', {
      method: 'POST',
      body: JSON.stringify({
        event_type: eventType,
        event_data: eventData
      })
    }).catch(() => {
      // Don't throw errors for analytics
      console.log('Analytics tracking failed')
    })
  }

  async getAnalytics(params = {}) {
    try {
      const queryString = new URLSearchParams(params).toString()
      return await this.request(`/api/analytics${queryString ? `?${queryString}` : ''}`, {
        auth: false // Temporarily disable auth requirement
      })
    } catch (error) {
      console.warn('Analytics request failed:', error.message)
      // Return default stats instead of empty array
      return { 
        success: true, 
        data: {
          totalEvents: 0,
          totalBlogs: 0,
          totalImages: 0,
          totalCategories: 0,
          activeEvents: 0,
          publishedBlogs: 0
        }
      }
    }
  }

  // =====================================
  // HEALTH CHECK
  // =====================================

  async healthCheck() {
    return this.request('/health')
  }
}

// Create and export singleton instance
const apiService = new ApiService()
export default apiService
export { apiService as api } 