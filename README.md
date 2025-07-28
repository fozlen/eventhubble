# EventHubble 🎫

Turkey's smart event discovery platform - Konser, tiyatro, spor, sanat etkinliklerini keşfedin!

## 🚀 Production URLs

- **Frontend:** https://eventhubble.netlify.app
- **Backend API:** https://eventhubble.onrender.com
- **API Health:** https://eventhubble.onrender.com/health
- **API Status:** https://eventhubble.onrender.com/api/status

## 📁 Project Structure

```
EventHubble/
├── src/                    # Frontend source code
│   ├── components/         # React components
│   ├── pages/             # Page components
│   ├── services/          # API services
│   └── ...
├── backend/               # Backend API
│   ├── uploadServer.js    # Main server
│   ├── database.js        # MongoDB connection
│   └── package.json       # Backend dependencies
├── docs/                  # Documentation
│   ├── production-checklist.md
│   ├── database-setup.md
│   └── ...
├── scripts/               # Deployment scripts
│   └── deploy.sh
├── public/                # Static assets
├── dist/                  # Build output
└── package.json           # Frontend dependencies
```

## 🛠️ Development

### Frontend
```bash
npm install
npm run dev
```

### Backend
```bash
cd backend
npm install
npm start
```

## 🚀 Deployment

### Frontend (Netlify)
- Auto-deploy from `main` branch
- Environment variables configured in Netlify dashboard

### Backend (Render.com)
- Auto-deploy from `main` branch
- MongoDB Atlas database connection
- Health check: `/health`

## 📚 Documentation

- [Production Checklist](docs/production-checklist.md)
- [Database Setup](docs/database-setup.md)
- [Netlify Setup](docs/netlify-simple-setup.md)

## 🔧 Environment Variables

### Frontend (Netlify)
```
VITE_API_BASE_URL=https://eventhubble.onrender.com/api
VITE_APP_ENV=production
```

### Backend (Render.com)
```
NODE_ENV=production
PORT=10000
CORS_ORIGINS=https://eventhubble.netlify.app
MONGODB_URI=mongodb+srv://...
```

## 📊 API Endpoints

- `GET /health` - Health check
- `GET /api/status` - API status
- `GET /api/events` - Get events
- `POST /upload` - Image upload
- `GET /images/*` - Serve images

## 🎯 Features

- ✅ Event discovery platform
- ✅ Multi-language support (TR/EN)
- ✅ Image upload functionality
- ✅ Responsive design
- ✅ Production deployment
- ✅ MongoDB integration
- ✅ API documentation

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

---

**Built with ❤️ by EventHubble Team**
# Force rebuild for logo fix
