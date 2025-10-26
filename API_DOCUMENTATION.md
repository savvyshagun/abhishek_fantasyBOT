# Fantasy Cricket Bot API Documentation

## Base URL
```
http://localhost:3000/api
```

For production, replace with your deployed URL.

---

## Authentication

### Telegram Mini App Authentication

All protected endpoints require Telegram WebApp authentication. Send the `initData` from Telegram WebApp in one of these ways:

**Header:**
```http
X-Telegram-Init-Data: <initData>
```

**Query Parameter:**
```http
GET /api/user/profile?initData=<initData>
```

**Request Body:**
```json
{
  "initData": "<initData>"
}
```

### Getting initData in Telegram Mini App

```javascript
// In your Telegram Mini App
const initData = window.Telegram.WebApp.initData;

// Use it in API calls
fetch('http://localhost:3000/api/user/profile', {
  headers: {
    'X-Telegram-Init-Data': initData,
    'Content-Type': 'application/json'
  }
});
```

---

## Endpoints

### Health Check

#### `GET /api/health`
Check if API is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2025-10-26T19:00:00.000Z"
}
```

---

## Matches

### Get Upcoming Matches

#### `GET /api/matches`

Get list of upcoming cricket matches.

**Query Parameters:**
- `limit` (optional): Number of matches to return (default: 20)

**Example:**
```http
GET /api/matches?limit=10
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68fd13acb4efc93071ea287d",
      "matchId": "match_123",
      "name": "Nepal vs United States Of America",
      "team1": "Nepal",
      "team2": "United States Of America",
      "matchType": "T20",
      "venue": "Dubai International Cricket Stadium",
      "matchDate": "2025-10-26T00:00:00.000Z",
      "status": "upcoming"
    }
  ]
}
```

### Get Match Details

#### `GET /api/matches/:id`

Get details of a specific match.

**Parameters:**
- `id`: Match ID (MongoDB ObjectId)

**Example:**
```http
GET /api/matches/68fd13acb4efc93071ea287d
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68fd13acb4efc93071ea287d",
    "matchId": "match_123",
    "name": "Nepal vs United States Of America",
    "team1": "Nepal",
    "team2": "United States Of America",
    "matchType": "T20",
    "venue": "Dubai International Cricket Stadium",
    "matchDate": "2025-10-26T00:00:00.000Z",
    "status": "upcoming"
  }
}
```

### Get Match Contests

#### `GET /api/matches/:id/contests`

Get all contests for a specific match.

**Parameters:**
- `id`: Match ID

**Example:**
```http
GET /api/matches/68fd13acb4efc93071ea287d/contests
```

**Response:**
```json
{
  "success": true,
  "data": {
    "match": {
      "_id": "68fd13acb4efc93071ea287d",
      "name": "Nepal vs United States Of America",
      "team1": "Nepal",
      "team2": "United States Of America"
    },
    "contests": [
      {
        "_id": "68fd240acfc07d7de82e98cd",
        "contestId": "CONT_12345678",
        "matchId": "68fd13acb4efc93071ea287d",
        "name": "Mega Contest",
        "entryFee": 10,
        "prizePool": 1000,
        "maxSpots": 100,
        "joinedUsers": 45,
        "status": "open"
      }
    ]
  }
}
```

---

## User (Protected Routes)

All user endpoints require Telegram WebApp authentication.

### Get User Profile

#### `GET /api/user/profile`

Get current user's profile information.

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "telegramId": 1784287150,
    "firstName": "Shagun",
    "lastName": "Sharma",
    "username": "shagun",
    "walletBalance": 1000,
    "referralCode": "ABC123",
    "totalReferrals": 5,
    "referralEarnings": 50
  }
}
```

### Get Wallet Info

#### `GET /api/user/wallet`

Get user's wallet balance and transaction history.

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "balance": 1000,
    "referralEarnings": 50,
    "transactions": [
      {
        "transactionId": "TXN_123",
        "type": "contest_entry",
        "amount": 10,
        "status": "completed",
        "createdAt": "2025-10-26T10:00:00.000Z"
      }
    ]
  }
}
```

### Get User's Contests

#### `GET /api/user/contests`

Get all contests the user has entered.

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "68fd240acfc07d7de82e98cd",
      "contestId": "CONT_12345678",
      "name": "Mega Contest",
      "entryFee": 10,
      "status": "open",
      "match": {
        "name": "Nepal vs United States Of America",
        "matchDate": "2025-10-26T00:00:00.000Z"
      }
    }
  ]
}
```

### Get User's Teams

#### `GET /api/user/teams`

Get all teams created by the user.

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "_id": "team123",
      "teamId": "TEAM_ABC12345",
      "contestId": "68fd240acfc07d7de82e98cd",
      "matchId": "68fd13acb4efc93071ea287d",
      "players": [],
      "captain": null,
      "viceCaptain": null,
      "totalPoints": 0,
      "rank": null
    }
  ]
}
```

---

## Contests (Protected Routes)

### Get Contest Details

#### `GET /api/contests/:id`

Get details of a specific contest.

**Parameters:**
- `id`: Contest ID

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": {
    "_id": "68fd240acfc07d7de82e98cd",
    "contestId": "CONT_12345678",
    "matchId": "68fd13acb4efc93071ea287d",
    "name": "Mega Contest",
    "entryFee": 10,
    "prizePool": 1000,
    "maxSpots": 100,
    "joinedUsers": 45,
    "status": "open"
  }
}
```

