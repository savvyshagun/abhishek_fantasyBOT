import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Trophy, Wallet, User } from 'lucide-react';
import { useTelegram } from '../hooks/useTelegram';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { hapticFeedback } = useTelegram();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/matches', icon: Trophy, label: 'Matches' },
    { path: '/my-contests', icon: Trophy, label: 'My Contests' },
    { path: '/wallet', icon: Wallet, label: 'Wallet' },
    { path: '/profile', icon: User, label: 'Profile' },
  ];

  const handleNavigation = (path) => {
    hapticFeedback('light');
    navigate(path);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-tg-secondary-bg border-t border-tg-hint/20 safe-area-inset z-50">
      <div className="flex justify-around items-center h-16 px-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;

          return (
            <button
              key={item.path}
              onClick={() => handleNavigation(item.path)}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-colors ${
                isActive ? 'text-tg-button' : 'text-tg-hint'
              }`}
            >
              <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-xs mt-1">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
