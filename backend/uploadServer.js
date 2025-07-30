import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import supabaseService from './supabaseService.js'
import DatabaseService from './databaseService.js'

dotenv.config()

// ES modules'da __dirname alternatifi
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Directory paths - bunları en başta tanımlayalım
const uploadsDir = path.join(__dirname, 'uploads')
const assetsDir = path.join(__dirname, 'assets')

// Ensure directories exist
fs.ensureDirSync(uploadsDir)

const app = express()
const PORT = process.env.PORT || 3001

// Supabase bağlantısını başlat
async function startServer() {
  try {
    // Supabase bağlantısını test et
    try {
      const isConnected = await supabaseService.testConnection()
      if (isConnected) {
        console.log('✅ Supabase bağlantısı başarılı')
        // Blog posts tablosunu oluştur
        await supabaseService.createBlogPostsTable()
      } else {
        console.warn('⚠️  Supabase bağlantısı başarısız, server database olmadan çalışacak')
      }
    } catch (dbError) {
      console.warn('⚠️  Supabase bağlantısı başarısız, server database olmadan çalışacak')
      console.warn('   Hata:', dbError.message)
    }
    
    console.log('🚀 Server başlatılıyor...')
    
    app.listen(PORT, () => {
      console.log(`✅ Server ${PORT} portunda çalışıyor`)
      console.log(`🌐 Health check: http://localhost:${PORT}/health`)
    })
  } catch (error) {
    console.error('❌ Server başlatma hatası:', error)
    process.exit(1)
  }
}

// Security headers middleware
app.use((req, res, next) => {
  // Security headers (X-Frame-Options removed for frontend compatibility)
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// CORS ayarları - Allow both localhost and production domains
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://eventhubble.com',
    'https://www.eventhubble.com',
    'https://eventhubble.netlify.app',
    'https://eventhubble.onrender.com'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
  optionsSuccessStatus: 200
}))

// Additional CORS headers for problematic requests
app.use((req, res, next) => {
  const origin = req.headers.origin
  const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:5173', 
    'https://eventhubble.com',
    'https://www.eventhubble.com',
    'https://eventhubble.netlify.app',
    'https://eventhubble.onrender.com'
  ]
  
  if (allowedOrigins.includes(origin)) {
    res.header('Access-Control-Allow-Origin', origin)
  }
  
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization')
  res.header('Access-Control-Allow-Credentials', 'true')
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200)
  } else {
    next()
  }
})

app.use(express.json())

// Static assets'i en üstte serve et (CORS'dan sonra)
app.use('/assets', express.static(assetsDir, {
  setHeaders: (res, path) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Cache-Control', 'public, max-age=31536000')
  }
}))

// Uploaded images'i serve et
app.use('/images', express.static(uploadsDir, {
  setHeaders: (res, path) => {
    res.header('Access-Control-Allow-Origin', '*')
    res.header('Cache-Control', 'public, max-age=86400')
  }
}))

// Directories already defined at the top

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Check if this is an images upload
    if (req.path.includes('/images/')) {
      const imagesDir = path.join(uploadsDir, 'images')
      fs.ensureDirSync(imagesDir)
      cb(null, imagesDir)
    } else {
      cb(null, uploadsDir)
    }
  },
  filename: function (req, file, cb) {
    // For images, use a cleaner naming convention
    if (req.path.includes('/images/')) {
      const ext = path.extname(file.originalname)
      const baseName = path.basename(file.originalname, ext)
        .toLowerCase()
        .replace(/[^a-z0-9]/g, '_')
      const timestamp = Date.now()
      cb(null, `${baseName}_${timestamp}${ext}`)
    } else {
      // Original naming for other uploads
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
      const ext = path.extname(file.originalname)
      cb(null, `uploaded_${uniqueSuffix}${ext}`)
    }
  }
})

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: function (req, file, cb) {
    // Sadece image dosyalarına izin ver
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Upload server is running' })
})

// API Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    // Test database service
    const dbTest = await DatabaseService.getEvents()
    res.json({ 
      status: 'OK', 
      message: 'API is running',
      database: 'connected',
      events: Array.isArray(dbTest) ? dbTest.length : 0
    })
  } catch (error) {
    console.error('API Health check error:', error)
    res.status(503).json({ 
      status: 'ERROR', 
      message: 'API service unavailable',
      error: error.message 
    })
  }
})

// Logo endpoint'i
app.get('/api/assets/:filename', (req, res) => {
  try {
    const filename = req.params.filename
    const filePath = path.join(assetsDir, filename)
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ error: 'Logo not found' })
    }
    
    // Dosya türünü belirle
    const ext = path.extname(filename).toLowerCase()
    let contentType = 'image/png'
    
    if (ext === '.jpg' || ext === '.jpeg') contentType = 'image/jpeg'
    else if (ext === '.gif') contentType = 'image/gif'
    else if (ext === '.svg') contentType = 'image/svg+xml'
    
    // Dosyayı gönder
    res.setHeader('Content-Type', contentType)
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable')
    res.sendFile(filePath)
  } catch (error) {
    console.error('Logo serve error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Global error handler
app.use((error, req, res, next) => {
  console.error('🚨 Global error handler:', error)
  res.status(500).json({
    error: 'Internal server error',
    message: error.message,
    timestamp: new Date().toISOString()
  })
})

// ===== DATABASE CONTENT APIS =====

// Logos API
app.get('/api/logos', async (req, res) => {
  try {
    const result = await DatabaseService.getLogos()
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch logos' })
  }
})

app.get('/api/logos/:logoId', async (req, res) => {
  try {
    const result = await DatabaseService.getLogoById(req.params.logoId)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch logo' })
  }
})

// Images API
app.get('/api/images', async (req, res) => {
  try {
    const category = req.query.category
    const result = await DatabaseService.getImages(category)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch images' })
  }
})

app.get('/api/images/:imageId', async (req, res) => {
  try {
    const result = await DatabaseService.getImageById(req.params.imageId)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch image' })
  }
})

// Events API (Enhanced)
app.get('/api/events/db', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      city: req.query.city,
      is_featured: req.query.featured === 'true',
      date_from: req.query.date_from,
      date_to: req.query.date_to
    }
    const result = await DatabaseService.getEvents(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch events' })
  }
})

app.get('/api/events/db/:eventId', async (req, res) => {
  try {
    const result = await DatabaseService.getEventById(req.params.eventId)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch event' })
  }
})

// Categories API
app.get('/api/categories', async (req, res) => {
  try {
    const result = await DatabaseService.getCategories()
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch categories' })
  }
})

app.get('/api/categories/:categoryId', async (req, res) => {
  try {
    const result = await DatabaseService.getCategoryById(req.params.categoryId)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch category' })
  }
})

// Site Settings API
app.get('/api/settings', async (req, res) => {
  try {
    const category = req.query.category
    const result = await DatabaseService.getSiteSettings(category)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch settings' })
  }
})

// Site Settings API (Alternative path for frontend compatibility)
app.get('/api/site-settings', async (req, res) => {
  try {
    const category = req.query.category
    const result = await DatabaseService.getSiteSettings(category)
    res.json(result)
  } catch (error) {
    console.error('Site settings fetch error:', error)
    res.status(500).json({ success: false, error: 'Failed to fetch site settings' })
  }
})

// Site Settings CRUD - Update multiple settings
app.put('/api/settings', async (req, res) => {
  try {
    const { settings } = req.body
    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({ success: false, error: 'Settings array is required' })
    }
    
    const result = await DatabaseService.updateSiteSettings(settings)
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update settings' })
  }
})

// Site Settings CRUD - Update multiple settings (Alternative path)
app.put('/api/site-settings', async (req, res) => {
  try {
    const { settings } = req.body
    if (!settings || !Array.isArray(settings)) {
      return res.status(400).json({ success: false, error: 'Settings array is required' })
    }
    
    const result = await DatabaseService.updateSiteSettings(settings)
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    console.error('Site settings update error:', error)
    res.status(500).json({ success: false, error: 'Failed to update site settings' })
  }
})

// Site Settings CRUD - Delete a setting
app.delete('/api/settings/:settingKey', async (req, res) => {
  try {
    const { settingKey } = req.params
    const result = await DatabaseService.deleteSiteSetting(settingKey)
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete setting' })
  }
})

// Blog Posts API (Enhanced)
app.get('/api/blog-posts/db', async (req, res) => {
  try {
    const filters = {
      category: req.query.category,
      is_featured: req.query.featured === 'true'
    }
    const result = await DatabaseService.getBlogPosts(filters)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog posts' })
  }
})

app.get('/api/blog-posts/db/:slug', async (req, res) => {
  try {
    const result = await DatabaseService.getBlogPostBySlug(req.params.slug)
    if (!result.success) {
      return res.status(404).json(result)
    }
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to fetch blog post' })
  }
})

// ===== WRITE/UPDATE/DELETE APIs =====

// Events CRUD
app.post('/api/events/db', async (req, res) => {
  try {
    const result = await DatabaseService.createEvent(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create event' })
  }
})

app.put('/api/events/db/:eventId', async (req, res) => {
  try {
    const result = await DatabaseService.updateEvent(req.params.eventId, req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update event' })
  }
})

app.delete('/api/events/db/:eventId', async (req, res) => {
  try {
    const result = await DatabaseService.deleteEvent(req.params.eventId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete event' })
  }
})

// Blog Posts CRUD
app.post('/api/blog-posts/db', async (req, res) => {
  try {
    const result = await DatabaseService.createBlogPost(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create blog post' })
  }
})

app.put('/api/blog-posts/db/:postId', async (req, res) => {
  try {
    const result = await DatabaseService.updateBlogPost(req.params.postId, req.body)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update blog post' })
  }
})

app.delete('/api/blog-posts/db/:postId', async (req, res) => {
  try {
    const result = await DatabaseService.deleteBlogPost(req.params.postId)
    res.json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete blog post' })
  }
})

// Images CRUD
app.post('/api/images', async (req, res) => {
  try {
    const result = await DatabaseService.createImage(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create image' })
  }
})

// Combined Image Upload + Database Save
app.post('/api/images/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No file uploaded' })
    }

    // Generate file path for database
    const fileName = req.file.filename
    const filePath = `/uploads/images/${fileName}`
    
    // File is already in the correct location due to multer configuration
    console.log(`✅ Image uploaded: ${req.file.path}`)
    
    // Prepare image data for database
    const imageData = {
      image_id: req.body.image_id || `img_${Date.now()}`,
      category: req.body.category || 'General',
      title: req.body.title || req.file.originalname,
      alt_text: req.body.alt_text || '',
      filename: fileName,
      file_path: filePath,
      file_size: req.file.size,
      mime_type: req.file.mimetype,
      width: req.body.width ? parseInt(req.body.width) : null,
      height: req.body.height ? parseInt(req.body.height) : null,
      tags: req.body.tags ? req.body.tags.split(',').map(tag => tag.trim()) : [],
      metadata: req.body.metadata ? JSON.parse(req.body.metadata) : {},
      is_active: true
    }
    
    // Save to database
    const dbResult = await DatabaseService.createImage(imageData)
    
    if (!dbResult.success) {
      // If database save fails, remove the uploaded file
      const fs = await import('fs-extra')
      await fs.remove(req.file.path)
      return res.status(500).json({ 
        success: false, 
        error: 'Database save failed: ' + dbResult.error 
      })
    }
    
    // Generate image URL
    const imageUrl = process.env.NODE_ENV === 'production' 
      ? `https://eventhubble.onrender.com${filePath}`
      : `http://localhost:${PORT}${filePath}`
    
    res.status(201).json({
      success: true,
      message: 'Image uploaded and saved successfully',
      image: {
        ...dbResult.image,
        imageUrl: imageUrl
      }
    })
    
  } catch (error) {
    console.error('Image upload error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Upload failed: ' + error.message 
    })
  }
})

// Logos CRUD
app.post('/api/logos', async (req, res) => {
  try {
    const result = await DatabaseService.createLogo(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create logo' })
  }
})

app.put('/api/logos/:logoId', async (req, res) => {
  try {
    const result = await DatabaseService.updateLogo(req.params.logoId, req.body)
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update logo' })
  }
})

app.delete('/api/logos/:logoId', async (req, res) => {
  try {
    const result = await DatabaseService.deleteLogo(req.params.logoId)
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete logo' })
  }
})

// Images CRUD (Enhanced)
app.put('/api/images/:imageId', async (req, res) => {
  try {
    const result = await DatabaseService.updateImage(req.params.imageId, req.body)
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update image' })
  }
})

app.delete('/api/images/:imageId', async (req, res) => {
  try {
    const result = await DatabaseService.deleteImage(req.params.imageId)
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete image' })
  }
})

// Categories CRUD
app.post('/api/categories', async (req, res) => {
  try {
    const result = await DatabaseService.createCategory(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create category' })
  }
})

app.put('/api/categories/:categoryId', async (req, res) => {
  try {
    const result = await DatabaseService.updateCategory(req.params.categoryId, req.body)
    if (result.success) {
      res.json(result)
    } else {
      res.status(400).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to update category' })
  }
})

app.delete('/api/categories/:categoryId', async (req, res) => {
  try {
    const result = await DatabaseService.deleteCategory(req.params.categoryId)
    if (result.success) {
      res.json(result)
    } else {
      res.status(404).json(result)
    }
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to delete category' })
  }
})

// Blog Posts API Routes
app.get('/api/blog-posts', async (req, res) => {
  try {
    const posts = await supabaseService.getBlogPosts()
    res.json(posts)
  } catch (error) {
    console.error('Blog Posts API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: 'Database bağlantısı yok' })
  }
})

app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const post = await supabaseService.getBlogPostById(req.params.id)
    if (!post) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json(post)
  } catch (error) {
    console.error('Blog Post Detail API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: 'Database bağlantısı yok' })
  }
})

app.post('/api/blog-posts', async (req, res) => {
  try {
    const blogPost = await supabaseService.createBlogPost(req.body)
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blogPost: blogPost
    })
  } catch (error) {
    console.error('Create Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.put('/api/blog-posts/:id', async (req, res) => {
  try {
    const blogPost = await supabaseService.updateBlogPost(req.params.id, req.body)
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      blogPost: blogPost
    })
  } catch (error) {
    console.error('Update Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.delete('/api/blog-posts/:id', async (req, res) => {
  try {
    await supabaseService.deleteBlogPost(req.params.id)
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Delete Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

// API Routes
app.get('/api/status', async (req, res) => {
  try {
    res.json({ 
      status: 'OK', 
      message: 'EventHubble API is running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: 'Supabase connected',
      timestamp: new Date().toISOString()
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/events', async (req, res) => {
  try {
    res.json({ 
      events: [],
      total: 0,
      limit: 50,
      skip: 0,
      message: 'Events API - Supabase migration in progress'
    })
  } catch (error) {
    console.error('Events API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    res.status(404).json({ error: 'Event not found - Supabase migration in progress' })
  } catch (error) {
    console.error('Event Detail API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.post('/api/events', async (req, res) => {
  try {
    res.status(501).json({
      error: 'Not implemented',
      message: 'Events API - Supabase migration in progress'
    })
  } catch (error) {
    console.error('Create Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.put('/api/events/:id', async (req, res) => {
  try {
    res.status(501).json({
      error: 'Not implemented',
      message: 'Events API - Supabase migration in progress'
    })
  } catch (error) {
    console.error('Update Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.delete('/api/events/:id', async (req, res) => {
  try {
    res.status(501).json({
      error: 'Not implemented',
      message: 'Events API - Supabase migration in progress'
    })
  } catch (error) {
    console.error('Delete Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/stats', async (req, res) => {
  try {
    res.json({
      totalEvents: 0,
      lastUpdate: new Date().toISOString(),
      message: 'Stats API - Supabase migration in progress'
    })
  } catch (error) {
    console.error('Stats API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.post('/api/scrape', async (req, res) => {
  try {
    // Scraping işlemi burada yapılacak
    res.json({ 
      success: true,
      message: 'Scraping triggered successfully'
    })
  } catch (error) {
    console.error('Scraping API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

// Blog Posts API Endpoints
app.get('/api/blog-posts', async (req, res) => {
  try {
    const blogPosts = await supabaseService.getBlogPosts()
    res.json(blogPosts)
  } catch (error) {
    console.error('Blog Posts API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: 'Database bağlantısı yok' })
  }
})

app.get('/api/blog-posts/:id', async (req, res) => {
  try {
    const blogPost = await supabaseService.getBlogPostById(req.params.id)
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json(blogPost)
  } catch (error) {
    console.error('Blog Post Detail API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: 'Database bağlantısı yok' })
  }
})

app.post('/api/blog-posts', async (req, res) => {
  try {
    const blogPost = await supabaseService.createBlogPost(req.body)
    res.status(201).json({
      success: true,
      message: 'Blog post created successfully',
      blogPost: blogPost
    })
  } catch (error) {
    console.error('Create Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.put('/api/blog-posts/:id', async (req, res) => {
  try {
    const blogPost = await supabaseService.updateBlogPost(req.params.id, req.body)
    if (!blogPost) {
      return res.status(404).json({ error: 'Blog post not found' })
    }
    res.json({
      success: true,
      message: 'Blog post updated successfully',
      blogPost: blogPost
    })
  } catch (error) {
    console.error('Update Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.delete('/api/blog-posts/:id', async (req, res) => {
  try {
    await supabaseService.deleteBlogPost(req.params.id)
    res.json({
      success: true,
      message: 'Blog post deleted successfully'
    })
  } catch (error) {
    console.error('Delete Blog Post API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

// Image upload endpoint
app.post('/upload', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' })
    }

    // Dosya bilgilerini al
    const fileName = req.file.filename
    const filePath = req.file.path
    const fileSize = req.file.size
    const mimeType = req.file.mimetype

    // Image URL'ini oluştur (CDN olmadan direkt API'den serve et)
    const imageUrl = process.env.NODE_ENV === 'production' 
      ? `https://eventhubble.onrender.com/images/${fileName}`
      : `http://localhost:${PORT}/images/${fileName}`

    // Başarılı response
    res.json({
      success: true,
      message: 'Image uploaded successfully',
      data: {
        fileName: fileName,
        originalName: req.file.originalname,
        fileSize: fileSize,
        mimeType: mimeType,
        imageUrl: imageUrl,
        localPath: filePath
      }
    })

  } catch (error) {
    console.error('Upload error:', error)
    res.status(500).json({ 
      error: 'Upload failed', 
      message: error.message 
    })
  }
})

// Static middleware moved to top of file - removing duplicates

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 5MB.' })
    }
  }
  
  console.error('Server error:', error)
  res.status(500).json({ error: 'Internal server error' })
})

export default app

// Server'ı başlat
if (import.meta.url === `file://${process.argv[1]}`) {
  startServer()
} 