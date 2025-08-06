import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Save, X, LogOut, Globe, Settings, 
  Database, Shield, Mail, Phone, Twitter, Instagram, 
  Facebook, Youtube, CreditCard, Clock, Eye, Tag, MapPin, ArrowLeft 
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
    if (!Array.isArray(settings)) {
      setFilteredSettings([])
      return
    }
    
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
      console.log('Settings response:', settingsResponse)
      
      if (settingsResponse && settingsResponse.success && Array.isArray(settingsResponse.data)) {
        setSettings(settingsResponse.data)
      } else {
        console.error('Failed to load site settings:', settingsResponse?.error)
        // Set default settings if API fails
        setSettings([
          {
            setting_key: 'site_name',
            setting_value: 'EventHubble',
            description: 'Site name',
            category: 'general',
            is_active: true
          },
          {
            setting_key: 'site_description',
            setting_value: 'Event management platform',
            description: 'Site description',
            category: 'general',
            is_active: true
          },
          {
            setting_key: 'contact_email',
            setting_value: 'admin@eventhubble.com',
            description: 'Contact email',
            category: 'contact',
            is_active: true
          }
        ])
      }
    } catch (error) {
      console.error('Data loading error:', error)
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
      setSettings(settings.map(s => 
        s.setting_key === settingKey ? updatedSetting : s
      ))
      
      setEditingSettings(prev => {
        const newState = { ...prev }
        delete newState[settingKey]
        return newState
      })
    } catch (error) {
      console.error('Error saving setting:', error)
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
    const categoryData = categories.find(c => c.key === category)
    return categoryData ? categoryData.icon : Settings
  }

  const renderSettingValue = (setting) => {
    if (editingSettings[setting.setting_key] !== undefined) {
      return (
        <div className="flex space-x-2">
          <input
            type="text"
            value={editingSettings[setting.setting_key]}
            onChange={(e) => setEditingSettings(prev => ({
              ...prev,
              [setting.setting_key]: e.target.value
            }))}
            className="flex-1 px-3 py-1 border border-gray-300 rounded text-sm"
          />
          <button
            onClick={() => handleSaveSetting(setting.setting_key, editingSettings[setting.setting_key])}
            className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
          >
            <Save className="h-3 w-3" />
          </button>
          <button
            onClick={() => handleCancelEdit(setting.setting_key)}
            className="px-2 py-1 bg-gray-600 text-white rounded text-xs hover:bg-gray-700"
          >
            <X className="h-3 w-3" />
          </button>
        </div>
      )
    }

    return (
      <div className="flex items-center justify-between">
        <span className="text-sm text-gray-600">{setting.setting_value}</span>
        <button
          onClick={() => handleEditSetting(setting.setting_key, setting.setting_value)}
          className="px-2 py-1 bg-blue-600 text-white rounded text-xs hover:bg-blue-700"
        >
          <Edit className="h-3 w-3" />
        </button>
      </div>
    )
  }

  const stats = [
    {
      title: language === 'TR' ? 'Toplam Ayar' : 'Total Settings',
      value: Array.isArray(settings) ? settings.length : 0,
      icon: Settings,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Genel Ayarlar' : 'General Settings',
      value: Array.isArray(settings) ? settings.filter(s => s.category === 'general').length : 0,
      icon: Globe,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'İletişim Ayarları' : 'Contact Settings',
      value: Array.isArray(settings) ? settings.filter(s => s.category === 'contact').length : 0,
      icon: Mail,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'TR' ? 'Aktif Ayarlar' : 'Active Settings',
      value: Array.isArray(settings) ? settings.filter(s => s.is_active !== false).length : 0,
      icon: Eye,
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
                  {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Site ayarlarını yönet' : 'Manage site settings'}
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
              {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
            </h2>
            <p className="text-gray-600">
              {language === 'TR' ? 'Site ayarlarınızı yönetin ve düzenleyin' : 'Manage and edit your site settings'}
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

        {/* Settings Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'TR' ? 'Site Ayarları' : 'Site Settings'}
              </h3>
              
              {/* Category Filter */}
              <div className="flex space-x-2">
                {categories.map((category) => {
                  const Icon = category.icon
                  return (
                    <button
                      key={category.key}
                      onClick={() => setSelectedCategory(category.key)}
                      className={`flex items-center space-x-1 px-3 py-2 rounded-lg text-sm transition-colors ${
                        selectedCategory === category.key
                          ? 'bg-purple-600 text-white'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span>{category.label}</span>
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : filteredSettings.length === 0 ? (
              <div className="text-center py-12">
                <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Henüz ayar yok' : 'No settings yet'}
                </h3>
                <p className="text-gray-500">
                  {language === 'TR' ? 'Site ayarları yüklenemedi.' : 'Site settings could not be loaded.'}
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredSettings.map((setting) => {
                  const CategoryIcon = getCategoryIcon(setting.category)
                  return (
                    <div key={setting.setting_key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                      <div className="flex items-center space-x-2 mb-3">
                        <CategoryIcon className="h-4 w-4 text-gray-500" />
                        <h4 className="font-semibold text-gray-900">{setting.setting_key}</h4>
                        <span className={`px-2 py-1 rounded-full text-xs ${
                          setting.is_active !== false ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {setting.is_active !== false ? (language === 'TR' ? 'Aktif' : 'Active') : (language === 'TR' ? 'Pasif' : 'Inactive')}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">{setting.description || 'No description'}</p>
                      {renderSettingValue(setting)}
                    </div>
                  )
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminSiteSettingsPage 