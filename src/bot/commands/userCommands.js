import { UserModel as User } from '../../models/User.js';
import { MatchModel as Match } from '../../models/Match.js';
import { ContestModel as Contest } from '../../models/Contest.js';
import { TeamModel as Team } from '../../models/Team.js';
import { ReferralModel as Referral } from '../../models/Referral.js';
import { WalletService } from '../../services/walletService.js';
import { NotificationService } from '../../services/notificationService.js';

export const registerUserCommands = (bot) => {
  // /start command - Registration & Referral handling
  bot.start(async (ctx) => {
    const telegramUser = ctx.from;
    let user = await User.findByTelegramId(telegramUser.id);

    // Check for referral code in start parameter
    const startPayload = ctx.startPayload;
    let referrerId = null;

    if (startPayload && startPayload.startsWith('ref')) {
      const referralCode = startPayload.substring(3);
      const referrer = await User.findByReferralCode(referralCode);

      if (referrer && referrer.telegramId !== telegramUser.id) {
        referrerId = referrer.telegramId;
      }
    }

    // Create new user if doesn't exist
    if (!user) {
      user = await User.create(telegramUser, referrerId);

      // Process referral if exists
      if (referrerId) {
        await Referral.create(referrerId, user.telegramId, 10);
        await User.incrementReferrals(referrerId);
        await User.addReferralEarnings(referrerId, 10);

        // Notify referrer
        await NotificationService.sendToUser(
          bot,
          referrerId,
          '🎉 New Referral!',
          `${user.firstName} just joined using your referral link!\nYou earned $10 referral bonus.`
        );
      }
    }

    const welcomeMessage = `
🏏 *Welcome to Fantasy11 Cricket Bot!*

Hello ${user.firstName}! ${user.referredBy ? '🎁 You joined via a referral!' : ''}

*Your Account:*
👤 Username: @${user.username || 'N/A'}
💰 Balance: $${user.walletBalance}
🔗 Referral Code: \`${user.referralCode}\`

*Available Commands:*
/matches - View upcoming matches
/join - Join a contest
/mycontests - Your active contests
/leaderboard - Contest rankings
/wallet - Manage your wallet
/refer - Get your referral link
/help - Command list

Let's start playing! Use /matches to see upcoming matches.
    `.trim();

    await ctx.reply(welcomeMessage, { parse_mode: 'Markdown' });
  });

  // /matches command
  bot.command('matches', async (ctx) => {
    const matches = await Match.getUpcoming(10);

    if (matches.length === 0) {
      return ctx.reply('No upcoming matches found at the moment. Check back later!');
    }

    let message = '🏏 *Upcoming Matches*\n\n';

    for (const match of matches) {
      const date = new Date(match.matchDate).toLocaleString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });

      message += `📍 *${match.name}*\n`;
      message += `   ${match.team1} vs ${match.team2}\n`;
      message += `   📅 ${date}\n`;
      message += `   🏟 ${match.venue || 'TBA'}\n`;
      message += `   /join\\_${match.id}\n\n`;
    }

    message += '\n💡 Tap /join_[match_id] to see contests for a match';

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /join command - show instructions
  bot.command('join', async (ctx) => {
    const message = `
🎯 *How to Join a Contest*

1️⃣ First, view upcoming matches:
   /matches

2️⃣ Then click on a match's join link:
   /join_[match_id]

3️⃣ Choose a contest and enter!

💡 Tip: Use /matches to see all available matches.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /join command - with match ID
  bot.hears(/^\/join_([a-f0-9]+)$/i, async (ctx) => {
    const matchId = ctx.match[1];
    console.log('\n🔍 JOIN DEBUG:');
    console.log('1. Received matchId string:', matchId);

    const match = await Match.findById(matchId);
    console.log('2. Found match:', match ? match.name : 'NULL');
    console.log('3. Match._id:', match ? match._id : 'NULL');
    console.log('4. Match._id type:', match ? typeof match._id : 'NULL');

    if (!match) {
      return ctx.reply('❌ Match not found.');
    }

    console.log('5. Calling Contest.getByMatchId with:', match._id);
    const contests = await Contest.getByMatchId(match._id);
    console.log('6. Found contests:', contests.length);
    console.log('7. Contests:', JSON.stringify(contests.map(c => ({ id: c._id, name: c.name, matchId: c.matchId })), null, 2));

    if (contests.length === 0) {
      return ctx.reply('No contests available for this match yet.');
    }

    let message = `🏏 *${match.name}*\n`;
    message += `${match.team1} vs ${match.team2}\n\n`;
    message += `*Available Contests:*\n\n`;

    for (const contest of contests) {
      const spotsLeft = contest.maxSpots - contest.joinedUsers;
      message += `💰 *${contest.name}*\n`;
      message += `   Entry: $${contest.entryFee}\n`;
      message += `   Prize Pool: $${contest.prizePool}\n`;
      message += `   Spots: ${contest.joinedUsers}/${contest.maxSpots} (${spotsLeft} left)\n`;
      message += `   /enter\\_${contest.id}\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /enter command - enter a contest
  bot.hears(/^\/enter_([a-f0-9]+)$/i, async (ctx) => {
    const contestId = ctx.match[1];
    const userId = ctx.from.id;

    console.log('\n🎯 ENTER CONTEST DEBUG:');
    console.log('Contest ID:', contestId);
    console.log('User ID:', userId);

    try {
      // Find the contest
      const contest = await Contest.findById(contestId);

      if (!contest) {
        return ctx.reply('❌ Contest not found.');
      }

      // Check if contest is full
      const isFull = await Contest.isFull(contest.contestId);
      if (isFull) {
        return ctx.reply('❌ This contest is full!');
      }

      // Check user balance
      const user = await User.findByTelegramId(userId);
      if (user.walletBalance < contest.entryFee) {
        return ctx.reply(`❌ Insufficient balance!\n\nEntry fee: $${contest.entryFee}\nYour balance: $${user.walletBalance}\n\nUse /deposit to add funds.`);
      }

      // For now, create a simple team with empty players (will be enhanced later)
      const team = await Team.create({
        user_telegram_id: userId,
        contest_id: contest._id,
        match_id: contest.matchId,
        players: [], // Empty for now - can be filled by team selection later
        captain: null,
        vice_captain: null
      });

      // Deduct entry fee from user wallet
      await User.updateBalance(userId, contest.entryFee, 'subtract');

      // Increment contest joined users
      await Contest.incrementJoinedUsers(contest.contestId);

      await ctx.reply(`✅ Successfully entered ${contest.name}!\n\n💰 Entry fee deducted: $${contest.entryFee}\n💵 New balance: $${user.walletBalance - contest.entryFee}\n\n🎯 Team ID: ${team.teamId}\n\nGood luck! 🍀`);
    } catch (error) {
      console.error('Error entering contest:', error);
      await ctx.reply('❌ Failed to enter contest. Please try again later.');
    }
  });

  // /mycontests command
  bot.command('mycontests', async (ctx) => {
    const userId = ctx.from.id;
    const contests = await Contest.getUserContests(userId);

    if (contests.length === 0) {
      return ctx.reply('You haven\'t joined any contests yet.\n\nUse /matches to see upcoming matches and join contests!');
    }

    let message = '🎯 *Your Contests*\n\n';

    for (const contest of contests) {
      const statusEmoji = contest.status === 'live' ? '🔴' : contest.status === 'completed' ? '✅' : '⏳';
      message += `${statusEmoji} *${contest.name}*\n`;
      message += `   Match: ${contest.match_name}\n`;
      message += `   Entry: $${contest.entry_fee}\n`;
      message += `   Status: ${contest.status}\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /wallet command
  bot.command('wallet', async (ctx) => {
    const userId = ctx.from.id;
    const user = await User.findByTelegramId(userId);
    const transactions = await WalletService.getTransactionHistory(userId, null);

    let message = '💰 *Your Wallet*\n\n';
    message += `Balance: *$${user.walletBalance}*\n`;
    message += `Referral Earnings: *$${user.referralEarnings}*\n\n`;

    message += '*Recent Transactions:*\n';

    if (transactions.length === 0) {
      message += 'No transactions yet.\n';
    } else {
      for (const txn of transactions.slice(0, 5)) {
        const sign = txn.type === 'deposit' || txn.type === 'winnings' ? '+' : '-';
        const emoji = txn.type === 'deposit' || txn.type === 'winnings' ? '💵' : '💸';
        message += `${emoji} ${sign}$${txn.amount} - ${txn.type}\n`;
      }
    }

    message += '\n💡 Contact admin to add funds to your wallet.\n';

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /refer command
  bot.command('refer', async (ctx) => {
    const userId = ctx.from.id;
    const user = await User.findByTelegramId(userId);
    const referrals = await Referral.getUserReferrals(userId);
    const unclaimedRewards = await Referral.getUnclaimedRewards(userId);

    const referralLink = `https://t.me/${ctx.botInfo.username}?start=ref${user.referralCode}`;

    let message = '🎁 *Referral Program*\n\n';
    message += `*Your Referral Link:*\n\`${referralLink}\`\n\n`;
    message += `*Stats:*\n`;
    message += `👥 Total Referrals: ${user.totalReferrals}\n`;
    message += `💰 Total Earned: $${user.referralEarnings}\n`;
    message += `🎁 Unclaimed Rewards: $${unclaimedRewards}\n\n`;

    message += '*How it works:*\n';
    message += '• Share your link with friends\n';
    message += '• Earn $10 for each signup\n';
    message += '• Rewards added to wallet instantly\n\n';

    if (unclaimedRewards > 0) {
      message += '💡 Use /claim to claim your rewards!';
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /claim command - claim referral rewards
  bot.command('claim', async (ctx) => {
    const userId = ctx.from.id;
    const unclaimedRewards = await Referral.getUnclaimedRewards(userId);

    if (unclaimedRewards === 0) {
      return ctx.reply('No unclaimed rewards available.');
    }

    await Referral.claimRewards(userId);
    await User.updateBalance(userId, unclaimedRewards, 'add');

    await ctx.reply(`✅ Claimed $${unclaimedRewards}!\n\nThe amount has been added to your wallet.`);
  });

  // /leaderboard command
  bot.command('leaderboard', async (ctx) => {
    const topReferrers = await User.getTopReferrers(10);

    let message = '🏆 *Top Referrers*\n\n';

    topReferrers.forEach((user, index) => {
      const medal = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `${index + 1}.`;
      const name = user.username ? `@${user.username}` : user.firstName;
      message += `${medal} ${name}\n`;
      message += `   👥 ${user.totalReferrals} referrals | 💰 $${user.referralEarnings}\n\n`;
    });

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /help command
  bot.command('help', async (ctx) => {
    const message = `
🏏 *Fantasy11 Cricket Bot - Commands*

*Matches & Contests:*
/matches - View upcoming matches
/join - Join a contest
/mycontests - Your active contests
/leaderboard - Contest rankings

*Wallet:*
/wallet - View balance & transactions

*Referrals:*
/refer - Get referral link
/claim - Claim referral rewards

*Help:*
/help - This help message
/support - Contact support

Need help? Contact @YourSupportUsername
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });
};
