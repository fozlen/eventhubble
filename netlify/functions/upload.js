const multer = require('@netlify/multer')
const path = require('path')

// Multer configuration for Netlify Functions
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true)
    } else {
      cb(new Error('Only image files are allowed!'), false)
    }
  }
})

exports.handler = async (event, context) => {
  // CORS headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS'
  }

  // Handle preflight requests
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers,
      body: ''
    }
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    }
  }

  try {
    // Parse multipart form data
    const result = await new Promise((resolve, reject) => {
      upload.single('image')(event, {}, (err) => {
        if (err) reject(err)
        else resolve(event)
      })
    })

    if (!result.file) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: 'No file uploaded' })
      }
    }

    // Generate unique filename
    const timestamp = Date.now()
    const randomSuffix = Math.round(Math.random() * 1E9)
    const ext = path.extname(result.file.originalname)
    const fileName = `uploaded_${timestamp}_${randomSuffix}${ext}`

    // For Netlify, we'll store the image data and return a reference
    // In a real app, you'd upload to a CDN like Cloudinary, AWS S3, etc.
    const imageData = {
      fileName: fileName,
      originalName: result.file.originalname,
      fileSize: result.file.size,
      mimeType: result.file.mimetype,
      // For demo purposes, we'll create a data URL
      dataUrl: `data:${result.file.mimetype};base64,${result.file.buffer.toString('base64')}`,
      // In production, this would be your CDN URL
      cdnUrl: `https://your-cdn.com/images/${fileName}`
    }

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Image uploaded successfully',
        data: imageData
      })
    }

  } catch (error) {
    console.error('Upload error:', error)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: 'Upload failed',
        message: error.message
      })
    }
  }
} 