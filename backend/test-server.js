import express from 'express'
import cors from 'cors'

const app = express()
const PORT = process.env.PORT || 3001

// Basic CORS
app.use(cors({
  origin: ['https://eventhubble.com', 'https://www.eventhubble.com', 'https://eventhubble.netlify.app', 'http://localhost:3000', 'http://localhost:5173'],
  credentials: true
}))

app.use(express.json())

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    service: 'Event Hubble API Test',
    timestamp: new Date().toISOString()
  })
})

// Test login endpoint
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body
  
  console.log('Login attempt:', { email, password })
  
  // Simple test - accept any login for now
  res.json({ 
    success: true, 
    data: {
      user: {
        id: 'test-user-1',
        email: email,
        role: 'admin',
        full_name: 'Test Admin'
      },
      csrfToken: 'test-csrf-token-' + Date.now()
    }
  })
})

app.listen(PORT, () => {
  console.log(`🚀 Test server running on port ${PORT}`)
  console.log(`📍 Health check: http://localhost:${PORT}/health`)
}) 