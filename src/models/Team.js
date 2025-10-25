import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const teamSchema = new mongoose.Schema({
  teamId: {
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
  contestId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Contest',
    required: true,
    index: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true
  },
  players: {
    type: [mongoose.Schema.Types.Mixed],
    required: true
  },
  captain: String,
  viceCaptain: String,
  totalPoints: {
    type: Number,
    default: 0
  },
  rank: Number
}, {
  timestamps: true
});

const Team = mongoose.model('Team', teamSchema);

export class TeamModel {
  static async create(teamData) {
    const teamId = `TEAM_${uuidv4().substring(0, 8).toUpperCase()}`;

    const team = new Team({
      teamId,
      userTelegramId: teamData.user_id,
      contestId: teamData.contest_id,
      matchId: teamData.match_id,
      players: teamData.players,
      captain: teamData.captain,
      viceCaptain: teamData.vice_captain
    });

    await team.save();
    return team;
  }

  static async findByTeamId(teamId) {
    return await Team.findOne({ teamId });
  }

  static async getUserTeams(telegramId, matchId = null) {
    const query = { userTelegramId: telegramId };
    if (matchId) query.matchId = matchId;

    return await Team.find(query);
  }

  static async getContestTeams(contestId) {
    return await Team.find({ contestId })
      .sort({ totalPoints: -1 });
  }

  static async updatePoints(teamId, points) {
    return await Team.findOneAndUpdate(
      { teamId },
      { totalPoints: points },
      { new: true }
    );
  }

  static async updateRank(teamId, rank) {
    return await Team.findOneAndUpdate(
      { teamId },
      { rank },
      { new: true }
    );
  }

  static async calculateAndUpdatePoints(matchId, playerStats) {
    const teams = await Team.find({ matchId });

    for (const team of teams) {
      let totalPoints = 0;

      for (const player of team.players) {
        const stats = playerStats[player.name];
        if (stats) {
          let playerPoints = stats.total_points || 0;

          // Double points for captain
          if (player.name === team.captain) {
            playerPoints *= 2;
          }
          // 1.5x points for vice captain
          else if (player.name === team.viceCaptain) {
            playerPoints *= 1.5;
          }

          totalPoints += playerPoints;
        }
      }

      await this.updatePoints(team.teamId, totalPoints);
    }
  }

  static async getLeaderboard(contestId, limit = 100) {
    const teams = await Team.find({ contestId })
      .sort({ totalPoints: -1, createdAt: 1 })
      .limit(limit);

    return teams.map((team, index) => ({
      ...team.toObject(),
      rank: index + 1
    }));
  }
}

export { Team };
