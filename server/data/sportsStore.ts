import { 
  Game, 
  StructuredGameEvent, 
  CalibrationMetrics, 
  SelfRefactoringLog, 
  ElasticFeatureDiscovery 
} from '../../src/types';

export const mockGames: Game[] = [
  // MLB GAME
  {
    id: 'mlb-nyy-bos-001',
    sport: 'MLB',
    homeTeam: {
      code: 'NYY',
      name: 'New York Yankees',
      record: '88-62',
      starterOrQb: 'Gerrit Cole (RHP | 2.84 xFIP, 31.4% K%)',
      rating: 94.2,
    },
    awayTeam: {
      code: 'BOS',
      name: 'Boston Red Sox',
      record: '79-72',
      starterOrQb: 'Brayan Bello (RHP | 3.92 xFIP, 21.8% K%)',
      rating: 86.8,
    },
    scheduledTime: '19:05 EDT',
    status: 'LIVE',
    venue: 'Yankee Stadium, Bronx NY',
    weather: {
      temperatureF: 74,
      windSpeedMph: 14,
      windDirection: 'OUT_TO_CF',
      humidityPct: 58,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 29.88,
    },
    odds: {
      consensusSpread: -1.5,
      consensusMoneylineHome: -165,
      consensusMoneylineAway: +145,
      consensusTotal: 8.5,
      publicBetPctHome: 78,
      sharpMoneyPctHome: 44, // Discrepancy shows sharp divergence
      lineMovementVelocity: -0.15,
    },
    weights: {
      weatherWeight: 1.25,
      weatherOptimal: 1.20,
      marketOddsWeight: 0.85,
      marketOddsOptimal: 0.80,
      pitchingOrQbWeight: 1.45,
      pitchingOrQbOptimal: 1.45,
      recentFormWeight: 1.05,
      recentFormOptimal: 1.00,
      travelFatigueWeight: 0.90,
      travelFatigueOptimal: 0.90,
    },
    trueProbabilityHome: 0.672, // Root mathematical truth deconstructing public line
    consensusImpliedProbabilityHome: 0.623,
    mathematicalEdgeHome: 0.049,
    algorithmicFairMoneyline: {
      home: -205,
      away: +185,
    },
    algorithmicFairSpread: -1.85,
    algorithmicFairTotal: 9.15,
    marketTargets: [
      {
        market: 'F5_MONEYLINE',
        marketName: 'First 5 Innings (F5) Moneyline',
        consensusLine: 'NYY -0.5 (-135)',
        consensusImpliedProb: 0.574,
        nexusCalibratedProb: 0.648,
        edgePercentage: 0.074,
        evRoiPct: 12.8,
        recommendation: 'STRONG VALUE: NYY F5 -0.5',
        brierScoreHistorical: 0.168,
        optimalCalibrationVariance: 0.012,
      },
      {
        market: 'PITCHER_STRIKEOUTS',
        marketName: 'Gerrit Cole Strikeouts O/U',
        consensusLine: 'Over 7.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.618,
        edgePercentage: 0.083,
        evRoiPct: 15.6,
        recommendation: 'EDGE: OVER 7.5 K (Proj 8.64)',
        brierScoreHistorical: 0.182,
        optimalCalibrationVariance: 0.019,
      },
      {
        market: 'TOTAL_OVER_UNDER',
        marketName: 'Full Game Total O/U',
        consensusLine: 'Over 8.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.582,
        edgePercentage: 0.058,
        evRoiPct: 11.1,
        recommendation: 'VALUE: OVER 8.5 (Wind Out to CF + 14mph)',
        brierScoreHistorical: 0.191,
        optimalCalibrationVariance: 0.015,
      },
      {
        market: 'TEAM_TOTALS',
        marketName: 'NYY Team Total O/U',
        consensusLine: 'Over 4.5 (-125)',
        consensusImpliedProb: 0.556,
        nexusCalibratedProb: 0.630,
        edgePercentage: 0.074,
        evRoiPct: 13.4,
        recommendation: 'VALUE: NYY Team Total OVER 4.5',
        brierScoreHistorical: 0.174,
        optimalCalibrationVariance: 0.014,
      },
      {
        market: 'FULL_GAME_ML',
        marketName: 'Full Game Moneyline',
        consensusLine: 'NYY -165 / BOS +145',
        consensusImpliedProb: 0.623,
        nexusCalibratedProb: 0.672,
        edgePercentage: 0.049,
        evRoiPct: 8.9,
        recommendation: 'MODERATE VALUE: NYY ML',
        brierScoreHistorical: 0.177,
        optimalCalibrationVariance: 0.009,
      },
    ],
    playerProps: [
      {
        id: 'prop-cole-k',
        playerName: 'Gerrit Cole',
        team: 'NYY',
        position: 'SP',
        propType: 'PITCHER_K',
        marketLine: 7.5,
        algorithmicProjection: 8.65,
        overProbability: 0.618,
        underProbability: 0.382,
        edgePct: 0.083,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: {
          baseRate: 7.8,
          matchupModifier: +0.65,
          weatherModifier: +0.20,
          paceDifferential: 0.0,
        },
      },
      {
        id: 'prop-bello-k',
        playerName: 'Brayan Bello',
        team: 'BOS',
        position: 'SP',
        propType: 'PITCHER_K',
        marketLine: 4.5,
        algorithmicProjection: 3.92,
        overProbability: 0.412,
        underProbability: 0.588,
        edgePct: 0.064,
        recommendation: 'UNDER',
        confidenceTier: 'A',
        mathBreakdown: {
          baseRate: 4.4,
          matchupModifier: -0.38,
          weatherModifier: -0.10,
          paceDifferential: 0.0,
        },
      },
    ],
    liveTelemetry: {
      quarterOrInning: 'Top 4th',
      clockOrOuts: '1 Out, Runners on 1st & 2nd',
      homeScore: 3,
      awayScore: 1,
      possessionOrBatting: 'BOS Batting (Devers at plate)',
      currentDownOrCount: 'Count 2-2',
      winProbabilityInGame: 0.764,
    },
  },

  // NFL GAME
  {
    id: 'nfl-kc-bal-002',
    sport: 'NFL',
    homeTeam: {
      code: 'KC',
      name: 'Kansas City Chiefs',
      record: '11-3',
      starterOrQb: 'Patrick Mahomes (0.24 EPA/play, 7.8 CPOE)',
      rating: 96.5,
    },
    awayTeam: {
      code: 'BAL',
      name: 'Baltimore Ravens',
      record: '10-4',
      starterOrQb: 'Lamar Jackson (0.28 EPA/play, 68.2 QBR)',
      rating: 95.1,
    },
    scheduledTime: '20:15 EST',
    status: 'UPCOMING',
    venue: 'GEHA Field at Arrowhead Stadium, Kansas City MO',
    weather: {
      temperatureF: 36,
      windSpeedMph: 16,
      windDirection: 'CROSS_L_TO_R',
      humidityPct: 62,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 30.12,
    },
    odds: {
      consensusSpread: -2.5,
      consensusMoneylineHome: -140,
      consensusMoneylineAway: +120,
      consensusTotal: 47.5,
      publicBetPctHome: 65,
      sharpMoneyPctHome: 52,
      lineMovementVelocity: +0.25,
    },
    weights: {
      weatherWeight: 1.30,
      weatherOptimal: 1.30,
      marketOddsWeight: 0.75,
      marketOddsOptimal: 0.75,
      pitchingOrQbWeight: 1.60,
      pitchingOrQbOptimal: 1.55,
      recentFormWeight: 1.10,
      recentFormOptimal: 1.10,
      travelFatigueWeight: 0.85,
      travelFatigueOptimal: 0.85,
    },
    trueProbabilityHome: 0.589,
    consensusImpliedProbabilityHome: 0.583,
    mathematicalEdgeHome: 0.006,
    algorithmicFairMoneyline: {
      home: -143,
      away: +123,
    },
    algorithmicFairSpread: -3.1,
    algorithmicFairTotal: 44.2, // Algorithmic total heavily under market due to cold & cross-wind
    marketTargets: [
      {
        market: 'TOTAL_POINTS_OU',
        marketName: 'Game Total Points O/U',
        consensusLine: 'Under 47.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.612,
        edgePercentage: 0.088,
        evRoiPct: 16.8,
        recommendation: 'STRONG EDGE: UNDER 47.5 (Wind + Cold Model)',
        brierScoreHistorical: 0.171,
        optimalCalibrationVariance: 0.011,
      },
      {
        market: 'WINNER_SPREAD',
        marketName: 'Point Spread Winner',
        consensusLine: 'KC -2.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.548,
        edgePercentage: 0.024,
        evRoiPct: 4.6,
        recommendation: 'LEAN: KC -2.5',
        brierScoreHistorical: 0.185,
        optimalCalibrationVariance: 0.008,
      },
      {
        market: 'QB_PASSING_YARDS',
        marketName: 'Patrick Mahomes Passing Yards O/U',
        consensusLine: 'Under 262.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.624,
        edgePercentage: 0.089,
        evRoiPct: 16.6,
        recommendation: 'HIGH EDGE: UNDER 262.5 Yds (Proj 244.8)',
        brierScoreHistorical: 0.169,
        optimalCalibrationVariance: 0.015,
      },
      {
        market: 'WR_RECEIVING_YARDS',
        marketName: 'Zay Flowers Receiving Yards O/U',
        consensusLine: 'Over 58.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.605,
        edgePercentage: 0.070,
        evRoiPct: 13.1,
        recommendation: 'VALUE: OVER 58.5 Yds (Target Share 28.4%)',
        brierScoreHistorical: 0.188,
        optimalCalibrationVariance: 0.016,
      },
      {
        market: 'RB_RUSHING_YARDS',
        marketName: 'Derrick Henry Rushing Yards O/U',
        consensusLine: 'Over 74.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.615,
        edgePercentage: 0.091,
        evRoiPct: 17.4,
        recommendation: 'HIGH EDGE: OVER 74.5 Yds (Cold Heavy Rush Volume)',
        brierScoreHistorical: 0.176,
        optimalCalibrationVariance: 0.012,
      },
      {
        market: 'QUARTER_MONEYLINES',
        marketName: '1st Quarter Moneyline',
        consensusLine: 'KC -130 / BAL +110',
        consensusImpliedProb: 0.565,
        nexusCalibratedProb: 0.620,
        edgePercentage: 0.055,
        evRoiPct: 9.7,
        recommendation: 'VALUE: KC 1Q ML',
        brierScoreHistorical: 0.180,
        optimalCalibrationVariance: 0.014,
      },
    ],
    playerProps: [
      {
        id: 'prop-mahomes-pass',
        playerName: 'Patrick Mahomes',
        team: 'KC',
        position: 'QB',
        propType: 'QB_PASS_YDS',
        marketLine: 262.5,
        algorithmicProjection: 244.8,
        overProbability: 0.376,
        underProbability: 0.624,
        edgePct: 0.089,
        recommendation: 'UNDER',
        confidenceTier: 'A+',
        mathBreakdown: {
          baseRate: 268.0,
          matchupModifier: -11.2,
          weatherModifier: -14.0,
          paceDifferential: +2.0,
        },
      },
      {
        id: 'prop-henry-rush',
        playerName: 'Derrick Henry',
        team: 'BAL',
        position: 'RB',
        propType: 'RB_RUSH_YDS',
        marketLine: 74.5,
        algorithmicProjection: 86.4,
        overProbability: 0.615,
        underProbability: 0.385,
        edgePct: 0.091,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: {
          baseRate: 78.5,
          matchupModifier: +4.2,
          weatherModifier: +3.7,
          paceDifferential: 0.0,
        },
      },
      {
        id: 'prop-flowers-rec',
        playerName: 'Zay Flowers',
        team: 'BAL',
        position: 'WR',
        propType: 'WR_REC_YDS',
        marketLine: 58.5,
        algorithmicProjection: 66.2,
        overProbability: 0.605,
        underProbability: 0.395,
        edgePct: 0.070,
        recommendation: 'OVER',
        confidenceTier: 'A',
        mathBreakdown: {
          baseRate: 61.0,
          matchupModifier: +5.2,
          weatherModifier: 0.0,
          paceDifferential: 0.0,
        },
      },
    ],
  },

  // CFB GAME
  {
    id: 'cfb-uga-ala-003',
    sport: 'CFB',
    homeTeam: {
      code: 'UGA',
      name: 'Georgia Bulldogs',
      record: '12-1',
      starterOrQb: 'Carson Beck (0.29 EPA/pass, 82.1 QBR)',
      rating: 98.1,
    },
    awayTeam: {
      code: 'ALA',
      name: 'Alabama Crimson Tide',
      record: '11-2',
      starterOrQb: 'Jalen Milroe (Dual-Threat EPA 0.33)',
      rating: 96.8,
    },
    scheduledTime: '15:30 EST',
    status: 'FINAL',
    venue: 'Sanford Stadium, Athens GA',
    weather: {
      temperatureF: 68,
      windSpeedMph: 6,
      windDirection: 'CALM',
      humidityPct: 45,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 30.04,
    },
    odds: {
      consensusSpread: -4.5,
      consensusMoneylineHome: -190,
      consensusMoneylineAway: +160,
      consensusTotal: 54.5,
      publicBetPctHome: 72,
      sharpMoneyPctHome: 46,
      lineMovementVelocity: -0.10,
    },
    weights: {
      weatherWeight: 1.15,
      weatherOptimal: 1.15,
      marketOddsWeight: 0.80,
      marketOddsOptimal: 0.80,
      pitchingOrQbWeight: 1.50,
      pitchingOrQbOptimal: 1.50,
      recentFormWeight: 1.20,
      recentFormOptimal: 1.15,
      travelFatigueWeight: 0.95,
      travelFatigueOptimal: 0.95,
    },
    trueProbabilityHome: 0.615,
    consensusImpliedProbabilityHome: 0.655,
    mathematicalEdgeHome: -0.040, // Value was on away dog
    algorithmicFairMoneyline: {
      home: -160,
      away: +140,
    },
    algorithmicFairSpread: -3.2,
    algorithmicFairTotal: 50.8,
    marketTargets: [
      {
        market: 'WINNER_SPREAD',
        marketName: 'Point Spread',
        consensusLine: 'ALA +4.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.598,
        edgePercentage: 0.074,
        evRoiPct: 14.1,
        recommendation: 'HIT: ALA +4.5 (Covered Actual +3)',
        brierScoreHistorical: 0.154,
        optimalCalibrationVariance: 0.007,
      },
      {
        market: 'TOTAL_POINTS_OU',
        marketName: 'Total Points O/U',
        consensusLine: 'Under 54.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.588,
        edgePercentage: 0.064,
        evRoiPct: 12.2,
        recommendation: 'HIT: UNDER 54.5 (Actual 51)',
        brierScoreHistorical: 0.162,
        optimalCalibrationVariance: 0.009,
      },
      {
        market: 'QB_PASSING_YARDS',
        marketName: 'Carson Beck Passing Yards O/U',
        consensusLine: 'Under 275.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.610,
        edgePercentage: 0.075,
        evRoiPct: 14.0,
        recommendation: 'HIT: UNDER 275.5 (Actual 252)',
        brierScoreHistorical: 0.158,
        optimalCalibrationVariance: 0.010,
      },
      {
        market: 'RB_RUSHING_YARDS',
        marketName: 'Trevor Etienne Rushing Yards O/U',
        consensusLine: 'Over 68.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.594,
        edgePercentage: 0.070,
        evRoiPct: 13.3,
        recommendation: 'HIT: OVER 68.5 (Actual 78)',
        brierScoreHistorical: 0.166,
        optimalCalibrationVariance: 0.012,
      },
    ],
    playerProps: [
      {
        id: 'prop-beck-pass',
        playerName: 'Carson Beck',
        team: 'UGA',
        position: 'QB',
        propType: 'QB_PASS_YDS',
        marketLine: 275.5,
        algorithmicProjection: 254.1,
        overProbability: 0.390,
        underProbability: 0.610,
        edgePct: 0.075,
        recommendation: 'UNDER',
        confidenceTier: 'A',
        mathBreakdown: {
          baseRate: 280.0,
          matchupModifier: -28.4,
          weatherModifier: 0.0,
          paceDifferential: +2.5,
        },
      },
    ],
    actualResult: {
      homeScore: 27,
      awayScore: 24,
      actualTotal: 51,
      f5HomeScore: 14,
      f5AwayScore: 10,
      winner: 'UGA 27, ALA 24 (Covered by ALA +4.5)',
      brierLoss: 0.148,
      calibrationDelta: +0.012,
      enginePredictedPick: 'ALA +4.5 Point Spread & Under 54.5 Points',
      enginePredictedProb: 0.598,
      enginePredictedEdge: 0.074,
      consensusLine: 'ALA +4.5 (-110) | Total 54.5 (-110)',
      predictionOutcome: 'WIN',
      engineUpgradesMade: [
        'Dampened 4th-quarter pace variable by -0.028 in one-score SEC conference matchups',
        'Updated Carson Beck passing EPA defensive pressure decay exponent from 0.85 to 0.92',
        'Markov Chain absorbing state transition weights recalibrated (Brier loss 0.148 vs consensus 0.211)',
      ],
      autonomousRefactorSummary: 'Empirical post-mortem validated dog value. Absorbing drive state probabilities upgraded autonomously without collinear redundancy.',
    },
  },

  // CFB GAME 2: TEXAS vs MICHIGAN
  {
    id: 'cfb-tex-mich-004',
    sport: 'CFB',
    homeTeam: {
      code: 'MICH',
      name: 'Michigan Wolverines',
      record: '9-3',
      starterOrQb: 'Alex Orji (Heavy Option / Run Emphasis)',
      rating: 89.4,
    },
    awayTeam: {
      code: 'TEX',
      name: 'Texas Longhorns',
      record: '12-1',
      starterOrQb: 'Quinn Ewers (0.27 EPA/pass, 85.3 QBR)',
      rating: 97.4,
    },
    scheduledTime: '12:00 EST',
    status: 'UPCOMING',
    venue: 'Michigan Stadium, Ann Arbor MI',
    weather: {
      temperatureF: 52,
      windSpeedMph: 8,
      windDirection: 'CALM',
      humidityPct: 54,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 29.98,
    },
    odds: {
      consensusSpread: 7.5, // TEX -7.5 away favorite
      consensusMoneylineHome: +240,
      consensusMoneylineAway: -290,
      consensusTotal: 42.5,
      publicBetPctHome: 32,
      sharpMoneyPctHome: 38,
      lineMovementVelocity: +0.20,
    },
    weights: {
      weatherWeight: 1.10,
      weatherOptimal: 1.10,
      marketOddsWeight: 0.85,
      marketOddsOptimal: 0.85,
      pitchingOrQbWeight: 1.55,
      pitchingOrQbOptimal: 1.55,
      recentFormWeight: 1.15,
      recentFormOptimal: 1.15,
      travelFatigueWeight: 0.90,
      travelFatigueOptimal: 0.90,
    },
    trueProbabilityHome: 0.228,
    consensusImpliedProbabilityHome: 0.294,
    mathematicalEdgeHome: -0.066,
    algorithmicFairMoneyline: {
      home: +338,
      away: -338,
    },
    algorithmicFairSpread: 9.8,
    algorithmicFairTotal: 40.2,
    marketTargets: [
      {
        market: 'WINNER_SPREAD',
        marketName: 'Point Spread Winner',
        consensusLine: 'TEX -7.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.608,
        edgePercentage: 0.084,
        evRoiPct: 16.0,
        recommendation: 'HIGH EDGE: TEX -7.5',
        brierScoreHistorical: 0.160,
        optimalCalibrationVariance: 0.010,
      },
      {
        market: 'TOTAL_POINTS_OU',
        marketName: 'Total Points O/U',
        consensusLine: 'Under 42.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.578,
        edgePercentage: 0.054,
        evRoiPct: 10.3,
        recommendation: 'VALUE: UNDER 42.5',
        brierScoreHistorical: 0.168,
        optimalCalibrationVariance: 0.012,
      },
      {
        market: 'QB_PASSING_YARDS',
        marketName: 'Quinn Ewers Passing Yards O/U',
        consensusLine: 'Over 242.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.618,
        edgePercentage: 0.083,
        evRoiPct: 15.5,
        recommendation: 'HIGH EDGE: OVER 242.5 Yds (Proj 268.4)',
        brierScoreHistorical: 0.172,
        optimalCalibrationVariance: 0.014,
      },
      {
        market: 'WR_RECEIVING_YARDS',
        marketName: 'Isaiah Bond Receiving Yards O/U',
        consensusLine: 'Over 54.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.612,
        edgePercentage: 0.077,
        evRoiPct: 14.4,
        recommendation: 'VALUE: OVER 54.5 Yds',
        brierScoreHistorical: 0.179,
        optimalCalibrationVariance: 0.015,
      },
      {
        market: 'RB_RUSHING_YARDS',
        marketName: 'Kalel Mullings Rushing Yards O/U',
        consensusLine: 'Under 64.5 (-115)',
        consensusImpliedProb: 0.535,
        nexusCalibratedProb: 0.596,
        edgePercentage: 0.061,
        evRoiPct: 11.4,
        recommendation: 'VALUE: UNDER 64.5 Yds (Loaded Box Model)',
        brierScoreHistorical: 0.175,
        optimalCalibrationVariance: 0.011,
      },
      {
        market: 'QUARTER_MONEYLINES',
        marketName: '1st Quarter Moneyline',
        consensusLine: 'TEX -165 / MICH +140',
        consensusImpliedProb: 0.623,
        nexusCalibratedProb: 0.684,
        edgePercentage: 0.061,
        evRoiPct: 10.8,
        recommendation: 'VALUE: TEX 1Q ML',
        brierScoreHistorical: 0.173,
        optimalCalibrationVariance: 0.013,
      },
    ],
    playerProps: [
      {
        id: 'prop-ewers-pass',
        playerName: 'Quinn Ewers',
        team: 'TEX',
        position: 'QB',
        propType: 'QB_PASS_YDS',
        marketLine: 242.5,
        algorithmicProjection: 268.4,
        overProbability: 0.618,
        underProbability: 0.382,
        edgePct: 0.083,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: {
          baseRate: 255.0,
          matchupModifier: +14.2,
          weatherModifier: 0.0,
          paceDifferential: -0.8,
        },
      },
      {
        id: 'prop-bond-rec',
        playerName: 'Isaiah Bond',
        team: 'TEX',
        position: 'WR',
        propType: 'WR_REC_YDS',
        marketLine: 54.5,
        algorithmicProjection: 64.8,
        overProbability: 0.612,
        underProbability: 0.388,
        edgePct: 0.077,
        recommendation: 'OVER',
        confidenceTier: 'A',
        mathBreakdown: {
          baseRate: 56.0,
          matchupModifier: +8.8,
          weatherModifier: 0.0,
          paceDifferential: 0.0,
        },
      },
    ],
  },

  // MLB FINAL GAME: TEXAS RANGERS @ HOUSTON ASTROS
  {
    id: 'mlb-hou-tex-008',
    sport: 'MLB',
    homeTeam: {
      code: 'HOU',
      name: 'Houston Astros',
      record: '85-68',
      starterOrQb: 'Framber Valdez (LHP | 3.12 xFIP, 61.2% GB%)',
      rating: 91.2,
    },
    awayTeam: {
      code: 'TEX',
      name: 'Texas Rangers',
      record: '76-77',
      starterOrQb: 'Nathan Eovaldi (RHP | 3.75 xFIP, 23.4% K%)',
      rating: 85.8,
    },
    scheduledTime: 'FINAL',
    status: 'FINAL',
    venue: 'Daikin Park, Houston TX',
    weather: {
      temperatureF: 73,
      windSpeedMph: 0,
      windDirection: 'CALM',
      humidityPct: 50,
      isDomeOrRetractableClosed: true,
      barometricPressureInHg: 30.00,
    },
    odds: {
      consensusSpread: -1.5,
      consensusMoneylineHome: -150,
      consensusMoneylineAway: +130,
      consensusTotal: 7.5,
      publicBetPctHome: 61,
      sharpMoneyPctHome: 68,
      lineMovementVelocity: +0.12,
    },
    weights: {
      weatherWeight: 1.00,
      weatherOptimal: 1.00,
      marketOddsWeight: 0.85,
      marketOddsOptimal: 0.85,
      pitchingOrQbWeight: 1.50,
      pitchingOrQbOptimal: 1.50,
      recentFormWeight: 1.10,
      recentFormOptimal: 1.10,
      travelFatigueWeight: 0.90,
      travelFatigueOptimal: 0.90,
    },
    trueProbabilityHome: 0.648,
    consensusImpliedProbabilityHome: 0.600,
    mathematicalEdgeHome: 0.048,
    algorithmicFairMoneyline: { home: -184, away: +164 },
    algorithmicFairSpread: -1.75,
    algorithmicFairTotal: 7.10,
    marketTargets: [
      {
        market: 'F5_MONEYLINE',
        marketName: 'First 5 Innings Moneyline',
        consensusLine: 'HOU F5 -0.5 (-120)',
        consensusImpliedProb: 0.545,
        nexusCalibratedProb: 0.635,
        edgePercentage: 0.090,
        evRoiPct: 15.2,
        recommendation: 'STRONG VALUE: HOU F5 -0.5 (Groundball Index)',
        brierScoreHistorical: 0.155,
        optimalCalibrationVariance: 0.009,
      },
      {
        market: 'PITCHER_STRIKEOUTS',
        marketName: 'Framber Valdez Strikeouts O/U',
        consensusLine: 'Over 6.5 (+105)',
        consensusImpliedProb: 0.488,
        nexusCalibratedProb: 0.572,
        edgePercentage: 0.084,
        evRoiPct: 17.2,
        recommendation: 'VALUE: OVER 6.5 Ks (Actual 8 Ks)',
        brierScoreHistorical: 0.161,
        optimalCalibrationVariance: 0.011,
      },
    ],
    playerProps: [
      {
        id: 'prop-valdez-k',
        playerName: 'Framber Valdez',
        team: 'HOU',
        position: 'SP',
        propType: 'PITCHER_K',
        marketLine: 6.5,
        algorithmicProjection: 7.6,
        overProbability: 0.572,
        underProbability: 0.428,
        edgePct: 0.084,
        recommendation: 'OVER',
        confidenceTier: 'A',
        mathBreakdown: { baseRate: 6.8, matchupModifier: +0.8, weatherModifier: 0.0, paceDifferential: 0.0 },
      },
    ],
    actualResult: {
      homeScore: 6,
      awayScore: 2,
      actualTotal: 8,
      f5HomeScore: 4,
      f5AwayScore: 1,
      winner: 'HOU 6, TEX 2 (HOU Won & Covered F5 -0.5)',
      brierLoss: 0.124,
      calibrationDelta: +0.008,
      enginePredictedPick: 'HOU F5 -0.5 (-120) & Valdez Over 6.5 Ks',
      enginePredictedProb: 0.635,
      enginePredictedEdge: 0.090,
      consensusLine: 'HOU F5 -0.5 (-120) | Total 7.5',
      predictionOutcome: 'WIN',
      engineUpgradesMade: [
        'Framber Valdez sinker ground-ball rate weight increased from 1.35 to 1.42 in dome environment',
        'Updated dynamic offensive modifier for HOU vs AL West starting pitching to 1.064x',
        'Automated F5 Poisson run expectancy validated; Brier error reduced to 0.124 without overfitting',
      ],
      autonomousRefactorSummary: 'F5 model accurately forecasted early game dominance. Autonomous groundball multiplier reinforced across retractable dome settings.',
    },
  },

  // NFL FINAL GAME: GREEN BAY PACKERS @ DETROIT LIONS
  {
    id: 'nfl-det-gb-009',
    sport: 'NFL',
    homeTeam: {
      code: 'DET',
      name: 'Detroit Lions',
      record: '12-3',
      starterOrQb: 'Jared Goff (0.26 EPA/pass, 74.2% Clean Pocket)',
      rating: 95.8,
    },
    awayTeam: {
      code: 'GB',
      name: 'Green Bay Packers',
      record: '10-5',
      starterOrQb: 'Jordan Love (0.21 EPA/pass, 8.4 Air Yds)',
      rating: 91.5,
    },
    scheduledTime: 'FINAL',
    status: 'FINAL',
    venue: 'Ford Field, Detroit MI',
    weather: {
      temperatureF: 70,
      windSpeedMph: 0,
      windDirection: 'CALM',
      humidityPct: 45,
      isDomeOrRetractableClosed: true,
      barometricPressureInHg: 29.95,
    },
    odds: {
      consensusSpread: -3.5,
      consensusMoneylineHome: -180,
      consensusMoneylineAway: +155,
      consensusTotal: 51.5,
      publicBetPctHome: 70,
      sharpMoneyPctHome: 62,
      lineMovementVelocity: +0.18,
    },
    weights: {
      weatherWeight: 1.00,
      weatherOptimal: 1.00,
      marketOddsWeight: 0.80,
      marketOddsOptimal: 0.80,
      pitchingOrQbWeight: 1.55,
      pitchingOrQbOptimal: 1.55,
      recentFormWeight: 1.15,
      recentFormOptimal: 1.15,
      travelFatigueWeight: 0.90,
      travelFatigueOptimal: 0.90,
    },
    trueProbabilityHome: 0.675,
    consensusImpliedProbabilityHome: 0.643,
    mathematicalEdgeHome: 0.032,
    algorithmicFairMoneyline: { home: -208, away: +188 },
    algorithmicFairSpread: -5.2,
    algorithmicFairTotal: 53.8,
    marketTargets: [
      {
        market: 'WINNER_SPREAD',
        marketName: 'Point Spread Winner',
        consensusLine: 'DET -3.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.622,
        edgePercentage: 0.098,
        evRoiPct: 18.7,
        recommendation: 'STRONG EDGE: DET -3.5 (Dixon-Coles + EPA Model)',
        brierScoreHistorical: 0.158,
        optimalCalibrationVariance: 0.009,
      },
    ],
    playerProps: [
      {
        id: 'prop-goff-pass',
        playerName: 'Jared Goff',
        team: 'DET',
        position: 'QB',
        propType: 'QB_PASS_YDS',
        marketLine: 268.5,
        algorithmicProjection: 289.4,
        overProbability: 0.628,
        underProbability: 0.372,
        edgePct: 0.093,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: { baseRate: 265.0, matchupModifier: +18.4, weatherModifier: +6.0, paceDifferential: 0.0 },
      },
    ],
    actualResult: {
      homeScore: 31,
      awayScore: 20,
      actualTotal: 51,
      f5HomeScore: 17,
      f5AwayScore: 10,
      winner: 'DET 31, GB 20 (DET Covered -3.5 by 7.5 pts)',
      brierLoss: 0.138,
      calibrationDelta: +0.010,
      enginePredictedPick: 'DET -3.5 Point Spread (-110) & Goff Over 268.5 Yds',
      enginePredictedProb: 0.622,
      enginePredictedEdge: 0.098,
      consensusLine: 'DET -3.5 (-110) | Total 51.5',
      predictionOutcome: 'WIN',
      engineUpgradesMade: [
        'Upgraded Detroit indoor EPA/pass efficiency coefficient from 0.26 to 0.28',
        'Refactored Dixon-Coles rho parameter for indoor divisional rivalries from 0.13 to 0.14',
        'Reinforced clean pocket play-action multiplier in NFL Brain SOTA pipeline',
      ],
      autonomousRefactorSummary: 'Clean cover by Detroit. SOTA pipeline refined indoor play-action weights without compounding errors.',
    },
  },

  // NFL LIVE GAME: DALLAS COWBOYS @ PHILADELPHIA EAGLES
  {
    id: 'nfl-phi-dal-005',
    sport: 'NFL',
    homeTeam: {
      code: 'PHI',
      name: 'Philadelphia Eagles',
      record: '10-4',
      starterOrQb: 'Jalen Hurts (0.23 EPA/play, Tush-Push 92%)',
      rating: 94.2,
    },
    awayTeam: {
      code: 'DAL',
      name: 'Dallas Cowboys',
      record: '8-6',
      starterOrQb: 'Dak Prescott (0.22 EPA/pass, 69.4% Comp%)',
      rating: 90.1,
    },
    scheduledTime: 'LIVE',
    status: 'LIVE',
    venue: 'Lincoln Financial Field, Philadelphia PA',
    weather: {
      temperatureF: 44,
      windSpeedMph: 11,
      windDirection: 'CROSS_L_TO_R',
      humidityPct: 60,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 30.08,
    },
    odds: {
      consensusSpread: -4.5,
      consensusMoneylineHome: -210,
      consensusMoneylineAway: +175,
      consensusTotal: 46.5,
      publicBetPctHome: 68,
      sharpMoneyPctHome: 54,
      lineMovementVelocity: -0.08,
    },
    weights: {
      weatherWeight: 1.15,
      weatherOptimal: 1.15,
      marketOddsWeight: 0.80,
      marketOddsOptimal: 0.80,
      pitchingOrQbWeight: 1.50,
      pitchingOrQbOptimal: 1.50,
      recentFormWeight: 1.10,
      recentFormOptimal: 1.10,
      travelFatigueWeight: 0.90,
      travelFatigueOptimal: 0.90,
    },
    trueProbabilityHome: 0.718,
    consensusImpliedProbabilityHome: 0.677,
    mathematicalEdgeHome: 0.041,
    algorithmicFairMoneyline: { home: -255, away: +225 },
    algorithmicFairSpread: -5.8,
    algorithmicFairTotal: 43.8,
    marketTargets: [
      {
        market: 'WINNER_SPREAD',
        marketName: 'Point Spread Winner',
        consensusLine: 'PHI -4.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.605,
        edgePercentage: 0.081,
        evRoiPct: 15.4,
        recommendation: 'VALUE: PHI -4.5 (Rushing EPA)',
        brierScoreHistorical: 0.165,
        optimalCalibrationVariance: 0.010,
      },
    ],
    playerProps: [
      {
        id: 'prop-hurts-rush',
        playerName: 'Jalen Hurts',
        team: 'PHI',
        position: 'QB',
        propType: 'RB_RUSH_YDS',
        marketLine: 42.5,
        algorithmicProjection: 51.2,
        overProbability: 0.635,
        underProbability: 0.365,
        edgePct: 0.100,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: { baseRate: 40.0, matchupModifier: +11.2, weatherModifier: 0.0, paceDifferential: 0.0 },
      },
    ],
    liveTelemetry: {
      quarterOrInning: 'Q3',
      clockOrOuts: '8:42',
      homeScore: 21,
      awayScore: 13,
      possessionOrBatting: 'PHI (2nd & 4 at DAL 38)',
      currentDownOrCount: '2nd & 4',
      winProbabilityInGame: 0.832,
    },
  },

  // MLB UPCOMING: SAN FRANCISCO GIANTS @ LOS ANGELES DODGERS
  {
    id: 'mlb-lad-sf-007',
    sport: 'MLB',
    homeTeam: {
      code: 'LAD',
      name: 'Los Angeles Dodgers',
      record: '92-59',
      starterOrQb: 'Tyler Glasnow (RHP | 2.58 xFIP, 34.8% K%)',
      rating: 96.8,
    },
    awayTeam: {
      code: 'SF',
      name: 'San Francisco Giants',
      record: '77-74',
      starterOrQb: 'Logan Webb (RHP | 3.22 xFIP, 58.6% GB%)',
      rating: 88.5,
    },
    scheduledTime: '22:10 EDT',
    status: 'UPCOMING',
    venue: 'Dodger Stadium, Los Angeles CA',
    weather: {
      temperatureF: 76,
      windSpeedMph: 7,
      windDirection: 'OUT_TO_CF',
      humidityPct: 52,
      isDomeOrRetractableClosed: false,
      barometricPressureInHg: 29.92,
    },
    odds: {
      consensusSpread: -1.5,
      consensusMoneylineHome: -175,
      consensusMoneylineAway: +150,
      consensusTotal: 7.5,
      publicBetPctHome: 74,
      sharpMoneyPctHome: 58,
      lineMovementVelocity: +0.15,
    },
    weights: {
      weatherWeight: 1.20,
      weatherOptimal: 1.20,
      marketOddsWeight: 0.80,
      marketOddsOptimal: 0.80,
      pitchingOrQbWeight: 1.60,
      pitchingOrQbOptimal: 1.60,
      recentFormWeight: 1.10,
      recentFormOptimal: 1.10,
      travelFatigueWeight: 0.85,
      travelFatigueOptimal: 0.85,
    },
    trueProbabilityHome: 0.692,
    consensusImpliedProbabilityHome: 0.636,
    mathematicalEdgeHome: 0.056,
    algorithmicFairMoneyline: { home: -225, away: +202 },
    algorithmicFairSpread: -1.9,
    algorithmicFairTotal: 7.8,
    marketTargets: [
      {
        market: 'F5_MONEYLINE',
        marketName: 'First 5 Innings Moneyline',
        consensusLine: 'LAD F5 -0.5 (-140)',
        consensusImpliedProb: 0.583,
        nexusCalibratedProb: 0.668,
        edgePercentage: 0.085,
        evRoiPct: 14.6,
        recommendation: 'HIGH EDGE: LAD F5 -0.5 (Glasnow K-Rate)',
        brierScoreHistorical: 0.152,
        optimalCalibrationVariance: 0.008,
      },
      {
        market: 'PITCHER_STRIKEOUTS',
        marketName: 'Tyler Glasnow Strikeouts O/U',
        consensusLine: 'Over 7.5 (-110)',
        consensusImpliedProb: 0.524,
        nexusCalibratedProb: 0.625,
        edgePercentage: 0.101,
        evRoiPct: 19.3,
        recommendation: 'TOP PICK: OVER 7.5 Ks (Proj 8.9 Ks)',
        brierScoreHistorical: 0.159,
        optimalCalibrationVariance: 0.010,
      },
    ],
    playerProps: [
      {
        id: 'prop-glasnow-k',
        playerName: 'Tyler Glasnow',
        team: 'LAD',
        position: 'SP',
        propType: 'PITCHER_K',
        marketLine: 7.5,
        algorithmicProjection: 8.9,
        overProbability: 0.625,
        underProbability: 0.375,
        edgePct: 0.101,
        recommendation: 'OVER',
        confidenceTier: 'A+',
        mathBreakdown: { baseRate: 7.8, matchupModifier: +1.1, weatherModifier: 0.0, paceDifferential: 0.0 },
      },
    ],
  },
];

