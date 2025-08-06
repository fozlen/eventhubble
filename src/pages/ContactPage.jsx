import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLanguage } from '../contexts/LanguageContext'
import apiService from '../services/api'
import MobileHeader from '../components/MobileHeader'
import Footer from '../components/Footer'
import { Mail, Phone, MapPin, Send, Loader2, CheckCircle } from 'lucide-react'

const ContactPage = () => {
  const { language } = useLanguage()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      await apiService.submitContact(formData)
      setSuccess(true)
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      })
      
      // Hide success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (error) {
      console.error('Contact form error:', error)
      setError(language === 'TR' 
        ? 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.'
        : 'Failed to send message. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-50">
      {/* Header */}
      <MobileHeader />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-600 to-pink-600 text-white py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            {language === 'TR' ? 'İletişim' : 'Contact Us'}
          </h1>
          <p className="text-xl opacity-90">
            {language === 'TR' 
              ? 'Sorularınız için buradayız' 
              : 'We\'re here to answer your questions'}
          </p>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl font-bold mb-8 text-gray-900">
                {language === 'TR' ? 'Bize Ulaşın' : 'Get in Touch'}
              </h2>
              
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {language === 'TR' ? 'E-posta' : 'Email'}
                    </h3>
                    <p className="text-gray-600">info@eventhubble.com</p>
                    <p className="text-gray-600">support@eventhubble.com</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {language === 'TR' ? 'Telefon' : 'Phone'}
                    </h3>
                    <p className="text-gray-600">+90 555 000 0000</p>
                    <p className="text-gray-600">+90 555 111 1111</p>
                  </div>
                </div>

                <div className="flex items-start space-x-4">
                  <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">
                      {language === 'TR' ? 'Adres' : 'Address'}
                    </h3>
                    <p className="text-gray-600">
                      {language === 'TR' 
                        ? 'Levent, Büyükdere Cad. No:123'
                        : 'Levent, Buyukdere St. No:123'}
                    </p>
                    <p className="text-gray-600">
                      {language === 'TR' 
                        ? '34394 Şişli/İstanbul, Türkiye'
                        : '34394 Sisli/Istanbul, Turkey'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Office Hours */}
              <div className="mt-12 p-6 bg-purple-50 rounded-xl">
                <h3 className="text-xl font-semibold mb-4 text-gray-900">
                  {language === 'TR' ? 'Çalışma Saatleri' : 'Office Hours'}
                </h3>
                <div className="space-y-2 text-gray-600">
                  <p>
                    <span className="font-medium">
                      {language === 'TR' ? 'Pazartesi - Cuma:' : 'Monday - Friday:'}
                    </span>{' '}
                    09:00 - 18:00
                  </p>
                  <p>
                    <span className="font-medium">
                      {language === 'TR' ? 'Cumartesi:' : 'Saturday:'}
                    </span>{' '}
                    10:00 - 16:00
                  </p>
                  <p>
                    <span className="font-medium">
                      {language === 'TR' ? 'Pazar:' : 'Sunday:'}
                    </span>{' '}
                    {language === 'TR' ? 'Kapalı' : 'Closed'}
                  </p>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white rounded-xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-6 text-gray-900">
                {language === 'TR' ? 'Mesaj Gönderin' : 'Send Message'}
              </h2>

              {success && (
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
                  <p className="text-green-700">
                    {language === 'TR' 
                      ? 'Mesajınız başarıyla gönderildi!'
                      : 'Your message has been sent successfully!'}
                  </p>
                </div>
              )}

              {error && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-700">{error}</p>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'TR' ? 'Adınız' : 'Your Name'} *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={language === 'TR' ? 'Ad Soyad' : 'Full Name'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'TR' ? 'E-posta' : 'Email'} *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={language === 'TR' ? 'ornek@email.com' : 'example@email.com'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'TR' ? 'Konu' : 'Subject'}
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                    placeholder={language === 'TR' ? 'Mesajınızın konusu' : 'Message subject'}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {language === 'TR' ? 'Mesajınız' : 'Your Message'} *
                  </label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    rows={6}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none"
                    placeholder={language === 'TR' 
                      ? 'Mesajınızı buraya yazın...'
                      : 'Write your message here...'}
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 px-6 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>
                        {language === 'TR' ? 'Gönderiliyor...' : 'Sending...'}
                      </span>
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      <span>
                        {language === 'TR' ? 'Gönder' : 'Send'}
                      </span>
                    </>
                  )}
                </button>
              </form>

              <p className="mt-4 text-sm text-gray-500">
                * {language === 'TR' ? 'Zorunlu alanlar' : 'Required fields'}
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="mt-16">
            <h2 className="text-3xl font-bold mb-8 text-center text-gray-900">
              {language === 'TR' ? 'Konumumuz' : 'Our Location'}
            </h2>
            <div className="bg-gray-200 rounded-xl h-96 flex items-center justify-center">
              <p className="text-gray-600">
                {language === 'TR' 
                  ? 'Harita yakında eklenecek'
                  : 'Map will be added soon'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <Footer language={language} />
    </div>
  )
}

export default ContactPage 