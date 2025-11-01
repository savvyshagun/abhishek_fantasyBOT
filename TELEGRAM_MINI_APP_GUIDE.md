# Telegram Mini App Integration Guide

Complete guide to integrating your mini app with Telegram bot.

## What You Get

Users can open your mini app in **3 ways**:

1. **Menu Button** (bottom-left of chat)
2. **`/app` command** (shows a button)
3. **Inline button** on `/start` message

All methods open the mini app inside Telegram with automatic authentication!

## Setup Instructions

### Step 1: Configure Environment Variable

Add your mini app URL to `.env`:

**For Development (with ngrok):**
```env
MINI_APP_URL=https://abc123.ngrok.io
```

**For Production:**
```env
MINI_APP_URL=https://your-mini-app.vercel.app
```

### Step 2: Set Menu Button in @BotFather

This adds the menu button (⚡ icon) at the bottom-left of the chat:

1. Open **@BotFather** on Telegram
2. Send `/mybots`
3. Select your bot
4. Click **Bot Settings**
5. Click **Menu Button**
6. Click **Configure Menu Button**
7. Send your mini app URL (same as `MINI_APP_URL`)
8. Done! Menu button is now active

### Step 3: Test the Integration

Now users have **3 ways** to open your mini app:

#### Method 1: Menu Button (Bottom-left)
```
Open your bot → Look for ⚡ menu button → Click it → Mini app opens
```

#### Method 2: /app Command
```
Send: /app
→ Bot replies with message and button
→ Click "🚀 Open Mini App" button
→ Mini app opens
```

#### Method 3: /start Button
```
Send: /start
→ Bot shows welcome message
→ Click "🚀 Open Mini App" button
→ Mini app opens
```

## Development Setup

### Using ngrok for Local Testing

Since Telegram requires HTTPS, use ngrok to test locally:

```bash
# Terminal 1: Start your apps
npm run dev:all

# Terminal 2: Start ngrok
ngrok http 3019

# Copy the HTTPS URL (e.g., https://abc123.ngrok.io)
```

**Update your .env:**
```env
MINI_APP_URL=https://abc123.ngrok.io
```

**Set in @BotFather menu button:**
- Paste the same ngrok URL

**Restart your bot:**
```bash
# Stop with Ctrl+C
npm run dev:all
```

Now test in Telegram:
1. Open your bot
2. Click menu button OR send `/app`
3. Mini app opens with your local development server!

## Production Deployment

### Step 1: Deploy Mini App

**Option A: Vercel (Recommended)**
```bash
cd mini-app
vercel --prod
# Note your URL: https://your-app.vercel.app
```

**Option B: Netlify**
```bash
cd mini-app
netlify deploy --prod
# Note your URL: https://your-app.netlify.app
```

### Step 2: Update Backend Environment

```env
MINI_APP_URL=https://your-app.vercel.app
```

### Step 3: Update @BotFather

Set the same production URL in @BotFather menu button.

### Step 4: Deploy Backend

Deploy to Render, Railway, etc. with updated environment variables.

### Step 5: Test

1. Open your bot on Telegram
2. Click menu button or send `/app`
3. Mini app opens from production URL!

## How It Works

### 1. Authentication Flow

```
User clicks "Open Mini App"
      ↓
Telegram opens mini app URL with initData
      ↓
Mini app reads: window.Telegram.WebApp.initData
      ↓
Contains: user ID, username, first name, etc.
      ↓
Mini app sends initData in API header
      ↓
Backend validates with bot token
      ↓
User authenticated automatically!
```

### 2. Code Implementation

**Button in Bot (already done):**
```javascript
const keyboard = {
  inline_keyboard: [
    [
      {
        text: '🚀 Open Mini App',
        web_app: { url: process.env.MINI_APP_URL }
      }
    ]
  ]
};
```

**Mini App Auto-Auth (already done):**
```javascript
// src/context/TelegramContext.jsx
const tg = window.Telegram?.WebApp;
setUser(tg.initDataUnsafe?.user);
```

**API Authentication (already done):**
```javascript
// src/services/api.js
config.headers['x-telegram-init-data'] = tg.initData;
```

## User Experience

### On Mobile (Telegram iOS/Android)

```
1. User opens bot
2. Sees menu button (⚡) at bottom
3. Taps menu button
4. Mini app opens full-screen
5. Looks like native app
6. Swipe down to close or use back button
```

### On Desktop (Telegram Desktop/Web)

```
1. User opens bot
2. Sees menu button or /app command
3. Clicks button
4. Mini app opens in modal window
5. Click X to close
```

## Features Available in Mini App

When opened via Telegram:

✅ **Automatic login** - No username/password
✅ **User profile** - Name, photo, username
✅ **Theme integration** - Auto light/dark mode
✅ **Haptic feedback** - Vibrations on tap (mobile)
✅ **Back button** - Native Telegram back button
✅ **Close confirmation** - "Are you sure?" when closing
✅ **Share functionality** - Share to Telegram chats
✅ **Biometric auth** - (if implemented)

## Testing Checklist

Before going live:

- [ ] Mini app URL is HTTPS
- [ ] `MINI_APP_URL` set in backend `.env`
- [ ] Menu button configured in @BotFather
- [ ] Backend is restarted with new env variable
- [ ] Mini app CORS allows backend domain
- [ ] Test `/start` button
- [ ] Test `/app` command
- [ ] Test menu button
- [ ] Test on mobile device
- [ ] Test on desktop
- [ ] Authentication works
- [ ] API calls succeed
- [ ] All pages load correctly

## Troubleshooting

### Issue: Mini App Button Shows But Doesn't Open

**Solution:**
- Check `MINI_APP_URL` is set in `.env`
- Restart backend: `npm run dev:all`
- URL must be HTTPS (use ngrok for local dev)

### Issue: Mini App Opens But Shows "Not Authorized"

**Solution:**
- Check `BOT_TOKEN` matches in backend `.env`
- Verify CORS is enabled in backend
- Check mini app `.env` has correct `VITE_API_URL`

### Issue: Menu Button Not Appearing

**Solution:**
- Open @BotFather
- Check menu button is configured
- Try sending `/start` to refresh bot
- Restart Telegram app

### Issue: ngrok URL Changes Every Restart

**Solutions:**
1. Get ngrok Pro (static URLs)
2. Use localtunnel: `npx localtunnel --port 3019`
3. Use serveo: `ssh -R 80:localhost:3019 serveo.net`

## Environment Variables Summary

### Backend (.env)
```env
BOT_TOKEN=your_bot_token
MINI_APP_URL=https://your-mini-app-url.com  # ← Add this
MONGODB_URI=mongodb://localhost:27017/fantasy_cricket
PORT=3000
```

### Mini App (mini-app/.env)
```env
VITE_API_URL=http://localhost:3000/api      # Development
# VITE_API_URL=https://api.yourapp.com/api # Production
```

## Commands Overview

| Command | Description | Opens Mini App |
|---------|-------------|----------------|
| `/start` | Welcome message with mini app button | ✅ |
| `/app` | Dedicated command to open mini app | ✅ |
| Menu button | Bottom-left icon in chat | ✅ |
| `/help` | Shows command list including `/app` | ❌ |

## Advanced: Custom Start Parameters

You can pass data when opening mini app:

```javascript
const keyboard = {
  inline_keyboard: [[{
    text: '🚀 Open Contest',
    web_app: {
      url: `${process.env.MINI_APP_URL}?contestId=123`
    }
  }]]
};
```

Mini app receives it:
```javascript
const params = new URLSearchParams(window.location.search);
const contestId = params.get('contestId');
```

## Next Steps

1. ✅ Set `MINI_APP_URL` in `.env`
2. ✅ Configure menu button in @BotFather
3. ✅ Restart bot
4. ✅ Test with `/start` and `/app`
5. ✅ Deploy to production
6. ✅ Update URLs for production
7. ✅ Test with real users!

---

**Need help?** Check [MINI_APP_SETUP.md](./MINI_APP_SETUP.md) for full deployment guide.
