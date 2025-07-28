import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Info, Newspaper } from 'lucide-react'

const MobileNavigation = ({ language = "EN" }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const isActivePage = (path) => {
    return location.pathname === path
  }

  const handleNavigation = (path) => {
    navigate(path)
  }

  const navItems = [
    {
      path: '/',
      icon: Home,
      label: language === 'TR' ? 'Ana Sayfa' : 'Home'
    },
    {
      path: '/about',
      icon: Info,
      label: language === 'TR' ? 'Hakkımızda' : 'About'
    },
    {
      path: '/world-news',
      icon: Newspaper,
      label: language === 'TR' ? 'Haberler' : 'News'
    }
  ]

  return (
    <div className="block sm:hidden fixed bottom-4 left-4 right-4 z-40">
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
        <div className="flex items-center">
          {navItems.map((item, index) => {
            const IconComponent = item.icon
            const isActive = isActivePage(item.path)
            const isFirst = index === 0
            const isLast = index === navItems.length - 1
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center space-y-1 p-3 transition-all duration-200 flex-1 ${
                  isActive 
                    ? 'text-primary bg-primary/10' 
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
                } ${
                  !isFirst ? 'border-l border-gray-200' : ''
                }`}
              >
                <IconComponent size={20} />
                <span className="text-xs font-medium">{item.label}</span>
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default MobileNavigation 