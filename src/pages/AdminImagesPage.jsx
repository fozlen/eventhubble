import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Image, Eye, Upload, Download, Star, Tag, Filter 
} from 'lucide-react'
import LogoService from '../services/logoService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')

const AdminImagesPage = () => {
  const [images, setImages] = useState([])
  const [filteredImages, setFilteredImages] = useState([])
  const [editingImage, setEditingImage] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const { language, setLanguage, toggleLanguage } = useLanguage()
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

  // Image categories
  const imageCategories = [
    { value: '', label_tr: 'Tümü', label_en: 'All' },
    { value: 'hero', label_tr: 'Hero Görselleri', label_en: 'Hero Images' },
    { value: 'icon', label_tr: 'İkonlar', label_en: 'Icons' },
    { value: 'category', label_tr: 'Kategori Görselleri', label_en: 'Category Images' },
    { value: 'event', label_tr: 'Etkinlik Görselleri', label_en: 'Event Images' },
    { value: 'blog', label_tr: 'Blog Görselleri', label_en: 'Blog Images' },
    { value: 'gallery', label_tr: 'Galeri', label_en: 'Gallery' },
    { value: 'banner', label_tr: 'Banner', label_en: 'Banner' }
  ]

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

    loadImages()
  }, [navigate])

  // Filter images when category changes
  useEffect(() => {
    if (selectedCategory === '') {
      setFilteredImages(images)
    } else {
      setFilteredImages(images.filter(image => image.category === selectedCategory))
    }
  }, [selectedCategory, images])

  const loadImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setImages(result.images || [])
        }
      }
    } catch (error) {
      console.error('Error loading images:', error)
    } finally {
      // Loading removed for better UX
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const handleAddImage = () => {
    setEditingImage(null)
    setShowAddModal(true)
  }

  const handleEditImage = (image) => {
    setEditingImage(image)
    setShowAddModal(true)
  }

  const handleDeleteImage = async (imageId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu resmi silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this image?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          loadImages()
          alert(language === 'TR' ? 'Resim başarıyla silindi!' : 'Image deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting image:', error)
        alert(language === 'TR' ? 'Resim silinirken hata oluştu!' : 'Error deleting image!')
      }
    }
  }

  const handleSaveImage = async (imageData) => {
    try {
      const url = editingImage 
        ? `${API_BASE_URL}/api/images/${editingImage.image_id}`
        : `${API_BASE_URL}/api/images`
      
      const method = editingImage ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(imageData)
      })

      if (response.ok) {
        loadImages()
        setShowAddModal(false)
        setEditingImage(null)
        alert(editingImage 
          ? (language === 'TR' ? 'Resim başarıyla güncellendi!' : 'Image updated successfully!')
          : (language === 'TR' ? 'Resim başarıyla eklendi!' : 'Image added successfully!')
        )
      }
    } catch (error) {
      console.error('Error saving image:', error)
      alert(language === 'TR' ? 'Resim kaydedilirken hata oluştu!' : 'Error saving image!')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const getCategoryStats = () => {
    const stats = {}
    images.forEach(image => {
      const category = image.category || 'uncategorized'
      stats[category] = (stats[category] || 0) + 1
    })
    return stats
  }

  // Loading removed for better UX

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <span className="text-xl font-bold">
                  <span className="text-white">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
                <span className="ml-2 text-sm text-white/80">Admin Panel</span>
              </div>
            </div>

            {/* Admin Navigation */}
            <nav className="hidden lg:flex items-center space-x-6">
              <a href="/" className="text-white/80 hover:text-white transition-colors text-sm">
                {language === 'TR' ? 'Site' : 'Site'}
              </a>
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'TR' ? 'Blog' : 'Blog'}
              </button>
              <button 
                onClick={() => navigate('/admin/events')}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'TR' ? 'Etkinlikler' : 'Events'}
              </button>
              <button 
                onClick={() => navigate('/admin/categories')}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'TR' ? 'Kategoriler' : 'Categories'}
              </button>
              <button className="text-white transition-colors text-sm font-medium">
                {language === 'TR' ? 'Resimler' : 'Images'}
              </button>
              <button 
                onClick={() => navigate('/admin/logos')}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'TR' ? 'Logolar' : 'Logos'}
              </button>
              <button 
                onClick={() => navigate('/admin/settings')}
                className="text-white/80 hover:text-white transition-colors"
                title={language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
              >
                <Settings className="h-5 w-5" />
              </button>
            </nav>

            {/* Language and Logout */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
                title={language === 'TR' ? 'Language' : 'Dil'}
              >
                <Globe size={16} />
                <span className="text-sm">{language}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-white/80 hover:text-white transition-colors"
                title={language === 'TR' ? 'Çıkış Yap' : 'Logout'}
              >
                <LogOut size={16} />
                <span className="text-sm hidden sm:inline">{language === 'TR' ? 'Çıkış' : 'Logout'}</span>
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
                {language === 'TR' ? 'Resim Yönetimi' : 'Image Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Site resimlerini ve medya içeriklerini yönetin'
                  : 'Manage site images and media content'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              {/* Category Filter */}
              <div className="flex items-center space-x-2">
                <Filter className="h-5 w-5 text-text/60" />
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                >
                  {imageCategories.map(category => (
                    <option key={category.value} value={category.value}>
                      {language === 'TR' ? category.label_tr : category.label_en}
                    </option>
                  ))}
                </select>
              </div>
              
              <button
                onClick={handleAddImage}
                className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">{language === 'TR' ? 'Yeni Resim Ekle' : 'Add New Image'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Resim' : 'Total Images'}</p>
                <p className="text-2xl font-bold text-text">{images.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Aktif Resim' : 'Active Images'}</p>
                <p className="text-2xl font-bold text-text">{images.filter(image => image.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Boyut' : 'Total Size'}</p>
                <p className="text-2xl font-bold text-text">
                  {formatFileSize(images.reduce((total, image) => total + (image.file_size || 0), 0))}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-purple-100 rounded-lg">
                <Tag className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Kategori' : 'Categories'}</p>
                <p className="text-2xl font-bold text-text">{Object.keys(getCategoryStats()).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Images Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-text">
                {language === 'TR' ? 'Resim Listesi' : 'Image List'}
              </h2>
              {selectedCategory && (
                <span className="text-sm text-text/60">
                  {filteredImages.length} {language === 'TR' ? 'resim gösteriliyor' : 'images shown'}
                </span>
              )}
            </div>
          </div>
          
          {filteredImages.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 p-6">
              {filteredImages.map((image) => (
                <div key={image.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col space-y-4">
                    {/* Image Preview */}
                    <div className="bg-white rounded-lg p-2 flex items-center justify-center h-40 border">
                      <img
                        src={image.file_path.startsWith('http') ? image.file_path : `${API_BASE_URL}${image.file_path}`}
                        alt={image.alt_text}
                        className="max-h-full max-w-full object-contain rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                        }}
                      />
                    </div>
                    
                    {/* Image Info */}
                    <div className="space-y-2">
                      <div className="flex items-start justify-between">
                        <h3 className="font-semibold text-text truncate pr-2">{image.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium flex-shrink-0 ${
                          image.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {image.is_active 
                            ? (language === 'TR' ? 'Aktif' : 'Active')
                            : (language === 'TR' ? 'Pasif' : 'Inactive')
                          }
                        </span>
                      </div>
                      
                      {image.category && (
                        <span className="inline-block px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {imageCategories.find(cat => cat.value === image.category)?.[language === 'TR' ? 'label_tr' : 'label_en'] || image.category}
                        </span>
                      )}
                      
                      <div className="text-xs text-text/60 space-y-1">
                        <p><strong>ID:</strong> {image.image_id}</p>
                        <p><strong>{language === 'TR' ? 'Dosya' : 'File'}:</strong> {image.filename}</p>
                        <p><strong>{language === 'TR' ? 'Boyut' : 'Size'}:</strong> {formatFileSize(image.file_size)}</p>
                        {image.width && image.height && (
                          <p><strong>{language === 'TR' ? 'Boyutlar' : 'Dimensions'}:</strong> {image.width}x{image.height}px</p>
                        )}
                        {image.tags && image.tags.length > 0 && (
                          <p><strong>{language === 'TR' ? 'Etiketler' : 'Tags'}:</strong> {image.tags.join(', ')}</p>
                        )}
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleEditImage(image)}
                          className="flex items-center space-x-1 text-primary hover:text-primary-light text-xs font-medium hover:bg-primary/10 px-2 py-1 rounded-md transition-colors flex-1 justify-center"
                        >
                          <Edit className="h-3 w-3" />
                          <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteImage(image.image_id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-xs font-medium hover:bg-red-50 px-2 py-1 rounded-md transition-colors flex-1 justify-center"
                        >
                          <Trash2 className="h-3 w-3" />
                          <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Image className="mx-auto h-12 w-12 text-text/30" />
              <h3 className="mt-4 text-lg font-medium text-text">
                {selectedCategory 
                  ? (language === 'TR' ? 'Bu kategoride resim yok' : 'No images in this category')
                  : (language === 'TR' ? 'Henüz resim yok' : 'No images yet')
                }
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk resminizi ekleyerek başlayın.'
                  : 'Get started by adding your first image.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddImage}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Resim Ekle' : 'Add New Image'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Image Modal */}
      {showAddModal && (
        <ImageModal 
          image={editingImage} 
          onClose={() => setShowAddModal(false)} 
          onSave={handleSaveImage}
          language={language}
          categories={imageCategories}
        />
      )}
    </div>
  )
}

const ImageModal = ({ image, onClose, onSave, language = 'EN', categories }) => {
  const [formData, setFormData] = useState({
    image_id: image?.image_id || '',
    category: image?.category || '',
    title: image?.title || image?.title_tr || image?.title_en || '',
    alt_text: image?.alt_text || image?.alt_text_tr || image?.alt_text_en || '',
    filename: image?.filename || '',
    file_path: image?.file_path || '',
    file_size: image?.file_size || '',
    mime_type: image?.mime_type || '',
    width: image?.width || '',
    height: image?.height || '',
    tags: image?.tags?.join(', ') || '',
    metadata: image?.metadata ? JSON.stringify(image.metadata, null, 2) : '{}',
    is_active: image?.is_active !== undefined ? image.is_active : true
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Parse metadata
    let metadata = {}
    try {
      metadata = JSON.parse(formData.metadata)
    } catch (e) {
      alert(language === 'TR' ? 'Geçersiz JSON formatı!' : 'Invalid JSON format!')
      return
    }
    
    // Convert fields to match database schema
    const imageData = {
      ...formData,
      file_size: formData.file_size ? parseInt(formData.file_size) : null,
      width: formData.width ? parseInt(formData.width) : null,
      height: formData.height ? parseInt(formData.height) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      metadata
    }
    
    onSave(imageData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {image ? (language === 'TR' ? 'Resim Düzenle' : 'Edit Image') : (language === 'TR' ? 'Yeni Resim Ekle' : 'Add New Image')}
            </h2>
            <button
              onClick={onClose}
              className="text-text/60 hover:text-text transition-colors"
            >
              <X className="h-6 w-6" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Resim ID' : 'Image ID'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.image_id}
                  onChange={(e) => setFormData({ ...formData, image_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="hero_main, category_music..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kategori' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {categories.filter(cat => cat.value !== '').map(category => (
                    <option key={category.value} value={category.value}>
                      {language === 'TR' ? category.label_tr : category.label_en}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Turkish Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">🇹🇷 Türkçe İçerik</h3>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Başlık (Türkçe) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Ana Sayfa Hero Görseli"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Alt Metin (Türkçe)
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Resim açıklaması..."
                />
              </div>
            </div>

            {/* English Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">🇺🇸 English Content</h3>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Title (English) *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Homepage Hero Image"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Alt Text (English)
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="Image description..."
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">
                {language === 'TR' ? 'Teknik Detaylar' : 'Technical Details'}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Dosya Adı' : 'Filename'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.filename}
                    onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="hero-events-main.jpg"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Dosya Yolu' : 'File Path'} *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.file_path}
                    onChange={(e) => setFormData({ ...formData, file_path: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="/images/hero/hero-events-main.jpg"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Dosya Boyutu (bytes)' : 'File Size (bytes)'}
                  </label>
                  <input
                    type="number"
                    value={formData.file_size}
                    onChange={(e) => setFormData({ ...formData, file_size: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="1024000"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Genişlik (px)' : 'Width (px)'}
                  </label>
                  <input
                    type="number"
                    value={formData.width}
                    onChange={(e) => setFormData({ ...formData, width: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="1920"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Yükseklik (px)' : 'Height (px)'}
                  </label>
                  <input
                    type="number"
                    value={formData.height}
                    onChange={(e) => setFormData({ ...formData, height: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="1080"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'MIME Tipi' : 'MIME Type'}
                  </label>
                  <select
                    value={formData.mime_type}
                    onChange={(e) => setFormData({ ...formData, mime_type: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  >
                    <option value="">Seçiniz / Select</option>
                    <option value="image/png">PNG</option>
                    <option value="image/jpeg">JPEG</option>
                    <option value="image/jpg">JPG</option>
                    <option value="image/svg+xml">SVG</option>
                    <option value="image/webp">WebP</option>
                    <option value="image/gif">GIF</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Etiketler (virgülle ayırın)' : 'Tags (comma separated)'}
                  </label>
                  <input
                    type="text"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="hero, main, featured"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Metadata (JSON)' : 'Metadata (JSON)'}
                </label>
                <textarea
                  rows="4"
                  value={formData.metadata}
                  onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none font-mono text-sm"
                  placeholder='{"description": "Additional metadata"}'
                />
              </div>

              <div>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                    className="rounded border-gray-300 text-primary focus:ring-primary"
                  />
                  <span className="text-sm font-medium text-text">
                    {language === 'TR' ? 'Aktif' : 'Active'}
                  </span>
                </label>
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
                {image ? (language === 'TR' ? 'Güncelle' : 'Update') : (language === 'TR' ? 'Ekle' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminImagesPage 