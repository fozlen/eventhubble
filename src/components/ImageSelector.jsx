import React, { useState } from 'react'
import { ChevronDown, Image as ImageIcon, Upload, X } from 'lucide-react'

const ImageSelector = ({ 
  value, 
  onChange, 
  placeholder = "Select image...", 
  label = "Image URL",
  className = "" 
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const [uploadedImage, setUploadedImage] = useState(null)
  const [isUploading, setIsUploading] = useState(false)

  // Images in public folder
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
    },
    // Event category images
    {
      name: "Music Festival",
      url: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Electronic Music Festival",
      url: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Theater Performance",
      url: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Sports Event",
      url: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Art Exhibition",
      url: "https://images.unsplash.com/photo-1541961017774-22349e4a1262?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Technology Conference",
      url: "https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Film Festival",
      url: "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Theater Stage",
      url: "https://images.unsplash.com/photo-1507676184212-d03ab07a01bf?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "Gastronomy Event",
      url: "https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=400&h=300&fit=crop",
      category: "events"
    },
    {
      name: "General Event",
      url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop",
      category: "events"
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

  // Handle file upload
  const handleFileUpload = async (event) => {
    const file = event.target.files[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      // Silent validation - no alert in production
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      // Silent validation - no alert in production
      return
    }

    setIsUploading(true)

    try {
      // Simple base64 solution
      const reader = new FileReader()
      
      reader.onload = (e) => {
        const dataUrl = e.target.result
        const fileName = `uploaded_${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`
        
        setUploadedImage({
          name: fileName,
          url: dataUrl,
          cdnUrl: dataUrl,
          originalName: file.name,
          fileSize: file.size
        })
        
        onChange(dataUrl)
        setIsUploading(false)
      }
      
      reader.onerror = () => {
        // Silent error - no alert in production
        setIsUploading(false)
      }
      
      reader.readAsDataURL(file)

          } catch (error) {
        if (!import.meta.env.PROD) {
          console.error('Upload error:', error)
        }
        // Silent error - no alert in production
        setIsUploading(false)
      }
  }

  const removeUploadedImage = () => {
    setUploadedImage(null)
    onChange('')
  }

  return (
    <div className={`relative space-y-2 ${className}`}>
      <label className="block text-sm font-medium text-text">
        {label}
      </label>
      
      {/* Upload Section */}
      <div className="mb-4">
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-primary transition-colors">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
            id="image-upload"
            disabled={isUploading}
          />
          <label htmlFor="image-upload" className="cursor-pointer">
            <Upload size={24} className="mx-auto mb-2 text-gray-400" />
            <p className="text-sm text-gray-600">
              {isUploading ? 'Uploading...' : 'Click to upload image or drag and drop'}
            </p>
            <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 5MB</p>
          </label>
        </div>
      </div>

      {/* Uploaded Image Preview */}
      {uploadedImage && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img 
                src={uploadedImage.url} 
                alt={uploadedImage.name}
                className="w-12 h-12 object-cover rounded"
              />
              <div>
                <p className="text-sm font-medium text-green-800">{uploadedImage.name}</p>
                <p className="text-xs text-green-600">CDN URL: {uploadedImage.cdnUrl}</p>
              </div>
            </div>
            <button
              onClick={removeUploadedImage}
              className="text-red-500 hover:text-red-700"
            >
              <X size={16} />
            </button>
          </div>
        </div>
      )}
      
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
            <div className="text-xs font-medium text-gray-500 mb-2 px-2">Images in Public Folder</div>
            
            {/* Logo Category */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Logos</div>
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

            {/* Icon Category */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Icons</div>
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

            {/* Events Category */}
            <div className="mb-3">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Event Images</div>
              {publicImages.filter(img => img.category === 'events').map((image) => (
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

            {/* Custom URL Option */}
            <div className="border-t pt-2">
              <div className="text-xs font-medium text-gray-700 mb-1 px-2">Custom URL</div>
              <button
                onClick={() => handleImageSelect('')}
                className={`w-full text-left px-2 py-1.5 rounded text-sm hover:bg-gray-100 transition-colors ${
                  !value || !publicImages.find(img => img.url === value) ? 'bg-primary/10 text-primary' : 'text-gray-700'
                }`}
              >
                Enter manual URL...
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {selectedImage && (
        <div className="mt-2 p-2 bg-gray-50 rounded-md">
          <div className="text-xs text-gray-600 mb-1">Selected: {selectedImage.name}</div>
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