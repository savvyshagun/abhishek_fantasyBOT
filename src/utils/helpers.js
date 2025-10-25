import crypto from 'crypto';

/**
 * Generate a random alphanumeric code
 */
export const generateCode = (length = 8) => {
  return crypto
    .randomBytes(Math.ceil(length / 2))
    .toString('hex')
    .slice(0, length)
    .toUpperCase();
};

/**
 * Format currency amount
 */
export const formatCurrency = (amount, currency = '$') => {
  return `${currency}${parseFloat(amount).toFixed(2)}`;
};

/**
 * Format date to readable string
 */
export const formatDate = (date, options = {}) => {
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return new Date(date).toLocaleString('en-US', { ...defaultOptions, ...options });
};

/**
 * Calculate time remaining until a date
 */
export const getTimeUntil = (targetDate) => {
  const now = new Date();
  const target = new Date(targetDate);
  const diff = target - now;

  if (diff <= 0) {
    return 'Started';
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  if (days > 0) {
    return `${days}d ${hours}h`;
  } else if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else {
    return `${minutes}m`;
  }
};

/**
 * Validate Ethereum/BSC wallet address
 */
export const isValidWalletAddress = (address) => {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
};

/**
 * Truncate wallet address for display
 */
export const truncateAddress = (address, startChars = 6, endChars = 4) => {
  if (!address) return '';
  return `${address.substring(0, startChars)}...${address.substring(address.length - endChars)}`;
};

/**
 * Parse start payload for referral code
 */
export const parseReferralCode = (startPayload) => {
  if (!startPayload || !startPayload.startsWith('ref')) {
    return null;
  }
  return startPayload.substring(3);
};

/**
 * Validate amount (must be positive number)
 */
export const isValidAmount = (amount, min = 0, max = Infinity) => {
  const num = parseFloat(amount);
  return !isNaN(num) && num > min && num <= max;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (value, total) => {
  if (total === 0) return 0;
  return ((value / total) * 100).toFixed(2);
};

/**
 * Generate leaderboard emoji
 */
export const getLeaderboardEmoji = (rank) => {
  switch (rank) {
    case 1:
      return '🥇';
    case 2:
      return '🥈';
    case 3:
      return '🥉';
    default:
      return `${rank}.`;
  }
};

/**
 * Escape markdown special characters
 */
export const escapeMarkdown = (text) => {
  if (!text) return '';
  return text.replace(/([_*\[\]()~`>#+\-=|{}.!])/g, '\\$1');
};

/**
 * Get match status emoji
 */
export const getMatchStatusEmoji = (status) => {
  const statusMap = {
    'upcoming': '⏳',
    'live': '🔴',
    'completed': '✅',
    'cancelled': '❌'
  };
  return statusMap[status] || '📋';
};

/**
 * Calculate prize distribution
 */
export const calculatePrizeDistribution = (prizePool, spots) => {
  const distribution = {};

  if (spots >= 100) {
    // Top 30% get prizes
    const winners = Math.floor(spots * 0.3);
    distribution[1] = prizePool * 0.25;
    distribution[2] = prizePool * 0.15;
    distribution[3] = prizePool * 0.10;

    const remaining = prizePool * 0.50;
    const perWinner = remaining / (winners - 3);

    for (let i = 4; i <= winners; i++) {
      distribution[i] = perWinner;
    }
  } else if (spots >= 10) {
    distribution[1] = prizePool * 0.50;
    distribution[2] = prizePool * 0.30;
    distribution[3] = prizePool * 0.20;
  } else if (spots >= 5) {
    distribution[1] = prizePool * 0.60;
    distribution[2] = prizePool * 0.40;
  } else {
    distribution[1] = prizePool;
  }

  return distribution;
};

/**
 * Chunk array into smaller arrays
 */
export const chunkArray = (array, size) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += size) {
    chunks.push(array.slice(i, i + size));
  }
  return chunks;
};

/**
 * Sleep/delay function
 */
export const sleep = (ms) => {
  return new Promise(resolve => setTimeout(resolve, ms));
};

/**
 * Retry async function with exponential backoff
 */
export const retryWithBackoff = async (fn, maxRetries = 3, baseDelay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      if (i === maxRetries - 1) throw error;

      const delay = baseDelay * Math.pow(2, i);
      console.log(`Retry ${i + 1}/${maxRetries} after ${delay}ms...`);
      await sleep(delay);
    }
  }
};

/**
 * Log with timestamp
 */
export const log = (message, type = 'info') => {
  const timestamp = new Date().toISOString();
  const emoji = {
    info: 'ℹ️',
    success: '✅',
    error: '❌',
    warning: '⚠️'
  }[type] || 'ℹ️';

  console.log(`${emoji} [${timestamp}] ${message}`);
};
