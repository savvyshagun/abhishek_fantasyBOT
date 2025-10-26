# 🏏 Cricket API Setup Guide

## Option 1: CricAPI (Recommended)

### Step 1: Sign Up
1. Go to https://cricapi.com/register
2. Create account (free)
3. Verify email

### Step 2: Get API Key
1. Login to dashboard
2. Go to "API Keys" section
3. Copy your API key

### Step 3: Configure Bot
Add to `.env`:
```env
SPORTS_API_KEY=your_cricapi_key_here
SPORTS_API_URL=https://api.cricapi.com/v1
```

### Step 4: Test
```bash
npm start
# In Telegram bot:
/syncmatches
```

### Free Tier Limits:
- 100 requests/day
- Basic match data
- Live scores
- Schedules

### When to Upgrade ($9/month):
- Need more than 100 requests/day
- Running contests daily
- 10+ active users

---

## Option 2: Cricbuzz (Free, Unofficial)

### Step 1: Install
```bash
npm install cricbuzz-api-nodejs
```

### Step 2: Update Code
Replace `src/services/sportsApi.js`:

```javascript
import cricbuzz from 'cricbuzz-api-nodejs';

export class SportsApiService {
  static async getUpcomingMatches() {
    try {
      const matches = await cricbuzz.getMatches();
      return matches.filter(m => m.matchType === 'international');
    } catch (error) {
      console.error('Error:', error);
      return [];
    }
  }

  static async getLiveScore(matchId) {
    return await cricbuzz.getLiveScore(matchId);
  }
}
```

### Pros:
✅ Completely free
✅ No rate limits
✅ Rich data

### Cons:
⚠️ Unofficial (may break)
⚠️ No support
⚠️ Legal gray area

---

## Option 3: RapidAPI - Cricket

### Step 1: Sign Up
1. Go to https://rapidapi.com
2. Create account
3. Subscribe to "Cricket Live Data" API

### Step 2: Get Keys
1. Go to API dashboard
2. Copy X-RapidAPI-Key
3. Copy X-RapidAPI-Host

### Step 3: Configure
Add to `.env`:
```env
RAPID_API_KEY=your_key
RAPID_API_HOST=cricket-live-data.p.rapidapi.com
```

### Step 4: Update Service
```javascript
const response = await axios.get(`https://${RAPID_API_HOST}/matches`, {
  headers: {
    'X-RapidAPI-Key': process.env.RAPID_API_KEY,
    'X-RapidAPI-Host': process.env.RAPID_API_HOST
  }
});
```

### Pricing:
- Free: 100 requests/month
- Basic: $9/month - 10,000 requests/month

---

## Option 4: SportsData.io (Pro)

### When to Use:
- Serious production app
- Need guaranteed uptime
- Want official data
- Can afford $29+/month

### Setup:
1. Sign up at https://sportsdata.io
2. Start 30-day trial
3. Get API key from dashboard

Add to `.env`:
```env
SPORTS_API_KEY=your_sportsdata_key
SPORTS_API_URL=https://api.sportsdata.io/v4/cricket
```

---

## 📊 Comparison Table

| API | Price | Requests | Support | Reliability |
|-----|-------|----------|---------|-------------|
| **CricAPI** | Free/$9 | 100/1K per day | Good | ⭐⭐⭐⭐ |
| **Cricbuzz** | Free | Unlimited | None | ⭐⭐⭐ |
| **RapidAPI** | Free/$9 | 100/10K per month | Good | ⭐⭐⭐⭐ |
| **SportsData.io** | $29+ | High | Excellent | ⭐⭐⭐⭐⭐ |

---

## 🎯 Recommendation Path

### Phase 1: Development (Free)
Use **CricAPI Free** or **Cricbuzz**
- Perfect for building & testing
- No cost
- Learn the platform

### Phase 2: Beta (Paid)
Upgrade to **CricAPI Starter** ($9/month)
- Support 10-50 users
- Reliable data
- Official support

### Phase 3: Production (Scale)
Move to **SportsData.io** ($29+/month)
- Support 100+ users
- SLA guarantees
- Professional features

---

## 🚀 Quick Start (CricAPI)

```bash
# 1. Sign up
open https://cricapi.com/register

# 2. Get API key from dashboard

# 3. Add to .env
echo "SPORTS_API_KEY=your_key_here" >> .env

# 4. Test bot
npm start

# 5. In Telegram
/syncmatches
```

---

## 📝 Testing Your API

Once configured, test with:

```bash
# Start bot
npm start

# In Telegram bot:
/admin
/syncmatches  # Fetch real matches
/listmatches  # View imported matches
/matches      # User view
```

You should see real cricket matches imported!

---

## 🐛 Troubleshooting

### "API key invalid"
- Check key is correct in .env
- No spaces before/after key
- Restart bot after changing .env

### "Rate limit exceeded"
- You hit daily/monthly limit
- Wait for reset or upgrade plan
- Use caching to reduce requests

### "No matches found"
- API might not have current matches
- Check API documentation
- Try different endpoints

---

## 💡 Tips

1. **Cache API responses** (5-10 minutes)
2. **Only sync 2-3 times per day**
3. **Use webhooks if API supports it**
4. **Monitor request count** in dashboard

---

Need help? Check the API docs or create an issue!
