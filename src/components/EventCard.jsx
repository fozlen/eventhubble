import { useState } from 'react'
import { Calendar, MapPin, Users, Star, Share2, ExternalLink, Clock, Tag } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'

export function EventCard({ event, onDetails, onBuyTicket, language = 'tr' }) {
  const [imageLoaded, setImageLoaded] = useState(false)
  const [imageError, setImageError] = useState(false)

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      day: 'numeric',
      month: 'short'
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  const getPlatformColor = (platform) => {
    const colors = {
      mobilet: 'bg-green-500 hover:bg-green-600',
      biletinial: 'bg-blue-500 hover:bg-blue-600',
      biletix: 'bg-purple-500 hover:bg-purple-600',
      passo: 'bg-orange-500 hover:bg-orange-600'
    }
    return colors[platform] || colors.mobilet
  }

  const getCategoryColor = (category) => {
    const colors = {
      müzik: 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-200',
      tiyatro: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
      spor: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
      sanat: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200',
      gastronomi: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-200',
      festival: 'bg-pink-100 text-pink-800 dark:bg-pink-900/20 dark:text-pink-200'
    }
    return colors[category] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-200'
  }

  const t = (key) => {
    const translations = {
      tr: {
        'people_attending': 'kişi katılıyor',
        'details': 'DETAYLAR',
        'buy_ticket': 'BİLET AL',
        'tickets_left': 'bilet kaldı',
        'free': 'Ücretsiz',
        'from': 'den'
      },
      en: {
        'people_attending': 'people attending',
        'details': 'DETAILS',
        'buy_ticket': 'BUY TICKET',
        'tickets_left': 'tickets left',
        'free': 'Free',
        'from': 'from'
      }
    }
    return translations[language][key] || key
  }

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 bg-white dark:bg-slate-800 border-0 shadow-lg">
      {/* Image Container */}
      <div className="relative overflow-hidden">
        <div className="aspect-[4/3] bg-gray-200 dark:bg-gray-700">
          {!imageError ? (
            <img 
              src={event.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'}
              alt={event.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${
                imageLoaded ? 'opacity-100' : 'opacity-0'
              }`}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
              loading="lazy"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-500 to-purple-600">
              <div className="text-white text-center">
                <Calendar className="h-12 w-12 mx-auto mb-2 opacity-50" />
                <p className="text-sm font-medium">{event.title}</p>
              </div>
            </div>
          )}
        </div>

        {/* Platform Badge */}
        <div className="absolute top-4 left-4">
          <Badge className={`${getPlatformColor(event.platform)} text-white font-medium`}>
            {event.platform}
          </Badge>
        </div>

        {/* Share Button */}
        <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <Button 
            variant="ghost" 
            size="sm" 
            className="bg-white/90 hover:bg-white text-gray-800 backdrop-blur-sm"
            onClick={() => {
              if (navigator.share) {
                navigator.share({
                  title: event.title,
                  text: event.description,
                  url: window.location.href
                })
              } else {
                navigator.clipboard.writeText(window.location.href)
              }
            }}
          >
            <Share2 className="h-4 w-4" />
          </Button>
        </div>

        {/* Rating */}
        <div className="absolute bottom-4 left-4">
          <div className="flex items-center space-x-1 bg-black/70 backdrop-blur-sm rounded-lg px-2 py-1">
            <Star className="h-4 w-4 text-yellow-400 fill-current" />
            <span className="text-white font-medium text-sm">{event.rating}</span>
          </div>
        </div>

        {/* Date Badge */}
        <div className="absolute bottom-4 right-4">
          <div className="bg-white/90 backdrop-blur-sm rounded-lg px-3 py-1 text-center">
            <p className="text-sm font-bold text-gray-800">{formatDate(event.date)}</p>
            <p className="text-xs text-gray-600">{formatTime(event.time)}</p>
          </div>
        </div>
      </div>
      
      <CardContent className="p-6">
        {/* Title and Category */}
        <div className="mb-4">
                  <h3 className="text-xl font-bold mb-2 text-gray-900 dark:text-white line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {event.title}
        </h3>
          <div className="flex items-center justify-between">
            <Badge className={`${getCategoryColor(event.category)} text-xs font-medium`}>
              {event.category}
            </Badge>
            {event.available_tickets && (
              <span className="text-xs text-gray-500 dark:text-gray-400">
                {event.available_tickets} {t('tickets_left')}
              </span>
            )}
          </div>
        </div>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2 leading-relaxed">
          {event.description}
        </p>
        
        {/* Event Info */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600 dark:text-gray-300">
            <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
            <span className="truncate">{event.venue}, {event.city}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-4">
          {event.price_min && event.price_max ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  {event.price_min}₺ - {event.price_max}₺
                </p>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {t('from')} {event.price_min}₺
                </p>
              </div>
            </div>
          ) : (
            <p className="text-lg font-bold text-green-600 dark:text-green-400">
              {t('free')}
            </p>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <Button 
            variant="outline" 
            className="flex-1 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
            onClick={() => onDetails(event)}
          >
            {t('details')}
          </Button>
          <Button 
            className={`flex-1 ${getPlatformColor(event.platform)} text-white`}
            onClick={() => onBuyTicket(event)}
          >
            {t('buy_ticket')}
            <ExternalLink className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </CardContent>
    </Card>
  )
} 