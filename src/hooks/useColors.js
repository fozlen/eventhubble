import { useState, useEffect } from 'react'
import { COLORS, getCategoryColor, getAdminColors, isValidHexColor } from '../constants/colors'

/**
 * Custom hook for color management
 * Provides centralized color access and theme management
 */
export const useColors = () => {
  const [theme, setTheme] = useState('default')

  // Apply CSS variables to document root
  const applyColorTheme = (colorPalette) => {
    const root = document.documentElement
    
    Object.entries(colorPalette).forEach(([key, value]) => {
      if (typeof value === 'string' && isValidHexColor(value)) {
        root.style.setProperty(`--color-${key.toLowerCase().replace(/_/g, '-')}`, value)
      }
    })
  }

  // Initialize default theme
  useEffect(() => {
    const defaultPalette = {
      primary: COLORS.PRIMARY,
      'primary-light': COLORS.PRIMARY_LIGHT,
      'primary-accent': COLORS.PRIMARY_ACCENT,
      'primary-cream': COLORS.PRIMARY_CREAM,
      background: COLORS.BACKGROUND,
      'background-secondary': COLORS.BACKGROUND_SECONDARY,
      'text-primary': COLORS.TEXT_PRIMARY,
      'text-secondary': COLORS.TEXT_SECONDARY,
      'text-accent': COLORS.TEXT_ACCENT,
      success: COLORS.SUCCESS,
      error: COLORS.ERROR,
      warning: COLORS.WARNING,
      info: COLORS.INFO,
    }
    
    applyColorTheme(defaultPalette)
  }, [])

  // Change entire color theme
  const changeTheme = (newTheme) => {
    setTheme(newTheme)
    // Here you could load different color palettes based on theme
    // For now, we'll stick with the default palette
  }

  // Update a specific color
  const updateColor = (colorKey, hexValue) => {
    if (!isValidHexColor(hexValue)) {
      console.warn(`Invalid hex color: ${hexValue}`)
      return false
    }

    const cssVarName = `--color-${colorKey.toLowerCase().replace(/_/g, '-')}`
    document.documentElement.style.setProperty(cssVarName, hexValue)
    return true
  }

  // Get color value (either from CSS variable or fallback)
  const getColor = (colorKey) => {
    const cssVarName = `--color-${colorKey.toLowerCase().replace(/_/g, '-')}`
    const computedValue = getComputedStyle(document.documentElement)
      .getPropertyValue(cssVarName)
      .trim()
    
    return computedValue || COLORS[colorKey.toUpperCase()] || COLORS.PRIMARY
  }

  // Generate CSS variable string for use in styles
  const getCSSVar = (colorKey) => {
    return `var(--color-${colorKey.toLowerCase().replace(/_/g, '-')})`
  }

  return {
    // Current colors
    colors: COLORS,
    
    // Helper functions
    getCategoryColor,
    getAdminColors,
    isValidHexColor,
    
    // Theme management
    theme,
    changeTheme,
    updateColor,
    getColor,
    getCSSVar,
    
    // Direct color access
    primary: getColor('primary'),
    primaryLight: getColor('primary-light'),
    primaryAccent: getColor('primary-accent'),
    primaryCream: getColor('primary-cream'),
    background: getColor('background'),
    backgroundSecondary: getColor('background-secondary'),
    textPrimary: getColor('text-primary'),
    textSecondary: getColor('text-secondary'),
    textAccent: getColor('text-accent'),
    success: getColor('success'),
    error: getColor('error'),
    warning: getColor('warning'),
    info: getColor('info'),
  }
}

export default useColors 