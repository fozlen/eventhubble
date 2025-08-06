import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'

const useAppStore = create(
  persist(
    immer((set, get) => ({
      // UI State
      theme: 'light',
      language: 'tr',
      sidebarOpen: false,
      mobileMenuOpen: false,
      
      // Content State
      selectedCategory: null,
      selectedCity: null,
      searchQuery: '',
      filters: {
        dateFrom: null,
        dateTo: null,
        priceRange: null,
        featured: false
      },
      
      // Loading States
      isLoading: false,
      loadingStates: {
        events: false,
        blogs: false,
        categories: false,
        images: false
      },

      // Notifications
      notifications: [],
      
      // Actions
      setTheme: (theme) => set((state) => {
        state.theme = theme
        // Apply theme to document
        document.documentElement.setAttribute('data-theme', theme)
      }),

      setLanguage: (language) => set((state) => {
        state.language = language
      }),

      toggleSidebar: () => set((state) => {
        state.sidebarOpen = !state.sidebarOpen
      }),

      setSidebarOpen: (open) => set((state) => {
        state.sidebarOpen = open
      }),

      toggleMobileMenu: () => set((state) => {
        state.mobileMenuOpen = !state.mobileMenuOpen
      }),

      setMobileMenuOpen: (open) => set((state) => {
        state.mobileMenuOpen = open
      }),

      setSelectedCategory: (category) => set((state) => {
        state.selectedCategory = category
      }),

      setSelectedCity: (city) => set((state) => {
        state.selectedCity = city
      }),

      setSearchQuery: (query) => set((state) => {
        state.searchQuery = query
      }),

      setFilters: (filters) => set((state) => {
        state.filters = { ...state.filters, ...filters }
      }),

      clearFilters: () => set((state) => {
        state.filters = {
          dateFrom: null,
          dateTo: null,
          priceRange: null,
          featured: false
        }
      }),

      setLoading: (loading) => set((state) => {
        state.isLoading = loading
      }),

      setLoadingState: (key, loading) => set((state) => {
        state.loadingStates[key] = loading
      }),

      addNotification: (notification) => set((state) => {
        const id = Date.now().toString()
        state.notifications.push({
          id,
          timestamp: new Date().toISOString(),
          ...notification
        })
      }),

      removeNotification: (id) => set((state) => {
        state.notifications = state.notifications.filter(n => n.id !== id)
      }),

      clearNotifications: () => set((state) => {
        state.notifications = []
      }),

      // Computed values
      isAnyLoading: () => {
        const { loadingStates } = get()
        return Object.values(loadingStates).some(loading => loading)
      },

      getActiveFilters: () => {
        const { filters } = get()
        return Object.entries(filters).filter(([_, value]) => 
          value !== null && value !== false && value !== ''
        )
      },

      hasActiveFilters: () => {
        const { filters } = get()
        return Object.values(filters).some(value => 
          value !== null && value !== false && value !== ''
        )
      }
    })),
    {
      name: 'app-storage',
      partialize: (state) => ({
        // Only persist user preferences
        theme: state.theme,
        language: state.language,
        selectedCategory: state.selectedCategory,
        selectedCity: state.selectedCity
      })
    }
  )
)

export default useAppStore 