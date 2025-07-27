import React, { useState } from 'react'
import { ChevronDown, Image as ImageIcon } from 'lucide-react'

const ImageSelector = ({ 
  value, 
  onChange, 
  placeholder = "Resim seçin...", 
  label = "Image URL",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)

  // Public klasöründeki resimler
  const publicImages = [
    {
      name: "EventHubble Logo",
      url: "/Logo.png",
      category: "logo"
    },
    {
      name: "EventHubble Logo (No Background)",
      url: "/Logo w_out background.png",
      category: "logo"
    },
    {
      name: "EventHubble Main Logo",
      url: "/MainLogo.png",
      category: "logo"
    },
    {
      name: "EventHubble Light Transparent Logo",
      url: "/eventhubble_light_transparent_logo.png",
      category: "logo"
    },
    {
      name: "EventHubble Dark Transparent Logo",
      url: "/eventhubble_dark_transparent_logo.png",
      category: "logo"
    },
    {
      name: "EventHubble Truly Transparent 512x512",
      url: "/eventhubble_truly_transparent_512x512.png",
      category: "logo"
    },
    {
      name: "EventHubble Truly Transparent 180x180",
      url: "/eventhubble_truly_transparent_180x180.png",
      category: "logo"
    },
    {
      name: "EventHubble Truly Transparent 64x64",
      url: "/eventhubble_truly_transparent_64x64.png",
      category: "logo"
    },
    {
      name: "EventHubble Truly Transparent 32x32",
      url: "/eventhubble_truly_transparent_32x32.png",
      category: "logo"
    },
    {
      name: "EventHubble Light Truly Transparent 192x192",
      url: "/eventhubble_light_truly_transparent_192x192.png",
      category: "logo"
    },
    {
      name: "Apple Touch Icon",
      url: "/apple-touch-icon.png",
      category: "icon"
    },
    {
      name: "Icon 512x512",
      url: "/icon-512x512.png",
      category: "icon"
    },
    {
      name: "Favicon",
      url: "/favicon.ico",
      category: "icon"
    }
  ]

  const selectedImage = publicImages.find(img => img.url === value)

  const handleImageSelect = (imageUrl) => {
    onChange(imageUrl)
    setIsOpen(false)
  }

  const handleInputChange = (e) => {
    onChange(e.target.value)
  }

  return (
    <div className={`relative space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-text">
        {label}
      </label>
      
      {/* Input Field */}
      <div className="relative">
        <input
          type="text"
          value={value}
          onChange={handleInputChange}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
        
        {/* Dropdown Toggle Button */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="absolute right-2 top-1/2 transform -translate-y-1/2 p-1 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ChevronDown size={16} className={`transition-transform ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-y-auto">
          <div className="p-2">
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">Public Klasöründeki Resimler</div>
            
            {/* Logo Kategorisi */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Logolar</div>
              {publicImages.filter(img => img.category === 'logo').map((image) => (
                <button
                  key={image.url}
                  onClick={() => handleImageSelect(image.url)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                    value === image.url ? 'bg-primary/10 text-primary' : 'text-gray-700'
                  }`}
                >
                  <ImageIcon size={14} className="text-gray-400" />
                  <span className="truncate">{image.name}</span>
                </button>
              ))}
            </div>

            {/* Icon Kategorisi */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">İkonlar</div>
              {publicImages.filter(img => img.category === 'icon').map((image) => (
                <button
                  key={image.url}
                  onClick={() => handleImageSelect(image.url)}
                  className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors flex items-center space-x-2 ${
                    value === image.url ? 'bg-primary/10 text-primary' : 'text-gray-700'
                  }`}
                >
                  <ImageIcon size={14} className="text-gray-400" />
                  <span className="truncate">{image.name}</span>
                </button>
              ))}
            </div>

            {/* Özel URL Seçeneği */}
            <div className="border-t pt-2">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Özel URL</div>
              <button
                onClick={() => handleImageSelect('')}
                className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors ${
                  !value || !publicImages.find(img => img.url === value) ? 'bg-primary/10 text-primary' : 'text-gray-700'
                }`}
              >
                Manuel URL girin...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {selectedImage && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Seçilen: {selectedImage.name}</div>
          <div className="flex items-center space-x-2">
            <img 
              src={selectedImage.url} 
              alt={selectedImage.name}
              className="w-8 h-8 object-contain rounded"
            />
            <span className="text-xs text-gray-500">{selectedImage.url}</span>
          </div>
        </div>
      )}
    </div>
  )
}

export default ImageSelector 