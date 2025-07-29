import React from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { Home, Info, Newspaper, Facebook, Instagram, Twitter, Music } from 'lucide-react'

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

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/eventhubbleapp/',
      icon: Facebook,
      color: 'text-blue-500'
    },
    {
      name: 'Instagram', 
      url: 'https://www.instagram.com/eventhubbleapp/',
      icon: Instagram,
      color: 'text-pink-500'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/eventhubbleapp',
      icon: Twitter,
      color: 'text-blue-400'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@eventhubble',
      icon: Music,
      color: 'text-purple-500'
    }
  ]

  return (
    <footer className="block sm:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 shadow-lg">
      <div className="px-4 py-3">
        {/* EventHubble Brand */}
        <div className="flex items-center justify-center mb-3">
          <span className="text-sm font-semibold text-gray-700">
            <span className="text-primary">Event</span>
            <span className="text-primary-light">Hubble</span>
          </span>
        </div>
        
        {/* Social Media Links */}
        <div className="flex items-center justify-center space-x-6 mb-2">
          {socialLinks.map((social) => {
            const IconComponent = social.icon
            return (
              <a
                key={social.name}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`${social.color} transition-transform duration-200 transform hover:scale-110 active:scale-95`}
                aria-label={`EventHubble ${social.name}`}
              >
                <IconComponent size={18} />
              </a>
            )
          })}
        </div>
        
        {/* Copyright */}
        <div className="text-center">
          <span className="text-xs text-gray-400">
            © 2025 EventHubble
          </span>
        </div>
      </div>
    </footer>
  )
}

export default MobileFooter 