export const mockGameEvents: StructuredGameEvent[] = [
  {
    id: 'evt-001',
    gameId: 'mlb-nyy-bos-001',
    sport: 'MLB',
    timestamp: '2026-09-13T19:42:15Z',
    gameClock: 'Top 4th, 1 Out',
    period: '4th Inning',
    eventDescription: 'Gerrit Cole strikes out Rafael Devers swinging on an 89mph slider low and away.',
    dataVariablesCaptured: {
      playType: 'STRIKEOUT_SWINGING',
      yardsGainedOrResult: 'K (Out 2)',
      deltaWinProbability: +0.038,
      exitVelocityOrPassRushSpeed: 0,
      launchAngleOrAirYards: 0,
      pressureIndex: 0.88,
    },
    mathematicalImpact: 'Cole strikeout prop counter increments to 7 (Projection: 8.65). NYY Win Prob +3.8% to 80.2%.',
    factualStatus: 'VERIFIED_EMPIRICAL',
  },
  {
    id: 'evt-002',
    gameId: 'mlb-nyy-bos-001',
    sport: 'MLB',
    timestamp: '2026-09-13T19:35:02Z',
    gameClock: 'Top 4th, 0 Out',
    period: '4th Inning',
    eventDescription: 'Jarren Duran singles on a sharp grounder to right fielder Juan Soto. Exit velo 104.2 mph.',
    dataVariablesCaptured: {
      playType: 'SINGLE_HARD_GROUND',
      yardsGainedOrResult: '1B (Runner on 1st)',
      deltaWinProbability: -0.042,
      exitVelocityOrPassRushSpeed: 104.2,
      launchAngleOrAirYards: 6.0,
      pressureIndex: 0.64,
    },
    mathematicalImpact: 'Hard-hit contact frequency adjusted for Cole pitch count (62 pitches). Win Prob shifts to 76.4%.',
    factualStatus: 'VERIFIED_EMPIRICAL',
  },
  {
    id: 'evt-003',
    gameId: 'mlb-nyy-bos-001',
    sport: 'MLB',
    timestamp: '2026-09-13T19:18:44Z',
    gameClock: 'Bottom 3rd, 2 Outs',
    period: '3rd Inning',
    eventDescription: 'Aaron Judge hits a 2-run home run (428 ft to CF) off Brayan Bello. Exit velo 112.8 mph, 28° launch angle.',
    dataVariablesCaptured: {
      playType: 'HOME_RUN_2R',
      yardsGainedOrResult: 'HR (2 RBI)',
      deltaWinProbability: +0.214,
      exitVelocityOrPassRushSpeed: 112.8,
      launchAngleOrAirYards: 28.0,
      pressureIndex: 0.94,
    },
    mathematicalImpact: 'Trajectory physics validates 14mph tailwind model (+18 ft wind assist). NYY F5 Lead established 3-1.',
    factualStatus: 'VERIFIED_EMPIRICAL',
  },
  {
    id: 'evt-004',
    gameId: 'nfl-kc-bal-002',
    sport: 'NFL',
    timestamp: '2026-09-13T18:55:00Z',
    gameClock: 'Pre-Game Ingestion',
    period: 'Telemetry Check',
    eventDescription: 'Automated wind sensor calibration at Arrowhead Stadium: Gusts 18mph crossfield, barometric 30.12 inHg.',
    dataVariablesCaptured: {
      playType: 'ENVIRONMENTAL_SENSOR',
      yardsGainedOrResult: '16-18mph Cross',
      deltaWinProbability: 0.0,
      pressureIndex: 0.72,
    },
    mathematicalImpact: 'Air friction coefficient applied to deep ball trajectory models; passing total expectation reduced by 8.4 yards.',
    factualStatus: 'VERIFIED_EMPIRICAL',
  },
];

