// Logo service for API-based logo management with local fallbacks
class LogoService {
  static API_BASE_URL = typeof window !== 'undefined' && window.location.hostname === 'localhost' 
    ? 'http://localhost:3001' 
    : 'https://eventhubble.onrender.com'
  
  // Cache logos in localStorage to avoid repeated API calls
  static async getLogo(type = 'main') {
    const cacheKey = `logo_${type}`
    const cacheExpiryKey = `logo_${type}_expiry`
    
    try {
      // Check if we have a cached version
      const cachedLogo = localStorage.getItem(cacheKey)
      const expiryTime = localStorage.getItem(cacheExpiryKey)
      
      // If cached and not expired, return cached version
      if (cachedLogo && expiryTime && Date.now() < parseInt(expiryTime)) {
        return cachedLogo
      }
      
             // Try to get logo from API first  
       try {
         const logoUrl = `${this.API_BASE_URL}/api/logos/${type}`
         const response = await fetch(logoUrl, {
           method: 'GET',
           headers: {
             'Accept': 'application/json',
           },
         })
         
         if (response.ok) {
           const logoData = await response.json()
           if (logoData.success && logoData.logo && logoData.logo.file_path) {
             // Use the file_path from database (can be base64 or URL)
             const logoPath = logoData.logo.file_path.startsWith('data:') 
               ? logoData.logo.file_path 
               : `${this.API_BASE_URL}${logoData.logo.file_path}`
             
             // Cache for 24 hours
             const expiry = Date.now() + (24 * 60 * 60 * 1000)
             localStorage.setItem(cacheKey, logoPath)
             localStorage.setItem(cacheExpiryKey, expiry.toString())
             
             return logoPath
           }
         }
       } catch (apiError) {
         console.warn('Logo API error:', apiError)
         // Continue to fallback
       }
      
      // Fallback to static assets from backend if API fails
      try {
        const staticLogoUrl = `${this.API_BASE_URL}/assets/${this.getLogoFilename(type)}`
        const response = await fetch(staticLogoUrl)
        
        if (response.ok) {
          return staticLogoUrl
        }
      } catch (staticError) {
        console.warn('Static logo error:', staticError)
      }
      
      // Final fallback to local public assets
      return `/${this.getLogoFilename(type)}`
      
    } catch (error) {
      console.warn('Logo service error:', error)
      
      // Return cached version if available (even if expired)
      const cachedLogo = localStorage.getItem(cacheKey)
      if (cachedLogo) {
        return cachedLogo
      }
      
      // Ultimate fallback to local public asset
      return `/${this.getLogoFilename(type)}`
    }
  }
  
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
  
  // Clear logo cache
  static clearCache() {
    const keys = Object.keys(localStorage)
    keys.forEach(key => {
      if (key.startsWith('logo_')) {
        localStorage.removeItem(key)
      }
    })
  }

  // Force refresh a specific logo
  static async refreshLogo(type = 'main') {
    const cacheKey = `logo_${type}`
    const cacheExpiryKey = `logo_${type}_expiry`
    
    // Clear cache for this logo
    localStorage.removeItem(cacheKey)
    localStorage.removeItem(cacheExpiryKey)
    
    // Reload logo
    return await this.getLogo(type)
  }
  
  // Preload all logos for better performance
  static async preloadLogos() {
    const logoTypes = ['main', 'new', 'withoutBg', 'mainLogo', 'light', 'dark']
    
    try {
      await Promise.allSettled(
        logoTypes.map(type => this.getLogo(type))
      )
    } catch (error) {
      console.warn('Logo preloading error:', error)
    }
  }
}

export default LogoService 