import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import HomePage from './pages/HomePage'
import EventDetailPage from './pages/EventDetailPage'
import AboutPage from './pages/AboutPage'
import WorldNewsPage from './pages/WorldNewsPage'
import SearchResultsPage from './pages/SearchResultsPage'
import './App.css'

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/event/:eventId" element={<EventDetailPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/world-news" element={<WorldNewsPage />} />
          <Route path="/search" element={<SearchResultsPage />} />
        </Routes>
            </div>
    </Router>
  )
}

export default App

