import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  username: String,
  firstName: String,
  lastName: String,
  walletBalance: {
    type: Number,
    default: 0
  },
  referralCode: {
    type: String,
    unique: true,
    required: true,
    index: true
  },
  referredBy: {
    type: Number,
    default: null
  },
  totalReferrals: {
    type: Number,
    default: 0
  },
  referralEarnings: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const User = mongoose.model('User', userSchema);

export class UserModel {
  static async create(telegramUser, referredBy = null) {
    const referralCode = uuidv4().substring(0, 8).toUpperCase();

    const user = new User({
      telegramId: telegramUser.id,
      username: telegramUser.username || null,
      firstName: telegramUser.first_name || null,
      lastName: telegramUser.last_name || null,
      referralCode,
      referredBy
    });

    await user.save();
    return user;
  }

  static async findByTelegramId(telegramId) {
    return await User.findOne({ telegramId });
  }

  static async findByReferralCode(referralCode) {
    return await User.findOne({ referralCode });
  }

  static async updateBalance(telegramId, amount, operation = 'add') {
    const updateQuery = operation === 'add'
      ? { $inc: { walletBalance: amount } }
      : { $inc: { walletBalance: -amount } };

    return await User.findOneAndUpdate(
      { telegramId },
      updateQuery,
      { new: true }
    );
  }

  static async getBalance(telegramId) {
    const user = await User.findOne({ telegramId });
    return user ? user.walletBalance : 0;
  }

  static async incrementReferrals(telegramId) {
    return await User.findOneAndUpdate(
      { telegramId },
      { $inc: { totalReferrals: 1 } }
    );
  }

  static async addReferralEarnings(telegramId, amount) {
    return await User.findOneAndUpdate(
      { telegramId },
      { $inc: { referralEarnings: amount } }
    );
  }

  static async getTopReferrers(limit = 10) {
    return await User.find()
      .sort({ totalReferrals: -1 })
      .limit(limit)
      .select('telegramId username firstName totalReferrals referralEarnings');
  }

  static async getAll() {
    return await User.find({ isActive: true });
  }

  static async count() {
    return await User.countDocuments();
  }
}

export { User };
