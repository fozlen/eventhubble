import React, { useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import CacheService from './services/cacheService'
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
import './App.css'

function App() {
  // Preload all content on app start
  useEffect(() => {
    CacheService.preloadAll('EN')
  }, [])

  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/world-news" element={<WorldNewsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/blog" element={<AdminBlogManagementPage />} />
            <Route path="/admin/events" element={<AdminEventManagementPage />} />
            <Route path="/admin/settings" element={<AdminSiteSettingsPage />} />
            <Route path="/admin/logos" element={<AdminLogosPage />} />
            <Route path="/admin/images" element={<AdminImagesPage />} />
            <Route path="/admin/categories" element={<AdminCategoriesPage />} />
            <Route path="/categories" element={<CategoriesPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

