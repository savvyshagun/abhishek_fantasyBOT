import mongoose from '../database/connection.js';
import { UserModel } from '../models/User.js';

// Notification Schema
const notificationSchema = new mongoose.Schema({
  userTelegramId: {
    type: Number,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  message: {
    type: String,
    required: true
  },
  isRead: {
    type: Boolean,
    default: false,
    index: true
  },
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const Notification = mongoose.model('Notification', notificationSchema);

export class NotificationService {
  static async create(userId, type, title, message, metadata = {}) {
    const notification = new Notification({
      userTelegramId: userId,
      type,
      title,
      message,
      metadata
    });

    await notification.save();
  }

  static async sendToUser(bot, userId, title, message) {
    try {
      await bot.telegram.sendMessage(userId, `*${title}*\n\n${message}`, {
        parse_mode: 'Markdown'
      });

      await this.create(userId, 'info', title, message);
      return true;
    } catch (error) {
      console.error(`Failed to send notification to user ${userId}:`, error.message);
      return false;
    }
  }

  static async broadcastToAll(bot, title, message) {
    try {
      const users = await UserModel.getAll();

      let successCount = 0;
      for (const user of users) {
        try {
          await bot.telegram.sendMessage(user.telegramId, `*${title}*\n\n${message}`, {
            parse_mode: 'Markdown'
          });
          successCount++;
        } catch (error) {
          console.error(`Failed to send to user ${user.telegramId}:`, error.message);
        }
      }

      console.log(`Broadcast sent to ${successCount}/${users.length} users`);
      return successCount;
    } catch (error) {
      console.error('Broadcast failed:', error);
      return 0;
    }
  }

  static async notifyMatchStart(bot, matchId) {
    const { TeamModel } = await import('../models/Team.js');
    const { MatchModel } = await import('../models/Match.js');

    const teams = await TeamModel.getContestTeams(matchId);
    const match = await MatchModel.findById(matchId);

    if (!match) return;

    const uniqueUsers = [...new Set(teams.map(t => t.userTelegramId))];

    for (const telegramId of uniqueUsers) {
      const title = '🏏 Match Starting Soon!';
      const message = `${match.name}\n${match.team1} vs ${match.team2}\n\nYour teams are ready! Good luck!`;

      await this.sendToUser(bot, telegramId, title, message);
    }
  }

  static async notifyContestResult(bot, userId, contestName, rank, prize) {
    const title = '🎉 Contest Results';
    let message = `Contest: ${contestName}\nYour Rank: #${rank}`;

    if (prize > 0) {
      message += `\n\n💰 You won $${prize}!\nThe amount has been added to your wallet.`;
    }

    await this.sendToUser(bot, userId, title, message);
  }

  static async notifyDeposit(bot, userId, amount) {
    const title = '💵 Deposit Successful';
    const message = `$${amount} has been added to your wallet.`;
    await this.sendToUser(bot, userId, title, message);
  }

  static async notifyWithdrawal(bot, userId, amount, status) {
    const title = status === 'completed' ? '✅ Withdrawal Completed' : '⏳ Withdrawal Processing';
    const message = status === 'completed'
      ? `$${amount} has been sent to your wallet.`
      : `Your withdrawal request for $${amount} is being processed.`;

    await this.sendToUser(bot, userId, title, message);
  }

  static async getUserNotifications(userId, limit = 20) {
    return await Notification.find({ userTelegramId: userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async markAsRead(notificationId) {
    return await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
  }
}
