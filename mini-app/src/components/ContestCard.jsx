import { Users, DollarSign, Trophy } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { formatCurrency } from '../utils/helpers';

const ContestCard = ({ contest, onJoin, disabled = false }) => {
  const spotsLeft = contest.maxSpots - (contest.joinedUsers || 0);
  const fillPercentage = ((contest.joinedUsers || 0) / contest.maxSpots) * 100;

  return (
    <Card className="animate-fade-in">
      <div className="flex justify-between items-start mb-3">
        <div>
          <h3 className="font-bold text-lg">{contest.name || 'Contest'}</h3>
          <p className="text-sm text-tg-hint">{contest.description || 'Join and win prizes!'}</p>
        </div>
        <div className="text-right">
          <div className="text-green-500 font-bold text-lg">
            {formatCurrency(contest.prizePool)}
          </div>
          <div className="text-xs text-tg-hint">Prize Pool</div>
        </div>
      </div>

      {/* Contest Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="flex items-center gap-2 text-sm">
          <DollarSign size={16} className="text-tg-hint" />
          <div>
            <div className="font-semibold">{formatCurrency(contest.entryFee)}</div>
            <div className="text-xs text-tg-hint">Entry</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Users size={16} className="text-tg-hint" />
          <div>
            <div className="font-semibold">{contest.maxSpots}</div>
            <div className="text-xs text-tg-hint">Spots</div>
          </div>
        </div>

        <div className="flex items-center gap-2 text-sm">
          <Trophy size={16} className="text-tg-hint" />
          <div>
            <div className="font-semibold">{contest.winnerCount || Math.ceil(contest.maxSpots * 0.3)}</div>
            <div className="text-xs text-tg-hint">Winners</div>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-3">
        <div className="flex justify-between text-xs text-tg-hint mb-1">
          <span>{spotsLeft} spots left</span>
          <span>{fillPercentage.toFixed(0)}% filled</span>
        </div>
        <div className="w-full bg-tg-hint/20 rounded-full h-2 overflow-hidden">
          <div
            className="bg-tg-button h-full transition-all duration-300"
            style={{ width: `${fillPercentage}%` }}
          />
        </div>
      </div>

      {/* Join Button */}
      <Button
        variant="primary"
        fullWidth
        onClick={onJoin}
        disabled={disabled || spotsLeft === 0}
      >
        {spotsLeft === 0 ? 'Contest Full' : 'Join Contest'}
      </Button>
    </Card>
  );
};

export default ContestCard;
