# Netlify Deployment Setup

Complete guide for deploying EventHubble frontend to Netlify with automatic deployments.

## 🚀 Quick Setup

### Step 1: Connect Repository
1. Go to [Netlify Dashboard](https://app.netlify.com/)
2. Click "New site from Git"
3. Choose GitHub and select `fozlen/eventhubble` repository
4. Configure build settings:
   ```
   Build command: npm run build
   Publish directory: dist
   ```

### Step 2: Environment Variables
Add these environment variables in Netlify dashboard:

```bash
NODE_VERSION=18
NODE_ENV=production
VITE_API_BASE_URL=https://eventhubble-api.onrender.com
```

### Step 3: Build Settings
Netlify automatically reads from `netlify.toml`:

```toml
[build]
  command = "npm run build"
  publish = "dist"

[build.environment]
  NODE_VERSION = "18"
  NODE_ENV = "production"
  VITE_API_BASE_URL = "https://eventhubble-api.onrender.com"
```

## 🔧 Advanced Configuration

### Branch Deployments
- **Production**: `main` branch → `https://eventhubble.netlify.app`
- **Preview**: Pull requests → `https://deploy-preview-{PR#}--eventhubble.netlify.app`

### Redirects & Headers
Configured in `netlify.toml`:

```toml
[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200

[[headers]]
  for = "/assets/*"
  [headers.values]
    Cache-Control = "public, max-age=31536000, immutable"
```

## 🛠️ Troubleshooting

### Build Fails
1. Check Node.js version: Must be 18+
2. Verify dependencies: `npm ci` locally
3. Check environment variables

### Deploy Preview Issues
- Ensure PR is from `main` branch
- Check build logs in Netlify dashboard
- Verify `netlify.toml` configuration

### Performance Optimization
- Enable asset optimization in Netlify dashboard
- Configure caching headers
- Use Netlify's built-in CDN

## 📊 Monitoring

- **Build logs**: Netlify dashboard → Site → Deploys
- **Performance**: Netlify analytics
- **Uptime**: Netlify status page

## 🔗 Useful Links

- [Netlify Dashboard](https://app.netlify.com/)
- [Build Settings](https://docs.netlify.com/configure-builds/overview/)
- [Environment Variables](https://docs.netlify.com/environment-variables/overview/) 