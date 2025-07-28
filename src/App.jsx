import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { LanguageProvider } from './contexts/LanguageContext'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import AboutPage from './pages/AboutPage'
import WorldNewsPage from './pages/WorldNewsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import AdminLoginPage from './pages/AdminLoginPage'
import AdminDashboardPage from './pages/AdminDashboardPage'
import AdminEventManagementPage from './pages/AdminEventManagementPage'
import CategoriesPage from './pages/CategoriesPage'
import BlogDetailPage from './pages/BlogDetailPage'
import './App.css'

function App() {
  return (
    <LanguageProvider>
      <Router>
        <div className="App">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/event/:eventId" element={<EventDetailPage />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/world-news" element={<WorldNewsPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
            <Route path="/admin/events" element={<AdminEventManagementPage />} />
            <Route path="/admin/categories" element={<CategoriesPage />} />
          </Routes>
        </div>
      </Router>
    </LanguageProvider>
  )
}

export default App

