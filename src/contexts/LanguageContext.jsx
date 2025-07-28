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
        home: 'Event Hubble | Dünya Çapında Harika Etkinlikleri Keşfet',
        about: 'Event Hubble | Hakkımızda',
        worldNews: 'Event Hubble | Dünyadan Gelişmeler',
        eventDetail: 'Event Hubble | Etkinlik Detayı',
        searchResults: 'Event Hubble | Arama Sonuçları',
        blogDetail: 'Event Hubble | Blog Detayı',
        admin: 'Event Hubble | Admin Paneli'
      },
      'EN': {
        home: 'Event Hubble | Discover Amazing Events Worldwide',
        about: 'Event Hubble | About Us',
        worldNews: 'Event Hubble | World News',
        eventDetail: 'Event Hubble | Event Detail',
        searchResults: 'Event Hubble | Search Results',
        blogDetail: 'Event Hubble | Blog Detail',
        admin: 'Event Hubble | Admin Panel'
      }
    }

    // Get current page type from URL
    const path = window.location.pathname
    let pageType = 'home'
    
    if (path.includes('/about')) pageType = 'about'
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