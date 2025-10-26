import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log('\n🔍 Checking for recent messages...\n');

async function getRecentMessages() {
  try {
    const response = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`);

    if (response.data.ok) {
      const updates = response.data.result;

      if (updates.length === 0) {
        console.log('❌ No messages found yet.\n');
        console.log('📱 Please:');
        console.log('1. Open Telegram');
        console.log('2. Search for @shagunnbot');
        console.log('3. Send /start or any message');
        console.log('4. Run this script again: node get-id-simple.js\n');
        return;
      }

      console.log(`✅ Found ${updates.length} message(s)\n`);
      console.log('================================================');
      console.log('RECENT USERS WHO MESSAGED YOUR BOT:');
      console.log('================================================\n');

      // Get unique users
      const users = new Map();

      updates.forEach(update => {
        const from = update.message?.from || update.callback_query?.from;
        if (from) {
          users.set(from.id, from);
        }
      });

      let index = 1;
      users.forEach(user => {
        console.log(`User ${index}:`);
        console.log(`  User ID: ${user.id}`);
        console.log(`  Name: ${user.first_name} ${user.last_name || ''}`);
        console.log(`  Username: @${user.username || 'N/A'}`);
        console.log('');
        index++;
      });

      // Get the most recent user
      const latestUpdate = updates[updates.length - 1];
      const latestUser = latestUpdate.message?.from || latestUpdate.callback_query?.from;

      if (latestUser) {
        console.log('================================================');
        console.log('MOST RECENT MESSAGE FROM:');
        console.log('================================================\n');
        console.log(`User ID: ${latestUser.id}`);
        console.log(`Name: ${latestUser.first_name} ${latestUser.last_name || ''}`);
        console.log(`Username: @${latestUser.username || 'N/A'}\n`);
        console.log('================================================\n');
        console.log('✏️  ADD THIS TO YOUR .env FILE:\n');
        console.log(`ADMIN_IDS=${latestUser.id}\n`);
        console.log('================================================\n');
      }
    }
  } catch (error) {
    console.error('❌ Error:', error.response?.data?.description || error.message);
  }
}

getRecentMessages();
