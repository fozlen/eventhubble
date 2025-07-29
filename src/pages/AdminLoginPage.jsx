import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowLeft, Eye, EyeOff, LogIn } from 'lucide-react'
import LogoService from '../services/logoService'

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })
  const [logo, setLogo] = useState('/Logo.png')
  const navigate = useNavigate()

  // Load logo
  React.useEffect(() => {
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

  // Admin credentials from environment variables
  const ADMIN_USERNAME = import.meta.env.VITE_ADMIN_USERNAME || 'admin'
  const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123'

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    // Simulate loading time
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())
      navigate('/admin/dashboard')
    } else {
      setError(language === 'TR' ? 'Geçersiz kullanıcı adı veya şifre!' : 'Invalid username or password!')
    }
    
    setLoading(false)
  }

  const toggleLanguage = () => {
    const newLanguage = language === 'TR' ? 'EN' : 'TR'
    setLanguage(newLanguage)
    localStorage.setItem('language', newLanguage)
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Admin Header */}
      <header className="bg-primary shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo and Brand */}
            <div className="flex items-center space-x-3">
              <img src={logo} alt="EventHubble" className="h-8 w-auto" />
              <div>
                <span className="text-xl font-bold">
                  <span className="text-white">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
                <span className="ml-2 text-sm text-white/80">Admin Panel</span>
              </div>
            </div>

            {/* Back to Site */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{language === 'TR' ? 'Siteye Dön' : 'Back to Site'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-xl shadow-2xl border border-gray-100 p-8">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="w-20 h-20 mx-auto mb-4 bg-primary/10 rounded-full flex items-center justify-center">
                <LogIn className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-2xl font-bold text-text mb-2">
                {language === 'TR' ? 'Admin Girişi' : 'Admin Login'}
              </h1>
              <p className="text-text/60">
                {language === 'TR' 
                  ? 'Yönetim paneline erişmek için giriş yapın'
                  : 'Sign in to access the admin panel'
                }
              </p>
            </div>

            {/* Login Form */}
            <form onSubmit={handleLogin} className="space-y-6">
              {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="text-red-600 text-sm font-medium">{error}</p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kullanıcı Adı' : 'Username'}
                </label>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                  placeholder={language === 'TR' ? 'Kullanıcı adınızı girin' : 'Enter your username'}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Şifre' : 'Password'}
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 pr-12 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder={language === 'TR' ? 'Şifrenizi girin' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-text/40 hover:text-text/60"
                  >
                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-primary hover:bg-primary/90 disabled:bg-primary/50 text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center space-x-2"
              >
                {loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
                    <span>{language === 'TR' ? 'Giriş yapılıyor...' : 'Signing in...'}</span>
                  </>
                ) : (
                  <>
                    <LogIn className="h-5 w-5" />
                    <span>{language === 'TR' ? 'Giriş Yap' : 'Sign In'}</span>
                  </>
                )}
              </button>
            </form>

            {/* Language Toggle */}
            <div className="mt-6 pt-6 border-t border-gray-100">
              <button
                onClick={toggleLanguage}
                className="w-full text-center text-sm text-text/60 hover:text-text transition-colors"
              >
                {language === 'TR' ? '🇺🇸 Switch to English' : '🇹🇷 Türkçe\'ye geç'}
              </button>
            </div>
          </div>

          {/* Demo Credentials */}
          {!import.meta.env.PROD && (
            <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-blue-800 text-sm font-medium mb-2">
                {language === 'TR' ? 'Demo Bilgileri:' : 'Demo Credentials:'}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>{language === 'TR' ? 'Kullanıcı' : 'Username'}:</strong> {ADMIN_USERNAME}
              </p>
              <p className="text-blue-700 text-sm">
                <strong>{language === 'TR' ? 'Şifre' : 'Password'}:</strong> {ADMIN_PASSWORD}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage 