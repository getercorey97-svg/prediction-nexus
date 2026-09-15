import { SportType, TableTennisPlayer } from '../types';

export const FALLBACK_TT_PLAYERS: TableTennisPlayer[] = [
  {
    id: 'tt-p-moregard',
    name: 'Truls Möregårdh',
    country: 'Sweden',
    league: 'WTT Contender / Olympic Elite',
    rating: 2150,
    rd: 34,
    volatility: 0.058,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 44, losses: 14 },
    winLossLast10: { wins: 9, losses: 1 },
    matchesToday: 1,
    fatigueIndex: 0.12,
    serveWinRate: 0.625,
    returnWinRate: 0.518,
    thirdBallAttackRate: 0.684,
    deuceWinRate: 0.592,
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'],
    commentaryNotes: 'Olympic Silver Medalist with patented hexagonal Cybershape blade. Elite variation in heavy-underspin punch chops and deceptive backhand flips.',
    headToHeadHistory: {
      'Hugo Calderano': { wins: 4, losses: 3, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 3, losses: 2, lastMeeting: '2026-08-02' }
    }
  },
  {
    id: 'tt-p-calderano',
    name: 'Hugo Calderano',
    country: 'Brazil',
    league: 'WTT Contender / Olympic Elite',
    rating: 2180,
    rd: 32,
    volatility: 0.055,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 47, losses: 12 },
    winLossLast10: { wins: 9, losses: 1 },
    matchesToday: 0,
    fatigueIndex: 0.05,
    serveWinRate: 0.632,
    returnWinRate: 0.531,
    thirdBallAttackRate: 0.710,
    deuceWinRate: 0.625,
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W', 'W'],
    commentaryNotes: 'Tremendous baseline athleticism and premier backhand kill velocity on the global tour. High first-serve ace conversion.',
    headToHeadHistory: {
      'Truls Möregårdh': { wins: 3, losses: 4, lastMeeting: '2026-07-14' }
    }
  },
  {
    id: 'tt-p-pylypchuk',
    name: 'M. Pylypchuk',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1690,
    rd: 48,
    volatility: 0.061,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 142, losses: 95 },
    winLossLast10: { wins: 8, losses: 2 },
    matchesToday: 2,
    fatigueIndex: 0.28,
    serveWinRate: 0.584,
    returnWinRate: 0.486,
    thirdBallAttackRate: 0.621,
    deuceWinRate: 0.530,
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W'],
    commentaryNotes: 'High-volume Setka Cup regular with explosive forehand topspin. Shows slight fatigue in 4th/5th sets after 3+ matches in the morning block.',
    headToHeadHistory: {
      'A. Tkachenko': { wins: 6, losses: 8, lastMeeting: '2026-09-13' }
    }
  },
  {
    id: 'tt-p-tkachenko',
    name: 'A. Tkachenko',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1718,
    rd: 44,
    volatility: 0.059,
    handedness: 'Left',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 156, losses: 88 },
    winLossLast10: { wins: 7, losses: 3 },
    matchesToday: 1,
    fatigueIndex: 0.15,
    serveWinRate: 0.608,
    returnWinRate: 0.514,
    thirdBallAttackRate: 0.652,
    deuceWinRate: 0.580,
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W'],
    commentaryNotes: 'Southpaw with sharp hook serve breaking into right-handed players. Exceptional win rate against standard inverted counter-hitters.',
    headToHeadHistory: {
      'M. Pylypchuk': { wins: 8, losses: 6, lastMeeting: '2026-09-13' }
    }
  }
];

