# Fantasy Cricket Telegram Bot

A comprehensive Telegram bot for Fantasy Cricket with wallet management, referral system, live scoring, and contest management.

## 🎯 Features

### User Features
- **Telegram Authentication** - Seamless login using Telegram
- **Wallet System** - Deposit/withdraw USDC (BEP20)
- **Contest Management** - Join contests, create teams
- **Live Scoring** - Real-time match updates
- **Referral System** - Earn rewards by inviting friends
- **Leaderboards** - Track rankings and performance

### Admin Features
- **Match Management** - Add/sync matches from API
- **Contest Creation** - Set up contests with custom rules
- **Transaction Management** - Approve withdrawals
- **User Analytics** - View statistics and activity
- **Broadcasting** - Send announcements to all users

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ installed
- MySQL 8.0+ database
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- Sports API Key (CricAPI or similar)

### Installation

1. **Clone the repository**
```bash
git clone <your-repo-url>
cd fantasy-cricket-bot
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure environment**
```bash
cp .env.example .env
```

Edit `.env` file with your credentials:
```env
BOT_TOKEN=your_telegram_bot_token
ADMIN_IDS=123456789,987654321

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=fantasy_cricket

SPORTS_API_KEY=your_cricapi_key
```

4. **Setup database**
```bash
npm run db:setup
```

5. **Start the bot**
```bash
npm start
```

For development with auto-reload:
```bash
npm run dev
```

## 🐳 Docker Deployment

### Using Docker Compose

1. **Configure environment**
```bash
cp .env.example .env
# Edit .env with your credentials
```

2. **Build and start**
```bash
docker-compose up -d
```

3. **View logs**
```bash
docker-compose logs -f bot
```

4. **Stop services**
```bash
docker-compose down
```

### Manual Docker Build

```bash
docker build -t fantasy-cricket-bot .
docker run -d --name bot --env-file .env fantasy-cricket-bot
```

## 📚 Bot Commands

### User Commands
- `/start` - Register and start using the bot
- `/matches` - View upcoming matches
- `/join` - Join a contest
- `/mycontests` - Your active contests
- `/wallet` - View balance and transactions
- `/deposit` - Add funds to wallet
- `/withdraw` - Withdraw funds
- `/refer` - Get referral link and stats
- `/claim` - Claim referral rewards
- `/leaderboard` - View top referrers
- `/help` - Display help message

### Admin Commands
- `/admin` - Admin dashboard
- `/syncmatches` - Sync matches from API
- `/addmatch` - Add match manually
- `/createcontest` - Create new contest
- `/listmatches` - List all matches
- `/viewusers` - User statistics
- `/transactions` - View all transactions
- `/approvewithdraw` - Approve withdrawals
- `/rejectwithdraw` - Reject withdrawals
- `/broadcast` - Send message to all users

## 🏗️ Project Structure

```
fantasy-cricket-bot/
├── src/
│   ├── bot/
│   │   └── commands/
│   │       ├── userCommands.js    # User command handlers
│   │       └── adminCommands.js   # Admin command handlers
│   ├── database/
│   │   ├── connection.js          # MySQL connection pool
│   │   ├── schema.sql             # Database schema
│   │   └── setup.js               # Database setup script
│   ├── models/
│   │   ├── User.js                # User model
│   │   ├── Match.js               # Match model
│   │   ├── Contest.js             # Contest model
│   │   ├── Team.js                # Team model
│   │   ├── Transaction.js         # Transaction model
│   │   └── Referral.js            # Referral model
│   ├── services/
│   │   ├── sportsApi.js           # Sports API integration
│   │   ├── fantasyScoring.js     # Fantasy scoring logic
│   │   ├── notificationService.js # Notification system
│   │   └── walletService.js       # Wallet operations
│   ├── cron/
│   │   └── scoreUpdater.js        # Live score cron jobs
│   └── index.js                   # Main bot entry point
├── .env.example                   # Environment variables template
├── package.json                   # Project dependencies
├── Dockerfile                     # Docker configuration
├── docker-compose.yml             # Docker Compose setup
└── README.md                      # This file
```

## 💾 Database Schema

### Main Tables
- **users** - User accounts and profiles
- **matches** - Cricket matches
- **contests** - Contest details
- **teams** - User's fantasy teams
- **transactions** - Wallet transactions
- **referrals** - Referral tracking
- **player_stats** - Player performance data
- **notifications** - User notifications

## 🎮 Fantasy Scoring Rules

### Batting
- Run: 1 point
- Four: +1 bonus
- Six: +2 bonus
- Half Century (50 runs): +8 points
- Century (100 runs): +16 points
- Duck: -2 points

### Bowling
- Wicket: 25 points
- Maiden Over: 12 points
- 5 Wicket Haul: +16 bonus

### Fielding
- Catch: 8 points
- Stumping: 12 points
- Run Out: 12 points

### Bonuses
- Strike Rate bonuses (batting)
- Economy Rate bonuses (bowling)
- Captain points: 2x
- Vice Captain points: 1.5x

## 🔄 Cron Jobs

The bot runs automated tasks:

- **Every 5 minutes**: Update live match scores
- **Every 10 minutes**: Check for match starts
- **Every 15 minutes**: Process completed matches and distribute prizes

## 🌐 Deployment Options

### Option 1: Render
1. Create account on [Render](https://render.com)
2. Create new Web Service
3. Connect your repository
4. Add environment variables
5. Deploy

### Option 2: Railway
1. Create account on [Railway](https://railway.app)
2. New Project → Deploy from GitHub
3. Add environment variables
4. Deploy

### Option 3: DigitalOcean
1. Create Droplet (Ubuntu 22.04)
2. SSH into server
3. Install Node.js and MySQL
4. Clone repository
5. Configure and start

### Option 4: Heroku
1. Create Heroku app
2. Add MySQL addon (ClearDB or JawsDB)
3. Configure environment variables
4. Deploy via Git

## 🔧 Configuration

### Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `BOT_TOKEN` | Telegram bot token | Yes |
| `ADMIN_IDS` | Comma-separated admin user IDs | Yes |
| `DB_HOST` | MySQL host | Yes |
| `DB_USER` | MySQL username | Yes |
| `DB_PASSWORD` | MySQL password | Yes |
| `DB_NAME` | Database name | Yes |
| `SPORTS_API_KEY` | Cricket API key | Yes |
| `MINI_APP_URL` | Mini app URL (optional) | No |

## 📊 API Integration

The bot supports multiple cricket data providers:

- **CricAPI** - Real-time cricket scores
- **SportsData.io** - Comprehensive cricket data
- Custom API integration possible

## 🔐 Security

- Non-root Docker user
- Environment variable protection
- SQL injection prevention
- Admin-only commands with ID verification
- Transaction validation

## 🐛 Troubleshooting

### Bot not responding
```bash
# Check if bot is running
docker ps

# View logs
docker logs fantasy-cricket-bot

# Restart bot
docker-compose restart bot
```

### Database connection issues
```bash
# Test MySQL connection
mysql -h localhost -u root -p fantasy_cricket

# Check database setup
npm run db:setup
```

### Cron jobs not running
- Check system time/timezone
- Verify cron job initialization in logs
- Ensure bot process stays running

## 📝 License

ISC

## 👥 Support

For issues or questions:
- Create an issue on GitHub
- Contact: your-email@example.com

## 🚧 Roadmap

- [ ] Mini App integration
- [ ] Multiple contest types
- [ ] Advanced analytics
- [ ] Social features
- [ ] Mobile app
- [ ] Multi-language support

## 🤝 Contributing

Contributions are welcome! Please:
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

---

Built with ❤️ using Node.js and Telegraf
# abhishek_fantasyBOT
