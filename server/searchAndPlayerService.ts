import { MatchSearchResult, SportType } from '../src/types';
import { mockGames } from './data/sportsStore';
import { tennisScheduledMatches, tennisPlayers } from './tennisEngine';

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
  // Tennis World Stars (FanDuel Active Markets)
  {
    id: 'tennis-p-sinner',
    name: 'Jannik Sinner',
    sport: 'TENNIS',
    teamOrCountry: 'Italy',
    leagueOrTournament: 'ATP Tour / Grand Slam Elite',
    primaryRole: 'Aggressive Baselines / Right-Handed (Two-Handed Backhand)',
    ratingOrQbr: 2280,
    rdOrVariance: 28,
    winLossSeason: { wins: 65, losses: 6 },
    winLossLast10: { wins: 9, losses: 1 },
    winStreak: '🔥 8W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'W', 'W', 'W', 'W', 'L', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.08,
    tacticalMetrics: {
      label1: '1st Serve In %', val1: '65.2%',
      label2: '1st Serve Won %', val2: '80.4%',
      label3: '2nd Serve Won %', val3: '58.2%',
      label4: 'Break Pts Saved %', val4: '74.5%'
    },
    equipmentOrBio: 'Head Speed MP • Luxilon ALU Power strings • Heavy topspin baseline aggression',
    scoutingNotes: 'World No. 1. Unrivaled groundstroke velocity from both wings. Exceptional return depth and high hold conversion on fast hardcourts.',
    headToHeadHistory: {
      'Carlos Alcaraz': { wins: 4, losses: 6, lastMeeting: '2026-06-07' },
      'Daniil Medvedev': { wins: 7, losses: 7, lastMeeting: '2026-09-04' },
      'Novak Djokovic': { wins: 4, losses: 4, lastMeeting: '2026-01-26' }
    },
    recentMatchesLog: [
      { date: '2026-09-08', opponent: 'Taylor Fritz', result: 'W', score: '6-3, 6-4, 7-5', event: 'US Open Final' },
      { date: '2026-09-06', opponent: 'Jack Draper', result: 'W', score: '7-5, 7-6, 6-2', event: 'US Open Semi-Final' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tennis-p-alcaraz',
    name: 'Carlos Alcaraz',
    sport: 'TENNIS',
    teamOrCountry: 'Spain',
    leagueOrTournament: 'ATP Tour / Grand Slam Elite',
    primaryRole: 'All-Court Phenom / Right-Handed (Two-Handed Backhand)',
    ratingOrQbr: 2260,
    rdOrVariance: 30,
    winLossSeason: { wins: 52, losses: 10 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 3W Streak',
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'L', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.12,
    tacticalMetrics: {
      label1: '1st Serve In %', val1: '64.0%',
      label2: '1st Serve Won %', val2: '76.8%',
      label3: 'Drop Shot Win %', val3: '72.0%',
      label4: 'Return Games Won %', val4: '33.5%'
    },
    equipmentOrBio: 'Babolat Pure Aero 98 • RPM Blast strings • Explosive court coverage',
    scoutingNotes: 'Multi-surface Grand Slam champion. Unmatched lateral acceleration and deceptive drop shots. Overpowers baseline opponents on clay and grass.',
    headToHeadHistory: {
      'Jannik Sinner': { wins: 6, losses: 4, lastMeeting: '2026-06-07' },
      'Novak Djokovic': { wins: 3, losses: 4, lastMeeting: '2026-08-04' }
    },
    recentMatchesLog: [
      { date: '2026-09-14', opponent: 'Alexander Zverev', result: 'W', score: '6-4, 6-3', event: 'Laver Cup' },
      { date: '2026-09-12', opponent: 'Taylor Fritz', result: 'W', score: '6-2, 7-5', event: 'Laver Cup' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tennis-p-djokovic',
    name: 'Novak Djokovic',
    sport: 'TENNIS',
    teamOrCountry: 'Serbia',
    leagueOrTournament: 'ATP Tour / Grand Slam Elite',
    primaryRole: 'All-Court Master / Right-Handed (Two-Handed Backhand)',
    ratingOrQbr: 2270,
    rdOrVariance: 29,
    winLossSeason: { wins: 38, losses: 8 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 2W Streak',
    recentForm: ['W', 'W', 'L', 'W', 'W', 'W', 'W', 'W', 'W', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.15,
    tacticalMetrics: {
      label1: 'Return Points Won %', val1: '43.2%',
      label2: 'Tiebreak Win %', val2: '74.8%',
      label3: '2nd Serve Won %', val3: '57.4%',
      label4: 'Break Pt Conv %', val4: '48.9%'
    },
    equipmentOrBio: 'Head Speed Pro • Luxilon 4G strings • 24 Grand Slam Titles',
    scoutingNotes: 'Greatest return of serve in tennis history. Unmatched clutch performance in 5th-set deciders and deuce break point conversions.',
    headToHeadHistory: {
      'Jannik Sinner': { wins: 4, losses: 4, lastMeeting: '2026-01-26' },
      'Carlos Alcaraz': { wins: 4, losses: 3, lastMeeting: '2026-08-04' }
    },
    recentMatchesLog: [
      { date: '2026-09-14', opponent: 'Taylor Fritz', result: 'W', score: '6-4, 7-6', event: 'Shanghai Masters' },
      { date: '2026-09-10', opponent: 'Alex de Minaur', result: 'W', score: '6-2, 6-1', event: 'Davis Cup' }
    ],
    lastLiveUpdate: new Date().toISOString()
  },
  {
    id: 'tennis-p-medvedev',
    name: 'Daniil Medvedev',
    sport: 'TENNIS',
    teamOrCountry: 'Neutral / ATP',
    leagueOrTournament: 'ATP Tour / Grand Slam Elite',
    primaryRole: 'Deep Baseline Counterpuncher / Right-Handed',
    ratingOrQbr: 2210,
    rdOrVariance: 32,
    winLossSeason: { wins: 46, losses: 16 },
    winLossLast10: { wins: 7, losses: 3 },
    winStreak: '🔥 1W Streak',
    recentForm: ['W', 'L', 'W', 'W', 'W', 'L', 'W', 'W', 'L', 'W'],
    matchesToday: 0,
    fatigueIndex: 0.10,
    tacticalMetrics: {
      label1: 'Deep Return Pos %', val1: '88.5%',
      label2: '1st Serve Unreturned %', val2: '38.2%',
      label3: 'Long Rally Win %', val3: '62.4%',
      label4: 'Hold Game %', val4: '84.0%'
    },
    equipmentOrBio: 'Tecnifibre TFight 305 • Razor Code White strings • Deep return position',
    scoutingNotes: 'Hardcourt specialist with ultra-flat groundstrokes and deep court return positioning. High win rates against attacking serve-and-volley players.',
    headToHeadHistory: {
      'Jannik Sinner': { wins: 7, losses: 7, lastMeeting: '2026-09-04' },
      'Alexander Zverev': { wins: 12, losses: 7, lastMeeting: '2026-01-26' }
    },
    recentMatchesLog: [
      { date: '2026-09-12', opponent: 'Matteo Berrettini', result: 'W', score: '7-5, 6-4', event: 'ATP 500 Vienna' },
      { date: '2026-09-04', opponent: 'Jannik Sinner', result: 'L', score: '2-6, 6-1, 1-6, 4-6', event: 'US Open Quarter-Final' }
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
  const activePlayers = crossSportPlayers.filter(p => p.sport === 'TENNIS');
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

  // 1. Tennis Matches (SOTA Markov Chain Engine)
  tennisScheduledMatches.forEach(m => {
    const text = `${m.p1.name} ${m.p2.name} ${m.tournament} ${m.courtName} ${m.surface}`.toLowerCase();
    const matchesQuery = !q || text.includes(q);
    const matchesSport = sport === 'ALL' || sport === 'TENNIS';
    const matchesStatus = status === 'ALL' || m.status === status;

    if (matchesQuery && matchesSport && matchesStatus) {
      results.push({
        id: m.id,
        sport: 'TENNIS',
        tournamentOrLeague: m.tournament,
        matchupTitle: `${m.p1.name} vs ${m.p2.name}`,
        subTitle: `${m.surface} Court • CPI ${m.courtPaceIndex} • Best of ${m.bestOfSets}`,
        scheduledTime: m.scheduledTime,
        status: m.status,
        venueOrTable: m.courtName,
        marketDetails: {
          primaryLine: `Total ${m.marketFanDuel.totalGames} Games (O ${m.marketFanDuel.totalGamesOverOdds})`,
          moneylineHomeOrP1: m.marketFanDuel.moneylineP1,
          moneylineAwayOrP2: m.marketFanDuel.moneylineP2,
          totalLine: m.marketFanDuel.totalGames
        },
        liveScoreSummary: m.liveScore ? `Set ${m.liveScore.currentSet}: ${m.liveScore.gamesP1}-${m.liveScore.gamesP2} (${m.liveScore.pointsP1}-${m.liveScore.pointsP2})` : undefined,
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
