export type SportType = 'MLB' | 'NFL' | 'CFB' | 'TABLE_TENNIS';

export type MlbMarket = 
  | 'F5_MONEYLINE' 
  | 'PITCHER_STRIKEOUTS' 
  | 'TOTAL_OVER_UNDER' 
  | 'TEAM_TOTALS' 
  | 'FULL_GAME_ML';

export type FootballMarket = 
  | 'WINNER_SPREAD' 
  | 'TOTAL_POINTS_OU' 
  | 'QB_PASSING_YARDS' 
  | 'WR_RECEIVING_YARDS' 
  | 'RB_RUSHING_YARDS' 
  | 'QUARTER_MONEYLINES';

export type TableTennisMarket =
  | 'MATCH_WINNER'
  | 'TOTAL_POINTS_OU'
  | 'SET_HANDICAP'
  | 'EXACT_SET_SCORE'
  | 'SET_1_WINNER';

export type BettingMarket = MlbMarket | FootballMarket | TableTennisMarket;

export interface WeatherVariables {
  temperatureF: number;
  windSpeedMph: number;
  windDirection: 'IN_FROM_CF' | 'OUT_TO_CF' | 'CROSS_L_TO_R' | 'CROSS_R_TO_L' | 'CALM' | 'TAILWIND' | 'HEADWIND';
  humidityPct: number;
  isDomeOrRetractableClosed: boolean;
  barometricPressureInHg: number;
}

export interface MarketOddsVariables {
  consensusSpread: number;
  consensusMoneylineHome: number;
  consensusMoneylineAway: number;
  consensusTotal: number;
  publicBetPctHome: number; // e.g. 72%
  sharpMoneyPctHome: number; // e.g. 38% -> consensus bias flag!
  lineMovementVelocity: number; // points/cents per hour
}

export interface CalibratedWeights {
  weatherWeight: number; // slider current
  weatherOptimal: number; // optimal baseline marker
  marketOddsWeight: number;
  marketOddsOptimal: number;
  pitchingOrQbWeight: number;
  pitchingOrQbOptimal: number;
  recentFormWeight: number;
  recentFormOptimal: number;
  travelFatigueWeight: number;
  travelFatigueOptimal: number;
}

export interface PlayerPropTarget {
  id: string;
  playerName: string;
  team: string;
  position: string;
  propType: 'PITCHER_K' | 'QB_PASS_YDS' | 'WR_REC_YDS' | 'RB_RUSH_YDS';
  marketLine: number;
  algorithmicProjection: number;
  overProbability: number;
  underProbability: number;
  edgePct: number; // Expected Value edge over market line
  recommendation: 'OVER' | 'UNDER' | 'PASS';
  confidenceTier: 'A+' | 'A' | 'B' | 'NEUTRAL';
  mathBreakdown: {
    baseRate: number;
    matchupModifier: number;
    weatherModifier: number;
    paceDifferential: number;
  };
}

export interface MarketTargetDetail {
  market: BettingMarket;
  marketName: string;
  consensusLine: string;
  consensusImpliedProb: number;
  nexusCalibratedProb: number;
  edgePercentage: number;
  evRoiPct: number;
  recommendation: string;
  brierScoreHistorical: number;
  optimalCalibrationVariance: number;
}

export interface DataProvenance {
  source: string;
  eventId: string;
  verifiedGroundTruth: boolean;
  ingestedAt: string;
  oddsProvider?: string;
  mathEngineUsed: string;
  zeroFabricationCertified: boolean;
  firestoreRecordId?: string;
  rawApiUrl?: string;
  verificationHash?: string;
}

export interface Game {
  id: string;
  sport: SportType;
  homeTeam: {
    code: string;
    name: string;
    record: string;
    starterOrQb: string;
    rating: number;
  };
  awayTeam: {
    code: string;
    name: string;
    record: string;
    starterOrQb: string;
    rating: number;
  };
  scheduledTime: string;
  status: 'UPCOMING' | 'LIVE' | 'FINAL';
  venue: string;
  weather: WeatherVariables;
  odds: MarketOddsVariables;
  weights: CalibratedWeights;
  
  // Data Provenance & Zero-Fabrication Certification
  provenance?: DataProvenance;

