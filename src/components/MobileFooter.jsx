import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Info, Newspaper } from 'lucide-react'

const MobileFooter = ({ language = "EN" }) => {
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
    <footer className="block sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="flex items-center justify-around px-2 py-2">
        {navItems.map((item) => {
          const IconComponent = item.icon
          const isActive = isActivePage(item.path)
          
          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center space-y-1 p-2 rounded-lg transition-all duration-200 ${
                isActive 
                  ? 'text-primary bg-primary/10' 
                  : 'text-gray-500 hover:text-primary hover:bg-gray-50'
              }`}
            >
              <IconComponent size={20} />
              <span className="text-xs font-medium">{item.label}</span>
            </button>
          )
        })}
      </div>
    </footer>
  )
}

export default MobileFooter 