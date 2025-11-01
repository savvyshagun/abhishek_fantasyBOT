import { useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin } from 'lucide-react';
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

  return (
    <Card onClick={handleClick} className="animate-fade-in">
      {/* Status Badge */}
      <div className="flex justify-between items-start mb-3">
        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getMatchStatusBadgeColor(match.status)}`}>
          {match.status?.toUpperCase() || 'UPCOMING'}
        </span>
        {match.status === 'upcoming' && (
          <span className="text-sm font-medium text-tg-hint">
            Starts in {getTimeUntil(match.matchDate)}
          </span>
        )}
      </div>

      {/* Teams */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{match.team1?.flag || '🏏'}</div>
          <div className="font-semibold text-sm">{match.team1?.name || 'Team 1'}</div>
        </div>

        <div className="px-4">
          <div className="text-tg-hint font-bold">VS</div>
        </div>

        <div className="flex-1 text-center">
          <div className="text-2xl mb-1">{match.team2?.flag || '🏏'}</div>
          <div className="font-semibold text-sm">{match.team2?.name || 'Team 2'}</div>
        </div>
      </div>

      {/* Match Details */}
      <div className="space-y-2 text-sm text-tg-hint border-t border-tg-hint/10 pt-3">
        <div className="flex items-center gap-2">
          <Calendar size={16} />
          <span>{formatDate(match.matchDate)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock size={16} />
          <span>{formatTime(match.matchDate)}</span>
        </div>
        {match.venue && (
          <div className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="truncate">{match.venue}</span>
          </div>
        )}
      </div>

      {/* Contests Info */}
      {match.contestsCount > 0 && (
        <div className="mt-3 pt-3 border-t border-tg-hint/10">
          <div className="text-sm text-tg-button font-medium">
            {match.contestsCount} Contest{match.contestsCount !== 1 ? 's' : ''} Available
          </div>
        </div>
      )}
    </Card>
  );
};

export default MatchCard;
