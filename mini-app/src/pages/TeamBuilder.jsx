import { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { Users, Star, Shield, Check } from 'lucide-react';
import Header from '../components/Header';
import Card from '../components/Card';
import Button from '../components/Button';
import Loading from '../components/Loading';
import { useUser } from '../hooks/useUser';
import { useTelegram } from '../hooks/useTelegram';
import api from '../services/api';
import { formatPlayerRole, validateTeam } from '../utils/helpers';

const TeamBuilder = () => {
  const { contestId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { user, updateBalance } = useUser();
  const { showAlert, showConfirm, hapticFeedback } = useTelegram();

  const [match, setMatch] = useState(location.state?.match);
  const [contest, setContest] = useState(location.state?.contest);
  const [availablePlayers, setAvailablePlayers] = useState([]);
  const [selectedPlayers, setSelectedPlayers] = useState([]);
  const [captain, setCaptain] = useState(null);
  const [viceCaptain, setViceCaptain] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    loadContestData();
  }, [contestId]);

  const loadContestData = async () => {
    try {
      setLoading(true);
      // Load contest details if not passed via state
      if (!contest) {
        const response = await api.getContestById(contestId);
        if (response.success) {
          setContest(response.data);
        }
      }

      // Mock player data (in production, fetch from match API data)
      const mockPlayers = generateMockPlayers(match);
      setAvailablePlayers(mockPlayers);
    } catch (error) {
      console.error('Error loading contest data:', error);
      showAlert('Failed to load contest data');
    } finally {
      setLoading(false);
    }
  };

  const generateMockPlayers = (matchData) => {
    // This is mock data. In production, extract from match.apiData
    const players = [];
    const roles = ['batsman', 'bowler', 'allrounder', 'wicket-keeper'];
    const team1Name = matchData?.team1?.name || 'Team 1';
    const team2Name = matchData?.team2?.name || 'Team 2';

    for (let i = 1; i <= 22; i++) {
      players.push({
        id: `player-${i}`,
        name: `Player ${i}`,
        team: i <= 11 ? team1Name : team2Name,
        role: roles[Math.floor(Math.random() * roles.length)],
        credits: 8 + Math.floor(Math.random() * 4), // 8-11 credits
        points: 0,
      });
    }

    return players;
  };

  const handlePlayerToggle = (player) => {
    hapticFeedback('light');

    if (selectedPlayers.find((p) => p.id === player.id)) {
      // Remove player
      setSelectedPlayers(selectedPlayers.filter((p) => p.id !== player.id));
      if (captain?.id === player.id) setCaptain(null);
      if (viceCaptain?.id === player.id) setViceCaptain(null);
    } else {
      // Add player
      if (selectedPlayers.length >= 11) {
        showAlert('You can only select 11 players');
        return;
      }
      setSelectedPlayers([...selectedPlayers, player]);
    }
  };

  const handleSetCaptain = (player) => {
    hapticFeedback('medium');
    if (viceCaptain?.id === player.id) {
      setViceCaptain(null);
    }
    setCaptain(player);
  };

  const handleSetViceCaptain = (player) => {
    hapticFeedback('medium');
    if (captain?.id === player.id) {
      setCaptain(null);
    }
    setViceCaptain(player);
  };

  const handleSubmit = async () => {
    // Validate team
    const validation = validateTeam(
      selectedPlayers,
      captain,
      viceCaptain
    );

    if (!validation.isValid) {
      showAlert(validation.errors.join('\n'));
      return;
    }

    // Confirm entry
    const confirmed = await showConfirm(
      `Entry Fee: $${contest.entryFee}\n\nDo you want to join this contest?`
    );

    if (!confirmed) return;

    try {
      setSubmitting(true);
      hapticFeedback('medium');

      const teamData = {
        players: selectedPlayers.map((p) => p.id),
        captain: captain.id,
        viceCaptain: viceCaptain.id,
      };

      const response = await api.enterContest(contestId, teamData);

      if (response.success) {
        updateBalance(response.data.newBalance);
        hapticFeedback('success');
        showAlert('Successfully joined contest!');
        navigate('/my-contests');
      }
    } catch (error) {
      console.error('Error joining contest:', error);
      showAlert(error.message || 'Failed to join contest');
      hapticFeedback('error');
    } finally {
      setSubmitting(false);
    }
  };

  const isPlayerSelected = (player) => {
    return selectedPlayers.some((p) => p.id === player.id);
  };

  if (loading) {
    return <Loading message="Loading team builder..." />;
  }

  return (
    <div>
      <Header
        title="Create Team"
        showBack
        action={
          <div className="text-right">
            <div className="text-sm text-tg-hint">Selected</div>
            <div className="font-bold">{selectedPlayers.length}/11</div>
          </div>
        }
      />

      <div className="p-4 space-y-4 pb-24">
        {/* Selected Team Preview */}
        {selectedPlayers.length > 0 && (
          <Card>
            <h3 className="font-bold mb-3">Your Team ({selectedPlayers.length}/11)</h3>
            <div className="space-y-2">
              {selectedPlayers.map((player) => (
                <div
                  key={player.id}
                  className="flex items-center justify-between p-2 bg-tg-bg rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <span className="font-medium">{player.name}</span>
                    <span className="text-xs text-tg-hint">
                      {formatPlayerRole(player.role)}
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {captain?.id === player.id && (
                      <span className="px-2 py-1 bg-yellow-500 text-white text-xs rounded font-bold">
                        C
                      </span>
                    )}
                    {viceCaptain?.id === player.id && (
                      <span className="px-2 py-1 bg-blue-500 text-white text-xs rounded font-bold">
                        VC
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Captain Selection */}
            {selectedPlayers.length === 11 && (
              <div className="mt-4 pt-4 border-t border-tg-hint/10">
                <p className="text-sm text-tg-hint mb-3">
                  Select captain (2x points) and vice-captain (1.5x points)
                </p>
                {!captain && !viceCaptain && (
                  <p className="text-sm text-orange-500">
                    Please select your captain and vice-captain
                  </p>
                )}
              </div>
            )}
          </Card>
        )}

        {/* Available Players */}
        <div>
          <h3 className="font-bold text-lg mb-3">Available Players</h3>
          <div className="space-y-2">
            {availablePlayers.map((player) => {
              const selected = isPlayerSelected(player);
              const isCaptain = captain?.id === player.id;
              const isViceCaptain = viceCaptain?.id === player.id;

              return (
                <Card
                  key={player.id}
                  className={`${
                    selected ? 'border-2 border-tg-button' : 'border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Selection Checkbox */}
                    <button
                      onClick={() => handlePlayerToggle(player)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center ${
                        selected
                          ? 'bg-tg-button border-tg-button'
                          : 'border-tg-hint/30'
                      }`}
                    >
                      {selected && <Check size={16} className="text-tg-button-text" />}
                    </button>

                    {/* Player Info */}
                    <div className="flex-1">
                      <div className="font-medium">{player.name}</div>
                      <div className="flex items-center gap-2 text-sm text-tg-hint">
                        <span>{player.team}</span>
                        <span>•</span>
                        <span>{formatPlayerRole(player.role)}</span>
                      </div>
                    </div>

                    {/* Captain/VC Buttons */}
                    {selected && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleSetCaptain(player)}
                          className={`p-2 rounded-lg transition-colors ${
                            isCaptain
                              ? 'bg-yellow-500 text-white'
                              : 'bg-tg-secondary-bg text-tg-hint'
                          }`}
                          title="Set as Captain"
                        >
                          <Star size={18} fill={isCaptain ? 'currentColor' : 'none'} />
                        </button>
                        <button
                          onClick={() => handleSetViceCaptain(player)}
                          className={`p-2 rounded-lg transition-colors ${
                            isViceCaptain
                              ? 'bg-blue-500 text-white'
                              : 'bg-tg-secondary-bg text-tg-hint'
                          }`}
                          title="Set as Vice Captain"
                        >
                          <Shield size={18} fill={isViceCaptain ? 'currentColor' : 'none'} />
                        </button>
                      </div>
                    )}
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </div>

      {/* Fixed Bottom Submit Button */}
      {selectedPlayers.length === 11 && captain && viceCaptain && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-tg-bg border-t border-tg-hint/10 safe-area-inset">
          <Button
            variant="primary"
            fullWidth
            onClick={handleSubmit}
            disabled={submitting}
            className="text-lg"
          >
            {submitting ? 'Joining...' : `Join Contest - $${contest?.entryFee || 0}`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default TeamBuilder;
