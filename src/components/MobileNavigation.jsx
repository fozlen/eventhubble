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
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 p-2">
        <div className="flex items-center justify-around">
          {navItems.map((item) => {
            const IconComponent = item.icon
            const isActive = isActivePage(item.path)
            
            return (
              <button
                key={item.path}
                onClick={() => handleNavigation(item.path)}
                className={`flex flex-col items-center space-y-1 p-3 rounded-xl transition-all duration-200 ${
                  isActive 
                    ? 'text-primary bg-primary/10 shadow-lg' 
                    : 'text-gray-500 hover:text-primary hover:bg-gray-50'
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