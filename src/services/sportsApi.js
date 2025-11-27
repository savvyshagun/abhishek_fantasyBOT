import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

// Support multiple API providers
const API_URL = process.env.CRICKET_API_URL || 'https://api.cricketdata.org';
const API_EMAIL = process.env.CRICKET_API_EMAIL;
const API_PASSWORD = process.env.CRICKET_API_PASSWORD;
const CRICAPI_KEY = process.env.SPORTS_API_KEY; // Fallback to CricAPI

let authToken = null;

export class SportsApiService {
  // Authenticate with cricketdata.org
  static async authenticateCricketData() {
    try {
      // Try multiple possible authentication endpoints
      const authEndpoints = [
        `${API_URL}/login`,
        `${API_URL}/auth/login`,
        `${API_URL}/api/login`,
        `${API_URL}/v1/login`
      ];

      for (const endpoint of authEndpoints) {
        try {
          const response = await axios.post(endpoint, {
            email: API_EMAIL,
            password: API_PASSWORD
          }, {
            timeout: 5000
          });

          if (response.data && (response.data.token || response.data.data?.token)) {
            authToken = response.data.token || response.data.data.token;
            console.log('✅ Authenticated with', endpoint);
            return authToken;
          }
        } catch (err) {
          // Try next endpoint
          continue;
        }
      }

      throw new Error('All authentication endpoints failed');
    } catch (error) {
      console.error('CricketData.org authentication failed:', error.message);
      throw error;
    }
  }

  // Fallback to CricAPI
  static async getMatchesFromCricAPI() {
    if (!CRICAPI_KEY) {
      throw new Error('No CricAPI key configured');
    }

    try {
      // Fetch both current (live) and upcoming matches with multiple offsets
      const requests = [];

      // Current matches (live)
      requests.push(
        axios.get('https://api.cricapi.com/v1/currentMatches', {
          params: { apikey: CRICAPI_KEY, offset: 0 }
        }).catch(() => ({ data: { data: [] } }))
      );

      // Upcoming matches with multiple pages to get more matches
      for (let offset = 0; offset < 50; offset += 25) {
        requests.push(
          axios.get('https://api.cricapi.com/v1/matches', {
            params: { apikey: CRICAPI_KEY, offset }
          }).catch(() => ({ data: { data: [] } }))
        );
      }

      const responses = await Promise.all(requests);

      // Combine all matches
      const allMatches = [];
      const existingIds = new Set();

      for (const response of responses) {
        const matches = response.data?.data || [];
        for (const match of matches) {
          // Add all matches that haven't ended (T20, ODI, Test)
          if (!existingIds.has(match.id) && !match.matchEnded) {
            allMatches.push(match);
            existingIds.add(match.id);
          }
        }
      }

      console.log(`📊 Fetched ${allMatches.length} matches from CricAPI`);
      return allMatches;
    } catch (error) {
      console.error('CricAPI error:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      return [];
    }
  }

  // Get upcoming matches (with fallbacks)
  static async getUpcomingMatches() {
    // Try CricketData.org first
    if (API_EMAIL && API_PASSWORD) {
      try {
        if (!authToken) {
          await this.authenticateCricketData();
        }

        const response = await axios.get(`${API_URL}/matches`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          },
          params: {
            status: 'upcoming',
            limit: 20
          },
          timeout: 10000
        });

        if (response.data && response.data.data) {
          return response.data.data;
        } else if (Array.isArray(response.data)) {
          return response.data;
        }
      } catch (error) {
        console.warn('CricketData.org failed, trying fallback...');

        // Re-authenticate and retry once
        if (error.response?.status === 401) {
          authToken = null;
          try {
            await this.authenticateCricketData();
            return await this.getUpcomingMatches();
          } catch (retryError) {
            // Fall through to CricAPI
          }
        }
      }
    }

