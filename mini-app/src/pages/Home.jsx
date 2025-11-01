import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Wallet, Users, Trophy } from 'lucide-react';
import { useUser } from '../hooks/useUser';
import Card from '../components/Card';
import Button from '../components/Button';
import MatchCard from '../components/MatchCard';
import Loading from '../components/Loading';
import api from '../services/api';
import { formatCurrency } from '../utils/helpers';

const Home = () => {
  const navigate = useNavigate();
  const { user, loading: userLoading } = useUser();
  const [matches, setMatches] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const response = await api.getMatches(5);
      if (response.success) {
        setMatches(response.data || []);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  if (userLoading || loading) {
    return <Loading />;
  }

  return (
    <div className="p-4 space-y-6">
      {/* Welcome Section */}
      <div className="animate-fade-in">
        <h1 className="text-2xl font-bold mb-2">
          Welcome back{user?.firstName ? `, ${user.firstName}` : ''}! 👋
        </h1>
        <p className="text-tg-hint">Ready to build your winning team?</p>
      </div>

      {/* Wallet Balance */}
      <Card className="animate-fade-in bg-gradient-to-br from-tg-button/20 to-tg-button/5">
        <div className="flex items-center justify-between">
          <div>
            <div className="text-sm text-tg-hint mb-1">Wallet Balance</div>
            <div className="text-3xl font-bold">
              {formatCurrency(user?.walletBalance || 0)}
            </div>
          </div>
          <Wallet size={48} className="text-tg-button opacity-50" />
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate('/wallet')}
            className="flex-1"
          >
            Add Funds
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/wallet')}
            className="flex-1"
          >
            Withdraw
          </Button>
        </div>
      </Card>

      {/* Quick Stats */}
      <div className="grid grid-cols-3 gap-3">
        <Card className="text-center">
          <Trophy size={24} className="text-tg-button mx-auto mb-2" />
          <div className="text-xl font-bold">{user?.totalContests || 0}</div>
          <div className="text-xs text-tg-hint">Contests</div>
        </Card>
        <Card className="text-center">
          <TrendingUp size={24} className="text-green-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{user?.totalWins || 0}</div>
          <div className="text-xs text-tg-hint">Wins</div>
        </Card>
        <Card className="text-center">
          <Users size={24} className="text-blue-500 mx-auto mb-2" />
          <div className="text-xl font-bold">{user?.totalReferrals || 0}</div>
          <div className="text-xs text-tg-hint">Referrals</div>
        </Card>
      </div>

      {/* Upcoming Matches */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Upcoming Matches</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate('/matches')}
          >
            View All
          </Button>
        </div>

        {matches.length === 0 ? (
          <Card>
            <p className="text-center text-tg-hint py-8">
              No upcoming matches available
            </p>
          </Card>
        ) : (
          <div className="space-y-3">
            {matches.slice(0, 3).map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </div>

      {/* Referral Banner */}
      {user?.referralCode && (
        <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20">
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <h3 className="font-bold mb-1">Invite Friends</h3>
              <p className="text-sm text-tg-hint">
                Earn {formatCurrency(10)} for each referral!
              </p>
            </div>
            <Button
              variant="primary"
              size="sm"
              onClick={() => navigate('/profile')}
            >
              Share
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Home;
