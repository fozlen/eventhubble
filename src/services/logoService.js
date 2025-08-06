// Logo Service for Event Hubble - PRD Compliant
const API_BASE_URL = import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

class LogoService {
  constructor() {
    this.API_BASE_URL = API_BASE_URL
    this.cache = new Map()
  }

  // Get logo by variant (large, transparent, dark)
  async getLogo(variant) {
    try {
      // Check cache first
      if (this.cache.has(variant)) {
        return this.cache.get(variant)
      }

      const response = await fetch(`${API_BASE_URL}/api/logos?active=true`)
      const result = await response.json()
      
      if (result.success && result.data && result.data.length > 0) {
        const logo = result.data[0]
        const logoUrl = logo.url
        this.cache.set(variant, logoUrl)
        return logoUrl
      }
      
      // Return fallback URL if not found
      return `${API_BASE_URL}/assets/Logo.png`
    } catch (error) {
      console.error('Error fetching logo:', error)
      return `${API_BASE_URL}/assets/Logo.png`
    }
  }

  // Get all logos
  async getAllLogos() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logos`)
      const result = await response.json()
      
      if (result.success) {
        return result.data || []
      }
      
      return []
    } catch (error) {
      console.error('Error fetching all logos:', error)
      return []
    }
  }

  // Get active logos by variant
  async getActiveLogos() {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logos?active=true`)
      const result = await response.json()
      
      if (result.success) {
        const logos = {}
        result.data.forEach((logo, index) => {
          // Use index-based mapping since variant column doesn't exist
          const variants = ['main', 'large', 'transparent', 'dark']
          if (variants[index]) {
            logos[variants[index]] = logo.url
          }
        })
        return logos
      }
      
      return {}
    } catch (error) {
      console.error('Error fetching active logos:', error)
      return {}
    }
  }

  // Clear cache
  clearCache() {
    this.cache.clear()
  }
}

// Create and export singleton instance
const logoService = new LogoService()
export default logoService 