export const mockCalibrationMetrics: Record<string, CalibrationMetrics> = {
  ALL: {
    sport: 'ALL',
    totalPredictionsLogged: 1420,
    overallBrierScore: 0.1712, // Lower than benchmark consensus (0.2105)
    benchmarkConsensusBrier: 0.2105,
    brierImprovementPct: 18.67,
    expectedCalibrationError: 0.0384, // Under 0.05 is elite
    maxCalibrationError: 0.0621,
    lastBacktestedAt: '2026-09-13T16:00:00Z',
    backtestType: 'CRON_AUTOMATED',
    degradationStatus: 'OPTIMAL',
    reliabilityBins: [
      { binRange: '0.10 - 0.20', predictedMeanProb: 0.152, empiricalWinRate: 0.149, sampleCount: 118, binError: 0.003 },
      { binRange: '0.20 - 0.30', predictedMeanProb: 0.254, empiricalWinRate: 0.261, sampleCount: 142, binError: 0.007 },
      { binRange: '0.30 - 0.40', predictedMeanProb: 0.351, empiricalWinRate: 0.344, sampleCount: 184, binError: 0.007 },
      { binRange: '0.40 - 0.50', predictedMeanProb: 0.453, empiricalWinRate: 0.462, sampleCount: 226, binError: 0.009 },
      { binRange: '0.50 - 0.60', predictedMeanProb: 0.551, empiricalWinRate: 0.548, sampleCount: 265, binError: 0.003 },
      { binRange: '0.60 - 0.70', predictedMeanProb: 0.648, empiricalWinRate: 0.655, sampleCount: 210, binError: 0.007 },
      { binRange: '0.70 - 0.80', predictedMeanProb: 0.749, empiricalWinRate: 0.738, sampleCount: 168, binError: 0.011 },
      { binRange: '0.80 - 0.90', predictedMeanProb: 0.844, empiricalWinRate: 0.852, sampleCount: 107, binError: 0.008 },
    ],
  },
  MLB: {
    sport: 'MLB',
    totalPredictionsLogged: 640,
    overallBrierScore: 0.1742,
    benchmarkConsensusBrier: 0.2180,
    brierImprovementPct: 20.09,
    expectedCalibrationError: 0.0362,
    maxCalibrationError: 0.0588,
    lastBacktestedAt: '2026-09-13T16:00:00Z',
    backtestType: 'CRON_AUTOMATED',
    degradationStatus: 'OPTIMAL',
    reliabilityBins: [
      { binRange: '0.20 - 0.35', predictedMeanProb: 0.282, empiricalWinRate: 0.279, sampleCount: 110, binError: 0.003 },
      { binRange: '0.35 - 0.50', predictedMeanProb: 0.428, empiricalWinRate: 0.435, sampleCount: 195, binError: 0.007 },
      { binRange: '0.50 - 0.65', predictedMeanProb: 0.574, empiricalWinRate: 0.569, sampleCount: 215, binError: 0.005 },
      { binRange: '0.65 - 0.80', predictedMeanProb: 0.721, empiricalWinRate: 0.730, sampleCount: 120, binError: 0.009 },
    ],
  },
  NFL: {
    sport: 'NFL',
    totalPredictionsLogged: 460,
    overallBrierScore: 0.1685,
    benchmarkConsensusBrier: 0.2045,
    brierImprovementPct: 17.60,
    expectedCalibrationError: 0.0398,
    maxCalibrationError: 0.0645,
    lastBacktestedAt: '2026-09-13T16:00:00Z',
    backtestType: 'CRON_AUTOMATED',
    degradationStatus: 'OPTIMAL',
    reliabilityBins: [
      { binRange: '0.20 - 0.35', predictedMeanProb: 0.275, empiricalWinRate: 0.282, sampleCount: 85, binError: 0.007 },
      { binRange: '0.35 - 0.50', predictedMeanProb: 0.431, empiricalWinRate: 0.424, sampleCount: 140, binError: 0.007 },
      { binRange: '0.50 - 0.65', predictedMeanProb: 0.569, empiricalWinRate: 0.575, sampleCount: 155, binError: 0.006 },
      { binRange: '0.65 - 0.80', predictedMeanProb: 0.728, empiricalWinRate: 0.719, sampleCount: 80, binError: 0.009 },
    ],
  },
  CFB: {
    sport: 'CFB',
    totalPredictionsLogged: 320,
    overallBrierScore: 0.1698,
    benchmarkConsensusBrier: 0.2078,
    brierImprovementPct: 18.28,
    expectedCalibrationError: 0.0410,
    maxCalibrationError: 0.0652,
    lastBacktestedAt: '2026-09-13T16:00:00Z',
    backtestType: 'CRON_AUTOMATED',
    degradationStatus: 'OPTIMAL',
    reliabilityBins: [
      { binRange: '0.20 - 0.35', predictedMeanProb: 0.278, empiricalWinRate: 0.285, sampleCount: 55, binError: 0.007 },
      { binRange: '0.35 - 0.50', predictedMeanProb: 0.429, empiricalWinRate: 0.438, sampleCount: 98, binError: 0.009 },
      { binRange: '0.50 - 0.65', predictedMeanProb: 0.572, empiricalWinRate: 0.565, sampleCount: 112, binError: 0.007 },
      { binRange: '0.65 - 0.80', predictedMeanProb: 0.732, empiricalWinRate: 0.724, sampleCount: 55, binError: 0.008 },
    ],
  },
};

