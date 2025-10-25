import mongoose from '../database/connection.js';

// Player Stats Schema
const playerStatsSchema = new mongoose.Schema({
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true
  },
  playerName: {
    type: String,
    required: true,
    index: true
  },
  runs: { type: Number, default: 0 },
  wickets: { type: Number, default: 0 },
  catches: { type: Number, default: 0 },
  stumpings: { type: Number, default: 0 },
  runOuts: { type: Number, default: 0 },
  fours: { type: Number, default: 0 },
  sixes: { type: Number, default: 0 },
  strikeRate: { type: Number, default: 0 },
  economyRate: { type: Number, default: 0 },
  bonusPoints: { type: Number, default: 0 },
  totalPoints: { type: Number, default: 0 }
}, {
  timestamps: true
});

const PlayerStats = mongoose.model('PlayerStats', playerStatsSchema);

export class FantasyScoringService {
  // Fantasy Cricket Scoring Rules
  static SCORING_RULES = {
    // Batting
    RUN: 1,
    FOUR: 1,
    SIX: 2,
    HALF_CENTURY: 8,
    CENTURY: 16,
    DUCK: -2,

    // Bowling
    WICKET: 25,
    MAIDEN_OVER: 12,
    FIVE_WICKET_HAUL: 16,

    // Fielding
    CATCH: 8,
    STUMPING: 12,
    RUN_OUT: 12,

    // Strike Rate Bonus (per 100 balls faced, minimum 10 balls)
    SR_ABOVE_170: 6,
    SR_150_170: 4,
    SR_130_150: 2,
    SR_60_70: -2,
    SR_BELOW_60: -4,

    // Economy Rate Bonus (per 4 overs bowled, minimum 2 overs)
    ER_BELOW_5: 6,
    ER_5_6: 4,
    ER_6_7: 2,
    ER_10_11: -2,
    ER_ABOVE_11: -4
  };

  static calculateBattingPoints(runs, fours, sixes, strikeRate, ballsFaced) {
    let points = 0;

    // Run points
    points += runs * this.SCORING_RULES.RUN;

    // Boundary bonus
    points += fours * this.SCORING_RULES.FOUR;
    points += sixes * this.SCORING_RULES.SIX;

    // Milestone bonus
    if (runs >= 100) {
      points += this.SCORING_RULES.CENTURY;
    } else if (runs >= 50) {
      points += this.SCORING_RULES.HALF_CENTURY;
    } else if (runs === 0 && ballsFaced > 0) {
      points += this.SCORING_RULES.DUCK;
    }

    // Strike rate bonus (if played at least 10 balls)
    if (ballsFaced >= 10) {
      if (strikeRate > 170) {
        points += this.SCORING_RULES.SR_ABOVE_170;
      } else if (strikeRate >= 150) {
        points += this.SCORING_RULES.SR_150_170;
      } else if (strikeRate >= 130) {
        points += this.SCORING_RULES.SR_130_150;
      } else if (strikeRate >= 60 && strikeRate < 70) {
        points += this.SCORING_RULES.SR_60_70;
      } else if (strikeRate < 60) {
        points += this.SCORING_RULES.SR_BELOW_60;
      }
    }

    return points;
  }

  static calculateBowlingPoints(wickets, maidenOvers, economyRate, oversBowled) {
    let points = 0;

    // Wicket points
    points += wickets * this.SCORING_RULES.WICKET;

    // Maiden over bonus
    points += maidenOvers * this.SCORING_RULES.MAIDEN_OVER;

    // Five wicket haul
    if (wickets >= 5) {
      points += this.SCORING_RULES.FIVE_WICKET_HAUL;
    }

    // Economy rate bonus (if bowled at least 2 overs)
    if (oversBowled >= 2) {
      if (economyRate < 5) {
        points += this.SCORING_RULES.ER_BELOW_5;
      } else if (economyRate < 6) {
        points += this.SCORING_RULES.ER_5_6;
      } else if (economyRate < 7) {
        points += this.SCORING_RULES.ER_6_7;
      } else if (economyRate >= 10 && economyRate < 11) {
        points += this.SCORING_RULES.ER_10_11;
      } else if (economyRate >= 11) {
        points += this.SCORING_RULES.ER_ABOVE_11;
      }
    }

    return points;
  }

  static calculateFieldingPoints(catches, stumpings, runOuts) {
    let points = 0;

    points += catches * this.SCORING_RULES.CATCH;
    points += stumpings * this.SCORING_RULES.STUMPING;
    points += runOuts * this.SCORING_RULES.RUN_OUT;

    return points;
  }

  static async calculatePlayerPoints(playerName, matchStats) {
    const stats = matchStats[playerName];
    if (!stats) return 0;

    let totalPoints = 0;

    // Batting points
    totalPoints += this.calculateBattingPoints(
      stats.runs || 0,
      stats.fours || 0,
      stats.sixes || 0,
      stats.strike_rate || 0,
      stats.balls_faced || 0
    );

    // Bowling points
    totalPoints += this.calculateBowlingPoints(
      stats.wickets || 0,
      stats.maiden_overs || 0,
      stats.economy_rate || 0,
      stats.overs_bowled || 0
    );

    // Fielding points
    totalPoints += this.calculateFieldingPoints(
      stats.catches || 0,
      stats.stumpings || 0,
      stats.run_outs || 0
    );

    return totalPoints;
  }

  static async updatePlayerStats(matchId, playerStats) {
    for (const [playerName, stats] of Object.entries(playerStats)) {
      const totalPoints = await this.calculatePlayerPoints(playerName, playerStats);

      await PlayerStats.findOneAndUpdate(
        { matchId, playerName },
        {
          matchId,
          playerName,
          runs: stats.runs || 0,
          wickets: stats.wickets || 0,
          catches: stats.catches || 0,
          stumpings: stats.stumpings || 0,
          runOuts: stats.run_outs || 0,
          fours: stats.fours || 0,
          sixes: stats.sixes || 0,
          strikeRate: stats.strike_rate || 0,
          economyRate: stats.economy_rate || 0,
          totalPoints
        },
        { upsert: true, new: true }
      );
    }
  }

  static async getPlayerStatsForMatch(matchId) {
    return await PlayerStats.find({ matchId });
  }
}
