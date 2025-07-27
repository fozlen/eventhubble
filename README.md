# EventHubble 🌟

**Your Global Event Discovery Platform**

EventHubble is a modern, responsive web application that helps users discover and explore events worldwide. Built with React, Vite, and Tailwind CSS, it provides an intuitive interface for browsing events, searching with advanced filters, and accessing detailed event information.

## ✨ Features

### 🎯 Core Functionality
- **Global Event Discovery**: Browse events from around the world
- **Advanced Search**: Filter by category, date, location, and keywords
- **Event Details**: Comprehensive event information with pricing and booking
- **Responsive Design**: Optimized for desktop, tablet, and mobile devices

### 🌙 Dark/Light Theme
- **Theme Switching**: Toggle between dark and light modes
- **Theme-Aware Logos**: Automatic logo adaptation based on theme
- **Smooth Transitions**: Elegant theme switching animations

### 🌍 Multi-Language Support
- **Bilingual Interface**: Turkish (TR) and English (EN)
- **Dynamic Content**: All text content adapts to selected language
- **Localized Dates**: Date formatting based on language preference

### 🔍 Advanced Search & Filtering
- **Smart Search**: Search across event titles, descriptions, venues, and categories
- **Category Filters**: Music, Sports, Art, Film, Technology, and more
- **Date Range Filtering**: Filter by today, this week, this month, or custom ranges
- **Sorting Options**: Sort by date, name, price, or rating

### 📱 User Experience
- **Modern UI**: Clean, intuitive interface with Tailwind CSS
- **Interactive Elements**: Hover effects, smooth animations, and responsive feedback
- **Accessibility**: Keyboard navigation and screen reader support
- **Performance**: Optimized loading and smooth interactions

## 🚀 Tech Stack

### Frontend
- **React 18**: Modern React with hooks and functional components
- **Vite**: Fast build tool and development server
- **Tailwind CSS**: Utility-first CSS framework
- **Lucide React**: Beautiful, customizable icons
- **React Router**: Client-side routing

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

### Deployment
- **Netlify**: Hosting and continuous deployment
- **GitHub**: Version control and collaboration

## 📦 Installation

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Setup Instructions

1. **Clone the repository**
   ```bash
   git clone https://github.com/fozlen/eventhubble.git
   cd eventhubble
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open in browser**
   Navigate to `http://localhost:5173`

### Build for Production
```bash
npm run build
```

## 🏗️ Project Structure

```
eventhubble/
├── app.html                # Main application entry point
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ui/             # Shadcn/ui components
│   │   ├── EventCard.jsx   # Event display component
│   │   └── ModernDropdowns.jsx
│   ├── pages/              # Page components
│   │   ├── HomePage.jsx    # Landing page
│   │   ├── SearchResultsPage.jsx
│   │   ├── EventDetailPage.jsx
│   │   ├── AboutPage.jsx
│   │   └── WorldNewsPage.jsx
│   ├── assets/             # Static assets
│   │   ├── eventhubble_light_transparent_logo.png
│   │   └── eventhubble_dark_transparent_logo.png
│   ├── hooks/              # Custom React hooks
│   ├── lib/                # Utility functions
│   └── services/           # API services
├── public/                 # Public assets and favicons
├── assets/                 # Design assets
│   └── logos/              # Logo files and guides
├── backend/                # Backend services
├── backups/                # Project backups
└── docs/                   # Documentation
```

## 🎨 Design System

### Color Palette
- **Primary Blue**: `#2563EB` - Main brand color
- **Dark Mode**: `#0F172A` - Background
- **Light Mode**: `#FFFFFF` - Background
- **Accent Colors**: Various semantic colors for different states

### Typography
- **Font Family**: System fonts with fallbacks
- **Headings**: Bold weights for hierarchy
- **Body Text**: Regular weight for readability

### Components
- **Cards**: Rounded corners with subtle shadows
- **Buttons**: Consistent styling with hover states
- **Forms**: Clean input fields with focus states
- **Navigation**: Responsive header and footer

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_URL=http://localhost:3001
VITE_APP_NAME=EventHubble
```

### Build Configuration
- **Development**: `npm run dev`
- **Production Build**: `npm run build`
- **Preview**: `npm run preview`
- **Linting**: `npm run lint`

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: 1024px and above
- **Tablet**: 768px - 1023px
- **Mobile**: 320px - 767px

## 🌐 Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### Development Guidelines
- Follow the existing code style
- Add tests for new features
- Update documentation as needed
- Ensure responsive design compatibility

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Icons**: [Lucide React](https://lucide.dev/)
- **UI Components**: [Shadcn/ui](https://ui.shadcn.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Build Tool**: [Vite](https://vitejs.dev/)

## 📞 Support

For support and questions:
- **Email**: support@eventhubble.com
- **Issues**: [GitHub Issues](https://github.com/fozlen/eventhubble/issues)
- **Documentation**: [Project Wiki](https://github.com/fozlen/eventhubble/wiki)

---

**EventHubble** - Discover Amazing Events Worldwide 🌍✨
