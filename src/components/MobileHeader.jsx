import React, { useState, useEffect } from 'react'
import { Menu, X, Globe, Search, Bell, User } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'

const MobileHeader = ({ onSearchClick, onMenuClick, logo, language, toggleLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? 'bg-primary/95 backdrop-blur-md shadow-lg border-b border-primary/20' 
        : 'bg-primary'
    }`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className="p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="EventHubble" 
                className="h-8 w-auto" 
              />
              <span className="text-lg font-bold text-white">
                <span className="text-primary-cream">Event</span>
                <span className="text-primary-light">Hubble</span>
              </span>
            </div>
          </div>

          {/* Right Actions - Only Language Toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleLanguage}
              className="p-2 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              <Globe size={20} />
            </button>
          </div>
        </div>

        {/* Expandable Search Bar */}
        <div className={`mt-3 transition-all duration-300 overflow-hidden ${
          showSearch ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="flex items-center bg-white rounded-full shadow-lg p-2">
            <Search className="mr-2 text-text/50" size={18} />
            <input
              type="text"
              placeholder={language === 'TR' ? 'Etkinlik ara...' : 'Search events...'}
              className="flex-1 outline-none text-text text-sm"
              autoFocus
            />
            <button
              onClick={() => setShowSearch(false)}
              className="p-1 text-text/50 hover:text-text"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - 3 Main Pages */}
      <div className={`px-4 pb-2 transition-all duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-around bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button className="flex-1 py-2 px-3 rounded-full bg-white/20 text-white text-xs font-medium hover:bg-white/30 transition-colors">
            {language === 'TR' ? 'Ana Sayfa' : 'Home'}
          </button>
          <button className="flex-1 py-2 px-3 rounded-full text-white/80 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            {language === 'TR' ? 'Hakkımızda' : 'About'}
          </button>
          <button className="flex-1 py-2 px-3 rounded-full text-white/80 text-xs font-medium hover:text-white hover:bg-white/10 transition-colors">
            {language === 'TR' ? 'Dünya Haberleri' : 'World News'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default MobileHeader 