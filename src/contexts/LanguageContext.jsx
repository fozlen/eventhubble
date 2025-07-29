import React, { createContext, useContext, useState, useEffect } from 'react'

const LanguageContext = createContext()

export const useLanguage = () => {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })

  const toggleLanguage = () => {
    const newLanguage = language === 'EN' ? 'TR' : 'EN'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  // Update document title when language changes
  useEffect(() => {
    const titles = {
      'TR': {
        home: 'EventHubble | Dünya Çapında Harika Etkinlikleri Keşfet',
        about: 'EventHubble | Hakkımızda',
        contact: 'EventHubble | İletişim',
        categories: 'EventHubble | Kategoriler',
        worldNews: 'EventHubble | Dünyadan Gelişmeler',
        eventDetail: 'EventHubble | Etkinlik Detayı',
        searchResults: 'EventHubble | Arama Sonuçları',
        blogDetail: 'EventHubble | Blog Detayı',
        admin: 'EventHubble | Admin Paneli'
      },
      'EN': {
        home: 'EventHubble | Your Gateway to Every Experience',
        about: 'EventHubble | About Us',
        contact: 'EventHubble | Contact',
        categories: 'EventHubble | Categories',
        worldNews: 'EventHubble | World News',
        eventDetail: 'EventHubble | Event Detail',
        searchResults: 'EventHubble | Search Results',
        blogDetail: 'EventHubble | Blog Detail',
        admin: 'EventHubble | Admin Panel'
      }
    }

    // Get current page type from URL
    const path = window.location.pathname
    let pageType = 'home'
    
    if (path.includes('/about')) pageType = 'about'
    else if (path.includes('/contact')) pageType = 'contact'
    else if (path.includes('/categories')) pageType = 'categories'
    else if (path.includes('/world-news')) pageType = 'worldNews'
    else if (path.includes('/event/')) pageType = 'eventDetail'
    else if (path.includes('/search')) pageType = 'searchResults'
    else if (path.includes('/blog/')) pageType = 'blogDetail'
    else if (path.includes('/admin')) pageType = 'admin'

    document.title = titles[language][pageType] || titles[language].home
  }, [language])

  const value = {
    language,
    setLanguage,
    toggleLanguage
  }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
} 