    // Fallback to CricAPI
    console.log('Using CricAPI fallback...');
    return await this.getMatchesFromCricAPI();
  }

  // Get match info
  static async getMatchInfo(matchId) {
    try {
      if (authToken) {
        const response = await axios.get(`${API_URL}/match/${matchId}`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
          timeout: 5000
        });
        return response.data?.data || response.data || null;
      }

      // Fallback to CricAPI
      if (CRICAPI_KEY) {
        const response = await axios.get('https://api.cricapi.com/v1/match_info', {
          params: { apikey: CRICAPI_KEY, id: matchId }
        });
        return response.data?.data || null;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching match info:`, error.message);
      return null;
    }
  }

  // Get live score
  static async getLiveScore(matchId) {
    try {
      if (authToken) {
        const response = await axios.get(`${API_URL}/match/${matchId}/live`, {
          headers: { 'Authorization': `Bearer ${authToken}` },
          timeout: 5000
        });
        return response.data?.data || response.data || null;
      }

      // Fallback to CricAPI
      if (CRICAPI_KEY) {
        const response = await axios.get('https://api.cricapi.com/v1/match_scorecard', {
          params: { apikey: CRICAPI_KEY, id: matchId }
        });
        return response.data?.data || null;
      }

      return null;
    } catch (error) {
      console.error(`Error fetching live score:`, error.message);
      return null;
    }
  }

  // Parse player stats from scorecard
  static parsePlayerStats(scorecard) {
    const playerStats = {};

    if (!scorecard) return playerStats;

    try {
      // Parse batting stats
      if (scorecard.batting) {
        const battingData = Array.isArray(scorecard.batting) ? scorecard.batting : [scorecard.batting];

        for (const innings of battingData) {
          const players = Array.isArray(innings) ? innings : innings.players || [];

          for (const player of players) {
            const name = player.name || player.player_name;
            if (!name) continue;

            if (!playerStats[name]) {
              playerStats[name] = {
                runs: 0,
                wickets: 0,
                catches: 0,
                stumpings: 0,
                fours: 0,
                sixes: 0,
                strike_rate: 0,
                balls_faced: 0
              };
            }

            playerStats[name].runs += parseInt(player.runs || player.r || 0);
            playerStats[name].fours += parseInt(player.fours || player['4s'] || 0);
            playerStats[name].sixes += parseInt(player.sixes || player['6s'] || 0);
            playerStats[name].balls_faced += parseInt(player.balls || player.b || 0);
            playerStats[name].strike_rate = parseFloat(player.sr || player.strike_rate || 0);
          }
        }
      }

      // Parse bowling stats
      if (scorecard.bowling) {
        const bowlingData = Array.isArray(scorecard.bowling) ? scorecard.bowling : [scorecard.bowling];

        for (const innings of bowlingData) {
          const players = Array.isArray(innings) ? innings : innings.players || [];

          for (const player of players) {
            const name = player.name || player.player_name;
            if (!name) continue;

            if (!playerStats[name]) {
              playerStats[name] = {
                runs: 0,
                wickets: 0,
                catches: 0,
                stumpings: 0,
                economy_rate: 0,
                overs_bowled: 0,
                maiden_overs: 0
              };
            }

            playerStats[name].wickets += parseInt(player.wickets || player.w || 0);
            playerStats[name].economy_rate = parseFloat(player.economy || player.econ || 0);
            playerStats[name].overs_bowled = parseFloat(player.overs || player.o || 0);
            playerStats[name].maiden_overs += parseInt(player.maidens || player.m || 0);
          }
        }
      }
    } catch (error) {
      console.error('Error parsing player stats:', error);
    }

    return playerStats;
  }

  // Test API connection
  static async testConnection() {
    console.log('\n🏏 Testing Cricket API Connection...\n');

    // Test CricketData.org
    if (API_EMAIL && API_PASSWORD) {
      console.log('1️⃣ Testing CricketData.org...');
      try {
        await this.authenticateCricketData();
        const matches = await this.getUpcomingMatches();
        console.log(`✅ CricketData.org: Found ${matches.length} matches\n`);
        return true;
      } catch (error) {
        console.log(`❌ CricketData.org failed: ${error.message}\n`);
      }
    }

    // Test CricAPI fallback
    if (CRICAPI_KEY) {
      console.log('2️⃣ Testing CricAPI fallback...');
      try {
        const matches = await this.getMatchesFromCricAPI();
        console.log(`✅ CricAPI: Found ${matches.length} matches\n`);
        return true;
      } catch (error) {
        console.log(`❌ CricAPI failed: ${error.message}\n`);
      }
    }

    console.log('❌ All API providers failed\n');
    console.log('💡 Solutions:');
    console.log('1. Verify CricketData.org credentials');
    console.log('2. OR Get a free CricAPI key from https://cricapi.com');
    console.log('3. Add SPORTS_API_KEY to .env\n');

    return false;
  }
}
