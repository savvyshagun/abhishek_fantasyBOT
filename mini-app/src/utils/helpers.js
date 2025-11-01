/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = '$') => {
  if (typeof amount !== 'number') return `${currency}0.00`;
  return `${currency}${amount.toFixed(2)}`;
};

/**
 * Format date
 */
export const formatDate = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

/**
 * Format time
 */
export const formatTime = (date) => {
  if (!date) return '';
  const d = new Date(date);
  return d.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });
};

/**
 * Format date and time
 */
export const formatDateTime = (date) => {
  if (!date) return '';
  return `${formatDate(date)} at ${formatTime(date)}`;
};

/**
 * Get time until match
 */
export const getTimeUntil = (date) => {
  if (!date) return '';
  const now = new Date();
  const matchDate = new Date(date);
  const diff = matchDate - now;

  if (diff < 0) return 'Started';

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) return `${days}d ${hours}h`;
  if (hours > 0) return `${hours}h ${minutes}m`;
  return `${minutes}m`;
};

/**
 * Truncate text
 */
export const truncateText = (text, maxLength = 50) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

/**
 * Get initials from name
 */
export const getInitials = (name) => {
  if (!name) return '?';
  const parts = name.trim().split(' ');
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.substring(0, 2).toUpperCase();
};

/**
 * Calculate prize distribution percentage
 */
export const calculatePrizePercentage = (prizePool, rank, totalRanks = 10) => {
  // Simple distribution: 50%, 30%, 20% for top 3
  const distribution = {
    1: 0.5,
    2: 0.3,
    3: 0.2,
  };

  return prizePool * (distribution[rank] || 0);
};

/**
 * Format player role
 */
export const formatPlayerRole = (role) => {
  const roles = {
    batsman: 'BAT',
    bowler: 'BOWL',
    allrounder: 'ALL',
    'wicket-keeper': 'WK',
  };
  return roles[role?.toLowerCase()] || role;
};

/**
 * Get match status color
 */
export const getMatchStatusColor = (status) => {
  const colors = {
    upcoming: 'text-blue-500',
    live: 'text-red-500',
    completed: 'text-green-500',
    cancelled: 'text-gray-500',
  };
  return colors[status?.toLowerCase()] || 'text-gray-500';
};

/**
 * Get match status badge color
 */
export const getMatchStatusBadgeColor = (status) => {
  const colors = {
    upcoming: 'bg-blue-100 text-blue-800',
    live: 'bg-red-100 text-red-800',
    completed: 'bg-green-100 text-green-800',
    cancelled: 'bg-gray-100 text-gray-800',
  };
  return colors[status?.toLowerCase()] || 'bg-gray-100 text-gray-800';
};

/**
 * Copy to clipboard
 */
export const copyToClipboard = async (text) => {
  try {
    if (navigator.clipboard) {
      await navigator.clipboard.writeText(text);
      return true;
    } else {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed';
      textArea.style.left = '-999999px';
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    }
  } catch (err) {
    console.error('Failed to copy:', err);
    return false;
  }
};

/**
 * Validate team selection
 */
export const validateTeam = (players, captain, viceCaptain) => {
  const errors = [];

  if (players.length !== 11) {
    errors.push('Team must have exactly 11 players');
  }

  if (!captain) {
    errors.push('Please select a captain');
  }

  if (!viceCaptain) {
    errors.push('Please select a vice-captain');
  }

  if (captain === viceCaptain) {
    errors.push('Captain and vice-captain must be different');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

/**
 * Group players by role
 */
export const groupPlayersByRole = (players) => {
  return players.reduce((acc, player) => {
    const role = player.role || 'Unknown';
    if (!acc[role]) {
      acc[role] = [];
    }
    acc[role].push(player);
    return acc;
  }, {});
};
