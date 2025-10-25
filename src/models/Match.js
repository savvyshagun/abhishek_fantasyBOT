import mongoose from 'mongoose';

const matchSchema = new mongoose.Schema({
  matchId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  team1: {
    type: String,
    required: true
  },
  team2: {
    type: String,
    required: true
  },
  matchType: String,
  venue: String,
  matchDate: {
    type: Date,
    required: true,
    index: true
  },
  status: {
    type: String,
    default: 'upcoming',
    enum: ['upcoming', 'live', 'completed', 'cancelled'],
    index: true
  },
  apiData: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const Match = mongoose.model('Match', matchSchema);

export class MatchModel {
  static async create(matchData) {
    const match = new Match({
      matchId: matchData.match_id,
      name: matchData.name,
      team1: matchData.team1,
      team2: matchData.team2,
      matchType: matchData.match_type || 'T20',
      venue: matchData.venue || null,
      matchDate: matchData.match_date,
      status: matchData.status || 'upcoming',
      apiData: matchData.api_data || {}
    });

    await match.save();
    return match;
  }

  static async findByMatchId(matchId) {
    return await Match.findOne({ matchId });
  }

  static async findById(id) {
    return await Match.findById(id);
  }

  static async getUpcoming(limit = 10) {
    return await Match.find({
      status: 'upcoming',
      matchDate: { $gt: new Date() }
    })
      .sort({ matchDate: 1 })
      .limit(limit);
  }

  static async getLive() {
    return await Match.find({ status: 'live' })
      .sort({ matchDate: -1 });
  }

  static async getCompleted(limit = 20) {
    return await Match.find({ status: 'completed' })
      .sort({ matchDate: -1 })
      .limit(limit);
  }

  static async updateStatus(matchId, status) {
    return await Match.findOneAndUpdate(
      { matchId },
      { status },
      { new: true }
    );
  }

  static async updateApiData(matchId, apiData) {
    return await Match.findOneAndUpdate(
      { matchId },
      { apiData },
      { new: true }
    );
  }
}

export { Match };
