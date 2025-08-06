# Event Hubble Backend API

Modern event management platform backend API built with Node.js, Express, and Supabase.

## Features

- **RESTful API** for all content management
- **JWT Authentication** with role-based access control
- **Cloudinary Integration** for image CDN
- **Supabase** for database and real-time features
- **Full CRUD Operations** for events, blogs, logos, and more

## Tech Stack

- Node.js 18+
- Express.js
- Supabase (PostgreSQL)
- Cloudinary CDN
- JWT Authentication
- Multer for file uploads

## API Endpoints

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user

### Logos
- `GET /api/logos` - Get all logos
- `GET /api/logos/:id` - Get single logo
- `POST /api/logos` - Create logo (Auth required)
- `PUT /api/logos/:id` - Update logo (Auth required)
- `DELETE /api/logos/:id` - Delete logo (Auth required)

### Blogs
- `GET /api/blogs` - Get all blogs
- `GET /api/blogs/:slug` - Get blog by slug or ID
- `POST /api/blogs` - Create blog (Auth required)
- `PUT /api/blogs/:id` - Update blog (Auth required)
- `DELETE /api/blogs/:id` - Delete blog (Auth required)

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create event (Auth required)
- `PUT /api/events/:id` - Update event (Auth required)
- `DELETE /api/events/:id` - Delete event (Auth required)

### Images (CDN)
- `POST /api/images/upload` - Upload image to Cloudinary
- `GET /api/images` - Get all images
- `DELETE /api/images/:id` - Delete image

### Categories
- `GET /api/categories` - Get all categories
- `POST /api/categories` - Create category (Admin only)
- `PUT /api/categories/:id` - Update category (Admin only)
- `DELETE /api/categories/:id` - Delete category (Admin only)

### Settings
- `GET /api/settings` - Get site settings
- `PUT /api/settings` - Update settings (Admin only)

### Contact & Newsletter
- `POST /api/contact` - Submit contact form
- `GET /api/contact` - Get submissions (Admin only)
- `POST /api/newsletter/subscribe` - Subscribe to newsletter

### Analytics
- `POST /api/analytics/track` - Track event
- `GET /api/analytics` - Get analytics (Admin only)

## Installation

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp env.example .env
```

4. Configure your `.env` file with your actual values

5. Set up database manually:
   - Copy and execute `create-tables.sql` in your Supabase SQL Editor
   - Run `scripts/cleanup-and-migrate-data.sql` to clean the database

6. Start the server:
```bash
npm run dev  # Development
npm start    # Production
```

## Database Schema

The database includes the following tables:
- `logos` - Brand logos with variants
- `blogs` - Blog posts with markdown support
- `events` - Event listings with full details
- `categories` - Event and content categories
- `images` - CDN-managed images
- `site_settings` - Configurable site settings
- `users` - Admin users with roles
- `contact_submissions` - Contact form submissions
- `newsletter_subscribers` - Newsletter subscriptions
- `analytics` - Event tracking data

## Deployment

### Render.com

1. Connect your GitHub repository
2. Set environment variables in Render dashboard
3. Deploy with automatic builds

### Environment Variables Required

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `JWT_SECRET`

## License

MIT 