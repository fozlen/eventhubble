import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const AboutPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? 'EventHubble | Hakkımızda'
      : 'EventHubble | About Us'
    document.title = title
  }, [language])

  const toggleDarkMode = () => {
    // Artık dark mode yok, bu fonksiyon kullanılmıyor
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const handleLogin = () => {
    // Login functionality
    console.log('Login clicked')
  }

  // Get logo
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="grid grid-cols-3 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-start">
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
            
            {/* Navigation Menu - Center Section */}
            <nav className="flex justify-center items-center space-x-8">
              <a
                href="/"
                className="text-sm font-medium transition-colors text-white hover:text-primary-light"
              >
                {language === 'TR' ? 'Ana Sayfa' : 'Home'}
              </a>
              <a
                href="/about"
                className="text-sm font-medium transition-colors text-primary-light"
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
            
            {/* Language Toggle - Right Section */}
            <div className="flex justify-end">
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        <div className="text-center mb-8 md:mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text">
            {language === 'TR' ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className="text-lg md:text-xl text-text/70 px-4">
            {language === 'TR' 
              ? 'Dünyanın en iyi etkinliklerini keşfetmenizi sağlayan platform' 
              : 'The platform that helps you discover the world\'s best events'
            }
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 md:gap-8 mb-8 md:mb-12">
          <div className="p-4 md:p-6 rounded-lg bg-background-secondary">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-text">
              {language === 'TR' ? 'Misyonumuz' : 'Our Mission'}
            </h2>
            <p className="text-sm md:text-base text-text/70">
              {language === 'TR' 
                ? 'İnsanları dünyanın en muhteşem etkinlikleriyle buluşturmak ve unutulmaz deneyimler yaşamalarını sağlamak.'
                : 'To connect people with the world\'s most amazing events and help them create unforgettable experiences.'
              }
            </p>
          </div>

          <div className="p-4 md:p-6 rounded-lg bg-background-secondary">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-text">
              {language === 'TR' ? 'Vizyonumuz' : 'Our Vision'}
            </h2>
            <p className="text-sm md:text-base text-text/70">
              {language === 'TR' 
                ? 'Dünya çapında etkinlik keşfi için en güvenilir ve kullanıcı dostu platform olmak.'
                : 'To become the most reliable and user-friendly platform for event discovery worldwide.'
              }
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-lg bg-background-secondary">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center text-text">
            {language === 'TR' ? 'Neden EventHubble?' : 'Why EventHubble?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Küresel Erişim' : 'Global Access'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Dünyanın her yerinden etkinliklere erişim'
                  : 'Access to events from around the world'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Akıllı Arama' : 'Smart Search'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Gelişmiş filtrelerle mükemmel etkinliği bulun'
                  : 'Find the perfect event with advanced filters'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Kişiselleştirme' : 'Personalization'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Size özel etkinlik önerileri'
                  : 'Personalized event recommendations'
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-primary text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-3 gap-8 items-center">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center">
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
            
            {/* Company Links - Center Section */}
            <div className="flex justify-center">
              <div className="text-center">
                <h3 className="font-semibold mb-4">{language === 'TR' ? 'Şirket' : 'Company'}</h3>
                <ul className="space-y-2 text-white/80">
                  <li><a href="/about" className="hover:text-white transition-colors">{language === 'TR' ? 'Hakkımızda' : 'About'}</a></li>
                </ul>
              </div>
            </div>
            
            {/* Blog Links - Right Section */}
            <div className="flex justify-center">
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

export default AboutPage 