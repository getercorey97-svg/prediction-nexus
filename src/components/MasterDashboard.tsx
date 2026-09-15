import React, { useState } from 'react';
import { 
  TrendingUp, 
  ShieldCheck, 
  Scale, 
  Activity, 
  ArrowUpRight, 
  Zap, 
  CheckCircle2, 
  AlertCircle, 
  Wind, 
  Radio,
  Sliders,
  Trophy
} from 'lucide-react';
import { Game, SportType, CalibrationMetrics } from '../types';
import { GameBacktestModal } from './GameBacktestModal';
import { GameCalibrationModal } from './GameCalibrationModal';

interface MasterDashboardProps {
  games: Game[];
  calibration: CalibrationMetrics;
  onSelectGame: (gameId: string, sport: SportType) => void;
  onNavigateToSport: (sport: SportType) => void;
}

export const MasterDashboard: React.FC<MasterDashboardProps> = ({
  games,
  calibration,
  onSelectGame,
  onNavigateToSport,
}) => {
  const [backtestGame, setBacktestGame] = useState<Game | null>(null);
  const [calibrationGame, setCalibrationGame] = useState<Game | null>(null);

  // Extract top edges across all games
  const allTargets = games.flatMap(g => 
    g.marketTargets.map(t => ({
      game: g,
      target: t,
    }))
  ).sort((a, b) => b.target.edgePercentage - a.target.edgePercentage);

  const liveGames = games.filter(g => g.status === 'LIVE');

  return (
    <div id="master-dashboard" className="space-y-6">
      {/* Broadcast Header & The Geter Principle Status */}
      <div className="p-5 rounded-xl bg-gradient-to-r from-[#111728] via-[#0e1320] to-[#121829] border border-[#212c42] shadow-lg flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-400 border border-cyan-700">
              <Zap className="w-3 h-3 mr-1" />
              MASTER NEXUS RADAR
            </span>
            <span className="text-xs font-mono text-slate-400">
              AGGREGATED MULTI-ENGINE INTELLIGENCE
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
            Empirical Edge Aggregator & Consensus Deconstruction
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Real-time synchronization across isolated MLB, NFL, and CFB prediction engines. All calculations strictly empirical.
          </p>
        </div>

        {/* High-level Calibration Metrics Box */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="px-3.5 py-2 rounded-lg bg-[#0a0d14] border border-[#1e273b] text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Overall Brier Score</div>
            <div className="text-sm sm:text-base font-mono font-bold text-emerald-400">
              {calibration.overallBrierScore.toFixed(4)}
            </div>
            <div className="text-[9px] font-mono text-slate-500">
              -{(calibration.brierImprovementPct).toFixed(1)}% vs Consensus
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-lg bg-[#0a0d14] border border-[#1e273b] text-right">
            <div className="text-[10px] font-mono text-slate-400 uppercase">Expected Calibration (ECE)</div>
            <div className="text-sm sm:text-base font-mono font-bold text-cyan-400">
              {calibration.expectedCalibrationError.toFixed(4)}
            </div>
            <div className="text-[9px] font-mono text-emerald-400">
              STATUS: {calibration.degradationStatus}
            </div>
          </div>
        </div>
      </div>

      {/* Live Telemetry Ticker if any LIVE games */}
      {liveGames.length > 0 && (
        <div className="p-4 rounded-xl bg-cyan-950/20 border border-cyan-500/40">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2">
              <Radio className="w-4 h-4 text-cyan-400 animate-pulse" />
              <span className="font-display font-bold text-xs uppercase tracking-wider text-cyan-300">
                ACTIVE IN-GAME TELEMETRY // ZERO-FABRICATION STREAM
              </span>
            </div>
            <span className="text-[10px] font-mono text-slate-400">
              EMPIRICALLY VERIFIED PLAY-BY-PLAY
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {liveGames.map(game => (
              <div 
                key={game.id}
                onClick={() => onSelectGame(game.id, game.sport)}
                className="p-3 rounded-lg bg-[#0d121c] border border-cyan-800/40 hover:border-cyan-400/80 cursor-pointer transition-colors flex items-center justify-between"
              >
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-cyan-950 text-cyan-300 border border-cyan-700">
                      {game.sport} LIVE
                    </span>
                    <span className="text-xs font-bold text-white">
                      {game.awayTeam.code} ({game.liveTelemetry?.awayScore}) @ {game.homeTeam.code} ({game.liveTelemetry?.homeScore})
                    </span>
                  </div>
                  <div className="text-[11px] font-mono text-slate-400 mt-1">
                    {game.liveTelemetry?.quarterOrInning} · {game.liveTelemetry?.clockOrOuts}
                  </div>
                </div>

                <div className="text-right">
                  <div className="text-[10px] font-mono text-slate-500">Live Win Prob</div>
                  <div className="text-xs font-mono font-bold text-cyan-300">
                    {game.homeTeam.code} {((game.liveTelemetry?.winProbabilityInGame || 0.5) * 100).toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Top Mathematical Edges Leaderboard */}
      <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-4">
          <div>
            <div className="flex items-center space-x-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                TOP MATHEMATICAL EDGES (DECONSTRUCTING PUBLIC BIAS)
              </h3>
            </div>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Ranked by discrepancy between Nexus True Root Probability and Bookmaker Implied Probability.
            </p>
          </div>

          <span className="text-[11px] font-mono px-2.5 py-1 rounded bg-[#161d2d] border border-[#27354d] text-cyan-300 self-start">
            {allTargets.length} TARGETS MONITORED
          </span>
        </div>

        {/* Edges Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1c2536] text-[10px] uppercase text-slate-400 tracking-wider">
                <th className="pb-2.5 font-semibold">Sport & Matchup</th>
                <th className="pb-2.5 font-semibold">Target Market</th>
                <th className="pb-2.5 font-semibold">Consensus Line</th>
                <th className="pb-2.5 font-semibold">Consensus Prob</th>
                <th className="pb-2.5 font-semibold">Nexus Calibrated</th>
                <th className="pb-2.5 font-semibold text-emerald-400">Mathematical Edge</th>
                <th className="pb-2.5 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {allTargets.slice(0, 8).map((item, idx) => {
                const { game, target } = item;
                const edgeColor = target.edgePercentage >= 0.07 
                  ? 'text-emerald-400 font-bold' 
                  : 'text-cyan-400 font-medium';

                return (
                  <tr key={`${game.id}-${target.market}-${idx}`} className="hover:bg-[#141b2b] transition-colors group">
                    <td className="py-3 pr-2">
                      <div className="flex items-center space-x-1.5">
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-bold border ${
                          game.sport === 'MLB' 
                            ? 'bg-amber-950/80 text-amber-300 border-amber-800' 
                            : game.sport === 'NFL' 
                            ? 'bg-blue-950/80 text-blue-300 border-blue-800' 
                            : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                        }`}>
                          {game.sport}
                        </span>
                        <span className="font-sans font-semibold text-slate-200">
                          {game.awayTeam.code} @ {game.homeTeam.code}
                        </span>
                      </div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[150px]">
                        {game.venue}
                      </div>
                    </td>

                    <td className="py-3 pr-2 text-slate-200 font-medium">
                      {target.marketName}
                    </td>

                    <td className="py-3 pr-2 text-slate-400">
                      {target.consensusLine}
                    </td>

                    <td className="py-3 pr-2 text-slate-400">
                      {(target.consensusImpliedProb * 100).toFixed(1)}%
                    </td>

                    <td className="py-3 pr-2 font-semibold text-white">
                      {(target.nexusCalibratedProb * 100).toFixed(1)}%
                    </td>

                    <td className={`py-3 pr-2 ${edgeColor}`}>
                      +{(target.edgePercentage * 100).toFixed(1)}%
                      <span className="text-[10px] text-slate-500 ml-1.5">
                        ({target.evRoiPct}% EV)
                      </span>
                    </td>

                    <td className="py-3 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => setBacktestGame(game)}
                          className="px-2 py-1 rounded bg-cyan-950/80 hover:bg-cyan-500 hover:text-slate-950 border border-cyan-700/60 text-[10px] text-cyan-300 font-bold transition-colors inline-flex items-center space-x-1"
                          title="Trigger manual backtest on this game profile"
                        >
                          <Zap className="w-3 h-3 text-cyan-400 fill-current" />
                          <span className="hidden sm:inline">BACKTEST</span>
                        </button>
                        <button
                          onClick={() => setCalibrationGame(game)}
                          className="px-2 py-1 rounded bg-amber-950/80 hover:bg-amber-500 hover:text-slate-950 border border-amber-700/60 text-[10px] text-amber-300 font-bold transition-colors inline-flex items-center space-x-1"
                          title="View live calibration details and weight sliders"
                        >
                          <Sliders className="w-3 h-3 text-amber-400" />
                          <span className="hidden sm:inline">CALIBRATE</span>
                        </button>
                        <button
                          onClick={() => onSelectGame(game.id, game.sport)}
                          className="px-2 py-1 rounded bg-[#182133] hover:bg-slate-700 text-slate-300 border border-[#283650] text-[10px] transition-colors inline-flex items-center space-x-1"
                          title="Inspect full match breakdown"
                        >
                          <span>INSPECT</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Sport Engine Launch Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* MLB Engine */}
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-amber-950 text-amber-400 border border-amber-800">
                MLB ISOLATED ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                repo: mlb-engine
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-white uppercase mb-1">
              Baseball Quantitative Engine
            </h4>
            <p className="text-xs text-slate-400 font-sans mb-3">
              F5 moneyline, pitcher strikeout Poisson distributions, full game totals, and air density aerodynamic dampening.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Brier:</span>
                <span className="text-emerald-400 font-bold">0.1742</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Variable:</span>
                <span className="text-slate-300">xFIP + Barometric Wind</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSport('MLB')}
            className="w-full py-2.5 rounded-lg bg-[#161e30] hover:bg-amber-500 hover:text-slate-950 border border-[#25334e] text-xs font-mono font-semibold text-amber-300 transition-all flex items-center justify-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>LAUNCH MLB CONTROLS</span>
          </button>
        </div>

        {/* NFL Engine */}
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950 text-blue-400 border border-blue-800">
                NFL ISOLATED ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                repo: nfl-sota-prediction-engine
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-white uppercase mb-1">
              Pro Football SOTA Engine
            </h4>
            <p className="text-xs text-slate-400 font-sans mb-3">
              Dixon-Coles bivariate model, EPA/play differentials, QB/WR correlation matrix, and player yardage props.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Brier:</span>
                <span className="text-emerald-400 font-bold">0.1685</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Variable:</span>
                <span className="text-slate-300">Pass Rush Pressure vs 3-Man</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSport('NFL')}
            className="w-full py-2.5 rounded-lg bg-[#161e30] hover:bg-blue-500 hover:text-white border border-[#25334e] text-xs font-mono font-semibold text-blue-300 transition-all flex items-center justify-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>LAUNCH NFL CONTROLS</span>
          </button>
        </div>

        {/* CFB Engine */}
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-950 text-emerald-400 border border-emerald-800">
                CFB ISOLATED ENGINE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                repo: College-football-pred
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-white uppercase mb-1">
              College Football Zero Engine
            </h4>
            <p className="text-xs text-slate-400 font-sans mb-3">
              Markov Chain drive simulation, Skew-Normal QB distributions, roster intelligence, and pace multipliers.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Brier:</span>
                <span className="text-emerald-400 font-bold">0.1698</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Variable:</span>
                <span className="text-slate-300">Markov Absorbing EPA Drive</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSport('CFB')}
            className="w-full py-2.5 rounded-lg bg-[#161e30] hover:bg-emerald-500 hover:text-slate-950 border border-[#25334e] text-xs font-mono font-semibold text-emerald-300 transition-all flex items-center justify-center space-x-1.5"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>LAUNCH CFB CONTROLS</span>
          </button>
        </div>

        {/* Table Tennis SOTA Engine */}
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-cyan-950 text-cyan-400 border border-cyan-800">
                TT SOTA ORACLE
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                repo: tt-oracle
              </span>
            </div>
            <h4 className="font-display font-bold text-base text-white uppercase mb-1">
              Table Tennis SOTA Oracle
            </h4>
            <p className="text-xs text-slate-400 font-sans mb-3">
              50k Monte Carlo point simulations, Glicko-2 ratings, style-rubber matrix, and Pandora circuit models.
            </p>
            <div className="space-y-1.5 text-xs font-mono text-slate-300 mb-4">
              <div className="flex justify-between">
                <span className="text-slate-500">Historical Brier:</span>
                <span className="text-emerald-400 font-bold">0.1584</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500">Key Variable:</span>
                <span className="text-slate-300">Glicko-2 + Style Matrix</span>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigateToSport('TABLE_TENNIS')}
            className="w-full py-2.5 rounded-lg bg-[#161e30] hover:bg-cyan-500 hover:text-slate-950 border border-[#25334e] text-xs font-mono font-semibold text-cyan-300 transition-all flex items-center justify-center space-x-1.5"
          >
            <Trophy className="w-3.5 h-3.5" />
            <span>LAUNCH TT CONTROLS</span>
          </button>
        </div>
      </div>

      {/* Manual Backtesting Modal (Opened directly from target cards) */}
      {backtestGame && (
        <GameBacktestModal
          game={backtestGame}
          onClose={() => setBacktestGame(null)}
        />
      )}

      {/* Calibration Details & Live Weights Modal */}
      {calibrationGame && (
        <GameCalibrationModal
          game={calibrationGame}
          onClose={() => setCalibrationGame(null)}
          onWeightsSaved={() => setCalibrationGame(null)}
        />
      )}
    </div>
  );
};
