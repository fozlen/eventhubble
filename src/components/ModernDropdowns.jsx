import React, { useState, Fragment } from 'react'
import * as DropdownMenu from '@radix-ui/react-dropdown-menu'
import * as Popover from '@radix-ui/react-popover'
import * as Select from '@radix-ui/react-select'
import * as Dialog from '@radix-ui/react-dialog'
import { CheckIcon, ChevronDown, X, Filter, ChevronUpIcon, ChevronRightIcon, Search } from 'lucide-react'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"

// Modern Multi-Select Dropdown Component
export const MultiSelectDropdown = ({ 
  options, 
  selected, 
  onChange, 
  placeholder, 
  icon: Icon,
  className = "" 
}) => {
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
          <Icon size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="flex-1 text-left text-gray-700 dark:text-gray-300">
            {selected.length === 0 
              ? placeholder 
              : selected.length === 1 
                ? selected[0].label 
                : `${selected.length} selected`
            }
          </span>
          <ChevronDown size={14} className="text-gray-400 transition-transform duration-200" />
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          className="min-w-[220px] bg-white dark:bg-gray-700 rounded-lg p-1 shadow-lg border border-gray-200 dark:border-gray-600 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          sideOffset={5}
        >
          {options.map((option) => (
            <DropdownMenu.CheckboxItem
              key={option.value}
              className="relative flex items-center px-2 py-2 text-sm text-gray-700 dark:text-gray-300 rounded-md cursor-pointer select-none outline-none hover:bg-gray-100 dark:hover:bg-gray-600 data-[state=checked]:bg-blue-50 dark:data-[state=checked]:bg-blue-900/30"
              checked={selected.some(s => s.value === option.value)}
              onCheckedChange={(checked) => {
                if (checked) {
                  onChange([...selected, option])
                } else {
                  onChange(selected.filter(s => s.value !== option.value))
                }
              }}
            >
              <DropdownMenu.ItemIndicator className="absolute left-2 flex items-center justify-center">
                <CheckIcon size={16} className="text-blue-600" />
              </DropdownMenu.ItemIndicator>
              {option.label}
            </DropdownMenu.CheckboxItem>
          ))}
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  )
}

