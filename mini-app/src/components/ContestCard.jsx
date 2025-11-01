import { Users, DollarSign, Trophy, Sparkles } from 'lucide-react';
import Card from './Card';
import Button from './Button';
import { formatCurrency } from '../utils/helpers';

const ContestCard = ({ contest, onJoin, disabled = false }) => {
  const spotsLeft = contest.maxSpots - (contest.joinedUsers || 0);
  const fillPercentage = ((contest.joinedUsers || 0) / contest.maxSpots) * 100;
  const isAlmostFull = fillPercentage >= 80;

  return (
    <Card className="animate-fade-in relative overflow-hidden">
      {/* Premium badge for high prize pools */}
      {contest.prizePool >= 1000 && (
        <div className="absolute top-3 right-3">
          <div className="gradient-accent px-2 py-1 rounded-full flex items-center gap-1">
            <Sparkles size={12} className="text-white" />
            <span className="text-xs font-bold text-white">HOT</span>
          </div>
        </div>
      )}

      <div className="mb-4">
        <h3 className="font-bold text-lg mb-1">{contest.name || 'Contest'}</h3>
        <p className="text-sm text-gray-600">{contest.description || 'Join and win prizes!'}</p>
      </div>

      {/* Prize Pool - Prominent */}
      <div className="mb-4 bg-gradient-to-r from-emerald-50 to-green-50 rounded-xl p-4 text-center">
        <div className="text-xs font-semibold text-gray-600 mb-1">PRIZE POOL</div>
        <div className="text-3xl font-black text-emerald-600">
          {formatCurrency(contest.prizePool)}
        </div>
      </div>

      {/* Contest Stats */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-blue-50 rounded-xl p-3 text-center">
          <DollarSign size={20} className="text-blue-600 mx-auto mb-1" />
          <div className="font-bold text-sm">{formatCurrency(contest.entryFee)}</div>
          <div className="text-xs text-gray-600">Entry Fee</div>
        </div>

        <div className="bg-purple-50 rounded-xl p-3 text-center">
          <Users size={20} className="text-purple-600 mx-auto mb-1" />
          <div className="font-bold text-sm">{contest.maxSpots}</div>
          <div className="text-xs text-gray-600">Total Spots</div>
        </div>

        <div className="bg-amber-50 rounded-xl p-3 text-center">
          <Trophy size={20} className="text-amber-600 mx-auto mb-1" />
          <div className="font-bold text-sm">{contest.winnerCount || Math.ceil(contest.maxSpots * 0.3)}</div>
          <div className="text-xs text-gray-600">Winners</div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex justify-between text-xs font-semibold mb-2">
          <span className={isAlmostFull ? 'text-orange-600' : 'text-gray-600'}>
            {spotsLeft} spots left
          </span>
          <span className="text-emerald-600">{fillPercentage.toFixed(0)}% filled</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden shadow-inner">
          <div
            className={`h-full transition-all duration-500 ${
              isAlmostFull ? 'bg-gradient-to-r from-orange-500 to-red-500' : 'gradient-primary'
            }`}
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
        icon={<Sparkles size={18} />}
      >
        {spotsLeft === 0 ? 'Contest Full' : 'Join Now'}
      </Button>
    </Card>
  );
};

export default ContestCard;
