import { UserModel as User } from '../models/User.js';
import { TransactionModel as Transaction } from '../models/Transaction.js';
import { NotificationService } from './notificationService.js';

export class WalletService {
  static async deposit(userId, amount, txHash = null, metadata = {}) {
    try {
      // Create transaction record
      const transaction = await Transaction.create({
        user_id: userId,
        type: 'deposit',
        amount,
        status: 'completed',
        tx_hash: txHash,
        description: `Deposit of $${amount}`,
        metadata
      });

      // Update user balance
      await User.updateBalance(userId, amount, 'add');

      return {
        success: true,
        transaction
      };
    } catch (error) {
      console.error('Deposit failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async withdraw(userId, amount, walletAddress) {
    try {
      const user = await User.findByTelegramId(userId);

      // Check if user has sufficient balance
      if (user.wallet_balance < amount) {
        return {
          success: false,
          error: 'Insufficient balance'
        };
      }

      // Create pending transaction
      const transaction = await Transaction.create({
        user_id: userId,
        type: 'withdraw',
        amount,
        status: 'pending',
        description: `Withdrawal of $${amount}`,
        metadata: { wallet_address: walletAddress }
      });

      // Deduct from balance immediately
      await User.updateBalance(userId, amount, 'subtract');

      return {
        success: true,
        transaction,
        message: 'Withdrawal request submitted. Admin approval required.'
      };
    } catch (error) {
      console.error('Withdrawal failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async approveWithdrawal(bot, transactionId, txHash) {
    try {
      const transaction = await Transaction.findByTransactionId(transactionId);

      if (!transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      if (transaction.status !== 'pending') {
        return { success: false, error: 'Transaction already processed' };
      }

      // Update transaction status
      await Transaction.updateStatus(transactionId, 'completed', txHash);

      // Notify user
      await NotificationService.notifyWithdrawal(
        bot,
        transaction.user_id,
        transaction.amount,
        'completed'
      );

      return {
        success: true,
        message: 'Withdrawal approved'
      };
    } catch (error) {
      console.error('Withdrawal approval failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async rejectWithdrawal(bot, transactionId, reason) {
    try {
      const transaction = await Transaction.findByTransactionId(transactionId);

      if (!transaction) {
        return { success: false, error: 'Transaction not found' };
      }

      if (transaction.status !== 'pending') {
        return { success: false, error: 'Transaction already processed' };
      }

      // Refund the amount
      await User.updateBalance(transaction.user_id, transaction.amount, 'add');

      // Update transaction status
      await Transaction.updateStatus(transactionId, 'rejected');

      // Notify user
      await NotificationService.sendToUser(
        bot,
        transaction.user_id,
        '❌ Withdrawal Rejected',
        `Your withdrawal request for $${transaction.amount} has been rejected.\n\nReason: ${reason}\n\nThe amount has been refunded to your wallet.`
      );

      return {
        success: true,
        message: 'Withdrawal rejected and refunded'
      };
    } catch (error) {
      console.error('Withdrawal rejection failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async getBalance(userId) {
    return await User.getBalance(userId);
  }

  static async getTransactionHistory(userId, type = null) {
    return await Transaction.getUserTransactions(userId, type);
  }

  static async deductEntryFee(userId, amount, contestId) {
    try {
      const user = await User.findByTelegramId(userId);

      if (user.wallet_balance < amount) {
        return {
          success: false,
          error: 'Insufficient balance'
        };
      }

      // Create transaction
      await Transaction.create({
        user_id: userId,
        type: 'contest_entry',
        amount,
        status: 'completed',
        description: `Contest entry fee`,
        metadata: { contest_id: contestId }
      });

      // Deduct from balance
      await User.updateBalance(userId, amount, 'subtract');

      return { success: true };
    } catch (error) {
      console.error('Entry fee deduction failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async addWinnings(userId, amount, contestId, rank) {
    try {
      // Create transaction
      await Transaction.create({
        user_id: userId,
        type: 'winnings',
        amount,
        status: 'completed',
        description: `Contest winnings (Rank #${rank})`,
        metadata: { contest_id: contestId, rank }
      });

      // Add to balance
      await User.updateBalance(userId, amount, 'add');

      return { success: true };
    } catch (error) {
      console.error('Adding winnings failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}
