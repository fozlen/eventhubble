import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users } from 'lucide-react'
import lightLogo from '../assets/eventhubble_light_transparent_logo.png'
import darkLogo from '../assets/eventhubble_dark_transparent_logo.png'

const WorldNewsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('EN')
  const navigate = useNavigate()

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
      ? 'EventHubble | Dünyadan Gelişmeler'
      : 'EventHubble | World News'
    document.title = title
  }, [language])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'TR' ? 'EN' : 'TR')
  }

  const handleLogin = () => {
    // Login functionality
    console.log('Login clicked')
  }

  // Get appropriate logo based on theme
  const getLogo = () => {
    return isDarkMode ? darkLogo : lightLogo
  }

  // Mock news data
  const newsData = [
    {
      id: 1,
      title: language === 'TR' ? 'Coachella 2024 Lineup Açıklandı' : 'Coachella 2024 Lineup Announced',
      excerpt: language === 'TR' 
        ? 'Bu yılın en büyük müzik festivali için heyecan verici sanatçı listesi yayınlandı.'
        : 'The exciting artist lineup for this year\'s biggest music festival has been released.',
      date: language === 'TR' ? '15 Mart 2024' : 'March 15, 2024',
      category: language === 'TR' ? 'Müzik' : 'Music',
      image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'
    },
    {
      id: 2,
      title: language === 'TR' ? 'Tokyo Olimpiyat Oyunları Hazırlıkları' : 'Tokyo Olympic Games Preparations',
      excerpt: language === 'TR' 
        ? '2024 Tokyo Olimpiyat Oyunları için son hazırlıklar tamamlanıyor.'
        : 'Final preparations are being completed for the 2024 Tokyo Olympic Games.',
      date: language === 'TR' ? '12 Mart 2024' : 'March 12, 2024',
      category: language === 'TR' ? 'Spor' : 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    },
    {
      id: 3,
      title: language === 'TR' ? 'Venedik Bienali 2024 Programı' : 'Venice Biennale 2024 Program',
      excerpt: language === 'TR' 
        ? 'Dünyanın en prestijli sanat etkinliği için program detayları açıklandı.'
        : 'Program details have been announced for the world\'s most prestigious art event.',
      date: language === 'TR' ? '10 Mart 2024' : 'March 10, 2024',
      category: language === 'TR' ? 'Sanat' : 'Art',
      image: 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop'
    },
    {
      id: 4,
      title: language === 'TR' ? 'SXSW Festivali Teknoloji Trendleri' : 'SXSW Festival Technology Trends',
      excerpt: language === 'TR' 
        ? 'Austin\'deki festivalde öne çıkan teknoloji ve inovasyon trendleri.'
        : 'Highlighted technology and innovation trends at the Austin festival.',
      date: language === 'TR' ? '8 Mart 2024' : 'March 8, 2024',
      category: language === 'TR' ? 'Teknoloji' : 'Technology',
      image: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop'
    },
    {
      id: 5,
      title: language === 'TR' ? 'Cannes Film Festivali Jüri Üyeleri' : 'Cannes Film Festival Jury Members',
      excerpt: language === 'TR' 
        ? 'Bu yılın Cannes Film Festivali jüri üyeleri açıklandı.'
        : 'This year\'s Cannes Film Festival jury members have been announced.',
      date: language === 'TR' ? '5 Mart 2024' : 'March 5, 2024',
      category: language === 'TR' ? 'Film' : 'Film',
      image: 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop'
    },
    {
      id: 6,
      title: language === 'TR' ? 'FIFA Dünya Kupası 2026 Hazırlıkları' : 'FIFA World Cup 2026 Preparations',
      excerpt: language === 'TR' 
        ? '2026 FIFA Dünya Kupası için ev sahibi ülkelerde hazırlıklar başladı.'
        : 'Preparations have begun in host countries for the 2026 FIFA World Cup.',
      date: language === 'TR' ? '3 Mart 2024' : 'March 3, 2024',
      category: language === 'TR' ? 'Spor' : 'Sports',
      image: 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop'
    }
  ]

  return (
    <div className={`min-h-screen ${isDarkMode ? 'bg-gray-900 text-white' : 'bg-white text-gray-900'}`}>
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

      {/* Main Content */}
      <main className="max-w-6xl mx-auto px-4 py-12">
        <div className="text-center mb-12">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
            {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
          </h1>
          <p className={`text-xl ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
            {language === 'TR' 
              ? 'Dünya çapındaki en son etkinlik haberleri ve gelişmeler' 
              : 'Latest event news and developments from around the world'
            }
          </p>
        </div>

        {/* News Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {newsData.map((news) => (
            <article key={news.id} className={`rounded-lg overflow-hidden shadow-lg ${isDarkMode ? 'bg-gray-800' : 'bg-white'} border ${isDarkMode ? 'border-gray-700' : 'border-gray-200'}`}>
              <img 
                src={news.image} 
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className={`px-3 py-1 rounded-full text-xs font-medium ${isDarkMode ? 'bg-blue-600 text-white' : 'bg-blue-100 text-blue-800'}`}>
                    {news.category}
                  </span>
                  <div className="flex items-center text-sm text-gray-500">
                    <Calendar size={14} className="mr-1" />
                    {news.date}
                  </div>
                </div>
                <h3 className={`text-lg font-semibold mb-3 ${isDarkMode ? 'text-white' : 'text-gray-900'}`}>
                  {news.title}
                </h3>
                <p className={`text-sm mb-4 ${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`}>
                  {news.excerpt}
                </p>
                <button className={`w-full py-2 px-4 rounded-lg font-medium transition-colors ${isDarkMode ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {language === 'TR' ? 'Devamını Oku' : 'Read More'}
                </button>
              </div>
            </article>
          ))}
        </div>
      </main>

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
    </div>
  )
}

export default WorldNewsPage 