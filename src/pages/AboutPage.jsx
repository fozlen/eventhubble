import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Sun, Moon, Globe, User, ArrowLeft } from 'lucide-react'
import LogoService from '../services/logoService'
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'
import Footer from '../components/Footer'


const AboutPage = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(false) // No dark mode anymore, single theme
  const [logos, setLogos] = useState({})

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

  // Dark mode effect - no longer needed
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language
  useEffect(() => {
    document.title = language === 'TR' ? 'Event Hubble | Hakkımızda' : 'Event Hubble | About Us'
  }, [language])

  const toggleDarkMode = () => {
    // No dark mode anymore, this function is not used
  }



  const handleLogin = () => {
    // Login functionality
  }

  // Get logo
  const getLogo = () => {
    return logos.main || LogoService.API_BASE_URL + '/assets/Logo.png'
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
                className="text-sm font-medium transition-colors text-primary-light whitespace-nowrap"
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

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 py-8 md:py-12">
        
        {/* Mobile Header */}
        <div className="block sm:hidden text-center mb-8">
          <h1 className="text-2xl font-bold mb-2 text-text">
            {language === 'TR' ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className="text-lg font-bold text-primary mb-4">
            {language === 'TR' ? 'Her Deneyime Açılan Kapınız' : 'Your Gateway to Every Experience'}
          </p>
          <p className="text-sm text-text/80 px-4 leading-relaxed">
            {language === 'TR' 
              ? 'EventHubble\'da, harika deneyimler keşfetmenin kolay olması gerektiğine inanıyoruz. Bu yüzden konserler, festivaller, spor etkinlikleri, buluşmalar, kültürel toplantılar ve hatta küresel gösterileri tek bir yerde bir araya getiriyoruz. Konum, tarih veya bütçeye göre arama yaparken, ne yapacağınızı, ne zaman ve nerede anında bulmanıza yardımcı oluyoruz.'
              : 'At EventHubble, we believe discovering great experiences should be effortless. That\'s why we bring together concerts, festivals, sports events, meetups, cultural gatherings, and even global spectacles all in one place. Whether you\'re searching by location, date, or budget, we help you find what to do, when and where instantly.'
            }
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block text-center mb-12">
          <h1 className="text-4xl font-bold mb-4 text-text">
            {language === 'TR' ? 'Hakkımızda' : 'About Us'}
          </h1>
          <p className="text-2xl font-bold text-primary mb-6">
            {language === 'TR' ? 'Her Deneyime Açılan Kapınız' : 'Your Gateway to Every Experience'}
          </p>
          <p className="text-lg text-text/80 px-4 max-w-4xl mx-auto leading-relaxed">
            {language === 'TR' 
              ? 'EventHubble\'da, harika deneyimler keşfetmenin kolay olması gerektiğine inanıyoruz. Bu yüzden konserler, festivaller, spor etkinlikleri, buluşmalar, kültürel toplantılar ve hatta küresel gösterileri tek bir yerde bir araya getiriyoruz. Konum, tarih veya bütçeye göre arama yaparken, ne yapacağınızı, ne zaman ve nerede anında bulmanıza yardımcı oluyoruz.'
              : 'At EventHubble, we believe discovering great experiences should be effortless. That\'s why we bring together concerts, festivals, sports events, meetups, cultural gatherings, and even global spectacles all in one place. Whether you\'re searching by location, date, or budget, we help you find what to do, when and where instantly.'
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
                ? 'İnsanları dünyadaki en heyecan verici etkinliklerle buluşturmak ve planları unutulmaz anılara dönüştürmeyi kolaylaştırmak.'
                : 'To connect people with the most exciting events around the world and make it easy to turn plans into unforgettable memories.'
              }
            </p>
          </div>

          <div className="p-4 md:p-6 rounded-lg bg-background-secondary">
            <h2 className="text-xl md:text-2xl font-semibold mb-3 md:mb-4 text-text">
              {language === 'TR' ? 'Vizyonumuz' : 'Our Vision'}
            </h2>
            <p className="text-sm md:text-base text-text/70">
              {language === 'TR' 
                ? 'Nerede olursanız olun ve neyle ilgilenirseniz ilgilenin, etkinlikleri keşfetmek ve erişmek için başvurulan küresel merkez olmak.'
                : 'To become the go-to global hub for discovering and accessing events, no matter where you are or what you\'re into.'
              }
            </p>
          </div>
        </div>

        <div className="p-6 md:p-8 rounded-lg bg-background-secondary">
          <h2 className="text-xl md:text-2xl font-semibold mb-4 md:mb-6 text-center text-text">
            {language === 'TR' ? 'Neden EventHubble?' : 'Why Choose EventHubble?'}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🌍</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Tüm Etkinlikler, Tek Platform' : 'All Events, One Platform'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Gizli değerlerden küresel gösterilere. Her etkinlik, tek bir yerde.'
                  : 'From hidden gems to global shows. Every event, all in one place.'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Akıllı Arama, Daha İyi Planlar' : 'Smarter Search, Better Plans'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Konum, tarih, kategori veya fiyata göre kolayca filtreleyin ve size uygun etkinliği bulun.'
                  : 'Easily filter by location, date, category, or price to find the right event for you.'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Doğrudan Bilet Bağlantıları' : 'Direct Ticket Links'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Karışıklık yok. Dolambaç yok. Sizi anında bilet rezervasyonu için güvenilir platformlara yönlendiriyoruz.'
                  : 'No confusion. No detours. We redirect you to trusted platforms to book tickets instantly.'
                }
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center bg-primary/10">
                <span className="text-2xl">👀</span>
              </div>
              <h3 className="font-semibold mb-2 text-text">
                {language === 'TR' ? 'Size Özel' : 'Tailored for You'}
              </h3>
              <p className="text-sm text-text/70">
                {language === 'TR' 
                  ? 'Tercihleriniz ve konumunuza göre kişiselleştirilmiş öneriler alın.'
                  : 'Get personalized recommendations based on your preferences and location.'
                }
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Mobile Navigation */}
      <MobileNavigation language={language} />

    </div>
  )
}

export default AboutPage 