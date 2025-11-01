import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trophy, TrendingUp } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import api from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const MyContests = () => {
  const navigate = useNavigate();
  const { user } = useUser();
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('active');

  useEffect(() => {
    loadContests();
  }, []);

  const loadContests = async () => {
    try {
      setLoading(true);
      const response = await api.getUserContests();
      if (response.success) {
        setContests(response.data || []);
      }
    } catch (error) {
      console.error('Error loading contests:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredContests = contests.filter((contest) => {
    if (filter === 'active') {
      return contest.status === 'upcoming' || contest.status === 'live';
    }
    if (filter === 'completed') {
      return contest.status === 'completed';
    }
    return true;
  });

  if (loading) {
    return <Loading message="Loading your contests..." />;
  }

  return (
    <div>
      <Header title="My Contests" />

      <div className="p-4 space-y-4">
        {/* Filter Tabs */}
        <div className="flex gap-2">
          <button
            onClick={() => setFilter('active')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              filter === 'active'
                ? 'bg-tg-button text-tg-button-text'
                : 'bg-tg-secondary-bg text-tg-hint'
            }`}
          >
            Active
          </button>
          <button
            onClick={() => setFilter('completed')}
            className={`flex-1 py-2 px-4 rounded-xl font-medium transition-colors ${
              filter === 'completed'
                ? 'bg-tg-button text-tg-button-text'
                : 'bg-tg-secondary-bg text-tg-hint'
            }`}
          >
            Completed
          </button>
        </div>

        {/* Contests List */}
        {filteredContests.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No Contests Yet"
            message={
              filter === 'active'
                ? "You haven't joined any contests yet. Browse matches to get started!"
                : "You don't have any completed contests yet."
            }
            action={
              filter === 'active' && (
                <Button onClick={() => navigate('/matches')}>
                  Browse Matches
                </Button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredContests.map((contest) => (
              <Card
                key={contest._id}
                onClick={() => navigate(`/leaderboard/${contest._id}`)}
                className="cursor-pointer"
              >
                {/* Contest Header */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg">{contest.name}</h3>
                    <p className="text-sm text-tg-hint">
                      {contest.match?.team1?.name} vs {contest.match?.team2?.name}
                    </p>
                  </div>
                  {contest.rank && (
                    <div className="text-right">
                      <div className="text-2xl font-bold text-tg-button">
                        #{contest.rank}
                      </div>
                      <div className="text-xs text-tg-hint">Rank</div>
                    </div>
                  )}
                </div>

                {/* Match Date */}
                <div className="text-sm text-tg-hint mb-3">
                  {formatDateTime(contest.match?.matchDate)}
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-3 gap-3 pt-3 border-t border-tg-hint/10">
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {contest.team?.totalPoints || 0}
                    </div>
                    <div className="text-xs text-tg-hint">Points</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold text-green-500">
                      {formatCurrency(contest.prizePool)}
                    </div>
                    <div className="text-xs text-tg-hint">Prize Pool</div>
                  </div>
                  <div className="text-center">
                    <div className="text-lg font-bold">
                      {contest.joinedUsers}/{contest.maxSpots}
                    </div>
                    <div className="text-xs text-tg-hint">Players</div>
                  </div>
                </div>

                {/* Status Badge */}
                {contest.status === 'live' && (
                  <div className="mt-3 pt-3 border-t border-tg-hint/10">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-semibold">
                      <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                      LIVE
                    </span>
                  </div>
                )}

                {contest.winnings && contest.winnings > 0 && (
                  <div className="mt-3 pt-3 border-t border-tg-hint/10 flex items-center justify-between">
                    <span className="text-sm font-medium">Winnings</span>
                    <span className="text-lg font-bold text-green-500">
                      {formatCurrency(contest.winnings)}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContests;
