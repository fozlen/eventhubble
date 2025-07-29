// Frontend database service for fetching all content from database APIs
class DatabaseService {
  static API_BASE_URL = import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001'

  // ===== LOGOS =====
  static async getLogos() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/logos`)
      if (!response.ok) throw new Error('Failed to fetch logos')
      
      const result = await response.json()
      return result.success ? result.logos : []
    } catch (error) {
      // Fallback to static logos if database fails
      return [
        {
          logo_id: 'main',
          filename: 'Logo.png',
          title: 'EventHubble Main Logo',
          file_path: '/Logo.png'
        },
        {
          logo_id: 'dark',
          filename: 'eventhubble_dark_transparent_logo.png',
          title: 'EventHubble Dark Logo',
          file_path: '/eventhubble_dark_transparent_logo.png'
        },
        {
          logo_id: 'light',
          filename: 'eventhubble_light_transparent_logo.png',
          title: 'EventHubble Light Logo',
          file_path: '/eventhubble_light_transparent_logo.png'
        }
      ]
    }
  }

  static async getLogoById(logoId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/logos/${logoId}`)
      if (!response.ok) throw new Error('Failed to fetch logo')
      
      const result = await response.json()
      return result.success ? result.logo : null
    } catch (error) {
      return null
    }
  }

  // ===== IMAGES =====
  static async getImages(category = null) {
    try {
      const url = category 
        ? `${this.API_BASE_URL}/api/images?category=${category}`
        : `${this.API_BASE_URL}/api/images`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch images')
      
      const result = await response.json()
      return result.success ? result.images : []
    } catch (error) {
      return []
    }
  }

  static async getImageById(imageId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/images/${imageId}`)
      if (!response.ok) throw new Error('Failed to fetch image')
      
      const result = await response.json()
      return result.success ? result.image : null
    } catch (error) {
      return null
    }
  }

  // ===== EVENTS =====
  static async getEvents(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.city) params.append('city', filters.city)
      if (filters.featured) params.append('featured', 'true')
      if (filters.date_from) params.append('date_from', filters.date_from)
      if (filters.date_to) params.append('date_to', filters.date_to)
      
      const url = `${this.API_BASE_URL}/api/events/db${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Failed to fetch events')
      
      const result = await response.json()
      return result.success ? result.events : []
    } catch (error) {
      return []
    }
  }

  static async getEventById(eventId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/events/db/${eventId}`)
      if (!response.ok) throw new Error('Failed to fetch event')
      
      const result = await response.json()
      return result.success ? result.event : null
    } catch (error) {
      return null
    }
  }

  // ===== CATEGORIES =====
  static async getCategories() {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/categories`)
      if (!response.ok) throw new Error('Failed to fetch categories')
      
      const result = await response.json()
      return result.success ? result.categories : []
    } catch (error) {
      return []
    }
  }

  static async getCategoryById(categoryId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/categories/${categoryId}`)
      if (!response.ok) throw new Error('Failed to fetch category')
      
      const result = await response.json()
      return result.success ? result.category : null
    } catch (error) {
      return null
    }
  }

  // ===== SITE SETTINGS =====
  static async getSiteSettings(category = null) {
    try {
      const url = category 
        ? `${this.API_BASE_URL}/api/settings?category=${category}`
        : `${this.API_BASE_URL}/api/settings`
      
      const response = await fetch(url)
      if (!response.ok) throw new Error('Failed to fetch settings')
      
      const result = await response.json()
      return result.success ? result.settings : {}
    } catch (error) {
      return {}
    }
  }

  // ===== BLOG POSTS =====
  static async getBlogPosts(filters = {}) {
    try {
      const params = new URLSearchParams()
      
      if (filters.category) params.append('category', filters.category)
      if (filters.featured) params.append('featured', 'true')
      
      const url = `${this.API_BASE_URL}/api/blog-posts/db${params.toString() ? '?' + params.toString() : ''}`
      const response = await fetch(url)
      
      if (!response.ok) throw new Error('Failed to fetch blog posts')
      
      const result = await response.json()
      return result.success ? result.posts : []
    } catch (error) {
      return []
    }
  }

  static async getBlogPostBySlug(slug) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/blog-posts/db/${slug}`)
      if (!response.ok) throw new Error('Failed to fetch blog post')
      
      const result = await response.json()
      return result.success ? result.post : null
    } catch (error) {
      return null
    }
  }

  // ===== UTILITY FUNCTIONS =====
  static getImageUrl(image) {
    if (!image) return '/Logo.png' // fallback
    
    if (image.file_path) {
      // If it's a full URL, return as is
      if (image.file_path.startsWith('http')) {
        return image.file_path
      }
      // If it's a relative path, make it absolute
      return image.file_path.startsWith('/') ? image.file_path : `/${image.file_path}`
    }
    
    // Fallback to filename
    return `/${image.filename}`
  }

  static getLogoUrl(logo) {
    return this.getImageUrl(logo)
  }

  // Cache management
  static clearCache() {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('db_cache_')) {
        localStorage.removeItem(key)
      }
    })
  }

  // ===== CRUD OPERATIONS =====
  
  // Events CRUD
  static async createEvent(eventData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/events/db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      })
      
      if (!response.ok) throw new Error('Failed to create event')
      
      const result = await response.json()
      return result.success ? result.event : null
    } catch (error) {
      throw new Error(`Create event failed: ${error.message}`)
    }
  }

  static async updateEvent(eventId, eventData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/events/db/${eventId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(eventData)
      })
      
      if (!response.ok) throw new Error('Failed to update event')
      
      const result = await response.json()
      return result.success ? result.event : null
    } catch (error) {
      throw new Error(`Update event failed: ${error.message}`)
    }
  }

  static async deleteEvent(eventId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/events/db/${eventId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete event')
      
      const result = await response.json()
      return result.success
    } catch (error) {
      throw new Error(`Delete event failed: ${error.message}`)
    }
  }

  // Blog Posts CRUD
  static async createBlogPost(postData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/blog-posts/db`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      
      if (!response.ok) throw new Error('Failed to create blog post')
      
      const result = await response.json()
      return result.success ? result.post : null
    } catch (error) {
      throw new Error(`Create blog post failed: ${error.message}`)
    }
  }

  static async updateBlogPost(postId, postData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/blog-posts/db/${postId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData)
      })
      
      if (!response.ok) throw new Error('Failed to update blog post')
      
      const result = await response.json()
      return result.success ? result.post : null
    } catch (error) {
      throw new Error(`Update blog post failed: ${error.message}`)
    }
  }

  static async deleteBlogPost(postId) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/blog-posts/db/${postId}`, {
        method: 'DELETE'
      })
      
      if (!response.ok) throw new Error('Failed to delete blog post')
      
      const result = await response.json()
      return result.success
    } catch (error) {
      throw new Error(`Delete blog post failed: ${error.message}`)
    }
  }

  // Images CRUD
  static async createImage(imageData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/images`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData)
      })
      
      if (!response.ok) throw new Error('Failed to create image')
      
      const result = await response.json()
      return result.success ? result.image : null
    } catch (error) {
      throw new Error(`Create image failed: ${error.message}`)
    }
  }

  // Logos CRUD
  static async createLogo(logoData) {
    try {
      const response = await fetch(`${this.API_BASE_URL}/api/logos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData)
      })
      
      if (!response.ok) throw new Error('Failed to create logo')
      
      const result = await response.json()
      return result.success ? result.logo : null
    } catch (error) {
      throw new Error(`Create logo failed: ${error.message}`)
    }
  }

  // Cache wrapper for expensive operations
  static async getCachedData(key, fetchFunction, cacheTime = 300000) { // 5 minutes default
    const cacheKey = `db_cache_${key}`
    const cached = localStorage.getItem(cacheKey)
    
    if (cached) {
      const { data, timestamp } = JSON.parse(cached)
      if (Date.now() - timestamp < cacheTime) {
        return data
      }
    }
    
    try {
      const data = await fetchFunction()
      localStorage.setItem(cacheKey, JSON.stringify({
        data,
        timestamp: Date.now()
      }))
      return data
    } catch (error) {
      // Return cached data if available, even if expired
      if (cached) {
        const { data } = JSON.parse(cached)
        return data
      }
      throw error
    }
  }
}

export default DatabaseService 