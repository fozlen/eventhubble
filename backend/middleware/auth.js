import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import { v4 as uuidv4 } from 'uuid'
import supabaseService from '../services/supabaseService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'

// Cookie options
const getCookieOptions = (isRefresh = false) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  maxAge: isRefresh ? 30 * 24 * 60 * 60 * 1000 : 60 * 60 * 1000, // 30 days for refresh, 1 hour for access
  path: '/'
})

// Generate tokens
const generateTokens = (user) => {
  const accessToken = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name,
      type: 'access'
    },
    JWT_SECRET,
    { expiresIn: '1h' }
  )

  const refreshToken = jwt.sign(
    {
      id: user.id,
      type: 'refresh',
      jti: uuidv4()
    },
    REFRESH_SECRET,
    { expiresIn: '30d' }
  )

  return { accessToken, refreshToken }
}

// Verify token
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}

// Hash refresh token for storage
const hashToken = async (token) => {
  return await bcrypt.hash(token, 10)
}

// Verify refresh token hash
const verifyTokenHash = async (token, hash) => {
  return await bcrypt.compare(token, hash)
}

// Main authentication middleware
const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      // Get token from httpOnly cookie
      const accessToken = req.cookies?.accessToken
      
      if (!accessToken) {
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required',
          code: 'TOKEN_MISSING'
        })
      }

      // Verify access token
      const decoded = verifyToken(accessToken)
      if (!decoded || decoded.type !== 'access') {
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid access token',
          code: 'TOKEN_INVALID'
        })
      }

      // Check if user exists and is active
      const user = await supabaseService.getUserById(decoded.id)
      if (!user || !user.is_active) {
        return res.status(401).json({ 
          success: false, 
          error: 'User not found or inactive',
          code: 'USER_INACTIVE'
        })
      }

      // Check role permissions
      if (requiredRoles.length > 0 && !requiredRoles.includes(user.role)) {
        return res.status(403).json({ 
          success: false, 
          error: 'Insufficient permissions',
          code: 'INSUFFICIENT_PERMISSIONS'
        })
      }

      // Add user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }

      next()
    } catch (error) {
      console.error('Auth middleware error:', error)
      res.status(500).json({ 
        success: false, 
        error: 'Authentication error',
        code: 'AUTH_ERROR'
      })
    }
  }
}

// Refresh token middleware
const refreshTokenMiddleware = async (req, res, next) => {
  try {
    const refreshToken = req.cookies?.refreshToken
    
    if (!refreshToken) {
      return res.status(401).json({ 
        success: false, 
        error: 'Refresh token required',
        code: 'REFRESH_TOKEN_MISSING'
      })
    }

    // Verify refresh token
    const decoded = verifyToken(refreshToken, REFRESH_SECRET)
    if (!decoded || decoded.type !== 'refresh') {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid refresh token',
        code: 'REFRESH_TOKEN_INVALID'
      })
    }

    // Check if session exists and is valid
    const session = await supabaseService.getSessionByUserId(decoded.id)
    if (!session || !session.is_active || new Date() > new Date(session.expires_at)) {
      return res.status(401).json({ 
        success: false, 
        error: 'Session expired',
        code: 'SESSION_EXPIRED'
      })
    }

    // Verify refresh token hash
    const isValidHash = await verifyTokenHash(refreshToken, session.refresh_token_hash)
    if (!isValidHash) {
      return res.status(401).json({ 
        success: false, 
        error: 'Invalid refresh token',
        code: 'REFRESH_TOKEN_INVALID'
      })
    }

    // Get user
    const user = await supabaseService.getUserById(decoded.id)
    if (!user || !user.is_active) {
      return res.status(401).json({ 
        success: false, 
        error: 'User not found or inactive',
        code: 'USER_INACTIVE'
      })
    }

    // Generate new tokens
    const tokens = generateTokens(user)
    
    // Update session with new refresh token
    await supabaseService.updateSession(session.id, {
      refresh_token_hash: await hashToken(tokens.refreshToken),
      expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
    })

    // Set new cookies
    res.cookie('accessToken', tokens.accessToken, getCookieOptions(false))
    res.cookie('refreshToken', tokens.refreshToken, getCookieOptions(true))

    // Add user to request
    req.user = {
      id: user.id,
      email: user.email,
      role: user.role,
      full_name: user.full_name
    }

    next()
  } catch (error) {
    console.error('Refresh token middleware error:', error)
    res.status(500).json({ 
      success: false, 
      error: 'Token refresh error',
      code: 'REFRESH_ERROR'
    })
  }
}

// Rate limiting middleware
const rateLimit = (windowMs = 15 * 60 * 1000, max = 100) => {
  const requests = new Map()

  return (req, res, next) => {
    const ip = req.ip
    const now = Date.now()
    const windowStart = now - windowMs

    // Clean old requests
    if (requests.has(ip)) {
      requests.set(ip, requests.get(ip).filter(time => time > windowStart))
    } else {
      requests.set(ip, [])
    }

    const userRequests = requests.get(ip)
    
    if (userRequests.length >= max) {
      return res.status(429).json({
        success: false,
        error: 'Too many requests',
        code: 'RATE_LIMIT_EXCEEDED'
      })
    }

    userRequests.push(now)
    next()
  }
}

// CSRF protection middleware
const csrfProtection = (req, res, next) => {
  // Skip CSRF for GET requests
  if (req.method === 'GET') {
    return next()
  }

  const csrfToken = req.headers['x-csrf-token']
  const sessionToken = req.cookies?.csrfToken

  if (!csrfToken || !sessionToken || csrfToken !== sessionToken) {
    return res.status(403).json({
      success: false,
      error: 'CSRF token validation failed',
      code: 'CSRF_ERROR'
    })
  }

  next()
}

// Audit logging middleware
const auditLog = (action, resourceType) => {
  return async (req, res, next) => {
    const originalSend = res.send
    
    res.send = function(data) {
      // Log after response is sent
      if (req.user) {
        supabaseService.createAuditLog({
          user_id: req.user.id,
          action,
          resource_type: resourceType,
          resource_id: req.params.id || req.body.id,
          old_values: req.method === 'PUT' || req.method === 'DELETE' ? req.originalBody : null,
          new_values: req.method === 'POST' || req.method === 'PUT' ? req.body : null,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        }).catch(console.error)
      }
      
      originalSend.call(this, data)
    }
    
    // Store original body for audit
    if (req.method === 'PUT' || req.method === 'DELETE') {
      req.originalBody = { ...req.body }
    }
    
    next()
  }
}

export {
  authMiddleware,
  refreshTokenMiddleware,
  rateLimit,
  csrfProtection,
  auditLog,
  generateTokens,
  verifyToken,
  hashToken,
  verifyTokenHash,
  getCookieOptions
}

export default authMiddleware 