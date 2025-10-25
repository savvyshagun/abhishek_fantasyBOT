import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const contestSchema = new mongoose.Schema({
  contestId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  matchId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Match',
    required: true,
    index: true
  },
  name: {
    type: String,
    required: true
  },
  entryFee: {
    type: Number,
    required: true
  },
  prizePool: {
    type: Number,
    required: true
  },
  maxSpots: {
    type: Number,
    required: true
  },
  joinedUsers: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    default: 'open',
    enum: ['open', 'live', 'completed', 'cancelled'],
    index: true
  },
  prizeDistribution: mongoose.Schema.Types.Mixed
}, {
  timestamps: true
});

const Contest = mongoose.model('Contest', contestSchema);

export class ContestModel {
  static async create(contestData) {
    const contestId = `CONT_${uuidv4().substring(0, 8).toUpperCase()}`;

    const contest = new Contest({
      contestId,
      matchId: contestData.match_id,
      name: contestData.name,
      entryFee: contestData.entry_fee,
      prizePool: contestData.prize_pool,
      maxSpots: contestData.max_spots,
      prizeDistribution: contestData.prize_distribution || {}
    });

    await contest.save();
    return contest;
  }

  static async findByContestId(contestId) {
    return await Contest.findOne({ contestId }).populate('matchId');
  }

  static async findById(id) {
    return await Contest.findById(id).populate('matchId');
  }

  static async getByMatchId(matchId) {
    return await Contest.find({
      matchId,
      status: 'open'
    });
  }

  static async incrementJoinedUsers(contestId) {
    return await Contest.findOneAndUpdate(
      { contestId },
      { $inc: { joinedUsers: 1 } },
      { new: true }
    );
  }

  static async updateStatus(contestId, status) {
    return await Contest.findOneAndUpdate(
      { contestId },
      { status },
      { new: true }
    );
  }

  static async isFull(contestId) {
    const contest = await Contest.findOne({ contestId });
    return contest && contest.joinedUsers >= contest.maxSpots;
  }

  static async getUserContests(telegramId, status = null) {
    const Team = mongoose.model('Team');
    const Match = mongoose.model('Match');

    const query = { 'user.telegramId': telegramId };
    if (status) query.status = status;

    // Find all teams for this user
    const teams = await Team.find({ userTelegramId: telegramId });
    const contestIds = teams.map(t => t.contestId);

    const contests = await Contest.find({ _id: { $in: contestIds } })
      .populate('matchId')
      .sort({ 'matchId.matchDate': -1 });

    return contests;
  }
}

export { Contest };
