import React, { useState } from 'react'
import { Calendar, MapPin, Star, Heart, Share2, ExternalLink } from 'lucide-react'
import { useSwipe } from '../hooks/useSwipe'

const MobileEventCard = ({ event, onEventClick, onShare, language }) => {
  const [isLiked, setIsLiked] = useState(false)
  const [showActions, setShowActions] = useState(false)

  const handleSwipeLeft = () => {
    setShowActions(true)
  }

  const handleSwipeRight = () => {
    setShowActions(false)
  }

  const { elementRef, isSwiping, swipeProgress } = useSwipe(handleSwipeLeft, handleSwipeRight)

  const handleLike = (e) => {
    e.stopPropagation()
    setIsLiked(!isLiked)
  }

  const handleShare = (e) => {
    e.stopPropagation()
    onShare(event)
  }

  const handleBuyTicket = (e) => {
    e.stopPropagation()
    window.open(event.url, '_blank')
  }

  return (
    <div className="relative overflow-hidden">
      {/* Main Card */}
      <div
        ref={elementRef}
        className={`relative bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-300 ${
          isSwiping ? 'scale-95' : 'scale-100'
        } ${showActions ? 'transform -translate-x-20' : 'transform translate-x-0'}`}
        style={{
          transform: `translateX(${isSwiping ? -swipeProgress * 20 : showActions ? -20 : 0}px) scale(${isSwiping ? 0.95 : 1})`
        }}
      >
        {/* Event Image with Gradient Overlay */}
        <div className="relative h-48 overflow-hidden">
          <img
            src={event.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=300&fit=crop'}
            alt={event.title}
            className="w-full h-full object-cover transition-transform duration-300 hover:scale-110"
          />
          
          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
          
          {/* Platform Badge */}
          <div className="absolute top-3 left-3 bg-primary text-white px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm">
            {event.platform}
          </div>
          
          {/* Rating Badge */}
          {event.rating && (
            <div className="absolute top-3 right-3 bg-yellow-400 text-white px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm flex items-center">
              <Star size={12} className="mr-1" />
              {event.rating}
            </div>
          )}
          
          {/* Like Button */}
          <button
            onClick={handleLike}
            className={`absolute bottom-3 right-3 p-2 rounded-full backdrop-blur-sm transition-all duration-200 ${
              isLiked 
                ? 'bg-red-500 text-white' 
                : 'bg-white/20 text-white hover:bg-white/30'
            }`}
          >
            <Heart size={16} className={isLiked ? 'fill-current' : ''} />
          </button>
        </div>

        {/* Event Content */}
        <div className="p-4">
          {/* Title */}
          <h3 className="text-lg font-bold mb-2 text-text line-clamp-2 leading-tight">
            {event.title}
          </h3>
          
          {/* Description */}
          <p className="text-sm text-text/70 mb-3 line-clamp-2">
            {event.description}
          </p>
          
          {/* Event Details */}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-text/60">
              <Calendar size={14} className="mr-2 text-primary flex-shrink-0" />
              <span className="font-medium">{event.date} • {event.time}</span>
            </div>
            <div className="flex items-center text-sm text-text/60">
              <MapPin size={14} className="mr-2 text-text-accent flex-shrink-0" />
              <span className="font-medium">{event.venue}, {event.city}</span>
            </div>
          </div>

          {/* Category Tag */}
          <div className="flex items-center justify-between">
            <span className="px-3 py-1 rounded-full text-xs bg-primary/10 text-primary font-medium">
              {event.category}
            </span>
            
            {/* Action Buttons */}
            <div className="flex items-center space-x-2">
              <button
                onClick={handleShare}
                className="p-2 text-text/60 hover:text-primary transition-colors"
              >
                <Share2 size={16} />
              </button>
              <button
                onClick={handleBuyTicket}
                className="bg-primary text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-primary/90 transition-colors flex items-center"
              >
                <ExternalLink size={14} className="mr-1" />
                {language === 'TR' ? 'Bilet Al' : 'Buy Ticket'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Swipe Actions (Hidden behind card) */}
      <div className={`absolute top-0 right-0 h-full flex items-center space-x-2 transition-all duration-300 ${
        showActions ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-4'
      }`}>
        <button
          onClick={handleShare}
          className="bg-blue-500 text-white p-3 rounded-full shadow-lg"
        >
          <Share2 size={20} />
        </button>
        <button
          onClick={handleBuyTicket}
          className="bg-green-500 text-white p-3 rounded-full shadow-lg"
        >
          <ExternalLink size={20} />
        </button>
      </div>

      {/* Swipe Indicator */}
      {isSwiping && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="bg-black/20 backdrop-blur-sm rounded-full px-4 py-2">
            <span className="text-white text-sm font-medium">
              {swipeProgress > 0.5 ? (language === 'TR' ? 'Bırak' : 'Release') : (language === 'TR' ? 'Çek' : 'Pull')}
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

export default MobileEventCard 