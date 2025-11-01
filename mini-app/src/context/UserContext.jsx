import { createContext, useState, useEffect } from 'react';
import { useTelegram } from '../hooks/useTelegram';
import api from '../services/api';

export const UserContext = createContext({});

export const UserProvider = ({ children }) => {
  const { user: telegramUser, isReady } = useTelegram();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.getUserProfile();

      if (response.success) {
        setUser(response.data);
      } else {
        setError(response.error || 'Failed to fetch profile');
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
      setError(err.message || 'Failed to fetch profile');
    } finally {
      setLoading(false);
    }
  };

  const updateBalance = (newBalance) => {
    setUser((prev) => ({
      ...prev,
      walletBalance: newBalance,
    }));
  };

  const refreshUser = () => {
    return fetchUserProfile();
  };

  useEffect(() => {
    if (isReady && telegramUser) {
      fetchUserProfile();
    } else if (isReady && !telegramUser) {
      // Development mode or no telegram user
      setLoading(false);
    }
  }, [isReady, telegramUser]);

  const value = {
    user,
    loading,
    error,
    updateBalance,
    refreshUser,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};
