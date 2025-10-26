import express from 'express';
import cors from 'cors';
import { validateTelegramWebAppData } from './middleware/auth.js';
import matchesRouter from './routes/matches.js';
import userRouter from './routes/user.js';
import contestsRouter from './routes/contests.js';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Public routes (no auth required)
app.use('/api/matches', matchesRouter);

// Protected routes (require Telegram WebApp auth)
app.use('/api/user', validateTelegramWebAppData, userRouter);
app.use('/api/contests', validateTelegramWebAppData, contestsRouter);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('API Error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

export function startApiServer(port = 3000) {
  const server = app.listen(port, () => {
    console.log(`✅ API Server running on port ${port}`);
    console.log(`📡 Health check: http://localhost:${port}/api/health`);
  });

  return server;
}

export default app;
