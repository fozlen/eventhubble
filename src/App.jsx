import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { LanguageProvider } from './contexts/LanguageContext'
import useAuthStore from './stores/authStore'
import useAppStore from './stores/appStore'
import websocketService from './services/websocket'
import { api } from './services/api'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import AboutPage from './pages/AboutPage'
import ContactPage from './pages/ContactPage'
import WorldNewsPage from './pages/WorldNewsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboard from './pages/AdminDashboard'
import AdminBlogManagementPage from './pages/AdminBlogManagementPage'
import AdminEventManagementPage from './pages/AdminEventManagementPage'
import AdminSiteSettingsPage from './pages/AdminSiteSettingsPage'
import AdminLogosPage from './pages/AdminLogosPage'
import AdminImagesPage from './pages/AdminImagesPage'
import AdminCategoriesPage from './pages/AdminCategoriesPage'
import CategoriesPage from './pages/CategoriesPage'
import BlogDetailPage from './pages/BlogDetailPage'
import NotificationSystem from './components/NotificationSystem'
import './App.css'

// Create React Query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false
        }
        return failureCount < 3
      },
      refetchOnWindowFocus: false,
      refetchOnReconnect: true
    },
    mutations: {
      retry: false
    }
  }
})

// Protected Route Component
const ProtectedRoute = ({ children, requiredRole = null }) => {
  const { isAuthenticated, user, hasRole } = useAuthStore()
  
  if (!isAuthenticated) {
    return <Navigate to="/admin/login" replace />
  }
  
  if (requiredRole && !hasRole(requiredRole)) {
    return <Navigate to="/admin/dashboard" replace />
  }
  
  return children
}

// App initialization component
const AppInitializer = ({ children }) => {
  const { 
    isAuthenticated, 
    user, 
    checkAuth, 
    setCsrfToken,
    csrfToken 
  } = useAuthStore()
  
  const { 
    theme, 
    setTheme,
    addNotification 
  } = useAppStore()

  useEffect(() => {
    // Initialize theme
    const savedTheme = localStorage.getItem('theme') || 'light'
    setTheme(savedTheme)
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', savedTheme)
  }, [setTheme])

  useEffect(() => {
    // Check authentication status on app start
    const initializeAuth = async () => {
      try {
        const result = await checkAuth()
        if (result.success && result.data?.csrfToken) {
          setCsrfToken(result.data.csrfToken)
        }
      } catch (error) {
        console.error('Auth initialization failed:', error)
      }
    }

    initializeAuth()
  }, [checkAuth, setCsrfToken])

  useEffect(() => {
    // Initialize WebSocket connection
    if (isAuthenticated) {
      websocketService.connect()
      
      // Join admin room if user has admin role
      if (user && ['admin', 'super_admin'].includes(user.role)) {
        websocketService.joinAdminRoom(user.role)
      }
    } else {
      websocketService.disconnect()
    }

    // Cleanup on unmount
    return () => {
      websocketService.disconnect()
    }
  }, [isAuthenticated, user])

  useEffect(() => {
    // Check API health on app start
    const checkHealth = async () => {
      try {
        await api.healthCheck()
        console.log('✅ API connection successful')
      } catch (error) {
        console.error('⚠️ API connection failed:', error)
        addNotification({
          type: 'error',
          title: 'Connection Error',
          message: 'Unable to connect to server. Some features may not work.',
          duration: 10000
        })
      }
    }
    
    checkHealth()
  }, [addNotification])

  useEffect(() => {
    // Listen for content updates
    const handleContentUpdate = (event) => {
      const { detail } = event
      console.log('Content update received:', detail)
      
      // Invalidate relevant queries
      queryClient.invalidateQueries({ 
        queryKey: [detail.type] 
      })
    }

    window.addEventListener('content-updated', handleContentUpdate)
    
    return () => {
      window.removeEventListener('content-updated', handleContentUpdate)
    }
  }, [])

  return children
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <LanguageProvider>
        <AppInitializer>
          <Router>
            <div className="App">
              <NotificationSystem />
              <Routes>
                {/* Public Routes */}
                <Route path="/" element={<HomePage />} />
                <Route path="/event/:eventId" element={<EventDetailPage />} />
                <Route path="/about" element={<AboutPage />} />
                <Route path="/contact" element={<ContactPage />} />
                <Route path="/world-news" element={<WorldNewsPage />} />
                <Route path="/search" element={<SearchResultsPage />} />
                <Route path="/blog/:id" element={<BlogDetailPage />} />
                <Route path="/categories" element={<CategoriesPage />} />
                
                {/* Admin Routes */}
                <Route path="/admin/login" element={<AdminLoginPage />} />
                <Route 
                  path="/admin/dashboard" 
                  element={
                    <ProtectedRoute>
                      <AdminDashboard />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/blog" 
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <AdminBlogManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/events" 
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <AdminEventManagementPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/settings" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminSiteSettingsPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/logos" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminLogosPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/images" 
                  element={
                    <ProtectedRoute requiredRole="editor">
                      <AdminImagesPage />
                    </ProtectedRoute>
                  } 
                />
                <Route 
                  path="/admin/categories" 
                  element={
                    <ProtectedRoute requiredRole="admin">
                      <AdminCategoriesPage />
                    </ProtectedRoute>
                  } 
                />
                
                {/* 404 Page */}
                <Route 
                  path="*" 
                  element={
                    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-50">
                      <div className="text-center">
                        <h1 className="text-6xl font-bold text-gray-900 mb-4">404</h1>
                        <p className="text-xl text-gray-600 mb-8">Page not found</p>
                        <a 
                          href="/" 
                          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                        >
                          Go Home
                        </a>
                      </div>
                    </div>
                  } 
                />
              </Routes>
            </div>
          </Router>
        </AppInitializer>
      </LanguageProvider>
      
      {/* React Query DevTools - only in development */}
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App

