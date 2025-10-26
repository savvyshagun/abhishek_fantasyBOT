# 🧪 Complete Bot Testing Guide

Your bot **@shagunnbot** is running! Here's how to test every feature.

---

## ✅ Step 1: Basic User Flow (5 minutes)

### 1.1 Register as User

Open Telegram → Search `@shagunnbot` → Send:

```
/start
```

**Expected Response:**
```
🏏 Welcome to Fantasy11 Cricket Bot!

Hello Vanxh!

Your Account:
👤 Username: @vanxhh
💰 Balance: $0
🔗 Referral Code: XXXXX

Available Commands:
/matches - View upcoming matches
/join - Join a contest
...
```

### 1.2 Check Wallet

```
/wallet
```

**Expected:**
```
💰 Your Wallet

Balance: $0
Referral Earnings: $0

Recent Transactions:
No transactions yet.

Actions:
/deposit - Add funds
/withdraw - Withdraw funds
```

### 1.3 Get Referral Link

```
/refer
```

**Expected:**
```
🎁 Referral Program

Your Referral Link:
t.me/shagunnbot?start=refXXXXX

Stats:
👥 Total Referrals: 0
💰 Total Earned: $0
🎁 Unclaimed Rewards: $0

How it works:
• Share your link with friends
• Earn $10 for each signup
• Rewards added to wallet instantly
```

### 1.4 View Help

```
/help
```

**Expected:** List of all commands

---

## ⚙️ Step 2: Admin Features (10 minutes)

### 2.1 Open Admin Panel

```
/admin
```

**Expected:**
```
⚙️ Admin Panel

👥 Total Users: 1
💸 Pending Withdrawals: 0

Available Commands:
...
```

### 2.2 Add a Test Match

```
/addmatch_TEST001_India_Pakistan_2025-12-25T14:00_Dubai
```

**Expected:**
```
✅ Match added successfully!

Match ID: TEST001
India vs Pakistan
12/25/2025, 2:00 PM
```

### 2.3 List All Matches

```
/listmatches
```

**Expected:**
```
📋 All Matches

ID: [MongoDB ID] | TEST001
India vs Pakistan
Status: upcoming
Date: 12/25/2025, 2:00 PM
```

### 2.4 Create a Contest

