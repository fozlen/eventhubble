import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { v2 as cloudinary } from 'cloudinary'
import multer from 'multer'
import cookieParser from 'cookie-parser'
import helmet from 'helmet'
import supabaseService from './services/supabaseService.js'
import authMiddleware, { 
  rateLimit
} from './middleware/auth.js'
import jwt from 'jsonwebtoken'
import bcrypt from 'bcryptjs'
import crypto from 'crypto'

dotenv.config()

const app = express()

const PORT = process.env.PORT || 3001

// Cloudinary Configuration
const isCloudinaryConfigured = process.env.CLOUDINARY_CLOUD_NAME && 
                               process.env.CLOUDINARY_API_KEY && 
                               process.env.CLOUDINARY_API_SECRET

if (isCloudinaryConfigured) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
  })
  console.log('✅ Cloudinary configured successfully')
} else {
  console.warn('⚠️  Cloudinary not configured - uploads will use direct URLs')
}

// Multer configuration for memory storage
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "data:", "https:", "blob:"],
      scriptSrc: ["'self'"],
      connectSrc: ["'self'", "wss:", "ws:"]
    }
  }
}))

// CORS configuration - More permissive for debugging
app.use(cors({
  origin: true, // Allow all origins temporarily
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-CSRF-Token', 'Origin', 'Accept']
}))

// Middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())

// Static file serving
app.use('/assets', express.static('assets'))

// Rate limiting
app.use(rateLimit(15 * 60 * 1000, 100)) // 100 requests per 15 minutes

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Event Hubble API',
    version: '2.0.0',
    timestamp: new Date().toISOString(),
    cors: 'enabled',
    environment: process.env.NODE_ENV || 'development'
  })
})

// Simple test endpoint
app.get('/api/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Backend is working!',
    timestamp: new Date().toISOString()
  })
})

// Test admin creation endpoint
app.post('/api/test/create-admin', async (req, res) => {
  try {
    const adminEmail = 'admin@eventhubble.com'
    const adminPassword = 'admin123'
    const passwordHash = await bcrypt.hash(adminPassword, 10)
    
    // Check if admin exists
    const existingUser = await supabaseService.getUserByEmail(adminEmail)
    
    if (existingUser) {
      // Update existing admin
      const updatedUser = await supabaseService.updateUser(existingUser.id, {
        password_hash: passwordHash,
        full_name: 'Event Hubble Admin',
        role: 'admin',
        is_active: true
      })
      
      res.json({ 
        success: true, 
        message: 'Admin updated successfully',
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      })
    } else {
      // Create new admin
      const newUser = await supabaseService.createUser({
        email: adminEmail,
        password: adminPassword,
        full_name: 'Event Hubble Admin',
        role: 'admin'
      })
      
      res.json({ 
        success: true, 
        message: 'Admin created successfully',
        credentials: {
          email: adminEmail,
          password: adminPassword
        }
      })
    }
  } catch (error) {
    console.error('Error creating admin:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// =====================================
// JWT TOKEN FUNCTIONS
// =====================================

function generateTokens(user) {
  const accessToken = jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      role: user.role 
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: '1h' }
  )
  
  const refreshToken = jwt.sign(
    { 
      id: user.id, 
      type: 'refresh' 
    },
    process.env.JWT_REFRESH_SECRET || 'fallback-refresh-secret',
    { expiresIn: '7d' }
  )
  
  return { accessToken, refreshToken }
}

async function hashToken(token) {
  return await bcrypt.hash(token, 10)
}

function getCookieOptions(isRefresh = false) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: isRefresh ? 7 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000 // 7 days for refresh, 1 hour for access
  }
}

// =====================================
// AUTHENTICATION API ENDPOINTS
// =====================================

// Login - Simplified for debugging
app.post('/api/auth/login', async (req, res) => {
  try {
    console.log('Login request received:', req.body)
    
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email and password are required' 
      })
    }

    // Simple test login - accept any credentials for now
    const mockUser = {
      id: 'admin-user-1',
      email: email,
      full_name: 'Event Hubble Admin',
      role: 'admin',
      avatar_url: null
    }

    // Generate tokens
    const tokens = generateTokens(mockUser)
    
    // Generate CSRF token
    const csrfToken = crypto.randomBytes(32).toString('hex')
    
    console.log('Login successful for:', email)
    
    res.json({ 
      success: true, 
      data: {
        user: mockUser,
        csrfToken
      }
    })
  } catch (error) {
    console.error('Error in login endpoint:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    })
  }
})



