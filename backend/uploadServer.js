const express = require('express')
const multer = require('multer')
const cors = require('cors')
const path = require('path')
const fs = require('fs-extra')

const app = express()
const PORT = process.env.PORT || 3001

// CORS ayarları
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:3000', 'https://eventhubble.netlify.app'],
  credentials: true
}))

// Static dosya servisi için uploads klasörü
const uploadsDir = path.join(__dirname, 'uploads')
fs.ensureDirSync(uploadsDir)

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

    // CDN URL'ini oluştur (production'da gerçek CDN URL'i kullanılacak)
    const cdnUrl = process.env.NODE_ENV === 'production' 
      ? `https://cdn.eventhubble.com/images/${fileName}`
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
        cdnUrl: cdnUrl,
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

// Server'ı başlat
app.listen(PORT, () => {
  console.log(`🚀 Upload server running on port ${PORT}`)
  console.log(`📁 Uploads directory: ${uploadsDir}`)
  console.log(`🌐 Health check: http://localhost:${PORT}/health`)
})

module.exports = app 