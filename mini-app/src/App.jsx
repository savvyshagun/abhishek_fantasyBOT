import { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { TelegramProvider } from './context/TelegramContext';
import { UserProvider } from './context/UserContext';
import { useTelegram } from './hooks/useTelegram';

// Pages
import Home from './pages/Home';
import Matches from './pages/Matches';
import MatchDetails from './pages/MatchDetails';
import TeamBuilder from './pages/TeamBuilder';
import MyContests from './pages/MyContests';
import Wallet from './pages/Wallet';
import Profile from './pages/Profile';
import Leaderboard from './pages/Leaderboard';

// Components
import Layout from './components/Layout';
import Loading from './components/Loading';

function AppContent() {
  const { webApp, isReady } = useTelegram();

  useEffect(() => {
    if (webApp) {
      webApp.ready();
      webApp.expand();
      webApp.enableClosingConfirmation();
    }
  }, [webApp]);

  if (!isReady) {
    return <Loading />;
  }

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/matches" element={<Matches />} />
          <Route path="/matches/:id" element={<MatchDetails />} />
          <Route path="/team-builder/:contestId" element={<TeamBuilder />} />
          <Route path="/my-contests" element={<MyContests />} />
          <Route path="/wallet" element={<Wallet />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/leaderboard/:contestId" element={<Leaderboard />} />
        </Routes>
      </Layout>
    </Router>
  );
}

function App() {
  return (
    <TelegramProvider>
      <UserProvider>
        <AppContent />
      </UserProvider>
    </TelegramProvider>
  );
}

export default App;
