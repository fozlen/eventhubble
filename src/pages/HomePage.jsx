import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { api } from '../services/api'
import LogoService from '../services/logoService'
import MobileHeader from '../components/MobileHeader'
import MobileEventCard from '../components/MobileEventCard'
import MobileFilters from '../components/MobileFilters'
import ModernSearchBox from '../components/ModernSearchBox'
import MobileNavigation from '../components/MobileNavigation'
import Footer from '../components/Footer'

import { 
  Search, 
  Calendar, 
  MapPin, 
  Sun, 
  Moon,
  Globe, 
  ChevronDown,
  Music,
  Film,
  Trophy,
  Palette,
  ChefHat,
  GraduationCap,
  Star,
  Users,
  Map,
  Filter,
  Grid,
  List
} from 'lucide-react'

const HomePage = () => {
  const { language, toggleLanguage } = useLanguage()
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false) // No dark mode anymore, single theme
  const [showMap, setShowMap] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'price'
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [logos, setLogos] = useState({})
  const navigate = useNavigate()

  // Dark mode effect - no longer needed
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Load logos
  useEffect(() => {
    const loadLogos = async () => {
      try {
        const [mainLogo, largeLogo, transparentLogo] = await Promise.all([
          LogoService.getLogo('main'),
          LogoService.getLogo('large'),
          LogoService.getLogo('transparent')
        ])
        
        setLogos({
          main: mainLogo,
          large: largeLogo,
          transparent: transparentLogo
        })
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }

    loadLogos()
  }, [])

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await api.getCategories()
        const categoriesData = result.success && result.data ? result.data : []
        
        // Map categories with icons and counts
        const mappedCategories = categoriesData.map(cat => {
          const categoryIcons = {
            'music': Music,
            'theater': Film,
            'sports': Trophy,
            'art': Palette,
            'gastronomy': ChefHat,
            'education': GraduationCap
          }
          
          return {
            ...cat,
            icon: categoryIcons[cat.category_id] || Star,
            subtitle: language === 'TR' ? 'Etkinlikler' : 'Events'
          }
        })
        
        setCategories(mappedCategories)
      } catch (error) {
        console.error('Categories loading error:', error)
      }
    }

    loadCategories()
  }, [language])

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setError(null)
        
        const params = {
          limit: 100
        }
        
        if (selectedCategory) {
          params.category = selectedCategory
        }
        
        const result = await api.getEvents(params)
        const eventsData = result.success && result.data ? result.data : []
        
        setEvents(eventsData)
      } catch (error) {
        console.error('Event loading error:', error)
        setError(error.message || 'Failed to load events')
        setEvents([])
      }
    }

    loadEvents()
    
    // Track page view
    api.trackEvent('page_view', { page: 'home' })
  }, [selectedCategory])

  // Search handler
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('q', searchTerm)
      if (selectedCategory) searchParams.set('category', selectedCategory)
      navigate(`/search?${searchParams.toString()}`)
    }
  }

  // Category filter handler
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId)
  }

  // Event detail handler
  const handleEventDetail = (eventId) => {
    navigate(`/event/${eventId}`)
    api.trackEvent('event_click', { event_id: eventId })
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const getLogo = () => {
    return logos.main || `${import.meta.env.VITE_API_URL || 'https://eventhubble.onrender.com'}/assets/Logo.svg`
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

  // Calculate dynamic counts for each category
  const categoriesWithCounts = categories.map(category => {
    const count = Array.isArray(events) ? events.filter(event => event.category === category.category_id).length : 0
    return {
      ...category,
      count: count,
      total: count > 0 ? `${count}+` : '0'
    }
  })

  // Filtrelenmiş ve sıralanmış etkinlikler
  const filteredEvents = Array.isArray(events) ? events.filter(event => {
    if (selectedCategory && event.category !== selectedCategory) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return event.title?.toLowerCase().includes(searchLower) ||
             event.description?.toLowerCase().includes(searchLower) ||
             event.venue?.toLowerCase().includes(searchLower)
    }
    return true
  }).sort((a, b) => {
    switch (sortBy) {
      case 'date':
        return a.date && b.date ? new Date(a.date) - new Date(b.date) : 0
      case 'name':
        return a.title.localeCompare(b.title)
      case 'price':
        return (a.price_min || 0) - (b.price_min || 0)
      default:
        return 0
    }
  }) : []

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      {/* Mobile Header */}
      <div className="block sm:hidden">
        <MobileHeader
          onSearchClick={() => {}} // Disable search click for now
          onMenuClick={() => setShowMobileMenu(!showMobileMenu)}
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
                {language === 'TR' ? 'Dünya Haberleri' : 'World News'}
              </a>
            </nav>
            
            {/* Language Toggle - Right Section */}
            <div className="flex justify-center sm:justify-end w-full sm:w-auto">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors p-1 md:p-0"
                title="Language"
              >
                <Globe size={16} />
                <span className="hidden sm:inline">{language.toUpperCase()}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className="bg-gradient-to-br from-primary/10 to-primary-light/20 py-12 md:py-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-text">
            {language === 'TR' ? 'Dünya Çapında En İyi' : 'Discover the Best'} <span className="text-primary">{language === 'TR' ? 'Etkinlikleri Keşfet' : 'Events Worldwide'}</span>
          </h1>
          <p className="text-lg md:text-2xl font-bold text-primary mb-6 md:mb-8 px-2 sm:px-4">
            {language === 'TR' ? 'Her Deneyime Açılan Kapınız' : 'Your Gateway to Every Experience'}
          </p>
          
          {/* Mobile Search Box */}
          <div className="block sm:hidden max-w-xl mx-auto px-4">
            <ModernSearchBox
              language={language}
              onSearch={(term) => {
                setSearchTerm(term)
                handleSearch()
              }}
              showCloseButton={false}
            />
          </div>

          {/* Desktop Search Box */}
          <div className="hidden sm:block max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-4">
            <div className="flex flex-row rounded-full shadow-lg p-1.5 sm:p-2 bg-white">
              <div className="flex-1 flex items-center px-2.5 sm:px-4 py-2.5 sm:py-0">
                <Search className="mr-2 sm:mr-3 text-text/50 flex-shrink-0" size={18} />
                <input
                  type="text"
                  placeholder={language === 'TR' ? 'Hangi etkinliği arıyorsunuz?' : 'What event are you looking for?'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="flex-1 outline-none text-text text-sm sm:text-base min-w-0"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-primary text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5 sm:space-x-2 whitespace-nowrap"
              >
                <Search size={14} />
                <span className="text-xs sm:text-sm">{language === 'TR' ? 'Ara' : 'Search'}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Popular Categories */}
      <section className="py-12 md:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-8 md:mb-12">
            <h2 className="text-2xl md:text-3xl font-bold mb-4 text-text">{language === 'TR' ? 'Popüler Kategoriler' : 'Popular Categories'}</h2>
            <p className="text-text/70 px-4">{language === 'TR' ? 'İlgi alanlarınıza göre etkinlikleri keşfedin' : 'Discover events by your interests'}</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {categoriesWithCounts.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.id}
                  className={`text-center p-4 md:p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    selectedCategory === category.category_id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-primary/20 bg-white hover:border-primary/40'
                  }`}
                  onClick={() => handleCategoryFilter(category.category_id)}
                >
                  <div className="flex justify-center mb-2 md:mb-3">
                    <IconComponent size={24} className="md:w-8 md:h-8 text-primary" />
                  </div>
                  <h3 className="font-bold mb-1 text-text text-sm md:text-base">{category.name}</h3>
                  <p className="text-xs md:text-sm mb-2 md:mb-3 text-text/70">{category.subtitle}</p>
                  <button className="bg-primary text-white px-3 md:px-4 py-1.5 md:py-2 rounded-lg text-xs md:text-sm hover:bg-primary/90 transition-colors">
                    {category.count} {language === 'TR' ? 'etkinlik' : 'events'}
                  </button>
                  <p className="text-xs mt-2 text-text/60">{category.total} {language === 'TR' ? 'toplam' : 'total'}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className="py-8 md:py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4">
          {/* Mobile Header */}
          <div className="block sm:hidden mb-6">
            <div className="text-center">
              <h2 className="text-xl font-bold mb-1 text-text">{language === 'TR' ? 'Etkinlikler' : 'Events'}</h2>
              <p className="text-sm text-text/60">{filteredEvents.length} {language === 'TR' ? 'etkinlik' : 'events'}</p>
            </div>
          </div>

          {/* Desktop Header */}
          <div className="hidden sm:flex flex-row items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold mb-2 text-text">{language === 'TR' ? 'Öne Çıkan Etkinlikler' : 'Featured Events'}</h2>
              <p className="text-text/70">{filteredEvents.length} {language === 'TR' ? 'etkinlik bulundu' : 'events found'}</p>
            </div>
            <div className="flex flex-row space-x-4">
              <button 
                onClick={() => {
                  const newSort = sortBy === 'date' ? 'name' : sortBy === 'name' ? 'price' : 'date'
                  setSortBy(newSort)
                }}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:shadow-md text-text text-sm"
              >
                <Calendar size={16} />
                <span>{getSortLabel()}</span>
                <ChevronDown size={14} />
              </button>
              <button 
                onClick={() => setShowMap(!showMap)}
                className="flex items-center justify-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow bg-white hover:shadow-md text-text text-sm"
              >
                <Map size={16} />
                <span>{showMap ? (language === 'TR' ? 'Haritayı Gizle' : 'Hide Map') : (language === 'TR' ? 'Haritada Göster' : 'Show on Map')}</span>
              </button>
            </div>
          </div>
          
          {filteredEvents.length > 0 ? (
            <>
              {/* Mobile View Controls */}
              <div className="block sm:hidden mb-4">
                <div className="flex items-center justify-center space-x-3">
                  <button
                    onClick={() => setShowFilters(true)}
                    className="p-2 rounded-full transition-all duration-200 bg-white text-text/60 shadow-sm hover:shadow-md"
                  >
                    <Filter size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('grid')}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      viewMode === 'grid' 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-white text-text/60 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <Grid size={18} />
                  </button>
                  <button
                    onClick={() => setViewMode('list')}
                    className={`p-2 rounded-full transition-all duration-200 ${
                      viewMode === 'list' 
                        ? 'bg-primary text-white shadow-lg' 
                        : 'bg-white text-text/60 shadow-sm hover:shadow-md'
                    }`}
                  >
                    <List size={18} />
                  </button>
                </div>
              </div>

              {/* Mobile Event Cards */}
              <div className="block sm:hidden">
                <div className="space-y-4">
                  {filteredEvents.map((event) => (
                    <MobileEventCard
                      key={event.id}
                      event={event}
                      onEventClick={() => handleEventDetail(event.id)}
                      onShare={(event) => {
                        if (navigator.share) {
                          navigator.share({
                            title: event.title,
                            text: event.description,
                            url: window.location.href
                          })
                        } else {
                          navigator.clipboard.writeText(window.location.href)
                          // Silent success - no alert in production
                        }
                      }}
                      language={language}
                    />
                  ))}
                </div>
              </div>

              {/* Desktop Event Grid */}
              <div className="hidden sm:grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredEvents.map((event) => (
                  <div
                    key={event.id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-shadow cursor-pointer overflow-hidden"
                    onClick={() => handleEventDetail(event.id)}
                  >
                    <div className="aspect-video bg-gradient-to-br from-primary/20 to-primary-light/20 relative overflow-hidden">
                      {event.cover_image ? (
                        <img
                          src={event.cover_image}
                          alt={event.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-primary/40" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3">
                        <span className="bg-primary text-white px-2 py-1 rounded-full text-xs font-medium">
                          {event.category}
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="font-bold text-lg mb-2 text-text line-clamp-2">{event.title}</h3>
                      <p className="text-text/70 text-sm mb-3 line-clamp-2">{event.description}</p>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center space-x-2 text-text/60">
                          <Calendar size={14} />
                          <span>{new Date(event.date).toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center space-x-2 text-text/60">
                          <MapPin size={14} />
                          <span>{event.venue}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <Calendar className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-text">
                {language === 'TR' ? 'Henüz etkinlik bulunmuyor' : 'No events found'}
              </h3>
              <p className="text-text/60">
                {language === 'TR' 
                  ? 'Daha sonra tekrar kontrol edin veya farklı bir kategori seçin'
                  : 'Check back later or try a different category'
                }
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Mobile Navigation */}
      <MobileNavigation />

      {/* Footer */}
      <Footer language={language} />

      {/* Mobile Menu Overlay */}
      {showMobileMenu && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 lg:hidden">
          <div className="bg-background w-80 h-full">
            <div className="p-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-text hover:text-primary transition-colors"
              >
                ✕
              </button>
            </div>
            {/* Add mobile menu content here */}
          </div>
        </div>
      )}

      {/* Mobile Filters */}
      {showFilters && (
        <MobileFilters
          categories={categories}
          selectedCategory={selectedCategory}
          onCategorySelect={handleCategoryFilter}
          cities={['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep']}
          selectedCity=""
          onCitySelect={() => {}}
          onClose={() => setShowFilters(false)}
          language={language}
        />
      )}
    </div>
  )
}

export default HomePage 