import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, MapPin, Users, Star, Clock, Phone, Globe as GlobeIcon, Share2, Heart, ExternalLink, Tag } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import DatabaseService from '../services/databaseService'
// Image paths for API compatibility  
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')
const newLogo = `${API_BASE_URL}/assets/eventhubble_new_logo.png`
const logo = `${API_BASE_URL}/assets/Logo.png`
const logoWithoutBg = `${API_BASE_URL}/assets/Logo w_out background.png`
const mainLogo = `${API_BASE_URL}/assets/MainLogo.png`
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'
import Footer from '../components/Footer'


const BlogDetailPage = () => {
  const { language, toggleLanguage } = useLanguage()
  const [isDarkMode, setIsDarkMode] = useState(false) // Artık dark mode yok, tek tema
  const [blogPost, setBlogPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [postImageUrl, setPostImageUrl] = useState('')
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

  const loadBlogPost = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog-posts/${id}`)
      if (response.ok) {
        const post = await response.json()
        // Localize the blog post based on current language
        const localizedPost = {
          ...post,
          title: language === 'TR' ? (post.title_tr || post.title) : (post.title_en || post.title),
          excerpt: language === 'TR' ? (post.excerpt_tr || post.excerpt) : (post.excerpt_en || post.excerpt),
          content: language === 'TR' ? (post.content_tr || post.content) : (post.content_en || post.content)
        }
        setBlogPost(localizedPost)
        // Load image for the post
        await loadPostImage(localizedPost)
      } else {
        console.warn(`Blog post ${id} not found via API, trying localStorage...`)
        loadFromLocalStorage()
      }
    } catch (error) {
      console.warn('Error loading blog post from API:', error.message)
      loadFromLocalStorage()
    } finally {
      setIsLoading(false)
    }
  }

  const loadFromLocalStorage = async () => {
    try {
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        const posts = JSON.parse(storedPosts)
        const post = posts.find(p => p.id === parseInt(id))
        if (post) {
          const localizedPost = {
            ...post,
            title: language === 'TR' ? (post.title_tr || post.title) : (post.title_en || post.title),
            excerpt: language === 'TR' ? (post.excerpt_tr || post.excerpt) : (post.excerpt_en || post.excerpt),
            content: language === 'TR' ? (post.content_tr || post.content) : (post.content_en || post.content)
          }
          setBlogPost(localizedPost)
          // Load image for the post
          await loadPostImage(localizedPost)
        } else {
          setBlogPost(null)
        }
      } else {
        setBlogPost(null)
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error)
      setBlogPost(null)
    }
  }

  // Load image for blog post
  const loadPostImage = async (post) => {
    if (post.image) {
      setPostImageUrl(post.image) // Direct image URL (legacy)
    } else if (post.cover_image_id) {
      try {
        const image = await DatabaseService.getImageById(post.cover_image_id)
        if (image) {
          setPostImageUrl(DatabaseService.getImageUrl(image))
        } else {
          setPostImageUrl('/Logo.png') // Fallback
        }
      } catch (error) {
        console.warn(`Failed to load image ${post.cover_image_id}:`, error)
        setPostImageUrl('/Logo.png') // Fallback
      }
    } else {
      setPostImageUrl('/Logo.png') // Fallback
    }
  }

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode
    setIsDarkMode(newDarkMode)
    localStorage.setItem('isDarkMode', JSON.stringify(newDarkMode))
  }

  // Language context handles language toggle

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
      // Silent success - no alert in production
    }
  }

  // Get logo
  const getLogo = () => {
    return logo // Yeni logo kullanıyoruz
  }

  const formatDate = (dateString) => {
    if (!dateString) return language === 'TR' ? 'Tarih belirtilmemiş' : 'Date not specified'
    
    try {
      const date = new Date(dateString)
      // Check if date is valid
      if (isNaN(date.getTime())) {
        return language === 'TR' ? 'Geçersiz tarih' : 'Invalid date'
      }
      
      return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      })
    } catch (error) {
      return language === 'TR' ? 'Geçersiz tarih' : 'Invalid date'
    }
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

  // Show loading while fetching
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-lg text-text">
            {language === 'TR' ? 'Yükleniyor...' : 'Loading...'}
          </p>
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
            src={postImageUrl || `${API_BASE_URL}/assets/Logo.png`}
            alt={blogPost.title}
            className="w-full h-64 md:h-96 object-cover"
            onError={(e) => {
              // Prevent infinite fallback loop
              if (!e.target.src.includes('Logo.png')) {
                e.target.src = `${API_BASE_URL}/assets/Logo.png`
              }
            }}
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
                  <span>{formatDate(blogPost.created_at || blogPost.date)}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{formatReadingTime(blogPost.content)}</span>
                </div>
              </div>
            </div>

            {/* Title */}
            <h1 className="text-xl md:text-3xl lg:text-4xl font-bold text-text mb-4 text-left">
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-base md:text-lg text-text/70 mb-6 leading-relaxed text-left">
              {blogPost.excerpt}
            </p>



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
            <div className="prose prose-lg max-w-none text-left">
              {blogPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-text text-left">
                  {paragraph}
                </p>
              ))}
            </div>

            {/* Reference URL */}
            {blogPost.url && (
              <div className="mt-8 pt-6 border-t border-gray-200">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <span>{language === 'TR' ? 'Kaynak:' : 'Source:'}</span>
                  <a 
                    href={blogPost.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary hover:text-primary/80 underline"
                  >
                    {new URL(blogPost.url).hostname}
                  </a>
                </div>
              </div>
            )}
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
      <Footer language={language} />

      {/* Mobile Navigation */}
      <MobileNavigation language={language} />

    </div>
  )
}

export default BlogDetailPage 