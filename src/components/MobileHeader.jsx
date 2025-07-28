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
        ? 'bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100' 
        : 'bg-primary'
    }`}>
      <div className="px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-3">
            <button
              onClick={onMenuClick}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-text hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Menu size={20} />
            </button>
            
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="EventHubble" 
                className="h-8 w-auto" 
              />
              <span className={`text-lg font-bold ${
                isScrolled ? 'text-text' : 'text-white'
              }`}>
                <span className="text-primary-cream">Event</span>
                <span className="text-primary-light">Hubble</span>
              </span>
            </div>
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-2">
            {/* Search Button */}
            <button
              onClick={() => setShowSearch(!showSearch)}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-text hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Search size={20} />
            </button>

            {/* Notifications */}
            <button
              className={`p-2 rounded-lg transition-colors relative ${
                isScrolled 
                  ? 'text-text hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            {/* Language Toggle */}
            <button
              onClick={toggleLanguage}
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-text hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <Globe size={20} />
            </button>

            {/* User Profile */}
            <button
              className={`p-2 rounded-lg transition-colors ${
                isScrolled 
                  ? 'text-text hover:bg-gray-100' 
                  : 'text-white hover:bg-white/10'
              }`}
            >
              <User size={20} />
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

      {/* Bottom Navigation (Alternative) */}
      <div className={`px-4 pb-2 transition-all duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-around bg-white/80 backdrop-blur-sm rounded-full p-1">
          <button className="flex-1 py-2 px-3 rounded-full bg-primary text-white text-xs font-medium">
            {language === 'TR' ? 'Ana Sayfa' : 'Home'}
          </button>
          <button className="flex-1 py-2 px-3 rounded-full text-text/70 text-xs font-medium hover:text-text">
            {language === 'TR' ? 'Kategoriler' : 'Categories'}
          </button>
          <button className="flex-1 py-2 px-3 rounded-full text-text/70 text-xs font-medium hover:text-text">
            {language === 'TR' ? 'Haberler' : 'News'}
          </button>
          <button className="flex-1 py-2 px-3 rounded-full text-text/70 text-xs font-medium hover:text-text">
            {language === 'TR' ? 'Profil' : 'Profile'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default MobileHeader 