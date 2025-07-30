import React, { useState, useEffect, useRef } from 'react'
import { Search, X, ChevronDown, Image as ImageIcon } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const SearchableImageSelect = ({ 
  value, 
  onChange, 
  placeholder = "Select an image...", 
  label = "Image",
  category = null,
  language = 'EN'
}) => {
  const [images, setImages] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const dropdownRef = useRef(null)
  const searchInputRef = useRef(null)

  useEffect(() => {
    loadImages()
  }, [category])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
        setSearchTerm('')
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const loadImages = async () => {
    setIsLoading(true)
    try {
      let url = `${API_BASE_URL}/api/images`
      if (category) {
        url += `?category=${category}`
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      // Handle different response formats
      if (data.success === false) {
        setImages([])
        return
      }
      
      // Support both direct array and wrapped object formats
      if (Array.isArray(data)) {
        setImages(data)
      } else if (data.images && Array.isArray(data.images)) {
        setImages(data.images)
      } else {
        setImages([])
      }
    } catch (error) {
      console.error('Error loading images:', error)
      setImages([])
    } finally {
      setIsLoading(false)
    }
  }

  const getImageUrl = (image) => {
    if (image.file_path.startsWith('http')) {
      return image.file_path
    }
    return `${API_BASE_URL}${image.file_path}`
  }

  const filteredImages = images.filter(image => 
    image.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    image.alt_text?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const selectedImage = images.find(img => getImageUrl(img) === value)

  const handleSelect = (image) => {
    const imageUrl = getImageUrl(image)
    onChange(imageUrl, image.id)
    setIsOpen(false)
    setSearchTerm('')
  }

  const handleClear = () => {
    onChange('', null)
    setIsOpen(false)
    setSearchTerm('')
  }

  const toggleDropdown = () => {
    setIsOpen(!isOpen)
    if (!isOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus()
      }, 100)
    }
  }

  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      
      <div className="relative" ref={dropdownRef}>
        {/* Main Button */}
        <button
          type="button"
          onClick={toggleDropdown}
          className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-lg hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
        >
          <div className="flex items-center space-x-3 flex-1">
            {selectedImage ? (
              <>
                <img
                  src={getImageUrl(selectedImage)}
                  alt={selectedImage.title}
                  className="w-8 h-8 object-cover rounded"
                />
                <span className="text-sm text-gray-900 truncate">
                  {selectedImage.title || 'Untitled'}
                </span>
              </>
            ) : (
              <>
                <ImageIcon className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500">{placeholder}</span>
              </>
            )}
          </div>
          
          <div className="flex items-center space-x-2">
            {selectedImage && (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  handleClear()
                }}
                className="p-1 hover:bg-gray-100 rounded transition-colors"
              >
                <X className="w-4 h-4 text-gray-400" />
              </button>
            )}
            <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
          </div>
        </button>

        {/* Dropdown */}
        {isOpen && (
          <div className="absolute z-50 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-hidden">
            {/* Search Input */}
            <div className="p-3 border-b border-gray-100">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder={language === 'TR' ? 'Resim ara...' : 'Search images...'}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary text-sm"
                />
              </div>
            </div>

            {/* Image List */}
            <div className="max-h-60 overflow-y-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-8">
                  <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary"></div>
                  <span className="ml-2 text-sm text-gray-600">
                    {language === 'TR' ? 'Yükleniyor...' : 'Loading...'}
                  </span>
                </div>
              ) : filteredImages.length === 0 ? (
                <div className="text-center py-8">
                  <ImageIcon className="h-8 w-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">
                    {language === 'TR' ? 'Resim bulunamadı' : 'No images found'}
                  </p>
                </div>
              ) : (
                <div className="py-1">
                  {filteredImages.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => handleSelect(image)}
                      className="w-full flex items-center space-x-3 px-3 py-2 hover:bg-gray-50 transition-colors text-left"
                    >
                      <img
                        src={getImageUrl(image)}
                        alt={image.title}
                        className="w-10 h-10 object-cover rounded"
                        onError={(e) => {
                          e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                        }}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-900 truncate">
                          {image.title || 'Untitled'}
                        </p>
                        {image.alt_text && (
                          <p className="text-xs text-gray-500 truncate">
                            {image.alt_text}
                          </p>
                        )}
                      </div>
                      {getImageUrl(image) === value && (
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Preview */}
      {selectedImage && (
        <div className="mt-3 p-3 bg-gray-50 rounded-lg">
          <div className="flex items-center space-x-3">
            <img
              src={getImageUrl(selectedImage)}
              alt={selectedImage.title}
              className="w-16 h-16 object-cover rounded-lg"
            />
            <div>
              <p className="text-sm font-medium text-gray-900">
                {selectedImage.title || 'Untitled'}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                {language === 'TR' ? 'Seçilen resim' : 'Selected image'}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default SearchableImageSelect 