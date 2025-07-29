# EventHubble Project Structure

This document outlines the complete file and folder structure of the EventHubble project.

## 📁 Root Directory Structure

```
EventHubble/
├── 📄 README.md                     # Main project documentation
├── 📄 LICENSE                       # MIT license file
├── 📄 package.json                  # Frontend dependencies & scripts
├── 📄 package-lock.json             # Frontend dependency lock
├── 📄 .gitignore                    # Git ignore rules
├── 📄 .npmrc                        # npm configuration
│
├── 🔧 Configuration Files
├── 📄 vite.config.js                # Vite build configuration
├── 📄 tailwind.config.js            # Tailwind CSS configuration
├── 📄 postcss.config.js             # PostCSS configuration
├── 📄 eslint.config.js              # ESLint configuration
├── 📄 jsconfig.json                 # JavaScript configuration
├── 📄 components.json               # shadcn/ui components config
├── 📄 netlify.toml                  # Netlify deployment config
├── 📄 render.yaml                   # Render deployment config
│
├── 📁 Frontend Source Code
├── 📁 src/                          # React application source
├── 📁 public/                       # Static assets
├── 📁 dist/                         # Build output (generated)
├── 📁 node_modules/                 # Frontend dependencies (generated)
│
├── 📁 Backend & Services
├── 📁 backend/                      # Node.js backend API
├── 📁 netlify/                      # Netlify functions
├── 📁 scripts/                      # Deployment scripts
│
├── 📁 Documentation & Data
├── 📁 docs/                         # Project documentation
├── 📁 database_imports/             # Sample database data
├── 📁 .github/                      # GitHub Actions & templates
└── 📁 .git/                         # Git repository data
```

## 🗂️ Frontend Structure (`src/`)

```
src/
├── 📄 main.jsx                      # React app entry point
├── 📄 App.jsx                       # Main app component
├── 📄 App.css                       # Global app styles
├── 📄 index.css                     # Global CSS & Tailwind imports
│
├── 📁 components/                   # Reusable UI components
│   ├── 📄 EventCard.jsx            # Event display card
│   ├── 📄 EventDetailModal.jsx     # Event detail popup
│   ├── 📄 ImageSelector.jsx        # Image selection component
│   ├── 📄 MobileEventCard.jsx      # Mobile event card
│   ├── 📄 MobileFilters.jsx        # Mobile filter interface
│   ├── 📄 MobileFooter.jsx         # Mobile footer
│   ├── 📄 MobileHeader.jsx         # Mobile header
│   ├── 📄 MobileNavigation.jsx     # Mobile navigation
│   ├── 📄 ModernDropdowns.jsx      # Custom dropdown components
│   ├── 📄 ModernSearchBox.jsx      # Search interface
│   └── 📁 ui/                      # shadcn/ui components
│       ├── 📄 button.jsx           # Button component
│       ├── 📄 card.jsx             # Card component
│       ├── 📄 dialog.jsx           # Dialog/modal component
│       └── ...                     # Other UI components
│
├── 📁 pages/                       # Page components
│   ├── 📄 HomePage.jsx             # Main event listing page
│   ├── 📄 EventDetailPage.jsx      # Individual event page
│   ├── 📄 SearchResultsPage.jsx    # Search results page
│   ├── 📄 CategoriesPage.jsx       # Categories page
│   ├── 📄 BlogDetailPage.jsx       # Blog post page
│   ├── 📄 WorldNewsPage.jsx        # News page
│   ├── 📄 AboutPage.jsx            # About page
│   ├── 📄 AdminLoginPage.jsx       # Admin login
│   ├── 📄 AdminDashboardPage.jsx   # Admin dashboard
│   └── 📄 AdminEventManagementPage.jsx # Event management
│
├── 📁 services/                    # API & data services
│   ├── 📄 eventService.js          # Event data management
│   ├── 📄 cacheService.js          # Client-side caching
│   ├── 📄 logoService.js           # Logo management
│   └── 📄 databaseService.js       # Database API client
│
├── 📁 contexts/                    # React contexts
│   └── 📄 LanguageContext.jsx      # Language state management
│
├── 📁 hooks/                       # Custom React hooks
│   ├── 📄 use-mobile.js            # Mobile detection hook
│   └── 📄 useSwipe.js              # Swipe gesture hook
│
├── 📁 lib/                         # Utility libraries
│   └── 📄 utils.js                 # Common utility functions
│
└── 📁 assets/                      # Static assets (images, logos)
    ├── 📄 react.svg                # React logo
    ├── 📄 Logo.png                 # Main logo
    ├── 📄 eventhubble_new_logo.png # New logo variant
    ├── 📄 eventhubble_dark_transparent_logo.png
    ├── 📄 eventhubble_light_transparent_logo.png
    └── 📄 processed_events.json    # Processed event data
```