  // Primary Predictions
  trueProbabilityHome: number; // Root-level probability deconstructing consensus
  consensusImpliedProbabilityHome: number;
  mathematicalEdgeHome: number; // Difference in prob
  algorithmicFairMoneyline: {
    home: number;
    away: number;
  };
  algorithmicFairSpread: number;
  algorithmicFairTotal: number;
  
  // Sport-specific market breakdowns
  marketTargets: MarketTargetDetail[];
  playerProps: PlayerPropTarget[];

  // Factual post-mortem (if FINAL or LIVE current)
  actualResult?: {
    homeScore: number;
    awayScore: number;
    actualTotal: number;
    f5HomeScore?: number;
    f5AwayScore?: number;
    winner: string;
    brierLoss: number;
    calibrationDelta: number;
    enginePredictedPick?: string;
    enginePredictedProb?: number;
    enginePredictedEdge?: number;
    consensusLine?: string;
    predictionOutcome?: 'WIN' | 'LOSS' | 'PUSH';
    engineUpgradesMade?: string[];
    autonomousRefactorSummary?: string;
  };

  // Live game telemetry (if LIVE)
  liveTelemetry?: {
    quarterOrInning: string;
    clockOrOuts: string;
    homeScore: number;
    awayScore: number;
    possessionOrBatting: string;
    currentDownOrCount: string;
    winProbabilityInGame: number;
  };
}

export interface StructuredGameEvent {
  id: string;
  gameId: string;
  sport: SportType;
  timestamp: string;
  gameClock: string;
  period: string;
  eventDescription: string;
  dataVariablesCaptured: {
    playType: string;
    yardsGainedOrResult: string;
    deltaWinProbability: number;
    exitVelocityOrPassRushSpeed?: number;
    launchAngleOrAirYards?: number;
    pressureIndex?: number;
  };
  mathematicalImpact: string;
  factualStatus: 'VERIFIED_EMPIRICAL';
}

export interface CalibrationBin {
  binRange: string; // e.g., '0.50 - 0.60'
  predictedMeanProb: number;
  empiricalWinRate: number;
  sampleCount: number;
  binError: number;
}

export interface CalibrationMetrics {
  sport: SportType | 'ALL';
  totalPredictionsLogged: number;
  overallBrierScore: number;
  benchmarkConsensusBrier: number;
  brierImprovementPct: number;
  expectedCalibrationError: number; // ECE (lower is better, < 0.05 is elite)
  maxCalibrationError: number; // MCE
  reliabilityBins: CalibrationBin[];
  lastBacktestedAt: string;
  backtestType: 'CRON_AUTOMATED' | 'ON_DEMAND_MANUAL';
  degradationStatus: 'OPTIMAL' | 'ACCEPTABLE' | 'DEGRADED_TRIGGER_REFACTOR';
}

export interface SelfRefactoringLog {
  id: string;
  timestamp: string;
  sport: SportType;
  triggerReason: string;
  previousParameters: {
    brierThreshold: number;
    consensusDivergenceDampener: number;
    weatherDecayExponent: number;
  };
  refactoredParameters: {
    brierThreshold: number;
    consensusDivergenceDampener: number;
    weatherDecayExponent: number;
  };
  redundancyCheckPassed: boolean;
  status: 'DEPLOYED_AUTOMATICALLY';
}

export interface ElasticFeatureDiscovery {
  id: string;
  sport: SportType;
  variableName: string;
  category: 'TELEMETRY' | 'SITUATIONAL' | 'BIOMECHANIC' | 'MICROCLIMATE' | 'CHRONOBIOLOGY_LUNAR' | 'CIRCADIAN_SLEEP';
  discoveredAt: string;
  empiricalCorrelationDelta: number; // correlation improvement
  testingSampleCount: number;
  pValSignificance: number;
  deploymentStage: 'ACTIVE_WEIGHT' | 'BACKTESTING_VALIDATION' | 'CANDIDATE';
  brierDelta?: number;
  injectedWeight?: number;
  description?: string;
}

export interface HypothesisTestRequest {
  hypothesisText: string;
  sport: SportType | 'ALL';
  targetMetric: 'PASSING_YARDS' | 'STRIKEOUTS' | 'GAME_TOTAL' | 'SPREAD_COVER' | 'DEUCE_WIN_PCT' | 'RUN_PRODUCTION';
  category?: 'CHRONOBIOLOGY_LUNAR' | 'CIRCADIAN_SLEEP' | 'ATMOSPHERIC_PHYSICS' | 'OFFICIATING_SITUATIONAL' | 'MARKET_MICROSTRUCTURE' | 'BIOMECHANIC';
}

