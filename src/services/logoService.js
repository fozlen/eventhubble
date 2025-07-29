// Logo service for caching and loading logos from backend API
class LogoService {
  static API_BASE_URL = import.meta.env.PROD ? 'https://eventhubble-api.onrender.com' : 'http://localhost:3001'
  
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
      
      // First try to get from database API
      try {
        const apiResponse = await fetch(`${this.API_BASE_URL}/api/logos`)
        if (apiResponse.ok) {
          const { logos } = await apiResponse.json()
          const logo = logos.find(l => l.id === type) || logos.find(l => l.id === 'main')
          
          if (logo) {
            // Fetch the actual logo file
            const logoResponse = await fetch(`${this.API_BASE_URL}${logo.url}`)
            if (logoResponse.ok) {
              const blob = await logoResponse.blob()
              const base64 = await this.blobToBase64(blob)
              
              // Cache for 24 hours
              const expiry = Date.now() + (24 * 60 * 60 * 1000)
              localStorage.setItem(cacheKey, base64)
              localStorage.setItem(cacheExpiryKey, expiry.toString())
              
              return base64
            }
          }
        }
      } catch (apiError) {
        // Continue to fallback method
      }
      
      // Fallback to direct file fetch
      const logoUrl = import.meta.env.PROD 
        ? `/${this.getLogoFilename(type)}`
        : `${this.API_BASE_URL}/assets/${this.getLogoFilename(type)}`
      const response = await fetch(logoUrl)
      
      if (!response.ok) {
        throw new Error(`Failed to load logo: ${response.status}`)
      }
      
      // Convert to base64 for caching
      const blob = await response.blob()
      const base64 = await this.blobToBase64(blob)
      
      // Cache for 24 hours
      const expiry = Date.now() + (24 * 60 * 60 * 1000)
      localStorage.setItem(cacheKey, base64)
      localStorage.setItem(cacheExpiryKey, expiry.toString())
      
      return base64
    } catch (error) {
      // Logo loading error
      
      // Return cached version if available (even if expired)
      const cachedLogo = localStorage.getItem(cacheKey)
      if (cachedLogo) {
        return cachedLogo
      }
      
      // Final fallback to direct URL
      return import.meta.env.PROD 
        ? `/${this.getLogoFilename(type)}`
        : `/${this.getLogoFilename(type)}`
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
  
  static blobToBase64(blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(reader.result)
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  }
  
  // Preload all logos for better performance
  static async preloadLogos() {
    const logoTypes = ['main', 'new', 'withoutBg', 'mainLogo']
    
    try {
      await Promise.allSettled(
        logoTypes.map(type => this.getLogo(type))
      )
    } catch (error) {
      // Logo preloading error
    }
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
}

export default LogoService 