export const mockRefactoringLogs: SelfRefactoringLog[] = [
  {
    id: 'refactor-003',
    timestamp: '2026-09-12T04:12:08Z',
    sport: 'MLB',
    triggerReason: 'ECE in High-Wind Bins exceeded 0.052 threshold (Observed 0.058). Automated tuning of weather decay exponent.',
    previousParameters: {
      brierThreshold: 0.200,
      consensusDivergenceDampener: 0.82,
      weatherDecayExponent: 1.15,
    },
    refactoredParameters: {
      brierThreshold: 0.195,
      consensusDivergenceDampener: 0.85,
      weatherDecayExponent: 1.22,
    },
    redundancyCheckPassed: true,
    status: 'DEPLOYED_AUTOMATICALLY',
  },
  {
    id: 'refactor-002',
    timestamp: '2026-09-08T02:00:44Z',
    sport: 'NFL',
    triggerReason: 'Redundancy check detected compounding error in road favorite spreads under -6.5 pts. Refactored public bias deconstruction multiplier.',
    previousParameters: {
      brierThreshold: 0.210,
      consensusDivergenceDampener: 0.78,
      weatherDecayExponent: 1.10,
    },
    refactoredParameters: {
      brierThreshold: 0.205,
      consensusDivergenceDampener: 0.84,
      weatherDecayExponent: 1.14,
    },
    redundancyCheckPassed: true,
    status: 'DEPLOYED_AUTOMATICALLY',
  },
];

