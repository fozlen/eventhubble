import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import apiService from '../services/api.js'

const useAuthStore = create(
  persist(
    immer((set, get) => ({
      // State
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      // Actions
      setUser: (user) => set((state) => {
        state.user = user
        state.isAuthenticated = !!user
        state.error = null
      }),

      setLoading: (loading) => set((state) => {
        state.isLoading = loading
      }),

      setError: (error) => set((state) => {
        state.error = error
        state.isLoading = false
      }),



      login: async (email, password) => {
        set((state) => {
          state.isLoading = true
          state.error = null
        })

        try {
          console.log('=== LOGIN START ===')
          const response = await apiService.login(email, password)
          console.log('Login response:', response)
          
          if (response.success) {
            console.log('Login successful, cookie-based authentication ready')
            set((state) => {
              state.user = response.data.user
              state.isAuthenticated = true
              state.isLoading = false
              state.error = null
            })
            
            console.log('Cookie-based authentication set')
            
            return { success: true }
          } else {
            console.log('Login failed:', response.error)
            set((state) => {
              state.error = response.error
              state.isLoading = false
            })
            return { success: false, error: response.error }
          }
        } catch (error) {
          console.log('Login error:', error)
          set((state) => {
            state.error = error.message
            state.isLoading = false
          })
          return { success: false, error: error.message }
        }
      },

      logout: async () => {
        try {
          await apiService.logout()
        } catch (error) {
          console.error('Logout error:', error)
        } finally {
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = null
            state.isLoading = false
          })
        }
      },

      refreshToken: async () => {
        try {
          const response = await apiService.refreshToken()
          
          if (response.success) {
            set((state) => {
              state.user = response.data.user
              state.isAuthenticated = true
              state.error = null
            })
            return { success: true }
          } else {
            set((state) => {
              state.user = null
              state.isAuthenticated = false
              state.error = response.error
            })
            return { success: false, error: response.error }
          }
        } catch (error) {
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = error.message
          })
          return { success: false, error: error.message }
        }
      },

      checkAuth: async () => {
        try {
          console.log('=== CHECK AUTH START ===')
          const response = await apiService.getCurrentUser()
          console.log('Auth check response:', response)
          
          if (response.success) {
            set((state) => {
              state.user = response.data
              state.isAuthenticated = true
              state.error = null
            })
            

            
            console.log('=== CHECK AUTH SUCCESS ===')
            return { success: true }
          } else {
            console.log('=== CHECK AUTH FAILED ===')
            set((state) => {
              state.user = null
              state.isAuthenticated = false
              state.error = response.error
            })
            return { success: false, error: response.error }
          }
        } catch (error) {
          console.log('=== CHECK AUTH ERROR ===', error)
          set((state) => {
            state.user = null
            state.isAuthenticated = false
            state.error = error.message
          })
          return { success: false, error: error.message }
        }
      },

      clearError: () => set((state) => {
        state.error = null
      }),

      // Computed values
      hasRole: (role) => {
        const { user } = get()
        if (!user) return false
        
        // Admin has all permissions
        if (user.role === 'admin' || user.role === 'super_admin') {
          return true
        }
        
        // Specific role checks
        if (role === 'admin') {
          return ['admin', 'super_admin'].includes(user.role)
        }
        
        return user.role === role
      },

      // Check if user is admin
      isAdmin: () => {
        const { user } = get()
        if (!user) return false
        return user.role === 'admin' || user.role === 'super_admin'
      },

      canEdit: () => {
        const { user } = get()
        if (!user) return false
        // Admin can edit everything
        if (user.role === 'admin' || user.role === 'super_admin') {
          return true
        }
        return ['editor'].includes(user.role)
      },

      canDelete: () => {
        const { user } = get()
        if (!user) return false
        // Only admin can delete
        return ['admin', 'super_admin'].includes(user.role)
      }
    })),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        // Only persist minimal data, not sensitive info
        user: state.user ? {
          id: state.user.id,
          email: state.user.email,
          full_name: state.user.full_name,
          role: state.user.role,
          avatar_url: state.user.avatar_url
        } : null,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)

export default useAuthStore 