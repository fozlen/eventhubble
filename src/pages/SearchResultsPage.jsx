import React, { useState, useEffect } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Filter, ChevronDown, Map, ExternalLink } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const SearchResultsPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [events, setEvents] = useState([])
  const [filteredEvents, setFilteredEvents] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const [sortBy, setSortBy] = useState('date') // 'date', 'name', 'price'
  const [showMap, setShowMap] = useState(false)

  // Get search parameters
  const searchTerm = searchParams.get('q') || ''
  const category = searchParams.get('category') || ''
  const dateRange = searchParams.get('dateRange') || ''

  // Get logo
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? `EventHubble | "${searchTerm}" Arama Sonuçları`
      : `EventHubble | Search Results for "${searchTerm}"`
    document.title = title
  }, [language, searchTerm])

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode))
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleLogin = () => {
    console.log('Login clicked')
  }

  // Load events and filter based on search criteria
  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true)
      try {
        // Production'da mock data kullan, development'ta backend'e bağlan
        const isProduction = window.location.hostname !== 'localhost'
        
        if (isProduction) {
          // Mock data - genişletilmiş etkinlik listesi
          const mockEvents = [
            {
              id: '1',
              title: language === 'TR' ? 'Coachella 2024 Müzik Festivali' : 'Coachella 2024 Music Festival',
              description: language === 'TR' 
                ? 'Bu yılın en büyük müzik festivali. Dünyaca ünlü sanatçıların performansları.'
                : 'The biggest music festival of the year. World-famous artists performances.',
              category: language === 'TR' ? 'Müzik' : 'Music',
              date: '2024-04-15',
              time: '12:00 - 23:00',
              venue: 'Empire Polo Club',
              city: 'Indio, California',
              image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
              price_min: '350',
              price_max: '1200',
              rating: '4.8',
              attendees: 125000,
              available_tickets: 5000,
              organizer: 'Goldenvoice',
              platform: 'Coachella',
              url: 'https://www.coachella.com'
            },
            {
              id: '2',
              title: language === 'TR' ? 'Tokyo Olimpiyat Oyunları 2024' : 'Tokyo Olympic Games 2024',
              description: language === 'TR'
                ? '2024 Tokyo Olimpiyat Oyunları. Dünyanın en iyi sporcularının katıldığı prestijli spor etkinliği.'
                : '2024 Tokyo Olympic Games. A prestigious sporting event featuring the world\'s best athletes.',
              category: language === 'TR' ? 'Spor' : 'Sports',
              date: '2024-07-26',
              time: '09:00 - 22:00',
              venue: 'Tokyo Olympic Stadium',
              city: 'Tokyo, Japan',
              image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
              price_min: '50',
              price_max: '500',
              rating: '4.9',
              attendees: 500000,
              available_tickets: 15000,
              organizer: 'Tokyo 2024 Organizing Committee',
              platform: 'Olympics',
              url: 'https://tokyo2020.org'
            },
            {
              id: '3',
              title: language === 'TR' ? 'Venedik Bienali 2024' : 'Venice Biennale 2024',
              description: language === 'TR'
                ? 'Dünyanın en prestijli sanat etkinliği. Çağdaş sanatın en iyi örneklerini görebileceğiniz uluslararası bienal.'
                : 'The world\'s most prestigious art event. International biennale showcasing the best of contemporary art.',
              category: language === 'TR' ? 'Sanat' : 'Art',
              date: '2024-04-20',
              time: '10:00 - 18:00',
              venue: 'Giardini della Biennale',
              city: 'Venice, Italy',
              image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
              price_min: '25',
              price_max: '150',
              rating: '4.7',
              attendees: 75000,
              available_tickets: 8000,
              organizer: 'La Biennale di Venezia',
              platform: 'Biennale',
              url: 'https://www.labiennale.org'
            },
            {
              id: '4',
              title: language === 'TR' ? 'SXSW Festivali Teknoloji Trendleri' : 'SXSW Festival Technology Trends',
              description: language === 'TR' 
                ? 'Austin\'deki festivalde öne çıkan teknoloji ve inovasyon trendleri.'
                : 'Highlighted technology and innovation trends at the Austin festival.',
              category: language === 'TR' ? 'Teknoloji' : 'Technology',
              date: '2024-03-08',
              time: '09:00 - 18:00',
              venue: 'Austin Convention Center',
              city: 'Austin, Texas',
              image_url: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
              price_min: '150',
              price_max: '800',
              rating: '4.6',
              attendees: 45000,
              available_tickets: 3000,
              organizer: 'SXSW LLC',
              platform: 'SXSW',
              url: 'https://www.sxsw.com'
            },
            {
              id: '5',
              title: language === 'TR' ? 'Cannes Film Festivali Jüri Üyeleri' : 'Cannes Film Festival Jury Members',
              description: language === 'TR' 
                ? 'Bu yılın Cannes Film Festivali jüri üyeleri açıklandı.'
                : 'This year\'s Cannes Film Festival jury members have been announced.',
              category: language === 'TR' ? 'Film' : 'Film',
              date: '2024-05-14',
              time: '19:00 - 23:00',
              venue: 'Palais des Festivals',
              city: 'Cannes, France',
              image_url: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
              price_min: '200',
              price_max: '1000',
              rating: '4.9',
              attendees: 35000,
              available_tickets: 2000,
              organizer: 'Festival de Cannes',
              platform: 'Cannes',
              url: 'https://www.festival-cannes.com'
            },
            {
              id: '6',
              title: language === 'TR' ? 'FIFA Dünya Kupası 2026 Hazırlıkları' : 'FIFA World Cup 2026 Preparations',
              description: language === 'TR' 
                ? '2026 FIFA Dünya Kupası için ev sahibi ülkelerde hazırlıklar başladı.'
                : 'Preparations have begun in host countries for the 2026 FIFA World Cup.',
              category: language === 'TR' ? 'Spor' : 'Sports',
              date: '2026-06-15',
              time: '14:00 - 22:00',
              venue: 'Multiple Stadiums',
              city: 'North America',
              image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
              price_min: '100',
              price_max: '2000',
              rating: '4.8',
              attendees: 3000000,
              available_tickets: 50000,
              organizer: 'FIFA',
              platform: 'FIFA',
              url: 'https://www.fifa.com'
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
      if (dateRange) {
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
          return new Date(a.date) - new Date(b.date)
        case 'name':
          return a.title.localeCompare(b.title)
        case 'price':
          return (parseInt(a.price_min) || 0) - (parseInt(b.price_min) || 0)
        case 'rating':
          return parseFloat(b.rating) - parseFloat(a.rating)
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
      case 'rating':
        return language === 'TR' ? 'Puana Göre' : 'By Rating'
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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-4 hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src={getLogo()} 
                  alt="EventHubble" 
                  className="h-10 w-auto" 
                />
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light">Hubble</span>
                </span>
              </button>
            </div>
            
            {/* Navigation Menu */}
            <nav className="hidden md:flex items-center space-x-8">
              <a
                href="/"
                className="text-sm font-medium transition-colors text-white hover:text-primary-light"
              >
                {language === 'TR' ? 'Ana Sayfa' : 'Home'}
              </a>
              <a
                href="/about"
                className="text-sm font-medium transition-colors text-white/80 hover:text-white"
              >
                {language === 'TR' ? 'Hakkımızda' : 'About'}
              </a>
              <a
                href="/world-news"
                className="text-sm font-medium transition-colors text-white/80 hover:text-white"
              >
                {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
              </a>
            </nav>
            
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
        <div className="flex items-center justify-between mb-8">
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
                  const newSort = sortBy === 'date' ? 'name' : sortBy === 'name' ? 'price' : sortBy === 'price' ? 'rating' : 'date'
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
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
                            {event.city}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <Users className="mr-2 text-primary" size={16} />
                        <div>
                          <p className="text-xs font-medium text-text/70">
                            {language === 'TR' ? 'Katılımcı' : 'Attendees'}
                          </p>
                          <p className="text-sm text-text">
                            {event.attendees?.toLocaleString() || 'N/A'}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Price and Actions */}
                    <div className="flex items-center justify-between">
                      <div>
                        {event.price_min && event.price_max ? (
                          <div className={`text-lg font-bold ${isDarkMode ? 'text-green-400' : 'text-green-600'}`}>
                            {event.price_min}₺ - {event.price_max}₺
                          </div>
                        ) : (
                          <div className={`text-lg font-semibold ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            {language === 'TR' ? 'Fiyat belirtilmemiş' : 'Price not specified'}
                          </div>
                        )}
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => handleEventDetail(event.id)}
                          className={`px-4 py-2 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
                        >
                          {language === 'TR' ? 'Detaylar' : 'Details'}
                        </button>
                        
                        <button
                          onClick={() => handleBuyTicket(event)}
                          className="px-4 py-2 bg-primary text-white rounded-lg font-medium hover:bg-primary/90 transition-colors flex items-center"
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
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2">
                <img 
                  src={logo} 
                  alt="EventHubble" 
                  className="h-10 w-auto" 
                />
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light">Hubble</span>
                </span>
              </div>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">{language === 'TR' ? 'Şirket' : 'Company'}</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="/about" className="hover:text-white transition-colors">{language === 'TR' ? 'Hakkımızda' : 'About'}</a></li>
              </ul>
            </div>
            
            <div>
              <h3 className="font-semibold mb-4">Blog</h3>
              <ul className="space-y-2 text-white/80">
                <li><a href="/world-news" className="hover:text-white transition-colors">{language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}</a></li>
              </ul>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default SearchResultsPage 