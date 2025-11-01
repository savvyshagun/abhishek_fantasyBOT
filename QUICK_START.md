# 🚀 Quick Start - Backend + Mini App

Get both the backend and mini app running with one command!

## Step 1: Get Telegram Bot Token

1. Open Telegram → search `@BotFather`
2. Send `/newbot`
3. Choose a name: `My Fantasy Bot`
4. Choose username: `YourFantasyBot` (must end with 'bot')
5. **Copy the token**

## Step 2: Get Your User ID

1. Search `@userinfobot` on Telegram
2. Send `/start`
3. **Copy your user ID** (a number like `123456789`)

## Step 3: Set up MongoDB Atlas (Free - No Credit Card!)

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up (free account)
3. Create a free cluster:
   - Choose **M0 FREE** tier
   - Select AWS, any region
   - Click "Create"
4. Set up database access:
   - Click "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `fantasy_admin`
   - Password: (Auto-generate and copy it!)
   - Click "Add User"
5. Set up network access:
   - Click "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for testing)
   - Click "Confirm"
6. Get connection string:
   - Click "Database" (left sidebar)
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://fantasy_admin:<password>@cluster0.xxxxx.mongodb.net`)
   - **Replace `<password>` with your actual password!**

## Step 4: Configure .env

Edit `.env` file:

```bash
# Your bot token from @BotFather
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Your user ID from @userinfobot
ADMIN_IDS=123456789

# MongoDB connection from Atlas (replace <password> with actual password!)
MONGODB_URI=mongodb+srv://fantasy_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/fantasy_cricket

# Optional - get from cricapi.com
SPORTS_API_KEY=

PORT=3000
NODE_ENV=development
```

## Step 5: Install All Dependencies

```bash
# Install backend dependencies
npm install

# Install mini app dependencies
cd mini-app
npm install
cd ..
```

## Step 6: Start Everything

### Option 1: Run Both Together (Recommended) 🎯

```bash
npm run dev:all
```

This single command starts:
- ✅ Backend API on `http://localhost:3000`
- ✅ Mini App on `http://localhost:5173`
- ✅ Telegram Bot (polling)
- ✅ MongoDB connection
- ✅ Cron jobs

You'll see colored output:
- **Cyan** = Backend logs
- **Magenta** = Mini App logs

### Option 2: Run Separately (2 Terminals)

**Terminal 1 - Backend:**
```bash
npm run dev
```

**Terminal 2 - Mini App:**
```bash
npm run mini-app
```

You should see:
```
[backend] ✅ MongoDB connected successfully
[backend] 📝 Registering bot commands...
[backend] ✅ Commands registered
[backend] 🤖 Fantasy Cricket Bot started successfully!
[backend] ✅ API Server running on port 3000
[mini-app] VITE v5.0.0  ready in 500 ms
[mini-app] ➜  Local:   http://localhost:5173/
```

## Step 7: Test Everything

### Test Backend
```bash
curl http://localhost:3000/api/health
# Should return: {"status":"ok",...}
```

### Test Mini App
Open browser: `http://localhost:5173`
- Should see Fantasy Cricket home page
- Navigation should work

### Test Telegram Bot
Open Telegram and find your bot:

1. Send `/start` - Should register you
2. Send `/wallet` - Should show $0 balance
3. Send `/refer` - Should show referral link
4. Send `/admin` - Should show admin panel (since you're admin)

## Step 8: Test Mini App in Telegram (Optional)

To test the mini app inside actual Telegram:

1. **Install ngrok:**
   ```bash
   brew install ngrok  # macOS
   ```

2. **Start ngrok:**
   ```bash
   ngrok http 5173
   ```

3. **Copy the HTTPS URL** (e.g., `https://abc123.ngrok.io`)

4. **Set in @BotFather:**
   - Send `/mybots` → Select your bot
   - Bot Settings → Menu Button
   - Paste ngrok URL

5. **Test:**
   - Open your bot
   - Click menu button (bottom-left)
   - Mini app opens inside Telegram!

## ✅ You're All Set!

### Test Admin Features:

```
/admin - Admin dashboard
/addmatch_TEST001_India_Pakistan_2025-12-15T14:00_Dubai
/listmatches
/createcontest_1_TestContest_10_1000_10
/matches
```

### Available npm Commands:

```bash
npm run dev:all     # Run both backend + mini app together
npm run dev         # Run backend only
npm run mini-app    # Run mini app only
npm start           # Run backend in production mode
npm run db:setup    # Setup database (first time)
```

## 🎯 MongoDB Atlas vs Local

**MongoDB Atlas (Recommended):**
✅ Free tier available
✅ No local installation
✅ Cloud hosted & managed
✅ Automatic backups
✅ Works from anywhere

**Why we switched from MySQL:**
- No need to install/configure local database
- Free cloud hosting
- Easier deployment
- Better for development

## 🐛 Troubleshooting

### "MongoServerError: bad auth"
- Check your password in MONGODB_URI
- Make sure you replaced `<password>` with actual password

### "Could not connect to any servers"
- Check network access in MongoDB Atlas
- Make sure "Allow Access from Anywhere" is enabled
- Check your connection string is correct

### Bot not responding
- Make sure bot token is correct
- Check bot is running: look for "Fantasy Cricket Bot started successfully!"
- Try stopping (Ctrl+C) and restarting

## 📚 Next Steps

1. Get Cricket API key from https://cricapi.com
2. Add API key to `.env` as `SPORTS_API_KEY`
3. Test real matches with `/syncmatches`
4. Invite friends to test referral system
5. Deploy to production (Render/Railway)

## 🎮 Available Commands

**User:**
- `/start` - Register
- `/matches` - View matches
- `/wallet` - Check balance
- `/refer` - Get referral link

**Admin:**
- `/admin` - Dashboard
- `/addmatch` - Add match
- `/createcontest` - Create contest
- `/viewusers` - User stats
- `/broadcast` - Send message to all

---

Need help? Check README.md or create an issue!
