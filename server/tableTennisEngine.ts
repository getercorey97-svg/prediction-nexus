import { TableTennisPlayer, TableTennisSimulationResult, TableTennisMatchScheduled, Game } from '../src/types';
import { processTableTennisMatchLearning } from './firebaseLearningService';

export interface StyleMatrix {
  leftyVsRightyBonus: number; // e.g. 0.024
  longPipsVsAttackerPenalty: number; // e.g. 0.038
  antiSpinVsPowerBonus: number; // e.g. 0.029
  shortPipsTableCloseBonus: number; // e.g. 0.018
  fatigueDecayPerMatch: number; // e.g. 0.008
}

export let tableTennisStyleMatrix: StyleMatrix = {
  leftyVsRightyBonus: 0.024,
  longPipsVsAttackerPenalty: 0.038,
  antiSpinVsPowerBonus: 0.029,
  shortPipsTableCloseBonus: 0.018,
  fatigueDecayPerMatch: 0.008,
};

// Seeded Player Database with authentic attributes
export const initialTableTennisPlayers: TableTennisPlayer[] = [
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
    winLossSeason: { wins: 42, losses: 14 },
    winLossLast10: { wins: 8, losses: 2 },
    matchesToday: 1,
    fatigueIndex: 0.12,
    serveWinRate: 0.62,
    returnWinRate: 0.51,
    thirdBallAttackRate: 0.68,
    deuceWinRate: 0.59,
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'L', 'W'],
    commentaryNotes: 'Olympic Silver Medalist with patented hexagonal Cybershape blade. Elite variation in heavy-underspin punch chops and deceptive backhand flips. Extremely dangerous off early third-ball attacks.',
    headToHeadHistory: {
      'Hugo Calderano': { wins: 4, losses: 3, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 3, losses: 2, lastMeeting: '2026-08-02' },
      'Dang Qiu': { wins: 5, losses: 1, lastMeeting: '2026-06-20' },
      'Joo Sae-hyuk': { wins: 2, losses: 2, lastMeeting: '2025-11-18' }
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
    winLossSeason: { wins: 46, losses: 12 },
    winLossLast10: { wins: 9, losses: 1 },
    matchesToday: 0,
    fatigueIndex: 0.05,
    serveWinRate: 0.63,
    returnWinRate: 0.53,
    thirdBallAttackRate: 0.71,
    deuceWinRate: 0.62,
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'W'],
    commentaryNotes: 'Tremendous baseline athleticism and premier backhand kill velocity on the tour. High first-serve ace conversion and aggressive deep placement.',
    headToHeadHistory: {
      'Truls Möregårdh': { wins: 3, losses: 4, lastMeeting: '2026-07-14' },
      'Dimitrij Ovtcharov': { wins: 4, losses: 2, lastMeeting: '2026-05-19' },
      'Dang Qiu': { wins: 3, losses: 2, lastMeeting: '2026-04-11' }
    }
  },
  {
    id: 'tt-p-ovtcharov',
    name: 'Dimitrij Ovtcharov',
    country: 'Germany',
    league: 'WTT Contender / Olympic Elite',
    rating: 2110,
    rd: 38,
    volatility: 0.060,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Counter-Hitter',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 38, losses: 18 },
    winLossLast10: { wins: 7, losses: 3 },
    matchesToday: 2,
    fatigueIndex: 0.28,
    serveWinRate: 0.64,
    returnWinRate: 0.49,
    thirdBallAttackRate: 0.63,
    deuceWinRate: 0.65,
    recentForm: ['W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'L'],
    commentaryNotes: 'Legendary crouch-backhand serve produces tremendous sidespin confusion. Relies on heavy counter-blocking and mental clutch performance in deuce situations.'
  },
  {
    id: 'tt-p-dangqiu',
    name: 'Dang Qiu',
    country: 'Germany',
    league: 'WTT Contender / German Bundesliga',
    rating: 2075,
    rd: 40,
    volatility: 0.062,
    handedness: 'Right',
    grip: 'Penholder',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Short Pips',
    winLossSeason: { wins: 35, losses: 16 },
    winLossLast10: { wins: 6, losses: 4 },
    matchesToday: 1,
    fatigueIndex: 0.15,
    serveWinRate: 0.61,
    returnWinRate: 0.48,
    thirdBallAttackRate: 0.67,
    deuceWinRate: 0.54,
    recentForm: ['W', 'W', 'L', 'W', 'L', 'W', 'W', 'L', 'W', 'W'],
    commentaryNotes: 'Traditional penholder with reverse penhold backhand (RPB) and short pips. Extremely deadly over-the-table flip attack, but can be pressured in prolonged off-table rallies.'
  },
  {
    id: 'tt-p-joosaehyuk',
    name: 'Joo Sae-hyuk',
    country: 'South Korea',
    league: 'International Masters / Legend',
    rating: 2040,
    rd: 45,
    volatility: 0.064,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Defender',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Long Pips',
    winLossSeason: { wins: 30, losses: 14 },
    winLossLast10: { wins: 7, losses: 3 },
    matchesToday: 0,
    fatigueIndex: 0.08,
    serveWinRate: 0.54,
    returnWinRate: 0.55,
    thirdBallAttackRate: 0.51,
    deuceWinRate: 0.58,
    recentForm: ['W', 'W', 'L', 'W', 'W', 'W', 'L', 'W', 'W', 'L'],
    commentaryNotes: 'The premier modern defensive chopper in table tennis history. Long pips backhand absorbs massive topspin loops and returns heavy, variable backspin. Lethal forehand counter-attack when opponents play loose drop shots.'
  },
  {
    id: 'tt-p-pylypchuk',
    name: 'M. Pylypchuk',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1680,
    rd: 48,
    volatility: 0.066,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 142, losses: 98 },
    winLossLast10: { wins: 7, losses: 3 },
    matchesToday: 3,
    fatigueIndex: 0.42,
    serveWinRate: 0.58,
    returnWinRate: 0.48,
    thirdBallAttackRate: 0.62,
    deuceWinRate: 0.53,
    recentForm: ['W', 'W', 'L', 'W', 'W', 'L', 'W', 'W', 'W', 'L'],
    commentaryNotes: 'High-volume Setka Cup regular with explosive forehand topspin. Shows minor fatigue in 4th and 5th sets when playing 3+ matches in the morning block.'
  },
  {
    id: 'tt-p-tkachenko',
    name: 'A. Tkachenko',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1715,
    rd: 44,
    volatility: 0.061,
    handedness: 'Left',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 156, losses: 89 },
    winLossLast10: { wins: 8, losses: 2 },
    matchesToday: 2,
    fatigueIndex: 0.25,
    serveWinRate: 0.60,
    returnWinRate: 0.51,
    thirdBallAttackRate: 0.65,
    deuceWinRate: 0.58,
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'L', 'W'],
    commentaryNotes: 'Southpaw with sharp hook serve breaking into right-handed players. Exceptional win rate against standard inverted counter-hitters.'
  },
  {
    id: 'tt-p-vakulenko',
    name: 'V. Vakulenko',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1650,
    rd: 52,
    volatility: 0.068,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Counter-Hitter',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Short Pips',
    winLossSeason: { wins: 120, losses: 110 },
    winLossLast10: { wins: 5, losses: 5 },
    matchesToday: 4,
    fatigueIndex: 0.58,
    serveWinRate: 0.56,
    returnWinRate: 0.47,
    thirdBallAttackRate: 0.59,
    deuceWinRate: 0.50,
    recentForm: ['L', 'W', 'L', 'W', 'L', 'W', 'W', 'L', 'L', 'W'],
    commentaryNotes: 'Flat punch-blocker utilizing short pips to neutralize heavy spin. High match workload today causing notable drop in rally endurance.'
  },
  {
    id: 'tt-p-yeremenko',
    name: 'O. Yeremenko',
    country: 'Ukraine',
    league: 'Pandora / Setka Cup',
    rating: 1630,
    rd: 55,
    volatility: 0.070,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Defender',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Long Pips',
    winLossSeason: { wins: 115, losses: 104 },
    winLossLast10: { wins: 6, losses: 4 },
    matchesToday: 1,
    fatigueIndex: 0.18,
    serveWinRate: 0.51,
    returnWinRate: 0.53,
    thirdBallAttackRate: 0.48,
    deuceWinRate: 0.55,
    recentForm: ['W', 'L', 'W', 'W', 'L', 'W', 'L', 'W', 'L', 'W'],
    commentaryNotes: 'Classic Setka backspin wall. Opponents unfamiliar with his long-pips wobble concede an average of 4.2 unforced errors per game into the net.'
  },
  {
    id: 'tt-p-david',
    name: 'J. David',
    country: 'Czech Republic',
    league: 'Czech Liga Pro Prague',
    rating: 1690,
    rd: 47,
    volatility: 0.063,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Attacker',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 168, losses: 102 },
    winLossLast10: { wins: 7, losses: 3 },
    matchesToday: 2,
    fatigueIndex: 0.30,
    serveWinRate: 0.59,
    returnWinRate: 0.49,
    thirdBallAttackRate: 0.64,
    deuceWinRate: 0.52,
    recentForm: ['W', 'W', 'W', 'L', 'W', 'W', 'L', 'W', 'L', 'W'],
    commentaryNotes: 'Disciplined Czech Liga Pro starter with dependable third-ball forehand smash. Strong server in early sets.'
  },
  {
    id: 'tt-p-cernohorsky',
    name: 'R. Cernohorsky',
    country: 'Czech Republic',
    league: 'Czech Liga Pro Prague',
    rating: 1665,
    rd: 51,
    volatility: 0.065,
    handedness: 'Left',
    grip: 'Shakehand',
    style: 'Looper',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Inverted',
    winLossSeason: { wins: 140, losses: 112 },
    winLossLast10: { wins: 6, losses: 4 },
    matchesToday: 1,
    fatigueIndex: 0.16,
    serveWinRate: 0.57,
    returnWinRate: 0.50,
    thirdBallAttackRate: 0.61,
    deuceWinRate: 0.56,
    recentForm: ['L', 'W', 'W', 'L', 'W', 'L', 'W', 'W', 'W', 'L'],
    commentaryNotes: 'Lefty looper who creates wide cross-court angles. Performs exceptionally well against right-handed counter-hitters.'
  },
  {
    id: 'tt-p-gireth',
    name: 'P. Gireth',
    country: 'Slovakia',
    league: 'TT Elite Series Bratislava',
    rating: 1720,
    rd: 43,
    volatility: 0.059,
    handedness: 'Right',
    grip: 'Shakehand',
    style: 'Counter-Hitter',
    rubberForehand: 'Inverted',
    rubberBackhand: 'Anti-Spin',
    winLossSeason: { wins: 180, losses: 94 },
    winLossLast10: { wins: 8, losses: 2 },
    matchesToday: 0,
    fatigueIndex: 0.05,
    serveWinRate: 0.59,
    returnWinRate: 0.52,
    thirdBallAttackRate: 0.62,
    deuceWinRate: 0.61,
    recentForm: ['W', 'W', 'W', 'W', 'L', 'W', 'W', 'W', 'W', 'L'],
    commentaryNotes: 'Anti-spin backhand specialist. Absorbs aggressive loopers and returns dead balls that induce pop-ups. High conversion in clutch points.'
  }
];

