import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Phone, Globe as GlobeIcon, Share2, Heart, ExternalLink, Tag } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const BlogDetailPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const [blogPost, setBlogPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  // Dark mode effect - artık gerekli değil
  useEffect(() => {
    document.documentElement.classList.remove('dark')
  }, [])

  // Update page title based on language
  useEffect(() => {
    const title = language === 'TR' 
      ? 'Event Hubble | Blog Detayı'
      : 'Event Hubble | Blog Detail'
    document.title = title
  }, [language])

  // Load blog post
  useEffect(() => {
    loadBlogPost()
  }, [id, language])

  const loadBlogPost = () => {
    try {
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        const posts = JSON.parse(storedPosts)
        const post = posts.find(p => p.id === parseInt(id))
        if (post) {
          setBlogPost(post)
        } else {
          // Blog yazısı bulunamadı
          setBlogPost(null)
        }
      } else {
        // Blog yazısı yok
        setBlogPost(null)
      }
    } catch (error) {
      console.error('Error loading blog post:', error)
    } finally {
      setIsLoading(false)
    }
  }

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

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: blogPost.title,
        text: blogPost.excerpt,
        url: window.location.href
      })
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert(language === 'TR' ? 'Link panoya kopyalandı!' : 'Link copied to clipboard!')
    }
  }

  // Get logo
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return language === 'TR' ? `${minutes} dk okuma` : `${minutes} min read`
  }

  // Category translations
  const getCategoryTranslation = (category) => {
    const translations = {
      'Music': 'Müzik',
      'Sports': 'Spor',
      'Art': 'Sanat',
      'Technology': 'Teknoloji',
      'Film': 'Film',
      'Theater': 'Tiyatro',
      'Festival': 'Festival',
      'Other': 'Diğer',
      'Müzik': 'Music',
      'Spor': 'Sports',
      'Sanat': 'Art',
      'Teknoloji': 'Technology',
      'Tiyatro': 'Theater',
      'Diğer': 'Other'
    }
    return translations[category] || category
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">📖</div>
          <h3 className="text-xl font-semibold text-text">
            {language === 'TR' ? 'Blog yazısı yükleniyor...' : 'Loading blog post...'}
          </h3>
        </div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl mb-4 text-gray-400">❌</div>
          <h3 className="text-xl font-semibold mb-2 text-text">
            {language === 'TR' ? 'Blog Yazısı Bulunamadı' : 'Blog Post Not Found'}
          </h3>
          <button
            onClick={() => navigate('/world-news')}
            className="text-primary hover:text-primary/80"
          >
            {language === 'TR' ? '← Dünya Haberlerine Dön' : '← Back to World News'}
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
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {/* Featured Image */}
          <img
            src={blogPost.image}
            alt={blogPost.title}
            className="w-full h-64 md:h-96 object-cover"
          />
          
          {/* Article Content */}
          <div className="p-6 md:p-8">
            {/* Category and Date */}
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Tag className="h-4 w-4 text-primary" />
                <span className="text-sm text-primary font-medium">
                  {getCategoryTranslation(blogPost.category)}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-text/70">
                <div className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDate(blogPost.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatReadingTime(blogPost.content)}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-text mb-4">
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base md:text-lg text-text/70 mb-6 leading-relaxed">
              {blogPost.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-4 w-4 text-text/50" />
              <span className="text-sm text-text/70">
                {language === 'TR' ? 'Yazar' : 'By'} {blogPost.author}
              </span>
            </div>

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-primary/10 text-primary border border-primary/20 text-sm rounded-full hover:bg-primary/20 transition-colors"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* Share Button */}
            <div className="mb-8">
              <button
                onClick={handleShare}
                className="flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>{language === 'TR' ? 'Yazıyı Paylaş' : 'Share Article'}</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none">
              {blogPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-text">
                  {paragraph}
                </p>
              ))}
            </div>
          </div>
        </article>

        {/* Back to News Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/world-news')}
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-primary text-white rounded-md hover:bg-primary/90 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>{language === 'TR' ? 'Dünya Haberlerine Dön' : 'Back to World News'}</span>
          </button>
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

export default BlogDetailPage 