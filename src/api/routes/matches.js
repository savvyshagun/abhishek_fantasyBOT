import express from 'express';
import { MatchModel as Match } from '../../models/Match.js';
import { ContestModel as Contest } from '../../models/Contest.js';

const router = express.Router();

// Helper function to transform match data for Mini App
function transformMatchForMiniApp(match) {
  const matchObj = match.toObject ? match.toObject() : match;

  // Extract team info from apiData if available
  const teamInfo = matchObj.apiData?.teamInfo || [];

  // Find team data by name
  const team1Info = teamInfo.find(t => t.name === matchObj.team1) || {};
  const team2Info = teamInfo.find(t => t.name === matchObj.team2) || {};

  return {
    ...matchObj,
    team1: {
      name: matchObj.team1,
      shortname: team1Info.shortname || matchObj.team1.substring(0, 3).toUpperCase(),
      flag: '🏏', // Default flag, can be enhanced later
      img: team1Info.img || null
    },
    team2: {
      name: matchObj.team2,
      shortname: team2Info.shortname || matchObj.team2.substring(0, 3).toUpperCase(),
      flag: '🏏', // Default flag, can be enhanced later
      img: team2Info.img || null
    }
  };
}

// GET /api/matches - Get upcoming matches
router.get('/', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const matches = await Match.getUpcoming(limit);

    // Transform matches for Mini App
    const transformedMatches = matches.map(match => transformMatchForMiniApp(match));

    res.json({
      success: true,
      data: transformedMatches
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
      data: transformMatchForMiniApp(match)
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
        match: transformMatchForMiniApp(match),
        contests
      }
    });
  } catch (error) {
    console.error('Error fetching contests:', error);
    res.status(500).json({ success: false, error: 'Failed to fetch contests' });
  }
});

export default router;
