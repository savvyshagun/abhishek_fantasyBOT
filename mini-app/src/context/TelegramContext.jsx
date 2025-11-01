import { createContext, useEffect, useState } from 'react';
import WebApp from '@twa-dev/sdk';

export const TelegramContext = createContext({});

export const TelegramProvider = ({ children }) => {
  const [webApp, setWebApp] = useState(null);
  const [user, setUser] = useState(null);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Initialize Telegram WebApp
    const tg = window.Telegram?.WebApp || WebApp;

    if (tg) {
      setWebApp(tg);
      setUser(tg.initDataUnsafe?.user || null);
      setIsReady(true);

      // Set app theme
      if (tg.colorScheme === 'dark') {
        document.documentElement.classList.add('dark');
      }
    } else {
      // Development mode fallback
      console.warn('Telegram WebApp not available. Running in dev mode.');
      setIsReady(true);
    }
  }, []);

  const showMainButton = (text, onClick) => {
    if (webApp?.MainButton) {
      webApp.MainButton.setText(text);
      webApp.MainButton.show();
      webApp.MainButton.onClick(onClick);
    }
  };

  const hideMainButton = () => {
    if (webApp?.MainButton) {
      webApp.MainButton.hide();
    }
  };

  const showBackButton = (onClick) => {
    if (webApp?.BackButton) {
      webApp.BackButton.show();
      webApp.BackButton.onClick(onClick);
    }
  };

  const hideBackButton = () => {
    if (webApp?.BackButton) {
      webApp.BackButton.hide();
    }
  };

  const hapticFeedback = (type = 'light') => {
    if (webApp?.HapticFeedback) {
      webApp.HapticFeedback.impactOccurred(type);
    }
  };

  const showPopup = (params) => {
    if (webApp?.showPopup) {
      return webApp.showPopup(params);
    }
    return Promise.resolve();
  };

  const showAlert = (message) => {
    if (webApp?.showAlert) {
      return webApp.showAlert(message);
    }
    alert(message);
    return Promise.resolve();
  };

  const showConfirm = (message) => {
    if (webApp?.showConfirm) {
      return webApp.showConfirm(message);
    }
    return Promise.resolve(confirm(message));
  };

  const close = () => {
    if (webApp?.close) {
      webApp.close();
    }
  };

  const openLink = (url) => {
    if (webApp?.openLink) {
      webApp.openLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const openTelegramLink = (url) => {
    if (webApp?.openTelegramLink) {
      webApp.openTelegramLink(url);
    } else {
      window.open(url, '_blank');
    }
  };

  const value = {
    webApp,
    user,
    isReady,
    showMainButton,
    hideMainButton,
    showBackButton,
    hideBackButton,
    hapticFeedback,
    showPopup,
    showAlert,
    showConfirm,
    close,
    openLink,
    openTelegramLink,
  };

  return (
    <TelegramContext.Provider value={value}>
      {children}
    </TelegramContext.Provider>
  );
};