## 🖥️ Backend Structure (`backend/`)

```
backend/
├── 📄 package.json                 # Backend dependencies
├── 📄 package-lock.json            # Backend dependency lock
├── 📄 uploadServer.js              # Main Express server
├── 📄 supabaseService.js           # Supabase client & methods
├── 📄 databaseService.js           # Database abstraction layer
├── 📄 database.js                  # Legacy database connection
├── 📄 scheduler.js                 # Event scraping scheduler
├── 📄 scraper.js                   # Web scraping logic
├── 📄 migrateBlogPosts.js          # Blog migration script
├── 📄 seedDatabase.js              # Database seeding script
├── 📄 .env.example                 # Environment variables template
├── 📄 README.md                    # Backend documentation
├── 📄 blog_posts_sample.csv        # Sample blog data
│
├── 📁 data/                        # Runtime data storage
│   ├── 📄 all_events.json          # Aggregated events
│   ├── 📄 biletix_events.json      # Biletix scraped events
│   ├── 📄 mobilet_events.json      # Mobilet scraped events
│   ├── 📄 biletinial_events.json   # Biletinial scraped events
│   └── 📄 stats.json               # Platform statistics
│
├── 📁 uploads/                     # User uploaded files
│
└── 📁 assets/                      # Backend static assets
    ├── 📄 Logo.png                 # Logo files
    ├── 📄 eventhubble_new_logo.png
    └── ...                         # Other logo variants
```

## 📚 Documentation Structure (`docs/`)

```
docs/
├── 📄 README.md                    # Documentation index
├── 📄 project-structure.md         # This file
├── 📄 database-setup.md            # Database setup guide
├── 📄 database-setup-complete.md   # Complete database guide
├── 📄 deployment-setup.md          # Deployment configuration
├── 📄 production-setup.md          # Production setup guide
├── 📄 production-deployment-checklist.md # Deployment checklist
├── 📄 netlify-setup.md             # Netlify deployment guide
├── 📄 cdn-setup.md                 # CDN configuration
├── 📄 blog-migration-guide.md      # Blog migration guide
├── 📄 env.production               # Production environment example
└── 📄 production-checklist.md      # Production readiness checklist
```

## 💾 Database Import Structure (`database_imports/`)

```
database_imports/
├── 📄 README.md                    # Import instructions
├── 📄 logos.csv                    # Logo data for import
├── 📄 images.csv                   # Image data for import
├── 📄 categories.csv               # Category data for import
├── 📄 events.csv                   # Sample event data
├── 📄 blog_posts.csv               # Blog post data
└── 📄 site_settings.csv            # Site configuration data
```

## ⚙️ Configuration Files

### Build & Development
- `vite.config.js` - Vite bundler configuration
- `tailwind.config.js` - Tailwind CSS customization
- `postcss.config.js` - CSS processing configuration
- `eslint.config.js` - Code linting rules

### Deployment
- `netlify.toml` - Netlify deployment settings
- `render.yaml` - Render.com deployment configuration
- `.github/workflows/` - GitHub Actions CI/CD

### Dependencies
- `package.json` - Frontend dependencies and scripts
- `backend/package.json` - Backend dependencies and scripts

## 🚀 Key Features by Directory

### `/src/pages/`
- **Public Pages**: HomePage, EventDetailPage, SearchResultsPage
- **Content Pages**: BlogDetailPage, WorldNewsPage, AboutPage
- **Admin Pages**: AdminLoginPage, AdminDashboardPage, AdminEventManagementPage

### `/src/services/`
- **Data Management**: eventService.js, databaseService.js
- **Performance**: cacheService.js
- **Assets**: logoService.js

### `/backend/`
- **API Server**: uploadServer.js (Express.js)
- **Data Layer**: databaseService.js, supabaseService.js
- **Automation**: scheduler.js, scraper.js

### `/docs/`
- **Setup Guides**: Installation, deployment, database setup
- **Operational**: Production checklists, troubleshooting
- **Architecture**: API documentation, project structure

## 📋 Development Workflow

1. **Frontend Development**: Work in `/src/` directory
2. **Backend Development**: Work in `/backend/` directory  
3. **Documentation**: Update `/docs/` for any changes
4. **Database Changes**: Update `/database_imports/` with new schemas
5. **Configuration**: Modify config files as needed for new features

## 🔧 Build Process

1. **Development**: `npm run dev` (frontend) + `npm start` (backend)
2. **Production Build**: `npm run build` creates `/dist/` directory
3. **Deployment**: Automatic via GitHub → Netlify/Render
4. **Assets**: Static files served from `/public/` and `/backend/assets/`

This structure ensures maintainability, scalability, and clear separation of concerns across the entire EventHubble platform. 