// Logout
app.post('/api/auth/logout', authMiddleware(), async (req, res) => {
  try {
    // Clear cookies
    res.clearCookie('accessToken')
    
    res.json({ success: true, message: 'Logged out successfully' })
  } catch (error) {
    console.error('Error logging out:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get current user
app.get('/api/auth/me', async (req, res) => {
  try {
    // For now, return a mock user to test routing
    // In production, this should use authMiddleware()
    const mockUser = {
      id: 'admin-user-1',
      email: 'admin@eventhubble.com',
      full_name: 'Event Hubble Admin',
      role: 'admin',
      avatar_url: null
    }
    
    res.json({ success: true, data: mockUser })
  } catch (error) {
    console.error('Error fetching user:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// =====================================
// LOGOS API ENDPOINTS
// =====================================

// Get all logos or by variant
app.get('/api/logos', async (req, res) => {
  try {
    const { variant, active } = req.query
    const logos = await supabaseService.getLogos({ variant, active })
    res.json({ success: true, data: logos })
  } catch (error) {
    console.error('Error fetching logos:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single logo
app.get('/api/logos/:id', async (req, res) => {
  try {
    const logo = await supabaseService.getLogoById(req.params.id)
    if (!logo) {
      return res.status(404).json({ success: false, error: 'Logo not found' })
    }
    res.json({ success: true, data: logo })
  } catch (error) {
    console.error('Error fetching logo:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Upload and create new logo
app.post('/api/logos', 
  upload.single('logo'), 
  async (req, res) => {
    try {
      console.log('Logo upload request received:', {
        file: req.file ? 'File present' : 'No file',
        body: req.body,
        cloudinaryConfigured: isCloudinaryConfigured
      })

      let logoUrl = req.body.url // Direct URL if provided

      // Upload to Cloudinary if file provided
      if (req.file && isCloudinaryConfigured) {
        console.log('Uploading to Cloudinary...')
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'image',
              folder: 'eventhubble/logos',
              transformation: [
                { quality: 'auto:best' },
                { fetch_format: 'auto' }
              ]
            },
            (error, result) => {
              if (error) reject(error)
              else resolve(result)
            }
          ).end(req.file.buffer)
        })
        logoUrl = uploadResult.secure_url
        console.log('Cloudinary upload successful:', logoUrl)
      } else if (req.file) {
        console.log('Cloudinary not configured, using direct file upload')
        // For now, just use a placeholder URL
        logoUrl = 'https://via.placeholder.com/300x100?text=Logo'
      }

      const logoData = {
        variant: req.body.variant || 'main',
        url: logoUrl,
        title: req.body.title || req.file?.originalname || 'Logo',
        alt_text: req.body.alt_text || 'Logo',
        is_active: req.body.is_active === 'true' || true
      }

      console.log('Creating logo with data:', logoData)

      const logo = await supabaseService.createLogo(logoData)
      
      console.log('Logo created successfully:', logo)
      
      res.status(201).json({ success: true, data: logo })
    } catch (error) {
      console.error('Error creating logo:', error)
      res.status(500).json({ 
        success: false, 
        error: error.message,
        details: error.stack 
      })
    }
  }
)

// Update logo
app.put('/api/logos/:id', 
  async (req, res) => {
    try {
      const logo = await supabaseService.updateLogo(req.params.id, req.body)
      
      // Logo updated successfully
      
      res.json({ success: true, data: logo })
    } catch (error) {
      console.error('Error updating logo:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Delete logo
app.delete('/api/logos/:id', 
  async (req, res) => {
    try {
      await supabaseService.deleteLogo(req.params.id)
      
      // Logo deleted successfully
      
      res.json({ success: true, message: 'Logo deleted successfully' })
    } catch (error) {
      console.error('Error deleting logo:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// BLOGS API ENDPOINTS
// =====================================

// Get all blogs
app.get('/api/blogs', async (req, res) => {
  try {
    const { category, featured, status, limit, offset } = req.query
    
    try {
      const blogs = await supabaseService.getBlogs({ 
        category, 
        featured: featured === 'true',
        status: status || 'published',
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      })
      
      // Ensure we return an array
      const blogsArray = Array.isArray(blogs?.data) ? blogs.data : []
      res.json({ success: true, data: blogsArray })
    } catch (dbError) {
      console.warn('Blogs fetch failed, returning empty array:', dbError.message)
      res.json({ success: true, data: [] })
    }
  } catch (error) {
    console.error('Error in blogs endpoint:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Get single blog by slug or id
app.get('/api/blogs/:identifier', async (req, res) => {
  try {
    const blog = await supabaseService.getBlogBySlugOrId(req.params.identifier)
    if (!blog) {
      return res.status(404).json({ success: false, error: 'Blog not found' })
    }
    
    // Increment view count
    await supabaseService.incrementBlogViews(blog.id)
    
    res.json({ success: true, data: blog })
  } catch (error) {
    console.error('Error fetching blog:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create new blog
app.post('/api/blogs', 
  authMiddleware(['admin', 'editor']), 
  async (req, res) => {
    try {
      const blog = await supabaseService.createBlog(req.body)
      
      // Emit real-time update
      
      
      res.status(201).json({ success: true, data: blog })
    } catch (error) {
      console.error('Error creating blog:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Update blog
app.put('/api/blogs/:id', 
  authMiddleware(['admin', 'editor']), 
  async (req, res) => {
    try {
      const blog = await supabaseService.updateBlog(req.params.id, req.body)
      
      // Emit real-time update
      
      
      res.json({ success: true, data: blog })
    } catch (error) {
      console.error('Error updating blog:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Delete blog
app.delete('/api/blogs/:id', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      await supabaseService.deleteBlog(req.params.id)
      
      // Emit real-time update
      
      
      res.json({ success: true, message: 'Blog deleted successfully' })
    } catch (error) {
      console.error('Error deleting blog:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// EVENTS API ENDPOINTS
// =====================================

// Get all events
app.get('/api/events', async (req, res) => {
  try {
    const { 
      category, 
      city, 
      featured, 
      status,
      date_from,
      date_to,
      limit,
      offset 
    } = req.query

    try {
      const events = await supabaseService.getEvents({
        category,
        city,
        featured: featured === 'true',
        status: status || 'published',
        date_from,
        date_to,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      })

      // Ensure we return an array
      const eventsArray = Array.isArray(events?.data) ? events.data : []
      res.json({ success: true, data: eventsArray })
    } catch (dbError) {
      console.warn('Events fetch failed, returning empty array:', dbError.message)
      res.json({ success: true, data: [] })
    }
  } catch (error) {
    console.error('Error in events endpoint:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Get single event
app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await supabaseService.getEventById(req.params.id)
    if (!event) {
      return res.status(404).json({ success: false, error: 'Event not found' })
    }
    
    // Increment view count
    await supabaseService.incrementEventViews(event.id)
    
    res.json({ success: true, data: event })
  } catch (error) {
    console.error('Error fetching event:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create new event
app.post('/api/events', 
  authMiddleware(['admin', 'editor']), 
  async (req, res) => {
    try {
      const event = await supabaseService.createEvent(req.body)
      
      // Emit real-time update
      
      
      res.status(201).json({ success: true, data: event })
    } catch (error) {
      console.error('Error creating event:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Update event
app.put('/api/events/:id', 
  authMiddleware(['admin', 'editor']), 
  async (req, res) => {
    try {
      const event = await supabaseService.updateEvent(req.params.id, req.body)
      
      // Emit real-time update
      
      
      res.json({ success: true, data: event })
    } catch (error) {
      console.error('Error updating event:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Delete event
app.delete('/api/events/:id', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      await supabaseService.deleteEvent(req.params.id)
      
      // Emit real-time update
      
      
      res.json({ success: true, message: 'Event deleted successfully' })
    } catch (error) {
      console.error('Error deleting event:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// IMAGES API ENDPOINTS (CDN)
// =====================================

// Upload image to Cloudinary
app.post('/api/images/upload', 
  authMiddleware(['admin', 'editor']), 
  upload.single('image'), 
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ success: false, error: 'No image file provided' })
      }

      if (!isCloudinaryConfigured) {
        return res.status(503).json({ success: false, error: 'Image upload service not configured' })
      }

      const { folder = 'general', tags = '' } = req.body

      const uploadResult = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
          {
            resource_type: 'image',
            folder: `eventhubble/${folder}`,
            tags: tags.split(',').map(t => t.trim()),
            transformation: [
              { quality: 'auto:best' },
              { fetch_format: 'auto' }
            ]
          },
          (error, result) => {
            if (error) reject(error)
            else resolve(result)
          }
        ).end(req.file.buffer)
      })

      // Save to database
      const imageData = {
        image_id: `img_${Date.now()}`,
        url: uploadResult.secure_url,
        cloudinary_public_id: uploadResult.public_id,
        title: req.body.title || req.file.originalname,
        alt_text: req.body.alt_text || '',
        category: req.body.category || 'General',
        tags: tags.split(',').map(t => t.trim()),
        width: uploadResult.width,
        height: uploadResult.height,
        file_size: uploadResult.bytes,
        mime_type: uploadResult.format
      }

      const image = await supabaseService.createImage(imageData)
      
      // Emit real-time update
      
      
      res.status(201).json({ success: true, data: image })
    } catch (error) {
      console.error('Error uploading image:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Get all images
app.get('/api/images', async (req, res) => {
  try {
    const { category, limit, offset } = req.query
    
    try {
      const images = await supabaseService.getImages({ 
        category,
        limit: parseInt(limit) || 50,
        offset: parseInt(offset) || 0
      })
      
      // Ensure we return an array
      const imagesArray = Array.isArray(images) ? images : []
      res.json({ success: true, data: imagesArray })
    } catch (dbError) {
      console.warn('Images fetch failed, returning empty array:', dbError.message)
      res.json({ success: true, data: [] })
    }
  } catch (error) {
    console.error('Error in images endpoint:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Delete image
app.delete('/api/images/:id', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      const image = await supabaseService.getImageById(req.params.id)
      
      if (image && image.cloudinary_public_id && isCloudinaryConfigured) {
        // Delete from Cloudinary
        await cloudinary.uploader.destroy(image.cloudinary_public_id)
      }
      
      await supabaseService.deleteImage(req.params.id)
      
      // Emit real-time update
      
      
      res.json({ success: true, message: 'Image deleted successfully' })
    } catch (error) {
      console.error('Error deleting image:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// CATEGORIES API ENDPOINTS
// =====================================

// Get all categories
app.get('/api/categories', async (req, res) => {
  try {
    const categories = await supabaseService.getCategories()
    res.json({ success: true, data: categories })
  } catch (error) {
    console.error('Error fetching categories:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Create category
app.post('/api/categories', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      const category = await supabaseService.createCategory(req.body)
      
      // Emit real-time update
      
      
      res.status(201).json({ success: true, data: category })
    } catch (error) {
      console.error('Error creating category:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Update category
app.put('/api/categories/:id', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      const category = await supabaseService.updateCategory(req.params.id, req.body)
      
      // Emit real-time update
      
      
      res.json({ success: true, data: category })
    } catch (error) {
      console.error('Error updating category:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// Delete category
app.delete('/api/categories/:id', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      await supabaseService.deleteCategory(req.params.id)
      
      // Emit real-time update
      
      
      res.json({ success: true, message: 'Category deleted successfully' })
    } catch (error) {
      console.error('Error deleting category:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// SITE SETTINGS API ENDPOINTS
// =====================================

// Get site settings
app.get('/api/settings', async (req, res) => {
  try {
    const { category, public: isPublic } = req.query
    
    try {
      const settings = await supabaseService.getSettings({ 
        category, 
        isPublic: isPublic !== 'false' // Default to public only
      })
      res.json({ success: true, data: settings })
    } catch (dbError) {
      console.warn('Settings fetch failed, returning defaults:', dbError.message)
      // Return default settings if database fails
      const defaultSettings = {
        site_name: { value: 'EventHubble', type: 'text', category: 'general' },
        site_description: { value: 'Event management platform', type: 'text', category: 'general' },
        contact_email: { value: 'admin@eventhubble.com', type: 'email', category: 'contact' }
      }
      res.json({ success: true, data: defaultSettings })
    }
  } catch (error) {
    console.error('Error in settings endpoint:', error)
    res.status(500).json({ success: false, error: 'Internal server error' })
  }
})

// Update settings (batch update)
app.put('/api/settings', 
  authMiddleware(['admin']), 
  async (req, res) => {
    try {
      const { settings } = req.body
      if (!Array.isArray(settings)) {
        return res.status(400).json({ success: false, error: 'Settings must be an array' })
      }
      
      const updated = await supabaseService.updateSettings(settings)
      
      // Emit real-time update
      
      
      res.json({ success: true, data: updated })
    } catch (error) {
      console.error('Error updating settings:', error)
      res.status(500).json({ success: false, error: error.message })
    }
  }
)

// =====================================
// CONTACT & NEWSLETTER API ENDPOINTS
// =====================================

// Submit contact form
app.post('/api/contact', async (req, res) => {
  try {
    const { name, email, subject, message } = req.body
    
    if (!name || !email || !message) {
      return res.status(400).json({ 
        success: false, 
        error: 'Name, email and message are required' 
      })
    }

    const submission = await supabaseService.createContactSubmission({
      name,
      email,
      subject,
      message,
      ip_address: req.ip,
      user_agent: req.get('User-Agent')
    })

    res.status(201).json({ 
      success: true, 
      message: 'Contact form submitted successfully',
      data: submission 
    })
  } catch (error) {
    console.error('Error submitting contact form:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get contact submissions (admin only)
app.get('/api/contact', authMiddleware(['admin']), async (req, res) => {
  try {
    const { status, limit, offset } = req.query
    const submissions = await supabaseService.getContactSubmissions({
      status,
      limit: parseInt(limit) || 50,
      offset: parseInt(offset) || 0
    })
    res.json({ success: true, data: submissions })
  } catch (error) {
    console.error('Error fetching contact submissions:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Subscribe to newsletter
app.post('/api/newsletter/subscribe', async (req, res) => {
  try {
    const { email, name } = req.body
    
    if (!email) {
      return res.status(400).json({ 
        success: false, 
        error: 'Email is required' 
      })
    }

    const subscriber = await supabaseService.subscribeNewsletter({ email, name })
    res.status(201).json({ 
      success: true, 
      message: 'Successfully subscribed to newsletter',
      data: subscriber 
    })
  } catch (error) {
    console.error('Error subscribing to newsletter:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// =====================================
// ANALYTICS API ENDPOINTS
// =====================================

// Track event
app.post('/api/analytics/track', async (req, res) => {
  try {
    const { event_type, event_data } = req.body
    
    await supabaseService.trackAnalytics({
      event_type,
      event_data,
      session_id: req.session?.id,
      ip_address: req.ip,
      user_agent: req.get('User-Agent'),
      referrer: req.get('Referer'),
      page_url: req.get('Referer')
    })

    res.json({ success: true })
  } catch (error) {
    console.error('Error tracking analytics:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get analytics (admin only) - make it optional for now
app.get('/api/analytics', async (req, res) => {
  try {
    // For now, return empty analytics to prevent frontend errors
    res.json({ 
      success: true, 
      data: [],
      message: 'Analytics endpoint working'
    })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get analytics (admin only)
app.get('/api/analytics', authMiddleware(['admin']), async (req, res) => {
  try {
    const { event_type, date_from, date_to, limit } = req.query
    const analytics = await supabaseService.getAnalytics({
      event_type,
      date_from,
      date_to,
      limit: parseInt(limit) || 100
    })
    res.json({ success: true, data: analytics })
  } catch (error) {
    console.error('Error fetching analytics:', error)
    res.status(500).json({ success: false, error: error.message })
  }
})



// =====================================
// ERROR HANDLING
// =====================================

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ success: false, error: 'File too large. Maximum size is 10MB.' })
    }
  }
  
  console.error('Server error:', error)
  res.status(500).json({ success: false, error: 'Internal server error' })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    path: req.path 
  })
})

// =====================================
// START SERVER
// =====================================

async function startServer() {
  try {
    // Test Supabase connection
    const isConnected = await supabaseService.testConnection()
    if (isConnected) {
      console.log('✅ Supabase connection successful')
    } else {
      console.warn('⚠️  Supabase connection failed - some features may not work')
    }

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`)
      console.log(`📍 Environment: ${process.env.NODE_ENV || 'development'}`)
      console.log(`🌐 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Failed to start server:', error)
    process.exit(1)
  }
}

// Start the server
startServer()

export default app 