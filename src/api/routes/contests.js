import express from 'express';
import { ContestModel as Contest } from '../../models/Contest.js';
import { UserModel as User } from '../../models/User.js';
import { TeamModel as Team } from '../../models/Team.js';

const router = express.Router();

// GET /api/contests/:id - Get contest details
router.get('/:id', async (req, res) => {
  try {
    const contest = await Contest.findById(req.params.id);

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    res.json({
      success: true,
      data: contest
    });
  } catch (error) {
    console.error('Error fetching contest:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contest' });
  }
});

// POST /api/contests/:id/enter - Enter a contest
router.post('/:id/enter', async (req, res) => {
  try {
    const userId = req.telegramUser?.id;
    const contestId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, error: 'User not authenticated' });
    }

    // Find the contest
    const contest = await Contest.findById(contestId);

    if (!contest) {
      return res.status(404).json({ success: false, error: 'Contest not found' });
    }

    // Check if contest is full
    const isFull = await Contest.isFull(contest.contestId);
    if (isFull) {
      return res.status(400).json({ success: false, error: 'Contest is full' });
    }

    // Check user balance
    const user = await User.findByTelegramId(userId);
    if (user.walletBalance < contest.entryFee) {
      return res.status(400).json({
        success: false,
        error: 'Insufficient balance',
        required: contest.entryFee,
        current: user.walletBalance
      });
    }

    // Create team entry
    const team = await Team.create({
      user_telegram_id: userId,
      contest_id: contest._id,
      match_id: contest.matchId,
      players: req.body.players || [],
      captain: req.body.captain || null,
      vice_captain: req.body.viceCaptain || null
    });

    // Deduct entry fee
    await User.updateBalance(userId, contest.entryFee, 'subtract');

    // Increment contest participants
    await Contest.incrementJoinedUsers(contest.contestId);

    res.json({
      success: true,
      data: {
        team,
        newBalance: user.walletBalance - contest.entryFee
      }
    });
  } catch (error) {
    console.error('Error entering contest:', error);
    res.status(500).json({ success: false, error: 'Failed to enter contest' });
  }
});

// GET /api/contests/:id/leaderboard - Get contest leaderboard
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const contestId = req.params.id;
    const limit = parseInt(req.query.limit) || 50;

    const leaderboard = await Team.getLeaderboard(contestId, limit);

    res.json({
      success: true,
      data: leaderboard
    });
  } catch (error) {
    console.error('Error fetching leaderboard:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch leaderboard' });
  }
});

export default router;
