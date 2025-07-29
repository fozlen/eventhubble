import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Filter, ChevronDown, Map, ExternalLink } from 'lucide-react'
import CacheService from
import LogoService from '../services/logoService' '../services/cacheService'
import { EventService } from '../services/eventService'
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'


const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'price'
  const [showMap, setShowMap] = useState(false)
  const [logos, setLogos] = useState({})

  // Get search parameters
  const searchTerm = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const dateRange = searchParams.get('dateRange') || ''

  // Get logo
  const getLogo = () => {
    return logos.main || LogoService.API_BASE_URL + '/assets/Logo.png'
  }

  // Load logos
  useEffect(() => {
    const loadLogos = async () => {
      try {
        const [mainLogo, newLogo, logoWithoutBg, mainLogoLarge] = await Promise.all([
          LogoService.getLogo('main'),
          LogoService.getLogo('new'),
          LogoService.getLogo('withoutBg'),
          LogoService.getLogo('mainLogo')
        ])
        
        setLogos({
          main: mainLogo,
          new: newLogo,
          withoutBg: logoWithoutBg,
          mainLogo: mainLogoLarge
        })
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }

    loadLogos()
  }, [])

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? `Event Hubble | "${searchTerm}" Arama Sonuçları`
      : `Event Hubble | Search Results for "${searchTerm}"`
    document.title = title
  }, [language, searchTerm])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode))
  }



  const handleLogin = () => {
    // Login functionality
  }

  // Load events and filter based on search criteria
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        // eventService.js kullanarak tüm eventleri yükle (Manuel + API)
        const allEvents = await EventService.getEvents()
        setEvents(allEvents)
      } catch (error) {
        if (!import.meta.env.PROD) {
          console.error('Event loading error:', error)
        }
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [language])

  // Filter and sort events based on search criteria
  useEffect(() => {
    let filtered = events.filter(event => {
      // Search term filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase()
        const matchesSearch = event.title?.toLowerCase().includes(searchLower) ||
                             event.description?.toLowerCase().includes(searchLower) ||
                             event.venue?.toLowerCase().includes(searchLower) ||
                             event.city?.toLowerCase().includes(searchLower) ||
                             event.category?.toLowerCase().includes(searchLower)
        if (!matchesSearch) return false
      }

      // Category filter
      if (category && event.category !== category) return false

      // Date range filter (basit implementasyon)
      if (dateRange && event.date) {
        const eventDate = new Date(event.date)
        const today = new Date()
        if (dateRange === 'today' && eventDate.toDateString() !== today.toDateString()) return false
        if (dateRange === 'week' && eventDate > new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)) return false
        if (dateRange === 'month' && eventDate > new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000)) return false
      }

      return true
    })

    // Sort events
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'date':
          return a.date && b.date ? new Date(a.date) - new Date(b.date) : 0
        case 'name':
          return a.title.localeCompare(b.title)
        case 'price':
          return (parseInt(a.price_min) || 0) - (parseInt(b.price_min) || 0)

        default:
          return 0
      }
    })

    setFilteredEvents(filtered)
  }, [events, searchTerm, category, dateRange, sortBy])

  const handleEventDetail = (eventId) => {
    navigate(`/event/${eventId}`)
  }

  const handleBuyTicket = (event) => {
    window.open(event.url, '_blank')
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş'
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getSortLabel = () => {
    switch (sortBy) {
      case 'date':
        return language === 'TR' ? 'Tarihe Göre' : 'By Date'
      case 'name':
        return language === 'TR' ? 'İsme Göre' : 'By Name'
      case 'price':
        return language === 'TR' ? 'Fiyata Göre' : 'By Price'
      default:
        return language === 'TR' ? 'Sırala' : 'Sort'
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h3 className="text-xl font-semibold text-text">
            {language === 'TR' ? 'Arama sonuçları yükleniyor...' : 'Loading search results...'}
          </h3>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      {/* Mobile Header */}
      <div className="block sm:hidden">
        <MobileHeader
          onSearchClick={() => {}}
          onMenuClick={() => {}}
          logo={getLogo()}
          language={language}
          toggleLanguage={toggleLanguage}
        />
        <div className="h-16"></div> {/* Spacer for fixed header */}
      </div>

      {/* Desktop Header */}
      <header className="hidden sm:block bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-4 sm:gap-0">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 md:space-x-4 hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src={getLogo()} 
                  alt="EventHubble" 
                  className="h-8 md:h-10 w-auto" 
                />
                <span className="text-lg md:text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
              </button>
            </div>
            
            {/* Navigation Menu - Center Section */}
            <nav className="flex justify-center items-center space-x-4 sm:space-x-8 flex-wrap">
              <a
                href="/"
                className="text-sm font-medium transition-colors text-white hover:text-primary-light whitespace-nowrap"
              >
                {language === 'TR' ? 'Ana Sayfa' : 'Home'}
              </a>
              <a
                href="/about"
                className="text-sm font-medium transition-colors text-white/80 hover:text-white whitespace-nowrap"
              >
                {language === 'TR' ? 'Hakkımızda' : 'About'}
              </a>
              <a
                href="/world-news"
                className="text-sm font-medium transition-colors text-white/80 hover:text-white whitespace-nowrap"
              >
                {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
              </a>
            </nav>
            
            {/* Language Toggle - Right Section */}
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors p-1 md:p-0"
                title={language === 'TR' ? 'Language' : 'Dil'}
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{language}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Search Results Header */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2 text-text/70 hover:text-text transition-colors"
          >
            <ArrowLeft size={20} />
            <span>{language === 'TR' ? 'Geri Dön' : 'Go Back'}</span>
          </button>
        </div>
        
        {/* Mobile Header */}
        <div className="block sm:hidden mb-6">
          <div className="text-center">
            <h1 className="text-xl font-bold mb-1 text-text">
              {language === 'TR' ? 'Arama' : 'Search'}
            </h1>
            <p className="text-sm text-text/70">
              {filteredEvents.length} {language === 'TR' ? 'sonuç' : 'results'}
            </p>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold mb-2 text-text">
              {language === 'TR' ? 'Arama Sonuçları' : 'Search Results'}
            </h1>
            <p className="text-text/70 mb-6">
              {language === 'TR' ? 'Bulunan etkinlikler' : 'Found events'}: <span className="font-semibold text-primary">{filteredEvents.length}</span>
            </p>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Sort Dropdown */}
            <div className="relative">
              <button
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
                onClick={() => {
                  const newSort = sortBy === 'date' ? 'name' : sortBy === 'name' ? 'price' : 'date'
                  setSortBy(newSort)
                }}
              >
                <Calendar size={16} />
                <span>{getSortLabel()}</span>
                <ChevronDown size={16} />
              </button>
            </div>

            {/* Show on Map Button */}
            <button
              onClick={() => setShowMap(!showMap)}
              className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${isDarkMode ? 'bg-gray-700 border-gray-600 text-white hover:bg-gray-600' : 'bg-white border-gray-300 text-gray-700 hover:bg-gray-50'}`}
            >
              <Map size={16} />
              <span>{language === 'TR' ? 'Haritada Göster' : 'Show on Map'}</span>
            </button>
          </div>
        </div>

        {/* Search Filters Summary */}
        {(searchTerm || category || dateRange) && (
          <div className="p-4 rounded-lg mb-6 bg-white border border-gray-200">
            <h3 className="font-semibold mb-2 text-text">
              {language === 'TR' ? 'Aktif Filtreler' : 'Active Filters'}
            </h3>
            <div className="flex flex-wrap gap-2">
              {searchTerm && (
                <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                  {language === 'TR' ? 'Arama' : 'Search'}: {searchTerm}
                </span>
              )}
              {category && (
                <span className="px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
                  {language === 'TR' ? 'Kategori' : 'Category'}: {category}
                </span>
              )}
              {dateRange && (
                <span className="px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
                  {language === 'TR' ? 'Tarih' : 'Date'}: {dateRange}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Results */}
        {filteredEvents.length > 0 ? (
          <div className="grid gap-6">
            {filteredEvents.map((event) => (
              <div key={event.id} className="rounded-xl overflow-hidden shadow-lg bg-white border border-gray-200">
                <div className="flex flex-col md:flex-row">
                  {/* Event Image */}
                  <div className="md:w-1/3">
                    <img 
                      src={event.image_url} 
                      alt={event.title}
                      className="w-full h-48 md:h-full object-cover"
                    />
                  </div>
                  
                  {/* Event Details */}
                  <div className="flex-1 p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                            {event.category}
                          </span>
                          <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            ⭐ {event.rating}
                          </span>
                        </div>
                        
                        <h3 className="text-xl font-bold mb-2 text-text">
                          {event.title}
                        </h3>
                        
                        <p className="text-sm mb-4 text-text/70">
                          {event.description}
                        </p>
                      </div>
                    </div>

                    {/* Event Info Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      <div className="flex items-center">
                        <Calendar className="mr-2 text-primary" size={16} />
                        <div>
                          <p className="text-xs font-medium text-text/70">
                            {language === 'TR' ? 'Tarih' : 'Date'}
                          </p>
                          <p className="text-sm text-text">
                            {formatDate(event.date)}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="mr-2 text-primary" size={16} />
                        <div>
                          <p className="text-xs font-medium text-text/70">
                            {language === 'TR' ? 'Konum' : 'Location'}
                          </p>
                          <p className="text-sm text-text">
                            {event.venue}, {event.city}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-end">
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEventDetail(event.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {language === 'TR' ? 'Detaylar' : 'Details'}
                        </button>
                        
                        <button
                          onClick={() => handleBuyTicket(event)}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center justify-center"
                        >
                          <ExternalLink size={16} className="mr-1" />
                          {language === 'TR' ? 'Bilet Al' : 'Buy Ticket'}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Calendar className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={48} />
            </div>
            <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
              {language === 'TR' ? 'Etkinlik bulunamadı' : 'No events found'}
            </h3>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
              {language === 'TR' 
                ? 'Arama kriterlerinizi ayarlamayı deneyin veya farklı anahtar kelimeler kullanın.'
                : 'Try adjusting your search criteria or use different keywords.'
              }
            </p>
            <h3 className="text-xl font-semibold mb-2 text-text">
              {language === 'TR' ? 'Filtreler' : 'Filters'}
            </h3>
            <button
              onClick={() => navigate('/')}
              className="mt-4 bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
            >
              {language === 'TR' ? 'Yeni Arama Yap' : 'New Search'}
            </button>
          </div>
        )}
      </div>

      {/* Footer */}
      <footer className="hidden sm:block bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-8 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <img 
                  src={getLogo()} 
                  alt="EventHubble" 
                  className="h-10 w-auto" 
                />
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
              </div>
            </div>
            
            {/* Company Links - Center Section */}
            <div className="flex justify-center w-full sm:w-auto">
              <div className="text-center">
                <h3 className="font-semibold mb-4">{language === 'TR' ? 'Şirket' : 'Company'}</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/about" className="hover:text-white transition-colors">{language === 'TR' ? 'Hakkımızda' : 'About'}</a></li>
                </ul>
              </div>
            </div>
            
            {/* Blog Links - Right Section */}
            <div className="flex justify-center w-full sm:w-auto">
              <div className="text-center">
                <h3 className="font-semibold mb-4">Blog</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/world-news" className="hover:text-white transition-colors">{language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}</a></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="rounded-xl p-6 max-w-2xl w-full mx-4 bg-white">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-text">
                {language === 'TR' ? 'Etkinlik Konumları' : 'Event Locations'}
              </h3>
              <button 
                onClick={() => setShowMap(false)}
                className="text-text/50 hover:text-text"
              >
                ✕
              </button>
            </div>
            <div className="rounded-lg p-4 h-64 flex items-center justify-center bg-background-secondary">
              <div className="text-center">
                <Map size={48} className="text-text/50 mx-auto mb-2" />
                <p className="text-text/70">
                  {language === 'TR' ? 'İnteraktif harita yakında!' : 'Interactive map coming soon!'}
                </p>
                <p className="text-sm mt-1 text-text/60">
                  {language === 'TR' ? 'Google Maps entegrasyonu üzerinde çalışıyoruz' : 'We\'re working on integrating Google Maps'}
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {filteredEvents.map(event => (
                <div key={event.id} className="flex items-center space-x-3 p-2 hover:bg-background-secondary rounded">
                  <MapPin size={16} className="text-text-accent" />
                  <div>
                    <p className="font-medium text-text">{event.title}</p>
                    <p className="text-sm text-text/60">{event.venue}, {event.city}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Mobile Navigation */}
      <MobileNavigation language={language} />

    </div>
  )
}

export default SearchResultsPage 