export interface HypothesisDistributionPoint {
  x: number;
  y: number;
  label: string;
}

export interface HypothesisTestResult {
  id: string;
  variableName: string;
  hypothesisText: string;
  sport: SportType | 'ALL';
  targetMetric: string;
  category: string;
  testedAt: string;
  sampleSize: number;
  pearsonR: number;
  spearmanRho: number;
  pValue: number;
  fdrStatus: 'PASSED_BENJAMINI_HOCHBERG' | 'FAILED_FALSE_DISCOVERY';
  outOfSampleDeltaBrier: number; // Negative means strictly reduced error (higher accuracy)
  verdict: 'APPROVED_AND_INJECTED' | 'REJECTED_SPURIOUS_NOISE' | 'BORDERLINE_CANDIDATE';
  injectedWeight: number;
  mathematicalReasoning: string;
  bucketBreakdown: {
    lowBucketLabel: string;
    lowBucketAvg: number;
    highBucketLabel: string;
    highBucketAvg: number;
    controlBaseline: number;
  };
  distributionPoints: HypothesisDistributionPoint[];
  suggestedEngineAction: string;
}

export interface AfterHoursDiscoveryStreamItem {
  id: string;
  timestamp: string;
  sport: SportType;
  variableName: string;
  hypothesis: string;
  category: 'CHRONOBIOLOGY_LUNAR' | 'CIRCADIAN_SLEEP' | 'ATMOSPHERIC_PHYSICS' | 'OFFICIATING_SITUATIONAL' | 'MARKET_MICROSTRUCTURE' | 'BIOMECHANIC' | 'MICROCLIMATE' | 'TELEMETRY';
  sampleSize: number;
  correlation: number;
  pValue: number;
  brierDelta: number;
  verdict: 'APPROVED_AND_INJECTED' | 'REJECTED_SPURIOUS_NOISE';
  activeWeight: number;
}

export interface UserSession {
  email: string;
  isAuthenticated: boolean;
  tier: 'QUANT_PRO' | 'ALGO_TRADER' | 'PUBLIC_OBSERVER';
  apiConnected: boolean;
}

export interface BacktestEngineModel {
  id: string;
  name: string;
  sport: SportType;
  description: string;
  repo: string;
}

export interface HistoricalBacktestRecord {
  id: string;
  date: string;
  sport: SportType;
  modelId: string;
  modelName: string;
  matchup: string;
  marketType: string;
  marketTarget: string;
  consensusLine: string;
  consensusOdds: number;
  consensusImpliedProb: number;
  nexusPredictedProb: number;
  edgePercentage: number;
  actualOutcome: 'WIN' | 'LOSS' | 'PUSH';
  actualScore: string;
  brierLoss: number; // (predicted - actual)^2
  profitUnits: number;
  weatherSummary: string;
}

export interface BacktestFilterParams {
  sport?: SportType | 'ALL';
  modelId?: string | 'ALL';
  dateRangePreset?: '7D' | '30D' | 'YTD' | '2026_SEASON' | '2025_SEASON' | 'ALL_TIME' | 'CUSTOM';
  startDate?: string;
  endDate?: string;
  marketType?: string | 'ALL';
}

export interface AggregatedBacktestMetrics {
  totalEvaluated: number;
  winCount: number;
  lossCount: number;
  pushCount: number;
  empiricalWinRate: number;
  consensusWinRate: number;
  brierScore: number;
  consensusBrierScore: number;
  brierImprovementPct: number;
  expectedCalibrationError: number;
  maxCalibrationError: number;
  totalProfitUnits: number;
  roiPercentage: number;
  consensusBiasBeatRate: number;
  reliabilityBins: CalibrationBin[];
  byModelBreakdown: Array<{
    modelId: string;
    modelName: string;
    sport: SportType;
    sampleCount: number;
    winRate: number;
    brierScore: number;
    ece: number;
    profitUnits: number;
    roiPct: number;
  }>;
}

