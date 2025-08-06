import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import apiService from '../services/api.js'
import useAuthStore from '../stores/authStore.js'

// Query keys
export const queryKeys = {
  // Auth
  auth: ['auth'],
  user: ['user'],
  
  // Content
  events: ['events'],
  event: (id) => ['events', id],
  blogs: ['blogs'],
  blog: (id) => ['blogs', id],
  categories: ['categories'],
  category: (id) => ['categories', id],
  logos: ['logos'],
  logo: (id) => ['logos', id],
  images: ['images'],
  image: (id) => ['images', id],
  
  // Settings
  settings: ['settings'],
  settingsByCategory: (category) => ['settings', category],
  
  // Analytics
  analytics: ['analytics'],
  
  // Contact
  contactSubmissions: ['contact-submissions']
}

// =====================================
// AUTHENTICATION QUERIES
// =====================================

export const useCurrentUser = () => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: queryKeys.user,
    queryFn: () => apiService.getCurrentUser(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 1
  })
}

// =====================================
// EVENTS QUERIES
// =====================================

export const useEvents = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.events, params],
    queryFn: () => apiService.getEvents(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false
  })
}

export const useEvent = (id) => {
  return useQuery({
    queryKey: queryKeys.event(id),
    queryFn: () => apiService.getEvent(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const useCreateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => apiService.createEvent(data),
    onSuccess: (data) => {
      // Invalidate and refetch events
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
      
      // Add to cache
      queryClient.setQueryData(
        queryKeys.event(data.data.id),
        { success: true, data: data.data }
      )
    }
  })
}

export const useUpdateEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.updateEvent(id, data),
    onSuccess: (response, { id }) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.event(id),
        { success: true, data: response.data }
      )
      
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
    }
  })
}

export const useDeleteEvent = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => apiService.deleteEvent(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.event(id) })
      
      // Invalidate events list
      queryClient.invalidateQueries({ queryKey: queryKeys.events })
    }
  })
}

// =====================================
// BLOGS QUERIES
// =====================================

export const useBlogs = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.blogs, params],
    queryFn: () => apiService.getBlogs(params),
    staleTime: 2 * 60 * 1000, // 2 minutes
    refetchOnWindowFocus: false
  })
}

export const useBlog = (identifier) => {
  return useQuery({
    queryKey: queryKeys.blog(identifier),
    queryFn: () => apiService.getBlog(identifier),
    enabled: !!identifier,
    staleTime: 5 * 60 * 1000 // 5 minutes
  })
}

export const useCreateBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => apiService.createBlog(data),
    onSuccess: (data) => {
      // Invalidate and refetch blogs
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
      
      // Add to cache
      queryClient.setQueryData(
        queryKeys.blog(data.data.id),
        { success: true, data: data.data }
      )
    }
  })
}

export const useUpdateBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.updateBlog(id, data),
    onSuccess: (response, { id }) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.blog(id),
        { success: true, data: response.data }
      )
      
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
    }
  })
}

export const useDeleteBlog = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => apiService.deleteBlog(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.blog(id) })
      
      // Invalidate blogs list
      queryClient.invalidateQueries({ queryKey: queryKeys.blogs })
    }
  })
}

// =====================================
// CATEGORIES QUERIES
// =====================================

export const useCategories = (includeInactive = false) => {
  return useQuery({
    queryKey: [...queryKeys.categories, { includeInactive }],
    queryFn: () => apiService.getCategories({ includeInactive }),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })
}

export const useCreateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (data) => apiService.createCategory(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    }
  })
}

export const useUpdateCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.updateCategory(id, data),
    onSuccess: (response, { id }) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.category(id),
        { success: true, data: response.data }
      )
      
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    }
  })
}

export const useDeleteCategory = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => apiService.deleteCategory(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.category(id) })
      
      // Invalidate categories list
      queryClient.invalidateQueries({ queryKey: queryKeys.categories })
    }
  })
}

