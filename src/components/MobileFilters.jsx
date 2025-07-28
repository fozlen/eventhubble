import React from 'react'
import { X, Filter, Calendar, MapPin, Tag, DollarSign } from 'lucide-react'

const MobileFilters = ({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  onCategoryChange, 
  sortBy, 
  onSortChange,
  language 
}) => {
  const categories = [
    { id: '', name: language === 'TR' ? 'Tümü' : 'All' },
    { id: 'music', name: language === 'TR' ? 'Müzik' : 'Music' },
    { id: 'theater', name: language === 'TR' ? 'Tiyatro' : 'Theater' },
    { id: 'sports', name: language === 'TR' ? 'Spor' : 'Sports' },
    { id: 'art', name: language === 'TR' ? 'Sanat' : 'Art' },
    { id: 'gastronomy', name: language === 'TR' ? 'Gastronomi' : 'Gastronomy' },
    { id: 'education', name: language === 'TR' ? 'Eğitim' : 'Education' }
  ]

  const sortOptions = [
    { id: 'date', name: language === 'TR' ? 'Tarihe Göre' : 'By Date', icon: Calendar },
    { id: 'name', name: language === 'TR' ? 'İsme Göre' : 'By Name', icon: Tag },
    { id: 'price', name: language === 'TR' ? 'Fiyata Göre' : 'By Price', icon: DollarSign }
  ]

  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />

      {/* Filters Panel */}
      <div className={`fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 transition-transform duration-300 ${
        isOpen ? 'translate-y-0' : 'translate-y-full'
      }`}>
        {/* Handle */}
        <div className="flex justify-center pt-4 pb-2">
          <div className="w-12 h-1 bg-gray-300 rounded-full"></div>
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <div className="flex items-center space-x-2">
            <Filter size={20} className="text-primary" />
            <h3 className="text-lg font-semibold text-text">
              {language === 'TR' ? 'Filtreler' : 'Filters'}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-text/60 hover:text-text transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6 max-h-96 overflow-y-auto">
          {/* Categories */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text/80 mb-3">
              {language === 'TR' ? 'Kategoriler' : 'Categories'}
            </h4>
            <div className="grid grid-cols-2 gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryChange(category.id)}
                  className={`p-3 rounded-xl text-sm font-medium transition-all duration-200 ${
                    selectedCategory === category.id
                      ? 'bg-primary text-white shadow-lg'
                      : 'bg-gray-100 text-text/70 hover:bg-gray-200'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sort Options */}
          <div className="mb-6">
            <h4 className="text-sm font-medium text-text/80 mb-3">
              {language === 'TR' ? 'Sıralama' : 'Sort By'}
            </h4>
            <div className="space-y-2">
              {sortOptions.map((option) => {
                const IconComponent = option.icon
                return (
                  <button
                    key={option.id}
                    onClick={() => onSortChange(option.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-xl transition-all duration-200 ${
                      sortBy === option.id
                        ? 'bg-primary/10 text-primary border border-primary/20'
                        : 'bg-gray-50 text-text/70 hover:bg-gray-100'
                    }`}
                  >
                    <IconComponent size={18} />
                    <span className="text-sm font-medium">{option.name}</span>
                    {sortBy === option.id && (
                      <div className="ml-auto w-2 h-2 bg-primary rounded-full"></div>
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3">
            <button
              onClick={() => {
                onCategoryChange('')
                onSortChange('date')
                onClose()
              }}
              className="w-full py-3 bg-primary text-white rounded-xl font-medium transition-colors hover:bg-primary/90"
            >
              {language === 'TR' ? 'Filtreleri Temizle' : 'Clear Filters'}
            </button>
            
            <button
              onClick={onClose}
              className="w-full py-3 bg-gray-100 text-text/70 rounded-xl font-medium transition-colors hover:bg-gray-200"
            >
              {language === 'TR' ? 'Uygula' : 'Apply'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default MobileFilters 