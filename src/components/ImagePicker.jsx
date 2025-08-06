import React, { useState, useEffect } from 'react'
import { X, Search, Image as ImageIcon } from 'lucide-react'

const API_BASE_URL = import.meta.env.VITE_API_URL || (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

const ImagePicker = ({ isOpen, onClose, onSelect, selectedImage, category = null }) => {
  const [images, setImages] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(category || '')

  const categories = [
    { value: '', label: 'All Images' },
    { value: 'event', label: 'Event Images' },
    { value: 'blog', label: 'Blog Images' },
    { value: 'hero', label: 'Hero Images' },
    { value: 'gallery', label: 'Gallery' }
  ]

  useEffect(() => {
    if (isOpen) {
      loadImages()
    }
  }, [isOpen, selectedCategory])

  const loadImages = async () => {
    setIsLoading(true)
    try {
      let url = `${API_BASE_URL}/api/images`
      if (selectedCategory) {
        url += `?category=${selectedCategory}`
      }
      
      const response = await fetch(url)
      const result = await response.json()
      setImages(result.data || [])
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Select Image</h2>
            <p className="text-sm text-gray-600 mt-1">Choose an image from your library</p>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 border-b border-gray-100 bg-gray-50">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search images..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Category Filter */}
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {categories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Images Grid */}
        <div className="p-4 overflow-y-auto max-h-96">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
              <span className="ml-3 text-gray-600">Loading images...</span>
            </div>
          ) : filteredImages.length === 0 ? (
            <div className="text-center py-12">
              <ImageIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No images found</p>
              <p className="text-sm text-gray-400 mt-1">Upload some images first</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {filteredImages.map((image) => (
                <div
                  key={image.id}
                  onClick={() => onSelect(image)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all hover:shadow-md ${
                    selectedImage?.id === image.id
                      ? 'border-blue-500 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <div className="aspect-square">
                    <img
                      src={getImageUrl(image)}
                      alt={image.alt_text || image.title}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik0yMCAxMkMxNi42ODYzIDEyIDEzIDEzLjM0MzEgMTMgMTdWMjNDMTMgMjYuNjU2OSAxNi42ODYzIDI4IDIwIDI4QzIzLjMxMzcgMjggMjcgMjYuNjU2OSAyNyAyM1YxN0MyNyAxMy4zNDMxIDIzLjMxMzcgMTIgMjAgMTJaIiBmaWxsPSIjOUIyQzJGIi8+Cjwvc3ZnPgo='
                      }}
                    />
                  </div>
                  {selectedImage?.id === image.id && (
                    <div className="absolute inset-0 bg-blue-500 bg-opacity-20 flex items-center justify-center">
                      <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black to-transparent p-2">
                    <p className="text-white text-xs font-medium truncate">
                      {image.title || 'Untitled'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t border-gray-200 bg-gray-50">
          <div className="text-sm text-gray-600">
            {selectedImage ? `Selected: ${selectedImage.title || 'Untitled'}` : 'No image selected'}
          </div>
          <div className="flex space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => selectedImage && onSelect(selectedImage)}
              disabled={!selectedImage}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Select Image
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ImagePicker 