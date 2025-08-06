import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Database, Shield, Mail, Phone, Twitter, Instagram, 
  Facebook, Youtube, CreditCard, Clock, Eye, Tag, MapPin 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

const AdminSiteSettingsPage = () => {
  const [settings, setSettings] = useState([])
  const [filteredSettings, setFilteredSettings] = useState([])
  const [editingSettings, setEditingSettings] = useState({})
  const [showAddModal, setShowAddModal] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [isLoading, setIsLoading] = useState(true)
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const navigate = useNavigate()

  // Categories for filtering (based on actual database categories)
  const categories = [
    { key: 'all', label: language === 'TR' ? 'Tümü' : 'All', icon: Settings },
    { key: 'contact', label: language === 'TR' ? 'İletişim' : 'Contact', icon: Mail },
    { key: 'general', label: language === 'TR' ? 'Site Bilgileri' : 'Site Info', icon: Globe }
  ]

  // Load initial data
  useEffect(() => {
    loadData()
  }, [])

  // Filter settings by category
  useEffect(() => {
    if (selectedCategory === 'all') {
      setFilteredSettings(settings)
    } else {
      setFilteredSettings(settings.filter(setting => setting.category === selectedCategory))
    }
  }, [settings, selectedCategory])

  const loadData = async () => {
    setIsLoading(true)
    try {
      // Load logo
        const logoData = await api.getActiveLogo('main')
        setLogo(logoData?.url || '/assets/Logo.png')

      // Load site settings
      const settingsResponse = await api.getSettings()
      if (settingsResponse && settingsResponse.success) {
        setSettings(settingsResponse.data || [])
      } else {
        console.error('Failed to load site settings:', settingsResponse?.error)
        setSettings([])
      }
    } catch (error) {
      console.error('Data loading error:', error)
      alert(language === 'TR' ? 'Veriler yüklenirken hata oluştu!' : 'Error loading data!')
      setSettings([])
    } finally {
      setIsLoading(false)
    }
  }

  // No authentication check needed - handled by ProtectedRoute

  const handleSaveSetting = async (settingKey, newValue) => {
    try {
      const settingToUpdate = settings.find(s => s.setting_key === settingKey)
      if (!settingToUpdate) return

      const updatedSetting = {
        ...settingToUpdate,
        setting_value: newValue
      }

              await api.updateSettings([updatedSetting])
      
      // Update local state
      setSettings(prev => prev.map(setting => 
        setting.setting_key === settingKey 
          ? { ...setting, setting_value: newValue }
          : setting
      ))

      // Clear editing state
      setEditingSettings(prev => {
        const newState = { ...prev }
        delete newState[settingKey]
        return newState
      })

      alert(language === 'TR' ? 'Ayar başarıyla güncellendi!' : 'Setting updated successfully!')
    } catch (error) {
      console.error('Save setting error:', error)
      alert(language === 'TR' ? 'Ayar güncellenirken hata oluştu!' : 'Error updating setting!')
    }
  }

  const handleEditSetting = (settingKey, currentValue) => {
    setEditingSettings(prev => ({
      ...prev,
      [settingKey]: currentValue
    }))
  }

  const handleCancelEdit = (settingKey) => {
    setEditingSettings(prev => {
      const newState = { ...prev }
      delete newState[settingKey]
      return newState
    })
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'contact': return Mail
      case 'general': return Globe
      default: return Settings
    }
  }

  const renderSettingValue = (setting) => {
    const isEditing = editingSettings.hasOwnProperty(setting.setting_key)
    const Icon = getCategoryIcon(setting.category)

    if (isEditing) {
      return (
        <div className="flex items-center space-x-2">
          {setting.setting_type === 'text' ? (
            <textarea
              value={editingSettings[setting.setting_key]}
              onChange={(e) => setEditingSettings(prev => ({
                ...prev,
                [setting.setting_key]: e.target.value
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
              rows="3"
            />
          ) : setting.setting_type === 'boolean' ? (
            <select
              value={editingSettings[setting.setting_key]}
              onChange={(e) => setEditingSettings(prev => ({
                ...prev,
                [setting.setting_key]: e.target.value
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            >
              <option value="true">True</option>
              <option value="false">False</option>
            </select>
          ) : (
            <input
              type="text"
              value={editingSettings[setting.setting_key]}
              onChange={(e) => setEditingSettings(prev => ({
                ...prev,
                [setting.setting_key]: e.target.value
              }))}
              className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          )}
          <button
            onClick={() => handleSaveSetting(setting.setting_key, editingSettings[setting.setting_key])}
            className="px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Save className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleCancelEdit(setting.setting_key)}
            className="px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Icon className="h-5 w-5 text-primary" />
          <div>
            <div className="font-medium text-text">
              {setting.setting_key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}
            </div>
            <div className="text-sm text-text/60">{setting.description}</div>
            <div className="text-sm font-mono bg-gray-100 px-2 py-1 rounded mt-1">
              {setting.setting_type === 'text' && setting.setting_value.length > 100
                ? setting.setting_value.substring(0, 100) + '...'
                : setting.setting_value
              }
            </div>
          </div>
        </div>
        <button
          onClick={() => handleEditSetting(setting.setting_key, setting.setting_value)}
          className="px-3 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <Edit className="h-4 w-4" />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-4">
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
                <span className="text-xl font-bold">
                <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
              <span className="text-primary-light/60 hidden sm:inline">
                | {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
              </span>
            </div>

            {/* Actions */}
            <div className="flex items-center space-x-4">
              <button 
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/30 transition-colors duration-200"
              >
                <Globe className="h-4 w-4 text-primary-cream" />
                <span className="text-primary-cream font-medium">{language}</span>
              </button>
              
              <button
                onClick={() => {
                  localStorage.removeItem('adminAuthenticated')
                  localStorage.removeItem('adminLoginTime')
                  navigate('/admin/login')
                }}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors duration-200"
              >
                <LogOut className="h-4 w-4" />
                <span className="hidden sm:inline">
                  {language === 'TR' ? 'Çıkış' : 'Logout'}
                </span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap gap-2 mb-6">
                <button
            onClick={() => navigate('/admin/dashboard')}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                >
            {language === 'TR' ? '← Ana Panel' : '← Dashboard'}
                </button>
        </div>

        {/* Category Filter */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 mb-3">
            {language === 'TR' ? 'Kategori Filtresi' : 'Category Filter'}
          </h3>
          <div className="flex flex-wrap gap-3">
            {categories.map(category => {
              const Icon = category.icon
              return (
                <button
                  key={category.key}
                  onClick={() => setSelectedCategory(category.key)}
                  className={`flex items-center space-x-2 px-4 py-3 rounded-lg border-2 transition-all duration-200 ${
                    selectedCategory === category.key
                      ? 'bg-primary border-primary text-white shadow-md transform scale-105'
                      : 'bg-white border-gray-200 text-gray-700 hover:border-primary/50 hover:bg-primary/5'
                  }`}
                >
                  <Icon className="h-5 w-5" />
                  <span className="font-medium">{category.label}</span>
                  {selectedCategory === category.key && (
                    <div className="w-2 h-2 bg-white rounded-full ml-1"></div>
                  )}
                </button>
              )
            })}
          </div>
        </div>

                {/* Settings List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-200 bg-gray-50 rounded-t-lg">
            <h2 className="text-2xl font-bold text-gray-900">
              {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
            </h2>
            <p className="text-gray-600 mt-1">
              {language === 'TR' 
                ? `${filteredSettings.length} ayar gösteriliyor` 
                : `Showing ${filteredSettings.length} settings`}
            </p>
          </div>
          
          {isLoading ? (
            <div className="p-12 text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-3 border-primary mx-auto mb-6"></div>
              <p className="text-gray-500 text-lg">
                {language === 'TR' ? 'Ayarlar yükleniyor...' : 'Loading settings...'}
              </p>
            </div>
          ) : filteredSettings.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                <Settings className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500 text-lg font-medium">
                {language === 'TR' ? 'Bu kategoride ayar bulunamadı' : 'No settings found in this category'}
              </p>
              <p className="text-gray-400 text-sm mt-2">
                {language === 'TR' ? 'Farklı bir kategori deneyin' : 'Try a different category'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {filteredSettings.map((setting, index) => (
                <div key={setting.setting_key} className={`p-6 hover:bg-gray-50 transition-colors ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                  {renderSettingValue(setting)}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminSiteSettingsPage 