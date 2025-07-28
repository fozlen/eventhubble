import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Plus, Edit, Trash2, Eye, LogOut, Calendar, User, Globe, Sun, Moon, Tag, FileText, Settings, BarChart3, MapPin, Clock, DollarSign, Users, Star, Phone, ExternalLink } from 'lucide-react'
import newLogo from '../assets/eventhubble_new_logo.png'
import logo from '../assets/Logo.png'
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
      
      // Mock etkinlikleri de ekle (eventService'den)
      const mockEvents = EventService.getMockEvents()
      
      // Tüm etkinlikleri birleştir
      const allEvents = [...manualEvents, ...mockEvents]
      setEvents(allEvents)
      
      // İlk kez yükleniyorsa localStorage'ı initialize et
      if (!storedEvents) {
        localStorage.setItem('manualEvents', JSON.stringify([]))
      }
    } catch (error) {
      console.error('Error loading events:', error)
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
    // Mock eventleri düzenlemeye izin ver ama yeni bir manuel event olarak kaydet
    if (!event.id.startsWith('manual_')) {
      // Mock event için yeni ID oluştur
      const newEvent = {
        ...event,
        id: `manual_${Date.now()}`,
        scraped_at: new Date().toISOString()
      }
      setEditingEvent(newEvent)
    } else {
      setEditingEvent(event)
    }
    setShowAddModal(true)
  }

  const handleDeleteEvent = (eventId) => {
    const confirmMessage = language === 'TR' 
      ? 'Bu etkinliği silmek istediğinizden emin misiniz?'
      : 'Are you sure you want to delete this event?'
    
    if (window.confirm(confirmMessage)) {
      // Sadece manuel etkinlikleri localStorage'dan sil
      if (eventId.startsWith('manual_')) {
        const storedEvents = localStorage.getItem('manualEvents')
        const manualEvents = storedEvents ? JSON.parse(storedEvents) : []
        const updatedManualEvents = manualEvents.filter(event => event.id !== eventId)
        localStorage.setItem('manualEvents', JSON.stringify(updatedManualEvents))
      }
      
      // UI'dan kaldır (hem manuel hem mock)
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
        scraped_at: new Date().toISOString(),
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
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          event.id.startsWith('manual_') 
                            ? 'text-blue-600 bg-blue-100' 
                            : 'text-orange-600 bg-orange-100'
                        }`}>
                          {event.id.startsWith('manual_') ? 'Manuel' : 'Mock'}
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
    title: event?.title || '',
    description: event?.description || '',
    date: event?.date || '',
    time: event?.time || '',
    venue: event?.venue || '',
    city: event?.city || '',
    price_min: event?.price_min || '',
    price_max: event?.price_max || '',
    currency: event?.currency || 'TRY',
    category: event?.category || 'müzik',
    platform: event?.platform || 'mobilet',
    image_url: event?.image_url || '',
    url: event?.url || '',
    attendees: event?.attendees || '',
    rating: event?.rating || '',
    available_tickets: event?.available_tickets || '',
    organizer: event?.organizer || '',
    contact: event?.contact || '',
    website: event?.website || ''
  })

  const categories = language === 'TR' 
    ? ['müzik', 'tiyatro', 'spor', 'sanat', 'gastronomi', 'festival', 'diğer']
    : ['music', 'theater', 'sports', 'art', 'gastronomy', 'festival', 'other']

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
      <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
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
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Etkinlik Adı' : 'Event Title'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'Etkinlik adını girin...' : 'Enter event title...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kategori' : 'Category'}
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                >
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-text mb-2">
                {language === 'TR' ? 'Açıklama' : 'Description'}
              </label>
              <textarea
                required
                rows="3"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40 resize-none"
                placeholder={language === 'TR' ? 'Etkinlik açıklaması...' : 'Event description...'}
              />
            </div>

            {/* Date and Time */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
            </div>

            {/* Location */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Mekan' : 'Venue'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.venue}
                  onChange={(e) => setFormData({ ...formData, venue: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'Mekan adı...' : 'Venue name...'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Şehir' : 'City'}
                </label>
                <input
                  type="text"
                  required
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'Şehir...' : 'City...'}
                />
              </div>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Minimum Fiyat' : 'Min Price'}
                </label>
                <input
                  type="number"
                  required
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
                  required
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

            {/* Platform and URLs */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Bilet URL' : 'Ticket URL'}
                </label>
                <input
                  type="url"
                  value={formData.url}
                  onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Katılımcı Sayısı' : 'Attendees'}
                </label>
                <input
                  type="number"
                  value={formData.attendees}
                  onChange={(e) => setFormData({ ...formData, attendees: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  placeholder="0"
                />
              </div>

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
                  placeholder="0.0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kalan Bilet' : 'Available Tickets'}
                </label>
                <input
                  type="number"
                  value={formData.available_tickets}
                  onChange={(e) => setFormData({ ...formData, available_tickets: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text"
                  placeholder="0"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Organizatör' : 'Organizer'}
                </label>
                <input
                  type="text"
                  value={formData.organizer}
                  onChange={(e) => setFormData({ ...formData, organizer: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'Organizatör adı...' : 'Organizer name...'}
                />
              </div>
            </div>

            {/* Contact Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'İletişim' : 'Contact'}
                </label>
                <input
                  type="tel"
                  value={formData.contact}
                  onChange={(e) => setFormData({ ...formData, contact: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder="+90 212 555 0123"
                />
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
                  placeholder="https://..."
                />
              </div>
            </div>

            {/* Image */}
            <div>
              <ImageSelector
                value={formData.image_url}
                onChange={(imageUrl) => setFormData({ ...formData, image_url: imageUrl })}
                placeholder={language === 'TR' ? 'Resim URL\'si girin veya listeden seçin...' : 'Enter image URL or select from dropdown...'}
                label={language === 'TR' ? 'Resim URL' : 'Image URL'}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-100">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 text-text border border-gray-200 rounded-lg hover:bg-background-secondary transition-colors font-medium"
              >
                {language === 'TR' ? 'İptal' : 'Cancel'}
              </button>
              <button
                type="submit"
                className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-light transition-colors font-medium shadow-lg hover:shadow-xl"
              >
                {event ? (language === 'TR' ? 'Etkinliği Güncelle' : 'Update Event') : (language === 'TR' ? 'Etkinlik Oluştur' : 'Create Event')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}

export default AdminEventManagementPage 