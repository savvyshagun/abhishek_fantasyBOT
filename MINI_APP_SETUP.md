# Fantasy Cricket Mini App - Complete Setup Guide

This guide will help you set up and deploy the Telegram Mini App for the Fantasy Cricket Bot.

## Overview

The mini app provides a rich, mobile-first user interface for:
- Browsing cricket matches
- Creating fantasy teams
- Joining contests
- Managing wallet and transactions
- Tracking leaderboards
- Referral system

## Architecture

```
┌─────────────────┐
│  Telegram Bot   │
│  (Commands)     │
└────────┬────────┘
         │
         │ Opens Mini App
         │
┌────────▼────────┐      ┌──────────────┐
│   Mini App      │◄────►│  Backend API │
│  (React/Vite)   │ HTTP │ (Express.js) │
└─────────────────┘      └──────┬───────┘
                                 │
                          ┌──────▼──────┐
                          │  MongoDB    │
                          └─────────────┘
```

## Prerequisites

1. **Backend API must be running** (see main project setup)
2. **Node.js 18+** installed
3. **Telegram Bot** created via @BotFather
4. **Domain/Hosting** for production (HTTPS required)

## Local Development Setup

### Step 1: Install Dependencies

```bash
cd mini-app
npm install
```

### Step 2: Configure Environment

Create `.env` file:

```bash
cp .env.example .env
```

Edit `.env`:

```env
# Point to your local backend API
VITE_API_URL=http://localhost:3000/api

# Enable dev mode
VITE_DEV_MODE=true
```

### Step 3: Start Development Server

```bash
npm run dev
```

The app will run at `http://localhost:5173`

### Step 4: Test with Telegram (Using ngrok)

To test the mini app in Telegram during development:

1. **Install ngrok:**
   ```bash
   brew install ngrok  # macOS
   # or download from https://ngrok.com
   ```

2. **Start ngrok tunnel:**
   ```bash
   ngrok http 5173
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Set up in Telegram:**
   - Open @BotFather
   - Send `/mybots`
   - Select your bot
   - Click "Bot Settings" → "Menu Button"
   - Set the URL to your ngrok URL

5. **Test in Telegram:**
   - Open your bot in Telegram
   - Click the menu button (bottom left)
   - The mini app should open

## Production Deployment

### Option 1: Vercel (Recommended)

**Advantages:**
- Free tier available
- Automatic HTTPS
- Easy deployment
- Global CDN

**Steps:**

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Build and deploy:**
```bash
cd mini-app
npm run build
vercel --prod
```

3. **Set environment variables in Vercel:**
   - Go to your project on vercel.com
   - Settings → Environment Variables
   - Add: `VITE_API_URL` = `https://your-api-domain.com/api`

4. **Copy deployment URL** (e.g., `https://your-app.vercel.app`)

### Option 2: Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Deploy:**
```bash
cd mini-app
npm run build
netlify deploy --prod
```

3. **Set environment variables:**
   - Go to Netlify dashboard
   - Site settings → Environment variables
   - Add: `VITE_API_URL`

### Option 3: GitHub Pages

1. **Install gh-pages:**
```bash
npm install -D gh-pages
```

2. **Add to package.json:**
```json
{
  "scripts": {
    "deploy": "npm run build && gh-pages -d dist"
  }
}
```

3. **Deploy:**
```bash
npm run deploy
```

### Option 4: Self-Hosted (Nginx)

1. **Build the app:**
```bash
cd mini-app
npm run build
```

2. **Copy dist folder to server:**
```bash
scp -r dist/* user@your-server:/var/www/mini-app/
```

3. **Configure Nginx:**
```nginx
server {
    listen 443 ssl http2;
    server_name mini-app.yourdomain.com;

    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;

    root /var/www/mini-app;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }
}
```

4. **Reload Nginx:**
```bash
sudo nginx -t
sudo systemctl reload nginx
```

## Telegram Bot Configuration

### Set Mini App URL in Bot

1. **Open @BotFather** on Telegram

2. **Configure menu button:**
   ```
   /mybots
   → Select your bot
   → Bot Settings
   → Menu Button
   → Configure Menu Button
   → Send your mini app URL
   ```

3. **Test the menu button:**
   - Open your bot
   - Click the menu icon (bottom-left)
   - Mini app should open

### Alternative: Direct Link Method

You can also create a command that opens the mini app:

```javascript
// In your bot code (src/bot/commands/userCommands.js)
bot.command('app', (ctx) => {
  ctx.reply('Open the Mini App:', {
    reply_markup: {
      inline_keyboard: [[
        {
          text: '🏏 Open Fantasy Cricket',
          web_app: { url: 'https://your-mini-app-url.com' }
        }
      ]]
    }
  });
});
```

## Backend API Updates

Ensure your backend API supports the mini app:

### 1. Update CORS Configuration

Edit `src/api/server.js`:

```javascript
import cors from 'cors';

app.use(cors({
  origin: [
    'https://your-mini-app-url.com',
    'http://localhost:5173', // For development
  ],
  credentials: true,
}));
```