// Modern Date Range Picker Component with Grid Layout
export const DateRangePicker = ({ 
  selectedDates, 
  onChange, 
  placeholder, 
  icon: Icon,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('presets') // 'presets' or 'custom'
  
  const dateOptions = [
    { value: 'today', label: 'Bugün', description: 'Bugün gerçekleşen etkinlikler' },
    { value: 'tomorrow', label: 'Yarın', description: 'Yarın gerçekleşen etkinlikler' },
    { value: 'this-week', label: 'Bu Hafta', description: 'Bu haftaki etkinlikler' },
    { value: 'next-week', label: 'Gelecek Hafta', description: 'Gelecek haftaki etkinlikler' },
    { value: 'this-month', label: 'Bu Ay', description: 'Bu ayki etkinlikler' },
    { value: 'next-month', label: 'Gelecek Ay', description: 'Gelecek ayki etkinlikler' },
    { value: 'this-weekend', label: 'Bu Hafta Sonu', description: 'Bu hafta sonu etkinlikleri' },
    { value: 'next-weekend', label: 'Gelecek Hafta Sonu', description: 'Gelecek hafta sonu etkinlikleri' },
    { value: 'custom', label: 'Özel Aralık', description: 'Belirli tarihleri seçin' }
  ]

  const handleDateOptionChange = (option) => {
    if (option.value === 'custom') {
      setView('custom')
      setSearchTerm('')
    } else {
      onChange({ type: 'preset', value: option.value })
      // Close the dropdown after selection
      const event = new Event('click', { bubbles: true })
      document.dispatchEvent(event)
    }
  }

  const filteredOptions = dateOptions.filter(option => 
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
          <Icon size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="flex-1 text-left text-gray-700 dark:text-gray-300">
            {selectedDates.startDate && selectedDates.endDate
              ? `${selectedDates.startDate.toLocaleDateString()} - ${selectedDates.endDate.toLocaleDateString()}`
              : placeholder
            }
          </span>
          {selectedDates.startDate && selectedDates.endDate && (
            <button
              onClick={(e) => {
                e.stopPropagation()
                onChange({ startDate: null, endDate: null })
              }}
              className="p-1 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X size={12} className="text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <ChevronDown size={14} className="text-gray-400 transition-transform duration-200" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-96 p-4 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          sideOffset={5}
        >
          <div className="space-y-4">
            {/* Header with back button for custom view */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {view === 'presets' ? 'Tarih Aralığı Seç' : 'Özel Tarih Aralığı'}
              </h3>
              {view === 'custom' && (
                <button
                  onClick={() => {
                    setView('presets')
                    setSearchTerm('')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  ← Önceden Tanımlıya Dön
                </button>
              )}
            </div>

            {/* Search Input for presets */}
            {view === 'presets' && (
              <div className="relative">
                <input
                  type="text"
                  placeholder="Tarih seçeneklerini ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                />
                <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              </div>
            )}

            {/* Preset Options Grid */}
            {view === 'presets' && (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {filteredOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDateOptionChange(option)
                    }}
                    className="p-3 rounded-lg border transition-all duration-200 text-left bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100"
                  >
                    <div className="flex items-center">
                      <div className="flex-1">
                        <div className="font-medium">{option.label}</div>
                        <div className="text-xs text-gray-500">{option.description}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}

            {/* Custom Date Picker */}
            {view === 'custom' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Tarih Aralığı Seç</span>
                </div>
                <div className="w-full">
                  <DatePicker
                    selectsRange={true}
                    startDate={selectedDates.startDate}
                    endDate={selectedDates.endDate}
                    onChange={(dates) => {
                      onChange({ type: 'custom', startDate: dates[0], endDate: dates[1] })
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                    placeholderText="Tarih aralığı seçin"
                    dateFormat="MMM dd, yyyy"
                    isClearable={true}
                    showPopperArrow={false}
                    popperClassName="react-datepicker-popper"
                    popperPlacement="bottom-start"
                    calendarClassName="react-datepicker-calendar"
                    wrapperClassName="datepicker-wrapper"
                  />
                </div>
                
                {/* Quick Date Buttons */}
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => {
                      const today = new Date()
                      const tomorrow = new Date(today)
                      tomorrow.setDate(tomorrow.getDate() + 1)
                      onChange({ type: 'custom', startDate: today, endDate: tomorrow })
                    }}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    Bugün - Yarın
                  </button>
                  <button
                    onClick={() => {
                      const today = new Date()
                      const nextWeek = new Date(today)
                      nextWeek.setDate(nextWeek.getDate() + 7)
                      onChange({ type: 'custom', startDate: today, endDate: nextWeek })
                    }}
                    className="px-3 py-2 text-sm bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors duration-200"
                  >
                    Sonraki 7 Gün
                  </button>
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

// Modern Country-City Selector Component with Search
export const CountryCitySelector = ({ 
  selectedCountry, 
  selectedCities, 
  onCountryChange, 
  onCitiesChange, 
  placeholder, 
  icon: Icon,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [view, setView] = useState('countries') // 'countries' or 'cities'

  const countries = [
    { value: 'turkey', label: 'Turkey', flag: '🇹🇷' },
    { value: 'usa', label: 'United States', flag: '🇺🇸' },
    { value: 'uk', label: 'United Kingdom', flag: '🇬🇧' },
    { value: 'germany', label: 'Germany', flag: '🇩🇪' },
    { value: 'france', label: 'France', flag: '🇫🇷' },
    { value: 'italy', label: 'Italy', flag: '🇮🇹' },
    { value: 'spain', label: 'Spain', flag: '🇪🇸' },
    { value: 'netherlands', label: 'Netherlands', flag: '🇳🇱' },
    { value: 'belgium', label: 'Belgium', flag: '🇧🇪' },
    { value: 'switzerland', label: 'Switzerland', flag: '🇨🇭' }
  ]

  const citiesByCountry = {
    turkey: [
      { value: 'istanbul', label: 'Istanbul' },
      { value: 'ankara', label: 'Ankara' },
      { value: 'izmir', label: 'Izmir' },
      { value: 'bursa', label: 'Bursa' },
      { value: 'antalya', label: 'Antalya' },
      { value: 'adana', label: 'Adana' },
      { value: 'konya', label: 'Konya' },
      { value: 'gaziantep', label: 'Gaziantep' }
    ],
    usa: [
      { value: 'new-york', label: 'New York' },
      { value: 'los-angeles', label: 'Los Angeles' },
      { value: 'chicago', label: 'Chicago' },
      { value: 'miami', label: 'Miami' },
      { value: 'houston', label: 'Houston' },
      { value: 'phoenix', label: 'Phoenix' },
      { value: 'philadelphia', label: 'Philadelphia' },
      { value: 'san-antonio', label: 'San Antonio' }
    ],
    uk: [
      { value: 'london', label: 'London' },
      { value: 'manchester', label: 'Manchester' },
      { value: 'birmingham', label: 'Birmingham' },
      { value: 'liverpool', label: 'Liverpool' },
      { value: 'leeds', label: 'Leeds' },
      { value: 'sheffield', label: 'Sheffield' }
    ],
    germany: [
      { value: 'berlin', label: 'Berlin' },
      { value: 'munich', label: 'Munich' },
      { value: 'hamburg', label: 'Hamburg' },
      { value: 'cologne', label: 'Cologne' },
      { value: 'frankfurt', label: 'Frankfurt' },
      { value: 'stuttgart', label: 'Stuttgart' }
    ],
    france: [
      { value: 'paris', label: 'Paris' },
      { value: 'lyon', label: 'Lyon' },
      { value: 'marseille', label: 'Marseille' },
      { value: 'toulouse', label: 'Toulouse' },
      { value: 'nice', label: 'Nice' },
      { value: 'nantes', label: 'Nantes' }
    ],
    italy: [
      { value: 'rome', label: 'Rome' },
      { value: 'milan', label: 'Milan' },
      { value: 'naples', label: 'Naples' },
      { value: 'turin', label: 'Turin' },
      { value: 'palermo', label: 'Palermo' },
      { value: 'genoa', label: 'Genoa' }
    ],
    spain: [
      { value: 'madrid', label: 'Madrid' },
      { value: 'barcelona', label: 'Barcelona' },
      { value: 'valencia', label: 'Valencia' },
      { value: 'seville', label: 'Seville' },
      { value: 'zaragoza', label: 'Zaragoza' },
      { value: 'malaga', label: 'Malaga' }
    ],
    netherlands: [
      { value: 'amsterdam', label: 'Amsterdam' },
      { value: 'rotterdam', label: 'Rotterdam' },
      { value: 'the-hague', label: 'The Hague' },
      { value: 'utrecht', label: 'Utrecht' },
      { value: 'eindhoven', label: 'Eindhoven' }
    ],
    belgium: [
      { value: 'brussels', label: 'Brussels' },
      { value: 'antwerp', label: 'Antwerp' },
      { value: 'ghent', label: 'Ghent' },
      { value: 'charleroi', label: 'Charleroi' },
      { value: 'liege', label: 'Liege' }
    ],
    switzerland: [
      { value: 'zurich', label: 'Zurich' },
      { value: 'geneva', label: 'Geneva' },
      { value: 'basel', label: 'Basel' },
      { value: 'bern', label: 'Bern' },
      { value: 'lausanne', label: 'Lausanne' }
    ]
  }

  const handleCountryChange = (country) => {
    onCountryChange(country)
    onCitiesChange([])
    setView('cities')
    setSearchTerm('')
  }

  const handleCityToggle = (city) => {
    const isSelected = selectedCities.some(c => c.value === city.value)
    if (isSelected) {
      onCitiesChange(selectedCities.filter(c => c.value !== city.value))
    } else {
      onCitiesChange([...selectedCities, city])
    }
  }

  const filteredCountries = countries.filter(country => 
    country.label.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const filteredCities = selectedCountry ? 
    citiesByCountry[selectedCountry.value]?.filter(city => 
      city.label.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [] : []

  const currentView = view === 'countries' ? filteredCountries : filteredCities

  return (
    <Popover.Root>
      <Popover.Trigger asChild>
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
          <Icon size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="flex-1 text-left text-gray-700 dark:text-gray-300">
            {selectedCountry 
              ? selectedCities.length > 0 
                ? `${selectedCountry.label} (${selectedCities.length} cities)`
                : selectedCountry.label
              : placeholder
            }
          </span>
          <ChevronDown size={14} className="text-gray-400 transition-transform duration-200" />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-96 p-4 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          sideOffset={5}
        >
          <div className="space-y-4">
            {/* Header with back button for cities view */}
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">
                {view === 'countries' ? 'Ülke Seç' : `${selectedCountry?.label} Şehirleri`}
              </h3>
              {view === 'cities' && (
                <button
                  onClick={() => {
                    setView('countries')
                    setSearchTerm('')
                  }}
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors duration-200"
                >
                  ← Ülkelere Dön
                </button>
              )}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={view === 'countries' ? 'Ülkeleri ara...' : 'Şehirleri ara...'}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Grid Layout */}
            <div className="grid grid-cols-2 gap-2 max-h-64 overflow-y-auto">
              {currentView.map((item) => (
                <button
                  key={item.value}
                  onClick={(e) => {
                    e.stopPropagation()
                    view === 'countries' ? handleCountryChange(item) : handleCityToggle(item)
                  }}
                  className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                    view === 'countries' && selectedCountry?.value === item.value
                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                      : view === 'cities' && selectedCities.some(c => c.value === item.value)
                      ? 'bg-blue-100 border-blue-300 text-blue-900'
                      : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    {view === 'countries' && <span className="text-lg">{item.flag}</span>}
                    <span className="text-sm font-medium">{item.label}</span>
                    {view === 'cities' && selectedCities.some(c => c.value === item.value) && (
                      <CheckIcon size={14} className="text-blue-600 ml-auto" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {/* Selected Cities Summary */}
            {view === 'cities' && selectedCities.length > 0 && (
              <div className="pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    {selectedCities.length} şehir seçildi
                  </span>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => onCitiesChange([])}
                      className="text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
                    >
                      Tümünü Temizle
                    </button>
                    <button
                      onClick={() => {
                        // Close the dropdown after applying
                        const event = new Event('click', { bubbles: true })
                        document.dispatchEvent(event)
                      }}
                      className="text-sm bg-blue-600 text-white px-3 py-1 rounded-md hover:bg-blue-700 transition-colors duration-200"
                    >
                      Uygula
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
}

// Modern Advanced Filters Component with Grid Layout
export const AdvancedFilters = ({ 
  filters, 
  onFiltersChange, 
  isOpen, 
  onToggle,
  className = "" 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [activeTab, setActiveTab] = useState('price') // 'price', 'type', 'audience'

  const priceRanges = [
    { value: 'free', label: 'Free', icon: '🎫', description: 'No cost events' },
    { value: '0-50', label: '$0 - $50', icon: '💰', description: 'Budget friendly' },
    { value: '50-100', label: '$50 - $100', icon: '💵', description: 'Mid-range events' },
    { value: '100-200', label: '$100 - $200', icon: '💎', description: 'Premium events' },
    { value: '200+', label: '$200+', icon: '👑', description: 'Luxury events' }
  ]

  const eventTypes = [
    { value: 'all', label: 'All Types', icon: '🎭', description: 'All event types' },
    { value: 'concert', label: 'Concert', icon: '🎵', description: 'Live music events' },
    { value: 'theater', label: 'Theater', icon: '🎬', description: 'Plays and shows' },
    { value: 'sports', label: 'Sports', icon: '⚽', description: 'Athletic events' },
    { value: 'art', label: 'Art & Culture', icon: '🎨', description: 'Exhibitions and galleries' },
    { value: 'food', label: 'Food & Drink', icon: '🍽️', description: 'Culinary experiences' },
    { value: 'education', label: 'Education', icon: '📚', description: 'Learning events' },
    { value: 'business', label: 'Business', icon: '💼', description: 'Professional events' }
  ]

  const audienceTypes = [
    { value: 'all', label: 'All Audiences', icon: '👥', description: 'Everyone welcome' },
    { value: 'family', label: 'Family', icon: '👨‍👩‍👧‍👦', description: 'Family-friendly events' },
    { value: 'adults', label: 'Adults Only', icon: '🍷', description: 'Adult content' },
    { value: 'kids', label: 'Kids', icon: '🧸', description: 'Children events' },
    { value: 'seniors', label: 'Seniors', icon: '👴', description: 'Senior-friendly events' }
  ]

  const handleFilterChange = (key, value, e) => {
    e?.stopPropagation()
    const newFilters = { ...filters, [key]: value }
    onFiltersChange(newFilters)
  }

  const getActiveFiltersCount = () => {
    let count = 0
    if (filters.priceMin || filters.priceMax || filters.priceRange) count++
    if (filters.eventType && filters.eventType !== 'all') count++
    if (filters.audienceType && filters.audienceType !== 'all') count++
    return count
  }

  const tabs = [
    { id: 'price', label: 'Price', icon: '💰', count: filters.priceMin || filters.priceMax || filters.priceRange ? 1 : 0 },
    { id: 'type', label: 'Type', icon: '🎭', count: filters.eventType && filters.eventType !== 'all' ? 1 : 0 },
    { id: 'audience', label: 'Audience', icon: '👥', count: filters.audienceType && filters.audienceType !== 'all' ? 1 : 0 }
  ]

  return (
    <Popover.Root open={isOpen} onOpenChange={onToggle}>
      <Popover.Trigger asChild>
        <button className={`flex items-center space-x-2 px-4 py-2 rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${className}`}>
          <Filter size={16} className="text-gray-500 dark:text-gray-400" />
          <span className="text-gray-700 dark:text-gray-300">
            Advanced Filters
            {getActiveFiltersCount() > 0 && (
              <span className="ml-1 px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                {getActiveFiltersCount()}
              </span>
            )}
          </span>
          <ChevronDown size={14} className={`text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          className="w-[500px] p-6 bg-white rounded-lg shadow-lg border border-gray-200 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95"
          sideOffset={5}
          align="center"
        >
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-gray-900">Advanced Filters</h3>
              <span className="text-sm text-gray-500">
                {getActiveFiltersCount()} filter{getActiveFiltersCount() !== 1 ? 's' : ''} active
              </span>
            </div>

            {/* Tab Navigation */}
            <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
                    activeTab === tab.id
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <span>{tab.icon}</span>
                  <span>{tab.label}</span>
                  {tab.count > 0 && (
                    <span className="px-1.5 py-0.5 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full">
                      {tab.count}
                    </span>
                  )}
                </button>
              ))}
            </div>

            {/* Search Input */}
            <div className="relative">
              <input
                type="text"
                placeholder={`Search ${activeTab} options...`}
                value={searchTerm}
                onChange={(e) => {
                  e.stopPropagation()
                  setSearchTerm(e.target.value)
                }}
                className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
              />
              <Search size={16} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* Price Range Tab */}
            {activeTab === 'price' && (
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="Min price"
                    value={filters.priceMin || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleFilterChange('priceMin', e.target.value)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                  <input
                    type="number"
                    placeholder="Max price"
                    value={filters.priceMax || ''}
                    onChange={(e) => {
                      e.stopPropagation()
                      handleFilterChange('priceMax', e.target.value)
                    }}
                    className="px-3 py-2 border border-gray-300 rounded-md bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                  />
                </div>
                
                <div className="grid grid-cols-1 gap-2">
                  {priceRanges
                    .filter(range => range.label.toLowerCase().includes(searchTerm.toLowerCase()))
                    .map((range) => (
                      <button
                        key={range.value}
                        onClick={(e) => {
                          e.stopPropagation()
                          handleFilterChange('priceRange', range.value, e)
                        }}
                        className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                          filters.priceRange === range.value
                            ? 'bg-blue-100 border-blue-300 text-blue-900'
                            : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <span className="text-lg">{range.icon}</span>
                          <div className="flex-1">
                            <div className="font-medium">{range.label}</div>
                            <div className="text-xs text-gray-500 dark:text-gray-400">{range.description}</div>
                          </div>
                          {filters.priceRange === range.value && (
                            <CheckIcon size={16} className="text-blue-600" />
                          )}
                        </div>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Event Type Tab */}
            {activeTab === 'type' && (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {eventTypes
                  .filter(type => type.label.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((type) => (
                    <button
                      key={type.value}
                                              onClick={(e) => {
                        e.stopPropagation()
                        handleFilterChange('eventType', type.value, e)
                      }}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                        filters.eventType === type.value
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{type.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{type.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{type.description}</div>
                        </div>
                        {filters.eventType === type.value && (
                          <CheckIcon size={16} className="text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* Audience Tab */}
            {activeTab === 'audience' && (
              <div className="grid grid-cols-1 gap-2 max-h-64 overflow-y-auto">
                {audienceTypes
                  .filter(audience => audience.label.toLowerCase().includes(searchTerm.toLowerCase()))
                  .map((audience) => (
                    <button
                      key={audience.value}
                                              onClick={(e) => {
                        e.stopPropagation()
                        handleFilterChange('audienceType', audience.value, e)
                      }}
                      className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                        filters.audienceType === audience.value
                          ? 'bg-blue-100 border-blue-300 text-blue-900'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-lg">{audience.icon}</span>
                        <div className="flex-1">
                          <div className="font-medium">{audience.label}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">{audience.description}</div>
                        </div>
                        {filters.audienceType === audience.value && (
                          <CheckIcon size={16} className="text-blue-600" />
                        )}
                      </div>
                    </button>
                  ))}
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex justify-between pt-4 border-t border-gray-200">
              <button
                onClick={() => onFiltersChange({})}
                className="px-4 py-2 text-sm text-red-600 hover:text-red-800 transition-colors duration-200"
              >
                Clear All Filters
              </button>
              <button
                onClick={() => onToggle(false)}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors duration-200"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  )
} 