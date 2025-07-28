import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Sun, Moon, Tag, FileText, Settings, BarChart3, MapPin, Clock, DollarSign, Users, Star, Phone, ExternalLink } from 'lucide-react'
// Image paths for Safari compatibility
const newLogo = '/assets/eventhubble_new_logo.png'
const logo = '/assets/Logo.png'
import ImageSelector from '../components/ImageSelector'
import { EventService } from '../services/eventService'

const AdminEventManagementPage = () => {
  const [events, setEvents] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingEvent, setEditingEvent] = useState(null)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

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

  const loadEvents = () => {
    try {
      // Manuel etkinlikleri yükle
      const storedEvents = localStorage.getItem('manualEvents')
      const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
      
      // Sadece manuel etkinlikleri kullan
      setEvents(manualEvents)
      
      // İlk kez yükleniyorsa localStorage'ı initialize et
      if (!storedEvents) {
        localStorage.setItem('manualEvents', JSON.stringify([]))
      }
    } catch (error) {
      if (!import.meta.env.PROD) {
        console.error('Error loading events:', error)
      }
    } finally {
      setIsLoading(false)
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

  const handleDeleteEvent = (eventId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu etkinliği silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this event?'
    
    if (window.confirm(confirmMessage)) {
      // Manuel etkinlikleri localStorage'dan sil
      const storedEvents = localStorage.getItem('manualEvents')
      const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
      const updatedManualEvents = manualEvents.filter(event => event.id !== eventId)
      localStorage.setItem('manualEvents', JSON.stringify(updatedManualEvents))
      
      // UI'dan kaldır
      const updatedEvents = events.filter(event => event.id !== eventId)
      setEvents(updatedEvents)
    }
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
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

  const handleSaveEvent = (eventData) => {
    if (editingEvent) {
      // Update existing event
      const updatedEvents = events.map(event => 
        event.id === editingEvent.id ? { ...eventData, id: event.id } : event
      )
      setEvents(updatedEvents)
      localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
    } else {
      // Add new event
      const newEvent = {
        ...eventData,
        id: `manual_${Date.now()}`,
        scraped_at: new Date().toISOString() || new Date('2024-07-29').toISOString(),
        status: 'active'
      }
      const updatedEvents = [...events, newEvent]
      setEvents(updatedEvents)
      localStorage.setItem('manualEvents', JSON.stringify(updatedEvents))
    }
    setShowAddModal(false)
    setEditingEvent(null)
  }

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
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
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
              <button className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                <Settings className="h-5 w-5" />
              </button>
              <button className="text-primary-cream/80 hover:text-primary-cream transition-colors">
                <BarChart3 className="h-5 w-5" />
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
    title_tr: event?.title_tr || event?.title || '',
    title_en: event?.title_en || event?.title || '',
    description_tr: event?.description_tr || event?.description || '',
    description_en: event?.description_en || event?.description || '',
    venue_tr: event?.venue_tr || event?.venue || '',
    venue_en: event?.venue_en || event?.venue || '',
    city_tr: event?.city_tr || event?.city || '',
    city_en: event?.city_en || event?.city || '',
    organizer_tr: event?.organizer_tr || event?.organizer || '',
    organizer_en: event?.organizer_en || event?.organizer || '',
    date: event?.date || '',
    time: event?.time || '',
    price_min: event?.price_min || '',
    price_max: event?.price_max || '',
    currency: event?.currency || 'TRY',
    category: event?.category || 'müzik',
    platform: event?.platform || 'mobilet',
    image_url: event?.image_url || '',
    url: event?.url || '',
    rating: event?.rating || '',
    available_tickets: event?.available_tickets || '',
    contact: event?.contact || '',
    website: event?.website || ''
  })

  const categories = [
    { value: 'müzik', label_tr: 'Müzik', label_en: 'Music' },
    { value: 'tiyatro', label_tr: 'Tiyatro', label_en: 'Theater' },
    { value: 'spor', label_tr: 'Spor', label_en: 'Sports' },
    { value: 'sanat', label_tr: 'Sanat', label_en: 'Art' },
    { value: 'gastronomi', label_tr: 'Gastronomi', label_en: 'Gastronomy' },
    { value: 'festival', label_tr: 'Festival', label_en: 'Festival' },
    { value: 'diğer', label_tr: 'Diğer', label_en: 'Other' }
  ]

  const platforms = ['mobilet', 'biletinial', 'biletix', 'passo', 'manual']

  const handleSubmit = (e) => {
    e.preventDefault()
    
    // Convert numeric fields
    const processedData = {
      ...formData,
      price_min: parseInt(formData.price_min) || 0,
      price_max: parseInt(formData.price_max) || 0,
      attendees: parseInt(formData.attendees) || 0,
      rating: parseFloat(formData.rating) || 0,
      available_tickets: parseInt(formData.available_tickets) || 0
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
                    Mekan (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.venue_tr}
                    onChange={(e) => setFormData({ ...formData, venue_tr: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Mekan adını girin..."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    Şehir (Türkçe)
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.city_tr}
                    onChange={(e) => setFormData({ ...formData, city_tr: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder="Şehir adını girin..."
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  Organizatör (Türkçe)
                </label>
                <input
                  type="text"
                  value={formData.organizer_tr}
                  onChange={(e) => setFormData({ ...formData, organizer_tr: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="Organizatör adını girin..."
                />
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
                    {language === 'TR' ? 'Tarih' : 'Date'}
                  </label>
                  <input
                    type="date"
                    required
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Saat' : 'Time'}
                  </label>
                  <input
                    type="time"
                    required
                    value={formData.time}
                    onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                    className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text mb-2">
                    {language === 'TR' ? 'Platform' : 'Platform'}
                  </label>
                  <select
                    value={formData.platform}
                    onChange={(e) => setFormData({ ...formData, platform: e.target.value })}
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