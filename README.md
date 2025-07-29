# EventHubble 🎪

> **İstanbul'un en kapsamlı etkinlik platform** - Event discovery and management platform for Istanbul

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18-brightgreen)](https://nodejs.org/)
[![Deploy Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/eventhubble/deploys)

## 🌟 Overview

EventHubble is a comprehensive event discovery and management platform designed specifically for Istanbul's vibrant cultural scene. The platform aggregates events from multiple sources and provides both public browsing and admin management capabilities.

### 🎯 Key Features

- **🎭 Multi-source Event Aggregation**: Automatically scrapes events from Biletix, Mobilet, and Biletinial
- **📱 Mobile-First Design**: Responsive interface optimized for mobile devices  
- **🌐 Multilingual Support**: Full Turkish/English localization
- **⚡ Real-time Updates**: Live event data with automatic refresh
- **👥 Admin Dashboard**: Complete CRUD operations for event management
- **📊 Analytics & Insights**: Event popularity tracking and statistics
- **🎨 Modern UI/UX**: Clean, professional interface with dark/light themes
- **🔍 Advanced Search & Filtering**: Category, location, date, and price filters
- **📝 Blog System**: Integrated content management for event guides and news

## 🚀 Live Demo

- **🌍 Public Site**: [https://eventhubble.netlify.app](https://eventhubble.netlify.app)
- **⚙️ Admin Panel**: [https://eventhubble.netlify.app/admin](https://eventhubble.netlify.app/admin)
- **🔗 API Endpoint**: [https://eventhubble-api.onrender.com](https://eventhubble-api.onrender.com)

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend API   │    │   Database      │
│   (React/Vite)  │◄──►│   (Node.js)     │◄──►│   (Supabase)    │
│   Netlify       │    │   Render        │    │   PostgreSQL    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Tech Stack

**Frontend:**
- ⚛️ React 18 with Hooks
- ⚡ Vite for build tooling
- 🎨 Tailwind CSS for styling
- 📱 Responsive design patterns
- 🧭 React Router for navigation

**Backend:**
- 🟢 Node.js with Express
- 🗄️ Supabase (PostgreSQL) database
- 🔄 Automated web scraping
- 📡 RESTful API design
- ⏰ Scheduled data updates

**Infrastructure:**
- 🌐 Netlify (Frontend hosting)
- ☁️ Render (Backend hosting)
- 🗃️ Supabase (Database & Auth)
- 🔄 GitHub Actions (CI/CD)

## 📦 Installation

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Local Development Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/fozlen/eventhubble.git
   cd eventhubble
   ```

2. **Install frontend dependencies**
   ```bash
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   cd ..
   ```

4. **Environment Configuration**
   ```bash
   # Frontend (.env)
   VITE_API_BASE_URL=http://localhost:3001
   
   # Backend (backend/.env)
   PORT=3001
   SUPABASE_URL=your_supabase_url
   SUPABASE_ANON_KEY=your_supabase_key
   NODE_ENV=development
   ```

5. **Start development servers**
   ```bash
   # Frontend (Port 5173)
   npm run dev
   
   # Backend (Port 3001) - in separate terminal
   cd backend && npm start
   ```

6. **Access the application**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3001
   - Admin Panel: http://localhost:5173/admin

## 🚀 Deployment

### Automated Deployment

The project uses automatic deployment via GitHub integration:

- **Frontend**: Automatically deploys to Netlify on `main` branch pushes
- **Backend**: Automatically deploys to Render on `main` branch pushes

### Manual Deployment

See our comprehensive deployment guides:

- 📘 [Netlify Setup](./docs/netlify-setup.md)
- 📗 [Render Setup](./docs/deployment-setup.md)
- 📙 [Database Setup](./docs/database-setup-complete.md)

## 🎯 Usage

### Public Users

1. **Browse Events**: View categorized events with filters
2. **Search**: Find specific events by name, venue, or category
3. **Event Details**: View comprehensive event information
4. **Blog**: Read event guides and Istanbul culture content

### Admin Users

1. **Login**: Access admin panel at `/admin`
2. **Event Management**: Create, edit, delete events
3. **Blog Management**: Manage blog posts and content
4. **Analytics**: View event statistics and insights

## 📊 Project Structure

```
EventHubble/
├── 📁 src/                    # Frontend source code
│   ├── 📁 components/         # Reusable UI components
│   ├── 📁 pages/             # Page components
│   ├── 📁 services/          # API services
│   └── 📁 contexts/          # React contexts
├── 📁 backend/               # Backend source code
│   ├── 📄 uploadServer.js    # Main server file
│   ├── 📄 supabaseService.js # Database service
│   └── 📄 databaseService.js # Data layer
├── 📁 docs/                  # Documentation
├── 📁 database_imports/      # Sample data
└── 📁 public/               # Static assets
```

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](./docs/contributing.md) for details.

### Development Workflow

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- 📖 [Documentation](./docs/README.md)
- 🐛 [Issue Tracker](https://github.com/fozlen/eventhubble/issues)
- 💬 [Discussions](https://github.com/fozlen/eventhubble/discussions)

## 👨‍💻 Author

**Furkan Özlen**
- GitHub: [@fozlen](https://github.com/fozlen)
- Project: [EventHubble](https://github.com/fozlen/eventhubble)

---

<div align="center">
  <strong>Made with ❤️ for Istanbul's event community</strong>
</div>
