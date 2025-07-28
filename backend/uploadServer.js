const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs-extra')
const database = require('./database')

const app = express()
const PORT = process.env.PORT || 3001

// Database bağlantısını başlat
async function startServer() {
  try {
    // Database bağlantısını dene
    try {
      await database.connect()
      console.log('✅ MongoDB bağlantısı başarılı')
    } catch (dbError) {
      console.warn('⚠️  MongoDB bağlantısı başarısız, server database olmadan çalışacak')
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
  : ['http://localhost:5173', 'http://localhost:3000', 'https://eventhubble.netlify.app']

app.use(cors({
  origin: corsOrigins,
  credentials: true
}))

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
    console.error('Logo serve error:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// API Routes
app.get('/api/status', async (req, res) => {
  try {
    let stats = null
    if (database.isConnected) {
      try {
        stats = await database.getStats()
      } catch (dbError) {
        console.warn('Database stats error:', dbError.message)
      }
    }
    
    res.json({ 
      status: 'OK', 
      message: 'EventHubble API is running',
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: database.isConnected ? 'connected' : 'disconnected',
      stats: stats || { totalEvents: 0, lastUpdate: new Date() }
    })
  } catch (error) {
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/events', async (req, res) => {
  try {
    if (!database.isConnected) {
      return res.json({ 
        events: [],
        total: 0,
        limit: 50,
        skip: 0,
        message: 'Database not connected - using fallback data'
      })
    }
    
    const { category, city, platform, limit = 50, skip = 0 } = req.query
    
    // Filter oluştur
    const filters = {}
    if (category) filters.category = category
    if (city) filters.city = { $regex: city, $options: 'i' }
    if (platform) filters.platform = platform
    
    const events = await database.getEvents(filters)
    const total = events.length
    
    // Pagination
    const paginatedEvents = events.slice(skip, skip + parseInt(limit))
    
    res.json({ 
      events: paginatedEvents,
      total: total,
      limit: parseInt(limit),
      skip: parseInt(skip),
      message: 'Events retrieved successfully'
    })
  } catch (error) {
    console.error('Events API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/events/:id', async (req, res) => {
  try {
    const event = await database.getEventById(req.params.id)
    if (!event) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.json(event)
  } catch (error) {
    console.error('Event Detail API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.post('/api/events', async (req, res) => {
  try {
    const result = await database.createEvent(req.body)
    res.status(201).json({
      success: true,
      message: 'Event created successfully',
      eventId: result.insertedId
    })
  } catch (error) {
    console.error('Create Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.put('/api/events/:id', async (req, res) => {
  try {
    const result = await database.updateEvent(req.params.id, req.body)
    if (result.matchedCount === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.json({
      success: true,
      message: 'Event updated successfully'
    })
  } catch (error) {
    console.error('Update Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.delete('/api/events/:id', async (req, res) => {
  try {
    const result = await database.deleteEvent(req.params.id)
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Event not found' })
    }
    res.json({
      success: true,
      message: 'Event deleted successfully'
    })
  } catch (error) {
    console.error('Delete Event API Error:', error)
    res.status(500).json({ error: 'Internal server error', message: error.message })
  }
})

app.get('/api/stats', async (req, res) => {
  try {
    const stats = await database.getStats()
    res.json(stats)
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

module.exports = app

// Server'ı başlat
if (require.main === module) {
  startServer()
} 