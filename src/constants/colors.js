// EventHubble Color Palette
// Centralized color management system

export const COLORS = {
  // Primary Colors (from color palette)
  PRIMARY: '#3C2C7A',        // Deep Purple
  PRIMARY_LIGHT: '#40B3E5',  // Sky Blue
  PRIMARY_ACCENT: '#F390B5', // Pink
  PRIMARY_CREAM: '#FCF2C5',  // Light Cream
  
  // Background Colors
  BACKGROUND: '#FCF2C5',     // Same as PRIMARY_CREAM
  BACKGROUND_SECONDARY: '#F8F6F0', // Slightly darker cream
  
  // Text Colors
  TEXT_PRIMARY: '#3C2C7A',   // Same as PRIMARY
  TEXT_SECONDARY: '#40B3E5', // Same as PRIMARY_LIGHT
  TEXT_ACCENT: '#F390B5',    // Same as PRIMARY_ACCENT
  
  // Category Colors (harmonious with main palette)
  CATEGORIES: {
    MUSIC: '#3C2C7A',        // Primary purple
    THEATER: '#F390B5',      // Primary pink
    SPORTS: '#40B3E5',       // Primary blue
    ART: '#FCF2C5',          // Primary cream
    GASTRONOMY: '#EF4444',   // Red
    EDUCATION: '#3B82F6',    // Blue
    TECHNOLOGY: '#6366F1',   // Indigo
    FASHION: '#EC4899',      // Pink variant
    BUSINESS: '#F97316',     // Orange
    HEALTH: '#10B981',       // Green
  },
  
  // Admin Color Palette
  ADMIN_COLORS: [
    '#3C2C7A', // Primary purple
    '#40B3E5', // Primary blue
    '#F390B5', // Primary pink
    '#FCF2C5', // Primary cream
    '#F97316', // Orange
    '#EF4444', // Red
    '#10B981', // Green
    '#3B82F6', // Blue
    '#F59E0B', // Yellow
    '#EC4899'  // Pink variant
  ],
  
  // Status Colors
  SUCCESS: '#10B981',
  ERROR: '#EF4444',
  WARNING: '#F59E0B',
  INFO: '#3B82F6',
  
  // Neutral Colors
  WHITE: '#FFFFFF',
  BLACK: '#000000',
  GRAY_100: '#F3F4F6',
  GRAY_200: '#E5E7EB',
  GRAY_300: '#D1D5DB',
  GRAY_400: '#9CA3AF',
  GRAY_500: '#6B7280',
  GRAY_600: '#4B5563',
  GRAY_700: '#374151',
  GRAY_800: '#1F2937',
  GRAY_900: '#111827',
}

// CSS Variable Names (for use in CSS/Tailwind)
export const CSS_VARIABLES = {
  PRIMARY: 'var(--color-primary)',
  PRIMARY_LIGHT: 'var(--color-primary-light)',
  PRIMARY_ACCENT: 'var(--color-primary-accent)',
  PRIMARY_CREAM: 'var(--color-primary-cream)',
  BACKGROUND: 'var(--color-background)',
  BACKGROUND_SECONDARY: 'var(--color-background-secondary)',
  TEXT_PRIMARY: 'var(--color-text-primary)',
  TEXT_SECONDARY: 'var(--color-text-secondary)',
  TEXT_ACCENT: 'var(--color-text-accent)',
}

// Helper function to get category color
export const getCategoryColor = (categoryId) => {
  const categoryKey = categoryId?.toUpperCase()
  return COLORS.CATEGORIES[categoryKey] || COLORS.PRIMARY
}

// Helper function to get admin color palette
export const getAdminColors = () => {
  return COLORS.ADMIN_COLORS
}

// Helper function to validate hex color
export const isValidHexColor = (color) => {
  return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color)
}

export default COLORS 