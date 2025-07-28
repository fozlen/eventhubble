import React, { useState } from 'react'
import { Search, X } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

const ModernSearchBox = ({ 
  placeholder, 
  className = "", 
  onSearch, 
  language = "EN",
  showCloseButton = true,
  autoFocus = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()

  const handleSearch = () => {
    if (searchTerm.trim()) {
      if (onSearch) {
        onSearch(searchTerm)
      } else {
        const searchParams = new URLSearchParams()
        searchParams.set('q', searchTerm)
        navigate(`/search?${searchParams.toString()}`)
      }
      setSearchTerm('')
    }
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSearch()
    }
  }

  const handleClear = () => {
    setSearchTerm('')
  }

  return (
    <div className={`bg-white rounded-2xl shadow-xl p-3 ${className}`}>
      <div className="flex items-center space-x-3">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-text/40" size={18} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={placeholder || (language === 'TR' ? 'Hangi etkinliği arıyorsunuz?' : 'What event are you looking for?')}
            className="w-full pl-10 pr-4 py-3 bg-gray-50 rounded-xl border-0 focus:ring-2 focus:ring-primary/20 focus:bg-white transition-all duration-200 text-text text-sm"
            autoFocus={autoFocus}
          />
        </div>
        <button
          onClick={handleSearch}
          className="bg-primary text-white px-4 py-3 rounded-xl hover:bg-primary/90 transition-colors flex items-center space-x-2 shadow-lg hover:shadow-xl"
        >
          <Search size={18} />
          <span className="text-sm font-medium">{language === 'TR' ? 'Ara' : 'Search'}</span>
        </button>
        {showCloseButton && (
          <button
            onClick={handleClear}
            className="p-2 text-text/50 hover:text-text hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        )}
      </div>
    </div>
  )
}

export default ModernSearchBox 