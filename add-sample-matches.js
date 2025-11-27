import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { MatchModel as Match } from './src/models/Match.js';
import { ContestModel as Contest } from './src/models/Contest.js';

dotenv.config();

// Sample upcoming cricket matches
const sampleMatches = [
  {
    match_id: 'sample-1',
    name: 'India vs Australia, 1st T20I',
    team1: 'India',
    team2: 'Australia',
    match_type: 't20',
    venue: 'Sydney Cricket Ground, Sydney',
    match_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // 2 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'India', shortname: 'IND', img: 'https://g.cricapi.com/iapi/1171-637877080213498498.webp?w=48' },
        { name: 'Australia', shortname: 'AUS', img: 'https://g.cricapi.com/iapi/1174-637877082213697654.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-2',
    name: 'England vs South Africa, 2nd ODI',
    team1: 'England',
    team2: 'South Africa',
    match_type: 'odi',
    venue: 'Lords Cricket Ground, London',
    match_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000), // 3 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'England', shortname: 'ENG', img: 'https://g.cricapi.com/iapi/1175-637877082334834889.webp?w=48' },
        { name: 'South Africa', shortname: 'SA', img: 'https://g.cricapi.com/iapi/1176-637877082421665949.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-3',
    name: 'Pakistan vs New Zealand, 3rd T20I',
    team1: 'Pakistan',
    team2: 'New Zealand',
    match_type: 't20',
    venue: 'National Stadium, Karachi',
    match_date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000), // 4 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'Pakistan', shortname: 'PAK', img: 'https://g.cricapi.com/iapi/1177-637877082512435959.webp?w=48' },
        { name: 'New Zealand', shortname: 'NZ', img: 'https://g.cricapi.com/iapi/1178-637877082603006059.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-4',
    name: 'West Indies vs Bangladesh, 1st T20I',
    team1: 'West Indies',
    team2: 'Bangladesh',
    match_type: 't20',
    venue: 'Kensington Oval, Bridgetown',
    match_date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'West Indies', shortname: 'WI', img: 'https://g.cricapi.com/iapi/1179-637877082693576259.webp?w=48' },
        { name: 'Bangladesh', shortname: 'BAN', img: 'https://g.cricapi.com/iapi/1180-637877082784146459.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-5',
    name: 'Sri Lanka vs Afghanistan, 2nd T20I',
    team1: 'Sri Lanka',
    team2: 'Afghanistan',
    match_type: 't20',
    venue: 'R. Premadasa Stadium, Colombo',
    match_date: new Date(Date.now() + 6 * 24 * 60 * 60 * 1000), // 6 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'Sri Lanka', shortname: 'SL', img: 'https://g.cricapi.com/iapi/1181-637877082874716659.webp?w=48' },
        { name: 'Afghanistan', shortname: 'AFG', img: 'https://g.cricapi.com/iapi/1182-637877082965286859.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-6',
    name: 'India vs Australia, 2nd T20I',
    team1: 'India',
    team2: 'Australia',
    match_type: 't20',
    venue: 'Melbourne Cricket Ground, Melbourne',
    match_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'India', shortname: 'IND', img: 'https://g.cricapi.com/iapi/1171-637877080213498498.webp?w=48' },
        { name: 'Australia', shortname: 'AUS', img: 'https://g.cricapi.com/iapi/1174-637877082213697654.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-7',
    name: 'Mumbai Indians vs Chennai Super Kings',
    team1: 'Mumbai Indians',
    team2: 'Chennai Super Kings',
    match_type: 't20',
    venue: 'Wankhede Stadium, Mumbai',
    match_date: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000), // 8 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'Mumbai Indians', shortname: 'MI', img: null },
        { name: 'Chennai Super Kings', shortname: 'CSK', img: null }
      ]
    }
  },
  {
    match_id: 'sample-8',
    name: 'Royal Challengers vs Kolkata Knight Riders',
    team1: 'Royal Challengers Bangalore',
    team2: 'Kolkata Knight Riders',
    match_type: 't20',
    venue: 'M. Chinnaswamy Stadium, Bangalore',
    match_date: new Date(Date.now() + 9 * 24 * 60 * 60 * 1000), // 9 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'Royal Challengers Bangalore', shortname: 'RCB', img: null },
        { name: 'Kolkata Knight Riders', shortname: 'KKR', img: null }
      ]
    }
  },
  {
    match_id: 'sample-9',
    name: 'India vs Australia, 3rd T20I',
    team1: 'India',
    team2: 'Australia',
    match_type: 't20',
    venue: 'Adelaide Oval, Adelaide',
    match_date: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'India', shortname: 'IND', img: 'https://g.cricapi.com/iapi/1171-637877080213498498.webp?w=48' },
        { name: 'Australia', shortname: 'AUS', img: 'https://g.cricapi.com/iapi/1174-637877082213697654.webp?w=48' }
      ]
    }
  },
  {
    match_id: 'sample-10',
    name: 'England vs South Africa, 3rd ODI',
    team1: 'England',
    team2: 'South Africa',
    match_type: 'odi',
    venue: 'The Oval, London',
    match_date: new Date(Date.now() + 11 * 24 * 60 * 60 * 1000), // 11 days from now
    status: 'upcoming',
    api_data: {
      teamInfo: [
        { name: 'England', shortname: 'ENG', img: 'https://g.cricapi.com/iapi/1175-637877082334834889.webp?w=48' },
        { name: 'South Africa', shortname: 'SA', img: 'https://g.cricapi.com/iapi/1176-637877082421665949.webp?w=48' }
      ]
    }
  }
];

// Contest types
const contestTypes = [
  { name: 'Mega Contest', entry_fee: 49, prize_pool: 10000, max_spots: 100 },
  { name: 'Head to Head', entry_fee: 25, prize_pool: 45, max_spots: 2 },
  { name: 'Winner Takes All', entry_fee: 99, prize_pool: 5000, max_spots: 50 },
  { name: 'Practice Contest', entry_fee: 10, prize_pool: 100, max_spots: 20 },
];

async function addSampleData() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    // Clear existing sample data
    console.log('🧹 Cleaning up old sample data...');
    await mongoose.connection.collection('matches').deleteMany({ matchId: { $regex: /^sample-/ } });
    await mongoose.connection.collection('contests').deleteMany({ contestId: { $regex: /^contest-sample-/ } });
    console.log('✅ Cleaned up old data\n');

    console.log('🏏 Adding sample matches...');
    let matchCount = 0;
    let contestCount = 0;

    for (const matchData of sampleMatches) {
      try {
        const match = await Match.create(matchData);
        console.log(`✅ Added match: ${matchData.name}`);
        matchCount++;

        // Create contests for this match
        for (const contestType of contestTypes) {
          try {
            await Contest.create({
              contest_id: `contest-${matchData.match_id}-${contestType.name.toLowerCase().replace(/\s+/g, '-')}`,
              match_id: match._id,
              name: contestType.name,
              entry_fee: contestType.entry_fee,
              prize_pool: contestType.prize_pool,
              max_spots: contestType.max_spots,
              joined_users: 0,
              status: 'open'
            });
            contestCount++;
          } catch (contestError) {
            if (!contestError.message.includes('duplicate key')) {
              console.error(`  ❌ Contest error: ${contestError.message}`);
            }
          }
        }
        console.log(`   ✅ Created ${contestTypes.length} contests for this match`);
      } catch (matchError) {
        if (matchError.message.includes('duplicate key')) {
          console.log(`⏭️  Skipped: ${matchData.name} (already exists)`);
        } else {
          console.error(`❌ Error adding match: ${matchError.message}`);
        }
      }
    }

    console.log('\n📈 Summary:');
    console.log(`✅ Matches added: ${matchCount}`);
    console.log(`✅ Contests created: ${contestCount}`);

    // Verify data
    const allMatches = await Match.getUpcoming(50);
    console.log(`\n📊 Total upcoming matches in database: ${allMatches.length}`);

    await mongoose.disconnect();
    console.log('\n✅ Done! Sample data added successfully.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

addSampleData();