export const mockFeatureDiscovery: ElasticFeatureDiscovery[] = [
  {
    id: 'feat-001',
    sport: 'MLB',
    variableName: 'pitcher_spin_decay_t4',
    category: 'BIOMECHANIC',
    discoveredAt: '2026-09-10',
    empiricalCorrelationDelta: +0.068,
    testingSampleCount: 840,
    pValSignificance: 0.0012,
    deploymentStage: 'ACTIVE_WEIGHT',
  },
  {
    id: 'feat-002',
    sport: 'NFL',
    variableName: 'oline_stunt_pressure_rate_vs_3man',
    category: 'TELEMETRY',
    discoveredAt: '2026-09-11',
    empiricalCorrelationDelta: +0.084,
    testingSampleCount: 520,
    pValSignificance: 0.0004,
    deploymentStage: 'ACTIVE_WEIGHT',
  },
  {
    id: 'feat-003',
    sport: 'CFB',
    variableName: 'elevation_adjusted_quarter_pace_index',
    category: 'MICROCLIMATE',
    discoveredAt: '2026-09-12',
    empiricalCorrelationDelta: +0.045,
    testingSampleCount: 310,
    pValSignificance: 0.0140,
    deploymentStage: 'BACKTESTING_VALIDATION',
  },
];

// Production Supabase SQL Schema definition
export const supabaseCoreSchemaSql = `-- ==============================================================================
-- THE PREDICTION NEXUS: SUPABASE POSTGRESQL PRODUCTION DDL
-- Core Mandate: The Geter Principle (Zero-Fabrication & Strict Factual Grounding)
-- ==============================================================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. SPORT TYPES ENUM
DO $$ BEGIN
  CREATE TYPE sport_league AS ENUM ('MLB', 'NFL', 'CFB');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE match_status AS ENUM ('UPCOMING', 'LIVE', 'FINAL', 'POSTPONED');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. GAMES & FIXTURES TABLE
CREATE TABLE IF NOT EXISTS public.nexus_games (
  id VARCHAR(64) PRIMARY KEY,
  sport sport_league NOT NULL,
  home_team_code VARCHAR(10) NOT NULL,
  home_team_name VARCHAR(100) NOT NULL,
  away_team_code VARCHAR(10) NOT NULL,
  away_team_name VARCHAR(100) NOT NULL,
  scheduled_time TIMESTAMPTZ NOT NULL,
  status match_status NOT NULL DEFAULT 'UPCOMING',
  venue VARCHAR(150) NOT NULL,
  weather_temp_f NUMERIC(5,2),
  weather_wind_mph NUMERIC(5,2),
  weather_wind_dir VARCHAR(30),
  is_dome BOOLEAN DEFAULT FALSE,
  consensus_spread NUMERIC(5,2),
  consensus_total NUMERIC(5,2),
  consensus_ml_home INT,
  consensus_ml_away INT,
  public_bet_pct_home NUMERIC(5,2),
  sharp_money_pct_home NUMERIC(5,2),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PRE-MATCH ALGORITHMIC PREDICTIONS (FROZEN BEFORE MATCH START)
CREATE TABLE IF NOT EXISTS public.nexus_predictions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id VARCHAR(64) REFERENCES public.nexus_games(id) ON DELETE CASCADE,
  sport sport_league NOT NULL,
  market_type VARCHAR(50) NOT NULL,
  target_description VARCHAR(150) NOT NULL,
  consensus_implied_prob NUMERIC(6,4) NOT NULL,
  nexus_calibrated_prob NUMERIC(6,4) NOT NULL,
  mathematical_edge NUMERIC(6,4) NOT NULL,
  fair_odds VARCHAR(20) NOT NULL,
  market_odds VARCHAR(20) NOT NULL,
  recommendation VARCHAR(100) NOT NULL,
  weather_weight NUMERIC(5,3) NOT NULL,
  market_odds_weight NUMERIC(5,3) NOT NULL,
  qb_or_pitching_weight NUMERIC(5,3) NOT NULL,
  recent_form_weight NUMERIC(5,3) NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  frozen_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. POST-MORTEM ACTUAL OUTCOMES (STRICTLY SEPARATED)
CREATE TABLE IF NOT EXISTS public.nexus_post_mortems (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id VARCHAR(64) REFERENCES public.nexus_games(id) ON DELETE CASCADE,
  prediction_id UUID REFERENCES public.nexus_predictions(id) ON DELETE CASCADE,
  actual_outcome INT NOT NULL, -- 1 if event occurred, 0 if not
  actual_score_home INT NOT NULL,
  actual_score_away INT NOT NULL,
  brier_score_loss NUMERIC(7,5) NOT NULL, -- (prob - actual)^2
  calibration_variance NUMERIC(7,5) NOT NULL,
  verified_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. BRIER SCORE & ECE CALIBRATION TRACKING
CREATE TABLE IF NOT EXISTS public.nexus_calibration_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport sport_league NOT NULL,
  evaluation_date TIMESTAMPTZ DEFAULT NOW(),
  brier_score NUMERIC(7,5) NOT NULL,
  expected_calibration_error NUMERIC(7,5) NOT NULL,
  max_calibration_error NUMERIC(7,5) NOT NULL,
  sample_size INT NOT NULL,
  backtest_type VARCHAR(30) NOT NULL DEFAULT 'CRON_AUTOMATED',
  degradation_flag BOOLEAN DEFAULT FALSE
);

-- 6. STATEFUL WEIGHT TRACKING & SELF-REFACTORING AUDIT LOG
CREATE TABLE IF NOT EXISTS public.nexus_stateful_weights (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sport sport_league NOT NULL,
  parameter_name VARCHAR(100) NOT NULL,
  current_weight NUMERIC(7,4) NOT NULL,
  optimal_baseline NUMERIC(7,4) NOT NULL,
  redundancy_hash VARCHAR(64) NOT NULL,
  last_modified_by VARCHAR(50) DEFAULT 'AUTO_REFACTOR_ENGINE',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. STRUCTURED REAL-TIME EVENT STREAM (NO FABRICATION)
CREATE TABLE IF NOT EXISTS public.nexus_game_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  game_id VARCHAR(64) REFERENCES public.nexus_games(id) ON DELETE CASCADE,
  period_label VARCHAR(30) NOT NULL,
  game_clock VARCHAR(30) NOT NULL,
  event_description TEXT NOT NULL,
  exit_velocity NUMERIC(5,2),
  launch_angle NUMERIC(5,2),
  pass_rush_speed NUMERIC(5,2),
  pressure_index NUMERIC(5,2),
  delta_win_prob NUMERIC(6,4) NOT NULL,
  verified_empirical BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS POLICIES
ALTER TABLE public.nexus_games ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_predictions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_post_mortems ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_calibration_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_stateful_weights ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.nexus_game_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated read on games" ON public.nexus_games FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on predictions" ON public.nexus_predictions FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on calibration" ON public.nexus_calibration_logs FOR SELECT USING (true);
CREATE POLICY "Allow authenticated read on live events" ON public.nexus_game_events FOR SELECT USING (true);
`;

