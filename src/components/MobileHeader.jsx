import React, { useState, useEffect } from 'react'
import { Menu, X, Globe, Search, Bell, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const MobileHeader = ({ onSearchClick, onMenuClick, logo, language, toggleLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const handleNavigation = (path) => {
    navigate(path)
  }

  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('q', searchTerm)
      navigate(`/search?${searchParams.toString()}`)
      setSearchTerm('')
      setShowSearch(false)
    }
  }

  const isActivePage = (path) => {
    return location.pathname === path
  }

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

        {/* Modern Search Bar */}
        <div className={`mt-3 transition-all duration-300 overflow-hidden ${
          showSearch ? 'max-h-20 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl p-3">
            <div className="flex items-center space-x-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={language === 'TR' ? 'Hangi etkinliği arıyorsunuz?' : 'What event are you looking for?'}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 text-text text-sm"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
              >
                <Search size={18} />
                <span className="text-sm font-medium">{language === 'TR' ? 'Ara' : 'Search'}</span>
              </button>
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchTerm('')
                }}
                className="p-2 text-text/50 hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - 3 Main Pages */}
      <div className={`px-4 pb-2 transition-all duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-around bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button 
            onClick={() => handleNavigation('/')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all duration-200 ${
              isActivePage('/') 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {language === 'TR' ? 'Ana Sayfa' : 'Home'}
          </button>
          <button 
            onClick={() => handleNavigation('/about')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all duration-200 ${
              isActivePage('/about') 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {language === 'TR' ? 'Hakkımızda' : 'About'}
          </button>
          <button 
            onClick={() => handleNavigation('/world-news')}
            className={`flex-1 py-2 px-3 rounded-full text-xs font-medium transition-all duration-200 ${
              isActivePage('/world-news') 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {language === 'TR' ? 'Dünya Haberleri' : 'World News'}
          </button>
        </div>
      </div>
    </header>
  )
}

export default MobileHeader 