### Enter a Contest

#### `POST /api/contests/:id/enter`

Enter a contest (join with a team).

**Parameters:**
- `id`: Contest ID

**Headers:**
```http
X-Telegram-Init-Data: <initData>
Content-Type: application/json
```

**Request Body:**
```json
{
  "players": [],
  "captain": "player_id",
  "viceCaptain": "player_id"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "team": {
      "teamId": "TEAM_ABC12345",
      "contestId": "68fd240acfc07d7de82e98cd",
      "players": [],
      "captain": "player_id",
      "viceCaptain": "player_id"
    },
    "newBalance": 990
  }
}
```

**Error Responses:**
```json
{
  "success": false,
  "error": "Insufficient balance",
  "required": 10,
  "current": 5
}
```

```json
{
  "success": false,
  "error": "Contest is full"
}
```

### Get Contest Leaderboard

#### `GET /api/contests/:id/leaderboard`

Get leaderboard for a contest.

**Parameters:**
- `id`: Contest ID

**Query Parameters:**
- `limit` (optional): Number of entries to return (default: 50)

**Headers:**
```http
X-Telegram-Init-Data: <initData>
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "rank": 1,
      "teamId": "TEAM_ABC12345",
      "userName": "Shagun",
      "totalPoints": 250,
      "prize": 500
    }
  ]
}
```

---

## Error Responses

All errors follow this format:

```json
{
  "success": false,
  "error": "Error message here"
}
```

### Common Status Codes

- `200` - Success
- `400` - Bad Request (invalid input)
- `401` - Unauthorized (missing or invalid auth)
- `404` - Not Found
- `500` - Internal Server Error

---

## Example: Complete Flow in Telegram Mini App

```javascript
// Initialize Telegram WebApp
const telegram = window.Telegram.WebApp;
telegram.ready();

const initData = telegram.initData;
const API_BASE = 'http://localhost:3000/api';

// 1. Get user profile
async function getUserProfile() {
  const response = await fetch(`${API_BASE}/user/profile`, {
    headers: {
      'X-Telegram-Init-Data': initData
    }
  });
  const data = await response.json();
  console.log('User:', data.data);
}

// 2. Get upcoming matches
async function getMatches() {
  const response = await fetch(`${API_BASE}/matches?limit=10`);
  const data = await response.json();
  console.log('Matches:', data.data);
}

// 3. Get contests for a match
async function getMatchContests(matchId) {
  const response = await fetch(`${API_BASE}/matches/${matchId}/contests`);
  const data = await response.json();
  console.log('Contests:', data.data.contests);
}

// 4. Enter a contest
async function enterContest(contestId) {
  const response = await fetch(`${API_BASE}/contests/${contestId}/enter`, {
    method: 'POST',
    headers: {
      'X-Telegram-Init-Data': initData,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      players: [],
      captain: null,
      viceCaptain: null
    })
  });
  const data = await response.json();
  console.log('Entered contest:', data);
}

// 5. Check wallet
async function getWallet() {
  const response = await fetch(`${API_BASE}/user/wallet`, {
    headers: {
      'X-Telegram-Init-Data': initData
    }
  });
  const data = await response.json();
  console.log('Wallet:', data.data);
}
```

---

## Environment Variables

Add these to your `.env` file:

```env
# Bot Token (required for auth)
BOT_TOKEN=your_telegram_bot_token

# API Port
PORT=3000

# MongoDB
MONGODB_URI=your_mongodb_connection_string
```

---

## CORS Configuration

The API allows all origins by default. For production, update `src/api/server.js`:

```javascript
app.use(cors({
  origin: 'https://your-mini-app-domain.com',
  credentials: true
}));
```

---

## Rate Limiting

Consider adding rate limiting for production:

```bash
npm install express-rate-limit
```

```javascript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});

app.use('/api/', limiter);
```

---

## Testing the API

### Using curl:

```bash
# Health check
curl http://localhost:3000/api/health

# Get matches
curl http://localhost:3000/api/matches

# Get user profile (requires initData)
curl -H "X-Telegram-Init-Data: <your-init-data>" \
     http://localhost:3000/api/user/profile
```

### Using Postman:

1. Import the endpoints above
2. For protected routes, add header: `X-Telegram-Init-Data` with value from Telegram WebApp
3. Test all endpoints

---

## Deployment

### Vercel/Heroku:
1. Push code to GitHub
2. Connect repository to Vercel/Heroku
3. Set environment variables
4. Deploy

### Docker:
```bash
docker build -t fantasy-cricket-api .
docker run -p 3000:3000 --env-file .env fantasy-cricket-api
```

---

## Support

For issues or questions, contact the development team or open an issue on GitHub.
