import { UserModel as User } from '../../models/User.js';
import { MatchModel as Match } from '../../models/Match.js';
import { ContestModel as Contest } from '../../models/Contest.js';
import { TransactionModel as Transaction } from '../../models/Transaction.js';
import { WalletService } from '../../services/walletService.js';
import { NotificationService } from '../../services/notificationService.js';
import { SportsApiService } from '../../services/sportsApi.js';
import dotenv from 'dotenv';

dotenv.config();

const ADMIN_IDS = process.env.ADMIN_IDS?.split(',').map(id => parseInt(id)) || [];

// Middleware to check if user is admin
export const isAdmin = (ctx, next) => {
  if (ADMIN_IDS.includes(ctx.from.id)) {
    return next();
  }
  return ctx.reply('❌ This command is only available to administrators.');
};

export const registerAdminCommands = (bot) => {
  // /admin command - Admin panel
  bot.command('admin', isAdmin, async (ctx) => {
    const userCount = await User.count();

    let message = '⚙️ *Admin Panel*\n\n';
    message += `👥 Total Users: ${userCount}\n\n`;

    message += '*Available Commands:*\n\n';
    message += '*Matches:*\n';
    message += '/addmatch - Add a match manually\n';
    message += '/syncmatches - Sync matches from API\n';
    message += '/listmatches - List all matches\n\n';

    message += '*Contests:*\n';
    message += '/createcontest - Create a new contest\n';
    message += '/listcontests - List all contests\n\n';

    message += '*Users & Balance:*\n';
    message += '/viewusers - View user statistics\n';
    message += '/finduser - Search for users\n';
    message += '/addbalance - Add balance to user\n';
    message += '/subtractbalance - Subtract balance from user\n';
    message += '/setbalance - Set exact user balance\n\n';

    message += '*Broadcasting:*\n';
    message += '/broadcast - Send message to all users\n';

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /syncmatches - Sync matches from API
  bot.command('syncmatches', isAdmin, async (ctx) => {
    await ctx.reply('🔄 Syncing matches from API...');

    try {
      const apiMatches = await SportsApiService.getUpcomingMatches();

      if (!apiMatches || apiMatches.length === 0) {
        return ctx.reply('⚠️ No matches found from API. The API might be empty or the endpoint needs adjustment.');
      }

      let addedCount = 0;
      let errors = [];

      for (const apiMatch of apiMatches) {
        try {
          // Handle different possible field names from API
          const matchId = apiMatch.id || apiMatch.match_id || apiMatch._id;
          const matchName = apiMatch.name || apiMatch.title || apiMatch.match_title ||
                           `${apiMatch.team1 || apiMatch.teamA} vs ${apiMatch.team2 || apiMatch.teamB}`;
          const team1 = apiMatch.team1 || apiMatch.teamA || apiMatch.teams?.[0]?.name || 'Team A';
          const team2 = apiMatch.team2 || apiMatch.teamB || apiMatch.teams?.[1]?.name || 'Team B';
          const matchDate = apiMatch.date || apiMatch.match_date || apiMatch.dateTimeGMT || apiMatch.start_time;
          const venue = apiMatch.venue || apiMatch.location || 'TBA';
          const matchType = apiMatch.match_type || apiMatch.matchType || apiMatch.format || 'T20';

          if (!matchId) {
            errors.push(`Skipped match: No ID found`);
            continue;
          }

          const existingMatch = await Match.findByMatchId(matchId.toString());

          if (!existingMatch) {
            await Match.create({
              match_id: matchId.toString(),
              name: matchName,
              team1,
              team2,
              match_type: matchType,
              venue,
              match_date: new Date(matchDate),
              status: apiMatch.status === 'live' || apiMatch.matchStarted ? 'live' : 'upcoming',
              api_data: apiMatch
            });
            addedCount++;
          }
        } catch (matchError) {
          errors.push(`Error adding match: ${matchError.message}`);
        }
      }

      let response = `✅ Sync complete!\n\nAdded ${addedCount} new matches.\nTotal matches from API: ${apiMatches.length}`;

      if (errors.length > 0) {
        response += `\n\n⚠️ Errors: ${errors.length}\n${errors.slice(0, 3).join('\n')}`;
      }

      await ctx.reply(response);
    } catch (error) {
      console.error('Sync error:', error);
      await ctx.reply(`❌ Sync failed: ${error.message}\n\nCheck API credentials and endpoint configuration.`);
    }
  });

  // /addmatch - Add match manually
  bot.command('addmatch', isAdmin, async (ctx) => {
    const message = `
📝 *Add Match Manually*

Format:
/addmatch_matchId_Team1_Team2_Date_Venue

Example:
/addmatch_MATCH123_India_Pakistan_2025-10-15T14:00_Dubai

Date format: YYYY-MM-DDTHH:mm
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle manual match addition
  bot.hears(/^\/addmatch_(.+)_(.+)_(.+)_(.+)_(.+)$/, isAdmin, async (ctx) => {
    const [, matchId, team1, team2, dateStr, venue] = ctx.match;

    try {
      const match = await Match.create({
        match_id: matchId,
        name: `${team1} vs ${team2}`,
        team1,
        team2,
        match_type: 'T20',
        venue,
        match_date: new Date(dateStr),
        status: 'upcoming'
      });

      await ctx.reply(`✅ Match added successfully!\n\nMatch ID: ${match.match_id}\n${match.team1} vs ${match.team2}\n${new Date(match.match_date).toLocaleString()}`);
    } catch (error) {
      await ctx.reply(`❌ Failed to add match: ${error.message}`);
    }
  });

  // /createcontest - Create contest
  bot.command('createcontest', isAdmin, async (ctx) => {
    const message = `
🎯 *Create Contest*

Format:
/createcontest_matchId_name_entryFee_prizePool_maxSpots

Example:
/createcontest_1_MegaContest_10_1000_100

This creates:
- Contest for match ID 1
- Name: "MegaContest"
- Entry fee: $10
- Prize pool: $1000
- Max spots: 100
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle contest creation
  bot.hears(/^\/createcontest_(\d+)_(.+)_(\d+(?:\.\d+)?)_(\d+(?:\.\d+)?)_(\d+)$/, isAdmin, async (ctx) => {
    const [, matchId, name, entryFee, prizePool, maxSpots] = ctx.match;

    try {
      const match = await Match.findById(matchId);
      if (!match) {
        return ctx.reply('❌ Match not found.');
      }

      const contest = await Contest.create({
        match_id: matchId,
        name,
        entry_fee: parseFloat(entryFee),
        prize_pool: parseFloat(prizePool),
        max_spots: parseInt(maxSpots)
      });

      await ctx.reply(`✅ Contest created!\n\nID: ${contest.contest_id}\nMatch: ${match.name}\nEntry: $${contest.entry_fee}\nPrize Pool: $${contest.prize_pool}\nMax Spots: ${contest.max_spots}`);
    } catch (error) {
      await ctx.reply(`❌ Failed to create contest: ${error.message}`);
    }
  });

  // /listmatches - List all matches
  bot.command('listmatches', isAdmin, async (ctx) => {
    const upcoming = await Match.getUpcoming(20);

    if (upcoming.length === 0) {
      return ctx.reply('No upcoming matches found.');
    }

    let message = '📋 *All Matches*\n\n';

    for (const match of upcoming) {
      message += `ID: ${match.id} | ${match.match_id}\n`;
      message += `${match.team1} vs ${match.team2}\n`;
      message += `Status: ${match.status}\n`;
      message += `Date: ${new Date(match.match_date).toLocaleString()}\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /finduser - Find user by username or name
  bot.command('finduser', isAdmin, async (ctx) => {
    const message = `
🔍 *Find User*

Format:
/finduser_searchTerm

Example:
/finduser_john
/finduser_@username

This will search for users by name or username.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle find user
  bot.hears(/^\/finduser_(.+)$/, isAdmin, async (ctx) => {
    const searchTerm = ctx.match[1].toLowerCase().replace('@', '');

    try {
      const users = await User.getAll();
      const matches = users.filter(user => {
        const firstName = (user.firstName || '').toLowerCase();
        const lastName = (user.lastName || '').toLowerCase();
        const username = (user.username || '').toLowerCase();

        return firstName.includes(searchTerm) ||
               lastName.includes(searchTerm) ||
               username.includes(searchTerm);
      });

      if (matches.length === 0) {
        return ctx.reply('❌ No users found matching that search.');
      }

      let message = `🔍 *Found ${matches.length} user(s):*\n\n`;

      matches.slice(0, 10).forEach(user => {
        const displayName = user.username ? `@${user.username}` : user.firstName;
        message += `👤 *${displayName}*\n`;
        message += `   User ID: \`${user.telegramId}\`\n`;
        message += `   Name: ${user.firstName} ${user.lastName || ''}\n`;
        message += `   Balance: $${user.walletBalance}\n`;
        message += `   Referrals: ${user.totalReferrals}\n\n`;
      });

      if (matches.length > 10) {
        message += `\n... and ${matches.length - 10} more results`;
      }

      await ctx.reply(message, { parse_mode: 'Markdown' });
    } catch (error) {
      console.error('Error finding user:', error);
      await ctx.reply('❌ Failed to search users.');
    }
  });

  // /viewusers - View user statistics
  bot.command('viewusers', isAdmin, async (ctx) => {
    const users = await User.getAll();
    const totalUsers = users.length;
    const totalBalance = users.reduce((sum, user) => sum + parseFloat(user.walletBalance), 0);

    let message = '👥 *User Statistics*\n\n';
    message += `Total Users: ${totalUsers}\n`;
    message += `Total Wallet Balance: $${totalBalance.toFixed(2)}\n\n`;

    message += '*Recent Users:*\n';
    users.slice(0, 10).forEach(user => {
      const name = user.username ? `@${user.username}` : user.firstName;
      const userId = user.telegramId;
      message += `${name} (ID: \`${userId}\`) - $${user.walletBalance}\n`;
    });

    message += '\n💡 Use /finduser to search for specific users';

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /transactions - View all transactions
  bot.command('transactions', isAdmin, async (ctx) => {
    const transactions = await Transaction.getAll(20);

    if (transactions.length === 0) {
      return ctx.reply('No transactions found.');
    }

    let message = '💳 *Recent Transactions*\n\n';

    for (const txn of transactions) {
      const name = txn.username ? `@${txn.username}` : txn.first_name;
      message += `${txn.transaction_id}\n`;
      message += `User: ${name}\n`;
      message += `Type: ${txn.type} | Amount: $${txn.amount}\n`;
      message += `Status: ${txn.status}\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // /approvewithdraw - Approve withdrawal
  bot.command('approvewithdraw', isAdmin, async (ctx) => {
    const pending = await Transaction.getPending('withdraw');

    if (pending.length === 0) {
      return ctx.reply('No pending withdrawals.');
    }

    let message = '💸 *Pending Withdrawals*\n\n';

    for (const txn of pending) {
      message += `ID: ${txn.transaction_id}\n`;
      message += `User ID: ${txn.user_id}\n`;
      message += `Amount: $${txn.amount}\n`;
      message += `Wallet: ${txn.metadata.wallet_address}\n`;
      message += `To approve: /approve_${txn.transaction_id}_txHash\n\n`;
    }

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle withdrawal approval
  bot.hears(/^\/approve_(.+?)_(.+)$/, isAdmin, async (ctx) => {
    const [, transactionId, txHash] = ctx.match;

    const result = await WalletService.approveWithdrawal(bot, transactionId, txHash);

    if (result.success) {
      await ctx.reply(`✅ Withdrawal approved!\n\nTransaction: ${transactionId}\nTx Hash: ${txHash}`);
    } else {
      await ctx.reply(`❌ Approval failed: ${result.error}`);
    }
  });

  // /rejectwithdraw - Reject withdrawal
  bot.hears(/^\/reject_(.+?)_(.+)$/, isAdmin, async (ctx) => {
    const [, transactionId, reason] = ctx.match;

    const result = await WalletService.rejectWithdrawal(bot, transactionId, reason);

    if (result.success) {
      await ctx.reply(`✅ Withdrawal rejected and refunded.\n\nTransaction: ${transactionId}`);
    } else {
      await ctx.reply(`❌ Rejection failed: ${result.error}`);
    }
  });

  // /broadcast - Send message to all users
  bot.command('broadcast', isAdmin, async (ctx) => {
    const message = `
📢 *Broadcast Message*

Format:
/broadcast_Title_Message

Example:
/broadcast_New Feature_We just added leaderboard!

This will send the message to all active users.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle broadcast
  bot.hears(/^\/broadcast_(.+?)_(.+)$/, isAdmin, async (ctx) => {
    const [, title, message] = ctx.match;

    await ctx.reply('📤 Sending broadcast...');

    const count = await NotificationService.broadcastToAll(bot, title, message);

    await ctx.reply(`✅ Broadcast sent to ${count} users!`);
  });

  // /addbalance - Add balance to user
  bot.command('addbalance', isAdmin, async (ctx) => {
    const message = `
💰 *Add Balance to User*

Format:
/addbalance_userId_amount

Example:
/addbalance_1784287150_100

This will add $100 to the user's wallet.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle add balance
  bot.hears(/^\/addbalance_(\d+)_(\d+(?:\.\d+)?)$/, isAdmin, async (ctx) => {
    const [, userId, amount] = ctx.match;
    const telegramId = parseInt(userId);
    const addAmount = parseFloat(amount);

    try {
      const user = await User.findByTelegramId(telegramId);
      if (!user) {
        return ctx.reply('❌ User not found.');
      }

      await User.updateBalance(telegramId, addAmount, 'add');
      const updatedUser = await User.findByTelegramId(telegramId);

      await ctx.reply(`✅ Added $${addAmount} to user ${user.firstName}'s wallet!\n\nPrevious balance: $${user.walletBalance}\nNew balance: $${updatedUser.walletBalance}`);
    } catch (error) {
      console.error('Error adding balance:', error);
      await ctx.reply('❌ Failed to add balance.');
    }
  });

  // /subtractbalance - Subtract balance from user
  bot.command('subtractbalance', isAdmin, async (ctx) => {
    const message = `
💸 *Subtract Balance from User*

Format:
/subtractbalance_userId_amount

Example:
/subtractbalance_1784287150_50

This will subtract $50 from the user's wallet.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle subtract balance
  bot.hears(/^\/subtractbalance_(\d+)_(\d+(?:\.\d+)?)$/, isAdmin, async (ctx) => {
    const [, userId, amount] = ctx.match;
    const telegramId = parseInt(userId);
    const subtractAmount = parseFloat(amount);

    try {
      const user = await User.findByTelegramId(telegramId);
      if (!user) {
        return ctx.reply('❌ User not found.');
      }

      if (user.walletBalance < subtractAmount) {
        return ctx.reply(`❌ User doesn't have enough balance!\n\nCurrent balance: $${user.walletBalance}\nRequested to subtract: $${subtractAmount}`);
      }

      await User.updateBalance(telegramId, subtractAmount, 'subtract');
      const updatedUser = await User.findByTelegramId(telegramId);

      await ctx.reply(`✅ Subtracted $${subtractAmount} from user ${user.firstName}'s wallet!\n\nPrevious balance: $${user.walletBalance}\nNew balance: $${updatedUser.walletBalance}`);
    } catch (error) {
      console.error('Error subtracting balance:', error);
      await ctx.reply('❌ Failed to subtract balance.');
    }
  });

  // /setbalance - Set exact balance for user
  bot.command('setbalance', isAdmin, async (ctx) => {
    const message = `
💳 *Set User Balance*

Format:
/setbalance_userId_amount

Example:
/setbalance_1784287150_500

This will set the user's wallet balance to exactly $500.
    `.trim();

    await ctx.reply(message, { parse_mode: 'Markdown' });
  });

  // Handle set balance
  bot.hears(/^\/setbalance_(\d+)_(\d+(?:\.\d+)?)$/, isAdmin, async (ctx) => {
    const [, userId, amount] = ctx.match;
    const telegramId = parseInt(userId);
    const newBalance = parseFloat(amount);

    try {
      const user = await User.findByTelegramId(telegramId);
      if (!user) {
        return ctx.reply('❌ User not found.');
      }

      // Calculate difference and update
      const difference = newBalance - user.walletBalance;
      if (difference > 0) {
        await User.updateBalance(telegramId, difference, 'add');
      } else if (difference < 0) {
        await User.updateBalance(telegramId, Math.abs(difference), 'subtract');
      }

      const updatedUser = await User.findByTelegramId(telegramId);

      await ctx.reply(`✅ Set ${user.firstName}'s wallet balance to $${newBalance}!\n\nPrevious balance: $${user.walletBalance}\nNew balance: $${updatedUser.walletBalance}`);
    } catch (error) {
      console.error('Error setting balance:', error);
      await ctx.reply('❌ Failed to set balance.');
    }
  });
};
