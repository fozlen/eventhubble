import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Upload, Image as ImageIcon, Trash2, Eye, ArrowLeft,
  Camera, Download, Grid, List
} from 'lucide-react'
import LogoService from '../services/logoService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminImagesPage = () => {
  const [images, setImages] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('')
  const [viewMode, setViewMode] = useState('grid') // 'grid' or 'list'
  const { language } = useLanguage()
  const [logo, setLogo] = useState('/Logo.png')
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  // Image categories
  const categories = [
    { value: '', label: 'All Images' },
    { value: 'event', label: 'Event Images' },
    { value: 'blog', label: 'Blog Images' },
    { value: 'hero', label: 'Hero Images' },
    { value: 'gallery', label: 'Gallery Images' },
    { value: 'banner', label: 'Banners' }
  ]

  useEffect(() => {
    loadLogo()
    loadImages()
  }, [])

  const loadLogo = async () => {
    try {
      const logoUrl = await LogoService.getLogo('main')
      setLogo(logoUrl)
    } catch (error) {
      console.error('Logo loading error:', error)
    }
  }

  const loadImages = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/images`)
      const data = await response.json()
      setImages(data.images || [])
    } catch (error) {
      console.error('Error loading images:', error)
      setImages([])
    }
  }

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      Array.from(files).forEach(file => uploadImage(file))
    }
  }

  const uploadImage = async (file) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('image', file)
    formData.append('title', file.name.split('.')[0])
    formData.append('category', selectedCategory || 'gallery')
    formData.append('alt_text', `${file.name.split('.')[0]} image`)

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        const result = await response.json()
        await loadImages() // Reload images
        alert(language === 'TR' ? 'Resim başarıyla yüklendi!' : 'Image uploaded successfully!')
      } else {
        throw new Error('Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(language === 'TR' ? 'Resim yüklenirken hata oluştu!' : 'Error uploading image!')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteImage = async (imageId) => {
    if (!window.confirm(language === 'TR' ? 'Bu resmi silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this image?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/images/${imageId}`, {
        method: 'DELETE'
      })

      if (response.ok) {
        await loadImages()
        alert(language === 'TR' ? 'Resim başarıyla silindi!' : 'Image deleted successfully!')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(language === 'TR' ? 'Resim silinirken hata oluştu!' : 'Error deleting image!')
    }
  }

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelect(e.dataTransfer.files)
    }
  }

  const getImageUrl = (image) => {
    if (image.file_path.startsWith('http')) {
      return image.file_path
    }
    return `${API_BASE_URL}${image.file_path}`
  }

  const filteredImages = selectedCategory 
    ? images.filter(img => img.category === selectedCategory)
    : images

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

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
                <ArrowLeft className="h-5 w-5" />
              </button>
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {language === 'TR' ? 'Resim Yönetimi' : 'Image Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Resim yükle ve yönet' : 'Upload and manage images'}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* View Mode Toggle */}
              <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'grid' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === 'list' ? 'bg-white shadow-sm' : 'hover:bg-gray-200'
                  }`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <ImageIcon className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Images</p>
                <p className="text-2xl font-semibold text-gray-900">{images.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Camera className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-2xl font-semibold text-gray-900">{categories.length - 1}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-purple-100">
                <Download className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatFileSize(images.reduce((total, img) => total + (img.file_size || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Upload Area */}
        <div className="mb-8">
          <div
            className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
              dragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept="image/*"
              onChange={(e) => handleFileSelect(e.target.files)}
              className="hidden"
            />
            
            <div className="space-y-4">
              <div className="mx-auto w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Resim Yükle' : 'Upload Images'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'TR' 
                    ? 'Resimleri sürükleyip bırakın veya dosya seçin' 
                    : 'Drag and drop images here or click to select files'}
                </p>
                
                <div className="flex items-center justify-center space-x-4">
                  <select
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                  
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isUploading}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {isUploading 
                      ? (language === 'TR' ? 'Yükleniyor...' : 'Uploading...') 
                      : (language === 'TR' ? 'Dosya Seç' : 'Select Files')
                    }
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Category Filter */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category.value}
                onClick={() => setSelectedCategory(category.value)}
                className={`px-4 py-2 rounded-lg border transition-colors ${
                  selectedCategory === category.value
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-700 border-gray-300 hover:border-gray-400'
                }`}
              >
                {category.label}
              </button>
            ))}
          </div>
        </div>

        {/* Images Grid/List */}
        {filteredImages.length === 0 ? (
          <div className="text-center py-12">
            <ImageIcon className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No images</h3>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'TR' ? 'Henüz resim yüklenmemiş' : 'No images uploaded yet'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {filteredImages.map((image) => (
              <div key={image.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                <div className="aspect-square relative">
                  <img
                    src={getImageUrl(image)}
                    alt={image.alt_text || image.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                      <button
                        onClick={() => window.open(getImageUrl(image), '_blank')}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteImage(image.image_id)}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                  <p className="text-sm text-gray-500 mt-1">{image.category}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatFileSize(image.file_size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {filteredImages.map((image) => (
                <div key={image.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                    <img
                      src={getImageUrl(image)}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-gray-900 truncate">{image.title}</h3>
                    <p className="text-sm text-gray-500">{image.category}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(image.file_size)} • {image.width}x{image.height}px
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(getImageUrl(image), '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteImage(image.image_id)}
                      className="p-2 text-red-400 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default AdminImagesPage 