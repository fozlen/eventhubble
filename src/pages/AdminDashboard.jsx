import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  BarChart3, Users, Image, FileText, Tag, Settings,
  Calendar, Star, Globe, Eye, Activity,
  PlusCircle, ArrowRight, LogOut
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'

const AdminDashboard = () => {
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const [stats, setStats] = useState({
    totalEvents: 0,
    totalBlogs: 0,
    totalImages: 0,
    totalCategories: 0,
    activeEvents: 0,
    publishedBlogs: 0
  })
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    loadLogo()
    loadStats()
  }, [])

  const loadLogo = async () => {
    try {
                      const logoData = await api.getActiveLogo('main')
        setLogo(logoData?.url || '/assets/Logo.png')
    } catch (error) {
      console.error('Logo loading error:', error)
    }
  }

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const result = await api.getAnalytics()
      
      // Set default stats if no data
      const defaultStats = {
        totalEvents: 0,
        totalBlogs: 0,
        totalImages: 0,
        totalCategories: 0,
        activeEvents: 0,
        publishedBlogs: 0
      }
      
      setStats(result.data || defaultStats)
    } catch (error) {
      console.error('Error loading stats:', error)
      // Set default stats on error
      setStats({
        totalEvents: 0,
        totalBlogs: 0,
        totalImages: 0,
        totalCategories: 0,
        activeEvents: 0,
        publishedBlogs: 0
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
  }

  const quickActions = [
    {
      title: language === 'TR' ? 'Yeni Blog Yazısı' : 'New Blog Post',
      description: language === 'TR' ? 'Blog yazısı oluştur' : 'Create a blog post',
      icon: FileText,
      color: 'bg-blue-500',
      action: () => navigate('/admin/blog')
    },
    {
      title: language === 'TR' ? 'Yeni Etkinlik' : 'New Event',
      description: language === 'TR' ? 'Etkinlik ekle' : 'Add an event',
      icon: Calendar,
      color: 'bg-green-500',
      action: () => navigate('/admin/events')
    },
    {
      title: language === 'TR' ? 'Resim Yükle' : 'Upload Image',
      description: language === 'TR' ? 'Galeri\'ye resim ekle' : 'Add images to gallery',
      icon: Image,
      color: 'bg-purple-500',
      action: () => navigate('/admin/images')
    },
    {
      title: language === 'TR' ? 'Kategori Yönet' : 'Manage Categories',
      description: language === 'TR' ? 'Kategorileri düzenle' : 'Edit categories',
      icon: Tag,
      color: 'bg-orange-500',
      action: () => navigate('/admin/categories')
    }
  ]

  const statCards = [
    {
      title: language === 'TR' ? 'Toplam Etkinlik' : 'Total Events',
      value: stats.totalEvents,
      subtitle: `${stats.activeEvents} ${language === 'TR' ? 'aktif' : 'active'}`,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Blog Yazıları' : 'Blog Posts',
      value: stats.totalBlogs,
      subtitle: `${stats.publishedBlogs} ${language === 'TR' ? 'yayında' : 'published'}`,
      icon: FileText,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'Galeri Resimleri' : 'Gallery Images',
      value: stats.totalImages,
      subtitle: language === 'TR' ? 'yüklendi' : 'uploaded',
      icon: Image,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'TR' ? 'Kategoriler' : 'Categories',
      value: stats.totalCategories,
      subtitle: language === 'TR' ? 'kategori' : 'categories',
      icon: Tag,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ]

  const managementSections = [
    {
      title: language === 'TR' ? 'İçerik Yönetimi' : 'Content Management',
      items: [
        { 
          name: language === 'TR' ? 'Blog Yönetimi' : 'Blog Management', 
          path: '/admin/blog',
          icon: FileText,
          description: language === 'TR' ? 'Blog yazılarını yönet' : 'Manage blog posts'
        },
        { 
          name: language === 'TR' ? 'Etkinlik Yönetimi' : 'Event Management', 
          path: '/admin/events',
          icon: Calendar,
          description: language === 'TR' ? 'Etkinlikleri yönet' : 'Manage events'
        },
        { 
          name: language === 'TR' ? 'Kategori Yönetimi' : 'Category Management', 
          path: '/admin/categories',
          icon: Tag,
          description: language === 'TR' ? 'Kategorileri yönet' : 'Manage categories'
        }
      ]
    },
    {
      title: language === 'TR' ? 'Medya Yönetimi' : 'Media Management',
      items: [
        { 
          name: language === 'TR' ? 'Resim Galerisi' : 'Image Gallery', 
          path: '/admin/images',
          icon: Image,
          description: language === 'TR' ? 'Resimleri yönet' : 'Manage images'
        },
        { 
          name: language === 'TR' ? 'Logo Yönetimi' : 'Logo Management', 
          path: '/admin/logos',
          icon: Star,
          description: language === 'TR' ? 'Logoları yönet' : 'Manage logos'
        }
      ]
    },
    {
      title: language === 'TR' ? 'Site Yönetimi' : 'Site Management',
      items: [
        { 
          name: language === 'TR' ? 'Site Ayarları' : 'Site Settings', 
          path: '/admin/settings',
          icon: Settings,
          description: language === 'TR' ? 'Site ayarlarını yönet' : 'Manage site settings'
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <h1 className="text-xl font-semibold text-gray-900">
                  {language === 'TR' ? 'Yönetim Paneli' : 'Admin Dashboard'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'EventHubble yönetim merkezi' : 'EventHubble management center'}
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
        {/* Welcome Section */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {language === 'TR' ? 'Hoş Geldiniz!' : 'Welcome!'}
          </h2>
          <p className="text-gray-600">
            {language === 'TR' 
              ? 'EventHubble yönetim paneline hoş geldiniz. Buradan tüm içerikleri yönetebilirsiniz.'
              : 'Welcome to EventHubble admin panel. Manage all your content from here.'}
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => {
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
                    <p className="text-xs text-gray-500 mt-1">{stat.subtitle}</p>
                  </div>
                  <div className={`p-3 rounded-lg ${stat.bgColor}`}>
                    <Icon className={`h-6 w-6 ${stat.color}`} />
                  </div>
                </div>

              </div>
            )
          })}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {language === 'TR' ? 'Hızlı İşlemler' : 'Quick Actions'}
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action, index) => {
              const Icon = action.icon
              return (
                <button
                  key={index}
                  onClick={action.action}
                  className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-all hover:-translate-y-1 text-left"
                >
                  <div className={`inline-flex p-3 rounded-lg ${action.color} mb-4`}>
                    <Icon className="h-6 w-6 text-white" />
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-1">{action.title}</h4>
                  <p className="text-sm text-gray-600">{action.description}</p>
                </button>
              )
            })}
          </div>
        </div>

        {/* Management Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {managementSections.map((section, sectionIndex) => (
            <div key={sectionIndex} className="bg-white rounded-lg shadow-sm border border-gray-200">
              <div className="p-6 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900">{section.title}</h3>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {section.items.map((item, itemIndex) => {
                    const Icon = item.icon
                    return (
                      <button
                        key={itemIndex}
                        onClick={() => navigate(item.path)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className="flex items-center space-x-3">
                          <div className="p-2 bg-gray-100 rounded-lg">
                            <Icon className="h-4 w-4 text-gray-600" />
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900">{item.name}</h4>
                            <p className="text-xs text-gray-500">{item.description}</p>
                          </div>
                        </div>
                        <ArrowRight className="h-4 w-4 text-gray-400" />
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">
                {language === 'TR' ? 'Son Aktiviteler' : 'Recent Activity'}
              </h3>
              <Activity className="h-5 w-5 text-gray-400" />
            </div>
          </div>
          <div className="p-6">
            <div className="text-center py-8">
              <Activity className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">
                {language === 'TR' 
                  ? 'Aktivite geçmişi yakında gelecek'
                  : 'Activity history coming soon'
                }
              </p>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard 