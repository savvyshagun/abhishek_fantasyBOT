import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import { MatchModel } from './src/models/Match.js';
import { ContestModel } from './src/models/Contest.js';

dotenv.config();

const API_KEY = process.env.SPORTS_API_KEY;

async function quickSync() {
  console.log('🔌 Connecting to MongoDB...');
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('✅ Connected!\n');

  console.log('🏏 Fetching matches from CricAPI...');
  console.log('Using API key:', API_KEY?.substring(0, 8) + '...\n');

  const [currentRes, matchesRes] = await Promise.all([
    axios.get('https://api.cricapi.com/v1/currentMatches', {
      params: { apikey: API_KEY, offset: 0 }
    }).catch(e => {
      console.log('currentMatches error:', e.response?.data?.reason || e.message);
      return { data: { data: [] } };
    }),
    axios.get('https://api.cricapi.com/v1/matches', {
      params: { apikey: API_KEY, offset: 0 }
    }).catch(e => {
      console.log('matches error:', e.response?.data?.reason || e.message);
      return { data: { data: [] } };
    })
  ]);

  const allMatches = [];
  const seen = new Set();

  for (const m of [...(currentRes.data?.data || []), ...(matchesRes.data?.data || [])]) {
    if (!seen.has(m.id) && !m.matchEnded) {
      allMatches.push(m);
      seen.add(m.id);
    }
  }

  console.log(`📊 Found ${allMatches.length} upcoming/live matches\n`);

  let added = 0;
  for (const m of allMatches) {
    try {
      const existing = await MatchModel.findByMatchId(m.id);
      if (existing) {
        console.log(`⏭️  Skip: ${m.name} (exists)`);
        continue;
      }

      const match = await MatchModel.create({
        match_id: m.id,
        name: m.name,
        team1: m.teams?.[0] || 'TBA',
        team2: m.teams?.[1] || 'TBA',
        match_type: m.matchType,
        venue: m.venue || 'TBA',
        match_date: new Date(m.dateTimeGMT || m.date),
        status: m.matchStarted ? 'live' : 'upcoming',
        api_data: m
      });

      console.log(`✅ Added: ${m.name}`);
      added++;

      // Create contests
      const contests = [
        { name: 'Mega Contest', entry_fee: 49, prize_pool: 10000, max_spots: 100 },
        { name: 'Head to Head', entry_fee: 25, prize_pool: 45, max_spots: 2 },
        { name: 'Practice Contest', entry_fee: 10, prize_pool: 100, max_spots: 20 }
      ];

      for (const c of contests) {
        try {
          await ContestModel.create({
            contest_id: `contest-${m.id}-${c.name.toLowerCase().replace(/\s+/g, '-')}`,
            match_id: match._id,
            name: c.name,
            entry_fee: c.entry_fee,
            prize_pool: c.prize_pool,
            max_spots: c.max_spots,
            joined_users: 0,
            status: 'open'
          });
        } catch (e) {
          // Ignore duplicate contests
        }
      }
      console.log(`   Created 3 contests`);
    } catch (e) {
      if (!e.message.includes('duplicate')) {
        console.error(`❌ Error: ${e.message}`);
      }
    }
  }

  console.log(`\n📈 Summary:`);
  console.log(`✅ Added: ${added} matches`);

  const total = await MatchModel.getUpcoming(100);
  console.log(`📊 Total upcoming in DB: ${total.length}\n`);

  if (total.length > 0) {
    console.log('Sample matches:');
    total.slice(0, 5).forEach((m, i) => {
      console.log(`${i + 1}. ${m.name} - ${m.status}`);
    });
  }

  await mongoose.disconnect();
  console.log('\n✅ Done!');
}

quickSync().catch(console.error);