First, note the match ID from `/listmatches` (it's the MongoDB ObjectId)

```
/createcontest_[MATCH_ID]_TestContest_10_100_10
```

Example:
```
/createcontest_67139abc123def456_TestContest_10_100_10
```

**Expected:**
```
✅ Contest created!

ID: CONT_XXXXXXXX
Match: India vs Pakistan
Entry: $10
Prize Pool: $100
Max Spots: 10
```

### 2.5 View All Users

```
/viewusers
```

**Expected:**
```
👥 User Statistics

Total Users: 1
Total Wallet Balance: $0.00

Recent Users:
@vanxhh - $0
```

---

## 🎮 Step 3: User Contest Flow

### 3.1 View Matches

```
/matches
```

**Expected:**
```
🏏 Upcoming Matches

📍 India vs Pakistan
   India vs Pakistan
   📅 Dec 25, 2:00 PM
   🏟 Dubai
   /join_[MATCH_ID]
```

### 3.2 View Contests for Match

Click the `/join_[MATCH_ID]` command or type it manually

**Expected:**
```
🏏 India vs Pakistan
India vs Pakistan

Available Contests:

💰 TestContest
   Entry: $10
   Prize Pool: $100
   Spots: 0/10 (10 left)
   /enter_[CONTEST_ID]
```

---

## 👥 Step 4: Test Referral System (15 minutes)

### 4.1 Get Your Referral Link

```
/refer
```

Copy the link (looks like: `t.me/shagunnbot?start=refXXXXX`)

### 4.2 Open in Incognito/Different Account

1. Open link in another browser/device/Telegram account
2. Send `/start`
3. New user should see "You joined via a referral!"

### 4.3 Check Your Referrals

Back in your account:

```
/refer
```

**Expected:**
```
Stats:
👥 Total Referrals: 1
💰 Total Earned: $10
🎁 Unclaimed Rewards: $10
```

### 4.4 Claim Rewards

```
/claim
```

**Expected:**
```
✅ Claimed $10!

The amount has been added to your wallet.
```

Check wallet:
```
/wallet
```

Should now show: `Balance: $10`

---

## 📊 Step 5: Admin User Management

### 5.1 View Transactions

```
/transactions
```

**Expected:**
```
💳 Recent Transactions

TXN_XXXXXXXXXXXX
User: @vanxhh
Type: referral | Amount: $10
Status: completed
```

### 5.2 Broadcast Message

```
/broadcast_TestAnnouncement_Hello everyone! This is a test broadcast.
```

**Expected:**
```
📤 Sending broadcast...
✅ Broadcast sent to 1 users!
```

You should receive the broadcast message in your chat.

---

## 💰 Step 6: Test Wallet System

### 6.1 Request Withdrawal (Will Fail - No Balance)

```
/withdraw_50_0x1234567890123456789012345678901234567890
```

**Expected:**
```
❌ Withdrawal failed: Insufficient balance
```

### 6.2 Manual Balance Addition (Admin)

Since deposit requires real payment integration, let's test admin tools.

**To manually add balance for testing**, you'd need to create a transaction directly, but for now you can see the withdrawal workflow.

### 6.3 Check Pending Withdrawals

```
/approvewithdraw
```

**Expected:**
```
No pending withdrawals.
```

---

## 🏏 Step 7: Test Match Updates (Optional)

### 7.1 Try Syncing from API

```
/syncmatches
```

**Note:** This will only work if you have a CricAPI key configured.

**Without API key:**
```
⚠️ No matches found from API...
```

**With API key:**
```
✅ Sync complete!
Added X new matches.
```

### 7.2 Add Multiple Matches

```
/addmatch_TEST002_Australia_England_2025-12-26T10:00_Melbourne
/addmatch_TEST003_SouthAfrica_NewZealand_2025-12-27T15:00_CapeTown
```

Check with `/listmatches` - should see 3 matches now.

---

## 🎯 Step 8: Complete Contest Flow (Advanced)

**Note:** Full contest flow requires:
- Real match data
- Player selection (Mini App)
- Live scoring updates

**For now, you can test:**

1. ✅ Creating matches
2. ✅ Creating contests
3. ✅ Viewing contests
4. ⚠️ Joining contests (needs wallet balance)
5. ⚠️ Player selection (needs Mini App)
6. ⚠️ Live scoring (needs real match data)

---

## 📱 Step 9: Multi-User Testing

### Test with 2-3 accounts:

**Account 1 (You - Admin):**
- Create matches
- Create contests
- Approve withdrawals

**Account 2 (Friend):**
- Join via your referral link
- View matches
- Check wallet

**Account 3 (Another Friend):**
- Join via Account 2's referral link
- Test referral chain

**Check:**
- All users appear in `/viewusers`
- Referral tree works correctly
- Wallet balances update properly

---

## ✅ Testing Checklist

### Basic Features:
- [ ] Bot responds to `/start`
- [ ] User registration works
- [ ] `/wallet` shows balance
- [ ] `/refer` shows referral link
- [ ] `/help` displays commands

### Admin Features:
- [ ] `/admin` panel accessible
- [ ] Can add matches manually
- [ ] Can create contests
- [ ] Can view all users
- [ ] Can view transactions
- [ ] Broadcast works

### Referral System:
- [ ] Referral link generated
- [ ] New user joins via link
- [ ] Referrer gets reward
- [ ] Can claim rewards
- [ ] Balance updates correctly

### Match Management:
- [ ] Matches display correctly
- [ ] Contests show for matches
- [ ] Match details accurate

### Error Handling:
- [ ] Invalid commands handled
- [ ] Insufficient balance caught
- [ ] Admin-only commands blocked for non-admins

---

## 🐛 Common Issues & Solutions

### Issue: Bot not responding

**Check:**
```bash
# Is bot running?
ps aux | grep node

# Check logs
tail -f bot.log  # if you set up logging
```

**Solution:**
```bash
# Restart bot
npm start
```

### Issue: "Not an admin" message

**Check `.env`:**
```
ADMIN_IDS=1784287150
```

Make sure your user ID is correct.

### Issue: Commands not recognized

**Wait 1-2 minutes** after starting bot for Telegram to register commands, or:

```
/start
```

### Issue: Database errors

**Check MongoDB connection:**
```bash
# Your connection string should work
# Test by starting bot - should see:
✅ MongoDB connected successfully
```

---

## 📈 Performance Testing

### Test Concurrent Users:

1. Create 5-10 test accounts
2. All send `/start` simultaneously
3. Check if all register correctly
4. Verify database handles load

### Test Rapid Commands:

Send multiple commands quickly:
```
/wallet
/refer
/matches
/help
/wallet
```

Bot should handle all without crashing.

---

## 🎉 Success Criteria

Your bot is working if:

1. ✅ Responds to all commands
2. ✅ Stores data in MongoDB
3. ✅ Referral system works
4. ✅ Admin commands work
5. ✅ Can create matches & contests
6. ✅ Handles multiple users
7. ✅ Error messages are clear

---

## 📞 Next Steps After Testing

1. **Get Cricket API** - Sign up at cricapi.com
2. **Add Mini App** - For team selection UI
3. **Payment Integration** - Transak or Binance Pay
4. **Deploy to Production** - Render/Railway
5. **Beta Testing** - Invite real users
6. **Marketing** - Launch campaign

---

## 🆘 Need Help?

If something doesn't work:

1. Check bot logs (console output)
2. Verify `.env` configuration
3. Test MongoDB connection
4. Review error messages
5. Check CURRENT_STATUS.md

---

**Your Bot Info:**
- Bot: @shagunnbot
- Admin: @vanxhh (ID: 1784287150)
- Database: MongoDB Atlas
- Status: ✅ RUNNING

Start testing now! 🚀
