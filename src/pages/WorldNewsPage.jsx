import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, Calendar, ArrowRight } from 'lucide-react'
// Image paths for Safari compatibility
const newLogo = '/assets/eventhubble_new_logo.png'
const logo = '/assets/Logo.png'
const logoWithoutBg = '/assets/Logo w_out background.png'
const mainLogo = '/assets/MainLogo.png'
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'

const WorldNewsPage = () => {
  const [newsData, setNewsData] = useState([])
  const [loading, setLoading] = useState(true)
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('TR')
  const navigate = useNavigate()

  // Load language from localStorage
  useEffect(() => {
    const savedLanguage = localStorage.getItem('language') || 'TR'
    setLanguage(savedLanguage)
  }, [])

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true'
    setIsDarkMode(savedDarkMode)
  }, [])

  // Load blog posts
  useEffect(() => {
    const loadBlogPosts = () => {
      try {
        // Always use demo data for now
        const demoPosts = [
          {
            id: 1,
            title_tr: 'Flamingo Republic 2024: Hırvatistan\'ın En Renkli Elektronik Müzik Festivali',
            title_en: 'Flamingo Republic 2024: Croatia\'s Most Colorful Electronic Music Festival',
            excerpt_tr: 'Zrce Beach\'te düzenlenecek Flamingo Republic 2024, 28-31 Temmuz tarihleri arasında elektronik müzik severleri bekliyor.',
            excerpt_en: 'Flamingo Republic 2024, to be held at Zrce Beach between July 28-31, awaits electronic music lovers.',
            content_tr: 'Zrce Beach, Hırvatistan\'ın en popüler festival destinasyonlarından biri, 28-31 Temmuz 2024 tarihleri arasında Flamingo Republic Festivali\'ne ev sahipliği yapacak.',
            content_en: 'Zrce Beach, one of Croatia\'s most popular festival destinations, will host the Flamingo Republic Festival from July 28-31, 2024.',
            date: '2024-07-28',
            category: 'Festival',
            image: '/assets/eventhubble_new_logo.png',
            url: 'https://example.com/flamingo-republic-2024'
          },
          {
            id: 2,
            title_tr: 'Drake\'in Manchester Konseri İptal Edildi',
            title_en: 'Drake\'s Manchester Concert Cancelled',
            excerpt_tr: 'Dünyaca ünlü rap sanatçısı Drake\'in Manchester Co-op Live Arena\'daki konseri son dakika iptal edildi.',
            excerpt_en: 'World-renowned rap artist Drake\'s concert at Manchester Co-op Live Arena has been cancelled at the last minute.',
            content_tr: 'Drake\'in 28 Temmuz 2024 tarihinde Manchester Co-op Live Arena\'da gerçekleştirilmesi planlanan konseri, teknik sorunlar nedeniyle iptal edildi.',
            content_en: 'Drake\'s concert planned for July 28, 2024 at Manchester Co-op Live Arena has been cancelled due to technical issues.',
            date: '2024-07-28',
            category: 'Music',
            image: '/assets/Logo.png',
            url: 'https://example.com/drake-manchester-cancelled'
          }
        ]
        
        // Use demo data in both production and development
        setNewsData(demoPosts)
      } catch (error) {
        // Always set demo data as fallback to ensure page loads
        const demoPosts = [
          {
            id: 1,
            title_tr: 'Flamingo Republic 2024: Hırvatistan\'ın En Renkli Elektronik Müzik Festivali',
            title_en: 'Flamingo Republic 2024: Croatia\'s Most Colorful Electronic Music Festival',
            excerpt_tr: 'Zrce Beach\'te düzenlenecek Flamingo Republic 2024, 28-31 Temmuz tarihleri arasında elektronik müzik severleri bekliyor.',
            excerpt_en: 'Flamingo Republic 2024, to be held at Zrce Beach between July 28-31, awaits electronic music lovers.',
            content_tr: 'Zrce Beach, Hırvatistan\'ın en popüler festival destinasyonlarından biri, 28-31 Temmuz 2024 tarihleri arasında Flamingo Republic Festivali\'ne ev sahipliği yapacak.',
            content_en: 'Zrce Beach, one of Croatia\'s most popular festival destinations, will host the Flamingo Republic Festival from July 28-31, 2024.',
            date: '2024-07-28',
            category: 'Festival',
            image: '/assets/eventhubble_new_logo.png',
            url: 'https://example.com/flamingo-republic-2024'
          },
          {
            id: 2,
            title_tr: 'Drake\'in Manchester Konseri İptal Edildi',
            title_en: 'Drake\'s Manchester Concert Cancelled',
            excerpt_tr: 'Dünyaca ünlü rap sanatçısı Drake\'in Manchester Co-op Live Arena\'daki konseri son dakika iptal edildi.',
            excerpt_en: 'World-renowned rap artist Drake\'s concert at Manchester Co-op Live Arena has been cancelled at the last minute.',
            content_tr: 'Drake\'in 28 Temmuz 2024 tarihinde Manchester Co-op Live Arena\'da gerçekleştirilmesi planlanan konseri, teknik sorunlar nedeniyle iptal edildi.',
            content_en: 'Drake\'s concert planned for July 28, 2024 at Manchester Co-op Live Arena has been cancelled due to technical issues.',
            date: '2024-07-28',
            category: 'Music',
            image: '/assets/Logo.png',
            url: 'https://example.com/drake-manchester-cancelled'
          }
        ]
        setNewsData(demoPosts)
        
        if (!import.meta.env.PROD) {
          console.error('Error loading blog posts:', error)
        }
      } finally {
        setLoading(false)
      }
    }

    loadBlogPosts()
  }, [language])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? 'Event Hubble | Dünyadan Gelişmeler'
      : 'Event Hubble | World News'
    document.title = title
  }, [language])

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
    navigate('/admin/login')
  }

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`)
  }

  // Get appropriate logo based on theme
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
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
                className="text-sm font-medium transition-colors text-white/80 hover:text-white whitespace-nowrap"
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
                className="text-sm font-medium transition-colors text-white hover:text-primary-light whitespace-nowrap"
              >
                {language === 'TR' ? 'Dünya Haberleri' : 'World News'}
              </a>
            </nav>
            
            {/* User Actions - Right Section */}
            <div className="flex justify-center sm:justify-end items-center space-x-2 w-full sm:w-auto">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language}</span>
              </button>
              
              <button
                onClick={toggleDarkMode}
                className="p-2 text-white/80 hover:text-white transition-colors"
              >
                {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
              </button>
              
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1 bg-primary-light text-primary px-3 py-1.5 rounded-md text-sm font-medium hover:bg-primary-light/90 transition-colors"
              >
                <User className="h-4 w-4" />
                <span>{language === 'TR' ? 'Admin' : 'Admin'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {language === 'TR' 
              ? 'Müzik, spor, sanat ve eğlence dünyasından en güncel haberler'
              : 'Latest news from the world of music, sports, art and entertainment'
            }
          </p>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        )}

        {/* News Grid */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={language === 'TR' ? post.title_tr : post.title_en}
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Content */}
                <div className="p-6">
                  {/* Category */}
                  <div className="flex items-center justify-between mb-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary/10 text-primary">
                      {post.category}
                    </span>
                    <div className="flex items-center space-x-1 text-gray-500 text-sm">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(post.date || new Date()).toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {language === 'TR' ? post.title_tr : post.title_en}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {language === 'TR' ? post.excerpt_tr : post.excerpt_en}
                  </p>
                  
                  {/* Read More Button */}
                  <button
                    onClick={() => handleReadMore(post.id)}
                    className="inline-flex items-center space-x-1 text-primary hover:text-primary-dark font-medium transition-colors"
                  >
                    <span>{language === 'TR' ? 'Devamını Oku' : 'Read More'}</span>
                    <ArrowRight className="h-4 w-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* No Posts Message */}
        {!loading && newsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'TR' ? 'Henüz haber bulunmuyor.' : 'No news available yet.'}
            </p>
          </div>
        )}
      </main>

      {/* Mobile Navigation */}
      <div className="block sm:hidden">
        <MobileNavigation />
      </div>
    </div>
  )
}

export default WorldNewsPage 