### 2. Verify Authentication Middleware

The mini app sends Telegram initData in the `x-telegram-init-data` header. Ensure `src/api/middleware/auth.js` validates this correctly.

### 3. Test API Endpoints

Make sure these endpoints are working:

```bash
# Health check
curl https://your-api.com/api/health

# Matches (public)
curl https://your-api.com/api/matches

# User profile (requires auth)
curl -H "x-telegram-init-data: YOUR_INIT_DATA" \
  https://your-api.com/api/user/profile
```

## Environment Variables Summary

### Mini App (.env)
```env
VITE_API_URL=https://your-api.com/api
```

### Backend API (.env)
```env
BOT_TOKEN=your_telegram_bot_token
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fantasy_cricket
SPORTS_API_KEY=your_cricket_api_key
PORT=3000
```

## Testing Checklist

- [ ] Backend API is running and accessible
- [ ] Mini app builds without errors (`npm run build`)
- [ ] Mini app connects to API successfully
- [ ] Telegram authentication works
- [ ] All pages load correctly
- [ ] Navigation works (bottom nav, back button)
- [ ] Match listing displays
- [ ] Contest joining works
- [ ] Wallet displays balance
- [ ] Profile shows user info
- [ ] Haptic feedback works on mobile
- [ ] Theme adapts to Telegram (light/dark)

## Troubleshooting

### Issue: Mini App Won't Load in Telegram

**Solutions:**
- Ensure URL is HTTPS (required by Telegram)
- Check bot settings in @BotFather
- Verify the URL is accessible from browser
- Clear Telegram cache (Settings → Data and Storage → Clear Cache)

### Issue: API Connection Failed

**Solutions:**
- Check VITE_API_URL in environment variables
- Verify backend API is running
- Check CORS configuration on backend
- Test API endpoints with curl/Postman

### Issue: Authentication Errors

**Solutions:**
- Ensure BOT_TOKEN is correct in backend
- Check auth middleware is working
- Test from actual Telegram client (not browser)
- Verify initData is being sent correctly

### Issue: Build Errors

**Solutions:**
- Delete node_modules and reinstall: `rm -rf node_modules && npm install`
- Clear build cache: `rm -rf dist .vite`
- Check Node.js version: `node --version` (should be 18+)

### Issue: Styles Not Working

**Solutions:**
- Ensure Tailwind CSS is configured
- Check index.css imports
- Verify PostCSS is processing correctly
- Build and test production version

## Performance Optimization

### 1. Enable Compression

Add to `vite.config.js`:

```javascript
import compression from 'vite-plugin-compression';

export default defineConfig({
  plugins: [
    react(),
    compression(),
  ],
});
```

### 2. Optimize Images

- Use WebP format
- Compress images before adding to project
- Use lazy loading for images

### 3. Code Splitting

Already configured in `vite.config.js`:

```javascript
build: {
  rollupOptions: {
    output: {
      manualChunks: {
        vendor: ['react', 'react-dom', 'react-router-dom'],
        telegram: ['@twa-dev/sdk'],
      },
    },
  },
},
```

### 4. Enable Caching

Configure cache headers on your hosting platform:

**Vercel (vercel.json):**
```json
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        {
          "key": "Cache-Control",
          "value": "public, max-age=31536000, immutable"
        }
      ]
    }
  ]
}
```

## Monitoring and Analytics

### Add Error Tracking

Consider adding Sentry:

```bash
npm install @sentry/react
```

```javascript
// In src/main.jsx
import * as Sentry from "@sentry/react";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  environment: import.meta.env.MODE,
});
```

### Add Analytics

Add Google Analytics or similar:

```html
<!-- In index.html -->
<script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
```

## Security Best Practices

1. **Never expose sensitive data** in the mini app
2. **Always validate on backend** - mini app can be manipulated
3. **Use HTTPS** for all production deployments
4. **Validate Telegram initData** on every API request
5. **Set proper CORS** to restrict origins
6. **Rate limit** API endpoints
7. **Sanitize user input** before display

## Maintenance

### Regular Updates

```bash
# Check for outdated packages
npm outdated

# Update dependencies
npm update

# Update React and Vite to latest
npm install react@latest react-dom@latest vite@latest
```

### Monitoring

- Check Telegram bot analytics
- Monitor API response times
- Track user engagement
- Watch for errors in console

## Next Steps

After successful deployment:

1. Test thoroughly in Telegram on multiple devices
2. Gather user feedback
3. Monitor error logs
4. Plan feature enhancements
5. Optimize based on usage patterns

## Support

For issues:
- Check this documentation
- Review backend API logs
- Test API endpoints directly
- Check Telegram bot logs
- Contact development team

## Additional Resources

- [Telegram Mini Apps Documentation](https://core.telegram.org/bots/webapps)
- [React Documentation](https://react.dev)
- [Vite Documentation](https://vitejs.dev)
- [Tailwind CSS Documentation](https://tailwindcss.com)
- [Vercel Deployment Guide](https://vercel.com/docs)

---

**Last Updated:** 2025-01-01
**Version:** 1.0.0
