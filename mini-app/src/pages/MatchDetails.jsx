import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Trophy } from 'lucide-react';
import Header from '../components/Header';
import ContestCard from '../components/ContestCard';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { useTelegram } from '../hooks/useTelegram';
import api from '../services/api';
import { formatDate, formatTime, getMatchStatusBadgeColor } from '../utils/helpers';

const MatchDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useUser();
  const { showAlert } = useTelegram();

  const [match, setMatch] = useState(null);
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadMatchData();
  }, [id]);

  const loadMatchData = async () => {
    try {
      setLoading(true);
      const response = await api.getMatchContests(id);
      if (response.success) {
        setMatch(response.data.match);
        setContests(response.data.contests || []);
      }
    } catch (error) {
      console.error('Error loading match details:', error);
      showAlert('Failed to load match details');
    } finally {
      setLoading(false);
    }
  };

  const handleJoinContest = (contest) => {
    if (!user) {
      showAlert('Please login to join contests');
      return;
    }

    if (user.walletBalance < contest.entryFee) {
      showAlert('Insufficient balance. Please add funds to your wallet.');
      navigate('/wallet');
      return;
    }

    // Navigate to team builder
    navigate(`/team-builder/${contest._id}`, {
      state: { match, contest },
    });
  };

  if (loading) {
    return <Loading message="Loading match details..." />;
  }

  if (!match) {
    return (
      <div>
        <Header title="Match Details" showBack />
        <EmptyState
          icon={Trophy}
          title="Match Not Found"
          message="The match you're looking for doesn't exist."
        />
      </div>
    );
  }

  return (
    <div>
      <Header title="Match Details" showBack />

      <div className="p-4 space-y-6">
        {/* Match Info Card */}
        <div className="bg-tg-secondary-bg rounded-xl p-4">
          {/* Status */}
          <div className="flex justify-center mb-4">
            <span className={`px-4 py-1.5 rounded-full text-sm font-semibold ${getMatchStatusBadgeColor(match.status)}`}>
              {match.status?.toUpperCase() || 'UPCOMING'}
            </span>
          </div>

          {/* Teams */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex-1 text-center">
              <div className="text-4xl mb-2">{match.team1?.flag || '🏏'}</div>
              <div className="font-bold text-lg">{match.team1?.name || 'Team 1'}</div>
              {match.team1?.score && (
                <div className="text-2xl font-bold text-tg-button mt-2">
                  {match.team1.score}
                </div>
              )}
            </div>

            <div className="px-6">
              <div className="text-tg-hint font-bold text-xl">VS</div>
            </div>

            <div className="flex-1 text-center">
              <div className="text-4xl mb-2">{match.team2?.flag || '🏏'}</div>
              <div className="font-bold text-lg">{match.team2?.name || 'Team 2'}</div>
              {match.team2?.score && (
                <div className="text-2xl font-bold text-tg-button mt-2">
                  {match.team2.score}
                </div>
              )}
            </div>
          </div>

          {/* Match Details */}
          <div className="space-y-3 text-sm border-t border-tg-hint/10 pt-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-tg-hint" />
              <span>{formatDate(match.matchDate)}</span>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={18} className="text-tg-hint" />
              <span>{formatTime(match.matchDate)}</span>
            </div>
            {match.venue && (
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-tg-hint" />
                <span>{match.venue}</span>
              </div>
            )}
          </div>
        </div>

        {/* Contests Section */}
        <div>
          <h2 className="text-xl font-bold mb-4">Available Contests</h2>

          {contests.length === 0 ? (
            <EmptyState
              icon={Trophy}
              title="No Contests Available"
              message="Contests will be available soon. Check back later!"
            />
          ) : (
            <div className="space-y-3">
              {contests.map((contest) => (
                <ContestCard
                  key={contest._id}
                  contest={contest}
                  onJoin={() => handleJoinContest(contest)}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MatchDetails;
