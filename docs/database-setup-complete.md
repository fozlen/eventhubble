# Complete Database Setup Guide for EventHubble

## 📊 Database Overview

EventHubble uses **Supabase** (PostgreSQL) as the primary database with the following architecture:

### Core Tables (6 existing)
✅ **blog_posts** - Blog content management
✅ **categories** - Event categorization
✅ **events** - Main events data
✅ **images** - Image asset management
✅ **logos** - Logo asset management  
✅ **site_settings** - Site configuration

### Additional Tables (8 new)
🆕 **contact_submissions** - Contact form data
🆕 **users** - Admin authentication
🆕 **analytics** - Site metrics
🆕 **newsletters** - Email subscriptions
🆕 **faqs** - Frequently asked questions
🆕 **testimonials** - User reviews
🆕 **partners** - Sponsors & venues
🆕 **audit_logs** - Admin activity logs

## 🚀 Quick Setup

### 1. Create All Tables
Run the comprehensive creation script:

```sql
-- Execute this script in your Supabase SQL editor
\i backend/create-additional-tables.sql
```

Or copy and paste the content from `backend/create-additional-tables.sql` into your Supabase SQL editor.

### 2. Environment Variables
Ensure your `.env` file contains:

```env
SUPABASE_URL=your_supabase_project_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=production
```

### 3. Run Existing Tables Migration (if needed)
```sql
\i backend/supabase-migration.sql
```

## 📋 Features Included

### Contact Management
- **Form Submissions**: Store contact form data with IP tracking
- **Status Management**: new → read → replied → closed
- **Language Support**: Track submission language (TR/EN)
- **Admin Response**: Track reply timestamps and admin users

### User Authentication
- **Role-based Access**: super_admin, admin, editor, viewer
- **Security Features**: Password reset, email verification
- **Login Tracking**: Last login time, login count
- **Profile Management**: Avatar, first name, last name

### Analytics & Metrics
- **Traffic Metrics**: Page views, unique visitors
- **Event Metrics**: Event views, category popularity
- **Conversion Tracking**: Contact forms, newsletter signups
- **Source Attribution**: Google Analytics, manual, API

### Newsletter Management
- **Subscription Types**: general, events, news, promotions
- **Status Tracking**: active, unsubscribed, bounced, pending
- **Preferences**: JSONB field for custom settings
- **Verification**: Email verification with tokens

### FAQ System
- **Multi-language**: TR/EN support
- **Categories**: general, events, tickets, technical, account, payment
- **Engagement**: View count, helpful count
- **Management**: Display order, featured flags

### Testimonials
- **Review System**: 1-5 star ratings
- **Approval Workflow**: pending → approved/rejected
- **Multi-language**: TR/EN content support
- **Source Tracking**: website, email, social, manual

### Partners & Sponsors
- **Partner Types**: sponsor, partner, venue, media, vendor
- **Contract Management**: Start/end dates
- **Featured Partners**: Display order and featuring
- **Contact Info**: Email, phone, contact person

### Audit Trail
- **Action Logging**: Create, update, delete operations
- **User Tracking**: Who performed which action
- **Data Changes**: Old vs new values in JSONB
- **Session Info**: IP address, user agent, session ID

## 🔧 Database Schema Features

### Automatic Timestamps
All tables include:
- `created_at` (auto-set on insert)
- `updated_at` (auto-updated on change via triggers)

### Data Integrity
- **Foreign Key Constraints** for relational integrity
- **Check Constraints** for data validation
- **Unique Constraints** for preventing duplicates
- **Default Values** for essential fields

### Performance Optimization
- **Strategic Indexes** on frequently queried columns
- **Composite Indexes** for complex queries
- **Partial Indexes** for conditional filtering

### JSON Support
- **Metadata Fields** for flexible data storage
- **Preferences** for user/newsletter customization
- **Audit Values** for tracking data changes

## 📊 Sample Data

The script includes production-ready sample data:

### Admin User
- **Email**: admin@eventhubble.com
- **Password**: admin123 (⚠️ CHANGE IN PRODUCTION!)
- **Role**: super_admin

### Sample FAQs
- EventHubble nedir? / What is EventHubble?
- Nasıl etkinlik arayabilirim? / How can I search for events?
- Bilet nasıl satın alabilirim? / How can I buy tickets?

### Sample Testimonials
- 3 approved testimonials with 4-5 star ratings
- Turkish and English content
- Featured and regular testimonials

### Sample Partners
- **Zorlu PSM** (venue)
- **Cemal Reşit Rey Konser Salonu** (venue)
- **Maximum Kart** (partner)

### Sample Analytics
- Daily metrics: page views, unique visitors, event views
- Contact form submissions, newsletter signups

## 🔌 API Endpoints

### Contact Submissions
```javascript
POST   /api/contact-submissions     // Submit contact form
GET    /api/contact-submissions     // List submissions (admin)
PUT    /api/contact-submissions/:id // Update submission status
```

### Analytics
```javascript
POST   /api/analytics              // Track analytics event
GET    /api/analytics              // Get analytics data
```

### Newsletter
```javascript
POST   /api/newsletters            // Subscribe to newsletter
POST   /api/newsletters/unsubscribe // Unsubscribe
```

### FAQs
```javascript
GET    /api/faqs                   // Get FAQs
```

### Testimonials
```javascript
GET    /api/testimonials           // Get approved testimonials
POST   /api/testimonials           // Submit testimonial
```

### Partners
```javascript
GET    /api/partners               // Get active partners
```

## 🔒 Security Considerations

### Production Checklist
- [ ] Change default admin password
- [ ] Configure proper database permissions
- [ ] Set up row-level security (RLS) policies
- [ ] Enable database backups
- [ ] Configure rate limiting
- [ ] Set up monitoring and alerts

### Recommended RLS Policies
```sql
-- Example: Users table security
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON public.users
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Admins can manage users" ON public.users
  FOR ALL USING (auth.jwt() ->> 'role' = 'super_admin');
```

## 📈 Monitoring & Maintenance

### Regular Tasks
- **Monitor Analytics**: Track site performance
- **Review Contact Submissions**: Respond to user inquiries
- **Approve Testimonials**: Moderate user reviews
- **Update FAQs**: Keep help content current
- **Partner Management**: Maintain sponsor relationships

### Database Maintenance
```sql
-- Cleanup old analytics data (older than 1 year)
DELETE FROM analytics WHERE metric_date < CURRENT_DATE - INTERVAL '1 year';

-- Cleanup old audit logs (older than 6 months)
DELETE FROM audit_logs WHERE created_at < CURRENT_DATE - INTERVAL '6 months';
```

## 🚀 Getting Started

1. **Run the SQL script** in your Supabase dashboard
2. **Change the default admin password**
3. **Configure environment variables**
4. **Test the API endpoints**
5. **Set up monitoring**

Your EventHubble database is now ready for production! 🎉 