# EventHubble - Dynamic Admin Panel

EventHubble is Turkey's smart event discovery platform with a fully dynamic admin panel system. This project has been completely transformed to eliminate localStorage dependencies and provide real-time, secure content management.

## 🚀 New Features

### Enhanced Authentication & Security
- **httpOnly Cookie Authentication**: Secure JWT storage with refresh tokens
- **Role-Based Access Control**: Super Admin, Admin, Editor, Viewer roles
- **Multi-Factor Authentication**: TOTP support for enhanced security
- **CSRF Protection**: Built-in CSRF token validation
- **Rate Limiting**: Configurable rate limiting for API endpoints
- **Audit Logging**: Complete audit trail for all sensitive actions

### Real-Time Features
- **WebSocket Integration**: Real-time content updates and notifications
- **Live Admin Dashboard**: Real-time user activity and system health
- **Instant Content Sync**: Changes appear immediately across all connected clients
- **Real-Time Notifications**: Toast notifications for all system events

### Advanced State Management
- **Zustand Stores**: Centralized state management with persistence
- **React Query**: Server state management with caching and background updates
- **Optimistic Updates**: Instant UI feedback with background sync
- **Smart Caching**: Intelligent cache invalidation and background refetching

### Enhanced Content Management
- **Dynamic Blog System**: Rich text editor, SEO optimization, versioning
- **Advanced Event Management**: Recurring events, ticketing, capacity management
- **Media Library**: Cloudinary integration with drag & drop, tagging, optimization
- **Category Management**: Hierarchical categories with custom icons and SEO

### Performance Optimizations
- **Multi-Layer Caching**: Browser, CDN, and Redis caching
- **Image Optimization**: Automatic WebP conversion and responsive images
- **Code Splitting**: Lazy loading for better performance
- **Background Jobs**: Heavy operations run in background

## 🏗️ Architecture

### Frontend (React + Vite)
```
src/
├── stores/           # Zustand state stores
│   ├── authStore.js  # Authentication state
│   └── appStore.js   # Application state
├── hooks/            # React Query hooks
│   └── useQueries.js # Server state management
├── services/         # API and WebSocket services
│   ├── api.js        # HTTP API client
│   └── websocket.js  # Real-time communication
└── components/       # Reusable components
    └── NotificationSystem.jsx # Real-time notifications
```

### Backend (Express.js + Supabase)
```
backend/
├── middleware/       # Authentication & security middleware
│   └── auth.js       # JWT, CSRF, rate limiting
├── services/         # Business logic
│   └── supabaseService.js # Database operations
├── routes/           # API endpoints
└── server.js         # Main server with WebSocket
```

### Database (Supabase PostgreSQL)
- **Enhanced Schema**: Audit logs, sessions, user roles, MFA
- **Row Level Security**: Fine-grained access control
- **Real-time Subscriptions**: Database change notifications
- **Full-text Search**: Optimized search with Turkish language support

## 🛠️ Installation

### Prerequisites
- Node.js 18+
- PostgreSQL (via Supabase)
- Redis (optional, for caching)
- Cloudinary account

### Backend Setup
```bash
cd backend
npm install
cp env.example .env
# Fill in your environment variables
npm run dev
```

### Frontend Setup
```bash
npm install
npm run dev
```

### Database Setup
```bash
# Database setup completed manually
# All SQL scripts have been cleaned up after successful setup
# Database is now ready for admin panel content management
```

### Admin Panel Setup
After manual database setup, the database will be clean with no dummy data:
- **No test users** - Create your first admin user through the admin panel
- **No sample content** - Add all categories, events, and blog posts through the admin panel
- **No dummy images** - Upload your own logos and images through the admin panel
- **Essential settings only** - Configure all site settings through the admin panel

## 🔧 Configuration

### Environment Variables

#### Backend (.env)
```env
# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

# JWT
JWT_SECRET=your_jwt_secret
REFRESH_SECRET=your_refresh_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Security
CORS_ORIGIN=http://localhost:3000,http://localhost:5173
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend (.env)
```env
VITE_API_URL=http://localhost:3001
VITE_WS_URL=ws://localhost:3001
```

## 🔐 Authentication Flow

1. **Login**: User submits credentials
2. **Token Generation**: Server creates access + refresh tokens
3. **Cookie Storage**: Tokens stored in httpOnly cookies
4. **CSRF Token**: Client receives CSRF token for API calls
5. **Session Management**: Server tracks active sessions
6. **Auto Refresh**: Tokens automatically refreshed before expiry

## 📊 Real-Time Features

### WebSocket Events
- `content:updated` - Content changes (create/update/delete)
- `notification` - System notifications
- `system:maintenance` - Maintenance mode updates
- `admin:user_activity` - Real-time user activity
- `admin:analytics_update` - Live analytics data

### State Synchronization
- **Optimistic Updates**: UI updates immediately
- **Background Sync**: Server state synchronized in background
- **Conflict Resolution**: Automatic conflict detection and resolution
- **Offline Support**: Graceful degradation when offline

## 🎨 Admin Panel Features

### Dashboard
- Real-time analytics and metrics
- Recent activity feed
- System health monitoring
- Quick action buttons

### Content Management
- **Blogs**: Rich editor, SEO tools, scheduling
- **Events**: Multi-step wizard, recurring patterns, ticketing
- **Categories**: Hierarchical management, custom icons
- **Media**: Drag & drop upload, tagging, optimization

### User Management
- Role-based access control
- MFA configuration
- Session management
- Activity monitoring

### System Settings
- Site configuration
- Theme customization
- Security settings
- Feature flags

## 🔒 Security Features

### Authentication
- JWT with httpOnly cookies
- Refresh token rotation
- Session management
- Account lockout protection

### Authorization
- Role-based access control
- Resource-level permissions
- API endpoint protection
- CSRF protection

### Data Protection
- Input validation and sanitization
- SQL injection prevention
- XSS protection
- Rate limiting

### Audit & Compliance
- Complete audit trail
- GDPR compliance tools
- Data export/import
- Privacy controls

## 🚀 Performance

### Caching Strategy
- **Browser Cache**: Static assets and API responses
- **CDN Cache**: Images and media files
- **Redis Cache**: Database queries and sessions
- **Memory Cache**: Application state

### Optimization
- **Image Optimization**: Automatic WebP conversion
- **Code Splitting**: Lazy loading of components
- **Bundle Optimization**: Tree shaking and minification
- **Database Optimization**: Indexed queries and materialized views

## 📈 Monitoring & Analytics

### Real-Time Metrics
- User activity tracking
- Content performance
- System health monitoring
- Error tracking

### Analytics Integration
- Google Analytics 4
- Custom event tracking
- Performance monitoring
- User behavior analysis

## 🔄 Migration Guide

### From Old System
1. **Database Migration**: Run enhanced schema
2. **Authentication Update**: Migrate to new auth system
3. **State Management**: Replace localStorage with Zustand
4. **API Integration**: Update to new endpoints
5. **Real-Time Features**: Add WebSocket integration

### Breaking Changes
- Authentication now uses httpOnly cookies
- API responses follow new standardized format
- State management moved to Zustand stores
- Real-time updates require WebSocket connection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Contact the development team

---

**EventHubble** - Your Gateway to Every Experience 🎉
