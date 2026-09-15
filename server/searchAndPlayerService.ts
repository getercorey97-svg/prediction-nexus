import { MatchSearchResult, SportType, TableTennisPlayer } from '../src/types';
import { mockGames } from './data/sportsStore';
import { tableTennisScheduledMatches, tableTennisPlayers } from './tableTennisEngine';

export interface MultiSportPlayerProfile {
  id: string;
  name: string;
  sport: SportType;
  teamOrCountry: string;
  leagueOrTournament: string;
  primaryRole: string; // e.g., 'Attacker / Inverted Blade', 'Starting Pitcher (LHP)', 'Quarterback'
  ratingOrQbr: number; // Elo / Glicko-2 / QBR
  rdOrVariance: number;
  winLossSeason: { wins: number; losses: number };
  winLossLast10: { wins: number; losses: number };
  winStreak: string; // e.g. "🔥 5W Streak"
  recentForm: Array<'W' | 'L'>;
  matchesToday: number;
  fatigueIndex: number;
  tacticalMetrics: {
    label1: string;
    val1: string;
    label2: string;
    val2: string;
    label3: string;
    val3: string;
    label4: string;
    val4: string;
  };
  equipmentOrBio: string;
  scoutingNotes: string;
  headToHeadHistory?: Record<string, { wins: number; losses: number; lastMeeting: string }>;
  recentMatchesLog: Array<{
    date: string;
    opponent: string;
    result: 'W' | 'L';
    score: string;
    event: string;
  }>;
  lastLiveUpdate: string;
}

