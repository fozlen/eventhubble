import { useState, useEffect, useRef } from 'react'

export const useSwipe = (onSwipeLeft, onSwipeRight, threshold = 50) => {
  const [isSwiping, setIsSwiping] = useState(false)
  const [startX, setStartX] = useState(0)
  const [currentX, setCurrentX] = useState(0)
  const elementRef = useRef(null)

  useEffect(() => {
    const element = elementRef.current
    if (!element) return

    const handleTouchStart = (e) => {
      setIsSwiping(true)
      setStartX(e.touches[0].clientX)
      setCurrentX(e.touches[0].clientX)
    }

    const handleTouchMove = (e) => {
      if (!isSwiping) return
      setCurrentX(e.touches[0].clientX)
    }

    const handleTouchEnd = () => {
      if (!isSwiping) return
      
      const diff = startX - currentX
      
      if (Math.abs(diff) > threshold) {
        if (diff > 0 && onSwipeLeft) {
          onSwipeLeft()
        } else if (diff < 0 && onSwipeRight) {
          onSwipeRight()
        }
      }
      
      setIsSwiping(false)
      setStartX(0)
      setCurrentX(0)
    }

    element.addEventListener('touchstart', handleTouchStart, { passive: true })
    element.addEventListener('touchmove', handleTouchMove, { passive: true })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })

    return () => {
      element.removeEventListener('touchstart', handleTouchStart)
      element.removeEventListener('touchmove', handleTouchMove)
      element.removeEventListener('touchend', handleTouchEnd)
    }
  }, [isSwiping, startX, currentX, onSwipeLeft, onSwipeRight, threshold])

  const swipeDistance = startX - currentX

  return {
    elementRef,
    isSwiping,
    swipeDistance,
    swipeProgress: Math.min(Math.abs(swipeDistance) / threshold, 1)
  }
} 