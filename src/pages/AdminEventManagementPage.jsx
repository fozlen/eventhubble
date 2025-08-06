import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Settings, 
  BarChart3, MapPin, Clock, DollarSign, Users, Star, Phone, ExternalLink, Tag, FileText, ArrowLeft 
} from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { api } from '../services/api'
import SearchableImageSelect from '../components/SearchableImageSelect'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
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

  // Load events
  useEffect(() => {
    loadEvents()
  }, [])

  const loadEvents = async () => {
    try {
      setIsLoading(true)
      const result = await api.getEvents()
      const dbEvents = result.data || []
      setEvents(dbEvents)
    } catch (error) {
      console.error('Error loading events:', error)
      setEvents([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleLogout = () => {
    navigate('/admin/dashboard')
  }

  const handleAddEvent = () => {
    setEditingEvent(null)
    setShowAddModal(true)
  }

  const handleEditEvent = (event) => {
    setEditingEvent(event)
    setShowAddModal(true)
  }

  const handleDeleteEvent = async (eventId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu etkinliği silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this event?'
    
    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`${API_BASE_URL}/api/events/${eventId}`, {
          method: 'DELETE'
        })
        
        if (response.ok) {
          setEvents(events.filter(event => event.id !== eventId))
        } else {
          console.error('Delete failed:', response.status)
        }
      } catch (error) {
        console.error('Error deleting event:', error)
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

  const handleSaveEvent = async (eventData) => {
    try {
      const url = editingEvent 
        ? `${API_BASE_URL}/api/events/${editingEvent.id}`
        : `${API_BASE_URL}/api/events`
      
      const method = editingEvent ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(eventData)
      })
      
      if (response.ok) {
        const result = await response.json()
        if (editingEvent) {
          setEvents(events.map(event => 
            event.id === editingEvent.id ? result.data : event
          ))
        } else {
          setEvents([...events, result.data])
        }
        setShowAddModal(false)
        setEditingEvent(null)
      } else {
        console.error('Save failed:', response.status)
      }
    } catch (error) {
      console.error('Error saving event:', error)
    }
  }

  const stats = [
    {
      title: language === 'TR' ? 'Toplam Etkinlik' : 'Total Events',
      value: events.length,
      icon: Calendar,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      title: language === 'TR' ? 'Aktif Etkinlik' : 'Active Events',
      value: events.filter(event => event.status === 'active').length,
      icon: Eye,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      title: language === 'TR' ? 'Kategoriler' : 'Categories',
      value: [...new Set(events.map(event => event.category).filter(Boolean))].length,
      icon: Tag,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      title: language === 'TR' ? 'Manuel Etkinlik' : 'Manual Events',
      value: events.filter(event => event.source === 'manual').length,
      icon: FileText,
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
                  {language === 'TR' ? 'Etkinlik Yönetimi' : 'Event Management'}
                </h1>
                <p className="text-sm text-gray-500">
                  {language === 'TR' ? 'Etkinlikleri yönet' : 'Manage events'}
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
              {language === 'TR' ? 'Etkinlik Yönetimi' : 'Event Management'}
            </h2>
            <p className="text-gray-600">
              {language === 'TR' ? 'Etkinliklerinizi manuel olarak ekleyin ve yönetin' : 'Add and manage events manually'}
            </p>
          </div>
          <button
            onClick={handleAddEvent}
            className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>{language === 'TR' ? '+ Yeni Etkinlik' : '+ Add New Event'}</span>
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

        {/* Events Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {language === 'TR' ? 'Tüm Etkinlikler' : 'All Events'}
            </h3>
          </div>
          
          <div className="p-6">
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600"></div>
              </div>
            ) : events.length === 0 ? (
              <div className="text-center py-12">
                <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {language === 'TR' ? 'Henüz etkinlik yok' : 'No events yet'}
                </h3>
                <p className="text-gray-500 mb-6">
                  {language === 'TR' ? 'İlk manuel etkinliğinizi oluşturarak başlayın.' : 'Get started by creating your first manual event.'}
                </p>
                <button
                  onClick={handleAddEvent}
                  className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <Plus className="h-4 w-4" />
                  <span>{language === 'TR' ? '+ Yeni Etkinlik' : '+ Add New Event'}</span>
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {events.map((event) => (
                  <div key={event.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="aspect-video bg-gray-200 rounded-lg mb-4 overflow-hidden">
                      <img
                        src={event.image_url || 'https://via.placeholder.com/400x200/6B7280/FFFFFF?text=Event'}
                        alt={event.title}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <h4 className="font-semibold text-gray-900 mb-2 line-clamp-2">{event.title}</h4>
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">{event.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                      <span>{formatDate(event.date)}</span>
                      <span className={`px-2 py-1 rounded-full ${
                        event.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {event.status === 'active' ? (language === 'TR' ? 'Aktif' : 'Active') : (language === 'TR' ? 'Pasif' : 'Inactive')}
                      </span>
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEditEvent(event)}
                        className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
                      >
                        <Edit className="h-3 w-3" />
                        <span className="text-xs">{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                      </button>
                      <button
                        onClick={() => handleDeleteEvent(event.id)}
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

      {/* Event Modal */}
      {showAddModal && (
        <EventModal
          event={editingEvent}
          onClose={() => {
            setShowAddModal(false)
            setEditingEvent(null)
          }}
          onSave={handleSaveEvent}
          language={language}
        />
      )}
    </div>
  )
}

const EventModal = ({ event, onClose, onSave, language = 'EN' }) => {
  const [formData, setFormData] = useState({
    // Database uyumlu field'lar
    event_id: event?.event_id || `event_${Date.now()}`,
    title_tr: event?.title_tr || event?.title || '',
    title_en: event?.title_en || event?.title || '',
    description_tr: event?.description_tr || event?.description || '',
    description_en: event?.description_en || event?.description || '',
    short_description_tr: event?.short_description_tr || '',
    short_description_en: event?.short_description_en || '',
    venue_name: event?.venue_name || event?.venue_tr || event?.venue || '',
    venue_address: event?.venue_address || '',
    city: event?.city || event?.city_tr || '',
    country: event?.country || 'Turkey',
    organizer_name: event?.organizer_name || event?.organizer_tr || event?.organizer || '',
    organizer_contact: event?.organizer_contact || {},
    start_date: event?.start_date || event?.date || '',
    end_date: event?.end_date || '',
    price_min: event?.price_min || '',
    price_max: event?.price_max || '',
    currency: event?.currency || 'TRY',
    category: event?.category || 'music',
    subcategory: event?.subcategory || '',
    source_platform: event?.source_platform || event?.platform || 'manual',
    source_id: event?.source_id || '',
    source_url: event?.source_url || '',
    ticket_url: event?.ticket_url || event?.url || '',
    image_url: event?.image_url || '',
    cover_image_id: event?.cover_image_id || null,
    gallery_image_ids: event?.gallery_image_ids || [],
    latitude: event?.latitude || null,
    longitude: event?.longitude || null,
    is_featured: event?.is_featured || false,
    is_active: event?.is_active !== undefined ? event.is_active : true,
    tags: event?.tags?.join(', ') || '',
    metadata: event?.metadata ? JSON.stringify(event.metadata, null, 2) : '{}'
  })



  const categories = [
    { value: 'music', label_tr: 'Müzik', label_en: 'Music' },
    { value: 'theater', label_tr: 'Tiyatro', label_en: 'Theater' },
    { value: 'sports', label_tr: 'Spor', label_en: 'Sports' },
    { value: 'art', label_tr: 'Sanat', label_en: 'Art' },
    { value: 'gastronomy', label_tr: 'Gastronomi', label_en: 'Gastronomy' },
    { value: 'education', label_tr: 'Eğitim', label_en: 'Education' },
    { value: 'technology', label_tr: 'Teknoloji', label_en: 'Technology' },
    { value: 'business', label_tr: 'İş', label_en: 'Business' }
  ]

  const platforms = ['manual', 'mobilet', 'biletinial', 'biletix', 'passo', 'eventbrite']

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
    
    // Convert and validate fields for database
    const processedData = {
      ...formData,
      price_min: formData.price_min ? parseFloat(formData.price_min) : null,
      price_max: formData.price_max ? parseFloat(formData.price_max) : null,
      latitude: formData.latitude ? parseFloat(formData.latitude) : null,
      longitude: formData.longitude ? parseFloat(formData.longitude) : null,
      tags: formData.tags ? formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      gallery_image_ids: Array.isArray(formData.gallery_image_ids) ? formData.gallery_image_ids : [],
      organizer_contact: typeof formData.organizer_contact === 'string' ? 
        JSON.parse(formData.organizer_contact || '{}') : formData.organizer_contact,
      metadata,
      // Ensure dates are properly formatted
      start_date: formData.start_date ? new Date(formData.start_date).toISOString() : null,
      end_date: formData.end_date ? new Date(formData.end_date).toISOString() : null
    }
    
    onSave(processedData)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white border-b border-gray-100 px-6 py-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-text">
              {event ? (language === 'TR' ? 'Etkinliği Düzenle' : 'Edit Event') : (language === 'TR' ? 'Yeni Etkinlik Ekle' : 'Add New Event')}
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
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Etkinlik Adı (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_tr}
                    onChange={(e) => setFormData({ ...formData, title_tr: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Etkinlik adını girin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Kategori
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label_tr}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Açıklama (Türkçe)
                </label>
                <textarea
                  required
                  value={formData.description_tr}
                  onChange={(e) => setFormData({ ...formData, description_tr: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Etkinlik açıklamasını girin..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Mekan Adı (Venue Name) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue_name}
                    onChange={(e) => setFormData({ ...formData, venue_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Örnek: Zorlu PSM, Cemal Reşit Rey..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Şehir (City) *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="İstanbul, Ankara, İzmir..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Mekan Adresi (Venue Address)
                  </label>
                  <textarea
                    value={formData.venue_address}
                    onChange={(e) => setFormData({ ...formData, venue_address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Detaylı adres bilgisi..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Organizatör Adı (Organizer Name)
                  </label>
                  <input
                    type="text"
                    value={formData.organizer_name}
                    onChange={(e) => setFormData({ ...formData, organizer_name: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Organizatör adını girin..."
                  />
                </div>
              </div>
            </div>

            {/* English Content */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">🇺🇸 English Content</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Event Title (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.title_en}
                    onChange={(e) => setFormData({ ...formData, title_en: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Enter event title..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  >
                    {categories.map(category => (
                      <option key={category.value} value={category.value}>{category.label_en}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Description (English)
                </label>
                <textarea
                  required
                  value={formData.description_en}
                  onChange={(e) => setFormData({ ...formData, description_en: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Enter event description..."
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Venue (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue_en}
                    onChange={(e) => setFormData({ ...formData, venue_en: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Enter venue name..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    City (English)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city_en}
                    onChange={(e) => setFormData({ ...formData, city_en: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Enter city name..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Organizer (English)
                </label>
                <input
                  type="text"
                  value={formData.organizer_en}
                  onChange={(e) => setFormData({ ...formData, organizer_en: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Enter organizer name..."
                />
              </div>
            </div>

            {/* Common Fields */}
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-text border-b pb-2">📅 Ortak Bilgiler / Common Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Başlangıç Tarihi & Saati' : 'Start Date & Time'} *
                  </label>
                  <input
                    type="datetime-local"
                    required
                    value={formData.start_date ? new Date(formData.start_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Bitiş Tarihi & Saati' : 'End Date & Time'}
                  </label>
                  <input
                    type="datetime-local"
                    value={formData.end_date ? new Date(formData.end_date).toISOString().slice(0, 16) : ''}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Platform' : 'Source Platform'}
                  </label>
                  <select
                    value={formData.source_platform}
                    onChange={(e) => setFormData({ ...formData, source_platform: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  >
                    {platforms.map(platform => (
                      <option key={platform} value={platform}>{platform}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Minimum Fiyat' : 'Min Price'}
                  </label>
                  <input
                    type="number"
                    value={formData.price_min}
                    onChange={(e) => setFormData({ ...formData, price_min: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Maksimum Fiyat' : 'Max Price'}
                  </label>
                  <input
                    type="number"
                    value={formData.price_max}
                    onChange={(e) => setFormData({ ...formData, price_max: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                    placeholder="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Para Birimi' : 'Currency'}
                  </label>
                  <select
                    value={formData.currency}
                    onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  >
                    <option value="TRY">TRY</option>
                    <option value="USD">USD</option>
                    <option value="EUR">EUR</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <SearchableImageSelect
                    value={formData.image_url}
                    onChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                    label={language === 'TR' ? 'Etkinlik Resmi' : 'Event Image'}
                    placeholder={language === 'TR' ? 'Bir resim seçin...' : 'Select an image...'}
                    category={null}
                    language={language}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Bilet URL' : 'Ticket URL'}
                  </label>
                  <input
                    type="url"
                    value={formData.ticket_url}
                    onChange={(e) => setFormData({ ...formData, ticket_url: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="https://example.com/tickets"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Puan' : 'Rating'}
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="5"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                    placeholder="4.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Mevcut Bilet' : 'Available Tickets'}
                  </label>
                  <input
                    type="number"
                    value={formData.available_tickets}
                    onChange={(e) => setFormData({ ...formData, available_tickets: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                    placeholder="100"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'İletişim' : 'Contact'}
                  </label>
                  <input
                    type="text"
                    value={formData.contact}
                    onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="+90 555 123 4567"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Web Sitesi' : 'Website'}
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="https://example.com"
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
                {event ? (language === 'TR' ? 'Güncelle' : 'Update') : (language === 'TR' ? 'Ekle' : 'Add')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

  )
}

export default AdminEventManagementPage 