import { Telegraf } from 'telegraf';
import dotenv from 'dotenv';
import { connectDB } from './database/connection.js';
import { registerUserCommands } from './bot/commands/userCommands.js';
import { registerAdminCommands } from './bot/commands/adminCommands.js';
import { ScoreUpdater } from './cron/scoreUpdater.js';
import { startApiServer } from './api/server.js';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  console.error('❌ BOT_TOKEN is not defined in .env file');
  process.exit(1);
}

// Initialize bot
const bot = new Telegraf(BOT_TOKEN);

// Initialize database connection
await connectDB();

// Error handling
bot.catch((err, ctx) => {
  console.error(`Error for ${ctx.updateType}:`, err);
  ctx.reply('An error occurred. Please try again later.');
});

// Register commands
console.log('📝 Registering bot commands...');
registerUserCommands(bot);
registerAdminCommands(bot);
console.log('✅ Commands registered');

// Initialize cron jobs for live score updates
ScoreUpdater.init(bot);

// Start API server
const API_PORT = process.env.PORT || 3000;
startApiServer(API_PORT);

// Start bot
bot.launch()
  .then(() => {
    console.log('🤖 Fantasy Cricket Bot started successfully!');
    console.log(`Bot username: @${bot.botInfo.username}`);
    console.log('Ready to receive commands...');
  })
  .catch((error) => {
    console.error('❌ Failed to start bot:', error);
    process.exit(1);
  });

// Enable graceful stop
process.once('SIGINT', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGINT');
});

process.once('SIGTERM', () => {
  console.log('\n🛑 Stopping bot...');
  bot.stop('SIGTERM');
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('❌ Uncaught Exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('❌ Unhandled Rejection:', error);
});

export default bot;
