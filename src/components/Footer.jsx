import React from 'react'
import { Facebook, Instagram, Twitter, Music } from 'lucide-react'
import LogoService from '../services/logoService'

const Footer = ({ language = "EN" }) => {
  const [logo, setLogo] = React.useState('/assets/Logo.png')

  React.useEffect(() => {
    const loadLogo = async () => {
      try {
        const logoUrl = await LogoService.getLogo('light')
        setLogo(logoUrl)
      } catch (error) {
        console.error('Logo loading error:', error)
      }
    }
    loadLogo()
  }, [])

  const socialLinks = [
    {
      name: 'Facebook',
      url: 'https://www.facebook.com/eventhubbleapp/',
      icon: Facebook,
      color: 'hover:text-blue-400'
    },
    {
      name: 'Instagram', 
      url: 'https://www.instagram.com/eventhubbleapp/',
      icon: Instagram,
      color: 'hover:text-pink-400'
    },
    {
      name: 'Twitter',
      url: 'https://x.com/eventhubbleapp',
      icon: Twitter,
      color: 'hover:text-blue-300'
    },
    {
      name: 'TikTok',
      url: 'https://www.tiktok.com/@eventhubble',
      icon: Music,
      color: 'hover:text-purple-400'
    }
  ]

  return (
    <footer className="hidden sm:block bg-primary text-white py-12">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Brand - Section 1 */}
          <div className="flex flex-col items-center md:items-start space-y-4">
            <div className="flex items-center space-x-2">
              <img 
                src={logo} 
                alt="EventHubble" 
                className="h-10 w-auto" 
              />
              <span className="text-xl font-bold">
                <span className="text-primary-cream">Event</span>
                <span className="text-primary-light"> Hubble</span>
              </span>
            </div>
            <p className="text-white/70 text-sm text-center md:text-left max-w-xs">
              {language === 'TR' 
                ? 'Dünyanın her yerinden en iyi etkinlikleri keşfedin.'
                : 'Discover the best events from around the world.'}
            </p>
          </div>
          
          {/* Company Links - Section 2 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-center md:text-left">
              {language === 'TR' ? 'Şirket' : 'Company'}
            </h3>
            <ul className="space-y-2 text-white/80 text-center md:text-left">
              <li>
                <a href="/about" className="hover:text-white transition-colors">
                  {language === 'TR' ? 'Hakkımızda' : 'About'}
                </a>
              </li>
              <li>
                <a href="/categories" className="hover:text-white transition-colors">
                  {language === 'TR' ? 'Kategoriler' : 'Categories'}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Blog Links - Section 3 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-center md:text-left">
              {language === 'TR' ? 'İçerik' : 'Content'}
            </h3>
            <ul className="space-y-2 text-white/80 text-center md:text-left">
              <li>
                <a href="/world-news" className="hover:text-white transition-colors">
                  {language === 'TR' ? 'Dünya Haberleri' : 'World News'}
                </a>
              </li>
              <li>
                <a href="/" className="hover:text-white transition-colors">
                  {language === 'TR' ? 'Etkinlikler' : 'Events'}
                </a>
              </li>
            </ul>
          </div>
          
          {/* Social Media - Section 4 */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="font-semibold mb-4 text-center md:text-left">
              {language === 'TR' ? 'Sosyal Medya' : 'Social Media'}
            </h3>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              {socialLinks.map((social) => {
                const IconComponent = social.icon
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`text-white/80 ${social.color} transition-colors duration-200 transform hover:scale-110`}
                    aria-label={`EventHubble ${social.name}`}
                  >
                    <IconComponent size={24} />
                  </a>
                )
              })}
            </div>
            <p className="text-white/60 text-xs mt-4 text-center md:text-left">
              {language === 'TR' 
                ? 'Bizi takip edin!'
                : 'Follow us!'}
            </p>
          </div>
        </div>
        
        {/* Copyright */}
        <div className="border-t border-white/20 mt-8 pt-8 text-center">
          <p className="text-white/60 text-sm">
            © 2024 EventHubble. {language === 'TR' ? 'Tüm hakları saklıdır.' : 'All rights reserved.'}
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer 