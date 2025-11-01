# Mini App Deployment Checklist

Use this checklist to ensure your mini app is properly deployed and integrated.

## Pre-Deployment

### Development Setup
- [ ] Node.js 18+ installed
- [ ] Dependencies installed (`npm install`)
- [ ] `.env` file configured with local API URL
- [ ] Dev server runs successfully (`npm run dev`)
- [ ] Backend API is running on `http://localhost:3000`
- [ ] All pages load without errors
- [ ] Navigation works correctly

### Testing Locally
- [ ] Tested in Chrome/Safari/Firefox
- [ ] Mobile responsive design works
- [ ] API calls return data successfully
- [ ] User context loads properly
- [ ] Error handling works
- [ ] All buttons and interactions work

## Backend Preparation

### API Server
- [ ] Backend is deployed and accessible
- [ ] HTTPS is enabled (required for production)
- [ ] API health endpoint responds: `/api/health`
- [ ] CORS is configured for mini app domain
- [ ] All required endpoints are working:
  - [ ] `GET /api/matches`
  - [ ] `GET /api/matches/:id`
  - [ ] `GET /api/matches/:id/contests`
  - [ ] `GET /api/user/profile`
  - [ ] `GET /api/user/wallet`
  - [ ] `GET /api/user/contests`
  - [ ] `GET /api/contests/:id`
  - [ ] `POST /api/contests/:id/enter`
  - [ ] `GET /api/contests/:id/leaderboard`

### Authentication
- [ ] Telegram WebApp auth middleware is working
- [ ] `BOT_TOKEN` is set correctly in backend
- [ ] InitData validation works
- [ ] Test auth with curl/Postman

## Build Process

### Production Build
- [ ] Run `npm run build` successfully
- [ ] No build errors or warnings
- [ ] Check `dist/` folder is created
- [ ] Verify files are minified
- [ ] Test production build locally (`npm run preview`)

### Environment Variables
- [ ] `VITE_API_URL` set to production API URL
- [ ] Remove or set `VITE_DEV_MODE=false`
- [ ] No sensitive data in environment variables
- [ ] Environment variables set on hosting platform

## Hosting Platform

### Choose Platform (check one)
- [ ] **Vercel** (Recommended - easiest)
- [ ] **Netlify**
- [ ] **GitHub Pages**
- [ ] **Self-hosted (Nginx)**
- [ ] **Other**: _________________

### Vercel Deployment
- [ ] Vercel CLI installed
- [ ] Project deployed (`vercel --prod`)
- [ ] Environment variables configured in dashboard
- [ ] Custom domain configured (optional)
- [ ] HTTPS is active (automatic)
- [ ] Build succeeds on Vercel

### Netlify Deployment
- [ ] Netlify CLI installed
- [ ] Project deployed (`netlify deploy --prod`)
- [ ] Environment variables set
- [ ] Build settings correct
- [ ] HTTPS is active (automatic)

### Self-Hosted (Nginx)
- [ ] SSL certificate installed
- [ ] Nginx configured correctly
- [ ] Static files served from correct path
- [ ] HTTPS working
- [ ] Domain pointing to server

## Mini App URL

### URL Verification
- [ ] Mini app URL is HTTPS (required by Telegram)
- [ ] URL is accessible from browser
- [ ] All assets load correctly
- [ ] No mixed content warnings
- [ ] API calls work from production URL

### Copy Your Mini App URL
```
https://_____________________________.com
```

## Telegram Bot Configuration

### Bot Father Setup
- [ ] Open @BotFather on Telegram
- [ ] Send `/mybots`
- [ ] Select your bot
- [ ] Go to "Bot Settings"
- [ ] Go to "Menu Button"
- [ ] Configure menu button
- [ ] Paste your mini app HTTPS URL
- [ ] Confirm the URL is saved

### Test Menu Button
- [ ] Open your bot in Telegram
- [ ] Click menu icon (bottom-left corner)
- [ ] Mini app opens correctly
- [ ] Authentication works
- [ ] User profile loads

## Backend CORS Update

### Update CORS Configuration
In `src/api/server.js`, update:

```javascript
app.use(cors({
  origin: [
    'https://your-production-mini-app-url.com',  // ← Add your URL here
    'http://localhost:5173', // Keep for local dev
  ],
  credentials: true,
}));
```

- [ ] Production URL added to CORS origins
- [ ] Backend redeployed with new CORS settings
- [ ] Test API calls from mini app work

## End-to-End Testing

