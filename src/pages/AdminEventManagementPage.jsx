import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import { 
  Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Settings, 
  BarChart3, MapPin, Clock, DollarSign, Users, Star, Phone, ExternalLink, Tag, FileText 
} from 'lucide-react'
import LogoService from '../services/logoService'
import ImageSelector from '../components/ImageSelector'
import EventService from '../services/eventService'
import DatabaseService from '../services/databaseService'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([])
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
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

    loadEvents()
  }, [navigate])

  const loadEvents = async () => {
    try {
      // Loading removed for better UX
      
      // Database'den etkinlikleri yükle
      const dbEvents = await DatabaseService.getEvents()
      
      // Manuel etkinlikleri de yükle (fallback olarak)
      const storedEvents = localStorage.getItem('manualEvents')
      const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
      
      // Database ve manuel etkinlikleri birleştir
      const allEvents = [...dbEvents, ...manualEvents]
      setEvents(allEvents)
      
      // İlk kez yükleniyorsa localStorage'ı initialize et
      if (!storedEvents) {
        localStorage.setItem('manualEvents', JSON.stringify([]))
      }
    } catch (error) {
      // Hata durumunda sadece local events'i göster
      const storedEvents = localStorage.getItem('manualEvents')
      const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
      setEvents(manualEvents)
    } finally {
      // Loading removed for better UX
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('adminAuthenticated')
    localStorage.removeItem('adminLoginTime')
    navigate('/admin/login')
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
        // Find the event to determine if it's database or local
        const eventToDelete = events.find(e => e.id === eventId)
        
        if (eventToDelete?.event_id) {
          // Database event - use API
          await DatabaseService.deleteEvent(eventToDelete.event_id)
        } else {
          // Local event - remove from localStorage
          const storedEvents = localStorage.getItem('manualEvents')
          const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
          const updatedManualEvents = manualEvents.filter(event => event.id !== eventId)
          localStorage.setItem('manualEvents', JSON.stringify(updatedManualEvents))
        }
        
        // Reload events to get updated data
        await loadEvents()
      } catch (error) {
        alert(language === 'TR' ? 'Etkinlik silinirken hata oluştu' : 'Error deleting event')
      }
    }
  }



  const formatDate = (dateString) => {
    if (!dateString) return 'Tarih belirtilmemiş'
    const date = new Date(dateString)
    return date.toLocaleDateString(language === 'TR' ? 'tr-TR' : 'en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleSaveEvent = async (eventData) => {
    try {
      if (editingEvent) {
        // Update existing event
        if (editingEvent.event_id) {
          // Database event - use API
          await DatabaseService.updateEvent(editingEvent.event_id, eventData)
        } else {
          // Local event - update localStorage
          const storedEvents = localStorage.getItem('manualEvents')
          const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
          const updatedEvents = manualEvents.map(event => 
            event.id === editingEvent.id ? { ...eventData, id: event.id } : event
          )
          localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
        }
      } else {
        // Add new event - try database first, fallback to localStorage
        try {
          const newEventData = {
            ...eventData,
            event_id: `event_${Date.now()}`,
            scraped_at: new Date().toISOString(),
            status: 'active',
            is_active: true
          }
          
          await DatabaseService.createEvent(newEventData)
        } catch (dbError) {
          // Fallback to localStorage
          const newEvent = {
            ...eventData,
            id: `manual_${Date.now()}`,
            scraped_at: new Date().toISOString(),
            status: 'active'
          }
          const storedEvents = localStorage.getItem('manualEvents')
          const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
          const updatedEvents = [...manualEvents, newEvent]
          localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
        }
      }
      
      // Reload events to get updated data
      await loadEvents()
      setShowAddModal(false)
      setEditingEvent(null)
    } catch (error) {
      alert(language === 'TR' ? 'Etkinlik kaydedilirken hata oluştu' : 'Error saving event')
    }
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
                {language === 'TR' ? 'Etkinlik Yönetimi' : 'Event Management'}
              </h1>
              <p className="text-text/70 text-lg">
                {language === 'TR' 
                  ? 'Manuel olarak etkinlik ekleyin ve yönetin'
                  : 'Add and manage events manually'
                }
              </p>
            </div>
            <button
              onClick={handleAddEvent}
              className="flex items-center space-x-2 bg-primary hover:bg-primary-light text-white px-6 py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <Plus className="h-5 w-5" />
              <span className="font-medium">{language === 'TR' ? 'Yeni Etkinlik Ekle' : 'Add New Event'}</span>
            </button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Calendar className="h-6 w-6 text-primary" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Toplam Etkinlik' : 'Total Events'}</p>
                <p className="text-2xl font-bold text-text">{events.length}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-green-500/10 rounded-lg">
                <Tag className="h-6 w-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Aktif Etkinlik' : 'Active Events'}</p>
                <p className="text-2xl font-bold text-text">{events.filter(e => e.status === 'active').length}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-blue-500/10 rounded-lg">
                <Users className="h-6 w-6 text-blue-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Kategoriler' : 'Categories'}</p>
                <p className="text-2xl font-bold text-text">{new Set(events.map(e => e.category)).size}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center">
              <div className="p-3 bg-orange-500/10 rounded-lg">
                <FileText className="h-6 w-6 text-orange-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-text/60">{language === 'TR' ? 'Manuel Etkinlik' : 'Manual Events'}</p>
                <p className="text-2xl font-bold text-text">{events.filter(e => e.id.startsWith('manual_')).length}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                  <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-xl font-semibold text-text">
            {language === 'TR' ? 'Tüm Etkinlikler' : 'All Events'}
          </h2>
        </div>
          
          {events.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {events.map((event) => (
                <div key={event.id} className="p-6 hover:bg-background-secondary transition-colors">
                  <div className="flex items-start space-x-4">
                    <img
                      src={event.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'}
                      alt={event.title}
                      className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-2">
                        <Tag className="h-4 w-4 text-primary" />
                        <span className="text-sm text-primary font-medium bg-primary/10 px-2 py-1 rounded-full">
                          {event.category}
                        </span>
                        <span className="text-sm text-green-600 font-medium bg-green-100 px-2 py-1 rounded-full">
                          {event.platform}
                        </span>

                      </div>
                      <h3 className="text-lg font-semibold text-text mb-2 line-clamp-2">
                        {event.title}
                      </h3>
                      <p className="text-text/70 text-sm mb-3 line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-4 text-sm text-text/60">
                          <div className="flex items-center space-x-1">
                            <Calendar className="h-4 w-4" />
                            <span>{formatDate(event.date)}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <Clock className="h-4 w-4" />
                            <span>{event.time}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MapPin className="h-4 w-4" />
                            <span>{event.venue}, {event.city}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <DollarSign className="h-4 w-4" />
                            <span>{event.price_min}₺ - {event.price_max}₺</span>
                          </div>
                        </div>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditEvent(event)}
                            className="flex items-center space-x-1 text-primary hover:text-primary-light text-sm font-medium hover:bg-primary/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Düzenle' : 'Edit'}</span>
                          </button>
                          <button
                            onClick={() => handleDeleteEvent(event.id)}
                            className="flex items-center space-x-1 text-text-accent hover:text-primary-light text-sm font-medium hover:bg-text-accent/10 px-3 py-1 rounded-md transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                            <span>{language === 'TR' ? 'Sil' : 'Delete'}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Calendar className="mx-auto h-12 w-12 text-text/30" />
              <h3 className="mt-4 text-lg font-medium text-text">
                {language === 'TR' ? 'Henüz etkinlik yok' : 'No events yet'}
              </h3>
              <p className="mt-2 text-text/60">
                {language === 'TR' 
                  ? 'İlk manuel etkinliğinizi oluşturarak başlayın.'
                  : 'Get started by creating your first manual event.'
                }
              </p>
              <div className="mt-6">
                <button
                  onClick={handleAddEvent}
                  className="inline-flex items-center px-6 py-3 border border-transparent shadow-sm text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light transition-colors"
                >
                  <Plus className="-ml-1 mr-2 h-5 w-5" />
                  {language === 'TR' ? 'Yeni Etkinlik Ekle' : 'Add New Event'}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Event Modal */}
      {showAddModal && (
        <EventModal 
          event={editingEvent} 
          onClose={() => setShowAddModal(false)} 
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
                  <ImageSelector
                    value={formData.image_url}
                    onChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                    placeholder={language === 'TR' ? 'Resim URL\'si girin veya listeden seçin...' : 'Enter image URL or select from dropdown...'}
                    label={language === 'TR' ? 'Resim URL' : 'Image URL'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Bilet URL' : 'Ticket URL'}
                  </label>
                  <input
                    type="url"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
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