import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Sun, Moon, Globe, User, ArrowLeft, Calendar, Tag, Share2, Clock } from 'lucide-react'
import lightLogo from '../assets/eventhubble_light_transparent_logo.png'
import darkLogo from '../assets/eventhubble_dark_transparent_logo.png'

const BlogDetailPage = () => {
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [language, setLanguage] = useState('EN')
  const [blogPost, setBlogPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const { id } = useParams()
  const navigate = useNavigate()

  // Dark mode effect
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [isDarkMode])

  // Load blog post
  useEffect(() => {
    loadBlogPost()
  }, [id])

  const loadBlogPost = () => {
    try {
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        const posts = JSON.parse(storedPosts)
        const post = posts.find(p => p.id === parseInt(id))
        if (post) {
          setBlogPost(post)
        } else {
          // Fallback to sample data if not found in localStorage
          const samplePost = {
            id: parseInt(id),
            title: 'Coachella 2024 Lineup Announced',
            excerpt: 'The exciting artist lineup for this year\'s biggest music festival has been released.',
            content: 'The Coachella Valley Music and Arts Festival has just announced its highly anticipated 2024 lineup. This year\'s festival promises to be one of the most diverse and exciting yet, featuring artists from across the musical spectrum.\n\nHeadliners include some of the biggest names in music today, along with emerging artists who are making waves in the industry. The festival will take place over two weekends in April, offering attendees an unforgettable experience in the beautiful California desert.\n\nIn addition to the main stage performances, Coachella 2024 will feature art installations, food vendors, and interactive experiences that have become synonymous with the festival experience.\n\nThe festival organizers have also announced several new initiatives for 2024, including enhanced sustainability programs, expanded food options, and improved accessibility features. These changes reflect the festival\'s commitment to creating an inclusive and environmentally conscious event.\n\nTickets for Coachella 2024 are expected to go on sale in the coming weeks, with early bird pricing available for a limited time. Fans are encouraged to sign up for the festival\'s newsletter to receive updates on ticket sales and additional lineup announcements.',
            date: '2024-03-15',
            category: 'Music',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            author: 'Admin',
            tags: ['festival', 'music', 'coachella', '2024']
          }
          setBlogPost(samplePost)
        }
      } else {
        // No stored posts, use sample data
        const samplePost = {
          id: parseInt(id),
          title: 'Coachella 2024 Lineup Announced',
          excerpt: 'The exciting artist lineup for this year\'s biggest music festival has been released.',
          content: 'The Coachella Valley Music and Arts Festival has just announced its highly anticipated 2024 lineup. This year\'s festival promises to be one of the most diverse and exciting yet, featuring artists from across the musical spectrum.\n\nHeadliners include some of the biggest names in music today, along with emerging artists who are making waves in the industry. The festival will take place over two weekends in April, offering attendees an unforgettable experience in the beautiful California desert.\n\nIn addition to the main stage performances, Coachella 2024 will feature art installations, food vendors, and interactive experiences that have become synonymous with the festival experience.\n\nThe festival organizers have also announced several new initiatives for 2024, including enhanced sustainability programs, expanded food options, and improved accessibility features. These changes reflect the festival\'s commitment to creating an inclusive and environmentally conscious event.\n\nTickets for Coachella 2024 are expected to go on sale in the coming weeks, with early bird pricing available for a limited time. Fans are encouraged to sign up for the festival\'s newsletter to receive updates on ticket sales and additional lineup announcements.',
          date: '2024-03-15',
          category: 'Music',
          image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
          author: 'Admin',
          tags: ['festival', 'music', 'coachella', '2024']
        }
        setBlogPost(samplePost)
      }
    } catch (error) {
      console.error('Error loading blog post:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }

  const toggleLanguage = () => {
    setLanguage(language === 'TR' ? 'EN' : 'TR')
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
      alert('Link copied to clipboard!')
    }
  }

  // Get appropriate logo based on theme
  const getLogo = () => {
    return isDarkMode ? darkLogo : lightLogo
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatReadingTime = (content) => {
    const wordsPerMinute = 200
    const words = content.split(' ').length
    const minutes = Math.ceil(words / wordsPerMinute)
    return `${minutes} min read`
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!blogPost) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Blog Post Not Found
          </h1>
          <button
            onClick={() => navigate('/world-news')}
            className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300"
          >
            ← Back to World News
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/world-news')}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
              </button>
              <img src={getLogo()} alt="EventHubble" className="h-8 w-auto" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                EventHubble
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleDarkMode}
                className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                {isDarkMode ? (
                  <Sun className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                ) : (
                  <Moon className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                )}
              </button>
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <Globe className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {language}
                </span>
              </button>
              <button
                onClick={handleLogin}
                className="flex items-center space-x-1 px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md transition-colors"
              >
                <User className="h-4 w-4 text-gray-600 dark:text-gray-400" />
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Login
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Article Header */}
        <article className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
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
                <Tag className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-600 dark:text-blue-400 font-medium">
                  {blogPost.category}
                </span>
              </div>
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
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
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {blogPost.title}
            </h1>

            {/* Excerpt */}
            <p className="text-lg text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
              {blogPost.excerpt}
            </p>

            {/* Author */}
            <div className="flex items-center space-x-2 mb-6">
              <User className="h-4 w-4 text-gray-400" />
              <span className="text-sm text-gray-500 dark:text-gray-400">
                By {blogPost.author}
              </span>
            </div>

            {/* Tags */}
            {blogPost.tags && blogPost.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-6">
                {blogPost.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 text-sm rounded-full"
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
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              >
                <Share2 className="h-4 w-4" />
                <span>Share Article</span>
              </button>
            </div>

            {/* Article Content */}
            <div className="prose prose-lg max-w-none dark:prose-invert">
              {blogPost.content.split('\n\n').map((paragraph, index) => (
                <p key={index} className="mb-4 leading-relaxed text-gray-700 dark:text-gray-300">
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
            className="flex items-center space-x-2 mx-auto px-6 py-3 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to World News</span>
          </button>
        </div>
      </main>
    </div>
  )
}

export default BlogDetailPage 