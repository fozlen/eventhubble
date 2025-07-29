import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Database, Shield, Mail, Phone, Twitter, Instagram, 
  Facebook, Youtube, CreditCard, Clock, Eye, Tag 
} from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')

const AdminSiteSettingsPage = () => {
  const [settings, setSettings] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [editingSettings, setEditingSettings] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

  // Get logo function
  const getLogo = () => {
    return import.meta.env.PROD ? '/Logo.png' : `${API_BASE_URL}/assets/Logo.png`
  }

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

    loadSettings()
  }, [navigate])

  const loadSettings = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/settings`)
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setSettings(result.raw_data || [])
        }
      }
    } catch (error) {
      console.error('Error loading settings:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  const startEditing = (setting) => {
    setEditingSettings({
      ...editingSettings,
      [setting.id]: {
        ...setting,
        originalValue: setting.setting_value
      }
    })
  }

  const cancelEditing = (settingId) => {
    const updatedEditing = { ...editingSettings }
    delete updatedEditing[settingId]
    setEditingSettings(updatedEditing)
  }

  const updateEditingValue = (settingId, field, value) => {
    setEditingSettings({
      ...editingSettings,
      [settingId]: {
        ...editingSettings[settingId],
        [field]: value
      }
    })
  }

  const saveSettings = async () => {
    try {
      const settingsToUpdate = Object.values(editingSettings).map(setting => ({
        setting_key: setting.setting_key,
        setting_value: setting.setting_value,
        setting_type: setting.setting_type,
        category: setting.category,
        description: setting.description
      }))

      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: settingsToUpdate })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setEditingSettings({})
          loadSettings()
          alert(language === 'TR' ? 'Ayarlar başarıyla güncellendi!' : 'Settings updated successfully!')
        }
      }
    } catch (error) {
      console.error('Error saving settings:', error)
      alert(language === 'TR' ? 'Ayarlar güncellenirken hata oluştu!' : 'Error updating settings!')
    }
  }

  const deleteSetting = async (settingKey) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu ayarı silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this setting?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/settings/${settingKey}`, {
          method: 'DELETE'
        })

        if (response.ok) {
          loadSettings()
          alert(language === 'TR' ? 'Ayar başarıyla silindi!' : 'Setting deleted successfully!')
        }
      } catch (error) {
        console.error('Error deleting setting:', error)
        alert(language === 'TR' ? 'Ayar silinirken hata oluştu!' : 'Error deleting setting!')
      }
    }
  }

  const getSettingIcon = (category) => {
    const iconMap = {
      general: Settings,
      contact: Mail,
      social: Twitter,
      analytics: Database,
      payment: CreditCard,
      localization: Globe,
      pagination: Tag,
      performance: Clock,
      system: Shield,
      user: Eye,
      marketing: Instagram,
      notifications: Phone,
      api: Database,
      upload: Database,
      events: Tag,
      location: Globe,
      footer: Tag,
      legal: Shield
    }
    const IconComponent = iconMap[category] || Settings
    return <IconComponent className="h-5 w-5" />
  }

  const groupedSettings = settings.reduce((groups, setting) => {
    const category = setting.category || 'general'
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(setting)
    return groups
  }, {})

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-text">{language === 'TR' ? 'Yükleniyor...' : 'Loading...'}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Admin Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src={getLogo()} alt="EventHubble" className="h-8 w-auto" />
              <div className="text-white">
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
                <span className="ml-2 text-sm text-primary-cream/80">Admin Panel</span>
              </div>
            </div>

            {/* Admin Navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <a href="/" className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                {language === 'TR' ? 'Siteyi Görüntüle' : 'View Site'}
              </a>
              <button 
                onClick={() => navigate('/admin/dashboard')}
                className="text-primary-cream/80 hover:text-primary-cream transition-colors"
              >
                {language === 'TR' ? 'Blog Yönetimi' : 'Blog Management'}
              </button>
              <button 
                onClick={() => navigate('/admin/events')}
                className="text-primary-cream/80 hover:text-primary-cream transition-colors"
              >
                {language === 'TR' ? 'Etkinlik Yönetimi' : 'Event Management'}
              </button>
              <button className="text-primary-cream transition-colors">
                <Settings className="h-5 w-5" />
              </button>
            </nav>

            {/* Language and Logout */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-1 text-primary-cream/80 hover:text-primary-cream transition-colors"
                title={language === 'TR' ? 'Language' : 'Dil'}
              >
                <Globe size={16} />
                <span className="text-sm">{language}</span>
              </button>
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 text-primary-cream/80 hover:text-primary-cream transition-colors"
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
                {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Site ayarlarınızı yönetin ve güncelleyin'
                  : 'Manage and update your site settings'
                }
              </p>
            </div>
            <div className="flex space-x-4">
              {Object.keys(editingSettings).length > 0 && (
                <button
                  onClick={saveSettings}
                  className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                >
                  <Save className="h-5 w-5" />
                  <span className="font-medium">{language === 'TR' ? 'Değişiklikleri Kaydet' : 'Save Changes'}</span>
                </button>
              )}
              <button
                onClick={() => setShowAddModal(true)}
                className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                <Plus className="h-5 w-5" />
                <span className="font-medium">{language === 'TR' ? 'Yeni Ayar Ekle' : 'Add New Setting'}</span>
              </button>
            </div>
          </div>
        </div>

        {/* Settings by Category */}
        <div className="space-y-8">
          {Object.entries(groupedSettings).map(([category, categorySettings]) => (
            <div key={category} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-100 bg-gray-50">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-primary/10 rounded-lg">
                    {getSettingIcon(category)}
                  </div>
                  <h2 className="text-xl font-semibold text-text capitalize">
                    {category === 'general' ? (language === 'TR' ? 'Genel' : 'General') :
                     category === 'contact' ? (language === 'TR' ? 'İletişim' : 'Contact') :
                     category === 'social' ? (language === 'TR' ? 'Sosyal Medya' : 'Social Media') :
                     category === 'analytics' ? (language === 'TR' ? 'Analitik' : 'Analytics') :
                     category === 'payment' ? (language === 'TR' ? 'Ödeme' : 'Payment') :
                     category === 'localization' ? (language === 'TR' ? 'Yerelleştirme' : 'Localization') :
                     category === 'pagination' ? (language === 'TR' ? 'Sayfalama' : 'Pagination') :
                     category === 'performance' ? (language === 'TR' ? 'Performans' : 'Performance') :
                     category === 'system' ? (language === 'TR' ? 'Sistem' : 'System') :
                     category === 'user' ? (language === 'TR' ? 'Kullanıcı' : 'User') :
                     category === 'marketing' ? (language === 'TR' ? 'Pazarlama' : 'Marketing') :
                     category === 'notifications' ? (language === 'TR' ? 'Bildirimler' : 'Notifications') :
                     category === 'api' ? 'API' :
                     category === 'upload' ? (language === 'TR' ? 'Yükleme' : 'Upload') :
                     category === 'events' ? (language === 'TR' ? 'Etkinlikler' : 'Events') :
                     category === 'location' ? (language === 'TR' ? 'Konum' : 'Location') :
                     category === 'footer' ? 'Footer' :
                     category === 'legal' ? (language === 'TR' ? 'Yasal' : 'Legal') :
                     category}
                  </h2>
                  <span className="text-sm text-text/60 bg-text/10 px-2 py-1 rounded-full">
                    {categorySettings.length} {language === 'TR' ? 'ayar' : 'settings'}
                  </span>
                </div>
              </div>
              
              <div className="divide-y divide-gray-100">
                {categorySettings.map((setting) => {
                  const isEditing = editingSettings[setting.id]
                  return (
                    <div key={setting.id} className="p-6 hover:bg-background-secondary transition-colors">
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-3 mb-2">
                            <h3 className="text-lg font-semibold text-text">
                              {setting.setting_key}
                            </h3>
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              setting.setting_type === 'string' ? 'bg-blue-100 text-blue-800' :
                              setting.setting_type === 'number' ? 'bg-green-100 text-green-800' :
                              setting.setting_type === 'boolean' ? 'bg-purple-100 text-purple-800' :
                              setting.setting_type === 'json' ? 'bg-orange-100 text-orange-800' :
                              'bg-gray-100 text-gray-800'
                            }`}>
                              {setting.setting_type}
                            </span>
                          </div>
                          
                          {setting.description && (
                            <p className="text-text/60 text-sm mb-3">{setting.description}</p>
                          )}
                          
                          <div className="space-y-2">
                            {isEditing ? (
                              <div className="space-y-3">
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">
                                    {language === 'TR' ? 'Değer' : 'Value'}
                                  </label>
                                  {setting.setting_type === 'boolean' ? (
                                    <select
                                      value={isEditing.setting_value}
                                      onChange={(e) => updateEditingValue(setting.id, 'setting_value', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    >
                                      <option value="true">{language === 'TR' ? 'Aktif' : 'True'}</option>
                                      <option value="false">{language === 'TR' ? 'Pasif' : 'False'}</option>
                                    </select>
                                  ) : setting.setting_type === 'json' ? (
                                    <textarea
                                      value={isEditing.setting_value}
                                      onChange={(e) => updateEditingValue(setting.id, 'setting_value', e.target.value)}
                                      rows="3"
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none font-mono text-sm"
                                      placeholder='{"example": "value"}'
                                    />
                                  ) : (
                                    <input
                                      type={setting.setting_type === 'number' ? 'number' : 'text'}
                                      value={isEditing.setting_value}
                                      onChange={(e) => updateEditingValue(setting.id, 'setting_value', e.target.value)}
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    />
                                  )}
                                </div>
                                
                                <div>
                                  <label className="block text-sm font-medium text-text mb-1">
                                    {language === 'TR' ? 'Açıklama' : 'Description'}
                                  </label>
                                  <input
                                    type="text"
                                    value={isEditing.description || ''}
                                    onChange={(e) => updateEditingValue(setting.id, 'description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                                    placeholder={language === 'TR' ? 'Ayar açıklaması...' : 'Setting description...'}
                                  />
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2">
                                <span className="text-lg font-medium text-text">
                                  {setting.setting_type === 'boolean' 
                                    ? (setting.setting_value === 'true' || setting.setting_value === true 
                                        ? (language === 'TR' ? '✅ Aktif' : '✅ Enabled') 
                                        : (language === 'TR' ? '❌ Pasif' : '❌ Disabled'))
                                    : setting.setting_value}
                                </span>
                              </div>
                            )}
                          </div>
                        </div>
                        
                        <div className="flex space-x-2 ml-4">
                          {isEditing ? (
                            <button
                              onClick={() => cancelEditing(setting.id)}
                              className="flex items-center space-x-1 text-gray-600 hover:text-gray-800 text-sm font-medium hover:bg-gray-100 px-3 py-1 rounded-md transition-colors"
                            >
                              <X className="h-4 w-4" />
                              <span>{language === 'TR' ? 'İptal' : 'Cancel'}</span>
                            </button>
                          ) : (
                            <>
                              <button
                                onClick={() => startEditing(setting)}
                                className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors"
                              >
                                <Edit className="h-4 w-4" />
                                <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                              </button>
                              <button
                                onClick={() => deleteSetting(setting.setting_key)}
                                className="flex items-center space-x-1 text-red-600 hover:text-red-800 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded-md transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                                <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Add New Setting Modal */}
      {showAddModal && (
        <AddSettingModal 
          onClose={() => setShowAddModal(false)}
          onSave={loadSettings}
          language={language}
        />
      )}
    </div>
  )
}

const AddSettingModal = ({ onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    setting_key: '',
    setting_value: '',
    setting_type: 'string',
    category: 'general',
    description: ''
  })

  const categories = [
    { value: 'general', label_tr: 'Genel', label_en: 'General' },
    { value: 'contact', label_tr: 'İletişim', label_en: 'Contact' },
    { value: 'social', label_tr: 'Sosyal Medya', label_en: 'Social Media' },
    { value: 'analytics', label_tr: 'Analitik', label_en: 'Analytics' },
    { value: 'payment', label_tr: 'Ödeme', label_en: 'Payment' },
    { value: 'localization', label_tr: 'Yerelleştirme', label_en: 'Localization' },
    { value: 'pagination', label_tr: 'Sayfalama', label_en: 'Pagination' },
    { value: 'performance', label_tr: 'Performans', label_en: 'Performance' },
    { value: 'system', label_tr: 'Sistem', label_en: 'System' },
    { value: 'user', label_tr: 'Kullanıcı', label_en: 'User' },
    { value: 'marketing', label_tr: 'Pazarlama', label_en: 'Marketing' },
    { value: 'notifications', label_tr: 'Bildirimler', label_en: 'Notifications' },
    { value: 'api', label_tr: 'API', label_en: 'API' },
    { value: 'upload', label_tr: 'Yükleme', label_en: 'Upload' },
    { value: 'events', label_tr: 'Etkinlikler', label_en: 'Events' },
    { value: 'location', label_tr: 'Konum', label_en: 'Location' },
    { value: 'footer', label_tr: 'Footer', label_en: 'Footer' },
    { value: 'legal', label_tr: 'Yasal', label_en: 'Legal' }
  ]

  const settingTypes = [
    { value: 'string', label_tr: 'Metin', label_en: 'String' },
    { value: 'number', label_tr: 'Sayı', label_en: 'Number' },
    { value: 'boolean', label_tr: 'Doğru/Yanlış', label_en: 'Boolean' },
    { value: 'json', label_tr: 'JSON', label_en: 'JSON' }
  ]

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    try {
      const response = await fetch(`${API_BASE_URL}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ settings: [formData] })
      })

      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          onSave()
          onClose()
          alert(language === 'TR' ? 'Ayar başarıyla eklendi!' : 'Setting added successfully!')
        }
      }
    } catch (error) {
      console.error('Error adding setting:', error)
      alert(language === 'TR' ? 'Ayar eklenirken hata oluştu!' : 'Error adding setting!')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {language === 'TR' ? 'Yeni Ayar Ekle' : 'Add New Setting'}
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
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Ayar Anahtarı' : 'Setting Key'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.setting_key}
                  onChange={(e) => setFormData({ ...formData, setting_key: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={language === 'TR' ? 'site_title_tr' : 'site_title_en'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Ayar Tipi' : 'Setting Type'}
                </label>
                <select
                  value={formData.setting_type}
                  onChange={(e) => setFormData({ ...formData, setting_type: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  {settingTypes.map(type => (
                    <option key={type.value} value={type.value}>
                      {language === 'TR' ? type.label_tr : type.label_en}
                    </option>
                  ))}
                </select>
              </div>
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
                {categories.map(category => (
                  <option key={category.value} value={category.value}>
                    {language === 'TR' ? category.label_tr : category.label_en}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Değer' : 'Value'}
              </label>
              {formData.setting_type === 'boolean' ? (
                <select
                  value={formData.setting_value}
                  onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                >
                  <option value="true">{language === 'TR' ? 'Aktif' : 'True'}</option>
                  <option value="false">{language === 'TR' ? 'Pasif' : 'False'}</option>
                </select>
              ) : formData.setting_type === 'json' ? (
                <textarea
                  required
                  rows="4"
                  value={formData.setting_value}
                  onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none font-mono text-sm"
                  placeholder='{"example": "value"}'
                />
              ) : (
                <input
                  type={formData.setting_type === 'number' ? 'number' : 'text'}
                  required
                  value={formData.setting_value}
                  onChange={(e) => setFormData({ ...formData, setting_value: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary"
                  placeholder={language === 'TR' ? 'Ayar değeri...' : 'Setting value...'}
                />
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Açıklama' : 'Description'}
              </label>
              <textarea
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary resize-none"
                placeholder={language === 'TR' ? 'Ayar açıklaması...' : 'Setting description...'}
              />
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
                {language === 'TR' ? 'Ekle' : 'Add'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminSiteSettingsPage 