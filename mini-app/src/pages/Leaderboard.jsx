import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Trophy, Medal, TrendingUp, Crown } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { formatCurrency, getInitials } from '../utils/helpers';

const Leaderboard = () => {
  const { contestId } = useParams();
  const { user } = useUser();
  const [contest, setContest] = useState(null);
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  useEffect(() => {
    loadLeaderboard();

    // Auto-refresh every 30 seconds for live contests
    let interval;
    if (autoRefresh) {
      interval = setInterval(() => {
        loadLeaderboard(true);
      }, 30000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [contestId, autoRefresh]);

  const loadLeaderboard = async (silent = false) => {
    try {
      if (!silent) setLoading(true);

      const [contestResponse, leaderboardResponse] = await Promise.all([
        api.getContestById(contestId),
        api.getContestLeaderboard(contestId),
      ]);

      if (contestResponse.success) {
        setContest(contestResponse.data);
        setAutoRefresh(contestResponse.data.status === 'live');
      }

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data || []);
      }
    } catch (error) {
      console.error('Error loading leaderboard:', error);
    } finally {
      if (!silent) setLoading(false);
    }
  };

  const getRankColor = (rank) => {
    if (rank === 1) return 'text-yellow-500';
    if (rank === 2) return 'text-gray-400';
    if (rank === 3) return 'text-orange-600';
    return 'text-tg-text';
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return <Crown size={24} className="text-yellow-500" />;
    if (rank === 2) return <Medal size={24} className="text-gray-400" />;
    if (rank === 3) return <Medal size={24} className="text-orange-600" />;
    return null;
  };

  const getPrizeAmount = (rank) => {
    if (!contest?.prizePool) return 0;

    // Simple prize distribution logic (customize as needed)
    const distribution = {
      1: 0.5, // 50% for 1st place
      2: 0.3, // 30% for 2nd place
      3: 0.2, // 20% for 3rd place
    };

    return contest.prizePool * (distribution[rank] || 0);
  };

  if (loading) {
    return <Loading message="Loading leaderboard..." />;
  }

  return (
    <div>
      <Header
        title="Leaderboard"
        showBack
        action={
          contest?.status === 'live' && (
            <span className="flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
              <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
              LIVE
            </span>
          )
        }
      />

      <div className="p-4 space-y-4">
        {/* Contest Info */}
        <Card>
          <h3 className="font-bold text-lg mb-3">{contest?.name}</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="text-2xl font-bold text-green-500">
                {formatCurrency(contest?.prizePool || 0)}
              </div>
              <div className="text-xs text-tg-hint">Prize Pool</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {contest?.joinedUsers || 0}/{contest?.maxSpots || 0}
              </div>
              <div className="text-xs text-tg-hint">Players</div>
            </div>
            <div>
              <div className="text-2xl font-bold">
                {contest?.winnerCount || Math.ceil((contest?.maxSpots || 0) * 0.3)}
              </div>
              <div className="text-xs text-tg-hint">Winners</div>
            </div>
          </div>
        </Card>

        {/* Leaderboard */}
        <div>
          <h3 className="font-bold text-lg mb-3">Rankings</h3>

          {leaderboard.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No Rankings Yet"
              message="Rankings will appear once the match starts."
            />
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => {
                const rank = index + 1;
                const isCurrentUser = entry.userTelegramId === user?.telegramId;
                const prizeAmount = getPrizeAmount(rank);
                const isWinning = rank <= (contest?.winnerCount || Math.ceil((contest?.maxSpots || 0) * 0.3));

                return (
                  <Card
                    key={entry._id}
                    className={`${
                      isCurrentUser
                        ? 'border-2 border-tg-button bg-tg-button/5'
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      {/* Rank */}
                      <div className="flex-shrink-0 w-12 text-center">
                        {getRankIcon(rank) || (
                          <div className={`text-2xl font-bold ${getRankColor(rank)}`}>
                            #{rank}
                          </div>
                        )}
                      </div>

                      {/* User Avatar */}
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-tg-button/20 flex items-center justify-center">
                          <span className="font-bold text-tg-button">
                            {getInitials(entry.userName || 'User')}
                          </span>
                        </div>
                      </div>

                      {/* User Info */}
                      <div className="flex-1 min-w-0">
                        <div className="font-medium flex items-center gap-2">
                          {entry.userName || 'Unknown Player'}
                          {isCurrentUser && (
                            <span className="px-2 py-0.5 bg-tg-button text-tg-button-text text-xs rounded-full">
                              You
                            </span>
                          )}
                        </div>
                        <div className="text-sm text-tg-hint flex items-center gap-2">
                          <TrendingUp size={14} />
                          {entry.totalPoints || 0} points
                        </div>
                      </div>

                      {/* Prize */}
                      {isWinning && prizeAmount > 0 && (
                        <div className="flex-shrink-0 text-right">
                          <div className="text-lg font-bold text-green-500">
                            {formatCurrency(prizeAmount)}
                          </div>
                          <div className="text-xs text-tg-hint">Prize</div>
                        </div>
                      )}
                    </div>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Your Position (if not in top list) */}
        {user && leaderboard.length > 0 && !leaderboard.slice(0, 10).find(e => e.userTelegramId === user.telegramId) && (
          <Card className="border-2 border-tg-button">
            <div className="text-center">
              <div className="text-sm text-tg-hint mb-1">Your Position</div>
              <div className="text-2xl font-bold">
                #{leaderboard.findIndex(e => e.userTelegramId === user.telegramId) + 1}
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Leaderboard;
