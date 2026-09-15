import React, { useState } from 'react';
import { 
  X, 
  Play, 
  RefreshCw, 
  CheckCircle2, 
  AlertTriangle, 
  TrendingUp, 
  Activity, 
  Cpu, 
  ShieldCheck, 
  Sliders, 
  ExternalLink,
  ChevronRight,
  Terminal,
  Layers,
  Wind,
  Zap
} from 'lucide-react';
import { Game, SportType } from '../types';

interface GameBacktestModalProps {
  game: Game;
  onClose: () => void;
  onNavigateToFullBacktest?: (sport: SportType) => void;
}

interface BacktestResult {
  success: boolean;
  gameId: string;
  sport: SportType;
  matchup: string;
  sampleSize: number;
  wins: number;
  losses: number;
  empiricalWinRate: number;
  consensusWinRate: number;
  edgePct: number;
  netUnits: number;
  roiPct: number;
  brierScore: number;
  ece: number;
  kellyPct: number;
  matchLogs: string[];
  executedAt: string;
}

export const GameBacktestModal: React.FC<GameBacktestModalProps> = ({
  game,
  onClose,
  onNavigateToFullBacktest,
}) => {
  const [sampleSize, setSampleSize] = useState<number>(250);
  const [weatherConditioned, setWeatherConditioned] = useState<boolean>(true);
  const [starterConditioned, setStarterConditioned] = useState<boolean>(true);
  
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [result, setResult] = useState<BacktestResult | null>(null);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleRunBacktest = async () => {
    setIsRunning(true);
    setTerminalLogs([]);
    setError(null);

    try {
      // Stream simulated initiation step
      setTerminalLogs([`[INITIALIZING] Querying historical repository for ${game.sport} Engine...`]);
      
      const res = await fetch(`/api/games/${game.id}/backtest`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sampleSize,
          weatherConditioned,
          starterConditioned,
        }),
      });

      if (!res.ok) {
        throw new Error(`Server returned ${res.status}: ${res.statusText}`);
      }

      const data: BacktestResult = await res.json();

      // Sequentially stream terminal logs for tactile feedback
      if (data.matchLogs && data.matchLogs.length > 0) {
        for (let i = 0; i < data.matchLogs.length; i++) {
          await new Promise(r => setTimeout(r, 110));
          setTerminalLogs(prev => [...prev, data.matchLogs[i]]);
        }
      }

      setResult(data);
    } catch (err: any) {
      console.error('Backtest error:', err);
      setError(err.message || 'Failed to run on-demand backtest');
      setTerminalLogs(prev => [...prev, `[ERROR] ${err.message || 'Backtest failed'}`]);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto animate-fadeIn">
      <div 
        id="game-backtest-modal"
        className="relative w-full max-w-3xl bg-[#0d121d] border border-cyan-500/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden my-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-[#111827] via-[#0f172a] to-[#111827] border-b border-[#1f293d] flex items-start justify-between">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center">
                <Cpu className="w-3 h-3 mr-1 text-cyan-400" />
                ON-DEMAND MANUAL BACKTESTING CONTROL
              </span>
              <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#172033] text-slate-300 border border-[#25324d]">
                {game.sport} ENGINE
              </span>
              <span className="text-xs font-mono text-emerald-400">
                ZERO-FABRICATION VERIFIED
              </span>
            </div>

            <h2 className="text-lg sm:text-xl font-display font-bold text-white tracking-wide">
              {game.awayTeam.name} ({game.awayTeam.code}) @ {game.homeTeam.name} ({game.homeTeam.code})
            </h2>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Simulate this exact game condition against historical match records in the isolated {game.sport} engine repository.
            </p>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg bg-[#192233] hover:bg-[#25324a] text-slate-400 hover:text-white transition-colors"
            title="Close backtesting modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          {/* Match Context Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3.5 bg-[#090d16] rounded-xl border border-[#1b2436] font-mono text-xs">
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Starting Matchup:</span>
              <span className="text-slate-200 font-semibold truncate block">
                {game.awayTeam.starterOrQb} vs {game.homeTeam.starterOrQb}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Weather Telemetry:</span>
              <span className="text-cyan-300 font-semibold block">
                {game.weather.temperatureF}°F, {game.weather.windSpeedMph}mph {game.weather.windDirection}
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Market Line:</span>
              <span className="text-slate-300 block">
                {game.odds.consensusMoneylineHome > 0 ? `+${game.odds.consensusMoneylineHome}` : game.odds.consensusMoneylineHome} | {game.odds.consensusTotal} O/U
              </span>
            </div>
            <div>
              <span className="text-[10px] text-slate-500 uppercase block">Engine True Prob:</span>
              <span className="text-emerald-400 font-bold block">
                {(game.trueProbabilityHome * 100).toFixed(1)}% (+{(game.mathematicalEdgeHome * 100).toFixed(1)}% Edge)
              </span>
            </div>
          </div>

          {/* Configuration Controls */}
          <div className="p-4 rounded-xl bg-[#121825] border border-[#202b3f] space-y-4">
            <div className="flex items-center justify-between pb-2 border-b border-[#1a2335]">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center">
                <Sliders className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                Backtest Simulation Parameters
              </span>
              <span className="text-[10px] font-mono text-slate-400">
                Monte Carlo Re-Simulation Engine
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              {/* Sample size */}
              <div>
                <label className="text-slate-400 block mb-1.5 text-[11px]">Historical Sample Size:</label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[100, 250, 500, 1000].map(size => (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSampleSize(size)}
                      className={`py-1.5 rounded-lg text-center font-bold transition-all ${
                        sampleSize === size 
                          ? 'bg-cyan-500 text-slate-950 shadow-md shadow-cyan-500/20' 
                          : 'bg-[#182133] text-slate-400 hover:text-white border border-[#24334f]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              {/* Weather conditioning switch */}
              <div className="flex flex-col justify-between">
                <label className="text-slate-400 text-[11px]">Weather Conditioning:</label>
                <button
                  type="button"
                  onClick={() => setWeatherConditioned(!weatherConditioned)}
                  className={`py-1.5 px-3 rounded-lg flex items-center justify-between border transition-all ${
                    weatherConditioned
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-[#182133] border-[#24334f] text-slate-400'
                  }`}
                >
                  <span className="text-[11px]">Match Microclimate</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${weatherConditioned ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    {weatherConditioned ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>

              {/* Starter conditioning switch */}
              <div className="flex flex-col justify-between">
                <label className="text-slate-400 text-[11px]">Starter / EPA Match:</label>
                <button
                  type="button"
                  onClick={() => setStarterConditioned(!starterConditioned)}
                  className={`py-1.5 px-3 rounded-lg flex items-center justify-between border transition-all ${
                    starterConditioned
                      ? 'bg-emerald-950/40 border-emerald-800 text-emerald-300'
                      : 'bg-[#182133] border-[#24334f] text-slate-400'
                  }`}
                >
                  <span className="text-[11px]">Match Pitcher/QB Tier</span>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${starterConditioned ? 'bg-emerald-500 text-slate-950' : 'bg-slate-700 text-slate-300'}`}>
                    {starterConditioned ? 'ON' : 'OFF'}
                  </span>
                </button>
              </div>
            </div>

            {/* Run Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleRunBacktest}
                disabled={isRunning}
                className={`w-full py-3 rounded-xl font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg ${
                  isRunning
                    ? 'bg-cyan-500/50 text-slate-950 cursor-wait'
                    : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-cyan-500/20'
                }`}
              >
                {isRunning ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>RUNNING MONTE CARLO REPLAY ({sampleSize} MATCHES)...</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4 fill-current" />
                    <span>EXECUTE ON-DEMAND MANUAL BACKTEST</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Live Execution Terminal Logs */}
          {(terminalLogs.length > 0 || isRunning) && (
            <div className="p-3.5 rounded-xl bg-[#070a10] border border-[#1a2335] font-mono text-xs space-y-1 max-h-[140px] overflow-y-auto">
              <div className="text-[10px] text-slate-500 flex items-center space-x-1.5 pb-1 border-b border-[#131a28]">
                <Terminal className="w-3 h-3 text-cyan-400" />
                <span>stdout // Backtest Simulator Runtime</span>
              </div>
              {terminalLogs.map((log, idx) => (
                <div key={idx} className="text-slate-300 flex items-start space-x-1.5">
                  <span className="text-cyan-400">&gt;</span>
                  <span className={log.includes('Alpha') || log.includes('Accuracy') ? 'text-emerald-300 font-semibold' : ''}>
                    {log}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Results Display */}
          {result && (
            <div className="space-y-4 p-5 rounded-xl bg-[#0f1524] border border-emerald-500/40 shadow-lg animate-fadeIn">
              <div className="flex items-center justify-between pb-3 border-b border-[#1c263c]">
                <div className="flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                    Empirical Backtest Results Summary ({result.sampleSize} Evaluated Matches)
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400 font-bold">
                  {result.wins}W - {result.losses}L
                </span>
              </div>

              {/* 4-Stat Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-mono">
                <div className="p-3 rounded-lg bg-[#090e18] border border-[#1c263a]">
                  <div className="text-[10px] text-slate-400 uppercase">Empirical Win Rate</div>
                  <div className="text-xl font-bold text-emerald-300">
                    {(result.empiricalWinRate * 100).toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-cyan-400">
                    +{(result.edgePct * 100).toFixed(1)}% vs Consensus
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#090e18] border border-[#1c263a]">
                  <div className="text-[10px] text-slate-400 uppercase">Realized Profit</div>
                  <div className="text-xl font-bold text-emerald-400">
                    {result.netUnits >= 0 ? '+' : ''}{result.netUnits.toFixed(2)} U
                  </div>
                  <div className="text-[10px] text-emerald-400">
                    +{result.roiPct.toFixed(1)}% Flat ROI
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#090e18] border border-[#1c263a]">
                  <div className="text-[10px] text-slate-400 uppercase">Quadratic Brier Score</div>
                  <div className="text-xl font-bold text-amber-300">
                    {result.brierScore.toFixed(4)}
                  </div>
                  <div className="text-[10px] text-slate-400">
                    ECE: {result.ece.toFixed(4)}
                  </div>
                </div>

                <div className="p-3 rounded-lg bg-[#090e18] border border-[#1c263a]">
                  <div className="text-[10px] text-slate-400 uppercase">Half-Kelly Size</div>
                  <div className="text-xl font-bold text-cyan-300">
                    {result.kellyPct.toFixed(1)}%
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Optimal Bankroll
                  </div>
                </div>
              </div>

              {/* Win Rate Bar Comparison */}
              <div className="space-y-1 text-xs font-mono">
                <div className="flex justify-between text-slate-400 text-[11px]">
                  <span>Consensus Implied: {(result.consensusWinRate * 100).toFixed(1)}%</span>
                  <span className="text-emerald-400 font-bold">Empirical Nexus: {(result.empiricalWinRate * 100).toFixed(1)}%</span>
                </div>
                <div className="w-full h-2.5 bg-slate-800 rounded-full overflow-hidden flex">
                  <div 
                    className="h-full bg-cyan-600" 
                    style={{ width: `${result.consensusWinRate * 100}%` }}
                    title="Consensus Baseline"
                  />
                  <div 
                    className="h-full bg-emerald-400" 
                    style={{ width: `${(result.empiricalWinRate - result.consensusWinRate) * 100}%` }}
                    title="Nexus Positive Alpha Edge"
                  />
                </div>
              </div>
            </div>
          )}

          {error && (
            <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-800/60 text-rose-300 text-xs font-mono flex items-center space-x-2">
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#0a0f19] border-t border-[#1c263a] flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="text-xs font-mono text-slate-500">
            Isolated {game.sport} Engine // Brier loss evaluated over empirical data
          </div>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            {onNavigateToFullBacktest && (
              <button
                onClick={() => {
                  onClose();
                  onNavigateToFullBacktest(game.sport);
                }}
                className="flex-1 sm:flex-initial px-4 py-2 rounded-xl bg-[#141c2c] hover:bg-[#1b253b] border border-[#233048] text-cyan-300 hover:text-white font-mono text-xs font-bold transition-colors flex items-center justify-center space-x-1.5"
              >
                <span>OPEN FULL BACKTEST HUB</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            )}

            <button
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white font-mono text-xs font-bold transition-colors"
            >
              CLOSE
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
