import { useState, useEffect } from 'react';
import { Wallet as WalletIcon, ArrowUpCircle, ArrowDownCircle, Clock } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import EmptyState from '../components/EmptyState';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { useTelegram } from '../hooks/useTelegram';
import api from '../services/api';
import { formatCurrency, formatDateTime } from '../utils/helpers';

const Wallet = () => {
  const { user, refreshUser } = useUser();
  const { showAlert } = useTelegram();
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showDepositModal, setShowDepositModal] = useState(false);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);

  useEffect(() => {
    loadWalletData();
  }, []);

  const loadWalletData = async () => {
    try {
      setLoading(true);
      const response = await api.getUserWallet();
      if (response.success) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      console.error('Error loading wallet:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeposit = () => {
    showAlert('Deposit feature coming soon! You can add funds via admin for now.');
    // Future: Integrate with payment gateway
  };

  const handleWithdraw = () => {
    showAlert('Withdrawal feature coming soon! Contact admin for withdrawals.');
    // Future: Implement withdrawal request
  };

  const getTransactionIcon = (type) => {
    switch (type) {
      case 'deposit':
        return <ArrowDownCircle className="text-green-500" size={20} />;
      case 'withdraw':
        return <ArrowUpCircle className="text-red-500" size={20} />;
      case 'contest_entry':
        return <ArrowUpCircle className="text-orange-500" size={20} />;
      case 'winnings':
        return <ArrowDownCircle className="text-green-500" size={20} />;
      case 'referral':
        return <ArrowDownCircle className="text-blue-500" size={20} />;
      default:
        return <Clock className="text-tg-hint" size={20} />;
    }
  };

  const getTransactionColor = (type) => {
    switch (type) {
      case 'deposit':
      case 'winnings':
      case 'referral':
        return 'text-green-500';
      case 'withdraw':
      case 'contest_entry':
        return 'text-red-500';
      default:
        return 'text-tg-text';
    }
  };

  const formatTransactionType = (type) => {
    return type
      .split('_')
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  if (loading) {
    return <Loading message="Loading wallet..." />;
  }

  return (
    <div>
      <Header title="Wallet" />

      <div className="p-4 space-y-6">
        {/* Balance Card */}
        <Card className="bg-gradient-to-br from-tg-button/20 to-tg-button/5">
          <div className="text-center py-6">
            <div className="text-sm text-tg-hint mb-2">Total Balance</div>
            <div className="text-5xl font-bold mb-6">
              {formatCurrency(user?.walletBalance || 0)}
            </div>
            <div className="flex gap-3">
              <Button
                variant="primary"
                fullWidth
                onClick={handleDeposit}
                className="flex items-center justify-center gap-2"
              >
                <ArrowDownCircle size={20} />
                Deposit
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={handleWithdraw}
                className="flex items-center justify-center gap-2"
              >
                <ArrowUpCircle size={20} />
                Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Referral Earnings */}
        {user?.referralEarnings > 0 && (
          <Card className="bg-gradient-to-r from-blue-500/20 to-purple-500/20">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-sm text-tg-hint mb-1">Referral Earnings</div>
                <div className="text-2xl font-bold">
                  {formatCurrency(user.referralEarnings)}
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-tg-button">
                  {user.totalReferrals || 0}
                </div>
                <div className="text-xs text-tg-hint">Referrals</div>
              </div>
            </div>
          </Card>
        )}

        {/* Transaction History */}
        <div>
          <h2 className="text-xl font-bold mb-4">Transaction History</h2>

          {transactions.length === 0 ? (
            <EmptyState
              icon={WalletIcon}
              title="No Transactions Yet"
              message="Your transaction history will appear here."
            />
          ) : (
            <div className="space-y-2">
              {transactions.map((transaction) => (
                <Card key={transaction._id} className="flex items-center gap-4">
                  <div className="flex-shrink-0">
                    {getTransactionIcon(transaction.type)}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="font-medium">
                      {formatTransactionType(transaction.type)}
                    </div>
                    <div className="text-sm text-tg-hint">
                      {formatDateTime(transaction.createdAt)}
                    </div>
                    {transaction.description && (
                      <div className="text-sm text-tg-hint truncate">
                        {transaction.description}
                      </div>
                    )}
                  </div>

                  <div className="flex-shrink-0 text-right">
                    <div className={`text-lg font-bold ${getTransactionColor(transaction.type)}`}>
                      {transaction.type === 'deposit' || transaction.type === 'winnings' || transaction.type === 'referral' ? '+' : '-'}
                      {formatCurrency(transaction.amount)}
                    </div>
                    {transaction.status === 'pending' && (
                      <span className="text-xs text-orange-500">Pending</span>
                    )}
                    {transaction.status === 'completed' && (
                      <span className="text-xs text-green-500">Completed</span>
                    )}
                    {transaction.status === 'failed' && (
                      <span className="text-xs text-red-500">Failed</span>
                    )}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Wallet;
