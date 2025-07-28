import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'
import { EventService } from '../services/eventService'
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
  Clock,
  Users,
  Map
} from 'lucide-react'

const HomePage = () => {
  const { language, toggleLanguage } = useLanguage()
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDarkMode, setIsDarkMode] = useState(false) // No dark mode anymore, single theme
  const [showMap, setShowMap] = useState(false)
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'price'
  const navigate = useNavigate()

  // Dark mode effect - no longer needed
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Categories - with modern icons and dynamic counts
  const categories = [
    { id: 'music', name: language === 'TR' ? 'Müzik' : 'Music', icon: Music, subtitle: language === 'TR' ? 'Konserler & Festivaller' : 'Concerts & Festivals' },
    { id: 'theater', name: language === 'TR' ? 'Tiyatro' : 'Theater', icon: Film, subtitle: language === 'TR' ? 'Oyunlar & Gösteriler' : 'Plays & Shows' },
    { id: 'sports', name: language === 'TR' ? 'Spor' : 'Sports', icon: Trophy, subtitle: language === 'TR' ? 'Maçlar & Turnuvalar' : 'Matches & Tournaments' },
    { id: 'art', name: language === 'TR' ? 'Sanat' : 'Art', icon: Palette, subtitle: language === 'TR' ? 'Sergiler & Atölyeler' : 'Exhibitions & Workshops' },
    { id: 'gastronomy', name: language === 'TR' ? 'Gastronomi' : 'Gastronomy', icon: ChefHat, subtitle: language === 'TR' ? 'Tatma & Atölyeler' : 'Tastings & Workshops' },
    { id: 'education', name: language === 'TR' ? 'Eğitim' : 'Education', icon: GraduationCap, subtitle: language === 'TR' ? 'Seminerler & Kurslar' : 'Seminars & Courses' }
  ]

  // Calculate dynamic counts for each category
  const categoriesWithCounts = categories.map(category => {
    const count = events.filter(event => event.category === category.id).length
    return {
      ...category,
      count: count,
      total: count > 0 ? `${count}+` : '0'
    }
  })

  // Cities
  const cities = ['Istanbul', 'Ankara', 'Izmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep']

  // Etkinlikleri yükle
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        // eventService.js kullanarak tüm eventleri yükle (Manuel + API)
        const allEvents = await EventService.getEvents()
        setEvents(allEvents)
      } catch (error) {
        console.error('❌ Etkinlik yükleme hatası:', error)
        setEvents([])
      } finally {
        setLoading(false)
      }
    }

    loadEvents()
  }, [])

  // Arama işlemi
  const handleSearch = () => {
    if (searchTerm.trim()) {
      const searchParams = new URLSearchParams()
      searchParams.set('q', searchTerm)
      if (selectedCategory) searchParams.set('category', selectedCategory)
      navigate(`/search?${searchParams.toString()}`)
    }
  }

  // Kategori filtreleme
  const handleCategoryFilter = (categoryId) => {
    setSelectedCategory(categoryId === selectedCategory ? '' : categoryId)
  }

  // Etkinlik detayına git
  const handleEventDetail = (eventId) => {
    navigate(`/event/${eventId}`)
  }

  // Dark mode toggle - no longer used
  const toggleDarkMode = () => {
    // Single theme
  }



  // Get logo
  const getLogo = () => {
    return logo // New logo
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

  // Filtrelenmiş ve sıralanmış etkinlikler
  const filteredEvents = events.filter(event => {
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
        return new Date(a.date) - new Date(b.date)
      case 'name':
        return a.title.localeCompare(b.title)
      case 'price':
        return (a.price_min || 0) - (b.price_min || 0)
      default:
        return 0
    }
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
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
          <p className="text-lg md:text-xl mb-8 text-text/70 px-2 sm:px-4">
            {language === 'TR' ? 'Akıllı arama ve gelişmiş filtrelerle hayalinizdeki etkinlikleri bulun.' : 'Find your dream events with smart search and advanced filters.'}
          </p>
          
          {/* Search Box */}
          <div className="max-w-xl sm:max-w-2xl mx-auto px-2 sm:px-4">
            <div className="flex flex-col sm:flex-row rounded-full shadow-lg p-1.5 sm:p-2 bg-white">
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
                className="bg-primary text-white px-3 sm:px-6 py-2.5 sm:py-3 rounded-full hover:bg-primary/90 transition-colors flex items-center justify-center space-x-1.5 sm:space-x-2 mt-1.5 sm:mt-0 whitespace-nowrap"
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
                    selectedCategory === category.id 
                      ? 'border-primary bg-primary/5' 
                      : 'border-primary/20 bg-white hover:border-primary/40'
                  }`}
                  onClick={() => handleCategoryFilter(category.id)}
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
      <section className="py-12 md:py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 md:mb-8 space-y-4 sm:space-y-0">
            <div>
              <h2 className="text-2xl md:text-3xl font-bold mb-2 text-text">{language === 'TR' ? 'Öne Çıkan Etkinlikler' : 'Featured Events'}</h2>
              <p className="text-text/70">{filteredEvents.length} {language === 'TR' ? 'etkinlik bulundu' : 'events found'}</p>
            </div>
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4 w-full sm:w-auto">
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
          
          {loading ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Clock className="text-text/50" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">{language === 'TR' ? 'Etkinlikler yükleniyor...' : 'Loading events...'}</h3>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className="rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow bg-white">
                  {/* Event Image */}
                  <div className="relative group">
                    <img
                      src={event.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-primary text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {event.platform}
                    </div>
                    <button 
                      onClick={() => setShowMap(true)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:shadow-md transition-all hover:bg-white"
                      title="Show on map"
                    >
                      <MapPin size={16} className="text-gray-700" />
                    </button>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors text-text">{event.title}</h3>
                    <p className="text-sm mb-4 line-clamp-2 text-text/70">{event.description}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-text/60">
                        <Calendar size={14} className="mr-2 text-primary" />
                        <span className="font-medium">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-text/60">
                        <MapPin size={14} className="mr-2 text-text-accent" />
                        <span className="font-medium">{event.venue}, {event.city}</span>
                      </div>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className="px-2 py-1 rounded text-xs bg-primary/10 text-primary">
                        {event.category}
                      </span>
                      {event.category === 'music' && (
                        <>
                          <span className="bg-text-accent/10 text-text-accent px-2 py-1 rounded text-xs">pop</span>
                          <span className="bg-primary-light/10 text-primary-light px-2 py-1 rounded text-xs">turkish</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEventDetail(event.id)}
                        className={`flex-1 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700'}`}
                      >
                        Details
                      </button>
                      <button
                        onClick={() => window.open(event.url, '_blank')}
                        className="flex-1 bg-primary text-white py-2 px-4 rounded-lg hover:bg-primary/90 transition-colors"
                      >
                        Buy Ticket
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Film className="text-text/50" size={48} />
              </div>
              <h3 className="text-xl font-semibold mb-2 text-text">No events found</h3>
              <p className="text-text/70">Try adjusting your search criteria.</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 gap-8 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center w-full sm:w-auto">
              <div className="flex items-center space-x-2">
                <img 
                  src={logo} 
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
                <h3 className="font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/about" className="hover:text-white transition-colors">About</a></li>
                </ul>
              </div>
            </div>
            
            {/* Blog Links - Right Section */}
            <div className="flex justify-center w-full sm:w-auto">
              <div className="text-center">
                <h3 className="font-semibold mb-4">Blog</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/world-news" className="hover:text-white transition-colors">World News</a></li>
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
              <h3 className="text-xl font-bold text-text">Event Locations</h3>
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
                <p className="text-text/70">Interactive map coming soon!</p>
                <p className="text-sm mt-1 text-text/60">We're working on integrating Google Maps</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {events.map(event => (
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
    </div>
  )
}

export default HomePage 