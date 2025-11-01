import { useState } from 'react';
import { Copy, Share2, Users, TrendingUp, Trophy, Gift } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import { useUser } from '../hooks/useUser';
import { useTelegram } from '../hooks/useTelegram';
import { formatCurrency, copyToClipboard, getInitials } from '../utils/helpers';

const Profile = () => {
  const { user } = useUser();
  const { showAlert, openTelegramLink } = useTelegram();
  const [copySuccess, setCopySuccess] = useState(false);

  const referralLink = user?.referralCode
    ? `https://t.me/YOUR_BOT_USERNAME?start=${user.referralCode}`
    : '';

  const handleCopyReferralCode = async () => {
    if (user?.referralCode) {
      const success = await copyToClipboard(referralLink);
      if (success) {
        setCopySuccess(true);
        showAlert('Referral link copied to clipboard!');
        setTimeout(() => setCopySuccess(false), 2000);
      } else {
        showAlert('Failed to copy referral link');
      }
    }
  };

  const handleShareReferral = () => {
    if (referralLink) {
      const message = `Join me on Fantasy Cricket Bot and get $10 bonus! Use my referral link: ${referralLink}`;
      openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(referralLink)}&text=${encodeURIComponent(message)}`);
    }
  };

  return (
    <div>
      <Header title="Profile" />

      <div className="p-4 space-y-6">
        {/* Profile Header */}
        <Card className="text-center">
          <div className="w-20 h-20 rounded-full bg-tg-button/20 flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl font-bold text-tg-button">
              {getInitials(user?.firstName || user?.username || 'User')}
            </span>
          </div>
          <h2 className="text-2xl font-bold mb-1">
            {user?.firstName || user?.username || 'User'}
            {user?.lastName && ` ${user.lastName}`}
          </h2>
          {user?.username && (
            <p className="text-tg-hint">@{user.username}</p>
          )}
        </Card>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <Card className="text-center">
            <Trophy size={32} className="text-tg-button mx-auto mb-2" />
            <div className="text-2xl font-bold">{user?.totalContests || 0}</div>
            <div className="text-sm text-tg-hint">Contests Played</div>
          </Card>
          <Card className="text-center">
            <TrendingUp size={32} className="text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user?.totalWins || 0}</div>
            <div className="text-sm text-tg-hint">Total Wins</div>
          </Card>
          <Card className="text-center">
            <Users size={32} className="text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">{user?.totalReferrals || 0}</div>
            <div className="text-sm text-tg-hint">Referrals</div>
          </Card>
          <Card className="text-center">
            <Gift size={32} className="text-purple-500 mx-auto mb-2" />
            <div className="text-2xl font-bold">
              {formatCurrency(user?.referralEarnings || 0)}
            </div>
            <div className="text-sm text-tg-hint">Referral Earnings</div>
          </Card>
        </div>

        {/* Referral Section */}
        <Card className="bg-gradient-to-br from-blue-500/20 to-purple-500/20">
          <div className="flex items-center gap-3 mb-4">
            <Gift size={32} className="text-tg-button" />
            <div>
              <h3 className="font-bold text-lg">Invite Friends</h3>
              <p className="text-sm text-tg-hint">
                Earn {formatCurrency(10)} for each friend!
              </p>
            </div>
          </div>

          {user?.referralCode && (
            <>
              {/* Referral Code Display */}
              <div className="bg-tg-bg/50 rounded-lg p-3 mb-3">
                <div className="text-xs text-tg-hint mb-1">Your Referral Code</div>
                <div className="flex items-center justify-between">
                  <code className="text-lg font-mono font-bold">
                    {user.referralCode}
                  </code>
                  <button
                    onClick={handleCopyReferralCode}
                    className="p-2 hover:bg-tg-hint/10 rounded-lg transition-colors"
                  >
                    <Copy size={20} className={copySuccess ? 'text-green-500' : 'text-tg-hint'} />
                  </button>
                </div>
              </div>

              {/* Share Buttons */}
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleCopyReferralCode}
                  className="flex items-center justify-center gap-2"
                >
                  <Copy size={18} />
                  Copy Link
                </Button>
                <Button
                  variant="secondary"
                  fullWidth
                  onClick={handleShareReferral}
                  className="flex items-center justify-center gap-2"
                >
                  <Share2 size={18} />
                  Share
                </Button>
              </div>
            </>
          )}
        </Card>

        {/* Account Info */}
        <Card>
          <h3 className="font-bold text-lg mb-3">Account Information</h3>
          <div className="space-y-3">
            <div className="flex justify-between py-2 border-b border-tg-hint/10">
              <span className="text-tg-hint">Telegram ID</span>
              <span className="font-medium">{user?.telegramId}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-tg-hint/10">
              <span className="text-tg-hint">Member Since</span>
              <span className="font-medium">
                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
              </span>
            </div>
            <div className="flex justify-between py-2">
              <span className="text-tg-hint">Wallet Balance</span>
              <span className="font-bold text-tg-button">
                {formatCurrency(user?.walletBalance || 0)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Profile;
