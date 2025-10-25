import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const transactionSchema = new mongoose.Schema({
  transactionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userTelegramId: {
    type: Number,
    required: true,
    index: true
  },
  type: {
    type: String,
    required: true,
    enum: ['deposit', 'withdraw', 'contest_entry', 'winnings', 'referral'],
    index: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    default: 'pending',
    enum: ['pending', 'completed', 'rejected', 'failed'],
    index: true
  },
  txHash: String,
  description: String,
  metadata: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const Transaction = mongoose.model('Transaction', transactionSchema);

export class TransactionModel {
  static async create(transactionData) {
    const transactionId = `TXN_${uuidv4().substring(0, 12).toUpperCase()}`;

    const transaction = new Transaction({
      transactionId,
      userTelegramId: transactionData.user_id,
      type: transactionData.type,
      amount: transactionData.amount,
      status: transactionData.status || 'pending',
      txHash: transactionData.tx_hash || null,
      description: transactionData.description || null,
      metadata: transactionData.metadata || {}
    });

    await transaction.save();
    return transaction;
  }

  static async findByTransactionId(transactionId) {
    return await Transaction.findOne({ transactionId });
  }

  static async getUserTransactions(telegramId, type = null, limit = 50) {
    const query = { userTelegramId: telegramId };
    if (type) query.type = type;

    return await Transaction.find(query)
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  static async updateStatus(transactionId, status, txHash = null) {
    const update = { status };
    if (txHash) update.txHash = txHash;

    return await Transaction.findOneAndUpdate(
      { transactionId },
      update,
      { new: true }
    );
  }

  static async getPending(type = null) {
    const query = { status: 'pending' };
    if (type) query.type = type;

    return await Transaction.find(query)
      .sort({ createdAt: 1 });
  }

  static async getAll(limit = 100) {
    return await Transaction.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }
}

export { Transaction };
