# Quick Test Guide

## Step 1: Get Telegram Bot Token

1. Open Telegram and search for `@BotFather`
2. Send `/newbot`
3. Choose a name: `My Fantasy Cricket Bot` (or anything)
4. Choose username: `YourFantasyBot` (must end with 'bot')
5. Copy the token (looks like: `1234567890:ABCdefGHIjklMNOpqrsTUVwxyz`)

## Step 2: Get Your User ID (to be admin)

1. Search for `@userinfobot` on Telegram
2. Send `/start`
3. Copy your user ID (a number like: `123456789`)

## Step 3: Configure Environment

Create `.env` file:
```bash
BOT_TOKEN=paste_your_bot_token_here
ADMIN_IDS=paste_your_user_id_here

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=fantasy_cricket
DB_PORT=3306

SPORTS_API_KEY=optional_for_now
SPORTS_API_URL=https://api.cricapi.com/v1
```

## Step 4: Setup Database (Choose One)

### Option A: Use Docker (Easiest)
```bash
# Start MySQL in Docker
docker run -d \
  --name fantasy-mysql \
  -e MYSQL_ROOT_PASSWORD=password \
  -e MYSQL_DATABASE=fantasy_cricket \
  -e MYSQL_ALLOW_EMPTY_PASSWORD=yes \
  -p 3306:3306 \
  mysql:8.0

# Wait 30 seconds for MySQL to start
sleep 30

# Setup tables
npm run db:setup
```

### Option B: Use Local MySQL
```bash
# If you have MySQL installed
mysql -u root -p

# In MySQL console:
CREATE DATABASE fantasy_cricket;
EXIT;

# Then run setup
npm run db:setup
```

### Option C: Skip Database for Quick Test
Update `.env`:
```
# Comment out DB lines temporarily
# DB_HOST=localhost
```

(Some features won't work without DB, but you can test bot basics)

## Step 5: Start the Bot

```bash
npm start
```

You should see:
```
✅ Database connection pool created
📝 Registering bot commands...
✅ Commands registered
🕐 Starting cron jobs...
✅ Cron jobs initialized
🤖 Fantasy Cricket Bot started successfully!
Bot username: @YourFantasyBot
```

## Step 6: Test Commands

Open Telegram and find your bot, then test:

### Basic Commands
1. `/start` - Should register you
2. `/help` - Show commands
3. `/wallet` - Show $0 balance

### Referral System
1. `/refer` - Get your referral link
2. Open referral link in another account
3. First account should get notification

### Admin Commands (only works with your user ID)
1. `/admin` - Show admin panel
2. `/viewusers` - See registered users

## Step 7: Add Test Data

### Add a Test Match
```
/addmatch_TEST001_India_Pakistan_2025-10-15T14:00_Dubai
```

### Create a Test Contest
```
/listmatches
# Note the match ID (e.g., 1)

/createcontest_1_TestContest_10_100_10
```

### View Matches
```
/matches
```

## Common Issues

### "Database connection failed"
- Make sure MySQL is running
- Check credentials in `.env`
- Try: `docker ps` to see if MySQL container is running

### "Bot token is invalid"
- Double-check token from BotFather
- No spaces in `.env` file
- Format: `BOT_TOKEN=123456:ABC...`

### "Command not found"
- Wait 1-2 minutes after starting
- Try `/start` first
- Restart bot: Ctrl+C then `npm start`

### Cron jobs errors
- These are optional for testing
- You can ignore them for now
- Need API key to work fully

## Test Checklist

- [ ] Bot responds to `/start`
- [ ] Can view wallet with `/wallet`
- [ ] Can get referral link with `/refer`
- [ ] Admin commands work with `/admin`
- [ ] Can add a test match
- [ ] Can create a test contest
- [ ] Can view matches with `/matches`

## Next Steps

Once basic tests pass:
1. Get Cricket API key from cricapi.com
2. Add API key to `.env`
3. Test `/syncmatches` to fetch real matches
4. Test full contest flow
5. Test wallet deposit/withdraw