export interface AccuracyRecordSummary {
  totalEvaluated: number;
  accurateCount: number; // Wins
  inaccurateCount: number; // Losses
  pushCount: number;
  accuracyRate: number; // e.g. 0.627
  consensusBaselineRate: number; // e.g. 0.518
  accuracyEdgePct: number; // e.g. +10.9%
  totalProfitUnits: number;
  roiPercentage: number;
  overallBrierScore: number;
  consensusBrierScore: number;
  brierImprovementPct: number;
  lastUpdated: string;
  bySport: {
    MLB: { total: number; accurate: number; inaccurate: number; pushes: number; rate: number; profitUnits: number; brierScore: number };
    NFL: { total: number; accurate: number; inaccurate: number; pushes: number; rate: number; profitUnits: number; brierScore: number };
    CFB: { total: number; accurate: number; inaccurate: number; pushes: number; rate: number; profitUnits: number; brierScore: number };
    TABLE_TENNIS: { total: number; accurate: number; inaccurate: number; pushes: number; rate: number; profitUnits: number; brierScore: number };
  };
  recentTrend: Array<{
    id: string;
    gameId: string;
    sport: SportType;
    matchup: string;
    date: string;
    marketType: string;
    predictedPick: string;
    predictedProb: number;
    actualOutcome: 'ACCURATE' | 'INACCURATE' | 'PUSH';
    actualScore: string;
    brierLoss: number;
    learningActionTriggered?: string;
  }>;
}

export interface EngineLearningAction {
  id: string;
  timestamp: string;
  sport: SportType;
  gameOrTrigger: string;
  triggerType: 'POST_MORTEM_DEVIATION' | 'BRIER_THRESHOLD_BREACH' | 'CALIBRATION_DRIFT' | 'FEATURE_DISCOVERY';
  predictionWasAccurate: boolean;
  initialPrediction: string;
  actualOutcome: string;
  errorAttribution: string; // Factual analysis of what caused variance or error
  learningActionTaken: string; // What math/code was updated to ensure accuracy
  codeOrMathAdjustment: {
    targetFile: string;
    repository: string;
    parameterName: string;
    previousValue: string | number;
    updatedValue: string | number;
    mathematicalFormula: string;
  };
  improvementProof: {
    preRefactorBrier: number;
    postRefactorBrier: number;
    validationSampleCount: number;
    brierDeltaPct: number;
  };
  status: 'ACTIVE_IN_PRODUCTION' | 'DEPLOYED_TO_ENGINE';
}

export interface TableTennisPlayer {
  id: string;
  name: string;
  country: string;
  league: string; // e.g. "Pandora / Setka Cup", "TT Elite Series", "Czech Liga Pro", "WTT Contender", "Moscow Liga Pro"
  rating: number; // Glicko-2 Elo equivalent e.g. 1740
  rd: number; // Rating Deviation e.g. 45
  volatility: number; // e.g. 0.059
  handedness: 'Right' | 'Left';
  grip: 'Shakehand' | 'Penholder';
  style: 'Attacker' | 'Counter-Hitter' | 'Defender' | 'Modern Defender' | 'Looper' | 'All-Round';
  rubberForehand: 'Inverted' | 'Short Pips' | 'Long Pips' | 'Anti-Spin';
  rubberBackhand: 'Inverted' | 'Short Pips' | 'Long Pips' | 'Anti-Spin';
  winLossSeason: { wins: number; losses: number };
  winLossLast10: { wins: number; losses: number };
  matchesToday: number;
  fatigueIndex: number; // 0.0 - 1.0
  serveWinRate: number; // e.g. 0.58
  returnWinRate: number; // e.g. 0.49
  thirdBallAttackRate: number; // e.g. 0.65
  deuceWinRate: number; // e.g. 0.57
  recentForm: Array<'W' | 'L'>;
  commentaryNotes: string;
  headToHeadHistory?: Record<string, { wins: number; losses: number; lastMeeting: string }>;
}

