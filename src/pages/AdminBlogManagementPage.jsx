import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Megaphone, BarChart3, Tag, Eye, Calendar, User, FileText, ArrowLeft 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import SearchableImageSelect from '../components/SearchableImageSelect'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminBlogManagementPage = () => {
  const [blogPosts, setBlogPosts] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingPost, setEditingPost] = useState(null)
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  // Load logo
  useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoData = await api.getActiveLogo('main')
        setLogo(logoData?.url || '/assets/Logo.png')
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }
    loadLogo()
  }, [])

  // Load blog posts
  useEffect(() => {
    loadBlogPosts()
  }, [])

  const loadBlogPosts = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/blogs`)
      if (response.ok) {
        const result = await response.json()
        setBlogPosts(result.data || [])
      } else {
        console.error('API Error:', response.status, response.statusText)
        setBlogPosts([])
      }
    } catch (error) {
      console.error('Error loading blog posts:', error)
      setBlogPosts([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    navigate('/admin/dashboard')
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
        const response = await fetch(`${API_BASE_URL}/api/blogs/${postId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setBlogPosts(blogPosts.filter(post => post.id !== postId))
        } else {
          console.error('Delete failed:', response.status)
        }
      } catch (error) {
        console.error('Error deleting blog post:', error)
      }
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return '-'
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getDefaultImageByCategory = (category) => {
    const categoryImages = {
      'technology': 'https://via.placeholder.com/400x200/3B82F6/FFFFFF?text=Technology',
      'lifestyle': 'https://via.placeholder.com/400x200/10B981/FFFFFF?text=Lifestyle',
      'business': 'https://via.placeholder.com/400x200/F59E0B/FFFFFF?text=Business',
      'default': 'https://via.placeholder.com/400x200/6B7280/FFFFFF?text=Blog+Post'
    }
    return categoryImages[category?.toLowerCase()] || categoryImages.default
  }

  const handleSavePost = async (postData) => {
    try {
      const url = editingPost 
        ? `${API_BASE_URL}/api/blogs/${editingPost.id}`
        : `${API_BASE_URL}/api/blogs`
      
      const method = editingPost ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(postData)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (editingPost) {
          setBlogPosts(blogPosts.map(post => 
            post.id === editingPost.id ? result.data : post
          ))
        } else {
          setBlogPosts([...blogPosts, result.data])
        }
        setShowAddModal(false)
        setEditingPost(null)
      } else {
        console.error('Save failed:', response.status)
      }
    } catch (error) {
      console.error('Error saving blog post:', error)
    }
  }

  const stats = [
    {
      title: language === 'TR' ? 'Toplam Yazı' : 'Total Posts',
      value: blogPosts.length,
      icon: FileText,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Yayında' : 'Published',
      value: blogPosts.filter(post => post.status === 'published').length,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'Taslak' : 'Draft',
      value: blogPosts.filter(post => post.status === 'draft').length,
      icon: Edit,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-50'
    },
    {
      title: language === 'TR' ? 'Kategoriler' : 'Categories',
      value: [...new Set(blogPosts.map(post => post.category).filter(Boolean))].length,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/admin/dashboard')}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeft className="h-5 w-5 text-gray-600" />
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
        <div className="flex justify-between items-center mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {language === 'TR' ? 'Blog Yönetimi' : 'Blog Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'TR' ? 'Blog yazılarınızı yönetin ve düzenleyin' : 'Manage and edit your blog posts'}
            </p>
          </div>
          <button
            onClick={handleAddPost}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{language === 'TR' ? '+ Yeni Yazı' : '+ Add New Post'}</span>
          </button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => {
            const Icon = stat.icon
            return (
              <div key={index} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                    {isLoading ? (
                      <div className="w-12 h-8 bg-gray-200 rounded animate-pulse"></div>
                    ) : (
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    )}
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Blog Posts Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'TR' ? 'Blog Yazıları' : 'Blog Posts'}
            </h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : blogPosts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Henüz blog yazısı yok' : 'No blog posts yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === 'TR' ? 'İlk blog yazınızı oluşturarak başlayın.' : 'Get started by creating your first blog post.'}
                </p>
                <button
                  onClick={handleAddPost}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'TR' ? '+ Yeni Yazı' : '+ Add New Post'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {blogPosts.map((post) => (
                  <div key={post.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={post.image_url || getDefaultImageByCategory(post.category)}
                        alt={post.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{post.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(post.created_at)}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        post.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {post.status === 'published' ? (language === 'TR' ? 'Yayında' : 'Published') : (language === 'TR' ? 'Taslak' : 'Draft')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditPost(post)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeletePost(post.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Sil' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Blog Post Modal */}
      {showAddModal && (
        <BlogPostModal
          post={editingPost}
          onClose={() => {
            setShowAddModal(false)
            setEditingPost(null)
          }}
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
    cover_image_id: post?.cover_image_id || null,
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
                    onChange={(imageUrl, imageId) => setFormData({ 
                      ...formData, 
                      image: imageUrl,
                      cover_image_id: imageId 
                    })}
                    label={language === 'TR' ? 'Blog Resmi' : 'Blog Image'}
                    placeholder={language === 'TR' ? 'Bir resim seçin...' : 'Select an image...'}
                    category={null}
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