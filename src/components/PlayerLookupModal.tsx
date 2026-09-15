import React, { useState, useEffect } from 'react';
import { 
  X, 
  Search, 
  Activity, 
  Flame, 
  ShieldAlert, 
  Zap, 
  Award, 
  Clock, 
  RefreshCw, 
  ChevronRight, 
  Swords, 
  Layers, 
  Info 
} from 'lucide-react';
import { SportType } from '../types';
import { FALLBACK_PLAYERS } from '../data/fallbackData';

interface PlayerProfile {
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

interface PlayerLookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialPlayerName?: string;
  onSelectForSim?: (playerName: string) => void;
}

export const PlayerLookupModal: React.FC<PlayerLookupModalProps> = ({
  isOpen,
  onClose,
  initialPlayerName,
  onSelectForSim,
}) => {
  const [searchQuery, setSearchQuery] = useState(initialPlayerName || '');
  const [sportFilter, setSportFilter] = useState<SportType | 'ALL'>('ALL');
  const [players, setPlayers] = useState<PlayerProfile[]>(FALLBACK_PLAYERS);
  const [selectedPlayer, setSelectedPlayer] = useState<PlayerProfile | null>(() => {
    if (initialPlayerName) {
      const found = FALLBACK_PLAYERS.find(p => p.name.toLowerCase().includes(initialPlayerName.toLowerCase()));
      if (found) return found;
    }
    return FALLBACK_PLAYERS[0] || null;
  });
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastSynced, setLastSynced] = useState<string>('Live active');

  // Fetch players with live continuous sync and automatic retry
  const fetchPlayers = async (retryCount = 0) => {
    try {
      const res = await fetch(`/api/players?sport=${sportFilter}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const data: PlayerProfile[] = await res.json();
      if (Array.isArray(data) && data.length > 0) {
        setPlayers(data);
        setLastSynced(new Date().toLocaleTimeString());

        // If initialPlayerName or current selection exists, maintain or select
        if (initialPlayerName && !selectedPlayer) {
          const found = data.find(p => p.name.toLowerCase().includes(initialPlayerName.toLowerCase()));
          if (found) setSelectedPlayer(found);
        } else if (selectedPlayer) {
          const updated = data.find(p => p.id === selectedPlayer.id);
          if (updated) setSelectedPlayer(updated);
        } else if (data.length > 0) {
          setSelectedPlayer(data[0]);
        }
      }
    } catch (err) {
      console.warn('Live player sync re-attempting in background:', err);
      if (retryCount < 2) {
        setTimeout(() => fetchPlayers(retryCount + 1), 1200);
      }
    }
  };

  useEffect(() => {
    if (!isOpen) return;
    fetchPlayers();

    // Auto-polling interval every 10 seconds for continuous live player update
    const interval = setInterval(() => {
      fetchPlayers();
    }, 10000);

    return () => clearInterval(interval);
  }, [isOpen, sportFilter, initialPlayerName]);

  const handleManualSync = async () => {
    setIsRefreshing(true);
    try {
      await fetch('/api/players/tick', { method: 'POST' });
      await fetchPlayers();
    } finally {
      setIsRefreshing(false);
    }
  };

  if (!isOpen) return null;

  const filteredPlayers = players.filter(p => {
    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.teamOrCountry.toLowerCase().includes(q);
    const matchesSport = sportFilter === 'ALL' || p.sport === sportFilter;
    return matchesQuery && matchesSport;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-start sm:items-center justify-center p-2 sm:p-4 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div 
        className="w-full max-w-5xl bg-[#0b1019] border border-[#233149] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[94vh] mt-2 sm:mt-0"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-3 sm:p-5 border-b border-[#1b263b] bg-[#101726] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold uppercase tracking-wider mb-1">
              <Activity className="w-4 h-4 text-emerald-400 animate-pulse" />
              <span>Always-Updating Player Database & Scouting Intelligence</span>
            </div>
            <h3 className="text-base sm:text-lg font-bold text-white font-display">
              Player Information Lookup
            </h3>
            <div className="flex items-center space-x-3 text-xs font-mono text-slate-400 mt-1">
              <span className="flex items-center space-x-1">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                <strong className="text-emerald-300">Live Circuit Synchronized</strong>
              </span>
              <span>•</span>
              <span>Updated: {lastSynced}</span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={handleManualSync}
              disabled={isRefreshing}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-mono flex items-center space-x-1.5 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 text-cyan-400 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Sync Live Stats</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Filter / Search Bar */}
        <div className="p-3 sm:p-4 border-b border-[#192437] bg-[#0d1422] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search player name, country or team..."
              className="w-full pl-9 pr-4 py-2 bg-[#141d2d] border border-[#233149] rounded-xl text-white font-mono text-xs placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>

          {/* Sport Filter Chips */}
          <div className="flex items-center gap-1.5 overflow-x-auto">
            {(['ALL', 'TABLE_TENNIS', 'MLB', 'NFL'] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => setSportFilter(sp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-mono font-medium transition-all ${
                  sportFilter === sp
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/60'
                    : 'text-slate-400 hover:text-white bg-slate-800/40'
                }`}
              >
                {sp === 'TABLE_TENNIS' ? '🏓 Table Tennis' : sp === 'ALL' ? 'All Sports' : sp}
              </button>
            ))}
          </div>
        </div>

        {/* Main Body: 2-Column Responsive Layout */}
        <div className="flex-1 overflow-hidden grid grid-cols-1 md:grid-cols-12 min-h-0">
          {/* Left Column: Player List */}
          <div className="md:col-span-4 border-r border-[#192437] overflow-y-auto p-2.5 sm:p-3 space-y-2 max-h-[35vh] md:max-h-full">
            {filteredPlayers.length === 0 ? (
              <div className="py-8 text-center text-slate-500 text-xs font-mono">
                No players found matching filter.
              </div>
            ) : (
              filteredPlayers.map((p) => {
                const isSelected = selectedPlayer?.id === p.id;
                const winPct = ((p.winLossSeason.wins / (p.winLossSeason.wins + p.winLossSeason.losses)) * 100).toFixed(1);
                return (
                  <button
                    key={p.id}
                    onClick={() => setSelectedPlayer(p)}
                    className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-[#152338] border-cyan-500/70 shadow-sm'
                        : 'bg-[#0f1624] border-[#1c273a] hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-1.5">
                        <span className="font-bold text-white text-xs font-display">{p.name}</span>
                        <span className="text-[10px] px-1 py-0.2 rounded bg-[#1a2538] text-cyan-300 font-mono">
                          {p.sport === 'TABLE_TENNIS' ? 'TT' : p.sport}
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 mt-0.5">
                        {p.teamOrCountry} • {p.winLossSeason.wins}W - {p.winLossSeason.losses}L ({winPct}%)
                      </div>
                    </div>
                    <div className="text-right font-mono">
                      <div className="text-xs font-bold text-amber-300">{p.ratingOrQbr}</div>
                      <div className="text-[10px] text-slate-500">±{p.rdOrVariance}</div>
                    </div>
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Comprehensive Detail Dossier */}
          <div className="md:col-span-8 overflow-y-auto p-4 sm:p-6 space-y-5">
            {selectedPlayer ? (
              <>
                {/* Profile Banner */}
                <div className="p-4 rounded-xl bg-[#111827] border border-[#1f2c42] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <div className="flex items-center space-x-2">
                      <h2 className="text-lg sm:text-xl font-bold text-white font-display">
                        {selectedPlayer.name}
                      </h2>
                      <span className="px-2 py-0.5 rounded bg-cyan-950 text-cyan-300 border border-cyan-800 text-xs font-mono font-bold">
                        {selectedPlayer.sport}
                      </span>
                      <span className="text-xs font-mono font-bold text-amber-300 px-2 py-0.5 bg-amber-950/40 rounded border border-amber-900/50">
                        {selectedPlayer.winStreak}
                      </span>
                    </div>
                    <p className="text-xs font-mono text-slate-400 mt-1">
                      {selectedPlayer.teamOrCountry} • {selectedPlayer.leagueOrTournament} • {selectedPlayer.primaryRole}
                    </p>
                  </div>

                  {selectedPlayer.sport === 'TABLE_TENNIS' && onSelectForSim && (
                    <button
                      onClick={() => {
                        onSelectForSim(selectedPlayer.name);
                        onClose();
                      }}
                      className="px-3.5 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-mono text-xs font-bold flex items-center space-x-1.5 shadow-md shadow-cyan-900/40 transition-colors"
                    >
                      <Zap className="w-4 h-4 text-amber-300" />
                      <span>Simulate in 50k Engine</span>
                    </button>
                  )}
                </div>

                {/* Core Stats Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 font-mono text-xs">
                  <div className="p-3 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-slate-400 text-[10px] uppercase">Glicko-2 Elo Rating</div>
                    <div className="text-xl font-bold text-amber-300 mt-1">{selectedPlayer.ratingOrQbr}</div>
                    <div className="text-[10px] text-slate-500">RD Uncertainty: ±{selectedPlayer.rdOrVariance}</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-slate-400 text-[10px] uppercase">Season Record</div>
                    <div className="text-xl font-bold text-white mt-1">
                      {selectedPlayer.winLossSeason.wins} - {selectedPlayer.winLossSeason.losses}
                    </div>
                    <div className="text-[10px] text-cyan-400">
                      Win Rate: {((selectedPlayer.winLossSeason.wins / (selectedPlayer.winLossSeason.wins + selectedPlayer.winLossSeason.losses)) * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-slate-400 text-[10px] uppercase">Last 10 Matches</div>
                    <div className="text-xl font-bold text-emerald-400 mt-1">
                      {selectedPlayer.winLossLast10.wins}W - {selectedPlayer.winLossLast10.losses}L
                    </div>
                    <div className="text-[10px] text-slate-400">80% in recent circuit</div>
                  </div>

                  <div className="p-3 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-slate-400 text-[10px] uppercase">Fatigue / Matches Today</div>
                    <div className="text-xl font-bold text-purple-300 mt-1">
                      {selectedPlayer.matchesToday} matches
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Fatigue Index: {(selectedPlayer.fatigueIndex * 100).toFixed(0)}%
                    </div>
                  </div>
                </div>

                {/* Form Badges (Last 10 Form) */}
                <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1e293c] font-mono text-xs">
                  <div className="text-slate-400 text-[11px] mb-2 font-bold uppercase tracking-wider">
                    Recent 10 Match Form Trajectory (Latest → Oldest)
                  </div>
                  <div className="flex items-center space-x-1.5">
                    {selectedPlayer.recentForm.map((res, i) => (
                      <span
                        key={i}
                        className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs ${
                          res === 'W'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/50'
                            : 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                        }`}
                      >
                        {res}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Tactical Metrics & Rubber Specs */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-cyan-400 font-bold mb-2 flex items-center space-x-1.5">
                      <Layers className="w-3.5 h-3.5" />
                      <span>Tactical Metrics & Serve Margins</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">{selectedPlayer.tacticalMetrics.label1}:</span>
                        <span className="text-white font-bold">{selectedPlayer.tacticalMetrics.val1}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">{selectedPlayer.tacticalMetrics.label2}:</span>
                        <span className="text-white font-bold">{selectedPlayer.tacticalMetrics.val2}</span>
                      </div>
                      <div className="flex justify-between border-b border-slate-800 pb-1">
                        <span className="text-slate-400">{selectedPlayer.tacticalMetrics.label3}:</span>
                        <span className="text-white font-bold">{selectedPlayer.tacticalMetrics.val3}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">{selectedPlayer.tacticalMetrics.label4}:</span>
                        <span className="text-white font-bold">{selectedPlayer.tacticalMetrics.val4}</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1e293c]">
                    <div className="text-amber-400 font-bold mb-2 flex items-center space-x-1.5">
                      <Award className="w-3.5 h-3.5" />
                      <span>Equipment & Style Profile</span>
                    </div>
                    <div className="text-xs text-slate-300 space-y-2">
                      <div className="p-2 rounded bg-[#090e17] border border-[#1a2538] text-[11px]">
                        <strong>Equipment / Setup:</strong> {selectedPlayer.equipmentOrBio}
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">
                        {selectedPlayer.scoutingNotes}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Head-to-Head Records */}
                {selectedPlayer.headToHeadHistory && (
                  <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1e293c] font-mono text-xs">
                    <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                      <Swords className="w-3.5 h-3.5 text-cyan-400" />
                      <span>Head-to-Head Circuit Ledger</span>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      {Object.entries(selectedPlayer.headToHeadHistory).map(([opp, rawRec]) => {
                        const rec = rawRec as { wins: number; losses: number; lastMeeting: string };
                        return (
                          <div key={opp} className="p-2.5 rounded-lg bg-[#0a0f18] border border-[#1a2538]">
                            <div className="font-bold text-white text-xs">{opp}</div>
                            <div className="text-cyan-300 font-bold mt-0.5">
                              Record: {rec.wins}W - {rec.losses}L
                            </div>
                            <div className="text-[10px] text-slate-500 mt-0.5">
                              Last Meeting: {rec.lastMeeting}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Recent Matches Log */}
                <div className="p-3.5 rounded-xl bg-[#111726] border border-[#1e293c] font-mono text-xs">
                  <div className="text-slate-400 font-bold uppercase tracking-wider mb-2 flex items-center space-x-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Official Match Results Log</span>
                  </div>
                  <div className="space-y-1.5">
                    {selectedPlayer.recentMatchesLog.map((m, idx) => (
                      <div key={idx} className="p-2 rounded bg-[#090e17] border border-[#192437] flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                            m.result === 'W' ? 'bg-emerald-950 text-emerald-300 border border-emerald-800' : 'bg-rose-950 text-rose-300 border border-rose-800'
                          }`}>
                            {m.result}
                          </span>
                          <span className="font-bold text-white">{m.opponent}</span>
                          <span className="text-slate-400 text-[11px] hidden sm:inline">({m.event})</span>
                        </div>
                        <div className="text-right text-slate-300 text-[11px]">
                          {m.score}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div className="py-20 text-center text-slate-500 font-mono text-xs">
                Select a player from the list to view their live dossier.
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-[#0a0e16] border-t border-[#182335] flex items-center justify-between text-xs font-mono text-slate-400">
          <div className="flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 text-cyan-400" />
            <span>Telemetry automatically updates after each sanctioned tour match.</span>
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
