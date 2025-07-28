import { useState } from 'react'
import { X, Calendar, MapPin, Users, Star, Phone, Globe, ExternalLink } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

export function EventDetailModal({ event, isOpen, onClose, onBuyTicket }) {
  if (!event) return null

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('tr-TR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatTime = (timeString) => {
    return timeString
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span className="text-2xl font-bold">{event.title}</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Etkinlik Görseli */}
          <div className="relative">
            <img 
              src={event.image_url} 
              alt={event.title}
              className="w-full h-64 object-cover rounded-lg"
            />
            <div className="absolute top-4 left-4">
              <Badge className="bg-green-500 text-white">
                {event.platform}
              </Badge>
            </div>
            <div className="absolute top-4 right-4">
              <div className="flex items-center space-x-1 bg-black/50 rounded px-2 py-1">
                <Star className="h-4 w-4 text-yellow-400 fill-current" />
                <span className="text-white font-medium">{event.rating}</span>
              </div>
            </div>
          </div>

          {/* Etkinlik Bilgileri */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Etkinlik Bilgileri</h3>
              
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <Calendar className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{formatDate(event.date)}</p>
                    <p className="text-sm text-gray-600">{formatTime(event.time)}</p>
                  </div>
                </div>

                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500" />
                  <div>
                    <p className="font-medium">{event.venue}</p>
                    <p className="text-sm text-gray-600">{event.city}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Etkinlik Bilgileri</h3>
              
              <div className="space-y-3">
                <div className="bg-gray-50 dark:bg-gray-800 p-4 rounded-lg">
                  <p className="text-sm text-gray-600">Kategori</p>
                  <Badge variant="secondary" className="mt-1">
                    {event.category}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Açıklama */}
          <div>
            <h3 className="text-lg font-semibold mb-3">Açıklama</h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
              {event.description}
            </p>
          </div>

          {/* Organizatör Bilgileri */}
          {event.organizer && (
            <div className="border-t pt-6">
              <h3 className="text-lg font-semibold mb-3">Organizatör</h3>
              <div className="space-y-3">
                <p className="font-medium">{event.organizer}</p>
                
                {event.contact && (
                  <div className="flex items-center space-x-3">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <a href={`tel:${event.contact}`} className="text-blue-600 hover:underline">
                      {event.contact}
                    </a>
                  </div>
                )}

                {event.website && (
                  <div className="flex items-center space-x-3">
                    <Globe className="h-4 w-4 text-gray-500" />
                    <a 
                      href={event.website} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline flex items-center space-x-1"
                    >
                      <span>Web Sitesi</span>
                      <ExternalLink className="h-3 w-3" />
                    </a>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Aksiyon Butonları */}
          <div className="flex space-x-4 pt-6 border-t">
            <Button 
              variant="outline" 
              className="flex-1"
              onClick={onClose}
            >
              Kapat
            </Button>
            <Button 
              className="flex-1 bg-blue-600 hover:bg-blue-700"
              onClick={() => onBuyTicket(event)}
            >
              Bilet Al
              <ExternalLink className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 