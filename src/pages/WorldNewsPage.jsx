import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { Sun, Moon, Globe, User, Calendar, ArrowRight } from 'lucide-react'
import CacheService from '../services/cacheService'
import LogoService from '../services/logoService'
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'
import Footer from '../components/Footer'

const WorldNewsPage = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [newsData, setNewsData] = useState([])
  const [isDarkMode, setIsDarkMode] = useState(false)
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

  // Load dark mode from localStorage
  useEffect(() => {
    const savedDarkMode = localStorage.getItem('isDarkMode') === 'true'
    setIsDarkMode(savedDarkMode)
  }, [])

  // Load blog posts with caching
  useEffect(() => {
    const loadBlogPosts = async () => {
      try {
        const posts = await CacheService.getBlogPosts(language)
        setNewsData(posts)
      } catch (error) {
        if (!import.meta.env.PROD) {
          console.error('Error loading blog posts:', error)
        }
        setNewsData([])
      } finally {
        // Loading removed for better UX
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



  const handleLogin = () => {
    navigate('/admin/login')
  }

  const handleReadMore = (postId) => {
    navigate(`/blog/${postId}`)
  }

  // Get appropriate logo based on theme
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

        {/* News Grid */}
        {(
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {newsData.map((post) => (
              <article key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300">
                {/* Image */}
                <div className="aspect-video bg-gray-200 overflow-hidden">
                  <img 
                    src={post.image} 
                    alt={language === 'TR' ? (post.title_tr || post.title) : (post.title_en || post.title)}
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
                        {post.date ? new Date(post.date).toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        }) : 'Tarih belirtilmemiş'}
                      </span>
                    </div>
                  </div>
                  
                  {/* Title */}
                  <h2 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {language === 'TR' ? (post.title_tr || post.title) : (post.title_en || post.title)}
                  </h2>
                  
                  {/* Excerpt */}
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {language === 'TR' ? (post.excerpt_tr || post.excerpt) : (post.excerpt_en || post.excerpt)}
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
        {newsData.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">
              {language === 'TR' ? 'Henüz haber bulunmuyor.' : 'No news available yet.'}
            </p>
          </div>
        )}
      </main>

              {/* Footer */}
        <Footer language={language} />

        {/* Mobile Navigation */}
        <div className="block sm:hidden">
          <MobileNavigation language={language} />
        </div>
      </div>
    )
  }
  
  export default WorldNewsPage 