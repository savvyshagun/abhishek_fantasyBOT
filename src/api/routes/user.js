import express from 'express';
import { UserModel as User } from '../../models/User.js';
import { ContestModel as Contest } from '../../models/Contest.js';
import { TeamModel as Team } from '../../models/Team.js';
import { WalletService } from '../../services/walletService.js';

const router = express.Router();

// GET /api/user/profile - Get user profile
router.get('/profile', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const user = await User.findByTelegramId(userId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({
      success: true,
      data: {
        telegramId: user.telegramId,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        walletBalance: user.walletBalance,
        referralCode: user.referralCode,
        totalReferrals: user.totalReferrals,
        referralEarnings: user.referralEarnings
      }
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch profile' });
  }
});

// GET /api/user/wallet - Get wallet info
router.get('/wallet', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const user = await User.findByTelegramId(userId);
    const transactions = await WalletService.getTransactionHistory(userId, 10);

    res.json({
      success: true,
      data: {
        balance: user.walletBalance,
        referralEarnings: user.referralEarnings,
        transactions
      }
    });
  } catch (error) {
    console.error('Error fetching wallet:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch wallet' });
  }
});

// GET /api/user/contests - Get user's contests
router.get('/contests', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    const contests = await Contest.getUserContests(userId);

    res.json({
      success: true,
      data: contests
    });
  } catch (error) {
    console.error('Error fetching user contests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contests' });
  }
});

// GET /api/user/teams - Get user's teams
router.get('/teams', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Find all teams for this user (you may need to add this method to Team model)
    const Team = await import('../../models/Team.js');
    const teams = await Team.Team.find({ userTelegramId: userId })
      .populate('contestId')
      .populate('matchId')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: teams
    });
  } catch (error) {
    console.error('Error fetching user teams:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch teams' });
  }
});

export default router;
