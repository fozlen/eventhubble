# EventHubble Backend

EventHubble backend services including event scraping and image upload functionality.

## Services

### 1. Event Scraper (`scraper.js`)
Automatically scrapes events from various platforms:
- Biletix
- Biletinial
- Mobilet

### 2. Upload Server (`uploadServer.js`)
Handles image uploads for the admin panel:
- Supports PNG, JPG, GIF files
- 5MB file size limit
- Unique filename generation
- CORS enabled for frontend integration

## Setup

### Local Development

1. Install dependencies:
```bash
npm install
```

2. Start the upload server:
```bash
npm run upload-server
```

3. Start the scraper:
```bash
npm run scrape
```

### Environment Variables

- `PORT`: Server port (default: 3001)
- `NODE_ENV`: Environment (development/production)

## API Endpoints

### Upload Server

- `GET /health` - Health check
- `POST /upload` - Image upload
- `GET /images/:filename` - Serve uploaded images

### Upload Request Format

```javascript
const formData = new FormData()
formData.append('image', file)

fetch('/upload', {
  method: 'POST',
  body: formData
})
```

### Upload Response Format

```javascript
{
  "success": true,
  "message": "Image uploaded successfully",
  "data": {
    "fileName": "uploaded_1234567890_image.jpg",
    "originalName": "image.jpg",
    "fileSize": 123456,
    "mimeType": "image/jpeg",
    "cdnUrl": "https://cdn.eventhubble.com/images/uploaded_1234567890_image.jpg",
    "localPath": "/path/to/file"
  }
}
```

## Deployment

### Render.com

1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm run upload-server`
4. Add environment variables:
   - `NODE_ENV=production`
   - `PORT=3001`

## File Structure

```
backend/
├── scraper.js          # Event scraping service
├── scheduler.js        # Cron job scheduler
├── uploadServer.js     # Image upload server
├── package.json        # Dependencies
└── uploads/           # Uploaded images directory
```

## CORS Configuration

The upload server is configured to accept requests from:
- `http://localhost:5173` (Vite dev server)
- `http://localhost:3000` (React dev server)
- `https://eventhubble.netlify.app` (Production frontend) 