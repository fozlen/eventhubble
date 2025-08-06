import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
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
  List,
  Loader2
} from 'lucide-react'

const HomePage = () => {
  const { language, toggleLanguage } = useLanguage()
  const [events, setEvents] = useState([])
  const [categories, setCategories] = useState([])
  const [logos, setLogos] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedCity, setSelectedCity] = useState('')
  const [showMap, setShowMap] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'price'
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const navigate = useNavigate()

  // Cities
  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep']

  // Category icon mapping
  const categoryIcons = {
    'music': Music,
    'theater': Film,
    'sports': Trophy,
    'art': Palette,
    'gastronomy': ChefHat,
    'education': GraduationCap
  }

  // Load logos from API
  useEffect(() => {
    const loadLogos = async () => {
      try {
        const [mainLogo, transparentLogo, darkLogo] = await Promise.all([
          api.getActiveLogo('large'),
          api.getActiveLogo('transparent'),
          api.getActiveLogo('dark')
        ])
        
        setLogos({
          main: mainLogo?.url || '/assets/Logo.png',
          transparent: transparentLogo?.url || '/assets/Logo.png',
          dark: darkLogo?.url || '/assets/Logo.png'
        })
      } catch (error) {
        console.error('Logo loading error:', error)
        // Use fallback logos
        setLogos({
          main: '/assets/Logo.png',
          transparent: '/assets/Logo.png',
          dark: '/assets/Logo.png'
        })
      }
    }

    loadLogos()
  }, [])

  // Load categories from API
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const result = await api.getCategories()
        const categoriesData = result.success ? result.data : result
        
        // Map categories with icons and counts
        const mappedCategories = categoriesData.map(cat => ({
          ...cat,
          icon: categoryIcons[cat.category_id] || Star,
          count: 0 // Will be updated when events load
        }))
        
        setCategories(mappedCategories)
      } catch (error) {
        console.error('Categories loading error:', error)
      }
    }

    loadCategories()
  }, [])

  // Load events from API
  useEffect(() => {
    const loadEvents = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const params = {
          limit: 100
        }
        
        if (selectedCategory) {
          params.category = selectedCategory
        }
        if (selectedCity) {
          params.city = selectedCity
        }
        
        const result = await api.getEvents(params)
        const eventsData = result.data || []
        
        setEvents(eventsData)
        
        // Update category counts
        if (categories.length > 0) {
          const updatedCategories = categories.map(cat => {
            const count = eventsData.filter(event => event.category === cat.category_id).length
            return { ...cat, count }
          })
          setCategories(updatedCategories)
        }
      } catch (error) {
        console.error('Event loading error:', error)
        setError(error.message || 'Failed to load events')
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
    
    // Track page view
    api.trackEvent('page_view', { page: 'home' })
  }, [selectedCategory, selectedCity])

  // Search handler
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('q', searchTerm)
      if (selectedCategory) searchParams.set('category', selectedCategory)
      if (selectedCity) searchParams.set('city', selectedCity)
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

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    if (sortBy === 'date') {
      return new Date(a.date) - new Date(b.date)
    } else if (sortBy === 'name') {
      return a.title.localeCompare(b.title)
    } else if (sortBy === 'price') {
      return (a.price_min || 0) - (b.price_min || 0)
    }
    return 0
  })

  // Filter events by search term
  const filteredEvents = sortedEvents.filter(event => {
    if (!searchTerm) return true
    const searchLower = searchTerm.toLowerCase()
    return (
      event.title?.toLowerCase().includes(searchLower) ||
      event.description?.toLowerCase().includes(searchLower) ||
      event.location?.toLowerCase().includes(searchLower) ||
      event.city?.toLowerCase().includes(searchLower)
    )
  })

  // Format event date
  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const options = {
      day: 'numeric',
      month: language === 'TR' ? 'long' : 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', options)
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-purple-600 mx-auto mb-4" />
          <p className="text-gray-600">
            {language === 'TR' ? 'Etkinlikler yükleniyor...' : 'Loading events...'}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Mobile Header */}
      <MobileHeader 
        logo={logos.main}
        language={language}
        toggleLanguage={toggleLanguage}
        onMenuToggle={() => setShowMobileMenu(true)}
      />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-6">
            {language === 'TR' 
              ? 'Unutulmaz Anlar Seni Bekliyor' 
              : 'Your Gateway to Every Experience'}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            {language === 'TR'
              ? 'Konserler, festivaller, spor etkinlikleri ve daha fazlası'
              : 'Concerts, festivals, sports events and more'}
          </p>
          
          {/* Search Box */}
          <ModernSearchBox
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            categories={categories}
            onSearch={handleSearch}
            language={language}
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-8 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-purple-600">{filteredEvents.length}+</div>
              <div className="text-gray-600">
                {language === 'TR' ? 'Etkinlik' : 'Events'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-pink-600">{categories.length}</div>
              <div className="text-gray-600">
                {language === 'TR' ? 'Kategori' : 'Categories'}
              </div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-600">{cities.length}</div>
              <div className="text-gray-600">
                {language === 'TR' ? 'Şehir' : 'Cities'}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {language === 'TR' ? 'Kategoriler' : 'Categories'}
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {categories.map((category) => {
              const Icon = category.icon
              return (
                <button
                  key={category.id}
                  onClick={() => handleCategoryFilter(category.category_id)}
                  className={`p-6 rounded-xl transition-all ${
                    selectedCategory === category.category_id
                      ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-lg scale-105'
                      : 'bg-white hover:shadow-lg hover:scale-105'
                  }`}
                >
                  <Icon className={`w-8 h-8 mx-auto mb-2 ${
                    selectedCategory === category.category_id ? 'text-white' : 'text-purple-600'
                  }`} />
                  <div className="font-semibold">{category.name}</div>
                  <div className="text-sm opacity-75">
                    {category.count} {language === 'TR' ? 'Etkinlik' : 'Events'}
                  </div>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Filters and Sorting */}
      <section className="py-4 px-4 bg-white sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center gap-2 px-4 py-2 border rounded-lg hover:bg-gray-50"
              >
                <Filter className="w-4 h-4" />
                {language === 'TR' ? 'Filtreler' : 'Filters'}
              </button>
              
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="">
                  {language === 'TR' ? 'Tüm Şehirler' : 'All Cities'}
                </option>
                {cities.map(city => (
                  <option key={city} value={city}>{city}</option>
                ))}
              </select>
            </div>
            
            <div className="flex items-center gap-4">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="date">
                  {language === 'TR' ? 'Tarihe Göre' : 'By Date'}
                </option>
                <option value="name">
                  {language === 'TR' ? 'İsme Göre' : 'By Name'}
                </option>
                <option value="price">
                  {language === 'TR' ? 'Fiyata Göre' : 'By Price'}
                </option>
              </select>
              
              <div className="flex gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  <Grid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-600 text-white' : 'bg-gray-200'}`}
                >
                  <List className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Events Section */}
      <section className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">
            {selectedCategory 
              ? categories.find(c => c.category_id === selectedCategory)?.name
              : language === 'TR' ? 'Tüm Etkinlikler' : 'All Events'}
          </h2>
          
          {error ? (
            <div className="text-center py-12">
              <p className="text-red-600 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                {language === 'TR' ? 'Tekrar Dene' : 'Try Again'}
              </button>
            </div>
          ) : filteredEvents.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-gray-600 text-lg">
                {language === 'TR' 
                  ? 'Henüz etkinlik bulunmuyor.' 
                  : 'No events found.'}
              </p>
            </div>
          ) : (
            <div className={viewMode === 'grid' 
              ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
              : 'space-y-4'
            }>
              {filteredEvents.map((event) => (
                <MobileEventCard
                  key={event.id}
                  event={{
                    ...event,
                    image: event.cover_image || event.thumbnail_image || '/placeholder-event.jpg',
                    formattedDate: formatDate(event.date),
                    categoryName: categories.find(c => c.category_id === event.category)?.name || event.category
                  }}
                  onClick={() => handleEventDetail(event.id)}
                  language={language}
                  viewMode={viewMode}
                />
              ))}
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
          <div className="bg-white w-80 h-full">
            <div className="p-4">
              <button
                onClick={() => setShowMobileMenu(false)}
                className="text-gray-600 hover:text-gray-900"
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
          cities={cities}
          selectedCity={selectedCity}
          onCitySelect={setSelectedCity}
          onClose={() => setShowFilters(false)}
          language={language}
        />
      )}
    </div>
  )
}

export default HomePage 