import React, { useState, useEffect } from 'react'
import LogoService from '../services/logoService'
import { Menu, X, Globe, Search, Bell, User } from 'lucide-react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'

const MobileHeader = ({ onSearchClick, onMenuClick, logo, language, toggleLanguage }) => {
  const [isScrolled, setIsScrolled] = useState(false)
  const [showSearch, setShowSearch] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [headerLogo, setHeaderLogo] = useState('/assets/Logo.png')
  const navigate = useNavigate()

  // Load logo using LogoService
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await LogoService.getLogo('main')
        setHeaderLogo(logoUrl)
      } catch (error) {
        console.error('Header logo loading error:', error)
        // Fallback to static asset
        setHeaderLogo('/assets/Logo.png')
      }
    }
    loadLogo()
  }, [])
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
      <div className="px-3 py-2">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-2">
              <img 
                src={headerLogo} 
                alt="EventHubble" 
                className="h-6 w-auto" 
              />
              <span className="text-base font-bold text-white">
                <span className="text-primary-cream">Event</span>
                <span className="text-primary-light">Hubble</span>
              </span>
            </div>
          </div>

          {/* Right Actions - Only Language Toggle */}
          <div className="flex items-center">
            <button
              onClick={toggleLanguage}
              className="p-1.5 rounded-lg transition-colors text-white hover:bg-white/10"
            >
              <Globe size={18} />
            </button>
          </div>
        </div>

        {/* Modern Search Bar */}
        <div className={`mt-2 transition-all duration-300 overflow-hidden ${
          showSearch ? 'max-h-16 opacity-100' : 'max-h-0 opacity-0'
        }`}>
          <div className="bg-white rounded-2xl shadow-xl p-2">
            <div className="flex items-center space-x-2">
              <div className="flex-1 relative">
                <Search className="absolute left-2 top-1/2 transform -translate-y-1/2 text-text/40" size={16} />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  placeholder={language === 'TR' ? 'Hangi etkinliği arıyorsunuz?' : 'What event are you looking for?'}
                  className="w-full pl-8 pr-3 py-2 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 text-text text-sm"
                  autoFocus
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-3 py-2 rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-1 shadow-lg hover:shadow-xl"
              >
                <Search size={16} />
                <span className="text-xs font-medium">{language === 'TR' ? 'Ara' : 'Search'}</span>
              </button>
              <button
                onClick={() => {
                  setShowSearch(false)
                  setSearchTerm('')
                }}
                className="p-1.5 text-text/50 hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Navigation - 3 Main Pages */}
      <div className={`px-3 pb-1 transition-all duration-300 ${
        isScrolled ? 'opacity-100' : 'opacity-0'
      }`}>
        <div className="flex items-center justify-around bg-white/10 backdrop-blur-sm rounded-full p-1">
          <button 
            onClick={() => handleNavigation('/')}
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all duration-200 ${
              isActivePage('/') 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {language === 'TR' ? 'Ana Sayfa' : 'Home'}
          </button>
          <button 
            onClick={() => handleNavigation('/about')}
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all duration-200 ${
              isActivePage('/about') 
                ? 'bg-white/20 text-white shadow-lg' 
                : 'text-white/80 hover:text-white hover:bg-white/10'
            }`}
          >
            {language === 'TR' ? 'Hakkımızda' : 'About'}
          </button>
          <button 
            onClick={() => handleNavigation('/world-news')}
            className={`flex-1 py-1.5 px-2 rounded-full text-xs font-medium transition-all duration-200 ${
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