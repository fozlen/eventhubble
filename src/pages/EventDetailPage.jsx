import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Phone, Globe as GlobeIcon, Share2, Heart, ExternalLink } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const EventDetailPage = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [event, setEvent] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })

  // Get logo
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language and event
  useEffect(() => {
    if (event) {
      const title = language === 'TR' 
        ? `Event Hubble | ${event.title}`
        : `Event Hubble | ${event.title}`
      document.title = title
    }
  }, [language, event])

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

  // Share event functionality
  const handleShareEvent = async () => {
    const eventUrl = window.location.href
    const eventTitle = event.title
    const shareText = language === 'TR' 
      ? `${eventTitle} etkinliğini EventHubble'da keşfedin!`
      : `Discover ${eventTitle} event on EventHubble!`
    
    try {
      if (navigator.share) {
        // Native sharing on mobile devices
        await navigator.share({
          title: eventTitle,
          text: shareText,
          url: eventUrl
        })
      } else {
        // Fallback: copy to clipboard
        const shareData = `${shareText}\n\n${eventUrl}`
        await navigator.clipboard.writeText(shareData)
        
        // Show success message
        alert(language === 'TR' 
          ? 'Etkinlik linki panoya kopyalandı!'
          : 'Event link copied to clipboard!'
        )
      }
    } catch (error) {
      console.error('Share failed:', error)
      // Fallback to clipboard
      try {
        await navigator.clipboard.writeText(eventUrl)
        alert(language === 'TR' 
          ? 'Etkinlik linki panoya kopyalandı!'
          : 'Event link copied to clipboard!'
        )
      } catch (clipboardError) {
        console.error('Clipboard failed:', clipboardError)
        alert(language === 'TR' 
          ? 'Paylaşım başarısız oldu. Lütfen linki manuel olarak kopyalayın.'
          : 'Sharing failed. Please copy the link manually.'
        )
      }
    }
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
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">⏳</div>
          <h3 className="text-xl font-semibold text-text">
            {language === 'TR' ? 'Etkinlik detayları yükleniyor...' : 'Loading event details...'}
          </h3>
        </div>
      </div>
    )
  }

  if (!event) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">❌</div>
          <h3 className="text-xl font-semibold mb-2 text-text">
            {language === 'TR' ? 'Etkinlik bulunamadı' : 'Event not found'}
          </h3>
          <button
            onClick={() => navigate('/')}
            className="bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors"
          >
            {language === 'TR' ? 'Ana Sayfaya Dön' : 'Go Back Home'}
          </button>
        </div>
      </div>
    )
  }

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
            <div className="bg-white rounded-xl p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 text-text">{event.title}</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Calendar className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.date}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Clock className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.time}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.location}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Users className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.organizer}</span>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Star className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.category}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="h-5 w-5 text-primary" />
                    <span className="text-text">{event.phone}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <GlobeIcon className="h-5 w-5 text-primary" />
                    <a href={event.website} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary/80 transition-colors">
                      {language === 'TR' ? 'Web Sitesi' : 'Website'}
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Similar Events */}
            <div className="bg-white rounded-xl p-6">
              <h2 className="text-2xl font-bold mb-4 text-text">
                {language === 'TR' ? 'Benzer Etkinlikler' : 'Similar Events'}
              </h2>
              <p className="text-sm mb-4 text-text/70">
                {language === 'TR' ? 'Beğenebileceğiniz diğer etkinlikler' : 'Other events you might like'}
              </p>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                  <img
                    src="https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=100&h=100&fit=crop"
                    alt="Similar Event"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-text">
                      {language === 'TR' ? 'Benzer Etkinlik Başlığı' : 'Similar Event Title'}
                    </h4>
                    <p className="text-xs text-text/70">
                      {language === 'TR' ? 'Tarih • Konum' : 'Date • Location'}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-3 p-3 rounded-lg cursor-pointer hover:bg-gray-50">
                  <img
                    src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop"
                    alt="Similar Event"
                    className="w-16 h-16 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h4 className="font-semibold text-sm text-text">
                      {language === 'TR' ? 'Başka Benzer Etkinlik' : 'Another Similar Event'}
                    </h4>
                    <p className="text-xs text-text/70">
                      {language === 'TR' ? 'Tarih • Konum' : 'Date • Location'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8">
              {/* Price Card */}
              <div className="bg-white rounded-xl p-6 mb-6">
              <h3 className="text-xl font-bold mb-4 text-text">
                {language === 'TR' ? 'Bilet Bilgileri' : 'Ticket Information'}
              </h3>
              
              {event.price_min && event.price_max ? (
                <div className="mb-6">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {event.price_min}₺ - {event.price_max}₺
                  </div>
                  <p className="text-sm text-text/70">
                    {language === 'TR' ? 'Bilet başına fiyat aralığı' : 'Price range per ticket'}
                  </p>
                </div>
              ) : (
                <div className="mb-6">
                  <div className="text-xl font-semibold text-text/70">
                    {language === 'TR' ? 'Fiyat mevcut değil' : 'Price not available'}
                  </div>
                </div>
              )}
              
              <div className="space-y-4">
                <button
                  onClick={() => window.open(event.url, '_blank')}
                  className="w-full bg-primary text-white px-6 py-3 rounded-lg hover:bg-primary/90 transition-colors flex items-center justify-center"
                >
                  <ExternalLink size={16} className="mr-2" />
                  {language === 'TR' ? 'Bilet Al' : 'Buy Ticket Now'}
                </button>
                
                <button 
                  onClick={handleShareEvent}
                  className="w-full py-3 px-6 rounded-lg transition-colors flex items-center justify-center bg-gray-100 text-gray-700 hover:bg-gray-200"
                >
                  <Share2 size={16} className="mr-2" />
                  {language === 'TR' ? 'Etkinliği Paylaş' : 'Share Event'}
                </button>
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h4 className="font-semibold mb-2 text-text">
                  {language === 'TR' ? 'Hızlı Bilgi' : 'Quick Info'}
                </h4>
                <div className="space-y-2 text-sm">
                  <p className="text-text/70">📅 {language === 'TR' ? 'Tarih' : 'Date'}: {event.date}</p>
                  <p className="text-text/70">🕐 {language === 'TR' ? 'Saat' : 'Time'}: {event.time}</p>
                  <p className="text-text/70">📍 {language === 'TR' ? 'Konum' : 'Location'}: {event.city}</p>
                  <p className="text-text/70">🎭 {language === 'TR' ? 'Kategori' : 'Category'}: {event.category}</p>
                </div>
              </div>
            </div>
            </div>
          </div>
        </div>
      </main>

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
    </div>
  )
}

export default EventDetailPage 