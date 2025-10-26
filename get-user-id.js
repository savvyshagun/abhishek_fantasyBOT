import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const BOT_TOKEN = process.env.BOT_TOKEN;

console.log('\n🤖 Telegram User ID Fetcher\n');
console.log('================================================\n');

async function getUserId() {
  try {
    console.log('1️⃣ Testing bot token...');

    // Test bot info
    const botInfo = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getMe`);

    if (botInfo.data.ok) {
      console.log(`✅ Bot connected: @${botInfo.data.result.username}\n`);
      console.log(`📋 Bot Details:`);
      console.log(`   Name: ${botInfo.data.result.first_name}`);
      console.log(`   Username: @${botInfo.data.result.username}`);
      console.log(`   Bot ID: ${botInfo.data.result.id}\n`);
    } else {
      throw new Error('Invalid bot token');
    }

    console.log('2️⃣ Waiting for you to send a message...\n');
    console.log('📱 ACTION REQUIRED:');
    console.log('   1. Open Telegram');
    console.log(`   2. Search for @${botInfo.data.result.username}`);
    console.log('   3. Send ANY message (like "hello" or "/start")\n');
    console.log('⏳ Checking for messages...\n');

    // Poll for updates
    let found = false;
    let attempts = 0;
    const maxAttempts = 60; // 2 minutes

    while (!found && attempts < maxAttempts) {
      try {
        const updates = await axios.get(`https://api.telegram.org/bot${BOT_TOKEN}/getUpdates`, {
          params: {
            offset: -1,
            limit: 1
          }
        });

        if (updates.data.ok && updates.data.result.length > 0) {
          const message = updates.data.result[0].message || updates.data.result[0].callback_query?.message;
          const from = updates.data.result[0].message?.from || updates.data.result[0].callback_query?.from;

          if (from) {
            console.log('✅ Got your message!\n');
            console.log('================================================');
            console.log('📋 YOUR TELEGRAM INFO:');
            console.log('================================================\n');
            console.log(`User ID: ${from.id}`);
            console.log(`Username: @${from.username || 'N/A'}`);
            console.log(`Name: ${from.first_name} ${from.last_name || ''}`);
            console.log(`\n================================================\n`);

            console.log('✏️  COPY THIS TO YOUR .env FILE:\n');
            console.log(`ADMIN_IDS=${from.id}\n`);

            console.log('================================================\n');
            console.log('✅ Done! Update your .env file with the ADMIN_IDS value above.\n');

            found = true;
            process.exit(0);
          }
        }
      } catch (pollError) {
        // Continue polling
      }

      if (!found) {
        attempts++;
        process.stdout.write(`   Waiting... (${attempts}/${maxAttempts})\r`);
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
    }

    if (!found) {
      console.log('\n\n⏰ Timeout! No message received.\n');
      console.log('Please make sure you:');
      console.log('1. Found the bot on Telegram');
      console.log('2. Sent a message to it');
      console.log('3. Try running this script again\n');
    }

  } catch (error) {
    console.error('\n❌ Error:', error.response?.data?.description || error.message);

    if (error.response?.status === 404) {
      console.log('\n💡 The bot token appears to be invalid.');
      console.log('Please check your .env file and make sure BOT_TOKEN is correct.\n');
    }
  }
}

getUserId();