### Desktop Testing (Telegram Desktop/Web)
- [ ] Open bot on Telegram Desktop
- [ ] Click menu button to open mini app
- [ ] Test all pages:
  - [ ] Home page loads
  - [ ] Matches page shows matches
  - [ ] Match details page works
  - [ ] Wallet page displays balance
  - [ ] Profile page shows user info
  - [ ] My Contests page works
- [ ] Test interactions:
  - [ ] Navigation between pages
  - [ ] Search functionality
  - [ ] Filter buttons
  - [ ] Join contest flow
  - [ ] Copy referral link

### Mobile Testing (Telegram Mobile App)
- [ ] Open bot on iOS/Android
- [ ] Click menu button
- [ ] Mini app loads and is responsive
- [ ] All pages work on mobile
- [ ] Touch interactions work
- [ ] Haptic feedback works
- [ ] Back button works
- [ ] Bottom navigation works
- [ ] Scrolling is smooth
- [ ] No layout issues

### Authentication Testing
- [ ] User profile loads automatically
- [ ] Balance displays correctly
- [ ] User-specific data shows
- [ ] Protected routes work
- [ ] Logout/re-entry works

### Contest Flow Testing
- [ ] Browse matches
- [ ] Open match details
- [ ] View available contests
- [ ] Join contest (if sufficient balance)
- [ ] Create team in team builder
- [ ] Select 11 players
- [ ] Choose captain and vice-captain
- [ ] Submit team successfully
- [ ] Verify entry in "My Contests"
- [ ] Check wallet balance deducted

### Real-Time Features
- [ ] Live match scores update
- [ ] Leaderboard refreshes
- [ ] Contest status changes
- [ ] Notifications work (if implemented)

## Performance Check

### Load Time
- [ ] Initial load < 3 seconds
- [ ] Page transitions smooth
- [ ] Images load quickly
- [ ] No lag in interactions

### Optimization
- [ ] Images compressed
- [ ] Code minified
- [ ] Gzip/Brotli compression enabled
- [ ] Cache headers configured
- [ ] CDN configured (if applicable)

## Monitoring & Analytics

### Error Tracking
- [ ] Sentry or error tracking configured (optional)
- [ ] Console errors monitored
- [ ] API error handling works
- [ ] User-friendly error messages

### Analytics
- [ ] Google Analytics configured (optional)
- [ ] User events tracked
- [ ] Page views logged

## Security Check

### Security Audit
- [ ] No sensitive data in client code
- [ ] API keys not exposed
- [ ] HTTPS enforced everywhere
- [ ] No XSS vulnerabilities
- [ ] CORS properly configured
- [ ] Input sanitization in place
- [ ] Rate limiting on backend

## Documentation

### Documentation Complete
- [ ] README.md updated
- [ ] API endpoints documented
- [ ] Setup instructions clear
- [ ] Troubleshooting guide available
- [ ] Environment variables documented

## Final Verification

### Pre-Launch Checklist
- [ ] All tests passed
- [ ] No console errors
- [ ] Mobile responsive
- [ ] Works on iOS
- [ ] Works on Android
- [ ] Works on desktop
- [ ] Backend stable
- [ ] Database backed up
- [ ] Monitoring in place

### Go Live
- [ ] Announce to users
- [ ] Monitor for issues
- [ ] Be ready for support requests
- [ ] Have rollback plan ready

## Post-Launch

### First 24 Hours
- [ ] Monitor error logs
- [ ] Check user feedback
- [ ] Watch server metrics
- [ ] Respond to issues quickly

### First Week
- [ ] Gather user feedback
- [ ] Fix critical bugs
- [ ] Monitor performance
- [ ] Plan improvements

### Ongoing
- [ ] Regular updates
- [ ] Security patches
- [ ] Feature enhancements
- [ ] User support

## Rollback Plan

### If Issues Occur
- [ ] Keep old version deployment ready
- [ ] Know how to revert CORS changes
- [ ] Have backup of database
- [ ] Can quickly update bot URL in @BotFather

### Emergency Contacts
- Backend developer: _________________
- Frontend developer: _________________
- DevOps: _________________

## Notes

```
Date deployed: __________________
Deployed by: ____________________
Production URL: _________________
API URL: ________________________
Version: ________________________

Issues encountered:




Resolutions:




```

---

**Status:**
- [ ] Not Started
- [ ] In Progress
- [ ] Testing
- [ ] **Deployed** ✅
- [ ] Issues Found

**Sign off:** _________________ Date: _________