export interface FallbackPlayerProfile {
  id: string;
  name: string;
  sport: SportType;
  teamOrCountry: string;
  leagueOrTournament: string;
  primaryRole: string;
  ratingOrQbr: number;
  rdOrVariance: number;
  winLossSeason: { wins: number; losses: number };
  winLossLast10: { wins: number; losses: number };
  winStreak: string;
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

export const FALLBACK_PLAYERS: FallbackPlayerProfile[] = [
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
    scoutingNotes: 'Olympic Silver Medalist with patented hexagonal Cybershape blade. Elite variation in heavy-underspin punch chops and deceptive backhand flips.',
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
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
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
    scoutingNotes: 'Tremendous baseline athleticism and premier backhand kill velocity on the global tour. High first-serve ace conversion.',
    headToHeadHistory: {
      'Truls Möregårdh': { wins: 3, losses: 4, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 4, losses: 2, lastMeeting: '2026-05-19' }
    },
    recentMatchesLog: [
      { date: '2026-09-11', opponent: 'Felix Lebrun', result: 'W', score: '3-1 (11-9, 11-8, 9-11, 11-7)', event: 'WTT Contender Rio' },
      { date: '2026-09-05', opponent: 'M. Pylypchuk', result: 'W', score: '3-0 (11-4, 11-6, 11-5)', event: 'Super Series Prague' }
    ],
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
  },
  {
    id: 'tt-p-pylypchuk',
    name: 'M. Pylypchuk',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Ukraine',
    leagueOrTournament: 'Pandora / Setka Cup',
    primaryRole: 'Forehand Attacker (Shakehand Righty)',
    ratingOrQbr: 1690,
    rdOrVariance: 48,
    winLossSeason: { wins: 142, losses: 95 },
    winLossLast10: { wins: 8, losses: 2 },
    winStreak: '🔥 4W Streak',
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W'],
    matchesToday: 2,
    fatigueIndex: 0.28,
    tacticalMetrics: {
      label1: 'Serve Win %', val1: '58.4%',
      label2: 'Return Win %', val2: '48.6%',
      label3: '3rd-Ball Attack %', val3: '62.1%',
      label4: 'Deuce Win %', val4: '53.0%'
    },
    equipmentOrBio: 'Butterfly Viscaria ALC • Tenergy 05 FH / Dignics 05 BH',
    scoutingNotes: 'High-volume Setka Cup regular with explosive forehand topspin. Shows slight fatigue in 4th/5th sets after 3+ matches in the morning block.',
    recentMatchesLog: [
      { date: '2026-09-13', opponent: 'A. Tkachenko', result: 'W', score: '3-2 (11-9, 8-11, 11-7, 9-11, 11-8)', event: 'Setka Cup Morning Slate' },
      { date: '2026-09-13', opponent: 'V. Vakulenko', result: 'W', score: '3-1 (11-6, 11-8, 8-11, 11-5)', event: 'Setka Cup Morning Slate' }
    ],
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
  },
  {
    id: 'tt-p-tkachenko',
    name: 'A. Tkachenko',
    sport: 'TABLE_TENNIS',
    teamOrCountry: 'Ukraine',
    leagueOrTournament: 'Pandora / Setka Cup',
    primaryRole: 'Southpaw Attacker (Left-Handed Hook)',
    ratingOrQbr: 1718,
    rdOrVariance: 44,
    winLossSeason: { wins: 156, losses: 88 },
    winLossLast10: { wins: 7, losses: 3 },
    winStreak: '🔥 3W Streak',
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W'],
    matchesToday: 1,
    fatigueIndex: 0.15,
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
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
  },
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
    fatigueIndex: 0.1,
    tacticalMetrics: {
      label1: 'ERA / FIP', val1: '2.39 / 2.50',
      label2: 'K/9 Rate', val2: '10.7 K/9',
      label3: 'WHIP', val3: '0.92',
      label4: 'F5 Cover %', val4: '74.2%'
    },
    equipmentOrBio: '4-Seam Fastball (97.8 mph), Changeup (86.4 mph), Slider (89.1 mph)',
    scoutingNotes: 'Cy Young frontrunner. Dominant first-pitch strike rate (69.2%) generates deep count putouts.',
    recentMatchesLog: [
      { date: '2026-09-08', opponent: 'Cleveland Guardians', result: 'W', score: '4-1 (7.0 IP, 11 K, 1 ER)', event: 'AL Central Series' },
      { date: '2026-09-02', opponent: 'Boston Red Sox', result: 'W', score: '5-2 (6.1 IP, 8 K, 2 ER)', event: 'Fenway Park Clash' }
    ],
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
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
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
  },
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
    scoutingNotes: 'Unrivaled EPA per dropback against two-high shell coverages. High scramble conversion under blitz pressure.',
    recentMatchesLog: [
      { date: '2026-09-08', opponent: 'Baltimore Ravens', result: 'W', score: '27-20 (291 YDS, 2 TD, 0 INT)', event: 'NFL Kickoff Primetime' },
      { date: '2026-02-11', opponent: 'San Francisco 49ers', result: 'W', score: '25-22 OT (333 YDS, 2 TD)', event: 'Super Bowl LVIII' }
    ],
    lastLiveUpdate: '2026-09-14T02:30:00.000Z'
  }
];
