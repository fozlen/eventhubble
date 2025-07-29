import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Mail, Phone, MapPin, Send, User, MessageSquare, Globe, ArrowLeft } from 'lucide-react'
import { useLanguage } from '../contexts/LanguageContext'
import MobileHeader from '../components/MobileHeader'
import MobileNavigation from '../components/MobileNavigation'
import Footer from '../components/Footer'
import LogoService from '../services/logoService'

const ContactPage = () => {
  const navigate = useNavigate()
  const { language, toggleLanguage } = useLanguage()
  const [logo, setLogo] = useState('/assets/Logo.png')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState(null)

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

  // Update page title
  useEffect(() => {
    document.title = language === 'TR' ? 'EventHubble | İletişim' : 'EventHubble | Contact'
  }, [language])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500))
      
      setSubmitStatus('success')
      setFormData({ name: '', email: '', subject: '', message: '' })
    } catch (error) {
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const getLogo = () => {
    return logo
  }

  return (
    <div className="min-h-screen bg-background pb-24 sm:pb-0">
      {/* Mobile Header */}
      <div className="block sm:hidden">
        <MobileHeader
          onSearchClick={() => {}}
          onMenuClick={() => {}}
          logo={getLogo()}
          language={language}
          toggleLanguage={toggleLanguage}
        />
        <div className="h-16"></div>
      </div>

      {/* Desktop Header */}
      <header className="hidden sm:block bg-primary border-b border-primary/20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex flex-col sm:grid sm:grid-cols-3 items-center gap-4 sm:gap-0">
            {/* Logo and Brand - Left Section */}
            <div className="flex justify-center sm:justify-start w-full sm:w-auto">
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 md:space-x-4 hover:opacity-80 transition-opacity duration-200"
              >
                <img 
                  src={getLogo()} 
                  alt="EventHubble" 
                  className="h-8 md:h-10 w-auto" 
                />
                <span className="text-lg md:text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
              </button>
            </div>
            
            {/* Navigation Menu - Center Section */}
            <nav className="flex justify-center items-center space-x-4 sm:space-x-8 flex-wrap">
              <button 
                onClick={() => navigate('/')}
                className="text-primary-cream hover:text-white transition-colors duration-200 font-medium"
              >
                {language === 'TR' ? 'Ana Sayfa' : 'Home'}
              </button>
              <button 
                onClick={() => navigate('/about')}
                className="text-primary-cream hover:text-white transition-colors duration-200 font-medium"
              >
                {language === 'TR' ? 'Hakkımızda' : 'About'}
              </button>
              <button 
                onClick={() => navigate('/world-news')}
                className="text-primary-cream hover:text-white transition-colors duration-200 font-medium"
              >
                {language === 'TR' ? 'Haberler' : 'News'}
              </button>
              <button 
                onClick={() => navigate('/contact')}
                className="text-white border-b-2 border-primary-cream transition-colors duration-200 font-medium"
              >
                {language === 'TR' ? 'İletişim' : 'Contact'}
              </button>
            </nav>

            {/* Language Toggle - Right Section */}
            <div className="flex justify-center sm:justify-end items-center space-x-4 w-full sm:w-auto">
              <button
                onClick={toggleLanguage}
                className="flex items-center space-x-2 px-3 py-2 rounded-lg bg-primary-light/20 hover:bg-primary-light/30 transition-colors duration-200"
              >
                <Globe className="h-4 w-4 text-primary-cream" />
                <span className="text-primary-cream font-medium">{language}</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Back Button for Mobile */}
      <div className="block sm:hidden p-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center space-x-2 text-text hover:text-primary transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
          <span>{language === 'TR' ? 'Geri' : 'Back'}</span>
        </button>
      </div>

      <main className="max-w-6xl mx-auto px-4 py-8 md:py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 text-text">
            {language === 'TR' ? 'İletişim' : 'Contact Us'}
          </h1>
          <p className="text-lg text-text/70 max-w-2xl mx-auto">
            {language === 'TR' 
              ? 'Sorularınız, önerileriniz veya iş birliği teklifleriniz için bizimle iletişime geçin.'
              : 'Get in touch with us for questions, suggestions, or collaboration opportunities.'}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <div className="bg-background-secondary rounded-lg p-6 md:p-8">
            <h2 className="text-2xl font-semibold mb-6 text-text">
              {language === 'TR' ? 'Mesaj Gönder' : 'Send Message'}
            </h2>
            
            {submitStatus === 'success' && (
              <div className="mb-6 p-4 bg-green-100 border border-green-300 rounded-lg text-green-700">
                {language === 'TR' ? 'Mesajınız başarıyla gönderildi!' : 'Your message was sent successfully!'}
              </div>
            )}
            
            {submitStatus === 'error' && (
              <div className="mb-6 p-4 bg-red-100 border border-red-300 rounded-lg text-red-700">
                {language === 'TR' ? 'Mesaj gönderilirken hata oluştu.' : 'Error sending message.'}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  {language === 'TR' ? 'Ad Soyad' : 'Full Name'}
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-5 w-5 text-text/50" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={language === 'TR' ? 'Adınızı yazın' : 'Enter your name'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  {language === 'TR' ? 'E-posta' : 'Email'}
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-5 w-5 text-text/50" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                    placeholder={language === 'TR' ? 'E-posta adresinizi yazın' : 'Enter your email'}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  {language === 'TR' ? 'Konu' : 'Subject'}
                </label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent"
                  placeholder={language === 'TR' ? 'Mesaj konusunu yazın' : 'Enter subject'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2 text-text">
                  {language === 'TR' ? 'Mesaj' : 'Message'}
                </label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-3 h-5 w-5 text-text/50" />
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleInputChange}
                    required
                    rows="6"
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent resize-none"
                    placeholder={language === 'TR' ? 'Mesajınızı yazın...' : 'Write your message...'}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-primary text-white py-3 px-6 rounded-lg hover:bg-primary/90 transition-colors duration-200 font-medium flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                ) : (
                  <>
                    <Send className="h-5 w-5" />
                    <span>{language === 'TR' ? 'Mesaj Gönder' : 'Send Message'}</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Contact Information */}
          <div className="space-y-8">
            <div className="bg-background-secondary rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-6 text-text">
                {language === 'TR' ? 'İletişim Bilgileri' : 'Contact Information'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-text mb-1">
                      {language === 'TR' ? 'E-posta' : 'Email'}
                    </h3>
                    <p className="text-text/70">info@eventhubble.com</p>
                    <p className="text-text/70">support@eventhubble.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-text mb-1">
                      {language === 'TR' ? 'Telefon' : 'Phone'}
                    </h3>
                    <p className="text-text/70">+90 (212) 123 45 67</p>
                    <p className="text-text/70">+90 (532) 123 45 67</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-medium text-text mb-1">
                      {language === 'TR' ? 'Adres' : 'Address'}
                    </h3>
                    <p className="text-text/70">
                      {language === 'TR' 
                        ? 'Maslak Mahallesi, Büyükdere Caddesi No:123\nŞişli, İstanbul, Türkiye'
                        : 'Maslak District, Büyükdere Street No:123\nŞişli, Istanbul, Turkey'}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-background-secondary rounded-lg p-6 md:p-8">
              <h2 className="text-2xl font-semibold mb-4 text-text">
                {language === 'TR' ? 'Çalışma Saatleri' : 'Business Hours'}
              </h2>
              <div className="space-y-2 text-text/70">
                <div className="flex justify-between">
                  <span>{language === 'TR' ? 'Pazartesi - Cuma' : 'Monday - Friday'}</span>
                  <span>09:00 - 18:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'TR' ? 'Cumartesi' : 'Saturday'}</span>
                  <span>10:00 - 16:00</span>
                </div>
                <div className="flex justify-between">
                  <span>{language === 'TR' ? 'Pazar' : 'Sunday'}</span>
                  <span>{language === 'TR' ? 'Kapalı' : 'Closed'}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <Footer language={language} />

      {/* Mobile Navigation */}
      <MobileNavigation language={language} />
    </div>
  )
}

export default ContactPage 