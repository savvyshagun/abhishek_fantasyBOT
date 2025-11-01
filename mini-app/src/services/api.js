import axios from 'axios';
import WebApp from '@twa-dev/sdk';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api';

// Create axios instance
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 15000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add Telegram auth data
axiosInstance.interceptors.request.use(
  (config) => {
    const tg = window.Telegram?.WebApp || WebApp;
    if (tg?.initData) {
      config.headers['x-telegram-init-data'] = tg.initData;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => response.data,
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error.response?.data || error);
  }
);

// API methods
const api = {
  // Health check
  healthCheck: () => axiosInstance.get('/health'),

  // Matches
  getMatches: (limit = 20) => axiosInstance.get('/matches', { params: { limit } }),
  getMatchById: (id) => axiosInstance.get(`/matches/${id}`),
  getMatchContests: (id) => axiosInstance.get(`/matches/${id}/contests`),

  // User
  getUserProfile: () => axiosInstance.get('/user/profile'),
  getUserWallet: () => axiosInstance.get('/user/wallet'),
  getUserContests: () => axiosInstance.get('/user/contests'),
  getUserTeams: () => axiosInstance.get('/user/teams'),

  // Contests
  getContestById: (id) => axiosInstance.get(`/contests/${id}`),
  enterContest: (id, teamData) => axiosInstance.post(`/contests/${id}/enter`, teamData),
  getContestLeaderboard: (id, limit = 50) =>
    axiosInstance.get(`/contests/${id}/leaderboard`, { params: { limit } }),

  // Wallet (future endpoints)
  requestDeposit: (amount) => axiosInstance.post('/user/wallet/deposit', { amount }),
  requestWithdrawal: (amount, address) =>
    axiosInstance.post('/user/wallet/withdraw', { amount, address }),
};

export default api;
