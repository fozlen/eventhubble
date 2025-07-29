// Global cache service for all content types
class CacheService {
  static API_BASE_URL = import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api'
  
  // Cache configuration
  static CACHE_CONFIG = {
    logos: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
    events: { ttl: 5 * 60 * 1000 }, // 5 minutes
    blogPosts: { ttl: 10 * 60 * 1000 }, // 10 minutes
    images: { ttl: 24 * 60 * 60 * 1000 }, // 24 hours
    categories: { ttl: 60 * 60 * 1000 }, // 1 hour
    stats: { ttl: 5 * 60 * 1000 } // 5 minutes
  }

  // Generic cache method
  static async getCached(key, fetchFunction, ttl = 5 * 60 * 1000) {
    const cacheKey = `cache_${key}`
    const expiryKey = `cache_${key}_expiry`
    
    try {
      // Check cache
      const cached = localStorage.getItem(cacheKey)
      const expiry = localStorage.getItem(expiryKey)
      
      if (cached && expiry && Date.now() < parseInt(expiry)) {
        return JSON.parse(cached)
      }
      
      // Fetch fresh data
      const data = await fetchFunction()
      
      // Cache with expiry
      localStorage.setItem(cacheKey, JSON.stringify(data))
      localStorage.setItem(expiryKey, (Date.now() + ttl).toString())
      
      return data
    } catch (error) {
      console.error(`Cache error for ${key}:`, error)
      
      // Return cached version if available (even if expired)
      const cached = localStorage.getItem(cacheKey)
      if (cached) {
        return JSON.parse(cached)
      }
      
      throw error
    }
  }

  // Image cache with base64 conversion
  static async getCachedImage(url, cacheKey, ttl = 24 * 60 * 60 * 1000) {
    const imageCacheKey = `image_${cacheKey}`
    const expiryKey = `image_${cacheKey}_expiry`
    
    try {
      // Check cache
      const cached = localStorage.getItem(imageCacheKey)
      const expiry = localStorage.getItem(expiryKey)
      
      if (cached && expiry && Date.now() < parseInt(expiry)) {
        return cached
      }
      
      // Fetch image
      const response = await fetch(url)
      if (!response.ok) throw new Error(`Failed to load image: ${response.status}`)
      
      const blob = await response.blob()
      const base64 = await this.blobToBase64(blob)
      
      // Cache with expiry
      localStorage.setItem(imageCacheKey, base64)
      localStorage.setItem(expiryKey, (Date.now() + ttl).toString())
      
      return base64
    } catch (error) {
              // Image cache error for ${cacheKey}
      
      // Return cached version if available
      const cached = localStorage.getItem(imageCacheKey)
      if (cached) {
        return cached
      }
      
      // Fallback to original URL
      return url
    }
  }

  // Logo cache
  static async getLogo(type = 'main') {
    const logoUrl = `${this.API_BASE_URL}/assets/${this.getLogoFilename(type)}`
    return this.getCachedImage(logoUrl, `logo_${type}`, this.CACHE_CONFIG.logos.ttl)
  }

  // Event cache
  static async getEvents(filters = {}, language = 'EN') {
    return this.getCached(
      `events_${language}_${JSON.stringify(filters)}`,
      async () => {
        // Production'da sadece localStorage'dan manuel etkinlikler
        if (import.meta.env.PROD) {
          const storedEvents = localStorage.getItem('manualEvents')
          if (!storedEvents) return []
          
          const events = JSON.parse(storedEvents)
          return events.filter(event => event.language === language)
        }
        
        // Development'da API'den çek
        const response = await fetch(`${this.API_BASE_URL}/events?language=${language}`)
        if (!response.ok) throw new Error('Failed to fetch events')
        return response.json()
      },
      this.CACHE_CONFIG.events.ttl
    )
  }

