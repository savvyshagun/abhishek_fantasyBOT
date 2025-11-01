# Fantasy Cricket Mini App

A modern, mobile-first Telegram Mini App for fantasy cricket gaming, built with React and Vite.

## Features

- **Home Dashboard** - Quick overview of wallet, stats, and upcoming matches
- **Match Browsing** - View and filter upcoming, live, and completed matches
- **Team Builder** - Create fantasy teams with captain and vice-captain selection
- **My Contests** - Track active and completed contests with real-time updates
- **Wallet Management** - View balance, transactions, and referral earnings
- **Profile & Referrals** - Share referral codes and track earnings
- **Live Leaderboards** - Real-time contest rankings with auto-refresh

## Tech Stack

- **Frontend Framework:** React 18
- **Build Tool:** Vite 5
- **Styling:** Tailwind CSS 3
- **Routing:** React Router v6
- **Telegram Integration:** @twa-dev/sdk
- **HTTP Client:** Axios
- **Icons:** Lucide React

## Project Structure

```
mini-app/
├── src/
│   ├── components/         # Reusable UI components
│   │   ├── BottomNav.jsx
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── ContestCard.jsx
│   │   ├── EmptyState.jsx
│   │   ├── Header.jsx
│   │   ├── Layout.jsx
│   │   ├── Loading.jsx
│   │   └── MatchCard.jsx
│   ├── context/           # React context providers
│   │   ├── TelegramContext.jsx
│   │   └── UserContext.jsx
│   ├── hooks/             # Custom React hooks
│   │   ├── useTelegram.js
│   │   └── useUser.js
│   ├── pages/             # Page components
│   │   ├── Home.jsx
│   │   ├── Matches.jsx
│   │   ├── MatchDetails.jsx
│   │   ├── MyContests.jsx
│   │   ├── TeamBuilder.jsx
│   │   ├── Wallet.jsx
│   │   ├── Profile.jsx
│   │   └── Leaderboard.jsx
│   ├── services/          # API services
│   │   └── api.js
│   ├── utils/             # Helper functions
│   │   └── helpers.js
│   ├── App.jsx            # Main app component
│   ├── main.jsx           # Entry point
│   └── index.css          # Global styles
├── public/                # Static assets
├── index.html             # HTML template
├── vite.config.js         # Vite configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## Getting Started

### Prerequisites

- Node.js 18 or higher
- npm or yarn
- Running backend API server (see main project)

### Installation

1. **Install dependencies:**

```bash
cd mini-app
npm install
```

2. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit `.env` and set your API URL:

```env
VITE_API_URL=http://localhost:3000/api
```

3. **Start development server:**

```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The production build will be created in the `dist/` directory.

### Preview Production Build

```bash
npm run preview
```

## Telegram Bot Integration

To use this mini app with your Telegram bot:

1. **Set the Mini App URL in your bot settings:**
   - Open @BotFather on Telegram
   - Send `/setmenubutton`
   - Select your bot
   - Send the URL where your mini app is hosted

2. **For development/testing:**
   - Use a tunneling service like ngrok to expose your local server:
     ```bash
     ngrok http 5173
     ```
   - Use the ngrok URL in your bot settings

3. **For production:**
   - Deploy to Vercel, Netlify, or any static hosting service
   - Update the bot's menu button URL to your production URL

## Development Notes

### Telegram WebApp SDK

The app uses the official Telegram WebApp SDK for:
- User authentication (automatic via initData)
- Theme integration (light/dark mode)
- Haptic feedback
- Main button and back button controls
- Popups and alerts

### State Management

- **TelegramContext:** Provides Telegram WebApp functionality
- **UserContext:** Manages user profile and wallet data

### API Communication

All API calls are authenticated using Telegram's initData sent in the `x-telegram-init-data` header. The backend validates this data to ensure requests are legitimate.

### Styling

The app uses Tailwind CSS with custom Telegram theme variables:
- `tg-bg` - Background color
- `tg-text` - Text color
- `tg-hint` - Hint/secondary text color
- `tg-button` - Button color
- `tg-secondary-bg` - Secondary background color

These automatically adapt to the user's Telegram theme (light/dark).

## Features in Detail

### Home Page
- Wallet balance display
- Quick stats (contests, wins, referrals)
- Upcoming matches preview
- Referral banner

### Matches Page
- Search functionality
- Filter by status (all/upcoming/live/completed)
- Match cards with team info and countdown

### Match Details
- Full match information
- Available contests list
- Join contest functionality
- Entry fee and prize pool display

### Team Builder
- Select 11 players
- Choose captain (2x points) and vice-captain (1.5x points)
- Real-time team validation
- Contest entry confirmation

### My Contests
- Active contests with live updates
- Completed contests with results
- Navigate to leaderboards
- View team performance

### Wallet
- Balance overview
- Transaction history
- Deposit/withdraw placeholders (for future integration)
- Referral earnings display

### Profile
- User stats and information
- Referral code with share functionality
- Copy referral link
- Account details

### Leaderboard
- Real-time rankings
- Auto-refresh for live contests
- Prize distribution display
- Highlight current user position

## API Endpoints Used

- `GET /api/health` - Health check
- `GET /api/matches` - Get matches list
- `GET /api/matches/:id` - Get match details
- `GET /api/matches/:id/contests` - Get contests for match
- `GET /api/user/profile` - Get user profile
- `GET /api/user/wallet` - Get wallet info
- `GET /api/user/contests` - Get user's contests
- `GET /api/contests/:id` - Get contest details
- `POST /api/contests/:id/enter` - Join contest
- `GET /api/contests/:id/leaderboard` - Get leaderboard

## Deployment

### Vercel (Recommended)

1. **Install Vercel CLI:**
```bash
npm i -g vercel
```

2. **Deploy:**
```bash
cd mini-app
vercel
```

3. **Set environment variables in Vercel dashboard:**
   - `VITE_API_URL` - Your production API URL

### Netlify

1. **Install Netlify CLI:**
```bash
npm i -g netlify-cli
```

2. **Deploy:**
```bash
cd mini-app
netlify deploy --prod
```

### Other Static Hosts

Build the project and upload the `dist/` folder to any static hosting service:
- GitHub Pages
- Cloudflare Pages
- AWS S3 + CloudFront
- DigitalOcean App Platform

## Troubleshooting

### Telegram WebApp not loading

- Ensure your URL is HTTPS (required by Telegram for production)
- Check that the bot token is valid
- Verify the mini app URL is correctly set in @BotFather

### API Connection Issues

- Check that VITE_API_URL is correctly set
- Ensure the backend API is running and accessible
- Verify CORS is configured in the backend to allow your mini app domain

### Authentication Errors

- The Telegram initData must be passed from a real Telegram client
- Development mode may not have full authentication - test in actual Telegram app

## Future Enhancements

- [ ] Payment gateway integration (Transak, Binance Pay)
- [ ] Push notifications for match updates
- [ ] Social features (chat, team sharing)
- [ ] Advanced team statistics and analytics
- [ ] Live match commentary
- [ ] Multiple team entries per contest
- [ ] League system for regular players

## License

This project is part of the Fantasy Cricket Bot system.

## Support

For issues or questions, please contact the development team or create an issue in the repository.
