import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import lightLogo from '../assets/eventhubble_light_transparent_logo.png'
import darkLogo from '../assets/eventhubble_dark_transparent_logo.png'
import { 
  Search, 
  Calendar, 
  MapPin, 
  Filter, 
  Sun, 
  Moon,
  Globe, 
  User, 
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
import { 
  DateRangePicker, 
  CountryCitySelector, 
  AdvancedFilters 
} from '../components/ModernDropdowns'

const HomePage = () => {
  const [events, setEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [selectedDates, setSelectedDates] = useState({ startDate: null, endDate: null })
  const [selectedCountry, setSelectedCountry] = useState('')
  const [selectedCities, setSelectedCities] = useState([])
  const [advancedFilters, setAdvancedFilters] = useState({})
  const [showAdvancedFilter, setShowAdvancedFilter] = useState(false)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('EN')
  const [showMap, setShowMap] = useState(false)
  const navigate = useNavigate()

  // Click outside handler for advanced filters
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest('.advanced-filter')) {
        setShowAdvancedFilter(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? 'EventHubble | Dünyanın En Muhteşem Etkinliklerini Keşfet'
      : 'EventHubble | Discover Amazing Events Worldwide'
    document.title = title
  }, [language])

  // Kategoriler - modern iconlarla
  const categories = [
    { id: 'music', name: language === 'TR' ? 'Müzik' : 'Music', icon: Music, subtitle: language === 'TR' ? 'Konserler & Festivaller' : 'Concerts & Festivals', count: 3, total: '2.5K+' },
    { id: 'theater', name: language === 'TR' ? 'Tiyatro' : 'Theater', icon: Film, subtitle: language === 'TR' ? 'Oyunlar & Gösteriler' : 'Plays & Shows', count: 1, total: '1.2K+' },
    { id: 'sports', name: language === 'TR' ? 'Spor' : 'Sports', icon: Trophy, subtitle: language === 'TR' ? 'Maçlar & Turnuvalar' : 'Matches & Tournaments', count: 1, total: '3.8K+' },
    { id: 'art', name: language === 'TR' ? 'Sanat' : 'Art', icon: Palette, subtitle: language === 'TR' ? 'Sergiler & Atölyeler' : 'Exhibitions & Workshops', count: 1, total: '1.8K+' },
    { id: 'gastronomy', name: language === 'TR' ? 'Gastronomi' : 'Gastronomy', icon: ChefHat, subtitle: language === 'TR' ? 'Tatma & Atölyeler' : 'Tastings & Workshops', count: 1, total: '950+' },
    { id: 'education', name: language === 'TR' ? 'Eğitim' : 'Education', icon: GraduationCap, subtitle: language === 'TR' ? 'Seminerler & Kurslar' : 'Seminars & Courses', count: 1, total: '720+' }
  ]

  // Şehirler
  const cities = ['İstanbul', 'Ankara', 'İzmir', 'Bursa', 'Antalya', 'Adana', 'Konya', 'Gaziantep']

  // Etkinlikleri yükle
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        // Production'da mock data kullan, development'ta backend'e bağlan
        const isProduction = window.location.hostname !== 'localhost'
        
        if (isProduction) {
          // Mock data kullan
          const mockEvents = [
            {
              id: 1,
              title: language === 'TR' ? "Rock Festival 2024" : "Rock Festival 2024",
              description: language === 'TR' ? "Yılın en büyük rock festivali" : "The biggest rock festival of the year",
              date: language === 'TR' ? "15 Haziran 2024" : "June 15, 2024",
              time: "19:00",
              venue: language === 'TR' ? "Küçükçiftlik Park" : "Kucukciftlik Park",
              city: language === 'TR' ? "İstanbul" : "Istanbul",
              image_url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
              platform: "Biletix",
              attendees: 15000,
              category: language === 'TR' ? "müzik" : "music",
              url: "https://biletix.com"
            },
            {
              id: 2,
              title: language === 'TR' ? "Jazz Gecesi" : "Jazz Night",
              description: language === 'TR' ? "Eşsiz jazz performansları" : "Unique jazz performances",
              date: language === 'TR' ? "20 Haziran 2024" : "June 20, 2024",
              time: "20:30",
              venue: "Babylon",
              city: language === 'TR' ? "İstanbul" : "Istanbul",
              image_url: "https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=300&fit=crop",
              platform: "Bubilet",
              attendees: 800,
              category: language === 'TR' ? "müzik" : "music",
              url: "https://bubilet.com.tr"
            },
            {
              id: 3,
              title: language === 'TR' ? "Tiyatro Oyunu" : "Theater Play",
              description: language === 'TR' ? "Klasik tiyatro eseri" : "Classic theater piece",
              date: language === 'TR' ? "25 Haziran 2024" : "June 25, 2024",
              time: "20:00",
              venue: language === 'TR' ? "İstanbul Devlet Tiyatrosu" : "Istanbul State Theater",
              city: language === 'TR' ? "İstanbul" : "Istanbul",
              image_url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop",
              platform: "Passo",
              attendees: 1200,
              category: language === 'TR' ? "tiyatro" : "theater",
              url: "https://passo.com.tr"
            }
          ]
          setEvents(mockEvents)
        } else {
          // Development'ta backend'e bağlan
          const response = await fetch('http://localhost:3001/api/events')
          const data = await response.json()
          setEvents(data.events || [])
        }
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
      if (selectedDates.startDate) searchParams.set('dateRange', 'custom')
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

  // Dark mode toggle
  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  // Dil değiştirme
  const toggleLanguage = () => {
    setLanguage(language === 'EN' ? 'TR' : 'EN')
  }

  // Login işlemi
  const handleLogin = () => {
    console.log('Login clicked')
    // Login modal veya sayfası açılacak
  }

  // Get appropriate logo based on theme
  const getLogo = () => {
    return isDarkMode ? darkLogo : lightLogo
  }

  // Filtrelenmiş etkinlikler
  const filteredEvents = events.filter(event => {
    if (selectedCategory && event.category !== selectedCategory) return false
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase()
      return event.title?.toLowerCase().includes(searchLower) ||
             event.description?.toLowerCase().includes(searchLower) ||
             event.venue?.toLowerCase().includes(searchLower)
    }
    return true
  })

  return (
    <div className={`min-h-screen ${isDarkMode ? 'dark bg-gray-900' : 'bg-gray-50'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200"
              >
                <img src={getLogo()} alt="EventHubble" className="h-10 w-auto" />
                <span className="text-xl font-bold">
                  <span className={isDarkMode ? 'text-white' : 'text-black'}>Event</span>
                  <span className="text-blue-600">Hubble</span>
                </span>
              </button>
            </div>
            
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleDarkMode}
                className={`p-2 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-400 hover:text-gray-600'} transition-colors`}
                title="Toggle dark mode"
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
              <button 
                onClick={toggleLanguage}
                className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                title="Change language"
              >
                <Globe size={16} />
                <span>{language}</span>
              </button>
              <button 
                onClick={handleLogin}
                className={`flex items-center space-x-1 ${isDarkMode ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'} transition-colors`}
                title="Login"
              >
                <User size={16} />
                <span>{language === 'TR' ? 'Giriş' : 'Login'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Search */}
      <section className={`bg-gradient-to-br ${isDarkMode ? 'from-gray-800 to-gray-900' : 'from-blue-50 to-indigo-100'} py-20`}>
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h1 className={`text-5xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'TR' ? 'Dünyanın En İyi' : 'Discover the Best'} <span className="text-blue-600">{language === 'TR' ? 'Etkinliklerini' : 'Events Worldwide'}</span>
          </h1>
          <p className={`text-xl mb-8 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'TR' ? 'Akıllı arama ve gelişmiş filtrelerle hayalinizdeki etkinlikleri bulun.' : 'Find your dream events with smart search and advanced filters.'}
          </p>
          
          {/* Search Box */}
          <div className="max-w-2xl mx-auto">
            <div className={`flex rounded-full shadow-lg p-2 ${isDarkMode ? 'bg-gray-700' : 'bg-white'}`}>
              <div className="flex-1 flex items-center px-4">
                <Search className={`mr-3 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`} size={20} />
                <input
                  type="text"
                  placeholder={language === 'TR' ? 'Hangi etkinliği arıyorsunuz?' : 'What event are you looking for?'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={`flex-1 outline-none ${isDarkMode ? 'bg-gray-700 text-white placeholder-gray-400' : 'text-gray-700'}`}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <button
                onClick={handleSearch}
                className="bg-blue-600 text-white px-6 py-3 rounded-full hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Search size={16} />
                <span>{language === 'TR' ? 'Ara' : 'Search'}</span>
              </button>
            </div>
          </div>

          {/* Filter Options */}
          <div className="flex justify-center space-x-4 mt-6">
            <DateRangePicker
              selectedDates={selectedDates}
              onChange={setSelectedDates}
              placeholder={language === 'TR' ? 'Tüm Tarihler' : 'All Dates'}
              icon={Calendar}
              className={isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-700 hover:shadow-md border-gray-200'}
            />
            
            <CountryCitySelector
              selectedCountry={selectedCountry}
              selectedCities={selectedCities}
              onCountryChange={setSelectedCountry}
              onCitiesChange={setSelectedCities}
              placeholder={language === 'TR' ? 'Tüm Şehirler' : 'All Cities'}
              icon={MapPin}
              className={isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-700 hover:shadow-md border-gray-200'}
            />
            
            <AdvancedFilters
              filters={advancedFilters}
              onFiltersChange={setAdvancedFilters}
              isOpen={showAdvancedFilter}
              onToggle={() => setShowAdvancedFilter(!showAdvancedFilter)}
              className={isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600 border-gray-600' : 'bg-white text-gray-700 hover:shadow-md border-gray-200'}
            />
          </div>


        </div>
      </section>

      {/* Popular Categories */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'TR' ? 'Popüler Kategoriler' : 'Popular Categories'}</h2>
            <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{language === 'TR' ? 'İlgi alanlarınıza göre etkinlikleri keşfedin' : 'Discover events by your interests'}</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
            {categories.map((category) => {
              const IconComponent = category.icon
              return (
                <div
                  key={category.id}
                  className={`text-center p-6 rounded-xl border-2 cursor-pointer transition-all hover:shadow-lg hover:scale-105 ${
                    selectedCategory === category.id 
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' 
                      : isDarkMode 
                        ? 'border-gray-600 bg-gray-700 hover:border-gray-500' 
                        : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => handleCategoryFilter(category.id)}
                >
                  <div className="flex justify-center mb-3">
                    <IconComponent size={32} className="text-blue-600" />
                  </div>
                  <h3 className={`font-bold mb-1 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{category.name}</h3>
                  <p className={`text-sm mb-3 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{category.subtitle}</p>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                    {category.count} {language === 'TR' ? 'etkinlik' : 'events'}
                  </button>
                  <p className={`text-xs mt-2 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{category.total} {language === 'TR' ? 'toplam' : 'total'}</p>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Featured Events */}
      <section className={`py-16 ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className={`text-3xl font-bold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'TR' ? 'Öne Çıkan Etkinlikler' : 'Featured Events'}</h2>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{filteredEvents.length} {language === 'TR' ? 'etkinlik bulundu' : 'events found'}</p>
            </div>
            <div className="flex space-x-4">
              <button className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white hover:shadow-md'}`}>
                <Calendar size={16} />
                <span>{language === 'TR' ? 'Tarihe Göre' : 'By Date'}</span>
                <ChevronDown size={14} />
              </button>
              <button 
                onClick={() => setShowMap(!showMap)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg shadow-sm hover:shadow-md transition-shadow ${isDarkMode ? 'bg-gray-700 text-white hover:bg-gray-600' : 'bg-white hover:shadow-md'}`}
              >
                <Map size={16} />
                <span>{showMap ? (language === 'TR' ? 'Haritayı Gizle' : 'Hide Map') : (language === 'TR' ? 'Haritada Göster' : 'Show on Map')}</span>
              </button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Clock className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={48} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'TR' ? 'Etkinlikler yükleniyor...' : 'Loading events...'}</h3>
            </div>
          ) : filteredEvents.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredEvents.map((event) => (
                <div key={event.id} className={`rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-shadow ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  {/* Event Image */}
                  <div className="relative group">
                    <img
                      src={event.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'}
                      alt={event.title}
                      className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-blue-500 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
                      {event.platform}
                    </div>
                    <button 
                      onClick={() => setShowMap(true)}
                      className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-sm hover:shadow-md transition-all hover:bg-white"
                      title={language === 'TR' ? 'Haritada göster' : 'Show on map'}
                    >
                      <MapPin size={16} className="text-gray-700" />
                    </button>
                  </div>

                  {/* Event Content */}
                  <div className="p-6">
                    <h3 className={`text-xl font-bold mb-2 group-hover:text-blue-600 transition-colors ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h3>
                    <p className={`text-sm mb-4 line-clamp-2 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>
                    
                    {/* Event Details */}
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center text-sm text-gray-500">
                        <Calendar size={14} className="mr-2 text-blue-500" />
                        <span className="font-medium">{event.date} • {event.time}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <MapPin size={14} className="mr-2 text-red-500" />
                        <span className="font-medium">{event.venue}, {event.city}</span>
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users size={14} className="mr-2 text-green-500" />
                        <span className="font-medium">{event.attendees?.toLocaleString()} {language === 'TR' ? 'katılımcı' : 'attending'}</span>
                      </div>
                    </div>

                    {/* Category Tags */}
                    <div className="flex flex-wrap gap-2 mb-4">
                      <span className={`px-2 py-1 rounded text-xs ${isDarkMode ? 'bg-gray-700 text-gray-300' : 'bg-gray-100 text-gray-800'}`}>
                        {event.category}
                      </span>
                      {event.category === 'müzik' && (
                        <>
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs">pop</span>
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">türkçe</span>
                        </>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-3">
                      <button
                        onClick={() => handleEventDetail(event.id)}
                        className={`flex-1 py-2 px-4 rounded-lg hover:bg-gray-200 transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700'}`}
                      >
                        {language === 'TR' ? 'Detaylar' : 'Details'}
                      </button>
                      <button
                        onClick={() => window.open(event.url, '_blank')}
                        className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        {language === 'TR' ? 'Bilet Al' : 'Buy Ticket'}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Film className={isDarkMode ? 'text-gray-400' : 'text-gray-400'} size={48} />
              </div>
              <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'TR' ? 'Etkinlik bulunamadı' : 'No events found'}</h3>
              <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{language === 'TR' ? 'Arama kriterlerinizi ayarlamayı deneyin.' : 'Try adjusting your search criteria.'}</p>
            </div>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                              <div className="flex items-center space-x-2">
                  <img src={darkLogo} alt="EventHubble" className="h-10 w-auto" />
                  <span className="text-xl font-bold">
                    <span className="text-white">Event</span>
                    <span className="text-blue-600">Hubble</span>
                  </span>
                </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{language === 'TR' ? 'Şirket' : 'Company'}</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="/about" className="hover:text-white transition-colors">{language === 'TR' ? 'Hakkımızda' : 'About'}</a></li>
              </ul>
            </div>
            
                          <div>
                <h3 className="font-semibold mb-4">Blog</h3>
                              <ul className="space-y-2 text-gray-400">
                <li><a href="/world-news" className="hover:text-white transition-colors">{language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}</a></li>
              </ul>
              </div>
          </div>
        </div>
      </footer>

      {/* Map Modal */}
      {showMap && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className={`rounded-xl p-6 max-w-2xl w-full mx-4 ${isDarkMode ? 'bg-gray-800' : 'bg-white'}`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-xl font-bold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{language === 'TR' ? 'Etkinlik Konumları' : 'Event Locations'}</h3>
              <button 
                onClick={() => setShowMap(false)}
                className={`${isDarkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'}`}
              >
                ✕
              </button>
            </div>
            <div className={`rounded-lg p-4 h-64 flex items-center justify-center ${isDarkMode ? 'bg-gray-700' : 'bg-gray-100'}`}>
              <div className="text-center">
                <Map size={48} className="text-gray-400 mx-auto mb-2" />
                <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{language === 'TR' ? 'İnteraktif harita yakında!' : 'Interactive map coming soon!'}</p>
                <p className={`text-sm mt-1 ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{language === 'TR' ? 'Google Maps entegrasyonu üzerinde çalışıyoruz' : 'We\'re working on integrating Google Maps'}</p>
              </div>
            </div>
            <div className="mt-4 space-y-2">
              {events.map(event => (
                <div key={event.id} className={`flex items-center space-x-3 p-2 hover:bg-gray-50 rounded ${isDarkMode ? 'hover:bg-gray-700' : ''}`}>
                  <MapPin size={16} className="text-red-500" />
                  <div>
                    <p className={`font-medium ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</p>
                    <p className={`text-sm ${isDarkMode ? 'text-gray-400' : 'text-gray-500'}`}>{event.venue}, {event.city}</p>
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