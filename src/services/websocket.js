import { io } from 'socket.io-client'
import useAuthStore from '../stores/authStore.js'
import useAppStore from '../stores/appStore.js'

class WebSocketService {
  constructor() {
    this.socket = null
    this.isConnected = false
    this.reconnectAttempts = 0
    this.maxReconnectAttempts = 5
    this.reconnectDelay = 1000
  }

  connect() {
    if (this.socket && this.isConnected) {
      return
    }

    const API_BASE_URL = import.meta.env.VITE_API_URL || 
      (import.meta.env.PROD ? 'https://eventhubble.onrender.com' : 'http://localhost:3001')

    this.socket = io(API_BASE_URL, {
      withCredentials: true,
      transports: ['websocket', 'polling'],
      timeout: 20000,
      reconnection: true,
      reconnectionAttempts: this.maxReconnectAttempts,
      reconnectionDelay: this.reconnectDelay
    })

    this.setupEventListeners()
  }

  setupEventListeners() {
    if (!this.socket) return

    // Connection events
    this.socket.on('connect', () => {
      console.log('WebSocket connected:', this.socket.id)
      this.isConnected = true
      this.reconnectAttempts = 0
      
      // Join admin room if authenticated
      const { user } = useAuthStore.getState()
      if (user && ['admin', 'super_admin'].includes(user.role)) {
        this.socket.emit('join-admin', { role: user.role })
      }
    })

    this.socket.on('disconnect', (reason) => {
      console.log('WebSocket disconnected:', reason)
      this.isConnected = false
      
      if (reason === 'io server disconnect') {
        // Server disconnected us, try to reconnect
        this.socket.connect()
      }
    })

    this.socket.on('connect_error', (error) => {
      console.error('WebSocket connection error:', error)
      this.reconnectAttempts++
      
      if (this.reconnectAttempts >= this.maxReconnectAttempts) {
        console.error('Max reconnection attempts reached')
      }
    })

    // Content update events
    this.socket.on('content:updated', (data) => {
      console.log('Content updated:', data)
      this.handleContentUpdate(data)
    })

    // Real-time notifications
    this.socket.on('notification', (notification) => {
      console.log('Real-time notification:', notification)
      this.handleNotification(notification)
    })

    // System events
    this.socket.on('system:maintenance', (data) => {
      console.log('System maintenance:', data)
      this.handleSystemEvent('maintenance', data)
    })

    this.socket.on('system:error', (data) => {
      console.error('System error:', data)
      this.handleSystemEvent('error', data)
    })

    // Admin-specific events
    this.socket.on('admin:user_activity', (data) => {
      console.log('User activity:', data)
      this.handleAdminEvent('user_activity', data)
    })

    this.socket.on('admin:analytics_update', (data) => {
      console.log('Analytics update:', data)
      this.handleAdminEvent('analytics_update', data)
    })
  }

  handleContentUpdate(data) {
    const { type: contentType, action, data: contentData, id } = data
    
    // Add notification for content updates
    const { addNotification } = useAppStore.getState()
    
    let message = ''
    let notificationType = 'info'
    
    switch (action) {
      case 'created':
        message = `New ${contentType} created successfully`
        notificationType = 'success'
        break
      case 'updated':
        message = `${contentType} updated successfully`
        notificationType = 'info'
        break
      case 'deleted':
        message = `${contentType} deleted successfully`
        notificationType = 'warning'
        break
      default:
        message = `${contentType} ${action}`
        notificationType = 'info'
    }
    
    addNotification({
      type: notificationType,
      title: 'Content Update',
      message,
      duration: 5000
    })

    // Emit custom event for components to listen to
    window.dispatchEvent(new CustomEvent('content-updated', { detail: data }))
  }

  handleNotification(notification) {
    const { addNotification } = useAppStore.getState()
    
    addNotification({
      type: notification.type || 'info',
      title: notification.title || 'Notification',
      message: notification.message,
      duration: notification.duration || 5000
    })
  }

  handleSystemEvent(eventType, data) {
    const { addNotification } = useAppStore.getState()
    
    switch (eventType) {
      case 'maintenance':
        addNotification({
          type: 'warning',
          title: 'System Maintenance',
          message: data.message || 'System will be under maintenance',
          duration: 0 // Persistent until dismissed
        })
        break
      case 'error':
        addNotification({
          type: 'error',
          title: 'System Error',
          message: data.message || 'A system error occurred',
          duration: 10000
        })
        break
    }
  }

  handleAdminEvent(eventType, data) {
    // Handle admin-specific events
    switch (eventType) {
      case 'user_activity':
        // Update admin dashboard with user activity
        window.dispatchEvent(new CustomEvent('user-activity', { detail: data }))
        break
      case 'analytics_update':
        // Update analytics in real-time
        window.dispatchEvent(new CustomEvent('analytics-update', { detail: data }))
        break
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
      this.isConnected = false
    }
  }

  // Send events to server
  emit(event, data) {
    if (this.socket && this.isConnected) {
      this.socket.emit(event, data)
    } else {
      console.warn('WebSocket not connected, cannot emit event:', event)
    }
  }

  // Join admin room
  joinAdminRoom(role) {
    if (this.socket && this.isConnected) {
      this.socket.emit('join-admin', { role })
    }
  }

  // Leave admin room
  leaveAdminRoom() {
    if (this.socket && this.isConnected) {
      this.socket.emit('leave-admin')
    }
  }

  // Get connection status
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      reconnectAttempts: this.reconnectAttempts,
      socketId: this.socket?.id
    }
  }
}

// Create singleton instance
const websocketService = new WebSocketService()

export default websocketService 