import React, { useEffect, useState } from 'react'
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react'
import useAppStore from '../stores/appStore'

const NotificationSystem = () => {
  const { notifications, removeNotification } = useAppStore()
  const [visibleNotifications, setVisibleNotifications] = useState([])

  useEffect(() => {
    setVisibleNotifications(notifications)
  }, [notifications])

  const handleRemove = (id) => {
    removeNotification(id)
  }

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-500" />
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-500" />
      default:
        return <Info className="w-5 h-5 text-blue-500" />
    }
  }

  const getBackgroundColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200'
      case 'error':
        return 'bg-red-50 border-red-200'
      case 'warning':
        return 'bg-yellow-50 border-yellow-200'
      default:
        return 'bg-blue-50 border-blue-200'
    }
  }

  const getTextColor = (type) => {
    switch (type) {
      case 'success':
        return 'text-green-800'
      case 'error':
        return 'text-red-800'
      case 'warning':
        return 'text-yellow-800'
      default:
        return 'text-blue-800'
    }
  }

  if (visibleNotifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {visibleNotifications.map((notification) => (
        <NotificationItem
          key={notification.id}
          notification={notification}
          onRemove={handleRemove}
          getIcon={getIcon}
          getBackgroundColor={getBackgroundColor}
          getTextColor={getTextColor}
        />
      ))}
    </div>
  )
}

const NotificationItem = ({ 
  notification, 
  onRemove, 
  getIcon, 
  getBackgroundColor, 
  getTextColor 
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const [isRemoving, setIsRemoving] = useState(false)

  useEffect(() => {
    // Animate in
    const timer = setTimeout(() => {
      setIsVisible(true)
    }, 100)

    // Auto remove if duration is set
    if (notification.duration && notification.duration > 0) {
      const removeTimer = setTimeout(() => {
        handleRemove()
      }, notification.duration)

      return () => {
        clearTimeout(timer)
        clearTimeout(removeTimer)
      }
    }

    return () => clearTimeout(timer)
  }, [notification.duration])

  const handleRemove = () => {
    setIsRemoving(true)
    setTimeout(() => {
      onRemove(notification.id)
    }, 300)
  }

  return (
    <div
      className={`
        transform transition-all duration-300 ease-in-out
        ${isVisible && !isRemoving ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'}
        ${getBackgroundColor(notification.type)}
        border rounded-lg shadow-lg p-4 max-w-sm
      `}
    >
      <div className="flex items-start space-x-3">
        <div className="flex-shrink-0">
          {getIcon(notification.type)}
        </div>
        
        <div className="flex-1 min-w-0">
          <h4 className={`text-sm font-medium ${getTextColor(notification.type)}`}>
            {notification.title}
          </h4>
          <p className={`text-sm mt-1 ${getTextColor(notification.type)} opacity-90`}>
            {notification.message}
          </p>
        </div>
        
        <div className="flex-shrink-0">
          <button
            onClick={handleRemove}
            className={`
              inline-flex items-center justify-center w-5 h-5 rounded-full
              ${getTextColor(notification.type)} opacity-60 hover:opacity-100
              transition-opacity duration-200
            `}
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default NotificationSystem 