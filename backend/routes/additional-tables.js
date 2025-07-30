// Additional tables API routes for EventHubble
import express from 'express'
import DatabaseService from '../databaseService.js'

const router = express.Router()

// =============================================
// CONTACT SUBMISSIONS ENDPOINTS
// =============================================

// Submit contact form
router.post('/contact-submissions', async (req, res) => {
  try {
    const {
      name,
      email,
      subject,
      message,
      language = 'TR'
    } = req.body

    // Get client info
    const ip_address = req.ip || req.connection.remoteAddress
    const user_agent = req.get('User-Agent')
    const referrer_url = req.get('Referer')

    const submissionData = {
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim(),
      language,
      ip_address,
      user_agent,
      referrer_url,
      status: 'new'
    }

    const result = await DatabaseService.createContactSubmission(submissionData)
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Contact form submitted successfully',
        submission: result.submission
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to submit contact form'
      })
    }
  } catch (error) {
    console.error('Contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

// Get all contact submissions (Admin only)
router.get('/contact-submissions', async (req, res) => {
  try {
    const { status, limit = 50, offset = 0 } = req.query
    
    const result = await DatabaseService.getContactSubmissions({
      status,
      limit: parseInt(limit),
      offset: parseInt(offset)
    })
    
    if (result.success) {
      res.json({
        success: true,
        submissions: result.submissions,
        total: result.total
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to fetch contact submissions'
      })
    }
  } catch (error) {
    console.error('Get contact submissions error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Update contact submission status
router.put('/contact-submissions/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { status, reply_message } = req.body
    
    const result = await DatabaseService.updateContactSubmission(id, {
      status,
      reply_message,
      replied_at: status === 'replied' ? new Date() : null,
      // replied_by: req.user?.id // Add when authentication is implemented
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Contact submission updated successfully',
        submission: result.submission
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to update contact submission'
      })
    }
  } catch (error) {
    console.error('Update contact submission error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// =============================================
// ANALYTICS ENDPOINTS
// =============================================

// Track analytics event
router.post('/analytics', async (req, res) => {
  try {
    const {
      metric_name,
      metric_value = 1,
      metric_category = 'general',
      metadata = {}
    } = req.body

    const result = await DatabaseService.trackAnalytics({
      metric_name,
      metric_value,
      metric_date: new Date().toISOString().split('T')[0],
      metric_category,
      metadata,
      source: 'api'
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Analytics tracked successfully'
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to track analytics'
      })
    }
  } catch (error) {
    console.error('Track analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Get analytics data
router.get('/analytics', async (req, res) => {
  try {
    const {
      metric_name,
      start_date,
      end_date,
      category,
      limit = 100
    } = req.query
    
    const result = await DatabaseService.getAnalytics({
      metric_name,
      start_date,
      end_date,
      category,
      limit: parseInt(limit)
    })
    
    if (result.success) {
      res.json({
        success: true,
        analytics: result.analytics
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to fetch analytics'
      })
    }
  } catch (error) {
    console.error('Get analytics error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// =============================================
// NEWSLETTER ENDPOINTS
// =============================================

// Subscribe to newsletter
router.post('/newsletters', async (req, res) => {
  try {
    const {
      email,
      subscription_type = 'general',
      preferences = {}
    } = req.body

    const ip_address = req.ip || req.connection.remoteAddress

    const result = await DatabaseService.subscribeNewsletter({
      email: email.trim().toLowerCase(),
      subscription_type,
      preferences,
      ip_address,
      source: 'website'
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Successfully subscribed to newsletter',
        subscription: result.subscription
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to subscribe to newsletter'
      })
    }
  } catch (error) {
    console.error('Newsletter subscription error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Unsubscribe from newsletter
router.post('/newsletters/unsubscribe', async (req, res) => {
  try {
    const { email, reason } = req.body
    
    const result = await DatabaseService.unsubscribeNewsletter({
      email: email.trim().toLowerCase(),
      reason
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Successfully unsubscribed from newsletter'
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to unsubscribe from newsletter'
      })
    }
  } catch (error) {
    console.error('Newsletter unsubscribe error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// =============================================
// FAQS ENDPOINTS
// =============================================

// Get all FAQs
router.get('/faqs', async (req, res) => {
  try {
    const { category, featured, language = 'TR' } = req.query
    
    const result = await DatabaseService.getFAQs({
      category,
      featured: featured === 'true',
      language
    })
    
    if (result.success) {
      res.json({
        success: true,
        faqs: result.faqs
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to fetch FAQs'
      })
    }
  } catch (error) {
    console.error('Get FAQs error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// =============================================
// TESTIMONIALS ENDPOINTS
// =============================================

// Get approved testimonials
router.get('/testimonials', async (req, res) => {
  try {
    const { featured, limit = 10 } = req.query
    
    const result = await DatabaseService.getTestimonials({
      featured: featured === 'true',
      limit: parseInt(limit)
    })
    
    if (result.success) {
      res.json({
        success: true,
        testimonials: result.testimonials
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to fetch testimonials'
      })
    }
  } catch (error) {
    console.error('Get testimonials error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// Submit testimonial
router.post('/testimonials', async (req, res) => {
  try {
    const {
      name,
      email,
      title,
      company,
      content_tr,
      content_en,
      rating
    } = req.body

    const result = await DatabaseService.createTestimonial({
      name: name.trim(),
      email: email?.trim().toLowerCase(),
      title: title?.trim(),
      company: company?.trim(),
      content_tr: content_tr.trim(),
      content_en: content_en?.trim(),
      rating: parseInt(rating),
      source: 'website',
      status: 'pending'
    })
    
    if (result.success) {
      res.json({
        success: true,
        message: 'Testimonial submitted successfully',
        testimonial: result.testimonial
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to submit testimonial'
      })
    }
  } catch (error) {
    console.error('Create testimonial error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

// =============================================
// PARTNERS ENDPOINTS
// =============================================

// Get active partners
router.get('/partners', async (req, res) => {
  try {
    const { partner_type, featured } = req.query
    
    const result = await DatabaseService.getPartners({
      partner_type,
      featured: featured === 'true',
      status: 'active'
    })
    
    if (result.success) {
      res.json({
        success: true,
        partners: result.partners
      })
    } else {
      res.status(400).json({
        success: false,
        message: result.error || 'Failed to fetch partners'
      })
    }
  } catch (error) {
    console.error('Get partners error:', error)
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    })
  }
})

export default router 