// Isolated Python Prediction Engine Code (MLB)
export const pythonMlbEngineCode = `"""
THE PREDICTION NEXUS - ISOLATED PYTHON ENGINE: MLB
The Geter Principle: Zero-Fabrication, Consensus Bias Deconstruction, Brier & ECE Validation.
Targets: F5 Moneyline, Pitcher Strikeouts, Total Over/Under, Team Totals, Full Game ML.
"""
import math
import numpy as np
from typing import Dict, Any, List

class MlbPredictionEngine:
    def __init__(self):
        # Calibrated baseline parameters
        self.brier_threshold = 0.195
        self.ece_target = 0.040
        self.consensus_deconstruction_factor = 0.85
        self.wind_density_exponent = 1.22

    def deconstruct_consensus_bias(self, consensus_prob: float, public_pct: float, sharp_pct: float) -> float:
        """
        Bypasses the 'Ego Engine' of public lines.
        Extracts sharp sentiment and dampens public bandwagon line distortion.
        """
        public_bias_delta = (public_pct - 0.50)
        sharp_divergence = (sharp_pct - public_pct)
        
        # Mathematical correction
        corrected_prob = consensus_prob - (public_bias_delta * 0.08) + (sharp_divergence * 0.05)
        return float(np.clip(corrected_prob, 0.05, 0.95))

    def calculate_f5_probability(self, home_sp_xfip: float, away_sp_xfip: float, home_park_factor: float) -> float:
        """
        Calculates First 5 Innings (F5) win probability based on starter xFIP & park factor.
        """
        starter_delta = away_sp_xfip - home_sp_xfip
        log_odds = (starter_delta * 0.42) + ((home_park_factor - 1.0) * 0.25)
        prob = 1.0 / (1.0 + math.exp(-log_odds))
        return float(np.clip(prob, 0.20, 0.85))

    def project_pitcher_strikeouts(self, base_k_per_9: float, opponent_k_pct: float, temp_f: float) -> Dict[str, Any]:
        """
        Projects Pitcher Strikeout distribution under environmental conditions.
        """
        temp_modifier = 1.0 + ((75.0 - temp_f) * 0.002) # Cold increases whiff efficiency slightly
        expected_k = (base_k_per_9 * (opponent_k_pct / 0.22)) * temp_modifier
        
        # Poisson distribution approximation for K line 7.5
        line = 7.5
        over_prob = 1.0 - sum([(expected_k**k * math.exp(-expected_k)) / math.factorial(k) for k in range(int(math.ceil(line)))])
        return {
            "projected_k": round(expected_k, 2),
            "line": line,
            "over_prob": round(over_prob, 4),
            "under_prob": round(1.0 - over_prob, 4)
        }

    def compute_brier_and_ece(self, predictions: List[float], actuals: List[int]) -> Dict[str, float]:
        """
        Strict empirical Brier Score and Expected Calibration Error (ECE) measurement.
        """
        n = len(predictions)
        if n == 0:
            return {"brier_score": 0.0, "ece": 0.0}
        
        # Brier Score = (1/N) * sum((prob - actual)^2)
        brier = float(np.mean([(p - y)**2 for p, y in zip(predictions, actuals)]))
        
        # ECE with 10 bins
        bins = np.linspace(0.0, 1.0, 11)
        ece = 0.0
        for i in range(10):
            idx = [j for j, p in enumerate(predictions) if bins[i] <= p < bins[i+1]]
            if len(idx) > 0:
                bin_acc = np.mean([actuals[j] for j in idx])
                bin_conf = np.mean([predictions[j] for j in idx])
                ece += (len(idx) / n) * abs(bin_acc - bin_conf)

        return {
            "brier_score": round(brier, 5),
            "ece": round(ece, 5)
        }
`;

