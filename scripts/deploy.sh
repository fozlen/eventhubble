#!/bin/bash

echo "🚀 EventHubble Production Deployment Script"
echo "=========================================="

# 1. Backend'i Render.com'a deploy et
echo "📦 Backend deployment başlatılıyor..."
cd backend

# Git'e commit ve push
git add .
git commit -m "Production deployment: $(date)"
git push origin main

echo "✅ Backend deployment tamamlandı!"

# 2. Frontend'i Netlify'a deploy et
echo "🌐 Frontend deployment başlatılıyor..."
cd ..

# Production build
npm run build

# Netlify deploy (eğer netlify-cli kuruluysa)
if command -v netlify &> /dev/null; then
    netlify deploy --prod --dir=dist
else
    echo "⚠️  Netlify CLI kurulu değil. Manuel deploy gerekli."
    echo "   Build dosyaları 'dist/' klasöründe hazır."
fi

echo "✅ Frontend deployment tamamlandı!"

echo "🎉 Deployment tamamlandı!"
echo "📊 API URL: https://eventhubble-api.onrender.com"
echo "🌐 CDN URL: https://cdn.eventhubble.com"
echo "🔗 Frontend URL: https://eventhubble.netlify.app" 