// Initial Cross-Sport Star Players Database
let crossSportPlayers: MultiSportPlayerProfile[] = [
  // Table Tennis Stars
  {
    id: 'tt-p-moregard',
    name: 'Truls Möregårdh',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Sweden',
    leagueOrTournament: 'WTT Contender / Olympic Elite',
    primaryRole: 'Attacker (Shakehand Righty)',
    ratingOrQbr: 2154,
    rdOrVariance: 33,
    winLossSeason: { wins: 44, losses: 14 },
    winLossLast10: { wins: 9, losses: 1 },
    winStreak: '🔥 4W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'],
    matchesToday: 1,
    fatigueIndex: 0.12,
    tacticalMetrics: {
      label1: 'Serve Win %', val1: '62.5%',
      label2: 'Return Win %', val2: '51.8%',
      label3: '3rd-Ball Attack %', val3: '68.4%',
      label4: 'Deuce Win %', val4: '59.2%'
    },
    equipmentOrBio: 'Stiga Cybershape Carbon • Inverted DNA Pro FH / Inverted DNA Platinum BH',
    scoutingNotes: 'Olympic Silver Medalist with patented hexagonal Cybershape blade. Elite variation in heavy-underspin punch chops and deceptive backhand flips. Highly dangerous in close-table transitions.',
    headToHeadHistory: {
      'Hugo Calderano': { wins: 4, losses: 3, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 3, losses: 2, lastMeeting: '2026-08-02' },
      'Dang Qiu': { wins: 5, losses: 1, lastMeeting: '2026-06-20' }
    },
    recentMatchesLog: [
      { date: '2026-09-12', opponent: 'Hugo Calderano', result: 'W', score: '3-2 (11-9, 9-11, 11-7, 8-11, 12-10)', event: 'WTT Champions Semi-Final' },
      { date: '2026-09-08', opponent: 'Dang Qiu', result: 'W', score: '3-1 (11-6, 8-11, 11-8, 11-9)', event: 'European Top 16' },
      { date: '2026-09-01', opponent: 'Dimitrij Ovtcharov', result: 'W', score: '3-0 (11-7, 11-5, 11-8)', event: 'German Open' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tt-p-calderano',
    name: 'Hugo Calderano',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Brazil',
    leagueOrTournament: 'WTT Contender / Olympic Elite',
    primaryRole: 'Power Attacker (Shakehand Righty)',
    ratingOrQbr: 2182,
    rdOrVariance: 31,
    winLossSeason: { wins: 47, losses: 12 },
    winLossLast10: { wins: 9, losses: 1 },
    winStreak: '🔥 3W Streak',
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.05,
    tacticalMetrics: {
      label1: 'Serve Win %', val1: '63.2%',
      label2: 'Return Win %', val2: '53.1%',
      label3: '3rd-Ball Attack %', val3: '71.0%',
      label4: 'Deuce Win %', val4: '62.5%'
    },
    equipmentOrBio: 'Cornilleau Gatien Conquest • Target Pro GT-X51 Inverted on both sides',
    scoutingNotes: 'Tremendous baseline athleticism and premier backhand kill velocity on the global tour. High first-serve ace conversion and aggressive deep placement.',
    headToHeadHistory: {
      'Truls Möregårdh': { wins: 3, losses: 4, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 4, losses: 2, lastMeeting: '2026-05-19' }
    },
    recentMatchesLog: [
      { date: '2026-09-11', opponent: 'Felix Lebrun', result: 'W', score: '3-1 (11-9, 11-8, 9-11, 11-7)', event: 'WTT Contender Rio' },
      { date: '2026-09-05', opponent: 'M. Pylypchuk', result: 'W', score: '3-0 (11-4, 11-6, 11-5)', event: 'Super Series Prague' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tt-p-pylypchuk',
    name: 'M. Pylypchuk',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Ukraine',
    leagueOrTournament: 'Pandora / Setka Cup',
    primaryRole: 'Forehand Attacker (Shakehand Righty)',
    ratingOrQbr: 1684,
    rdOrVariance: 46,
    winLossSeason: { wins: 144, losses: 98 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 2W Streak',
    recentForm: ['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'],
    matchesToday: 3,
    fatigueIndex: 0.42,
    tacticalMetrics: {
      label1: 'Serve Win %', val1: '58.4%',
      label2: 'Return Win %', val2: '48.6%',
      label3: '3rd-Ball Attack %', val3: '62.1%',
      label4: 'Deuce Win %', val4: '53.0%'
    },
    equipmentOrBio: 'Butterfly Viscaria ALC • Tenergy 05 FH / Dignics 05 BH',
    scoutingNotes: 'High-volume Setka Cup regular with explosive forehand topspin. Shows minor fatigue in 4th and 5th sets when playing 3+ matches in the morning block.',
    recentMatchesLog: [
      { date: '2026-09-13', opponent: 'A. Tkachenko', result: 'W', score: '3-2 (11-9, 8-11, 11-7, 9-11, 11-8)', event: 'Setka Cup Morning Slate' },
      { date: '2026-09-13', opponent: 'V. Vakulenko', result: 'W', score: '3-1 (11-6, 11-8, 8-11, 11-5)', event: 'Setka Cup Morning Slate' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tt-p-tkachenko',
    name: 'A. Tkachenko',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Ukraine',
    leagueOrTournament: 'Pandora / Setka Cup',
    primaryRole: 'Southpaw Attacker (Left-Handed Hook)',
    ratingOrQbr: 1718,
    rdOrVariance: 42,
    winLossSeason: { wins: 158, losses: 89 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 3W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W'],
    matchesToday: 2,
    fatigueIndex: 0.25,
    tacticalMetrics: {
      label1: 'Serve Win %', val1: '60.8%',
      label2: 'Return Win %', val2: '51.4%',
      label3: '3rd-Ball Attack %', val3: '65.2%',
      label4: 'Deuce Win %', val4: '58.0%'
    },
    equipmentOrBio: 'Tibhar Samsonov Force Pro • Evolution MX-P FH / Evolution EL-P BH',
    scoutingNotes: 'Southpaw with sharp hook serve breaking into right-handed players. Exceptional win rate against standard inverted counter-hitters.',
    recentMatchesLog: [
      { date: '2026-09-13', opponent: 'O. Yeremenko', result: 'W', score: '3-0 (11-8, 11-5, 11-7)', event: 'Pandora Cup Day Slate' },
      { date: '2026-09-12', opponent: 'V. Vakulenko', result: 'W', score: '3-1 (11-7, 9-11, 11-6, 12-10)', event: 'Pandora Cup Day Slate' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  // MLB Star Players
  {
    id: 'mlb-p-skubal',
    name: 'Tarik Skubal',
    sport: 'MLB',
    teamOrCountry: 'Detroit Tigers',
    leagueOrTournament: 'American League / MLB',
    primaryRole: 'Starting Pitcher (LHP)',
    ratingOrQbr: 1890,
    rdOrVariance: 28,
    winLossSeason: { wins: 18, losses: 4 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 5W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'W', 'L', 'W', 'W', 'L', 'W'],
    matchesToday: 1,
    fatigueIndex: 0.10,
    tacticalMetrics: {
      label1: 'ERA / FIP', val1: '2.39 / 2.50',
      label2: 'K/9 Rate', val2: '10.7 K/9',
      label3: 'WHIP', val3: '0.92',
      label4: 'F5 Cover %', val4: '74.2%'
    },
    equipmentOrBio: '4-Seam Fastball (97.8 mph), Changeup (86.4 mph), Slider (89.1 mph)',
    scoutingNotes: 'Cy Young frontrunner. Dominant first-pitch strike rate (69.2%) generates deep count putouts. Exceptional run suppression in early 5 innings.',
    recentMatchesLog: [
      { date: '2026-09-08', opponent: 'Cleveland Guardians', result: 'W', score: '4-1 (7.0 IP, 11 K, 1 ER)', event: 'AL Central Series' },
      { date: '2026-09-02', opponent: 'Boston Red Sox', result: 'W', score: '5-2 (6.1 IP, 8 K, 2 ER)', event: 'Fenway Park Clash' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'mlb-p-judge',
    name: 'Aaron Judge',
    sport: 'MLB',
    teamOrCountry: 'New York Yankees',
    leagueOrTournament: 'American League / MLB',
    primaryRole: 'Center Fielder / Power Hitter',
    ratingOrQbr: 1940,
    rdOrVariance: 25,
    winLossSeason: { wins: 88, losses: 56 },
    winLossLast10: { wins: 7, losses: 3 },
    winStreak: '🔥 2W Streak',
    recentForm: ['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'],
    matchesToday: 1,
    fatigueIndex: 0.15,
    tacticalMetrics: {
      label1: 'OPS / wRC+', val1: '1.159 / 215',
      label2: 'Home Runs', val2: '53 HR',
      label3: 'Hard-Hit %', val3: '61.4%',
      label4: 'Barrel %', val4: '26.8%'
    },
    equipmentOrBio: 'Rawlings 35-inch Maple Bat • Exit velocity 96.2 mph avg',
    scoutingNotes: 'Elite barrel rate across all quadrant zones. Tremendous mathematical impact on Yankee Stadium short-porch wind projections.',
    recentMatchesLog: [
      { date: '2026-09-12', opponent: 'Boston Red Sox', result: 'W', score: '6-4 (2-for-3, 1 HR, 3 RBI)', event: 'AL East Rivalry' },
      { date: '2026-09-10', opponent: 'Kansas City Royals', result: 'W', score: '7-2 (1-for-2, 2 BB, 1 HR)', event: 'Yankee Stadium' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  // NFL Stars
  {
    id: 'nfl-p-mahomes',
    name: 'Patrick Mahomes',
    sport: 'NFL',
    teamOrCountry: 'Kansas City Chiefs',
    leagueOrTournament: 'AFC West / NFL',
    primaryRole: 'Quarterback (Right-Handed)',
    ratingOrQbr: 1965,
    rdOrVariance: 22,
    winLossSeason: { wins: 15, losses: 3 },
    winLossLast10: { wins: 9, losses: 1 },
    winStreak: '🔥 4W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.05,
    tacticalMetrics: {
      label1: 'EPA/Play', val1: '+0.264',
      label2: 'Passer Rating', val2: '104.8',
      label3: '3rd Down Conv %', val3: '52.1%',
      label4: 'Spread Cover %', val4: '64.8%'
    },
    equipmentOrBio: 'Vicis Zero2 Helmet • Oakley Prizm Visor • Andy Reid West Coast Hybrid',
    scoutingNotes: 'Unrivaled EPA per dropback against two-high shell coverages. High scramble conversion under blitz pressure (>72% success rate).',
    recentMatchesLog: [
      { date: '2026-09-08', opponent: 'Baltimore Ravens', result: 'W', score: '27-20 (291 YDS, 2 TD, 0 INT)', event: 'NFL Kickoff Primetime' },
      { date: '2026-02-11', opponent: 'San Francisco 49ers', result: 'W', score: '25-22 OT (333 YDS, 2 TD)', event: 'Super Bowl LVIII' }
    ],
    lastLiveUpdate: new Date().toISOString()
  }
];

/**
 * Perform a live background update tick on player records:
 * Randomly advances 1-2 players with a simulated circuit result so records stay dynamically updating!
 */
export function tickLivePlayerSimulation(): void {
  const activePlayers = crossSportPlayers.filter(p => p.sport === 'TABLE_TENNIS');
  if (activePlayers.length === 0) return;

  const target = activePlayers[Math.floor(Math.random() * activePlayers.length)];
  const isWin = Math.random() > 0.35; // 65% win probability for stars
  
  if (isWin) {
    target.winLossSeason.wins += 1;
    target.winLossLast10.wins = Math.min(10, target.winLossLast10.wins + 1);
    target.ratingOrQbr += Math.floor(2 + Math.random() * 5);
    target.recentForm.unshift('W');
    target.winStreak = `🔥 ${Math.min(9, parseInt(target.winStreak.replace(/\D/g, '') || '1') + 1)}W Streak`;
  } else {
    target.winLossSeason.losses += 1;
    target.winLossLast10.losses = Math.min(10, target.winLossLast10.losses + 1);
    target.ratingOrQbr -= Math.floor(2 + Math.random() * 4);
    target.recentForm.unshift('L');
    target.winStreak = '❄️ 1L Streak';
  }
  if (target.recentForm.length > 10) {
    target.recentForm.pop();
  }
  target.matchesToday += 1;
  target.fatigueIndex = +(Math.min(0.9, target.fatigueIndex + 0.08)).toFixed(2);
  target.lastLiveUpdate = new Date().toISOString();
}

export function getAllPlayers(sport?: string): MultiSportPlayerProfile[] {
  if (!sport || sport === 'ALL') {
    return crossSportPlayers;
  }
  return crossSportPlayers.filter(p => p.sport === sport);
}

export function lookupPlayerByName(name: string): MultiSportPlayerProfile | undefined {
  const clean = name.toLowerCase().trim();
  return crossSportPlayers.find(p => p.name.toLowerCase().includes(clean));
}

export function searchAllMatches(query: string = '', sport: string = 'ALL', status: string = 'ALL'): MatchSearchResult[] {
  const q = query.toLowerCase().trim();
  const results: MatchSearchResult[] = [];

  // 1. Table Tennis Matches
  tableTennisScheduledMatches.forEach(m => {
    const text = `${m.p1.name} ${m.p2.name} ${m.tournament} ${m.tableNumber}`.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesSport = sport === 'ALL' || sport === 'TABLE_TENNIS';
    const matchesStatus = status === 'ALL' || m.status === status;

    if (matchesQuery && matchesSport && matchesStatus) {
      results.push({
        id: m.id,
        sport: 'TABLE_TENNIS',
        tournamentOrLeague: m.tournament,
        matchupTitle: `${m.p1.name} vs ${m.p2.name}`,
        subTitle: `${m.p1.rating} Elo (${m.p1.rubberBackhand}) vs ${m.p2.rating} Elo (${m.p2.rubberBackhand})`,
        scheduledTime: m.scheduledTime,
        status: m.status,
        venueOrTable: m.tableNumber,
        marketDetails: {
          primaryLine: `O/U ${m.marketTotalPoints} Pts`,
          moneylineHomeOrP1: m.marketMoneylineP1,
          moneylineAwayOrP2: m.marketMoneylineP2,
          totalLine: m.marketTotalPoints
        },
        liveScoreSummary: m.liveScore ? `Set ${m.liveScore.currentSet}: ${m.liveScore.setsP1}-${m.liveScore.setsP2} (${m.liveScore.currentPointsP1}-${m.liveScore.currentPointsP2})` : undefined,
        rawTtMatchId: m.id
      });
    }
  });

  // 2. Mock Games (MLB, NFL, CFB)
  mockGames.forEach(g => {
    const text = `${g.homeTeam.name} ${g.homeTeam.code} ${g.awayTeam.name} ${g.awayTeam.code} ${g.venue} ${g.homeTeam.starterOrQb} ${g.awayTeam.starterOrQb}`.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesSport = sport === 'ALL' || sport === g.sport;
    const matchesStatus = status === 'ALL' || g.status === status;

    if (matchesQuery && matchesSport && matchesStatus) {
      results.push({
        id: g.id,
        sport: g.sport,
        tournamentOrLeague: g.sport === 'MLB' ? 'Major League Baseball' : g.sport === 'NFL' ? 'National Football League' : 'NCAA College Football',
        matchupTitle: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
        subTitle: `${g.awayTeam.starterOrQb} vs ${g.homeTeam.starterOrQb}`,
        scheduledTime: g.scheduledTime,
        status: g.status,
        venueOrTable: g.venue,
        marketDetails: {
          primaryLine: g.sport === 'MLB' ? `F5 ML / Total ${g.algorithmicFairTotal}` : `Spread ${g.odds.consensusSpread > 0 ? `+${g.odds.consensusSpread}` : g.odds.consensusSpread}`,
          moneylineHomeOrP1: g.odds.consensusMoneylineHome,
          moneylineAwayOrP2: g.odds.consensusMoneylineAway,
          totalLine: g.odds.consensusTotal
        },
        liveScoreSummary: g.liveTelemetry ? `${g.liveTelemetry.quarterOrInning}: ${g.liveTelemetry.awayScore}-${g.liveTelemetry.homeScore}` : undefined,
        rawGameId: g.id
      });
    }
  });

  return results;
}