export interface TableTennisSimulationResult {
  player1: TableTennisPlayer;
  player2: TableTennisPlayer;
  iterations: number; // 50,000 simulations
  p1WinProbability: number;
  p2WinProbability: number;
  p1FairMoneyline: number;
  p2FairMoneyline: number;
  marketOddsP1?: number;
  marketOddsP2?: number;
  edgeP1?: number;
  edgeP2?: number;
  recommendation: 'BET_P1' | 'BET_P2' | 'PASS';
  p1PointProb: number;
  p2PointProb: number;
  totalPoints: {
    mean: number;
    median: number;
    stdDev: number;
    histogram: Array<{ bin: string; count: number; pct: number }>;
    lines: Array<{
      line: number; // e.g. 73.5, 74.5, 75.5, 76.5
      overProb: number;
      underProb: number;
      overOdds: number;
      underOdds: number;
      recommendation?: 'OVER' | 'UNDER' | 'PASS';
      edgePct?: number;
    }>;
  };
  setScoreDistribution: Array<{
    score: string; // "3-0", "3-1", "3-2", "2-3", "1-3", "0-3"
    probability: number;
    fairOdds: number;
    count: number;
  }>;
  setHandicap: {
    p1Minus1_5Prob: number;
    p2Plus1_5Prob: number;
    p1Plus1_5Prob: number;
    p2Minus1_5Prob: number;
  };
  set1WinnerProb: {
    p1: number;
    p2: number;
  };
  breakdown: {
    glickoDiff: number;
    styleBonusApplied: Array<{ label: string; impactPct: number }>;
    fatigueAdjustmentP1: number;
    fatigueAdjustmentP2: number;
    headToHeadStat: string;
    coldStartSynthesized: boolean;
    archetypePriorUsed?: string;
    algorithmsEnsemble: string[];
  };
  visualization?: SimulationVisualizationData;
  simulatedAt: string;
}

export interface SimulationVisualizationData {
  convergenceCurve: Array<{
    iteration: number;
    p1Prob: number;
    p2Prob: number;
    upperBound95: number;
    lowerBound95: number;
  }>;
  rallyDistribution: {
    shortRalliesPct: number; // 1-3 shots
    mediumRalliesPct: number; // 4-6 shots
    longRalliesPct: number; // 7+ shots
    avgRallyShots: number;
  };
  sampleSimulatedMatch: {
    sets: Array<{
      setNum: number;
      p1Score: number;
      p2Score: number;
      winner: 'P1' | 'P2';
      points: Array<{
        pointNum: number;
        server: 'P1' | 'P2';
        p1Points: number;
        p2Points: number;
        rallyLength: number;
        pointWinner: 'P1' | 'P2';
        shotType: string;
        speedKmh: number;
        tableLandingZone: 'FOREHAND_DEEP' | 'BACKHAND_DEEP' | 'FOREHAND_SHORT' | 'BACKHAND_SHORT' | 'MIDDLE_ELBOW';
      }>;
    }>;
  };
}

export interface AutoBacktestCycleRecord {
  id: string;
  timestamp: string;
  sport: SportType;
  engineName: string;
  sampleEvaluated: number;
  empiricalWinRate: number;
  consensusWinRate: number;
  alphaEdgePct: number;
  realizedNetUnits: number;
  roiPct: number;
  brierScore: number;
  ece: number;
  autoTuningSummary: string;
  status: 'SUCCESS_DEPLOYED';
}

export interface MatchSearchResult {
  id: string;
  sport: SportType;
  tournamentOrLeague: string;
  matchupTitle: string;
  subTitle: string;
  scheduledTime: string;
  status: 'LIVE' | 'UPCOMING' | 'FINAL';
  venueOrTable: string;
  marketDetails: {
    primaryLine: string;
    moneylineHomeOrP1?: string | number;
    moneylineAwayOrP2?: string | number;
    totalLine?: number;
  };
  liveScoreSummary?: string;
  rawGameId?: string;
  rawTtMatchId?: string;
}

export interface TableTennisMatchScheduled {
  id: string;
  tournament: string; // e.g. "Pandora / Setka Cup Challenger", "TT Elite Series Prague"
  tableNumber: string;
  scheduledTime: string;
  status: 'UPCOMING' | 'LIVE' | 'FINAL';
  p1: TableTennisPlayer;
  p2: TableTennisPlayer;
  marketMoneylineP1: number; // e.g. -135
  marketMoneylineP2: number; // e.g. +105
  marketTotalPoints: number; // e.g. 74.5
  liveScore?: {
    currentSet: number;
    setsP1: number;
    setsP2: number;
    currentPointsP1: number;
    currentPointsP2: number;
    serving: 'P1' | 'P2';
    completedSets: Array<{ p1: number; p2: number }>;
  };
  finalResult?: {
    winner: string;
    setsP1: number;
    setsP2: number;
    totalPoints: number;
    scores: Array<{ p1: number; p2: number }>;
    brierScore: number;
    learningLogged: boolean;
  };
}