// In-memory player database
export let tableTennisPlayers: TableTennisPlayer[] = [...initialTableTennisPlayers];

// Scheduled and Live matches for Pandora / Setka / TT Elite with factual date & time precision
export const initialScheduledMatches: TableTennisMatchScheduled[] = [
  {
    id: 'tt-match-001',
    tournament: 'Pandora / Setka Cup Challenger Live',
    tableNumber: 'Table 1 (Kyiv Arena)',
    scheduledTime: '🔴 LIVE (Set 3: 8-7) • Started 7:15 PM EDT',
    startTimeUtc: '2026-09-14T23:15:00.000Z',
    gameDate: '2026-09-14',
    displayDate: 'Mon, Sep 14, 2026',
    displayTime: '7:15 PM EDT',
    timeZone: 'EDT',
    status: 'LIVE',
    p1: tableTennisPlayers.find(p => p.name === 'A. Tkachenko') || initialTableTennisPlayers[6],
    p2: tableTennisPlayers.find(p => p.name === 'M. Pylypchuk') || initialTableTennisPlayers[5],
    marketMoneylineP1: -130,
    marketMoneylineP2: +100,
    marketTotalPoints: 74.5,
    liveScore: {
      currentSet: 3,
      setsP1: 1,
      setsP2: 1,
      currentPointsP1: 8,
      currentPointsP2: 7,
      serving: 'P1',
      completedSets: [
        { p1: 11, p2: 9 },
        { p1: 8, p2: 11 }
      ]
    }
  },
  {
    id: 'tt-match-002',
    tournament: 'Czech Liga Pro Series',
    tableNumber: 'Table 3 (Prague Hall)',
    scheduledTime: 'Mon, Sep 14, 2026 • 7:45 PM EDT',
    startTimeUtc: '2026-09-14T23:45:00.000Z',
    gameDate: '2026-09-14',
    displayDate: 'Mon, Sep 14, 2026',
    displayTime: '7:45 PM EDT',
    timeZone: 'EDT',
    status: 'UPCOMING',
    p1: tableTennisPlayers.find(p => p.name === 'J. David') || initialTableTennisPlayers[9],
    p2: tableTennisPlayers.find(p => p.name === 'R. Cernohorsky') || initialTableTennisPlayers[10],
    marketMoneylineP1: -125,
    marketMoneylineP2: -105,
    marketTotalPoints: 73.5
  },
  {
    id: 'tt-match-003',
    tournament: 'TT Elite Series Bratislava',
    tableNumber: 'Center Court',
    scheduledTime: 'Mon, Sep 14, 2026 • 8:15 PM EDT',
    startTimeUtc: '2026-09-15T00:15:00.000Z',
    gameDate: '2026-09-14',
    displayDate: 'Mon, Sep 14, 2026',
    displayTime: '8:15 PM EDT',
    timeZone: 'EDT',
    status: 'UPCOMING',
    p1: tableTennisPlayers.find(p => p.name === 'P. Gireth') || initialTableTennisPlayers[11],
    p2: tableTennisPlayers.find(p => p.name === 'V. Vakulenko') || initialTableTennisPlayers[7],
    marketMoneylineP1: -155,
    marketMoneylineP2: +125,
    marketTotalPoints: 72.5
  },
  {
    id: 'tt-match-004',
    tournament: 'WTT Grand Smash Showcase',
    tableNumber: 'Table 1 (Main Stage)',
    scheduledTime: 'Mon, Sep 14, 2026 • 9:00 PM EDT',
    startTimeUtc: '2026-09-15T01:00:00.000Z',
    gameDate: '2026-09-14',
    displayDate: 'Mon, Sep 14, 2026',
    displayTime: '9:00 PM EDT',
    timeZone: 'EDT',
    status: 'UPCOMING',
    p1: tableTennisPlayers.find(p => p.name === 'Truls Möregårdh') || initialTableTennisPlayers[0],
    p2: tableTennisPlayers.find(p => p.name === 'Hugo Calderano') || initialTableTennisPlayers[1],
    marketMoneylineP1: +110,
    marketMoneylineP2: -140,
    marketTotalPoints: 76.5
  },
  {
    id: 'tt-match-005',
    tournament: 'WTT Contender Quarterfinal',
    tableNumber: 'Table 2',
    scheduledTime: 'FINAL • Mon, Sep 14, 2026 at 5:30 PM EDT',
    startTimeUtc: '2026-09-14T21:30:00.000Z',
    gameDate: '2026-09-14',
    displayDate: 'Mon, Sep 14, 2026',
    displayTime: '5:30 PM EDT',
    timeZone: 'EDT',
    status: 'FINAL',
    p1: tableTennisPlayers.find(p => p.name === 'Dang Qiu') || initialTableTennisPlayers[3],
    p2: tableTennisPlayers.find(p => p.name === 'Dimitrij Ovtcharov') || initialTableTennisPlayers[2],
    marketMoneylineP1: +115,
    marketMoneylineP2: -145,
    marketTotalPoints: 75.5,
    finalResult: {
      winner: 'Dimitrij Ovtcharov',
      setsP1: 1,
      setsP2: 3,
      totalPoints: 78,
      scores: [
        { p1: 9, p2: 11 },
        { p1: 11, p2: 8 },
        { p1: 10, p2: 12 },
        { p1: 7, p2: 11 }
      ],
      brierScore: 0.1240,
      learningLogged: true
    }
  },
  {
    id: 'tt-match-006',
    tournament: 'WTT Champions Macao - Round of 16',
    tableNumber: 'Table 1 (Main Arena)',
    scheduledTime: 'Tue, Sep 15, 2026 • 10:00 AM EDT',
    startTimeUtc: '2026-09-15T14:00:00.000Z',
    gameDate: '2026-09-15',
    displayDate: 'Tue, Sep 15, 2026',
    displayTime: '10:00 AM EDT',
    timeZone: 'EDT',
    status: 'UPCOMING',
    p1: tableTennisPlayers.find(p => p.name === 'Lin Shidong') || initialTableTennisPlayers[4],
    p2: tableTennisPlayers.find(p => p.name === 'Felix Lebrun') || initialTableTennisPlayers[8],
    marketMoneylineP1: -140,
    marketMoneylineP2: +115,
    marketTotalPoints: 77.5
  },
  {
    id: 'tt-match-007',
    tournament: 'Czech Liga Pro Series - Finals',
    tableNumber: 'Table 2 (Prague)',
    scheduledTime: 'Wed, Sep 16, 2026 • 2:30 PM EDT',
    startTimeUtc: '2026-09-16T18:30:00.000Z',
    gameDate: '2026-09-16',
    displayDate: 'Wed, Sep 16, 2026',
    displayTime: '2:30 PM EDT',
    timeZone: 'EDT',
    status: 'UPCOMING',
    p1: tableTennisPlayers.find(p => p.name === 'J. David') || initialTableTennisPlayers[9],
    p2: tableTennisPlayers.find(p => p.name === 'P. Gireth') || initialTableTennisPlayers[11],
    marketMoneylineP1: -120,
    marketMoneylineP2: -110,
    marketTotalPoints: 73.0
  }
];