// Isolated Python Prediction Engine Code (NFL / CFB)
export const pythonFootballEngineCode = `"""
THE PREDICTION NEXUS - ISOLATED PYTHON ENGINE: NFL & CFB
The Geter Principle: Zero-Fabrication, EPA/play Integration, Dual Backtesting.
Targets: Winner spread, Total O/U, QB pass yds, WR rec yds, RB rush yds, Quarter MLs.
"""
import math
import numpy as np
from typing import Dict, Any, List

class FootballPredictionEngine:
    def __init__(self, league: str = "NFL"):
        self.league = league
        self.home_field_advantage = 1.85 if league == "NFL" else 2.65

    def calculate_fair_spread(self, home_epa: float, away_epa: float, weather_wind: float) -> float:
        """
        Determines empirical point spread from play-by-play Expected Points Added (EPA).
        """
        epa_differential = home_epa - away_epa
        # High wind dampens point spreads and compresses passing efficiency
        wind_damping = 1.0 - (max(0.0, weather_wind - 12.0) * 0.015)
        spread = -((epa_differential * 24.5) + self.home_field_advantage) * wind_damping
        return round(float(spread), 1)

    def calculate_totals_under_weather(self, base_total: float, temp_f: float, wind_mph: float, is_dome: bool) -> float:
        if is_dome:
            return base_total
        
        cold_penalty = max(0.0, (45.0 - temp_f) * 0.08)
        wind_penalty = max(0.0, (wind_mph - 10.0) * 0.35)
        return round(base_total - cold_penalty - wind_penalty, 1)

    def project_player_props(self, player_type: str, baseline: float, matchup_factor: float, wind_mph: float) -> Dict[str, Any]:
        if player_type == "QB_PASS":
            wind_suppression = max(0.0, (wind_mph - 12.0) * 1.8)
            projection = round(baseline + matchup_factor - wind_suppression, 1)
        elif player_type == "RB_RUSH":
            # High wind increases ground game volume
            wind_boost = max(0.0, (wind_mph - 12.0) * 0.7)
            projection = round(baseline + matchup_factor + wind_boost, 1)
        else: # WR_REC
            wind_suppression = max(0.0, (wind_mph - 12.0) * 0.9)
            projection = round(baseline + matchup_factor - wind_suppression, 1)
            
        return {
            "type": player_type,
            "projected_stat": projection,
            "wind_impact": round(wind_mph, 1)
        }
`;

// GitHub Actions scrape.yml Workflow definition
export const githubScrapeWorkflowYml = `name: Nexus Scheduled Data Ingestion Pipeline

on:
  schedule:
    # Hourly ingestion for upcoming matches and lines
    - cron: '0 * * * *'
    # Ingestion every 10 minutes for active live matches
    - cron: '*/10 * * * *'
  workflow_dispatch:

jobs:
  ingest-sports-variables:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Monorepo
        uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Open-Source Dependencies
        run: |
          pip install httpx beautifulsoup4 pandas numpy pydantic psycopg2-binary pybaseball

      - name: Execute Zero-Fabrication Ingestion Pipeline
        env:
          SUPABASE_DB_URL: \${{ secrets.SUPABASE_DB_URL }}
          INGEST_MODE: 'HOURLY_AND_LIVE'
        run: |
          python backend/engines/scrape_pipeline.py

      - name: Trigger Automated Calibration Backtest & Redundancy Check
        env:
          SUPABASE_DB_URL: \${{ secrets.SUPABASE_DB_URL }}
        run: |
          python backend/engines/backtest_runner.py --cron-mode
`;
