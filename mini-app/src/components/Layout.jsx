import { useLocation } from 'react-router-dom';
import BottomNav from './BottomNav';

const Layout = ({ children }) => {
  const location = useLocation();

  // Pages that should hide bottom navigation
  const hideNavPaths = ['/team-builder', '/leaderboard'];
  const shouldHideNav = hideNavPaths.some(path => location.pathname.startsWith(path));

  return (
    <div className="min-h-screen bg-tg-bg text-tg-text pb-safe">
      <main className={shouldHideNav ? 'pb-0' : 'pb-20'}>
        {children}
      </main>
      {!shouldHideNav && <BottomNav />}
    </div>
  );
};

export default Layout;