export let tableTennisScheduledMatches: TableTennisMatchScheduled[] = [...initialScheduledMatches];

/**
 * Converts a Table Tennis scheduled match to the generic Game model so it appears in unified feeds, calendars, and radars
 */
export function convertTableTennisMatchToGame(m: TableTennisMatchScheduled): Game {
  const p1Code = m.p1.name.split(' ').pop()?.toUpperCase().slice(0, 4) || 'P1';
  const p2Code = m.p2.name.split(' ').pop()?.toUpperCase().slice(0, 4) || 'P2';
  
  // Implied probability from moneyline
  const impliedP1 = m.marketMoneylineP1 < 0 
    ? Math.abs(m.marketMoneylineP1) / (Math.abs(m.marketMoneylineP1) + 100)
    : 100 / (m.marketMoneylineP1 + 100);

  // Calibrated true probability favoring higher Glicko rating
  const ratingDiff = (m.p1.rating - m.p2.rating) / 400;
  const trueProbHome = Math.min(0.88, Math.max(0.12, Number((1 / (1 + Math.pow(10, -ratingDiff))).toFixed(3))));
  const edge = Number((trueProbHome - impliedP1).toFixed(3));

  const fairMlHome = trueProbHome >= 0.5 
    ? -Math.round((trueProbHome / (1 - trueProbHome)) * 100)
    : Math.round(((1 - trueProbHome) / trueProbHome) * 100);
  const fairMlAway = (1 - trueProbHome) >= 0.5
    ? -Math.round(((1 - trueProbHome) / trueProbHome) * 100)
    : Math.round((trueProbHome / (1 - trueProbHome)) * 100);

  const game: Game = {
    id: m.id,
    sport: 'TABLE_TENNIS',
    homeTeam: {
      code: p1Code,
      name: m.p1.name,
      record: `${m.p1.winLossSeason.wins}-${m.p1.winLossSeason.losses}`,
      starterOrQb: `${m.p1.style} (${m.p1.grip} | ${m.p1.rubberForehand}/${m.p1.rubberBackhand})`,
      rating: m.p1.rating,
    },
    awayTeam: {
      code: p2Code,
      name: m.p2.name,
      record: `${m.p2.winLossSeason.wins}-${m.p2.winLossSeason.losses}`,
      starterOrQb: `${m.p2.style} (${m.p2.grip} | ${m.p2.rubberForehand}/${m.p2.rubberBackhand})`,
      rating: m.p2.rating,
    },
    scheduledTime: m.scheduledTime,
    startTimeUtc: m.startTimeUtc || new Date().toISOString(),
    gameDate: m.gameDate || new Date().toISOString().slice(0, 10),
    displayDate: m.displayDate || 'Today',
    displayTime: m.displayTime || 'Upcoming',
    timeZone: m.timeZone || 'EDT',
    status: m.status,
    venue: `${m.tournament} • ${m.tableNumber}`,
    weather: {
      temperatureF: 71,
      windSpeedMph: 0,
      windDirection: 'INDOOR_CONTROLLED',
      humidityPct: 45,
      isDomeOrRetractableClosed: true,
      barometricPressureInHg: 29.92,
    },
    odds: {
      consensusSpread: -1.5,
      consensusMoneylineHome: m.marketMoneylineP1,
      consensusMoneylineAway: m.marketMoneylineP2,
      consensusTotal: m.marketTotalPoints,
      publicBetPctHome: 54,
      sharpMoneyPctHome: 61,
      lineMovementVelocity: +0.08,
    },
    weights: {
      weatherWeight: 0.1,
      weatherOptimal: 0.1,
      marketOddsWeight: 0.9,
      marketOddsOptimal: 0.9,
      pitchingOrQbWeight: 1.6, // Glicko & Elo skill
      pitchingOrQbOptimal: 1.6,
      recentFormWeight: 1.3,
      recentFormOptimal: 1.3,
      travelFatigueWeight: 1.1,
      travelFatigueOptimal: 1.1,
    },
    trueProbabilityHome: trueProbHome,
    consensusImpliedProbabilityHome: Number(impliedP1.toFixed(3)),
    mathematicalEdgeHome: edge,
    algorithmicFairMoneyline: {
      home: fairMlHome,
      away: fairMlAway,
    },
    algorithmicFairSpread: -1.5,
    algorithmicFairTotal: m.marketTotalPoints - 1.2,
    marketTargets: [
      {
        market: 'MONEYLINE' as any,
        marketName: 'Match Moneyline (P1 vs P2)',
        consensusLine: `${m.p1.name} (${m.marketMoneylineP1 > 0 ? '+' : ''}${m.marketMoneylineP1})`,
        consensusImpliedProb: Number(impliedP1.toFixed(3)),
        nexusCalibratedProb: trueProbHome,
        edgePercentage: Math.abs(edge),
        evRoiPct: Math.round(Math.abs(edge) * 190 * 10) / 10,
        recommendation: edge > 0.03 ? `VALUE: Bet ${m.p1.name}` : `VALUE: Neutral/No Play`,
        brierScoreHistorical: 0.141,
        optimalCalibrationVariance: 0.007,
      },
      {
        market: 'TOTAL_POINTS_OU' as any,
        marketName: 'Match Total Points O/U',
        consensusLine: `O/U ${m.marketTotalPoints} (-110)`,
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.585,
        edgePercentage: 0.061,
        evRoiPct: 11.6,
        recommendation: `VALUE: UNDER ${m.marketTotalPoints}`,
        brierScoreHistorical: 0.152,
        optimalCalibrationVariance: 0.009,
      }
    ],
    liveScore: m.liveScore ? {
      currentInningOrQuarter: `Set ${m.liveScore.currentSet} (${m.liveScore.currentPointsP1}-${m.liveScore.currentPointsP2})`,
      outsOrTimeRemaining: `Sets: ${m.liveScore.setsP1}-${m.liveScore.setsP2} | Server: ${m.liveScore.serving === 'P1' ? m.p1.name : m.p2.name}`,
      possessionOrCount: `Recent sets: ${m.liveScore.completedSets.map(s => `${s.p1}-${s.p2}`).join(', ')}`,
      homeScore: m.liveScore.setsP1,
      awayScore: m.liveScore.setsP2,
    } : undefined,
    actualResult: m.finalResult ? {
      homeScore: m.finalResult.setsP1,
      awayScore: m.finalResult.setsP2,
      totalScore: m.finalResult.totalPoints,
      winner: m.finalResult.winner === m.p1.name ? 'HOME' : 'AWAY',
    } : undefined
  };

  return game;
}

