import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, Calendar, ArrowRight } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'
import MobileHeader from '../components/MobileHeader'


const WorldNewsPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const [newsData, setNewsData] = useState([])
  const navigate = useNavigate()

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Load blog posts from localStorage
  useEffect(() => {
    const loadBlogPosts = () => {
      try {
        const storedPosts = localStorage.getItem('blogPosts')
        if (storedPosts) {
          const posts = JSON.parse(storedPosts)
          // Transform posts to match the expected format
          const transformedPosts = posts.map(post => ({
            id: post.id,
            title: post.title,
            excerpt: post.excerpt,
            date: new Date(post.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            }),
            category: post.category,
            image: post.image
          }))
          setNewsData(transformedPosts)
        } else {
          // Blog yazısı yok, boş array kullan
          setNewsData([])
        }
      } catch (error) {
        console.error('Error loading blog posts:', error)
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
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="block sm:hidden">
        <MobileHeader
          onSearchClick={() => {}}
          onMenuClick={() => {}}
          logo={getLogo()}
          language={language}
          toggleLanguage={toggleLanguage}
        />
        <div className="h-24"></div> {/* Spacer for fixed header */}
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
                className="text-sm font-medium transition-colors text-white/80 hover:text-white whitespace-nowrap"
              >
                {language === 'TR' ? 'Hakkımızda' : 'About'}
              </a>
              <a
                href="/world-news"
                className="text-sm font-medium transition-colors text-primary-light whitespace-nowrap"
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
      <main className="max-w-7xl mx-auto px-4 py-6 md:py-8">
        {/* Mobile Header */}
        <div className="block sm:hidden text-center mb-6">
          <h1 className="text-2xl font-bold text-text mb-2">
            {language === 'TR' ? 'Haberler' : 'News'}
          </h1>
          <p className="text-sm text-text/70 px-2">
            {language === 'TR' 
              ? 'Dünyadan en son etkinlik haberleri'
              : 'Latest event news from around the world'
            }
          </p>
        </div>

        {/* Desktop Header */}
        <div className="hidden sm:block text-center mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-text mb-4">
            {language === 'TR' ? 'Dünyadan Gelişmeler' : 'World News'}
          </h1>
          <p className="text-xl text-text/70 max-w-3xl mx-auto px-4">
            {language === 'TR' 
              ? 'Dünyadan en son etkinlik haberleri ve gelişmeler'
              : 'Latest event news and developments from around the world'
            }
          </p>
        </div>

        {/* News Grid */}
        <div className="grid gap-6 md:gap-8 md:grid-cols-2 lg:grid-cols-3">
          {newsData.map((news) => (
            <article
              key={news.id}
              className="bg-white border-gray-200 rounded-lg shadow-lg border overflow-hidden hover:shadow-xl transition-shadow duration-300"
            >
              <img
                src={news.image}
                alt={news.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center justify-between mb-3">
                  <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                    {news.category}
                  </span>
                  <div className="flex items-center text-sm text-text/70">
                    <Calendar className="h-4 w-4 mr-1" />
                    {news.date}
                  </div>
                </div>
                <h3 className="text-xl font-semibold text-text mb-3 line-clamp-2">
                  {news.title}
                </h3>
                <p className="text-text/70 mb-4 line-clamp-3">
                  {news.excerpt}
                </p>
                <button
                  onClick={() => handleReadMore(news.id)}
                  className="w-full bg-primary hover:bg-primary/90 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200"
                >
                  {language === 'TR' ? 'Devamını Oku' : 'Read More'}
                </button>
              </div>
            </article>
          ))}
        </div>

        {/* Empty State */}
        {newsData.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 dark:text-gray-500 mb-4">
              <Calendar className="mx-auto h-12 w-12" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'TR' ? 'Henüz haber yok' : 'No news yet'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'TR' 
                ? 'Yakında yeni haberler eklenecek.'
                : 'New articles will be added soon.'
              }
            </p>
          </div>
        )}
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

export default WorldNewsPage 