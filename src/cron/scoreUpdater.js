import cron from 'node-cron';
import { MatchModel as Match } from '../models/Match.js';
import { TeamModel as Team } from '../models/Team.js';
import { ContestModel as Contest } from '../models/Contest.js';
import { SportsApiService } from '../services/sportsApi.js';
import { FantasyScoringService } from '../services/fantasyScoring.js';
import { WalletService } from '../services/walletService.js';
import { NotificationService } from '../services/notificationService.js';

export class ScoreUpdater {
  static bot = null;

  static init(bot) {
    this.bot = bot;
    this.startCronJobs();
  }

  static startCronJobs() {
    console.log('🕐 Starting cron jobs...');

    // Update live match scores every 5 minutes
    cron.schedule('*/5 * * * *', async () => {
      console.log('⚡ Running live score update...');
      await this.updateLiveScores();
    });

    // Check for match start every 10 minutes
    cron.schedule('*/10 * * * *', async () => {
      console.log('🔔 Checking for match starts...');
      await this.checkMatchStarts();
    });

    // Process completed matches every 15 minutes
    cron.schedule('*/15 * * * *', async () => {
      console.log('✅ Processing completed matches...');
      await this.processCompletedMatches();
    });

    console.log('✅ Cron jobs initialized');
  }

  static async updateLiveScores() {
    try {
      const liveMatches = await Match.getLive();

      for (const match of liveMatches) {
        // Fetch live score from API
        const scorecard = await SportsApiService.getLiveScore(match.match_id);

        if (!scorecard) continue;

        // Parse player stats
        const playerStats = SportsApiService.parsePlayerStats(scorecard);

        // Update player stats in database
        await FantasyScoringService.updatePlayerStats(match.id, playerStats);

        // Calculate team points
        await Team.calculateAndUpdatePoints(match.id, playerStats);

        // Update match API data
        await Match.updateApiData(match.match_id, scorecard);

        console.log(`✓ Updated scores for match: ${match.name}`);
      }
    } catch (error) {
      console.error('Error updating live scores:', error);
    }
  }

  static async checkMatchStarts() {
    try {
      const upcomingMatches = await Match.getUpcoming(50);
      const now = new Date();

      for (const match of upcomingMatches) {
        const matchDate = new Date(match.match_date);
        const timeDiff = matchDate - now;

        // Check if match is starting in next 30 minutes
        if (timeDiff > 0 && timeDiff < 30 * 60 * 1000) {
          // Send notifications to users
          await NotificationService.notifyMatchStart(this.bot, match.id);
          console.log(`🔔 Sent match start notifications for: ${match.name}`);
        }

        // Check if match has started (within last 10 minutes)
        if (timeDiff < 0 && Math.abs(timeDiff) < 10 * 60 * 1000) {
          if (match.status !== 'live') {
            await Match.updateStatus(match.match_id, 'live');

            // Close all contests for this match
            const contests = await Contest.getByMatchId(match.id);
            for (const contest of contests) {
              await Contest.updateStatus(contest.contest_id, 'live');
            }

            console.log(`🔴 Match started: ${match.name}`);
          }
        }
      }
    } catch (error) {
      console.error('Error checking match starts:', error);
    }
  }

  static async processCompletedMatches() {
    try {
      const liveMatches = await Match.getLive();

      for (const match of liveMatches) {
        // Check match status from API
        const matchInfo = await SportsApiService.getMatchInfo(match.match_id);

        if (matchInfo && matchInfo.status === 'Match Ended') {
          // Update match status
          await Match.updateStatus(match.match_id, 'completed');

          // Get all contests for this match
          const contests = await Contest.getByMatchId(match.id);

          for (const contest of contests) {
            await this.distributeContestPrizes(contest);
          }

          console.log(`🏁 Match completed and prizes distributed: ${match.name}`);
        }
      }
    } catch (error) {
      console.error('Error processing completed matches:', error);
    }
  }

  static async distributeContestPrizes(contest) {
    try {
      // Get leaderboard
      const leaderboard = await Team.getLeaderboard(contest.id, contest.max_spots);

      // Parse prize distribution (if exists)
      let prizeDistribution = contest.prize_distribution;

      // Default prize distribution if not specified
      if (!prizeDistribution || Object.keys(prizeDistribution).length === 0) {
        prizeDistribution = this.calculateDefaultPrizeDistribution(
          contest.prize_pool,
          contest.joined_users
        );
      }

      // Distribute prizes
      for (const [rank, prize] of Object.entries(prizeDistribution)) {
        const rankNum = parseInt(rank);
        if (rankNum <= leaderboard.length) {
          const team = leaderboard[rankNum - 1];

          // Add winnings to user wallet
          await WalletService.addWinnings(
            team.user_id,
            parseFloat(prize),
            contest.id,
            rankNum
          );

          // Update team rank
          await Team.updateRank(team.team_id, rankNum);

          // Notify user
          await NotificationService.notifyContestResult(
            this.bot,
            team.user_id,
            contest.name,
            rankNum,
            parseFloat(prize)
          );
        }
      }

      // Update contest status
      await Contest.updateStatus(contest.contest_id, 'completed');

      console.log(`💰 Prizes distributed for contest: ${contest.name}`);
    } catch (error) {
      console.error(`Error distributing prizes for contest ${contest.contest_id}:`, error);
    }
  }

  static calculateDefaultPrizeDistribution(prizePool, totalParticipants) {
    // Simple prize distribution logic
    const distribution = {};

    if (totalParticipants >= 10) {
      // Top 50% of prize pool for winner
      distribution['1'] = prizePool * 0.5;
      // 30% for second place
      distribution['2'] = prizePool * 0.3;
      // 20% for third place
      distribution['3'] = prizePool * 0.2;
    } else if (totalParticipants >= 5) {
      // 60% for winner
      distribution['1'] = prizePool * 0.6;
      // 40% for second
      distribution['2'] = prizePool * 0.4;
    } else {
      // Winner takes all
      distribution['1'] = prizePool;
    }

    return distribution;
  }
}