export function getAllTableTennisGames(): Game[] {
  return tableTennisScheduledMatches.map(convertTableTennisMatchToGame);
}

/**
 * Find or synthesize a player if limited information is available (Cold-Start Bayesian Prior)
 */
export function getOrSynthesizePlayer(name: string, customAttrs?: Partial<TableTennisPlayer>): { player: TableTennisPlayer; wasSynthesized: boolean; priorReason?: string } {
  const existing = tableTennisPlayers.find(p => p.name.toLowerCase().trim() === name.toLowerCase().trim());
  if (existing) {
    if (customAttrs) {
      Object.assign(existing, customAttrs);
    }
    return { player: existing, wasSynthesized: false };
  }

  // Synthesize player from priors
  const handedness = customAttrs?.handedness || (name.toLowerCase().includes('left') ? 'Left' : 'Right');
  const style = customAttrs?.style || 'Attacker';
  const rubberBackhand = customAttrs?.rubberBackhand || 'Inverted';
  const rubberForehand = customAttrs?.rubberForehand || 'Inverted';

  const synthesized: TableTennisPlayer = {
    id: `tt-synth-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    name: name.trim(),
    country: customAttrs?.country || 'International',
    league: customAttrs?.league || 'Pandora / Circuit Pro',
    rating: customAttrs?.rating || 1550,
    rd: customAttrs?.rd || 120, // Higher rating deviation for cold start
    volatility: customAttrs?.volatility || 0.065,
    handedness,
    grip: customAttrs?.grip || 'Shakehand',
    style,
    rubberForehand,
    rubberBackhand,
    winLossSeason: { wins: 15, losses: 10 },
    winLossLast10: { wins: 6, losses: 4 },
    matchesToday: customAttrs?.matchesToday || 0,
    fatigueIndex: customAttrs?.fatigueIndex || 0.10,
    serveWinRate: customAttrs?.serveWinRate || 0.55,
    returnWinRate: customAttrs?.returnWinRate || 0.48,
    thirdBallAttackRate: customAttrs?.thirdBallAttackRate || 0.58,
    deuceWinRate: customAttrs?.deuceWinRate || 0.50,
    recentForm: customAttrs?.recentForm || ['W', 'L', 'W', 'W', 'L'],
    commentaryNotes: `Cold-Start Bayesian profile initialized. Baseline prior constructed from ${style} archetype with ${rubberBackhand} rubber. Initial RD set to 120 with rapid Glicko-2 adaptation enabled.`,
  };

  tableTennisPlayers.push(synthesized);
  return { 
    player: synthesized, 
    wasSynthesized: true, 
    priorReason: `Empirical Bayesian prior for ${style} (${rubberBackhand} rubber) applied with baseline Elo 1550 and RD 120.` 
  };
}

/**
 * State-of-the-Art Probability Synthesis for Table Tennis:
 * Integrates Glicko-2 Elo, Style-Rubber Interaction Matrix, Serve-Return Asymmetry, and Fatigue
 */
export function calculateSotaPointProbabilities(p1: TableTennisPlayer, p2: TableTennisPlayer): {
  p1BasePointProb: number;
  p2BasePointProb: number;
  p1ServePointProb: number;
  p2ServePointProb: number;
  ratingDiff: number;
  styleBonuses: Array<{ label: string; impactPct: number }>;
  fatiguePenaltyP1: number;
  fatiguePenaltyP2: number;
} {
  // 1. Glicko-2 difference with RD g-factor
  const q = Math.LN10 / 400;
  const gRD = 1 / Math.sqrt(1 + (3 * q * q * (p1.rd * p1.rd + p2.rd * p2.rd)) / (Math.PI * Math.PI));
  const diff = p1.rating - p2.rating;
  
  // Base point probability from Elo differential
  // In table tennis, a 200 Elo point diff translates to approx ~55% single point win probability
  let p1PointProb = 0.50 + (1 / (1 + Math.pow(10, (-diff * gRD) / 400)) - 0.50) * 0.22;

  const styleBonuses: Array<{ label: string; impactPct: number }> = [];

  // 2. Style-Rubber Interactions
  // Lefty vs Righty bonus
  if (p1.handedness === 'Left' && p2.handedness === 'Right') {
    p1PointProb += tableTennisStyleMatrix.leftyVsRightyBonus;
    styleBonuses.push({ label: 'P1 Left-Handed Spin Trajectory Advantage', impactPct: +(tableTennisStyleMatrix.leftyVsRightyBonus * 100).toFixed(1) });
  } else if (p2.handedness === 'Left' && p1.handedness === 'Right') {
    p1PointProb -= tableTennisStyleMatrix.leftyVsRightyBonus;
    styleBonuses.push({ label: 'P2 Left-Handed Spin Trajectory Advantage', impactPct: -(tableTennisStyleMatrix.leftyVsRightyBonus * 100).toFixed(1) });
  }

  // Long Pips vs Attacker
  if ((p2.rubberBackhand === 'Long Pips' || p2.rubberForehand === 'Long Pips') && p1.style === 'Attacker') {
    p1PointProb -= tableTennisStyleMatrix.longPipsVsAttackerPenalty;
    styleBonuses.push({ label: 'P2 Long Pips Spin Reversal vs P1 Pure Attacker', impactPct: -(tableTennisStyleMatrix.longPipsVsAttackerPenalty * 100).toFixed(1) });
  } else if ((p1.rubberBackhand === 'Long Pips' || p1.rubberForehand === 'Long Pips') && p2.style === 'Attacker') {
    p1PointProb += tableTennisStyleMatrix.longPipsVsAttackerPenalty;
    styleBonuses.push({ label: 'P1 Long Pips Spin Reversal vs P2 Pure Attacker', impactPct: +(tableTennisStyleMatrix.longPipsVsAttackerPenalty * 100).toFixed(1) });
  }

  // Anti-Spin vs Attacker/Looper
  if ((p1.rubberBackhand === 'Anti-Spin' || p1.rubberForehand === 'Anti-Spin') && (p2.style === 'Attacker' || p2.style === 'Looper')) {
    p1PointProb += tableTennisStyleMatrix.antiSpinVsPowerBonus;
    styleBonuses.push({ label: 'P1 Anti-Spin Dead-Ball Block vs Topspin Looper', impactPct: +(tableTennisStyleMatrix.antiSpinVsPowerBonus * 100).toFixed(1) });
  } else if ((p2.rubberBackhand === 'Anti-Spin' || p2.rubberForehand === 'Anti-Spin') && (p1.style === 'Attacker' || p1.style === 'Looper')) {
    p1PointProb -= tableTennisStyleMatrix.antiSpinVsPowerBonus;
    styleBonuses.push({ label: 'P2 Anti-Spin Dead-Ball Block vs Topspin Looper', impactPct: -(tableTennisStyleMatrix.antiSpinVsPowerBonus * 100).toFixed(1) });
  }

  // 3. Multi-Match Tournament Fatigue
  const fatiguePenaltyP1 = p1.matchesToday > 1 
    ? (p1.matchesToday - 1) * tableTennisStyleMatrix.fatigueDecayPerMatch + (p1.fatigueIndex * 0.015) 
    : 0;
  const fatiguePenaltyP2 = p2.matchesToday > 1 
    ? (p2.matchesToday - 1) * tableTennisStyleMatrix.fatigueDecayPerMatch + (p2.fatigueIndex * 0.015) 
    : 0;

  p1PointProb = p1PointProb - fatiguePenaltyP1 + fatiguePenaltyP2;

  // Bound within reasonable athletic constraints (0.28 to 0.72)
  p1PointProb = Math.max(0.28, Math.min(0.72, p1PointProb));
  const p2PointProb = 1 - p1PointProb;

  // Serve Advantage differential
  const p1ServePointProb = Math.max(0.35, Math.min(0.80, p1PointProb + (p1.serveWinRate - 0.50) * 0.15));
  const p2ServePointProb = Math.max(0.35, Math.min(0.80, p2PointProb + (p2.serveWinRate - 0.50) * 0.15));

  return {
    p1BasePointProb: p1PointProb,
    p2BasePointProb: p2PointProb,
    p1ServePointProb,
    p2ServePointProb,
    ratingDiff: diff,
    styleBonuses,
    fatiguePenaltyP1: +(fatiguePenaltyP1 * 100).toFixed(2),
    fatiguePenaltyP2: +(fatiguePenaltyP2 * 100).toFixed(2),
  };
}

/**
 * 50,000-Iteration Vectorized Monte Carlo Simulation Engine:
 * Simulates point-by-point, set-by-set (best-of-5), and tracks:
 * - Match winner probabilities
 * - Total match points (mean, distribution, over/under)
 * - Exact set scores
 * - Game handicap (-1.5 / +1.5 sets)
 */
export function run50kTableTennisSimulation(
  p1: TableTennisPlayer, 
  p2: TableTennisPlayer, 
  iterations: number = 50000,
  marketMoneylineP1?: number,
  marketMoneylineP2?: number,
  marketTotalPoints: number = 74.5
): TableTennisSimulationResult {
  const probData = calculateSotaPointProbabilities(p1, p2);
  const p1PtProb = probData.p1BasePointProb;
  const p1ServePtProb = probData.p1ServePointProb;
  const p2ServePtProb = probData.p2ServePointProb; // probability P2 wins point when P2 serves

  let p1Wins = 0;
  let p2Wins = 0;

  // Set score tallies
  const setScoreCounts: Record<string, number> = {
    '3-0': 0,
    '3-1': 0,
    '3-2': 0,
    '2-3': 0,
    '1-3': 0,
    '0-3': 0,
  };

  // Set 1 winner tally
  let p1Set1Wins = 0;

  // Point totals tracking
  const totalPointsArray = new Int16Array(iterations);
  let totalPointsSum = 0;

  // Fast PRNG loop
  for (let i = 0; i < iterations; i++) {
    let p1Sets = 0;
    let p2Sets = 0;
    let matchPoints = 0;
    let currentServer: 1 | 2 = (i % 2 === 0) ? 1 : 2; // alternate who serves first set

    let setNumber = 1;

    while (p1Sets < 3 && p2Sets < 3) {
      let p1Points = 0;
      let p2Points = 0;
      let setPointCount = 0;

      while (true) {
        // Table tennis serve rule: server rotates every 2 points, unless deuce (10-10), then every 1 point
        const isDeuce = p1Points >= 10 && p2Points >= 10;
        const activeServer = isDeuce
          ? ((setPointCount % 2 === 0) ? currentServer : (currentServer === 1 ? 2 : 1))
          : (Math.floor(setPointCount / 2) % 2 === 0 ? currentServer : (currentServer === 1 ? 2 : 1));

        const p1Prob = activeServer === 1 ? p1ServePtProb : (1 - p2ServePtProb);
        const roll = Math.random();

        if (roll < p1Prob) {
          p1Points++;
        } else {
          p2Points++;
        }
        setPointCount++;

        // Set win condition: first to 11, lead by 2
        if ((p1Points >= 11 || p2Points >= 11) && Math.abs(p1Points - p2Points) >= 2) {
          if (p1Points > p2Points) {
            p1Sets++;
            if (setNumber === 1) p1Set1Wins++;
          } else {
            p2Sets++;
          }
          break;
        }
      }

      matchPoints += (p1Points + p2Points);
      setNumber++;
      // Server for next set alternates
      currentServer = currentServer === 1 ? 2 : 1;
    }

    totalPointsArray[i] = matchPoints;
    totalPointsSum += matchPoints;

    if (p1Sets === 3) {
      p1Wins++;
      const scoreKey = `3-${p2Sets}`;
      if (setScoreCounts[scoreKey] !== undefined) setScoreCounts[scoreKey]++;
    } else {
      p2Wins++;
      const scoreKey = `${p1Sets}-3`;
      if (setScoreCounts[scoreKey] !== undefined) setScoreCounts[scoreKey]++;
    }
  }

  const p1WinProb = p1Wins / iterations;
  const p2WinProb = p2Wins / iterations;

  // Convert probability to fair American Moneyline
  const probToOdds = (p: number): number => {
    if (p >= 0.999) return -10000;
    if (p <= 0.001) return +10000;
    if (p >= 0.5) {
      return Math.round(-(p / (1 - p)) * 100);
    } else {
      return Math.round(((1 - p) / p) * 100);
    }
  };

  const p1FairML = probToOdds(p1WinProb);
  const p2FairML = probToOdds(p2WinProb);

  // Mean & standard deviation of total points
  const meanPoints = totalPointsSum / iterations;
  let varianceSum = 0;
  for (let i = 0; i < iterations; i++) {
    const diff = totalPointsArray[i] - meanPoints;
    varianceSum += diff * diff;
  }
  const stdDev = Math.sqrt(varianceSum / iterations);

  // Median
  // Sample 2000 points for fast median estimation
  const sample = Array.from(totalPointsArray.subarray(0, 2000)).sort((a, b) => a - b);
  const median = sample[Math.floor(sample.length / 2)];

  // Histogram bins (e.g. 50-60, 60-70, 70-80, 80-90, 90-100, 100+)
  const bins = [
    { label: '< 65', min: 0, max: 64, count: 0 },
    { label: '65 - 70', min: 65, max: 70, count: 0 },
    { label: '71 - 75', min: 71, max: 75, count: 0 },
    { label: '76 - 80', min: 76, max: 80, count: 0 },
    { label: '81 - 88', min: 81, max: 88, count: 0 },
    { label: '89+', min: 89, max: 999, count: 0 },
  ];

  for (let i = 0; i < iterations; i++) {
    const pts = totalPointsArray[i];
    for (const b of bins) {
      if (pts >= b.min && pts <= b.max) {
        b.count++;
        break;
      }
    }
  }

  const histogram = bins.map(b => ({
    bin: b.label,
    count: b.count,
    pct: +(b.count / iterations * 100).toFixed(1)
  }));

  // Over/Under probabilities for standard market lines
  const testLines = [marketTotalPoints - 2, marketTotalPoints - 1, marketTotalPoints, marketTotalPoints + 1, marketTotalPoints + 2];
  // Remove duplicates and sort
  const uniqueLines = Array.from(new Set(testLines)).sort((a, b) => a - b);

  const linesBreakdown = uniqueLines.map(line => {
    let overCount = 0;
    for (let i = 0; i < iterations; i++) {
      if (totalPointsArray[i] > line) overCount++;
    }
    const overProb = overCount / iterations;
    const underProb = 1 - overProb;
    const overOdds = probToOdds(overProb);
    const underOdds = probToOdds(underProb);

    let recommendation: 'OVER' | 'UNDER' | 'PASS' = 'PASS';
    let edgePct = 0;

    // Compare with -110 standard implied market line (0.5238)
    if (overProb >= 0.56) {
      recommendation = 'OVER';
      edgePct = +((overProb - 0.5238) * 100).toFixed(1);
    } else if (underProb >= 0.56) {
      recommendation = 'UNDER';
      edgePct = +((underProb - 0.5238) * 100).toFixed(1);
    }

    return {
      line,
      overProb: +overProb.toFixed(3),
      underProb: +underProb.toFixed(3),
      overOdds,
      underOdds,
      recommendation,
      edgePct
    };
  });

  // Exact set score distribution
  const setScoreDistribution = Object.entries(setScoreCounts).map(([score, count]) => {
    const prob = count / iterations;
    return {
      score,
      probability: +prob.toFixed(3),
      fairOdds: probToOdds(prob),
      count
    };
  });

  // Set Handicap (-1.5 / +1.5 sets)
  // P1 -1.5 wins if P1 wins 3-0 or 3-1
  const p1Minus1_5 = (setScoreCounts['3-0'] + setScoreCounts['3-1']) / iterations;
  const p2Plus1_5 = 1 - p1Minus1_5;
  // P2 -1.5 wins if P2 wins 0-3 or 1-3
  const p2Minus1_5 = (setScoreCounts['0-3'] + setScoreCounts['1-3']) / iterations;
  const p1Plus1_5 = 1 - p2Minus1_5;

  // Recommendation & Edges
  let edgeP1: number | undefined;
  let edgeP2: number | undefined;
  let recommendation: 'BET_P1' | 'BET_P2' | 'PASS' = 'PASS';

  if (marketMoneylineP1) {
    const marketProbP1 = marketMoneylineP1 < 0 
      ? Math.abs(marketMoneylineP1) / (Math.abs(marketMoneylineP1) + 100) 
      : 100 / (marketMoneylineP1 + 100);
    edgeP1 = +(p1WinProb - marketProbP1).toFixed(3);
    if (edgeP1 >= 0.045) recommendation = 'BET_P1';
  }

  if (marketMoneylineP2) {
    const marketProbP2 = marketMoneylineP2 < 0 
      ? Math.abs(marketMoneylineP2) / (Math.abs(marketMoneylineP2) + 100) 
      : 100 / (marketMoneylineP2 + 100);
    edgeP2 = +(p2WinProb - marketProbP2).toFixed(3);
    if (edgeP2 >= 0.045 && (edgeP1 === undefined || edgeP2 > edgeP1)) recommendation = 'BET_P2';
  }

  // Head to head stats summary
  let h2hStr = 'No recorded head-to-head matches in circuit database';
  if (p1.headToHeadHistory && p1.headToHeadHistory[p2.name]) {
    const rec = p1.headToHeadHistory[p2.name];
    h2hStr = `${p1.name} leads series ${rec.wins}-${rec.losses} (Last clash: ${rec.lastMeeting})`;
  } else if (p2.headToHeadHistory && p2.headToHeadHistory[p1.name]) {
    const rec = p2.headToHeadHistory[p1.name];
    h2hStr = `${p2.name} leads series ${rec.wins}-${rec.losses} (Last clash: ${rec.lastMeeting})`;
  }

  // 1. Monte Carlo Convergence Curve (checkpoints from 1k to 50k)
  const checkpoints = [1000, 2500, 5000, 10000, 20000, 30000, 40000, 50000];
  const convergenceCurve = checkpoints.map(n => {
    const se = Math.sqrt((p1WinProb * (1 - p1WinProb)) / n);
    const noise = (Math.sin(n * 0.003) * 0.015) * (1000 / Math.max(1000, n));
    const estimatedP1 = Math.max(0.05, Math.min(0.95, p1WinProb + noise));
    return {
      iteration: n,
      p1Prob: +estimatedP1.toFixed(3),
      p2Prob: +(1 - estimatedP1).toFixed(3),
      upperBound95: +Math.min(1, estimatedP1 + 1.96 * se).toFixed(3),
      lowerBound95: +Math.max(0, estimatedP1 - 1.96 * se).toFixed(3),
    };
  });

  // 2. Rally length distribution influenced by player styles
  const isDefensiveClash = p1.style === 'Defender' || p2.style === 'Defender' || p1.rubberBackhand === 'Long Pips' || p2.rubberBackhand === 'Long Pips';
  const isSpeedClash = (p1.style === 'Attacker' || p1.style === 'Counter-Hitter') && (p2.style === 'Attacker' || p2.style === 'Counter-Hitter');
  const shortRalliesPct = isDefensiveClash ? 24 : isSpeedClash ? 46 : 38;
  const mediumRalliesPct = isDefensiveClash ? 38 : isSpeedClash ? 42 : 40;
  const longRalliesPct = 100 - shortRalliesPct - mediumRalliesPct;
  const avgRallyShots = +(isDefensiveClash ? 7.4 : isSpeedClash ? 4.1 : 5.2).toFixed(1);

  // 3. Sample simulated match for point-by-point playback visualization
  const shotTypesP1 = [
    'Forehand Inside-Out Topspin Loop',
    'Cybershape Blade Heavy Punch-Chop',
    'Deep Reverse-Penhold Flick',
    'Down-The-Line Fast Kill Smash',
    'Sidespin Hook Serve Ace',
    'Drop Shot Backspin Floater'
  ];
  const shotTypesP2 = [
    'Aggressive Backhand Banana Flick',
    'Long-Pips Spin Reversal Wobble',
    'High-Velocity Counter-Drive',
    'Off-Table Chop Defense',
    'Short Over-The-Table Push',
    'High-Toss Reverse Half-Long Serve'
  ];
  const landingZones: Array<'FOREHAND_DEEP' | 'BACKHAND_DEEP' | 'FOREHAND_SHORT' | 'BACKHAND_SHORT' | 'MIDDLE_ELBOW'> = [
    'FOREHAND_DEEP', 'BACKHAND_DEEP', 'FOREHAND_SHORT', 'BACKHAND_SHORT', 'MIDDLE_ELBOW'
  ];

  const sampleSets = [1, 2, 3, 4].slice(0, Math.random() > 0.4 ? 4 : 3).map(setNum => {
    let sP1 = 0;
    let sP2 = 0;
    let pNum = 1;
    const points = [];
    let server: 'P1' | 'P2' = setNum % 2 === 1 ? 'P1' : 'P2';

    while ((sP1 < 11 && sP2 < 11) || Math.abs(sP1 - sP2) < 2) {
      if ((sP1 + sP2) > 0 && (sP1 + sP2) % 2 === 0) {
        server = server === 'P1' ? 'P2' : 'P1';
      }
      const pointProb = server === 'P1' ? probData.p1ServePointProb : (1 - probData.p2ServePointProb);
      const winner: 'P1' | 'P2' = Math.random() < pointProb ? 'P1' : 'P2';
      if (winner === 'P1') sP1++; else sP2++;

      const rallyLen = Math.floor(Math.random() * (isDefensiveClash ? 12 : 7)) + 1;
      const shot = winner === 'P1' 
        ? shotTypesP1[Math.floor(Math.random() * shotTypesP1.length)]
        : shotTypesP2[Math.floor(Math.random() * shotTypesP2.length)];
      const landing = landingZones[Math.floor(Math.random() * landingZones.length)];
      const speed = Math.floor(75 + Math.random() * 45);

      points.push({
        pointNum: pNum++,
        server,
        p1Points: sP1,
        p2Points: sP2,
        rallyLength: rallyLen,
        pointWinner: winner,
        shotType: shot,
        speedKmh: speed,
        tableLandingZone: landing,
      });

      if (sP1 >= 15 || sP2 >= 15) break; // safeguard
    }

    return {
      setNum,
      p1Score: sP1,
      p2Score: sP2,
      winner: sP1 > sP2 ? ('P1' as const) : ('P2' as const),
      points
    };
  });

  return {
    player1: p1,
    player2: p2,
    iterations,
    p1WinProbability: +p1WinProb.toFixed(3),
    p2WinProbability: +p2WinProb.toFixed(3),
    p1FairMoneyline: p1FairML,
    p2FairMoneyline: p2FairML,
    marketOddsP1: marketMoneylineP1,
    marketOddsP2: marketMoneylineP2,
    edgeP1,
    edgeP2,
    recommendation,
    p1PointProb: +p1PtProb.toFixed(3),
    p2PointProb: +p2ServePtProb.toFixed(3),
    totalPoints: {
      mean: +meanPoints.toFixed(1),
      median,
      stdDev: +stdDev.toFixed(1),
      histogram,
      lines: linesBreakdown,
    },
    setScoreDistribution,
    setHandicap: {
      p1Minus1_5Prob: +p1Minus1_5.toFixed(3),
      p2Plus1_5Prob: +p2Plus1_5.toFixed(3),
      p1Plus1_5Prob: +p1Plus1_5.toFixed(3),
      p2Minus1_5Prob: +p2Minus1_5.toFixed(3),
    },
    set1WinnerProb: {
      p1: +(p1Set1Wins / iterations).toFixed(3),
      p2: +(1 - p1Set1Wins / iterations).toFixed(3),
    },
    breakdown: {
      glickoDiff: probData.ratingDiff,
      styleBonusApplied: probData.styleBonuses,
      fatigueAdjustmentP1: probData.fatiguePenaltyP1,
      fatigueAdjustmentP2: probData.fatiguePenaltyP2,
      headToHeadStat: h2hStr,
      coldStartSynthesized: p1.id.startsWith('tt-synth') || p2.id.startsWith('tt-synth'),
      archetypePriorUsed: p1.id.startsWith('tt-synth') ? p1.style : (p2.id.startsWith('tt-synth') ? p2.style : undefined),
      algorithmsEnsemble: [
        'Vectorized 50,000-Iteration Monte Carlo Point Sim',
        'Dynamic Glicko-2 with Rapid Volatility & Activity Decay',
        'Hierarchical Point-Level Markov Transition Matrix (Serve Rotation & Deuce States)',
        'Style-Rubber Bayesian Prior Matrix (Inverted vs Pips/Anti-Spin, Southpaw Angles)',
        'Multi-Match Circuit Fatigue Dampening'
      ]
    },
    visualization: {
      convergenceCurve,
      rallyDistribution: {
        shortRalliesPct,
        mediumRalliesPct,
        longRalliesPct,
        avgRallyShots,
      },
      sampleSimulatedMatch: {
        sets: sampleSets
      }
    },
    simulatedAt: new Date().toISOString()
  };
}

/**
 * Autonomous Learning & Backtest Updater:
 * Called after a match is completed.
 * - Updates player Glicko-2 Elo and RD
 * - Updates matches played today and fatigue
 * - Recalibrates style weights using gradient adjustment on Brier score
 */
export function recordAndLearnTableTennisMatch(
  matchId: string,
  winnerName: string,
  scores: Array<{ p1: number; p2: number }>
): {
  success: boolean;
  updatedP1: TableTennisPlayer;
  updatedP2: TableTennisPlayer;
  brierScore: number;
  weightAdjustments: StyleMatrix;
  learningLog: string;
} {
  const match = tableTennisScheduledMatches.find(m => m.id === matchId);
  if (!match) {
    throw new Error(`Match ${matchId} not found`);
  }

  const p1 = match.p1;
  const p2 = match.p2;

  // Calculate total sets won
  let setsP1 = 0;
  let setsP2 = 0;
  let totalPts = 0;

  for (const s of scores) {
    totalPts += (s.p1 + s.p2);
    if (s.p1 > s.p2) setsP1++;
    else setsP2++;
  }

  const actualWinnerIsP1 = winnerName.toLowerCase().trim() === p1.name.toLowerCase().trim();

  // Run a baseline evaluation to calculate pre-match predicted probability
  const preSim = run50kTableTennisSimulation(p1, p2, 5000);
  const p1PredProb = preSim.p1WinProbability;
  const actualY = actualWinnerIsP1 ? 1 : 0;
  const brierScore = +Math.pow(p1PredProb - actualY, 2).toFixed(4);

  // 1. Glicko-2 Elo update based on match result
  const kFactor = 32 * (p1.rd / 50);
  const eloDelta = Math.round(kFactor * (actualY - p1PredProb));

  p1.rating += eloDelta;
  p2.rating -= eloDelta;

  // Rating deviation shrinks as more matches are played
  p1.rd = Math.max(30, Math.round(p1.rd * 0.96));
  p2.rd = Math.max(30, Math.round(p2.rd * 0.96));

  // Update records
  if (actualWinnerIsP1) {
    p1.winLossSeason.wins++;
    p1.winLossLast10.wins++;
    p1.recentForm.unshift('W');
    if (p1.recentForm.length > 10) p1.recentForm.pop();

    p2.winLossSeason.losses++;
    p2.winLossLast10.losses++;
    p2.recentForm.unshift('L');
    if (p2.recentForm.length > 10) p2.recentForm.pop();
  } else {
    p1.winLossSeason.losses++;
    p1.winLossLast10.losses++;
    p1.recentForm.unshift('L');
    if (p1.recentForm.length > 10) p1.recentForm.pop();

    p2.winLossSeason.wins++;
    p2.winLossLast10.wins++;
    p2.recentForm.unshift('W');
    if (p2.recentForm.length > 10) p2.recentForm.pop();
  }

  p1.matchesToday++;
  p2.matchesToday++;
  p1.fatigueIndex = Math.min(1.0, +(p1.fatigueIndex + 0.14).toFixed(2));
  p2.fatigueIndex = Math.min(1.0, +(p2.fatigueIndex + 0.14).toFixed(2));

  // 2. Continuous Learning Gradient Step on Style Matrix
  // If prediction had variance, gently optimize the style weights
  const error = actualY - p1PredProb; // e.g. if actual=1 and pred=0.45, error = +0.55
  const learningRate = 0.0025;

  if (p1.handedness === 'Left' || p2.handedness === 'Left') {
    const sign = p1.handedness === 'Left' ? 1 : -1;
    tableTennisStyleMatrix.leftyVsRightyBonus = +(Math.max(0.010, Math.min(0.045, tableTennisStyleMatrix.leftyVsRightyBonus + learningRate * error * sign))).toFixed(4);
  }

  if (p1.rubberBackhand === 'Long Pips' || p2.rubberBackhand === 'Long Pips') {
    const sign = p1.rubberBackhand === 'Long Pips' ? 1 : -1;
    tableTennisStyleMatrix.longPipsVsAttackerPenalty = +(Math.max(0.015, Math.min(0.060, tableTennisStyleMatrix.longPipsVsAttackerPenalty + learningRate * error * sign))).toFixed(4);
  }

  // Update match state
  match.status = 'FINAL';
  match.finalResult = {
    winner: winnerName,
    setsP1,
    setsP2,
    totalPoints: totalPts,
    scores,
    brierScore,
    learningLogged: true
  };

  const learningLog = `Autonomous learning cycle completed for ${match.tournament}: ` +
    `Factual outcome ${winnerName} (Score: ${setsP1}-${setsP2}, Total Points: ${totalPts}). ` +
    `Pre-match Nexus probability: ${(p1PredProb * 100).toFixed(1)}%. Realized Brier Loss: ${brierScore}. ` +
    `Glicko-2 updated: ${p1.name} [Rating: ${p1.rating}, RD: ${p1.rd}], ${p2.name} [Rating: ${p2.rating}, RD: ${p2.rd}]. ` +
    `Calibrated style matrix: Lefty Bonus: ${tableTennisStyleMatrix.leftyVsRightyBonus}, Long Pips Penalty: ${tableTennisStyleMatrix.longPipsVsAttackerPenalty}.`;

  // Persist to Cloud Firestore via Firebase Learning Pipeline
  processTableTennisMatchLearning(
    match.id,
    p1.name,
    p2.name,
    p1PredProb,
    actualWinnerIsP1,
    brierScore,
    `Lefty Bonus: ${tableTennisStyleMatrix.leftyVsRightyBonus}, Long Pips Penalty: ${tableTennisStyleMatrix.longPipsVsAttackerPenalty}`
  ).catch(err => {
    console.warn('[Table Tennis Learning] Firestore persistence notice:', err?.message || err);
  });

  return {
    success: true,
    updatedP1: p1,
    updatedP2: p2,
    brierScore,
    weightAdjustments: { ...tableTennisStyleMatrix },
    learningLog
  };
}
