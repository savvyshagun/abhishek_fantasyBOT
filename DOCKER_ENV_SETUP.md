# Docker Environment Setup

## 📝 Single .env File for Both Services

In Docker, both the **backend** and **mini app** share one `.env` file.

## 🚀 Quick Setup

### 1. Create .env File

```bash
cp .env.docker.example .env
```

### 2. Configure Required Variables

Edit `.env` and set these **required** values:

```env
# Get from @BotFather on Telegram
BOT_TOKEN=123456789:ABCdefGHIjklMNOpqrsTUVwxyz

# Your deployment URL (or localhost for testing)
MINI_APP_URL=http://localhost:3019

# Get from @userinfobot on Telegram
ADMIN_IDS=123456789

# MongoDB Atlas connection (free tier available)
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/fantasy_cricket

# Get from https://cricapi.com (100 free requests/day)
SPORTS_API_KEY=your_api_key_here
```

### 3. Run Docker

```bash
docker-compose up -d
```

## 📋 Complete .env Format

```env
# ============ REQUIRED ============

# Telegram Bot
BOT_TOKEN=your_bot_token
MINI_APP_URL=http://localhost:3019
ADMIN_IDS=123456789

# Database
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/fantasy_cricket

# Cricket API
SPORTS_API_KEY=your_api_key
SPORTS_API_URL=https://api.cricapi.com/v1

# Server
PORT=3000
NODE_ENV=production

# ============ OPTIONAL ============

# Cricket Data API (alternative)
CRICKET_API_EMAIL=your_email@example.com
CRICKET_API_PASSWORD=your_password

# Payment gateways (future)
TRANSAK_API_KEY=
BINANCE_PAY_API_KEY=
```

## 🎯 How It Works

### Development (npm run dev:all)
```
Backend:  Uses root .env
Mini App: Uses mini-app/.env
```

### Docker (docker-compose up)
```
Both services use root .env
Mini app ignores mini-app/.env during build
```

## 🌐 Environment-Specific URLs

### Local Development
```env
MINI_APP_URL=http://localhost:3019
```

### Production (Custom Domain)
```env
MINI_APP_URL=https://bot.yourdomain.com
```

### Production (Direct IP)
```env
MINI_APP_URL=http://your-server-ip:3019
```

## 🔍 Variable Purposes

### BOT_TOKEN
- Used by backend to connect to Telegram
- Get from [@BotFather](https://t.me/botfather)

### MINI_APP_URL
- Used by bot to create "Open Mini App" buttons
- Must match where mini app is accessible
- In Docker: Same domain/IP that serves port 3019

### ADMIN_IDS
- Comma-separated Telegram user IDs
- Grants access to admin commands
- Get your ID from [@userinfobot](https://t.me/userinfobot)

### MONGODB_URI
- Connection string for MongoDB
- Can be local or MongoDB Atlas
- Both services connect to same database

### PORT
- Backend API port (internal)
- Always 3000 in Docker
- Not exposed externally

## ✅ Validation

After creating .env, validate it:

```bash
# Check if file exists
ls -la .env

# View contents (hide sensitive data)
cat .env | grep -v "TOKEN\|PASSWORD\|KEY" || true

# Test with Docker
docker-compose config
```

## 🐛 Common Issues

### Issue: Bot doesn't start
```bash
# Check BOT_TOKEN is set
docker-compose logs | grep "BOT_TOKEN"
```

### Issue: Mini app can't connect to API
```bash
# API is proxied through nginx, check nginx logs
docker-compose logs | grep "nginx"
```

### Issue: MongoDB connection failed
```bash
# Verify MONGODB_URI format
docker-compose logs | grep "MongoDB"
```

## 📚 Examples

### Example 1: Local Testing
```env
BOT_TOKEN=123456789:ABC...
MINI_APP_URL=http://localhost:3019
ADMIN_IDS=123456789
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
SPORTS_API_KEY=abc123
PORT=3000
NODE_ENV=production
```

### Example 2: Production Server
```env
BOT_TOKEN=123456789:ABC...
MINI_APP_URL=https://cricket.yourdomain.com
ADMIN_IDS=123456789,987654321
MONGODB_URI=mongodb+srv://prod:pass@prod-cluster.mongodb.net/fantasy
SPORTS_API_KEY=xyz789
PORT=3000
NODE_ENV=production
```

### Example 3: VPS with IP
```env
BOT_TOKEN=123456789:ABC...
MINI_APP_URL=http://165.232.123.45:3019
ADMIN_IDS=123456789
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
SPORTS_API_KEY=abc123
PORT=3000
NODE_ENV=production
```

## 🎯 Pro Tips

1. **Never commit .env to git** - It contains secrets
2. **Use MongoDB Atlas** - Free tier, no installation needed
3. **Test locally first** - Use localhost URL
4. **Multiple admins** - Comma-separate IDs: `123,456,789`
5. **Production URL** - Update MINI_APP_URL before deploy

## 🔐 Security

- Keep .env file secure
- Don't share BOT_TOKEN
- Use strong MongoDB passwords
- Rotate API keys regularly
- Use environment-specific .env files

## ✅ Checklist

Before running `docker-compose up`:

- [ ] `.env` file created
- [ ] `BOT_TOKEN` set
- [ ] `MINI_APP_URL` matches deployment
- [ ] `ADMIN_IDS` configured
- [ ] `MONGODB_URI` valid
- [ ] `SPORTS_API_KEY` obtained
- [ ] All values have no quotes around them
- [ ] No spaces before/after `=` signs

Ready to start! 🚀

```bash
docker-compose up -d
```
