import jwt from 'jsonwebtoken'
import bcrypt from 'bcrypt'
import supabaseService from '../services/supabaseService.js'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'
const REFRESH_SECRET = process.env.REFRESH_SECRET || 'your-refresh-secret-key-change-in-production'





// Verify token
const verifyToken = (token, secret = JWT_SECRET) => {
  try {
    return jwt.verify(token, secret)
  } catch (error) {
    return null
  }
}



// Main authentication middleware
const authMiddleware = (requiredRoles = []) => {
  return async (req, res, next) => {
    try {
      console.log('=== AUTH MIDDLEWARE START ===')
      console.log('Required roles:', requiredRoles)
      console.log('Cookies:', req.cookies)
      
      // Get token from httpOnly cookie
      const accessToken = req.cookies?.accessToken
      
      console.log('=== TOKEN DEBUG ===')
      console.log('All cookies:', req.cookies)
      console.log('Access token present:', !!accessToken)
      console.log('Access token length:', accessToken?.length)
      console.log('Access token preview:', accessToken ? `${accessToken.substring(0, 20)}...` : 'None')
      
      if (!accessToken) {
        console.log('No access token found')
        return res.status(401).json({ 
          success: false, 
          error: 'Access token required',
          code: 'TOKEN_MISSING'
        })
      }

      // Verify access token
      const decoded = verifyToken(accessToken)
      console.log('Decoded token:', decoded)
      console.log('Token type:', decoded?.type)
      console.log('Token user ID:', decoded?.id)
      
      if (!decoded || decoded.type !== 'access') {
        console.log('Invalid token:', { decoded, type: decoded?.type })
        return res.status(401).json({ 
          success: false, 
          error: 'Invalid access token',
          code: 'TOKEN_INVALID',
          details: { decoded, type: decoded?.type }
        })
      }

      // Check if user exists and is active
      const user = await supabaseService.getUserById(decoded.id)
      console.log('Found user:', user)
      
      if (!user || !user.is_active) {
        console.log('User not found or inactive:', { user, isActive: user?.is_active })
        return res.status(401).json({ 
          success: false, 
          error: 'User not found or inactive',
          code: 'USER_INACTIVE'
        })
      }

      // Check role permissions
      if (requiredRoles.length > 0) {
        console.log('Checking role permissions:', { userRole: user.role, requiredRoles })
        
        // Admin and super_admin have all permissions - they can access ANY endpoint
        if (user.role === 'admin' || user.role === 'super_admin') {
          console.log('Admin/Super Admin access granted - full permissions')
          // Admin can access everything, no further checks needed
        } else if (!requiredRoles.includes(user.role)) {
          console.log('Insufficient permissions:', { userRole: user.role, requiredRoles })
          return res.status(403).json({ 
            success: false, 
            error: 'Insufficient permissions',
            code: 'INSUFFICIENT_PERMISSIONS',
            userRole: user.role,
            requiredRoles: requiredRoles
          })
        }
      }

      // Add user to request
      req.user = {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name
      }

      console.log('=== AUTH MIDDLEWARE SUCCESS ===')
      console.log('User added to request:', req.user)
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



export {
  authMiddleware,
  rateLimit
}

export default authMiddleware 