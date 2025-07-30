import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Image, Eye, Upload, Download, Star, Tag 
} from 'lucide-react'
import LogoService from '../services/logoService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')

const AdminLogosPage = () => {
  const [logos, setLogos] = useState([])
  const [editingLogo, setEditingLogo] = useState(null)
  const [showAddModal, setShowAddModal] = useState(false)
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

    loadLogos()
  }, [navigate])

  const loadLogos = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/logos`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setLogos(result.logos || [])
        }
      }
    } catch (error) {
      console.error('Error loading logos:', error)
    } finally {
      // Loading removed for better UX
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }



  const handleAddLogo = () => {
    setEditingLogo(null)
    setShowAddModal(true)
  }

  const handleEditLogo = (logo) => {
    setEditingLogo(logo)
    setShowAddModal(true)
  }

  const handleDeleteLogo = async (logoId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu logoyu silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this logo?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/logos/${logoId}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          loadLogos()
          alert(language === 'TR' ? 'Logo başarıyla silindi!' : 'Logo deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting logo:', error)
        alert(language === 'TR' ? 'Logo silinirken hata oluştu!' : 'Error deleting logo!')
      }
    }
  }

  const handleSaveLogo = async (logoData) => {
    try {
      const url = editingLogo 
        ? `${API_BASE_URL}/api/logos/${editingLogo.logo_id}`
        : `${API_BASE_URL}/api/logos`
      
      const method = editingLogo ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(logoData)
      })

      if (response.ok) {
        loadLogos()
        setShowAddModal(false)
        setEditingLogo(null)
        alert(editingLogo 
          ? (language === 'TR' ? 'Logo başarıyla güncellendi!' : 'Logo updated successfully!')
          : (language === 'TR' ? 'Logo başarıyla eklendi!' : 'Logo added successfully!')
        )
      }
    } catch (error) {
      console.error('Error saving logo:', error)
      alert(language === 'TR' ? 'Logo kaydedilirken hata oluştu!' : 'Error saving logo!')
    }
  }

  const formatFileSize = (bytes) => {
    if (!bytes) return 'N/A'
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(1024))
    return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i]
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
              <div className="text-white">
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
              <button 
                onClick={() => navigate('/admin/images')}
                className="text-white/80 hover:text-white transition-colors text-sm"
              >
                {language === 'TR' ? 'Resimler' : 'Images'}
              </button>
              <button className="text-white transition-colors text-sm font-medium">
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
                {language === 'TR' ? 'Logo Yönetimi' : 'Logo Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Site logoları ve marka kimliği elementlerini yönetin'
                  : 'Manage site logos and brand identity elements'
                }
              </p>
            </div>
            <button
              onClick={handleAddLogo}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Logo Ekle' : 'Add New Logo'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Image className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Logo' : 'Total Logos'}</p>
                <p className="text-2xl font-bold text-text">{logos.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-100 rounded-lg">
                <Eye className="h-6 w-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Aktif Logo' : 'Active Logos'}</p>
                <p className="text-2xl font-bold text-text">{logos.filter(logo => logo.is_active).length}</p>
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
                  {formatFileSize(logos.reduce((total, logo) => total + (logo.file_size || 0), 0))}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Logos Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-semibold text-text">
              {language === 'TR' ? 'Logo Listesi' : 'Logo List'}
            </h2>
          </div>
          
          {logos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {logos.map((logo) => (
                <div key={logo.id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
                  <div className="flex flex-col space-y-4">
                    {/* Logo Preview */}
                    <div className="bg-white rounded-lg p-4 flex items-center justify-center h-32 border">
                      <img
                        src={`${API_BASE_URL}/assets/${logo.filename}`}
                        alt={logo.alt_text}
                        className="max-h-full max-w-full object-contain"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                        }}
                      />
                    </div>
                    
                    {/* Logo Info */}
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-text truncate">{logo.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          logo.is_active 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {logo.is_active 
                            ? (language === 'TR' ? 'Aktif' : 'Active')
                            : (language === 'TR' ? 'Pasif' : 'Inactive')
                          }
                        </span>
                      </div>
                      
                      <div className="text-sm text-text/60 space-y-1">
                        <p><strong>ID:</strong> {logo.logo_id}</p>
                        <p><strong>{language === 'TR' ? 'Dosya' : 'File'}:</strong> {logo.filename}</p>
                        <p><strong>{language === 'TR' ? 'Boyut' : 'Size'}:</strong> {formatFileSize(logo.file_size)}</p>
                        {logo.width && logo.height && (
                          <p><strong>{language === 'TR' ? 'Boyutlar' : 'Dimensions'}:</strong> {logo.width}x{logo.height}px</p>
                        )}
                        <p><strong>{language === 'TR' ? 'Sıralama' : 'Order'}:</strong> {logo.display_order}</p>
                      </div>
                      
                      {/* Actions */}
                      <div className="flex space-x-2 pt-2">
                        <button
                          onClick={() => handleEditLogo(logo)}
                          className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors flex-1 justify-center"
                        >
                          <Edit className="h-4 w-4" />
                          <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                        </button>
                        <button
                          onClick={() => handleDeleteLogo(logo.logo_id)}
                          className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-colors flex-1 justify-center"
                        >
                          <Trash2 className="h-4 w-4" />
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
                {language === 'TR' ? 'Henüz logo yok' : 'No logos yet'}
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk logonuzu ekleyerek başlayın.'
                  : 'Get started by adding your first logo.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddLogo}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Logo Ekle' : 'Add New Logo'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Logo Modal */}
      {showAddModal && (
        <LogoModal 
          logo={editingLogo} 
          onClose={() => setShowAddModal(false)} 
          onSave={handleSaveLogo}
          language={language}
        />
      )}
    </div>
  )
}

const LogoModal = ({ logo, onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    logo_id: logo?.logo_id || '',
    filename: logo?.filename || '',
    title: logo?.title || logo?.title_tr || logo?.title_en || '',
    alt_text: logo?.alt_text || logo?.alt_text_tr || logo?.alt_text_en || '',
    file_path: logo?.file_path || '',
    file_size: logo?.file_size || '',
    mime_type: logo?.mime_type || '',
    width: logo?.width || '',
    height: logo?.height || '',
    is_active: logo?.is_active !== undefined ? logo.is_active : true,
    display_order: logo?.display_order || 0
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert numeric fields - match database schema
    const logoData = {
      ...formData,
      file_size: formData.file_size ? parseInt(formData.file_size) : null,
      width: formData.width ? parseInt(formData.width) : null,
      height: formData.height ? parseInt(formData.height) : null,
      display_order: parseInt(formData.display_order) || 0
    }
    
    onSave(logoData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {logo ? (language === 'TR' ? 'Logo Düzenle' : 'Edit Logo') : (language === 'TR' ? 'Yeni Logo Ekle' : 'Add New Logo')}
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
                  {language === 'TR' ? 'Logo ID' : 'Logo ID'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.logo_id}
                  onChange={(e) => setFormData({ ...formData, logo_id: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder="main, dark, light..."
                />
              </div>

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
                  placeholder="Logo.png"
                />
              </div>
            </div>

            {/* Logo Details - Single Language Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">
                {language === 'TR' ? 'Logo Bilgileri' : 'Logo Information'}
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Başlık' : 'Title'} *
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={language === 'TR' ? 'EventHubble Ana Logo' : 'EventHubble Main Logo'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Alt Metin' : 'Alt Text'}
                </label>
                <input
                  type="text"
                  value={formData.alt_text}
                  onChange={(e) => setFormData({ ...formData, alt_text: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={language === 'TR' ? 'Logo açıklaması...' : 'Logo description...'}
                />
              </div>
            </div>

            {/* Technical Details */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">
                {language === 'TR' ? 'Teknik Detaylar' : 'Technical Details'}
              </h3>

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
                  placeholder="/assets/Logo.png"
                />
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
                    placeholder="263000"
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
                    placeholder="989"
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
                    placeholder="989"
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
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Sıralama' : 'Display Order'}
                  </label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                    placeholder="0"
                  />
                </div>
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
                {logo ? (language === 'TR' ? 'Güncelle' : 'Update') : (language === 'TR' ? 'Ekle' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminLogosPage 