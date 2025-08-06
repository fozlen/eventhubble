import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Upload, Crown, Trash2, Eye, ArrowLeft,
  Star, Download, Grid, List, Globe, Settings, LogOut
} from 'lucide-react'
import { api } from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminLogosPage = () => {
  const [logos, setLogos] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [dragActive, setDragActive] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadLogo()
    loadLogos()
  }, [])

  const loadLogo = async () => {
    try {
      const logoData = await api.getActiveLogo('main')
      setLogo(logoData?.url || '/assets/Logo.png')
    } catch (error) {
      console.error('Logo loading error:', error)
    }
  }

  const loadLogos = async () => {
    try {
      setIsLoading(true)
      const response = await fetch(`${API_BASE_URL}/api/logos`)
      const result = await response.json()
      setLogos(result.data || [])
    } catch (error) {
      console.error('Error loading logos:', error)
      setLogos([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileSelect = (files) => {
    if (files && files.length > 0) {
      Array.from(files).forEach(file => uploadLogo(file))
    }
  }

  const uploadLogo = async (file) => {
    setIsUploading(true)
    const formData = new FormData()
    formData.append('logo', file)
    formData.append('variant', 'main')
    formData.append('title', file.name.split('.')[0])
    formData.append('alt_text', `Logo - ${file.name}`)
    formData.append('is_active', 'true')

    try {
      const response = await fetch(`${API_BASE_URL}/api/logos`, {
        method: 'POST',
        credentials: 'include',
        body: formData
      })

      if (response.ok) {
        await loadLogos()
        alert(language === 'TR' ? 'Logo başarıyla yüklendi!' : 'Logo uploaded successfully!')
      } else {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Upload failed')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert(language === 'TR' ? 'Logo yüklenirken hata oluştu!' : 'Error uploading logo!')
    } finally {
      setIsUploading(false)
    }
  }

  const deleteLogo = async (logoId) => {
    if (!window.confirm(language === 'TR' ? 'Bu logoyu silmek istediğinizden emin misiniz?' : 'Are you sure you want to delete this logo?')) {
      return
    }

    try {
      const response = await fetch(`${API_BASE_URL}/api/logos/${logoId}`, {
        method: 'DELETE',
        credentials: 'include'
      })

      if (response.ok) {
        await loadLogos()
        alert(language === 'TR' ? 'Logo başarıyla silindi!' : 'Logo deleted successfully!')
      } else {
        throw new Error('Delete failed')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert(language === 'TR' ? 'Logo silinirken hata oluştu!' : 'Error deleting logo!')
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

  const getLogoUrl = (logoItem) => {
    if (logoItem.url && logoItem.url.startsWith('http')) {
      return logoItem.url
    }
    return logoItem.url || 'https://placehold.co/300x100/6B7280/FFFFFF?text=Logo'
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
  }

  const stats = [
    {
      title: language === 'TR' ? 'Toplam Logo' : 'Total Logos',
      value: logos.length,
      icon: Star,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Aktif Logo' : 'Active Logos',
      value: logos.filter(logo => logo.is_active).length,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'Ana Logo' : 'Main Logos',
      value: logos.filter(logo => logo.variant === 'main').length,
      icon: Crown,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'TR' ? 'Footer Logo' : 'Footer Logos',
      value: logos.filter(logo => logo.variant === 'footer').length,
      icon: Download,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
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
                  {language === 'TR' ? 'Logo Yönetimi' : 'Logo Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Logoları yönet' : 'Manage logos'}
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
                onClick={() => navigate('/admin/dashboard')}
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
              {language === 'TR' ? 'Logo Yönetimi' : 'Logo Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'TR' ? 'Site logolarınızı yönetin ve düzenleyin' : 'Manage and edit your site logos'}
            </p>
          </div>
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

        {/* Upload Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'TR' ? 'Logo Yükle' : 'Upload Logo'}
            </h3>
          </div>
          
          <div className="p-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive ? 'border-purple-500 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {language === 'TR' ? 'Logo dosyasını sürükleyin veya seçin' : 'Drag and drop logo file or click to select'}
              </p>
              <p className="text-sm text-gray-500 mb-4">
                {language === 'TR' ? 'PNG, JPG, SVG dosyaları desteklenir' : 'PNG, JPG, SVG files are supported'}
              </p>
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
                className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
              >
                <Upload className="h-4 w-4" />
                <span>
                  {isUploading 
                    ? (language === 'TR' ? 'Yükleniyor...' : 'Uploading...')
                    : (language === 'TR' ? 'Dosya Seç' : 'Select File')
                  }
                </span>
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                multiple
                onChange={(e) => handleFileSelect(e.target.files)}
                className="hidden"
              />
            </div>
          </div>
        </div>

        {/* Logos Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'TR' ? 'Mevcut Logolar' : 'Current Logos'}
              </h3>
              
              <div className="flex space-x-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded ${viewMode === 'grid' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <Grid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded ${viewMode === 'list' ? 'bg-purple-100 text-purple-600' : 'text-gray-400 hover:text-gray-600'}`}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : logos.length === 0 ? (
              <div className="text-center py-12">
                <Star className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Henüz logo yok' : 'No logos yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === 'TR' ? 'İlk logonuzu yükleyerek başlayın.' : 'Get started by uploading your first logo.'}
                </p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>{language === 'TR' ? '+ Logo Yükle' : '+ Upload Logo'}</span>
                </button>
              </div>
            ) : viewMode === 'grid' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {logos.map((logoItem) => (
                  <div key={logoItem.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="aspect-video bg-white rounded-lg mb-4 overflow-hidden flex items-center justify-center">
                      <img
                        src={getLogoUrl(logoItem)}
                        alt={logoItem.alt_text || logoItem.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2">{logoItem.title}</h4>
                    <p className="text-sm text-gray-600 mb-3">{logoItem.alt_text}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span className="capitalize">{logoItem.variant}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        logoItem.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {logoItem.is_active ? (language === 'TR' ? 'Aktif' : 'Active') : (language === 'TR' ? 'Pasif' : 'Inactive')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(getLogoUrl(logoItem), '_blank')}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Görüntüle' : 'View'}</span>
                      </button>
                      <button
                        onClick={() => deleteLogo(logoItem.id)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Sil' : 'Delete'}</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-4">
                {logos.map((logoItem) => (
                  <div key={logoItem.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
                    <div className="w-20 h-20 bg-white rounded-lg overflow-hidden flex items-center justify-center flex-shrink-0">
                      <img
                        src={getLogoUrl(logoItem)}
                        alt={logoItem.alt_text || logoItem.title}
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900">{logoItem.title}</h4>
                      <p className="text-sm text-gray-600">{logoItem.alt_text}</p>
                      <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                        <span className="capitalize">{logoItem.variant}</span>
                        <span className={`px-2 py-1 rounded-full ${
                          logoItem.is_active ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {logoItem.is_active ? (language === 'TR' ? 'Aktif' : 'Active') : (language === 'TR' ? 'Pasif' : 'Inactive')}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => window.open(getLogoUrl(logoItem), '_blank')}
                        className="flex items-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Eye className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Görüntüle' : 'View'}</span>
                      </button>
                      <button
                        onClick={() => deleteLogo(logoItem.id)}
                        className="flex items-center space-x-1 px-3 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
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
    </div>
  )
}

export default AdminLogosPage 