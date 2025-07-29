// Logo service for static asset management
class LogoService {
  // Use static assets from public directory (served by Vite)
  static getStaticAssetPath(filename) {
    // In production, assets are served from root
    // In development, assets are served from public directory
    return `/${filename}`
  }
  
  // Get logo without backend dependency
  static async getLogo(type = 'main') {
    const filename = this.getLogoFilename(type)
    
    try {
      // Return direct path to static asset
      const logoPath = this.getStaticAssetPath(filename)
      
      // Test if the file exists by creating an image element
      return new Promise((resolve) => {
        const img = new Image()
        img.onload = () => {
          resolve(logoPath)
        }
        img.onerror = () => {
          // Fallback to main logo if specific type fails
          if (type !== 'main') {
            resolve(this.getStaticAssetPath('Logo.png'))
          } else {
            // Ultimate fallback to a default image data URL
            resolve('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzg5NTVGNiIvPgo8dGV4dCB4PSIyMCIgeT0iMjYiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxOCIgZm9udC13ZWlnaHQ9ImJvbGQiIGZpbGw9IndoaXRlIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5FSDwvdGV4dD4KPC9zdmc+')
          }
        }
        img.src = logoPath
      })
    } catch (error) {
      console.warn('Logo loading error:', error)
      // Return fallback
      return this.getStaticAssetPath('Logo.png')
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