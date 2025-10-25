import mongoose from 'mongoose';

const referralSchema = new mongoose.Schema({
  referrerTelegramId: {
    type: Number,
    required: true,
    index: true
  },
  referredTelegramId: {
    type: Number,
    required: true,
    index: true
  },
  rewardAmount: {
    type: Number,
    default: 10
  },
  rewardClaimed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

const Referral = mongoose.model('Referral', referralSchema);

export class ReferralModel {
  static async create(referrerTelegramId, referredTelegramId, rewardAmount = 10) {
    const referral = new Referral({
      referrerTelegramId,
      referredTelegramId,
      rewardAmount
    });

    await referral.save();
    return referral;
  }

  static async getUserReferrals(telegramId) {
    return await Referral.find({ referrerTelegramId: telegramId })
      .sort({ createdAt: -1 });
  }

  static async claimRewards(telegramId) {
    const result = await Referral.updateMany(
      {
        referrerTelegramId: telegramId,
        rewardClaimed: false
      },
      { rewardClaimed: true }
    );

    return result.modifiedCount;
  }

  static async getUnclaimedRewards(telegramId) {
    const referrals = await Referral.find({
      referrerTelegramId: telegramId,
      rewardClaimed: false
    });

    return referrals.reduce((sum, ref) => sum + ref.rewardAmount, 0);
  }

  static async getTotalEarned(telegramId) {
    const referrals = await Referral.find({
      referrerTelegramId: telegramId
    });

    return referrals.reduce((sum, ref) => sum + ref.rewardAmount, 0);
  }
}

export { Referral };
