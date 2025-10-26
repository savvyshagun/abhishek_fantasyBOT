import express from 'express';
import { MatchModel as Match } from '../../models/Match.js';
import { ContestModel as Contest } from '../../models/Contest.js';

const router = express.Router();

// GET /api/matches - Get upcoming matches
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const matches = await Match.getUpcoming(limit);

    res.json({
      success: true,
      data: matches
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch matches' });
  }
});

// GET /api/matches/:id - Get match details
router.get('/:id', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }

    res.json({
      success: true,
      data: match
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch match' });
  }
});

// GET /api/matches/:id/contests - Get contests for a match
router.get('/:id/contests', async (req, res) => {
  try {
    const match = await Match.findById(req.params.id);

    if (!match) {
      return res.status(404).json({ success: false, error: 'Match not found' });
    }

    const contests = await Contest.getByMatchId(match._id);

    res.json({
      success: true,
      data: {
        match,
        contests
      }
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contests' });
  }
});

export default router;
