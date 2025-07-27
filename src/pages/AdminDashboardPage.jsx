import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Sun, Moon, Tag } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
import logoWithoutBg from '../assets/Logo w_out background.png'
import mainLogo from '../assets/MainLogo.png'

const AdminDashboardPage = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const [language, setLanguage] = useState(() => {
    // Load language preference from localStorage
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

  // Check authentication
  useEffect(() => {
    const isAuthenticated = localStorage.getItem('adminAuthenticated')
    const loginTime = localStorage.getItem('adminLoginTime')
    
    if (!isAuthenticated || !loginTime) {
      navigate('/admin/login')
      return
    }

    // Check if session is expired (24 hours)
    const now = Date.now()
    const loginTimestamp = parseInt(loginTime)
    if (now - loginTimestamp > 24 * 60 * 60 * 1000) {
      localStorage.removeItem('adminAuthenticated')
      localStorage.removeItem('adminLoginTime')
      navigate('/admin/login')
      return
    }

    loadBlogPosts()
  }, [navigate])

  const loadBlogPosts = () => {
    try {
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        setBlogPosts(JSON.parse(storedPosts))
      } else {
        // Initialize with sample data
        const samplePosts = [
          {
            id: 1,
            title: 'Coachella 2024 Lineup Announced',
            excerpt: 'The exciting artist lineup for this year\'s biggest music festival has been released.',
            content: 'The Coachella Valley Music and Arts Festival has just announced its highly anticipated 2024 lineup. This year\'s festival promises to be one of the most diverse and exciting yet, featuring artists from across the musical spectrum.\n\nHeadliners include some of the biggest names in music today, along with emerging artists who are making waves in the industry. The festival will take place over two weekends in April, offering attendees an unforgettable experience in the beautiful California desert.\n\nIn addition to the main stage performances, Coachella 2024 will feature art installations, food vendors, and interactive experiences that have become synonymous with the festival experience.',
            date: '2024-03-15',
            category: 'Music',
            image: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
            author: 'Admin',
            tags: ['festival', 'music', 'coachella', '2024']
          }
        ]
        setBlogPosts(samplePosts)
        localStorage.setItem('blogPosts', JSON.stringify(samplePosts))
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const handleAddPost = () => {
    setEditingPost(null)
    setShowAddModal(true)
  }

  const handleEditPost = (post) => {
    setEditingPost(post)
    setShowAddModal(true)
  }

  const handleDeletePost = (postId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu blog yazısını silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this blog post?'
    
    if (window.confirm(confirmMessage)) {
      const updatedPosts = blogPosts.filter(post => post.id !== postId)
      setBlogPosts(updatedPosts)
      localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
    }
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    )
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
                  src={logo} 
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
                className="text-sm font-medium transition-colors text-white/80 hover:text-white"
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
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {language === 'TR' ? 'Blog Yazıları' : 'Blog Posts'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'TR' 
                ? 'Blog yazılarınızı ve içeriklerinizi yönetin'
                : 'Manage your blog posts and content'
              }
            </p>
          </div>
          <button
            onClick={handleAddPost}
            className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-4 py-2 rounded-md transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}</span>
          </button>
        </div>

        {/* Blog Posts Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {blogPosts.map((post) => (
            <div
              key={post.id}
              className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden"
            >
              <img
                src={post.image}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-6">
                <div className="flex items-center space-x-2 mb-2">
                  <Tag className="h-4 w-4 text-primary" />
                  <span className="text-sm text-primary font-medium">
                    {post.category}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <div className="flex items-center space-x-2 mb-4">
                  <Calendar className="h-4 w-4 text-gray-400" />
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {formatDate(post.date)}
                  </span>
                </div>
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditPost(post)}
                    className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm"
                  >
                    <Edit className="h-4 w-4" />
                    <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                  </button>
                  <button
                    onClick={() => handleDeletePost(post.id)}
                    className="flex items-center space-x-1 text-text-accent hover:text-primary-light text-sm"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {blogPosts.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
              {language === 'TR' ? 'Henüz blog yazısı yok' : 'No blog posts'}
            </h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {language === 'TR' 
                ? 'İlk blog yazınızı oluşturarak başlayın.'
                : 'Get started by creating your first blog post.'
              }
            </p>
            <div className="mt-6">
              <button
                onClick={handleAddPost}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-primary hover:bg-primary-light"
              >
                <Plus className="-ml-1 mr-2 h-5 w-5" />
                {language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}
              </button>
            </div>
          </div>
        )}
      </main>

      {/* Add/Edit Modal */}
      {showAddModal && (
        <BlogPostModal
          post={editingPost}
          language={language}
          onClose={() => setShowAddModal(false)}
          onSave={(postData) => {
            if (editingPost) {
              // Edit existing post
              const updatedPosts = blogPosts.map(post =>
                post.id === editingPost.id ? { ...post, ...postData } : post
              )
              setBlogPosts(updatedPosts)
              localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
            } else {
              // Add new post
              const newPost = {
                ...postData,
                id: Date.now(),
                author: 'Admin',
                date: new Date().toISOString().split('T')[0]
              }
              const updatedPosts = [newPost, ...blogPosts]
              setBlogPosts(updatedPosts)
              localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
            }
            setShowAddModal(false)
          }}
        />
      )}
    </div>
  )
}

// Blog Post Modal Component
const BlogPostModal = ({ post, onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    title: post?.title || '',
    excerpt: post?.excerpt || '',
    content: post?.content || '',
    category: post?.category || 'Music',
    image: post?.image || '',
    tags: post?.tags?.join(', ') || ''
  })

  const categories = language === 'TR' 
    ? ['Müzik', 'Spor', 'Sanat', 'Teknoloji', 'Film', 'Tiyatro', 'Festival', 'Diğer']
    : ['Music', 'Sports', 'Art', 'Technology', 'Film', 'Theater', 'Festival', 'Other']

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    })
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
              <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <h2 className="text-xl font-semibold text-text mb-4">
            {post 
              ? (language === 'TR' ? 'Blog Yazısını Düzenle' : 'Edit Blog Post')
              : (language === 'TR' ? 'Yeni Blog Yazısı Ekle' : 'Add New Blog Post')
            }
          </h2>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'Başlık' : 'Title'}
              </label>
              <input
                type="text"
                required
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'Özet' : 'Excerpt'}
              </label>
              <textarea
                required
                rows="3"
                value={formData.excerpt}
                onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'İçerik' : 'Content'}
              </label>
              <textarea
                required
                rows="8"
                value={formData.content}
                onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'Kategori' : 'Category'}
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'Resim URL' : 'Image URL'}
              </label>
              <input
                type="url"
                required
                value={formData.image}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-1">
                {language === 'TR' ? 'Etiketler (virgülle ayrılmış)' : 'Tags (comma-separated)'}
              </label>
              <input
                type="text"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                placeholder={language === 'TR' ? 'festival, müzik, 2024' : 'festival, music, 2024'}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-text border border-gray-300 rounded-md hover:bg-background-secondary transition-colors"
              >
                {language === 'TR' ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-light transition-colors"
              >
                {post 
                  ? (language === 'TR' ? 'Yazıyı Güncelle' : 'Update Post')
                  : (language === 'TR' ? 'Yazı Oluştur' : 'Create Post')
                }
              </button>
            </div>
          </form>
        </div>
      </div>

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

export default AdminDashboardPage 