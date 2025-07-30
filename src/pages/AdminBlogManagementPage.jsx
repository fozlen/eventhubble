import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Megaphone, BarChart3, Tag, Eye, Calendar, User, FileText, ArrowLeft 
} from 'lucide-react'
import LogoService from '../services/logoService'
import CacheService from '../services/cacheService'
import SearchableImageSelect from '../components/SearchableImageSelect'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')
const newLogo = `${API_BASE_URL}/assets/eventhubble_new_logo.png`
const logo = `${API_BASE_URL}/assets/Logo.png`

const AdminBlogManagementPage = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/Logo.png')
  const navigate = useNavigate()

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await LogoService.getLogo('main')
        setLogo(logoUrl)
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }
    loadLogo()
  }, [])

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

  const loadBlogPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/blog-posts`)
      if (response.ok) {
        const posts = await response.json()
        setBlogPosts(posts)
      } else {
        console.error('API Error:', response.status, response.statusText)
        // API hatası durumunda localStorage'dan çek (fallback)
        const storedPosts = localStorage.getItem('blogPosts')
        if (storedPosts) {
          setBlogPosts(JSON.parse(storedPosts))
        } else {
          setBlogPosts([])
        }
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
      // Hata durumunda localStorage'dan çek
      const storedPosts = localStorage.getItem('blogPosts')
      if (storedPosts) {
        setBlogPosts(JSON.parse(storedPosts))
      } else {
        setBlogPosts([])
      }
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

  const handleDeletePost = async (postId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu blog yazısını silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this blog post?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/blog-posts/${postId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          const updatedPosts = blogPosts.filter(post => post.id !== postId)
          setBlogPosts(updatedPosts)
          console.log('Blog post deleted successfully')
          
          // Clear blog cache so changes are immediately visible on website
          CacheService.clearBlogCache()
        } else {
          const errorText = await response.text()
          console.error('Delete failed:', response.status, errorText)
          throw new Error('Failed to delete blog post')
        }
      } catch (error) {
        console.error('Error deleting blog post:', error)
        // Hata durumunda localStorage'dan sil (fallback)
        const updatedPosts = blogPosts.filter(post => post.id !== postId)
        setBlogPosts(updatedPosts)
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
      }
    }
  }



  // Language context handles language toggle

  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş'
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  // Helper function to get default images by category
  const getDefaultImageByCategory = (category) => {
    const imageMap = {
      'Music': 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop',
      'Sports': 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop',
      'Art': 'https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop',
      'Technology': 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop',
      'Film': 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop',
      'Theater': 'https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop',
      'Festival': 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop',
      'Other': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop'
    }
    return imageMap[category] || imageMap['Other']
  }

  const handleSavePost = async (postData) => {
    try {
      const postToSave = {
        title_tr: postData.title_tr,
        title_en: postData.title_en,
        content_tr: postData.content_tr,
        content_en: postData.content_en,
        excerpt_tr: postData.excerpt_tr,
        excerpt_en: postData.excerpt_en,
        // Schema'ya uygun mapping
        cover_image_id: postData.cover_image_id || null,
        author_name: 'Event Hubble', // Otomatik yazar
        category: postData.category,
        tags: postData.tags,
        is_published: postData.is_published || false,
        is_featured: postData.is_featured || false,
        seo_title: postData.seo_title || '',
        seo_description: postData.seo_description || '',
        created_at: editingPost ? postData.created_at : new Date().toISOString(), // Otomatik tarih
        updated_at: new Date().toISOString()
      }

      if (editingPost) {
        // Update existing post
        const response = await fetch(`${API_BASE_URL}/api/blog-posts/${editingPost.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postToSave)
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Blog post updated successfully:', result)
          await loadBlogPosts() // Reload to get updated data
          
          // Clear blog cache so changes are immediately visible on website
          CacheService.clearBlogCache()
        } else {
          const errorText = await response.text()
          console.error('Update failed:', response.status, errorText)
          throw new Error('Failed to update blog post')
        }
      } else {
        // Add new post
        const response = await fetch(`${API_BASE_URL}/api/blog-posts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(postToSave)
        })

        if (response.ok) {
          const result = await response.json()
          console.log('Blog post created successfully:', result)
          await loadBlogPosts() // Reload to get updated data
          
          // Clear blog cache so changes are immediately visible on website
          CacheService.clearBlogCache()
        } else {
          const errorText = await response.text()
          console.error('Create failed:', response.status, errorText)
          throw new Error('Failed to create blog post')
        }
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
      alert(language === 'TR' ? 'Blog yazısı kaydedilirken hata oluştu. Lütfen tekrar deneyin.' : 'Error saving blog post. Please try again.')
      // Hata durumunda localStorage'a kaydet (fallback)
      if (editingPost) {
        const updatedPosts = blogPosts.map(post => 
          post.id === editingPost.id ? { ...postData, id: post.id, date: post.date } : post
        )
        setBlogPosts(updatedPosts)
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
      } else {
        const newPost = {
          ...postData,
          id: Date.now(),
          date: new Date().toISOString(),
          author: 'Event Hubble'
        }
        const updatedPosts = [...blogPosts, newPost]
        setBlogPosts(updatedPosts)
        localStorage.setItem('blogPosts', JSON.stringify(updatedPosts))
      }
    }
    
    setShowAddModal(false)
    setEditingPost(null)
  }

  // Loading removed for better UX

  return (
    <div className="min-h-screen bg-background">
            {/* Admin Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={language === 'TR' ? 'Ana Panel' : 'Dashboard'}
              >
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {language === 'TR' ? 'Blog Yönetimi' : 'Blog Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Blog yazılarını yönet' : 'Manage blog posts'}
                </p>
              </div>
            </div>

            {/* Language and Logout */}
            <div className="flex items-center space-x-4">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <Globe className="h-4 w-4" />
                <span className="text-sm font-medium">{language}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">{language === 'TR' ? 'Çıkış' : 'Logout'}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">
                {language === 'TR' ? 'Blog Yönetimi' : 'Blog Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Blog yazılarınızı ve içeriklerinizi yönetin'
                  : 'Manage your blog posts and content'
                }
              </p>
            </div>
            <button
              onClick={handleAddPost}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Yazı' : 'Total Posts'}</p>
                <p className="text-2xl font-bold text-text">{blogPosts.length}</p>
              </div>
            </div>
          </div>
          

        </div>

        {/* Blog Posts Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-text">
              {language === 'TR' ? 'Blog Yazıları' : 'Blog Posts'}
            </h2>
          </div>
          
          {blogPosts.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {blogPosts.map((post) => (
                <div key={post.id} className="p-6 hover:bg-background-secondary transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={post.image}
                      alt={post.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          {post.category}
                        </span>
                      </div>
                      <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                        {language === 'TR' ? (post.title_tr || post.title) : (post.title_en || post.title)}
                      </h3>
                      <p className="text-text/70 text-sm mb-3 line-clamp-2">
                        {language === 'TR' ? (post.excerpt_tr || post.excerpt) : (post.excerpt_en || post.excerpt)}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-text/60">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(post.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditPost(post)}
                            className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                          </button>
                          <button
                            onClick={() => handleDeletePost(post._id || post.id)}
                            className="flex items-center space-x-1 text-text-accent hover:text-primary-light text-sm font-medium hover:bg-text-accent/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <FileText className="mx-auto h-12 w-12 text-text/30" />
              <h3 className="mt-4 text-lg font-medium text-text">
                {language === 'TR' ? 'Henüz blog yazısı yok' : 'No blog posts yet'}
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk blog yazınızı oluşturarak başlayın.'
                  : 'Get started by creating your first blog post.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddPost}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Yazı Ekle' : 'Add New Post'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>



      {/* Blog Post Modal */}
      {showAddModal && (
        <BlogPostModal 
          post={editingPost} 
          onClose={() => setShowAddModal(false)} 
          onSave={handleSavePost}
          language={language}
        />
      )}
    </div>
  )
}

const BlogPostModal = ({ post, onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    title_tr: post?.title_tr || post?.title || '',
    title_en: post?.title_en || post?.title || '',
    excerpt_tr: post?.excerpt_tr || post?.excerpt || '',
    excerpt_en: post?.excerpt_en || post?.excerpt || '',
    content_tr: post?.content_tr || post?.content || '',
    content_en: post?.content_en || post?.content || '',
    category: post?.category || 'Music',
    image: post?.image || '',
    url: post?.url || '',
    tags: post?.tags?.join(', ') || '',
    // Schema'ya uygun yeni alanlar
    is_published: post?.is_published || false,
    is_featured: post?.is_featured || false,
    seo_title: post?.seo_title || '',
    seo_description: post?.seo_description || ''
  })



  const categories = [
    { value: 'Music', label_tr: 'Müzik', label_en: 'Music' },
    { value: 'Sports', label_tr: 'Spor', label_en: 'Sports' },
    { value: 'Art', label_tr: 'Sanat', label_en: 'Art' },
    { value: 'Technology', label_tr: 'Teknoloji', label_en: 'Technology' },
    { value: 'Film', label_tr: 'Film', label_en: 'Film' },
    { value: 'Theater', label_tr: 'Tiyatro', label_en: 'Theater' },
    { value: 'Festival', label_tr: 'Festival', label_en: 'Festival' },
    { value: 'Other', label_tr: 'Diğer', label_en: 'Other' }
  ]

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave({
      ...formData,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag)
    })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {post ? (language === 'TR' ? 'Blog Yazısını Düzenle' : 'Edit Blog Post') : (language === 'TR' ? 'Yeni Blog Yazısı Ekle' : 'Add New Blog Post')}
            </h2>
            <button
              onClick={onClose}
              className="text-text/60 hover:text-text transition-colors"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Language Tabs */}
            <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg">
              <div className="flex-1 text-center py-2 px-4 bg-white rounded-md shadow-sm">
                <span className="text-sm font-medium text-text">🇹🇷 Türkçe</span>
              </div>
              <div className="flex-1 text-center py-2 px-4 bg-gray-100 rounded-md">
                <span className="text-sm font-medium text-text/60">🇺🇸 English</span>
              </div>
            </div>

            {/* Turkish Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">🇹🇷 Türkçe İçerik</h3>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Başlık (Türkçe)
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_tr}
                  onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Blog yazısı başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Özet (Türkçe)
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt_tr}
                  onChange={(e) => setFormData({ ...formData, excerpt_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                  placeholder="Kısa özet..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  İçerik (Türkçe)
                </label>
                <textarea
                  required
                  rows="8"
                  value={formData.content_tr}
                  onChange={(e) => setFormData({ ...formData, content_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                  placeholder="Blog yazısı içeriği..."
                />
              </div>
            </div>

            {/* English Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">🇺🇸 English Content</h3>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Title (English)
                </label>
                <input
                  type="text"
                  required
                  value={formData.title_en}
                  onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Blog post title..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Excerpt (English)
                </label>
                <textarea
                  required
                  rows="3"
                  value={formData.excerpt_en}
                  onChange={(e) => setFormData({ ...formData, excerpt_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                  placeholder="Brief excerpt..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Content (English)
                </label>
                <textarea
                  required
                  rows="8"
                  value={formData.content_en}
                  onChange={(e) => setFormData({ ...formData, content_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                  placeholder="Blog post content..."
                />
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">📝 Ortak Bilgiler / Common Information</h3>
              
              {/* Publishing Settings */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_published"
                    checked={formData.is_published}
                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_published" className="text-sm font-medium text-text">
                    {language === 'TR' ? '🌐 Yayınla' : '🌐 Publish'}
                  </label>
                </div>
                
                <div className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id="is_featured"
                    checked={formData.is_featured}
                    onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                    className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="is_featured" className="text-sm font-medium text-text">
                    {language === 'TR' ? '⭐ Öne Çıkar' : '⭐ Feature'}
                  </label>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Kategori' : 'Category'}
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>
                        {language === 'TR' ? category.label_tr : category.label_en}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <SearchableImageSelect
                    value={formData.image}
                    onChange={(imageUrl) => setFormData({ ...formData, image: imageUrl })}
                    label={language === 'TR' ? 'Blog Resmi' : 'Blog Image'}
                    placeholder={language === 'TR' ? 'Bir resim seçin...' : 'Select an image...'}
                    category="blog"
                    language={language}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Referans URL' : 'Reference URL'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'https://example.com/blog-post' : 'https://example.com/blog-post'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Etiketler (virgülle ayırın)' : 'Tags (separate with commas)'}
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'etkinlik, müzik, konser' : 'event, music, concert'}
                />
              </div>
              
              {/* SEO Fields */}
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'SEO Başlık' : 'SEO Title'}
                </label>
                <input
                  type="text"
                  value={formData.seo_title}
                  onChange={(e) => setFormData({ ...formData, seo_title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'SEO için özel başlık...' : 'SEO title...'}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'SEO Açıklama' : 'SEO Description'}
                </label>
                <textarea
                  rows="3"
                  value={formData.seo_description}
                  onChange={(e) => setFormData({ ...formData, seo_description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                  placeholder={language === 'TR' ? 'SEO için açıklama...' : 'SEO description...'}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4 pt-6 border-t">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 rounded-lg text-text hover:bg-gray-50 transition-colors"
              >
                {language === 'TR' ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
              >
                {post ? (language === 'TR' ? 'Güncelle' : 'Update') : (language === 'TR' ? 'Ekle' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminBlogManagementPage 