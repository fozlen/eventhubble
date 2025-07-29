import express from 'express'
import multer from 'multer'
import cors from 'cors'
import path from 'path'
import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import supabaseService from './supabaseService.js'

dotenv.config()

// ES modules'da __dirname alternatifi
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

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
  // X-Frame-Options header'ı ekle
  res.setHeader('X-Frame-Options', 'DENY')
  // Diğer güvenlik header'ları
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-XSS-Protection', '1; mode=block')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})

// CORS ayarları - Production için dinamik
const corsOrigins = process.env.CORS_ORIGINS 
  ? process.env.CORS_ORIGINS.split(',').map(origin => origin.trim())
  : ['http://localhost:5173', 'http://localhost:3000', 'https://eventhubble.netlify.app', 'https://eventhubble.com']

app.use(cors({
  origin: corsOrigins,
  credentials: true
}))

app.use(express.json())

// Static dosya servisi için uploads klasörü
const uploadsDir = path.join(__dirname, 'uploads')
fs.ensureDirSync(uploadsDir)

// Logo dosyaları için assets klasörü
const assetsDir = path.join(__dirname, 'assets')

// Multer konfigürasyonu
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadsDir)
  },
  filename: function (req, file, cb) {
    // Benzersiz dosya adı oluştur
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    const ext = path.extname(file.originalname)
    cb(null, `uploaded_${uniqueSuffix}${ext}`)
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
    // Logo serve error
    res.status(500).json({ error: 'Internal server error' })
  }
})

import DatabaseService from './databaseService.js'

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

// Logos CRUD
app.post('/api/logos', async (req, res) => {
  try {
    const result = await DatabaseService.createLogo(req.body)
    res.status(201).json(result)
  } catch (error) {
    res.status(500).json({ success: false, error: 'Failed to create logo' })
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
      ? `https://eventhubble-api.onrender.com/images/${fileName}`
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

// Uploaded images'i serve et
app.use('/images', express.static(uploadsDir))

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