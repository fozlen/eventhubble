import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Eye, EyeOff, Lock, User, ArrowLeft } from 'lucide-react'
// Image paths for API compatibility
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com/api' : 'http://localhost:3001/api')
const logo = `${API_BASE_URL}/assets/Logo.png`

const AdminLoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'EN'
  })
  const navigate = useNavigate()

  // Admin credentials from environment variables
  const ADMIN_CREDENTIALS = {
    username: import.meta.env.VITE_ADMIN_USERNAME || 'admin',
    password: import.meta.env.VITE_ADMIN_PASSWORD || 'eventhubble2024'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000))

    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      // Store admin session
      localStorage.setItem('adminAuthenticated', 'true')
      localStorage.setItem('adminLoginTime', Date.now().toString())
      navigate('/admin/dashboard')
    } else {
      setError(language === 'TR' ? 'Geçersiz kullanıcı adı veya şifre' : 'Invalid username or password')
    }
    
    setIsLoading(false)
  }

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword)
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
              <div className="text-white">
                <span className="text-xl font-bold">
                  <span className="text-primary-cream">Event</span>
                  <span className="text-primary-light"> Hubble</span>
                </span>
                <span className="ml-2 text-sm text-primary-cream/80">Admin Panel</span>
              </div>
            </div>

            {/* Back to Site */}
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 text-primary-cream/80 hover:text-primary-cream transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="text-sm">{language === 'TR' ? 'Siteye Dön' : 'Back to Site'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="max-w-md w-full">
          {/* Login Card */}
          <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-8">
            {/* Logo and Header */}
            <div className="text-center mb-8">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <img
                  className="h-10 w-auto"
                  src={logo}
                  alt="EventHubble"
                />
              </div>
              <h1 className="text-2xl font-bold text-text mb-2">
                {language === 'TR' ? 'Admin Girişi' : 'Admin Login'}
              </h1>
                              <p className="text-text/60">
                  {language === 'TR' 
                    ? 'Event Hubble Blog Yönetim Paneli'
                    : 'Event Hubble Blog Management Panel'
                  }
                </p>
            </div>

            {/* Login Form */}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {/* Username Field */}
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Kullanıcı Adı' : 'Username'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full pl-10 pr-3 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder={language === 'TR' ? 'Kullanıcı adınızı girin' : 'Enter your username'}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Şifre' : 'Password'}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-text/40" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary bg-white text-text placeholder-text/40"
                    placeholder={language === 'TR' ? 'Şifrenizi girin' : 'Enter your password'}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-text/40 hover:text-text/60 transition-colors"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="text-text-accent text-sm text-center bg-text-accent/10 p-3 rounded-lg border border-text-accent/20">
                  {error}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-primary hover:bg-primary-light focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    {language === 'TR' ? 'Giriş yapılıyor...' : 'Signing in...'}
                  </div>
                ) : (
                  language === 'TR' ? 'Giriş Yap' : 'Sign In'
                )}
              </button>
            </form>

            {/* Demo Credentials - Only in Development */}
            {import.meta.env.DEV && (
              <div className="mt-6 p-4 bg-background-secondary rounded-lg">
                <h3 className="text-sm font-medium text-text mb-2">
                  {language === 'TR' ? 'Demo Bilgileri (Sadece Geliştirme)' : 'Demo Credentials (Development Only)'}
                </h3>
                <div className="text-xs text-text/60 space-y-1">
                  <p><strong>{language === 'TR' ? 'Kullanıcı Adı:' : 'Username:'}</strong> admin</p>
                  <p><strong>{language === 'TR' ? 'Şifre:' : 'Password:'}</strong> eventhubble2024</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLoginPage 