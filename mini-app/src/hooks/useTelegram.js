import { useContext } from 'react';
import { TelegramContext } from '../context/TelegramContext';

export const useTelegram = () => {
  const context = useContext(TelegramContext);

  if (context === undefined) {
    throw new Error('useTelegram must be used within a TelegramProvider');
  }

  return context;
};