  // Blog posts cache
  static async getBlogPosts(language = 'EN') {
    return this.getCached(
      `blogPosts_${language}`,
      async () => {
        try {
          // API'den blog yazılarını çek
          const response = await fetch(`${this.API_BASE_URL}/blog-posts?language=${language}`)
          if (!response.ok) throw new Error('Failed to fetch blog posts')
          return response.json()
        } catch (error) {
          // API hatası durumunda localStorage'dan çek (fallback)
          const storedPosts = localStorage.getItem('blogPosts')
          if (!storedPosts) return []
          
          const posts = JSON.parse(storedPosts)
          return posts.filter(post => post.language === language)
        }
      },
      this.CACHE_CONFIG.blogPosts.ttl
    )
  }

  // Categories cache
  static async getCategories(language = 'EN') {
    return this.getCached(
      `categories_${language}`,
      async () => {
        const categories = [
          { id: 'music', name: language === 'TR' ? 'Müzik' : 'Music', icon: 'Music' },
          { id: 'theater', name: language === 'TR' ? 'Tiyatro' : 'Theater', icon: 'Film' },
          { id: 'sports', name: language === 'TR' ? 'Spor' : 'Sports', icon: 'Trophy' },
          { id: 'art', name: language === 'TR' ? 'Sanat' : 'Art', icon: 'Palette' },
          { id: 'gastronomy', name: language === 'TR' ? 'Gastronomi' : 'Gastronomy', icon: 'ChefHat' },
          { id: 'education', name: language === 'TR' ? 'Eğitim' : 'Education', icon: 'GraduationCap' }
        ]
        return categories
      },
      this.CACHE_CONFIG.categories.ttl
    )
  }

  // Stats cache
  static async getStats() {
    return this.getCached(
      'stats',
      async () => {
        try {
          const response = await fetch(`${this.API_BASE_URL}/status`)
          if (!response.ok) throw new Error('Failed to fetch stats')
          return response.json()
        } catch (error) {
          return { events: 0, blogPosts: 0, lastUpdate: new Date().toISOString() }
        }
      },
      this.CACHE_CONFIG.stats.ttl
    )
  }

  // Preload all content
  static async preloadAll(language = 'EN') {
    try {
      await Promise.allSettled([
        this.preloadLogos(),
        this.preloadEvents(language),
        this.preloadBlogPosts(language),
        this.preloadCategories(language),
        this.preloadStats()
      ])
      // Content preloaded successfully
    } catch (error) {
      console.error('❌ Preload error:', error)
    }
  }

  // Preload specific content types
  static async preloadLogos() {
    const logoTypes = ['main', 'new', 'withoutBg', 'mainLogo', 'dark', 'light']
    await Promise.allSettled(
      logoTypes.map(type => this.getLogo(type))
    )
  }

  static async preloadEvents(language) {
    await this.getEvents({}, language)
  }

  static async preloadBlogPosts(language) {
    await this.getBlogPosts(language)
  }

  static async preloadCategories(language) {
    await this.getCategories(language)
  }

  static async preloadStats() {
    await this.getStats()
  }

  // Clear specific cache
  static clearCache(type = null) {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (type) {
        if (key.startsWith(`cache_${type}`) || key.startsWith(`image_${type}`)) {
          localStorage.removeItem(key)
        }
      } else {
        if (key.startsWith('cache_') || key.startsWith('image_')) {
          localStorage.removeItem(key)
        }
      }
    })
  }

  // Clear all cache
  static clearAllCache() {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('cache_') || key.startsWith('image_')) {
        localStorage.removeItem(key)
      }
    })
  }

  // Utility methods
  static getLogoFilename(type) {
    const logos = {
      main: 'Logo.png',
      new: 'eventhubble_new_logo.png',
      withoutBg: 'Logo w_out background.png',
      mainLogo: 'MainLogo.png',
      dark: 'eventhubble_dark_transparent_logo.png',
      light: 'eventhubble_light_transparent_logo.png'
    }
    return logos[type] || 'Logo.png'
  }

  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }

  // Get cache status
  static getCacheStatus() {
    const keys = Object.keys(localStorage)
    const cacheKeys = keys.filter(key => key.startsWith('cache_') || key.startsWith('image_'))
    
    return {
      totalCached: cacheKeys.length,
      cacheSize: cacheKeys.reduce((size, key) => size + (localStorage.getItem(key)?.length || 0), 0),
      cacheKeys: cacheKeys
    }
  }
}

export default CacheService 