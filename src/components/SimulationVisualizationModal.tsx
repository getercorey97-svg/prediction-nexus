import React, { useState, useEffect } from 'react';
import { 
  X, 
  Play, 
  Pause, 
  RotateCcw, 
  SkipForward, 
  TrendingUp, 
  Zap, 
  Activity, 
  ShieldCheck, 
  Layers, 
  Gauge, 
  ArrowRight 
} from 'lucide-react';
import { TableTennisSimulationResult } from '../types';

interface SimulationVisualizationModalProps {
  isOpen: boolean;
  onClose: () => void;
  simResult: TableTennisSimulationResult | null;
}

export const SimulationVisualizationModal: React.FC<SimulationVisualizationModalProps> = ({
  isOpen,
  onClose,
  simResult,
}) => {
  const [activeTab, setActiveTab] = useState<'COURT_PLAYBACK' | 'CONVERGENCE_CURVE' | 'RALLY_DYNAMICS' | 'LINE_EXPLORER'>('COURT_PLAYBACK');
  
  // Interactive Court Playback State
  const [currentSetIdx, setCurrentSetIdx] = useState(0);
  const [currentPointIdx, setCurrentPointIdx] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState<1 | 2 | 4>(1);

  // Line Explorer State
  const [testLine, setTestLine] = useState<number>(simResult?.marketOddsP1 ? 74.5 : 74.5);

  const sampleMatch = simResult?.visualization?.sampleSimulatedMatch;
  const currentSet = sampleMatch?.sets[currentSetIdx];
  const currentPoint = currentSet?.points[currentPointIdx];

  // Auto-play interval for court visualizer
  useEffect(() => {
    if (!isPlaying || !sampleMatch) return;

    const intervalTime = 1200 / playbackSpeed;
    const timer = setInterval(() => {
      if (!currentSet) return;
      if (currentPointIdx < currentSet.points.length - 1) {
        setCurrentPointIdx(prev => prev + 1);
      } else {
        // Move to next set
        if (currentSetIdx < sampleMatch.sets.length - 1) {
          setCurrentSetIdx(prev => prev + 1);
          setCurrentPointIdx(0);
        } else {
          setIsPlaying(false); // Match finished
        }
      }
    }, intervalTime);

    return () => clearInterval(timer);
  }, [isPlaying, currentPointIdx, currentSetIdx, currentSet, sampleMatch, playbackSpeed]);

  if (!isOpen || !simResult) return null;

  const { player1, player2, visualization, totalPoints } = simResult;
  const convergenceData = visualization?.convergenceCurve || [];
  const rallyData = visualization?.rallyDistribution || { shortRalliesPct: 38, mediumRalliesPct: 40, longRalliesPct: 22, avgRallyShots: 5.2 };

  // Calculate live Over/Under probability based on mean & stdDev for interactive slider
  const calcProbOver = (line: number) => {
    const mean = totalPoints?.mean || 74.5;
    const stdDev = totalPoints?.stdDev || 7.2;
    const z = (line - mean) / stdDev;
    // Approximated normal CDF
    const t = 1.0 / (1.0 + 0.2316419 * Math.abs(z));
    const d = 0.3989423 * Math.exp(-z * z / 2.0);
    let p = d * t * (0.3193815 + t * (-0.3565638 + t * (1.781478 + t * (-1.821256 + t * 1.330274))));
    if (z > 0) p = 1.0 - p;
    const probUnder = p;
    const probOver = 1.0 - probUnder;
    return {
      over: +(probOver * 100).toFixed(1),
      under: +(probUnder * 100).toFixed(1),
    };
  };

  const lineProbs = calcProbOver(testLine);

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-4xl bg-[#0b1019] border border-[#233149] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] mt-2 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-5 border-b border-[#1b263b] bg-[#101726] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>50,000-Iteration Vectorized Simulation Visualizer</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              {player1.name} vs {player2.name}
            </h3>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-1">
              <span>Fair Win%: <strong className="text-cyan-300">{(simResult.p1WinProbability * 100).toFixed(1)}%</strong> vs <strong className="text-slate-200">{(simResult.p2WinProbability * 100).toFixed(1)}%</strong></span>
              <span>•</span>
              <span>Projected Points: <strong className="text-amber-300">{simResult.totalPoints.mean}</strong> (±{simResult.totalPoints.stdDev})</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* View Tabs */}
        <div className="flex border-b border-[#192438] bg-[#0d1422] px-3 sm:px-5 gap-1 sm:gap-2 overflow-x-auto text-xs font-mono">
          <button
            onClick={() => setActiveTab('COURT_PLAYBACK')}
            className={`py-2.5 px-3 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'COURT_PLAYBACK'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Interactive Court Playback</span>
          </button>
          <button
            onClick={() => setActiveTab('CONVERGENCE_CURVE')}
            className={`py-2.5 px-3 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'CONVERGENCE_CURVE'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>50k Monte Carlo Convergence</span>
          </button>
          <button
            onClick={() => setActiveTab('RALLY_DYNAMICS')}
            className={`py-2.5 px-3 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'RALLY_DYNAMICS'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Rally Dynamics & Sets</span>
          </button>
          <button
            onClick={() => setActiveTab('LINE_EXPLORER')}
            className={`py-2.5 px-3 border-b-2 font-medium whitespace-nowrap transition-colors flex items-center space-x-1.5 ${
              activeTab === 'LINE_EXPLORER'
                ? 'border-cyan-400 text-cyan-300'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Over/Under Line Explorer</span>
          </button>
        </div>

        {/* Tab Content Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {/* TAB 1: COURT PLAYBACK */}
          {activeTab === 'COURT_PLAYBACK' && (
            <div className="space-y-4">
              {/* Scoreboard Banner */}
              <div className="grid grid-cols-3 bg-[#131b2b] p-3 rounded-xl border border-[#212d42] items-center text-center font-mono">
                <div>
                  <div className="text-xs text-slate-400">{player1.name}</div>
                  <div className="text-xl sm:text-2xl font-bold text-cyan-300">
                    {currentPoint?.p1Points ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sets: {sampleMatch?.sets.filter((s, idx) => idx < currentSetIdx && s.winner === 'P1').length ?? 0}
                  </div>
                </div>

                <div>
                  <div className="text-[11px] font-bold text-amber-400 uppercase tracking-wider">
                    Set {currentSet?.setNum ?? 1} of {sampleMatch?.sets.length ?? 3}
                  </div>
                  <div className="text-xs text-slate-400 mt-1">
                    Point {currentPoint?.pointNum ?? 1}
                  </div>
                  <div className="text-[10px] text-cyan-400 font-bold mt-0.5">
                    Server: {currentPoint?.server === 'P1' ? player1.name : player2.name}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400">{player2.name}</div>
                  <div className="text-xl sm:text-2xl font-bold text-slate-200">
                    {currentPoint?.p2Points ?? 0}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Sets: {sampleMatch?.sets.filter((s, idx) => idx < currentSetIdx && s.winner === 'P2').length ?? 0}
                  </div>
                </div>
              </div>

              {/* 2D Ping-Pong Table Canvas Display */}
              <div className="relative w-full aspect-[16/9] sm:aspect-[21/9] bg-[#07131e] rounded-xl border-2 border-[#1c3a59] overflow-hidden flex flex-col justify-center items-center shadow-inner">
                {/* Table Top Surface */}
                <div className="relative w-[85%] h-[75%] bg-[#0f3460] border-4 border-white rounded shadow-2xl flex">
                  {/* Center Line */}
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-white/40 -translate-y-1/2" />
                  
                  {/* P1 Side (Left) */}
                  <div className="w-1/2 h-full relative border-r-2 border-white/90">
                    <div className="absolute left-3 top-2 text-[10px] font-mono font-bold text-cyan-200 bg-cyan-900/60 px-1.5 py-0.5 rounded">
                      {player1.name} (Side A)
                    </div>
                  </div>

                  {/* Table Tennis Net in Center */}
                  <div className="absolute left-1/2 top-0 bottom-0 w-2 bg-slate-200/90 -translate-x-1/2 z-10 shadow-lg flex items-center justify-center">
                    <div className="w-4 h-full bg-slate-400/20 border-x border-dashed border-white/60" />
                  </div>

                  {/* P2 Side (Right) */}
                  <div className="w-1/2 h-full relative">
                    <div className="absolute right-3 top-2 text-[10px] font-mono font-bold text-slate-200 bg-slate-800/80 px-1.5 py-0.5 rounded">
                      {player2.name} (Side B)
                    </div>
                  </div>

                  {/* Simulated Ball Landing Coordinates */}
                  {currentPoint && (
                    <div 
                      className={`absolute w-5 h-5 rounded-full -translate-x-1/2 -translate-y-1/2 shadow-lg flex items-center justify-center transition-all duration-300 animate-pulse ${
                        currentPoint.pointWinner === 'P1' ? 'bg-amber-300 ring-4 ring-amber-400/50' : 'bg-cyan-300 ring-4 ring-cyan-400/50'
                      }`}
                      style={{
                        top: currentPoint.tableLandingZone.includes('FOREHAND') ? '70%' :
                             currentPoint.tableLandingZone.includes('BACKHAND') ? '30%' : '50%',
                        left: currentPoint.pointWinner === 'P1'
                          ? (currentPoint.tableLandingZone.includes('DEEP') ? '82%' : '62%')
                          : (currentPoint.tableLandingZone.includes('DEEP') ? '18%' : '38%')
                      }}
                    >
                      <div className="w-2 h-2 rounded-full bg-white shadow" />
                    </div>
                  )}
                </div>

                {/* Live Shot Telemetry Overlay */}
                {currentPoint && (
                  <div className="absolute bottom-3 left-3 right-3 bg-black/75 backdrop-blur-md px-3 py-2 rounded-lg border border-[#23354f] flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs font-mono">
                    <div className="flex items-center space-x-2">
                      <span className="text-amber-400 font-bold">Shot Type:</span>
                      <span className="text-white font-medium">{currentPoint.shotType}</span>
                    </div>
                    <div className="flex items-center space-x-4 text-slate-300 text-[11px]">
                      <span>Rally: <strong>{currentPoint.rallyLength} shots</strong></span>
                      <span>Speed: <strong className="text-cyan-300">{currentPoint.speedKmh} km/h</strong></span>
                      <span>Point Winner: <strong className={currentPoint.pointWinner === 'P1' ? 'text-cyan-300' : 'text-slate-100'}>
                        {currentPoint.pointWinner === 'P1' ? player1.name : player2.name}
                      </strong></span>
                    </div>
                  </div>
                )}
              </div>

              {/* Playback Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 bg-[#111726] p-3 rounded-xl border border-[#1d273a] font-mono text-xs">
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => setIsPlaying(!isPlaying)}
                    className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-bold flex items-center space-x-1.5 transition-colors"
                  >
                    {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    <span>{isPlaying ? 'Pause Playback' : 'Play Simulation'}</span>
                  </button>
                  <button
                    onClick={() => {
                      if (!currentSet) return;
                      if (currentPointIdx < currentSet.points.length - 1) {
                        setCurrentPointIdx(prev => prev + 1);
                      } else if (currentSetIdx < (sampleMatch?.sets.length ?? 0) - 1) {
                        setCurrentSetIdx(prev => prev + 1);
                        setCurrentPointIdx(0);
                      }
                    }}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 flex items-center space-x-1"
                  >
                    <SkipForward className="w-3.5 h-3.5" />
                    <span>Next Point</span>
                  </button>
                  <button
                    onClick={() => {
                      setIsPlaying(false);
                      setCurrentSetIdx(0);
                      setCurrentPointIdx(0);
                    }}
                    className="px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-white"
                    title="Reset to Point 1"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <span className="text-slate-400 text-[11px]">Speed:</span>
                  {([1, 2, 4] as const).map((spd) => (
                    <button
                      key={spd}
                      onClick={() => setPlaybackSpeed(spd)}
                      className={`px-2 py-0.5 rounded text-[11px] ${
                        playbackSpeed === spd ? 'bg-cyan-500 text-slate-950 font-bold' : 'bg-slate-800 text-slate-300'
                      }`}
                    >
                      {spd}x
                    </button>
                  ))}
                </div>

                {/* Set Selector */}
                <div className="flex items-center space-x-1 text-slate-400">
                  <span className="text-[11px] mr-1">Set:</span>
                  {sampleMatch?.sets.map((s, idx) => (
                    <button
                      key={s.setNum}
                      onClick={() => {
                        setCurrentSetIdx(idx);
                        setCurrentPointIdx(0);
                      }}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        currentSetIdx === idx ? 'bg-amber-500 text-slate-950' : 'bg-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {s.setNum} ({s.p1Score}-{s.p2Score})
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: MONTE CARLO CONVERGENCE CURVE */}
          {activeTab === 'CONVERGENCE_CURVE' && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#121826] p-4 rounded-xl border border-[#202c40]">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                      <TrendingUp className="w-4 h-4 text-cyan-400" />
                      <span>Bayesian Probability Convergence (N = 1,000 → 50,000)</span>
                    </h4>
                    <p className="text-xs text-slate-400 mt-0.5">
                      Demonstrating Law of Large Numbers stability. Shaded envelope shows 95% credible confidence bounds.
                    </p>
                  </div>
                  <div className="text-right text-xs">
                    <span className="text-slate-400">Final N: </span>
                    <span className="text-cyan-300 font-bold">50,000 Iterations</span>
                  </div>
                </div>

                {/* SVG Convergence Graph */}
                <div className="w-full h-56 relative bg-[#090e17] rounded-lg border border-[#1b263b] p-3 flex flex-col justify-end">
                  <svg className="w-full h-full overflow-visible" viewBox="0 0 500 160">
                    <defs>
                      <linearGradient id="bandGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.25" />
                        <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.03" />
                      </linearGradient>
                    </defs>

                    {/* Horizontal Reference Lines (25%, 50%, 75%) */}
                    <line x1="0" y1="120" x2="500" y2="120" stroke="#1f293d" strokeDasharray="3 3" />
                    <line x1="0" y1="80" x2="500" y2="80" stroke="#334155" strokeDasharray="4 4" />
                    <line x1="0" y1="40" x2="500" y2="40" stroke="#1f293d" strokeDasharray="3 3" />
                    <text x="5" y="77" fill="#64748b" fontSize="9">50% Line</text>

                    {/* Confidence Band Polygon */}
                    {convergenceData.length > 1 && (
                      <polygon
                        points={`
                          ${convergenceData.map((d, i) => `${(i / (convergenceData.length - 1)) * 500},${160 - (d.upperBound95 * 160)}`).join(' ')}
                          ${[...convergenceData].reverse().map((d, i) => `${((convergenceData.length - 1 - i) / (convergenceData.length - 1)) * 500},${160 - (d.lowerBound95 * 160)}`).join(' ')}
                        `}
                        fill="url(#bandGrad)"
                      />
                    )}

                    {/* Mean Trajectory Line */}
                    {convergenceData.length > 1 && (
                      <polyline
                        fill="none"
                        stroke="#06b6d4"
                        strokeWidth="2.5"
                        points={convergenceData.map((d, i) => `${(i / (convergenceData.length - 1)) * 500},${160 - (d.p1Prob * 160)}`).join(' ')}
                      />
                    )}

                    {/* Checkpoint Dots */}
                    {convergenceData.map((d, i) => {
                      const cx = (i / (convergenceData.length - 1)) * 500;
                      const cy = 160 - (d.p1Prob * 160);
                      return (
                        <g key={d.iteration}>
                          <circle cx={cx} cy={cy} r="4" fill="#38bdf8" />
                          <text x={cx} y={cy - 8} fill="#94a3b8" fontSize="8" textAnchor="middle">
                            {(d.p1Prob * 100).toFixed(1)}%
                          </text>
                        </g>
                      );
                    })}
                  </svg>

                  {/* X Axis Labels */}
                  <div className="flex justify-between text-[10px] text-slate-500 pt-2 border-t border-[#1a2537]">
                    <span>1k Sims</span>
                    <span>5k Sims</span>
                    <span>10k Sims</span>
                    <span>25k Sims</span>
                    <span>50,000 Sims (Final Convergence)</span>
                  </div>
                </div>

                {/* Table of Checkpoints */}
                <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                  {convergenceData.slice(0, 4).map((c) => (
                    <div key={c.iteration} className="p-2 rounded bg-[#0e1522] border border-[#1b2538]">
                      <div className="text-slate-400 text-[10px]">N = {c.iteration.toLocaleString()}</div>
                      <div className="text-cyan-300 font-bold">{(c.p1Prob * 100).toFixed(1)}%</div>
                      <div className="text-slate-500 text-[9px]">95% CI: [{(c.lowerBound95 * 100).toFixed(0)}% - {(c.upperBound95 * 100).toFixed(0)}%]</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: RALLY DYNAMICS & SET SCORES */}
          {activeTab === 'RALLY_DYNAMICS' && (
            <div className="space-y-4 font-mono">
              {/* Rally Breakdown */}
              <div className="bg-[#121826] p-4 rounded-xl border border-[#202c40]">
                <h4 className="text-sm font-bold text-white mb-2">Rally Shot-Count Distribution</h4>
                <p className="text-xs text-slate-400 mb-3">
                  Derived from paddle rubber profiles ({player1.rubberBackhand} vs {player2.rubberBackhand}) and playing styles ({player1.style} vs {player2.style}).
                </p>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-cyan-300">Short Rallies (1-3 shots / Serve Dominance)</span>
                      <span className="font-bold">{rallyData.shortRalliesPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${rallyData.shortRalliesPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-amber-300">Medium Rallies (4-6 shots / Transition Loops)</span>
                      <span className="font-bold">{rallyData.mediumRalliesPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-amber-500 rounded-full" style={{ width: `${rallyData.mediumRalliesPct}%` }} />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-xs mb-1">
                      <span className="text-purple-300">Prolonged Rallies (7+ shots / Deep Defensive Chops)</span>
                      <span className="font-bold">{rallyData.longRalliesPct}%</span>
                    </div>
                    <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: `${rallyData.longRalliesPct}%` }} />
                    </div>
                  </div>
                </div>

                <div className="mt-4 p-2.5 rounded bg-[#0a0f18] border border-[#1b2539] text-xs text-slate-300 flex items-center justify-between">
                  <span>Simulated Average Shots per Point:</span>
                  <span className="font-bold text-cyan-300">{rallyData.avgRallyShots} shots/point</span>
                </div>
              </div>

              {/* Exact Set Scores */}
              <div className="bg-[#121826] p-4 rounded-xl border border-[#202c40]">
                <h4 className="text-sm font-bold text-white mb-2">Simulated Best-of-5 Exact Scores</h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                  {simResult.setScoreDistribution.map((s) => (
                    <div key={s.score} className="p-2.5 rounded-lg bg-[#0e1522] border border-[#1b263b] flex items-center justify-between">
                      <div>
                        <span className="font-bold text-white">{s.score}</span>
                        <div className="text-[10px] text-slate-400">Fair: {s.fairOdds > 0 ? `+${s.fairOdds}` : s.fairOdds}</div>
                      </div>
                      <span className="text-cyan-300 font-bold">{(s.probability * 100).toFixed(1)}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: INTERACTIVE OVER/UNDER LINE EXPLORER */}
          {activeTab === 'LINE_EXPLORER' && (
            <div className="space-y-4 font-mono">
              <div className="bg-[#121826] p-4 sm:p-5 rounded-xl border border-[#202c40]">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-bold text-white flex items-center space-x-1.5">
                    <Gauge className="w-4 h-4 text-cyan-400" />
                    <span>Dynamic Total Match Points Line Recalculator</span>
                  </h4>
                  <span className="text-xs px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 font-bold">
                    Mean: {totalPoints.mean} Pts
                  </span>
                </div>
                <p className="text-xs text-slate-400 mb-4">
                  Drag the slider below to test alternative bookmaker lines (66.5 to 84.5) and instantly discover real-time algorithmic probabilities and value edges.
                </p>

                {/* Slider Input */}
                <div className="p-4 bg-[#0a0f18] rounded-xl border border-[#1b2539] space-y-3">
                  <div className="flex justify-between items-center text-sm font-bold">
                    <span className="text-slate-400">Test Total Line:</span>
                    <span className="text-2xl text-amber-300">{testLine.toFixed(1)} Points</span>
                  </div>

                  <input
                    type="range"
                    min="66.5"
                    max="84.5"
                    step="0.5"
                    value={testLine}
                    onChange={(e) => setTestLine(parseFloat(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />

                  <div className="flex justify-between text-[11px] text-slate-500">
                    <span>66.5 (Low-Scoring Sweep)</span>
                    <span>74.5 (Consensus Line)</span>
                    <span>84.5 (5-Set Deuce Thriller)</span>
                  </div>
                </div>

                {/* Outcome Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                  <div className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-800/60 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-cyan-300 font-bold uppercase tracking-wider">OVER {testLine} POINTS</span>
                      <div className="text-3xl font-bold text-white mt-1">{lineProbs.over}%</div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 pt-2 border-t border-cyan-900/50">
                      Fair Odds: <strong>{lineProbs.over > 50 ? `-${Math.round((lineProbs.over / (100 - lineProbs.over)) * 100)}` : `+${Math.round(((100 - lineProbs.over) / lineProbs.over) * 100)}`}</strong>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-700/60 flex flex-col justify-between">
                    <div>
                      <span className="text-xs text-slate-300 font-bold uppercase tracking-wider">UNDER {testLine} POINTS</span>
                      <div className="text-3xl font-bold text-white mt-1">{lineProbs.under}%</div>
                    </div>
                    <div className="mt-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                      Fair Odds: <strong>{lineProbs.under > 50 ? `-${Math.round((lineProbs.under / (100 - lineProbs.under)) * 100)}` : `+${Math.round(((100 - lineProbs.under) / lineProbs.under) * 100)}`}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0e16] border-t border-[#182335] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            <span>50k Sim Engine: Glicko-2 Elo + Rubber Physics Matrix + Markov Transition</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
