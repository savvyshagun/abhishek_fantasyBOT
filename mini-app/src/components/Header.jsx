import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useTelegram } from '../hooks/useTelegram';

const Header = ({ title, showBack = false, action }) => {
  const navigate = useNavigate();
  const { hapticFeedback } = useTelegram();

  const handleBack = () => {
    hapticFeedback('light');
    navigate(-1);
  };

  return (
    <header className="sticky top-0 z-40 bg-tg-bg border-b border-tg-hint/10">
      <div className="flex items-center justify-between px-4 py-3">
        <div className="flex items-center gap-3">
          {showBack && (
            <button
              onClick={handleBack}
              className="p-2 -ml-2 rounded-full hover:bg-tg-hint/10 transition-colors"
            >
              <ArrowLeft size={24} />
            </button>
          )}
          <h1 className="text-xl font-bold">{title}</h1>
        </div>
        {action && <div>{action}</div>}
      </div>
    </header>
  );
};

export default Header;
