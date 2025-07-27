import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Phone, Globe as GlobeIcon, Share2, Heart, ExternalLink } from 'lucide-react'
import lightLogo from '../assets/eventhubble_light_transparent_logo.png'
import darkLogo from '../assets/eventhubble_dark_transparent_logo.png'

const EventDetailPage = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('EN')

  // Get appropriate logo based on theme
  const getLogo = () => {
    return isDarkMode ? darkLogo : lightLogo
  }

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Update page title based on language and event
  useEffect(() => {
    if (event) {
      const title = language === 'TR' 
        ? `EventHubble | ${event.title}`
        : `EventHubble | ${event.title}`
      document.title = title
    }
  }, [language, event])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'TR' ? 'EN' : 'TR')
  }

  const handleLogin = () => {
    console.log('Login clicked')
  }

  useEffect(() => {
    const loadEventDetail = async () => {
      setLoading(true)
      try {
        // Production'da mock data kullan, development'ta backend'e bağlan
        const isProduction = window.location.hostname !== 'localhost'
        
        if (isProduction) {
          // Mock data kullan - eventId'ye göre farklı etkinlikler
          const mockEvents = {
            '1': {
              id: '1',
              title: language === 'TR' ? 'Coachella 2024 Müzik Festivali' : 'Coachella 2024 Music Festival',
              description: language === 'TR' 
                ? 'Bu yılın en büyük müzik festivali. Dünyaca ünlü sanatçıların performansları, eşsiz deneyimler ve unutulmaz anlar sizi bekliyor.'
                : 'The biggest music festival of the year. World-famous artists, unique experiences and unforgettable moments await you.',
              category: language === 'TR' ? 'Müzik' : 'Music',
              date: '15-17 Nisan 2024',
              time: '12:00 - 23:00',
              venue: 'Empire Polo Club',
              city: 'Indio, California',
              image_url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800&h=600&fit=crop',
              price_min: '350',
              price_max: '1200',
              rating: '4.8',
              attendees: 125000,
              available_tickets: 5000,
              organizer: 'Goldenvoice',
              contact: '+1 (555) 123-4567',
              website: 'https://www.coachella.com',
              platform: 'Coachella',
              status: 'Active',
              scraped_at: '2024-03-15T10:30:00Z',
              url: 'https://www.coachella.com'
            },
            '2': {
              id: '2',
              title: language === 'TR' ? 'Tokyo Olimpiyat Oyunları 2024' : 'Tokyo Olympic Games 2024',
              description: language === 'TR'
                ? '2024 Tokyo Olimpiyat Oyunları. Dünyanın en iyi sporcularının katıldığı prestijli spor etkinliği.'
                : '2024 Tokyo Olympic Games. A prestigious sporting event featuring the world\'s best athletes.',
              category: language === 'TR' ? 'Spor' : 'Sports',
              date: '26 Temmuz - 11 Ağustos 2024',
              time: '09:00 - 22:00',
              venue: 'Tokyo Olympic Stadium',
              city: 'Tokyo, Japan',
              image_url: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop',
              price_min: '50',
              price_max: '500',
              rating: '4.9',
              attendees: 500000,
              available_tickets: 15000,
              organizer: 'Tokyo 2024 Organizing Committee',
              contact: '+81 3-1234-5678',
              website: 'https://tokyo2020.org',
              platform: 'Olympics',
              status: 'Active',
              scraped_at: '2024-03-14T15:45:00Z',
              url: 'https://tokyo2020.org'
            },
            '3': {
              id: '3',
              title: language === 'TR' ? 'Venedik Bienali 2024' : 'Venice Biennale 2024',
              description: language === 'TR'
                ? 'Dünyanın en prestijli sanat etkinliği. Çağdaş sanatın en iyi örneklerini görebileceğiniz uluslararası bienal.'
                : 'The world\'s most prestigious art event. International biennale showcasing the best of contemporary art.',
              category: language === 'TR' ? 'Sanat' : 'Art',
              date: '20 Nisan - 24 Kasım 2024',
              time: '10:00 - 18:00',
              venue: 'Giardini della Biennale',
              city: 'Venice, Italy',
              image_url: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=800&h=600&fit=crop',
              price_min: '25',
              price_max: '150',
              rating: '4.7',
              attendees: 75000,
              available_tickets: 8000,
              organizer: 'La Biennale di Venezia',
              contact: '+39 041 5218 828',
              website: 'https://www.labiennale.org',
              platform: 'Biennale',
              status: 'Active',
              scraped_at: '2024-03-13T12:20:00Z',
              url: 'https://www.labiennale.org'
            }
          }
          
          const foundEvent = mockEvents[eventId]
          if (foundEvent) {
            // Dil değişikliğinde event bilgilerini güncelle
            if (language === 'TR') {
              foundEvent.title = foundEvent.title.replace('Music Festival', 'Müzik Festivali')
                .replace('Olympic Games', 'Olimpiyat Oyunları')
                .replace('Venice Biennale', 'Venedik Bienali')
            } else {
              foundEvent.title = foundEvent.title.replace('Müzik Festivali', 'Music Festival')
                .replace('Olimpiyat Oyunları', 'Olympic Games')
                .replace('Venedik Bienali', 'Venice Biennale')
            }
            setEvent(foundEvent)
          } else {
            setEvent(null)
          }
        } else {
          // Development'ta backend'e bağlan
          const response = await fetch('http://localhost:3001/api/events')
          const data = await response.json()
          const foundEvent = data.events?.find(e => e.id === eventId)
          setEvent(foundEvent)
        }
      } catch (error) {
        console.error('❌ Etkinlik detay yükleme hatası:', error)
        setEvent(null)
      } finally {
        setLoading(false)
      }
    }

    loadEventDetail()
  }, [eventId, language])

  if (loading) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>⏳</div>
          <h3 className={`text-xl font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'TR' ? 'Etkinlik detayları yükleniyor...' : 'Loading event details...'}
          </h3>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900' : 'bg-gray-50'} flex items-center justify-center`}>
        <div className="text-center">
          <div className={`text-6xl mb-4 ${isDarkMode ? 'text-gray-400' : 'text-gray-400'}`}>❌</div>
          <h3 className={`text-xl font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'TR' ? 'Etkinlik bulunamadı' : 'Event not found'}
          </h3>
          <button
            onClick={() => navigate('/')}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            {language === 'TR' ? 'Ana Sayfaya Dön' : 'Go Back Home'}
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-50 text-gray-900'}`}>
      {/* Header */}
      <header className={`${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'} border-b`}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className={`p-2 rounded-lg ${isDarkMode ? 'text-gray-300 hover:text-white hover:bg-gray-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'} transition-colors`}
                title={language === 'TR' ? 'Ana Sayfaya Dön' : 'Back to Home'}
              >
                <ArrowLeft size={20} />
              </button>
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

      {/* Event Detail Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative mb-6">
              <img
                src={event.image_url}
                alt={event.title}
                className="w-full h-96 object-cover rounded-xl"
              />
              <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded text-sm font-medium">
                {event.platform}
              </div>
              <div className="absolute top-4 right-4 bg-yellow-400 text-white px-3 py-1 rounded text-sm font-medium">
                ⭐ {event.rating}
              </div>
            </div>

            {/* Event Title and Description */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 mb-6`}>
              <h1 className={`text-3xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>{event.title}</h1>
              <p className={`text-lg leading-relaxed mb-6 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>{event.description}</p>
              
              {/* Category Tags */}
              <div className="flex flex-wrap gap-2 mb-6">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                  {event.category}
                </span>
                {event.category === (language === 'TR' ? 'Müzik' : 'Music') && (
                  <>
                    <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-purple-600 text-white' : 'bg-purple-100 text-purple-800'}`}>pop</span>
                    <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-green-600 text-white' : 'bg-green-100 text-green-800'}`}>
                      {language === 'TR' ? 'türkçe' : 'turkish'}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-sm ${isDarkMode ? 'bg-orange-600 text-white' : 'bg-orange-100 text-orange-800'}`}>
                      {language === 'TR' ? 'klasik' : 'classical'}
                    </span>
                  </>
                )}
              </div>

              {/* Event Details Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Calendar className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Tarih & Saat' : 'Date & Time'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{event.date} • {event.time}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <MapPin className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Mekan' : 'Venue'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{event.venue}</p>
                      <p className={isDarkMode ? 'text-gray-400' : 'text-gray-500'}>{event.city}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <Users className={`mr-3 ${isDarkMode ? 'text-blue-400' : 'text-blue-600'}`} size={24} />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Katılımcılar' : 'Attendees'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {event.attendees?.toLocaleString()} {language === 'TR' ? 'kişi katılıyor' : 'people attending'}
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center">
                    <Star className={`mr-3 ${isDarkMode ? 'text-yellow-400' : 'text-yellow-500'}`} size={24} />
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Puan' : 'Rating'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{event.rating} / 5.0</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🎫</span>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Kalan Biletler' : 'Available Tickets'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                        {event.available_tickets?.toLocaleString()} {language === 'TR' ? 'bilet kaldı' : 'tickets left'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center">
                    <span className="text-2xl mr-3">🏢</span>
                    <div>
                      <p className={`font-semibold ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                        {language === 'TR' ? 'Organizatör' : 'Organizer'}
                      </p>
                      <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>{event.organizer}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
              <h2 className={`text-2xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'TR' ? 'Ek Bilgiler' : 'Additional Information'}
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'TR' ? 'İletişim Bilgileri' : 'Contact Information'}
                  </h3>
                  <div className="space-y-2">
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <Phone size={16} className="mr-2" />
                      {event.contact}
                    </p>
                    <p className={`flex items-center ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                      <GlobeIcon size={16} className="mr-2" />
                      <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {event.website}
                      </a>
                    </p>
                  </div>
                </div>
                
                <div>
                  <h3 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                    {language === 'TR' ? 'Etkinlik Detayları' : 'Event Details'}
                  </h3>
                  <div className="space-y-2">
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      🆔 {language === 'TR' ? 'Etkinlik ID' : 'Event ID'}: {event.id}
                    </p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      📊 {language === 'TR' ? 'Durum' : 'Status'}: 
                      <span className="text-green-600 font-medium ml-1">{event.status}</span>
                    </p>
                    <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>
                      🕒 {language === 'TR' ? 'Güncellendi' : 'Scraped'}: {new Date(event.scraped_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            {/* Price Card */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6 mb-6 sticky top-6`}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'TR' ? 'Bilet Bilgileri' : 'Ticket Information'}
              </h3>
              
              {event.price_min && event.price_max ? (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {event.price_min}₺ - {event.price_max}₺
                  </div>
                  <p className={`text-sm ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'TR' ? 'Bilet başına fiyat aralığı' : 'Price range per ticket'}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className={`text-xl font-semibold ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                    {language === 'TR' ? 'Fiyat mevcut değil' : 'Price not available'}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={() => window.open(event.url, '_blank')}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {language === 'TR' ? 'Bilet Al' : 'Buy Ticket Now'}
                </button>
                
                <button className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Share2 size={16} className="mr-2" />
                  {language === 'TR' ? 'Etkinliği Paylaş' : 'Share Event'}
                </button>
                
                <button className={`w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center ${isDarkMode ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}>
                  <Heart size={16} className="mr-2" />
                  {language === 'TR' ? 'Favorilere Ekle' : 'Add to Favorites'}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className={`font-semibold mb-2 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {language === 'TR' ? 'Hızlı Bilgi' : 'Quick Info'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>📅 {language === 'TR' ? 'Tarih' : 'Date'}: {event.date}</p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>🕐 {language === 'TR' ? 'Saat' : 'Time'}: {event.time}</p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>📍 {language === 'TR' ? 'Konum' : 'Location'}: {event.city}</p>
                  <p className={isDarkMode ? 'text-gray-300' : 'text-gray-600'}>🎭 {language === 'TR' ? 'Kategori' : 'Category'}: {event.category}</p>
                </div>
              </div>
            </div>

            {/* Similar Events */}
            <div className={`${isDarkMode ? 'bg-gray-800' : 'bg-white'} rounded-xl p-6`}>
              <h3 className={`text-xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                {language === 'TR' ? 'Benzer Etkinlikler' : 'Similar Events'}
              </h3>
              <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                {language === 'TR' ? 'Beğenebileceğiniz diğer etkinlikler' : 'Other events you might like'}
              </p>
              
              <div className="space-y-4">
                <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <img
                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop"
                    alt="Similar Event"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'TR' ? 'Benzer Etkinlik Başlığı' : 'Similar Event Title'}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'TR' ? 'Tarih • Konum' : 'Date • Location'}
                    </p>
                  </div>
                </div>
                
                <div className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer ${isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50'}`}>
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Similar Event"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className={`font-semibold text-sm ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                      {language === 'TR' ? 'Başka Benzer Etkinlik' : 'Another Similar Event'}
                    </h4>
                    <p className={`text-xs ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                      {language === 'TR' ? 'Tarih • Konum' : 'Date • Location'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
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
    </div>
  )
}

export default EventDetailPage 