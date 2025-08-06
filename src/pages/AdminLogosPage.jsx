import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Upload, Crown, Trash2, Eye, ArrowLeft,
  Star, Download, Grid, List
} from 'lucide-react'
import { api } from '../services/api'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminLogosPage = () => {
  const [logos, setLogos] = useState([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [viewMode, setViewMode] = useState('grid')
  const { language } = useLanguage()
  const [logo, setLogo] = useState('/Logo.png')
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  useEffect(() => {
    loadLogo()
    loadLogos()
  }, [])

  const loadLogo = async () => {
    try {
              const logoUrl = await api.getLogo('main')
      setLogo(logoUrl)
    } catch (error) {
      console.error('Logo loading error:', error)
    }
  }

  const loadLogos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logos`)
      const data = await response.json()
      setLogos(data.logos || [])
    } catch (error) {
      console.error('Error loading logos:', error)
      setLogos([])
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
    formData.append('logo_id', file.name.split('.')[0].toLowerCase().replace(/[^a-z0-9]/g, '-'))
    formData.append('display_name', file.name.split('.')[0])
    formData.append('usage_context', 'header')

    try {
      const response = await fetch(`${API_BASE_URL}/api/logos/upload`, {
        method: 'POST',
        body: formData
      })

      if (response.ok) {
        await loadLogos()
        alert(language === 'TR' ? 'Logo başarıyla yüklendi!' : 'Logo uploaded successfully!')
      } else {
        throw new Error('Upload failed')
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
        method: 'DELETE'
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
    if (logoItem.file_path.startsWith('http')) {
      return logoItem.file_path
    }
    return `${API_BASE_URL}${logoItem.file_path}`
  }

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
                  {language === 'TR' ? 'Logo Yönetimi' : 'Logo Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Logo yükle ve yönet' : 'Upload and manage logos'}
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
              <div className="p-3 rounded-lg bg-purple-100">
                <Crown className="h-6 w-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Logos</p>
                <p className="text-2xl font-semibold text-gray-900">{logos.length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-green-100">
                <Star className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Active Logos</p>
                <p className="text-2xl font-semibold text-gray-900">{logos.filter(logo => logo.is_active).length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center">
              <div className="p-3 rounded-lg bg-blue-100">
                <Download className="h-6 w-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Size</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatFileSize(logos.reduce((total, logo) => total + (logo.file_size || 0), 0))}
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
                ? 'border-purple-400 bg-purple-50' 
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
              <div className="mx-auto w-16 h-16 bg-purple-100 rounded-lg flex items-center justify-center">
                <Crown className="h-8 w-8 text-purple-600" />
              </div>
              
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Logo Yükle' : 'Upload Logos'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {language === 'TR' 
                    ? 'Logo dosyalarını sürükleyip bırakın veya dosya seçin' 
                    : 'Drag and drop logo files here or click to select files'}
                </p>
                
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
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

        {/* Logos Grid/List */}
        {logos.length === 0 ? (
          <div className="text-center py-12">
            <Crown className="mx-auto h-12 w-12 text-gray-300" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No logos</h3>
            <p className="mt-1 text-sm text-gray-500">
              {language === 'TR' ? 'Henüz logo yüklenmemiş' : 'No logos uploaded yet'}
            </p>
          </div>
        ) : viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {logos.map((logoItem) => (
              <div key={logoItem.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden group">
                <div className="aspect-square relative bg-gray-50 p-4">
                  <img
                    src={getLogoUrl(logoItem)}
                    alt={logoItem.display_name || logoItem.logo_id}
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                    }}
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 space-x-2">
                      <button
                        onClick={() => window.open(getLogoUrl(logoItem), '_blank')}
                        className="p-2 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
                      >
                        <Eye className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => deleteLogo(logoItem.logo_id)}
                        className="p-2 bg-red-600 text-white rounded-lg shadow-sm hover:bg-red-700 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  {logoItem.is_active && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-green-500 rounded-full"></div>
                  )}
                </div>
                
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 truncate">{logoItem.display_name || logoItem.logo_id}</h3>
                  <p className="text-sm text-gray-500 mt-1">{logoItem.usage_context}</p>
                  <p className="text-xs text-gray-400 mt-1">{formatFileSize(logoItem.file_size)}</p>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="divide-y divide-gray-200">
              {logos.map((logoItem) => (
                <div key={logoItem.id} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
                  <div className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-gray-50 p-2">
                    <img
                      src={getLogoUrl(logoItem)}
                      alt={logoItem.display_name || logoItem.logo_id}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-medium text-gray-900 truncate">{logoItem.display_name || logoItem.logo_id}</h3>
                      {logoItem.is_active && (
                        <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                          Active
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-500">{logoItem.usage_context}</p>
                    <p className="text-xs text-gray-400">
                      {formatFileSize(logoItem.file_size)} • {logoItem.width}x{logoItem.height}px
                    </p>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => window.open(getLogoUrl(logoItem), '_blank')}
                      className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => deleteLogo(logoItem.logo_id)}
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

export default AdminLogosPage 