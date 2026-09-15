import React, { useState, useEffect } from 'react';
import { 
  Search, 
  X, 
  Zap, 
  Activity, 
  Calendar, 
  MapPin, 
  ChevronRight, 
  Sliders, 
  Cpu, 
  Flame, 
  Filter 
} from 'lucide-react';
import { MatchSearchResult, SportType } from '../types';

interface MatchSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectGame?: (gameId: string) => void;
  onSelectTableTennisMatch?: (matchId: string) => void;
  onLaunchTtSim?: (p1Name: string, p2Name: string, totalLine?: number) => void;
  onOpenBacktest?: (gameId: string) => void;
  onOpenCalibrate?: (gameId: string) => void;
  onSelectMatch?: (match: MatchSearchResult) => void;
  onSelectPlayer?: (playerName: string) => void;
}

export const MatchSearchModal: React.FC<MatchSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectGame,
  onSelectTableTennisMatch,
  onLaunchTtSim,
  onOpenBacktest,
  onOpenCalibrate,
  onSelectMatch,
  onSelectPlayer,
}) => {
  const [query, setQuery] = useState('');
  const [sportFilter, setSportFilter] = useState<SportType | 'ALL'>('ALL');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINAL'>('ALL');
  const [results, setResults] = useState<MatchSearchResult[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isOpen) return;

    const fetchResults = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (query.trim()) params.append('q', query.trim());
        if (sportFilter !== 'ALL') params.append('sport', sportFilter);
        if (statusFilter !== 'ALL') params.append('status', statusFilter);

        const res = await fetch(`/api/matches/search?${params.toString()}`);
        if (res.ok) {
          const data = await res.json();
          setResults(Array.isArray(data) ? data : []);
        }
      } catch (err) {
        console.warn('Match search sync notice (re-trying):', err);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchResults, 120);
    return () => clearTimeout(timer);
  }, [isOpen, query, sportFilter, statusFilter]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
      <div 
        className="w-full max-w-3xl bg-[#0d121c] border border-[#222e44] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] mt-2 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header / Search Input */}
        <div className="p-3 sm:p-4 border-b border-[#1c273a] bg-[#111724]">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider">
              <Search className="w-4 h-4" />
              <span>Universal Cross-Sport Match Search</span>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search team, player (Truls, Tkachenko, Judge, Mahomes), league or table..."
              autoFocus
              className="w-full pl-10 pr-10 py-2.5 bg-[#161f30] border border-[#27364f] rounded-xl text-white font-mono text-sm placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/70"
            />
            {query && (
              <button
                onClick={() => setQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white text-xs font-mono"
              >
                Clear
              </button>
            )}
          </div>

          {/* Quick Filters */}
          <div className="flex flex-wrap items-center gap-2 mt-3 pt-2 border-t border-[#182335]">
            <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 mr-1">
              <Filter className="w-3 h-3 text-cyan-400" />
              <span>Sport:</span>
            </div>
            {(['ALL', 'TABLE_TENNIS', 'MLB', 'NFL', 'CFB'] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => setSportFilter(sp)}
                className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-medium transition-all ${
                  sportFilter === sp
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/50 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {sp === 'TABLE_TENNIS' ? '🏓 Table Tennis' : sp === 'ALL' ? 'All Sports' : sp}
              </button>
            ))}

            <div className="hidden sm:inline-block text-slate-600 mx-1">|</div>

            <div className="flex items-center space-x-1 text-[11px] font-mono text-slate-400 mr-1">
              <span>Status:</span>
            </div>
            {(['ALL', 'LIVE', 'UPCOMING', 'FINAL'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-2 py-0.5 rounded text-[10px] font-mono uppercase font-medium transition-all ${
                  statusFilter === st
                    ? 'bg-slate-200 text-slate-900 font-bold'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                {st}
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {loading ? (
            <div className="py-12 text-center text-slate-400 font-mono text-xs">
              <Cpu className="w-6 h-6 mx-auto mb-2 text-cyan-400 animate-spin" />
              Searching cross-engine match datasets...
            </div>
          ) : results.length === 0 ? (
            <div className="py-12 text-center text-slate-500 font-mono text-xs">
              No matches found matching query "{query}". Try searching for player or team names.
            </div>
          ) : (
            results.map((m) => (
              <div
                key={`${m.sport}-${m.id}`}
                className="p-3.5 rounded-xl bg-[#121824] border border-[#1e293c] hover:border-cyan-500/40 transition-all flex flex-col gap-2.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 text-xs font-mono">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                      m.status === 'LIVE' ? 'bg-red-950 text-red-300 border border-red-800 animate-pulse' :
                      m.status === 'FINAL' ? 'bg-slate-800 text-slate-400' :
                      'bg-cyan-950 text-cyan-300 border border-cyan-800'
                    }`}>
                      {m.scheduledTime}
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-[#1a2538] text-cyan-300 font-semibold text-[10px]">
                      {m.sport === 'TABLE_TENNIS' ? 'TABLE TENNIS' : m.sport}
                    </span>
                    <span className="text-slate-400 text-[11px] truncate max-w-[220px]">
                      {m.tournamentOrLeague}
                    </span>
                  </div>

                  <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                    <MapPin className="w-3 h-3 text-slate-500" />
                    <span>{m.venueOrTable}</span>
                  </div>
                </div>

                {/* Matchup Title & Subtitle */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div>
                    <h4 className="text-sm sm:text-base font-bold text-white font-display">
                      {m.matchupTitle}
                    </h4>
                    <p className="text-xs font-mono text-slate-400 mt-0.5">
                      {m.subTitle}
                    </p>
                    {m.liveScoreSummary && (
                      <div className="mt-1 text-xs font-mono font-semibold text-amber-300 flex items-center space-x-1.5">
                        <Activity className="w-3.5 h-3.5 text-red-400 animate-pulse" />
                        <span>{m.liveScoreSummary}</span>
                      </div>
                    )}
                  </div>

                  {/* Market Details Tag */}
                  <div className="font-mono text-right shrink-0">
                    <span className="text-xs font-bold text-cyan-300 bg-[#162133] px-2.5 py-1 rounded border border-[#24344d]">
                      {m.marketDetails.primaryLine}
                    </span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex items-center justify-end space-x-2 pt-2 border-t border-[#1a2537]">
                  {m.sport === 'TABLE_TENNIS' ? (
                    <>
                      <button
                        onClick={() => {
                          if (onSelectMatch) onSelectMatch(m);
                          const parts = m.matchupTitle.split(' vs ');
                          if (onLaunchTtSim && parts.length === 2) {
                            onLaunchTtSim(parts[0].trim(), parts[1].trim(), m.marketDetails.totalLine);
                          } else if (onSelectTableTennisMatch && m.rawTtMatchId) {
                            onSelectTableTennisMatch(m.rawTtMatchId);
                          }
                          onClose();
                        }}
                        className="px-3 py-1.5 rounded-lg bg-cyan-600/30 hover:bg-cyan-600/50 border border-cyan-500/50 text-cyan-300 font-mono text-xs font-bold flex items-center space-x-1.5 transition-colors"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-300" />
                        <span>Simulate 50,000 Points</span>
                      </button>
                    </>
                  ) : (
                    <>
                      {onOpenBacktest && m.rawGameId && (
                        <button
                          onClick={() => {
                            onOpenBacktest(m.rawGameId!);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-1"
                        >
                          <Activity className="w-3 h-3 text-cyan-400" />
                          <span>Backtest Profile</span>
                        </button>
                      )}
                      {onOpenCalibrate && m.rawGameId && (
                        <button
                          onClick={() => {
                            onOpenCalibrate(m.rawGameId!);
                            onClose();
                          }}
                          className="px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-200 font-mono text-xs flex items-center space-x-1"
                        >
                          <Sliders className="w-3 h-3 text-amber-400" />
                          <span>Tune Weights</span>
                        </button>
                      )}
                      {onSelectGame && m.rawGameId && (
                        <button
                          onClick={() => {
                            if (onSelectMatch) onSelectMatch(m);
                            onSelectGame(m.rawGameId!);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1"
                        >
                          <span>Inspect Matchup</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                      {!onSelectGame && onSelectMatch && (
                        <button
                          onClick={() => {
                            onSelectMatch(m);
                            onClose();
                          }}
                          className="px-3 py-1.5 rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1"
                        >
                          <span>Inspect Matchup</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0f18] border-t border-[#1a2537] flex items-center justify-between text-[11px] font-mono text-slate-500">
          <span>Total matches indexed: {results.length}</span>
          <span className="hidden sm:inline">Press ESC to dismiss</span>
        </div>
      </div>
    </div>
  );
};