// =====================================
// LOGOS QUERIES
// =====================================

export const useLogos = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.logos, params],
    queryFn: () => apiService.getLogos(params),
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false
  })
}

export const useActiveLogo = (variant) => {
  return useQuery({
    queryKey: [...queryKeys.logos, { variant, active: true }],
    queryFn: () => apiService.getActiveLogo(variant),
    enabled: !!variant,
    staleTime: 30 * 60 * 1000 // 30 minutes
  })
}

export const useCreateLogo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (formData) => apiService.createLogo(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.logos })
    }
  })
}

export const useUpdateLogo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ id, data }) => apiService.updateLogo(id, data),
    onSuccess: (response, { id }) => {
      // Update cache
      queryClient.setQueryData(
        queryKeys.logo(id),
        { success: true, data: response.data }
      )
      
      // Invalidate logos list
      queryClient.invalidateQueries({ queryKey: queryKeys.logos })
    }
  })
}

export const useDeleteLogo = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => apiService.deleteLogo(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.logo(id) })
      
      // Invalidate logos list
      queryClient.invalidateQueries({ queryKey: queryKeys.logos })
    }
  })
}

// =====================================
// IMAGES QUERIES
// =====================================

export const useImages = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.images, params],
    queryFn: () => apiService.getImages(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

export const useUploadImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: ({ file, metadata }) => apiService.uploadImage(file, metadata),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.images })
    }
  })
}

export const useDeleteImage = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (id) => apiService.deleteImage(id),
    onSuccess: (_, id) => {
      // Remove from cache
      queryClient.removeQueries({ queryKey: queryKeys.image(id) })
      
      // Invalidate images list
      queryClient.invalidateQueries({ queryKey: queryKeys.images })
    }
  })
}

// =====================================
// SETTINGS QUERIES
// =====================================

export const useSettings = (params = {}) => {
  return useQuery({
    queryKey: [...queryKeys.settings, params],
    queryFn: () => apiService.getSettings(params),
    staleTime: 30 * 60 * 1000, // 30 minutes
    refetchOnWindowFocus: false
  })
}

export const useSettingsByCategory = (category) => {
  return useQuery({
    queryKey: queryKeys.settingsByCategory(category),
    queryFn: () => apiService.getSettings({ category }),
    enabled: !!category,
    staleTime: 30 * 60 * 1000 // 30 minutes
  })
}

export const useUpdateSettings = () => {
  const queryClient = useQueryClient()
  
  return useMutation({
    mutationFn: (settings) => apiService.updateSettings(settings),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.settings })
    }
  })
}

// =====================================
// CONTACT QUERIES
// =====================================

export const useContactSubmissions = (params = {}) => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: [...queryKeys.contactSubmissions, params],
    queryFn: () => apiService.getContactSubmissions(params),
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // 1 minute
    refetchOnWindowFocus: false
  })
}

export const useSubmitContact = () => {
  return useMutation({
    mutationFn: (data) => apiService.submitContact(data)
  })
}

export const useSubscribeNewsletter = () => {
  return useMutation({
    mutationFn: ({ email, name }) => apiService.subscribeNewsletter(email, name)
  })
}

// =====================================
// ANALYTICS QUERIES
// =====================================

export const useAnalytics = (params = {}) => {
  const { isAuthenticated } = useAuthStore()
  
  return useQuery({
    queryKey: [...queryKeys.analytics, params],
    queryFn: () => apiService.getAnalytics(params),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
}

export const useTrackEvent = () => {
  return useMutation({
    mutationFn: ({ eventType, eventData }) => 
      apiService.trackEvent(eventType, eventData),
    retry: false // Don't retry analytics
  })
}

// =====================================
// UTILITY HOOKS
// =====================================

export const useHealthCheck = () => {
  return useQuery({
    queryKey: ['health'],
    queryFn: () => apiService.healthCheck(),
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false
  })
} 