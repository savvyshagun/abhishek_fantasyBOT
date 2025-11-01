import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Sparkles } from 'lucide-react';
import Card from './Card';
import { formatDate, formatTime, getTimeUntil, getMatchStatusBadgeColor } from '../utils/helpers';
import { useTelegram } from '../hooks/useTelegram';

const MatchCard = ({ match }) => {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();

  const handleClick = () => {
    hapticFeedback('light');
    navigate(`/matches/${match._id}`);
  };

  const isLive = match.status === 'live';

  return (
    <Card onClick={handleClick} className="animate-fade-in overflow-hidden relative">
      {/* Live indicator glow */}
      {isLive && (
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-red-500 via-orange-500 to-red-500 animate-shimmer" />
      )}

      {/* Status Badge */}
      <div className="flex justify-between items-start mb-4">
        <span className={`px-3 py-1.5 rounded-full text-xs font-bold ${getMatchStatusBadgeColor(match.status)} flex items-center gap-1.5`}>
          {isLive && <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />}
          {match.status?.toUpperCase() || 'UPCOMING'}
        </span>
        {match.status === 'upcoming' && (
          <span className="text-sm font-semibold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
            {getTimeUntil(match.matchDate)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-5 relative">
        <div className="flex-1 text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center text-3xl shadow-md">
            {match.team1?.flag || '🏏'}
          </div>
          <div className="font-bold text-base">{match.team1?.name || 'Team 1'}</div>
          {match.team1?.score && (
            <div className="text-2xl font-bold text-emerald-600 mt-1">{match.team1.score}</div>
          )}
        </div>

        <div className="px-4">
          <div className="bg-gradient-to-r from-gray-200 to-gray-100 rounded-full px-4 py-2">
            <div className="text-gray-700 font-black text-sm">VS</div>
          </div>
        </div>

        <div className="flex-1 text-center">
          <div className="w-16 h-16 mx-auto mb-2 rounded-xl bg-gradient-to-br from-red-100 to-red-200 flex items-center justify-center text-3xl shadow-md">
            {match.team2?.flag || '🏏'}
          </div>
          <div className="font-bold text-base">{match.team2?.name || 'Team 2'}</div>
          {match.team2?.score && (
            <div className="text-2xl font-bold text-emerald-600 mt-1">{match.team2.score}</div>
          )}
        </div>
      </div>

      {/* Match Details */}
      <div className="space-y-2 text-sm text-gray-600 bg-gray-50 rounded-xl p-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} className="text-emerald-600" />
          <span className="font-medium">{formatDate(match.matchDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} className="text-emerald-600" />
          <span className="font-medium">{formatTime(match.matchDate)}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-2">
            <MapPin size={16} className="text-emerald-600" />
            <span className="truncate font-medium">{match.venue}</span>
          </div>
        )}
      </div>

      {/* Contests Info */}
      {match.contestsCount > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center justify-between bg-gradient-to-r from-emerald-50 to-blue-50 rounded-xl p-3">
            <div className="flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-600" />
              <span className="text-sm font-bold text-gray-700">
                {match.contestsCount} Contest{match.contestsCount !== 1 ? 's' : ''} Available
              </span>
            </div>
            <span className="text-xs text-emerald-600 font-semibold">Join Now →</span>
          </div>
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
