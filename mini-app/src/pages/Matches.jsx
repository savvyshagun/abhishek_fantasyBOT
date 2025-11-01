import { useState, useEffect } from 'react';
import { Trophy, Search } from 'lucide-react';
import Header from '../components/Header';
import MatchCard from '../components/MatchCard';
import EmptyState from '../components/EmptyState';
import Button from '../components/Button';
import Loading from '../components/Loading';
import api from '../services/api';

const Matches = () => {
  const [matches, setMatches] = useState([]);
  const [filteredMatches, setFilteredMatches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadMatches();
  }, []);

  useEffect(() => {
    filterMatches();
  }, [matches, filter, searchQuery]);

  const loadMatches = async () => {
    try {
      setLoading(true);
      const response = await api.getMatches(50);
      if (response.success) {
        setMatches(response.data || []);
      }
    } catch (error) {
      console.error('Error loading matches:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterMatches = () => {
    let filtered = [...matches];

    // Filter by status
    if (filter !== 'all') {
      filtered = filtered.filter((match) => match.status === filter);
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter((match) =>
        match.team1?.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        match.team2?.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredMatches(filtered);
  };

  const filters = [
    { value: 'all', label: 'All' },
    { value: 'upcoming', label: 'Upcoming' },
    { value: 'live', label: 'Live' },
    { value: 'completed', label: 'Completed' },
  ];

  if (loading) {
    return <Loading message="Loading matches..." />;
  }

  return (
    <div>
      <Header title="Matches" />

      <div className="p-4 space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-tg-hint" size={20} />
          <input
            type="text"
            placeholder="Search teams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-tg-secondary-bg text-tg-text rounded-xl border-2 border-transparent focus:border-tg-button outline-none"
          />
        </div>

        {/* Filter Tabs */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {filters.map((f) => (
            <button
              key={f.value}
              onClick={() => setFilter(f.value)}
              className={`px-4 py-2 rounded-xl font-medium whitespace-nowrap transition-colors ${
                filter === f.value
                  ? 'bg-tg-button text-tg-button-text'
                  : 'bg-tg-secondary-bg text-tg-hint'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Matches List */}
        {filteredMatches.length === 0 ? (
          <EmptyState
            icon={Trophy}
            title="No Matches Found"
            message={
              searchQuery
                ? 'Try adjusting your search query'
                : 'No matches available at the moment. Check back soon!'
            }
            action={
              searchQuery && (
                <Button onClick={() => setSearchQuery('')}>Clear Search</Button>
              )
            }
          />
        ) : (
          <div className="space-y-3">
            {filteredMatches.map((match) => (
              <MatchCard key={match._id} match={match} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Matches;
