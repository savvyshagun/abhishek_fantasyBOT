# Fantasy Cricket Bot - Complete Setup Guide

This guide will walk you through setting up and deploying your Fantasy Cricket Telegram Bot.

## Table of Contents
1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Telegram Bot Configuration](#telegram-bot-configuration)
4. [Database Setup](#database-setup)
5. [API Configuration](#api-configuration)
6. [Testing](#testing)
7. [Production Deployment](#production-deployment)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before you begin, ensure you have:

- **Node.js 18+** installed
- **MySQL 8.0+** database server
- **Telegram account** to create a bot
- **Cricket API key** (CricAPI, SportsData.io, or similar)
- **Git** for version control

## Local Development Setup

### Step 1: Clone and Install

```bash
# Clone the repository
git clone <your-repo-url>
cd fantasy-cricket-bot

# Install dependencies
npm install
```

### Step 2: Environment Configuration

Create a `.env` file from the example:

```bash
cp .env.example .env
```

Edit `.env` with your configuration:

```env
# Telegram Bot Configuration
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
MINI_APP_URL=https://your-mini-app.com

# Admin User IDs (Get from @userinfobot on Telegram)
ADMIN_IDS=123456789,987654321

# Database Configuration
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=yourStrongPassword123
DB_NAME=fantasy_cricket
DB_PORT=3306

# Sports Data API
SPORTS_API_KEY=your_cricapi_key_here
SPORTS_API_URL=https://api.cricapi.com/v1

# Payment Configuration (Optional - for future integration)
TRANSAK_API_KEY=your_transak_key
BINANCE_PAY_API_KEY=your_binance_key

# Server Configuration
PORT=3000
NODE_ENV=development
```

## Telegram Bot Configuration

### Step 1: Create a Bot

1. Open Telegram and search for [@BotFather](https://t.me/botfather)
2. Send `/newbot` command
3. Follow the prompts:
   - Choose a name (e.g., "Fantasy11 Cricket")
   - Choose a username (e.g., "Fantasy11Bot")
4. Copy the bot token provided
5. Paste it in your `.env` file as `BOT_TOKEN`

### Step 2: Configure Bot Settings

Send these commands to @BotFather:

```
/setdescription - Set bot description
/setabouttext - Set about text
/setuserpic - Upload bot profile picture
/setcommands - Set command list
```

**Recommended Commands List:**
```
start - Start using the bot
matches - View upcoming matches
join - Join a contest
mycontests - Your active contests
wallet - Manage your wallet
refer - Get referral link
leaderboard - View rankings
help - Get help
```

### Step 3: Get Your User ID

1. Search for [@userinfobot](https://t.me/userinfobot) on Telegram
2. Start the bot
3. Copy your user ID
4. Add it to `ADMIN_IDS` in `.env`

## Database Setup

### Option 1: Local MySQL

**Install MySQL:**

```bash
# macOS
brew install mysql
brew services start mysql

# Ubuntu/Debian
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql

# Windows
# Download from: https://dev.mysql.com/downloads/installer/
```

**Create Database:**

```bash
mysql -u root -p
```

```sql
CREATE DATABASE fantasy_cricket;
CREATE USER 'fantasy_user'@'localhost' IDENTIFIED BY 'yourStrongPassword';
GRANT ALL PRIVILEGES ON fantasy_cricket.* TO 'fantasy_user'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

**Setup Tables:**

```bash
npm run db:setup
```

### Option 2: Docker MySQL

```bash
docker run -d \
  --name fantasy-mysql \
  -e MYSQL_ROOT_PASSWORD=yourPassword \
  -e MYSQL_DATABASE=fantasy_cricket \
  -p 3306:3306 \
  mysql:8.0
```

Wait 30 seconds, then:

```bash
npm run db:setup
```

### Option 3: Cloud Database

**Planetscale (Free tier available):**

1. Sign up at [planetscale.com](https://planetscale.com)
2. Create new database
3. Get connection string
4. Update `.env` with connection details

**Railway MySQL:**

1. Sign up at [railway.app](https://railway.app)
2. New Project → Add MySQL
3. Copy connection details
4. Update `.env`

## API Configuration

### CricAPI Setup

1. Sign up at [cricapi.com](https://cricapi.com)
2. Get API key from dashboard
3. Add to `.env` as `SPORTS_API_KEY`

**Free tier limits:**
- 100 requests/day
- Basic match data

**Paid tiers:**
- Unlimited requests
- Live scores
- Player stats

### Alternative: SportsData.io

1. Sign up at [sportsdata.io](https://sportsdata.io)
2. Subscribe to Cricket API
3. Update API endpoints in `src/services/sportsApi.js`

## Testing

### Test Database Connection

```bash
node -e "require('./src/database/connection.js').query('SELECT 1').then(() => console.log('✅ Connected')).catch(e => console.error('❌', e))"
```

### Test Bot

```bash
# Start bot in development mode
npm run dev
```

**Test these commands in Telegram:**

1. `/start` - Should register you
2. `/wallet` - Should show $0 balance
3. `/refer` - Should show referral link
4. `/matches` - Should show matches (if API configured)

### Test Admin Commands

```bash
# Make sure your user ID is in ADMIN_IDS
/admin - Should show admin panel
/syncmatches - Should fetch matches from API
```

## Production Deployment

### Option 1: Render

**Deploy Steps:**

1. Push code to GitHub
2. Sign up at [render.com](https://render.com)
3. Click "New +" → "Web Service"
4. Connect GitHub repository
5. Configure:
   - **Name:** fantasy-cricket-bot
   - **Environment:** Node
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
6. Add environment variables from `.env`
7. Click "Create Web Service"

**Add MySQL:**

1. Click "New +" → "PostgreSQL" or use external MySQL
2. For MySQL: Use external service like Planetscale
3. Update database env vars

### Option 2: Railway

**Deploy Steps:**

1. Push code to GitHub
2. Sign up at [railway.app](https://railway.app)
3. New Project → Deploy from GitHub
4. Select repository
5. Add MySQL service
6. Add environment variables
7. Deploy

**Advantages:**
- Free $5/month credit
- Automatic deployments
- Built-in MySQL option

### Option 3: DigitalOcean VPS

**Setup Steps:**

```bash
# 1. Create Droplet (Ubuntu 22.04)
# 2. SSH into server
ssh root@your_server_ip

# 3. Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# 4. Install MySQL
sudo apt install mysql-server
sudo mysql_secure_installation

# 5. Clone repository
git clone <your-repo-url>
cd fantasy-cricket-bot

# 6. Install dependencies
npm install

# 7. Setup environment
cp .env.example .env
nano .env  # Edit configuration

# 8. Setup database
npm run db:setup

# 9. Install PM2 for process management
sudo npm install -g pm2

# 10. Start bot
pm2 start src/index.js --name fantasy-bot
pm2 save
pm2 startup
```

### Option 4: Docker Deployment

**Using Docker Compose:**

```bash
# 1. Configure .env file
cp .env.example .env
nano .env

# 2. Build and start
docker-compose up -d

# 3. Check logs
docker-compose logs -f

# 4. Setup database (first time only)
docker-compose exec bot npm run db:setup
```

**Manual Docker:**

```bash
# Build image
docker build -t fantasy-bot .

# Run MySQL
docker run -d --name mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=fantasy_cricket \
  mysql:8.0

# Run bot
docker run -d --name bot \
  --link mysql:mysql \
  --env-file .env \
  fantasy-bot
```

## Production Checklist

- [ ] Set `NODE_ENV=production` in `.env`
- [ ] Use strong database passwords
- [ ] Configure SSL for database connections
- [ ] Set up monitoring (PM2, Datadog, etc.)
- [ ] Configure error logging (Sentry, LogRocket)
- [ ] Set up backups for database
- [ ] Enable HTTPS for webhooks (if using)
- [ ] Test all commands thoroughly
- [ ] Configure API rate limits
- [ ] Set up admin notifications
- [ ] Document wallet addresses for payments

## Monitoring & Maintenance

### Health Checks

```bash
# Check bot status
pm2 status

# View logs
pm2 logs fantasy-bot

# Monitor resources
pm2 monit
```

### Database Backups

```bash
# Create backup
mysqldump -u root -p fantasy_cricket > backup_$(date +%Y%m%d).sql

# Restore backup
mysql -u root -p fantasy_cricket < backup_20251013.sql
```

### Automated Backups (Cron)

```bash
# Add to crontab
crontab -e

# Daily backup at 2 AM
0 2 * * * mysqldump -u root -pYourPassword fantasy_cricket > /backups/fantasy_$(date +\%Y\%m\%d).sql
```

## Troubleshooting

### Bot Not Responding

**Check logs:**
```bash
pm2 logs fantasy-bot
# or
docker logs fantasy-cricket-bot
```

**Common issues:**
- Invalid bot token
- Network/firewall blocking Telegram API
- Bot process crashed

**Solution:**
```bash
# Restart bot
pm2 restart fantasy-bot
# or
docker-compose restart bot
```

### Database Connection Failed

**Check MySQL status:**
```bash
sudo systemctl status mysql
# or
docker ps | grep mysql
```

**Test connection:**
```bash
mysql -h localhost -u root -p fantasy_cricket
```

**Common issues:**
- Wrong credentials in `.env`
- MySQL not running
- Firewall blocking port 3306

### API Rate Limit Exceeded

**Symptoms:**
- No matches loading
- "429 Too Many Requests" in logs

**Solutions:**
- Upgrade API plan
- Reduce sync frequency in cron jobs
- Cache API responses

### Cron Jobs Not Running

**Check:**
```bash
# View logs for cron execution
pm2 logs fantasy-bot | grep "Running"
```

**Common issues:**
- Timezone misconfig
- Bot process restarted during cron
- API failures

### Deployment Failures

**Render/Railway:**
- Check build logs
- Verify all env vars are set
- Ensure database is accessible

**Docker:**
```bash
# Check container logs
docker logs fantasy-cricket-bot

# Restart container
docker-compose restart
```

## Performance Optimization

### Database Indexing

Already included in schema:
- User lookups by telegram_id
- Match queries by status and date
- Transaction history by user_id

### Caching (Optional)

Add Redis for caching API responses:

```bash
npm install redis
```

Update `sportsApi.js` to cache match data for 5 minutes.

### Load Balancing

For high traffic:
- Run multiple bot instances
- Use Telegram webhooks instead of polling
- Implement queue system for transactions

## Security Best Practices

1. **Never commit `.env` file**
2. **Use environment variables for secrets**
3. **Validate user input**
4. **Implement rate limiting**
5. **Regular security updates:** `npm audit fix`
6. **Backup database regularly**
7. **Monitor for suspicious activity**
8. **Use HTTPS for webhooks**

## Getting Help

- **Documentation:** Check README.md
- **Issues:** Create GitHub issue
- **Telegram:** Join support group
- **Email:** your-email@example.com

## Next Steps

After deployment:

1. ✅ Test all user commands
2. ✅ Test admin commands
3. ✅ Verify wallet operations
4. ✅ Check cron jobs are running
5. ✅ Monitor for 24 hours
6. ✅ Create first contest
7. ✅ Invite beta users
8. ✅ Launch marketing campaign

---

**Need help?** Create an issue or contact support.

Good luck with your Fantasy Cricket Bot! 🏏🎉
