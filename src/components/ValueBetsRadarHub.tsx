import React, { useState, useMemo } from 'react';
import { 
  Zap, 
  TrendingUp, 
  Filter, 
  DollarSign, 
  Percent, 
  CheckCircle2, 
  Bookmark, 
  BookmarkCheck, 
  Copy, 
  Check, 
  ArrowUpRight, 
  Sliders, 
  ShieldCheck, 
  Activity, 
  Trophy, 
  Info,
  Calendar,
  Layers,
  ChevronDown
} from 'lucide-react';
import { Game, SportType } from '../types';

interface ValueBetsRadarHubProps {
  games: Game[];
  onNavigateToGame: (gameId: string, sport: SportType) => void;
  onNavigateToTableTennis: () => void;
}

interface ValueOpportunity {
  id: string;
  sport: SportType | 'TABLE_TENNIS';
  gameId?: string;
  matchup: string;
  marketType: string;
  selection: string;
  marketOdds: string | number;
  marketOddsNum: number;
  consensusImpliedProb: number;
  trueFairProb: number;
  edgePercentage: number;
  evRoi: number;
  status: 'LIVE' | 'UPCOMING';
  scheduledTime: string;
  algorithmicDriver: string;
  confidenceScore: number;
}

export const ValueBetsRadarHub: React.FC<ValueBetsRadarHubProps> = ({
  games,
  onNavigateToGame,
  onNavigateToTableTennis,
}) => {
  // Filters
  const [selectedSport, setSelectedSport] = useState<string>('ALL');
  const [minEdge, setMinEdge] = useState<number>(4.0);
  const [marketFilter, setMarketFilter] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Bankroll & Kelly Calculator
  const [bankroll, setBankroll] = useState<number>(2500);
  const [kellyFraction, setKellyFraction] = useState<number>(0.25); // Quarter-Kelly default

  // Locked Selections (Slip)
  const [lockedSlips, setLockedSlips] = useState<Record<string, ValueOpportunity>>({});
  const [copiedSlip, setCopiedSlip] = useState<boolean>(false);

  // Compile all value plays across games + table tennis
  const opportunities = useMemo<ValueOpportunity[]>(() => {
    const list: ValueOpportunity[] = [];

    // 1. Ingest from standard sports (MLB, NFL, CFB)
    games.forEach(g => {
      // Game-level moneyline edge
      const homeEdge = (g.trueProbabilityHome - g.consensusImpliedProbabilityHome) * 100;
      const awayEdge = ((1 - g.trueProbabilityHome) - (1 - g.consensusImpliedProbabilityHome)) * 100;

      if (homeEdge > 2.5) {
        const decOdds = g.consensusOddsHome > 0 ? (g.consensusOddsHome / 100) + 1 : (100 / Math.abs(g.consensusOddsHome)) + 1;
        const ev = ((g.trueProbabilityHome * decOdds) - 1) * 100;
        list.push({
          id: `${g.id}-ml-home`,
          sport: g.sport,
          gameId: g.id,
          matchup: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
          marketType: 'MONEYLINE',
          selection: `${g.homeTeam.name} Moneyline`,
          marketOdds: g.consensusOddsHome > 0 ? `+${g.consensusOddsHome}` : g.consensusOddsHome,
          marketOddsNum: g.consensusOddsHome,
          consensusImpliedProb: g.consensusImpliedProbabilityHome,
          trueFairProb: g.trueProbabilityHome,
          edgePercentage: +homeEdge.toFixed(1),
          evRoi: +ev.toFixed(1),
          status: g.status === 'LIVE' ? 'LIVE' : 'UPCOMING',
          scheduledTime: g.startTime,
          algorithmicDriver: g.sport === 'MLB' ? 'Statcast Exit Velocity & F5 Poisson' : g.sport === 'NFL' ? 'Dixon-Coles EPA Discrepancy' : 'Markov Possession Transition',
          confidenceScore: 88,
        });
      }

      if (awayEdge > 2.5) {
        const decOdds = g.consensusOddsAway > 0 ? (g.consensusOddsAway / 100) + 1 : (100 / Math.abs(g.consensusOddsAway)) + 1;
        const ev = (((1 - g.trueProbabilityHome) * decOdds) - 1) * 100;
        list.push({
          id: `${g.id}-ml-away`,
          sport: g.sport,
          gameId: g.id,
          matchup: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
          marketType: 'MONEYLINE',
          selection: `${g.awayTeam.name} Moneyline`,
          marketOdds: g.consensusOddsAway > 0 ? `+${g.consensusOddsAway}` : g.consensusOddsAway,
          marketOddsNum: g.consensusOddsAway,
          consensusImpliedProb: 1 - g.consensusImpliedProbabilityHome,
          trueFairProb: 1 - g.trueProbabilityHome,
          edgePercentage: +awayEdge.toFixed(1),
          evRoi: +ev.toFixed(1),
          status: g.status === 'LIVE' ? 'LIVE' : 'UPCOMING',
          scheduledTime: g.startTime,
          algorithmicDriver: g.sport === 'MLB' ? 'Bullpen Fatigue & Barometric Lift' : g.sport === 'NFL' ? 'Success Rate vs Cover-3' : 'Red Zone Turnover Ratio',
          confidenceScore: 84,
        });
      }

      // Prop and sub-market targets
      if (g.marketTargets && Array.isArray(g.marketTargets)) {
        g.marketTargets.forEach(t => {
          if (t.edgePercentage > 2.5) {
            const decOdds = t.consensusOdds > 0 ? (t.consensusOdds / 100) + 1 : (100 / Math.abs(t.consensusOdds)) + 1;
            const ev = ((t.fairProbability * decOdds) - 1) * 100;
            list.push({
              id: `${g.id}-prop-${t.id}`,
              sport: g.sport,
              gameId: g.id,
              matchup: `${g.awayTeam.name} @ ${g.homeTeam.name}`,
              marketType: t.type,
              selection: `${t.description} (${t.type})`,
              marketOdds: t.consensusOdds > 0 ? `+${t.consensusOdds}` : t.consensusOdds,
              marketOddsNum: t.consensusOdds,
              consensusImpliedProb: t.consensusProbability,
              trueFairProb: t.fairProbability,
              edgePercentage: +t.edgePercentage.toFixed(1),
              evRoi: +ev.toFixed(1),
              status: g.status === 'LIVE' ? 'LIVE' : 'UPCOMING',
              scheduledTime: g.startTime,
              algorithmicDriver: t.type === 'PITCHER_STRIKEOUTS' ? 'Statcast Whiff% & Called Strikes' : 'Point Spread Mean Distribution',
              confidenceScore: 91,
            });
          }
        });
      }
    });

    // 2. Add curated Table Tennis Value opportunities
    list.push(
      {
        id: 'tt-val-1',
        sport: 'TABLE_TENNIS',
        matchup: 'V. Vakulenko vs O. Yeremenko',
        marketType: 'MONEYLINE',
        selection: 'O. Yeremenko Moneyline',
        marketOdds: '+115',
        marketOddsNum: 115,
        consensusImpliedProb: 0.465,
        trueFairProb: 0.548,
        edgePercentage: 8.3,
        evRoi: 17.8,
        status: 'UPCOMING',
        scheduledTime: 'Today 20:30 UTC',
        algorithmicDriver: 'Long-Pips Defensive Style Clash vs Tired Opponent (4th Match Today)',
        confidenceScore: 92,
      },
      {
        id: 'tt-val-2',
        sport: 'TABLE_TENNIS',
        matchup: 'Truls Möregårdh vs Hugo Calderano',
        marketType: 'TOTAL_POINTS',
        selection: 'Over 74.5 Match Total Points',
        marketOdds: '-110',
        marketOddsNum: -110,
        consensusImpliedProb: 0.524,
        trueFairProb: 0.598,
        edgePercentage: 7.4,
        evRoi: 14.1,
        status: 'UPCOMING',
        scheduledTime: 'Today 21:15 UTC',
        algorithmicDriver: '50,000 Monte Carlo Sim: 5-Set Match Variance in High-Spin Rally Duel',
        confidenceScore: 90,
      }
    );

    return list.sort((a, b) => b.edgePercentage - a.edgePercentage);
  }, [games]);

  // Filtered List
  const filteredOpportunities = useMemo(() => {
    return opportunities.filter(opp => {
      const matchesSport = selectedSport === 'ALL' || opp.sport === selectedSport;
      const matchesMinEdge = opp.edgePercentage >= minEdge;
      const matchesMarket = marketFilter === 'ALL' || opp.marketType === marketFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesQuery = !q || opp.matchup.toLowerCase().includes(q) || opp.selection.toLowerCase().includes(q);
      return matchesSport && matchesMinEdge && matchesMarket && matchesQuery;
    });
  }, [opportunities, selectedSport, minEdge, marketFilter, searchQuery]);

  // Kelly Sizing Calculator
  const calculateKellyStake = (opp: ValueOpportunity) => {
    const b = opp.marketOddsNum > 0 ? opp.marketOddsNum / 100 : 100 / Math.abs(opp.marketOddsNum);
    const p = opp.trueFairProb;
    const q = 1 - p;
    const rawKelly = (b * p - q) / b;
    const fractionKelly = Math.max(0, rawKelly * kellyFraction);
    const stakeDollars = Math.round(bankroll * fractionKelly);
    const units = (stakeDollars / (bankroll * 0.01)).toFixed(1);
    return { fractionKelly, stakeDollars, units };
  };

  const toggleLockSlip = (opp: ValueOpportunity) => {
    setLockedSlips(prev => {
      const next = { ...prev };
      if (next[opp.id]) {
        delete next[opp.id];
      } else {
        next[opp.id] = opp;
      }
      return next;
    });
  };

  const handleCopySlip = () => {
    const slips: ValueOpportunity[] = Object.values(lockedSlips);
    if (slips.length === 0) return;
    const text = slips
      .map(
        (s, idx) =>
          `${idx + 1}. [${s.sport}] ${s.selection} @ ${s.marketOdds} (Edge: +${s.edgePercentage}%, EV: +${s.evRoi}%) | Recommended Stake: $${calculateKellyStake(s).stakeDollars} (${calculateKellyStake(s).units}u)`
      )
      .join('\n');
    navigator.clipboard.writeText(`--- THE PREDICTION NEXUS: VALUE BETS SLIP ---\n${text}`);
    setCopiedSlip(true);
    setTimeout(() => setCopiedSlip(false), 2000);
  };

  const lockedList: ValueOpportunity[] = Object.values(lockedSlips);

  return (
    <div id="value-bets-radar-hub" className="space-y-6">
      {/* Header Banner */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f1729] to-[#0c1220] border border-[#1e2a42] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950/80 text-amber-300 border border-amber-700/60">
              <Zap className="w-3 h-3 mr-1 text-amber-400" />
              PURE +EV RADAR
            </span>
            <span className="text-xs font-mono text-slate-400">
              MATHEMATICAL DISCREPANCY & KELLY SIZING
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
            Active Value Bets & Edge Radar
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Real-time scanner isolating plays where true algorithmic probability exceeds consensus market odds.
          </p>
        </div>

        {/* Global Opportunities Summary Pills */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#080c14] border border-[#1b253b] text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Available Edges</div>
            <div className="text-base font-bold text-cyan-400">{opportunities.length} Plays</div>
          </div>
          <div className="px-3.5 py-2 rounded-xl bg-[#080c14] border border-[#1b253b] text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Max Edge</div>
            <div className="text-base font-bold text-emerald-400">
              +{opportunities[0]?.edgePercentage ?? '0.0'}%
            </div>
          </div>
        </div>
      </div>

      {/* Control Bar: Filters & Interactive Kelly Bankroll Calculator */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Filters */}
        <div className="lg:col-span-8 p-4 rounded-xl bg-[#0d1320] border border-[#1c273c] space-y-3.5">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#182338] pb-2.5">
            <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 text-cyan-400" />
              <span>MARKET FILTERS</span>
            </span>

            {/* Edge Threshold Slider */}
            <div className="flex items-center space-x-2 text-xs font-mono text-slate-300">
              <span className="text-slate-400">Min Edge:</span>
              <span className="text-amber-400 font-bold">+{minEdge.toFixed(1)}%</span>
              <input
                type="range"
                min="1.0"
                max="10.0"
                step="0.5"
                value={minEdge}
                onChange={e => setMinEdge(parseFloat(e.target.value))}
                className="w-24 accent-amber-400 cursor-pointer"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs font-mono">
            {/* Sport Filter */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">SPORT ENGINE</label>
              <select
                value={selectedSport}
                onChange={e => setSelectedSport(e.target.value)}
                className="w-full bg-[#131b2c] border border-[#23314b] rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Sports ({opportunities.length})</option>
                <option value="MLB">MLB Baseball</option>
                <option value="NFL">NFL Football</option>
                <option value="CFB">NCAA Football</option>
                <option value="TABLE_TENNIS">Table Tennis (50k MC)</option>
              </select>
            </div>

            {/* Market Type Filter */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">MARKET TYPE</label>
              <select
                value={marketFilter}
                onChange={e => setMarketFilter(e.target.value)}
                className="w-full bg-[#131b2c] border border-[#23314b] rounded-lg px-2.5 py-1.5 text-slate-200 focus:outline-none focus:border-cyan-500"
              >
                <option value="ALL">All Markets</option>
                <option value="MONEYLINE">Moneyline Only</option>
                <option value="SPREAD">Spread / Runline</option>
                <option value="TOTAL_POINTS">Totals / Over-Under</option>
                <option value="PITCHER_STRIKEOUTS">Player Props</option>
              </select>
            </div>

            {/* Search */}
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">SEARCH TEAM / PLAYER</label>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="e.g., Dodgers, Vakulenko..."
                className="w-full bg-[#131b2c] border border-[#23314b] rounded-lg px-2.5 py-1.5 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>
        </div>

        {/* Right: Interactive Kelly Criterion Bankroll Box */}
        <div className="lg:col-span-4 p-4 rounded-xl bg-[#0d1320] border border-[#1c273c] space-y-2.5">
          <div className="flex items-center justify-between border-b border-[#182338] pb-2">
            <span className="text-xs font-mono text-slate-300 font-semibold flex items-center gap-1.5">
              <DollarSign className="w-3.5 h-3.5 text-emerald-400" />
              <span>KELLY CRITERION CALCULATOR</span>
            </span>
            <span className="text-[10px] font-mono text-slate-400">1 Unit = ${(bankroll * 0.01).toFixed(0)}</span>
          </div>

          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">TOTAL BANKROLL ($)</label>
              <input
                type="number"
                value={bankroll}
                onChange={e => setBankroll(Math.max(100, parseInt(e.target.value) || 0))}
                className="w-full bg-[#131b2c] border border-[#23314b] rounded-lg px-2.5 py-1 text-emerald-400 font-bold focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[10px] text-slate-400 block mb-1">KELLY FRACTION</label>
              <select
                value={kellyFraction}
                onChange={e => setKellyFraction(parseFloat(e.target.value))}
                className="w-full bg-[#131b2c] border border-[#23314b] rounded-lg px-2.5 py-1 text-slate-200 focus:outline-none"
              >
                <option value={0.125}>1/8 Kelly (Ultra-Safe)</option>
                <option value={0.25}>1/4 Kelly (Conservative)</option>
                <option value={0.5}>1/2 Kelly (Balanced)</option>
                <option value={1.0}>Full Kelly (Aggressive)</option>
              </select>
            </div>
          </div>

          <div className="text-[10px] text-slate-400 font-sans leading-relaxed">
            Stakes automatically scale based on mathematical edge and odds to maximize long-term geometric capital growth while protecting against drawdowns.
          </div>
        </div>
      </div>

      {/* Main Grid: Value Cards */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">
            FILTERED RESULTS ({filteredOpportunities.length} OF {opportunities.length} VALUE BETS)
          </span>

          {lockedList.length > 0 && (
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono text-amber-300 font-bold">
                {lockedList.length} LOCKED IN SLIP
              </span>
              <button
                onClick={handleCopySlip}
                className="px-2.5 py-1 rounded bg-amber-600/30 hover:bg-amber-600/50 border border-amber-500/40 text-amber-200 text-xs font-mono flex items-center space-x-1 transition-all cursor-pointer"
              >
                {copiedSlip ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copiedSlip ? 'COPIED!' : 'COPY SLIP'}</span>
              </button>
            </div>
          )}
        </div>

        {filteredOpportunities.length === 0 ? (
          <div className="p-8 rounded-xl bg-[#0c101a] border border-[#1b253b] text-center space-y-2">
            <Info className="w-6 h-6 text-slate-500 mx-auto" />
            <div className="text-sm font-mono text-slate-300 font-semibold">No Value Bets Meet Current Threshold</div>
            <div className="text-xs text-slate-400">
              Try lowering the minimum edge slider (currently +{minEdge.toFixed(1)}%) or clearing sport filters.
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {filteredOpportunities.map(opp => {
              const kelly = calculateKellyStake(opp);
              const isLocked = !!lockedSlips[opp.id];

              return (
                <div
                  key={opp.id}
                  className={`p-4 rounded-xl border transition-all ${
                    isLocked
                      ? 'bg-[#10192e] border-amber-500/60 shadow-lg shadow-amber-950/20'
                      : 'bg-[#0d1322] hover:bg-[#101728] border-[#1c2840]'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="space-y-1">
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold ${
                          opp.sport === 'MLB' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                          opp.sport === 'NFL' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                          opp.sport === 'CFB' ? 'bg-red-950 text-red-300 border border-red-800' :
                          'bg-cyan-950 text-cyan-300 border border-cyan-800'
                        }`}>
                          {opp.sport}
                        </span>

                        <span className="text-xs font-mono font-semibold text-slate-200">
                          {opp.matchup}
                        </span>

                        {opp.status === 'LIVE' && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono bg-red-950 text-red-400 border border-red-800 animate-pulse">
                            LIVE
                          </span>
                        )}
                      </div>

                      <div className="text-sm font-bold font-mono text-white flex items-center space-x-2">
                        <span>{opp.selection}</span>
                        <span className="text-cyan-400">({opp.marketOdds})</span>
                      </div>
                    </div>

                    {/* Edge Pill */}
                    <div className="text-right shrink-0">
                      <div className="inline-flex items-center px-2.5 py-1 rounded-lg bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 font-mono font-bold text-xs">
                        +{opp.edgePercentage}% EDGE
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">
                        +{opp.evRoi}% EV ROI
                      </div>
                    </div>
                  </div>

                  {/* Math Breakdown Row */}
                  <div className="grid grid-cols-3 gap-2 mt-3 pt-3 border-t border-[#182338] text-xs font-mono">
                    <div className="p-2 rounded bg-[#090d16] border border-[#162033]">
                      <div className="text-[10px] text-slate-400">True Fair Prob</div>
                      <div className="font-bold text-cyan-400">{(opp.trueFairProb * 100).toFixed(1)}%</div>
                    </div>

                    <div className="p-2 rounded bg-[#090d16] border border-[#162033]">
                      <div className="text-[10px] text-slate-400">Consensus Implied</div>
                      <div className="font-bold text-slate-300">{(opp.consensusImpliedProb * 100).toFixed(1)}%</div>
                    </div>

                    <div className="p-2 rounded bg-[#090d16] border border-[#162033]">
                      <div className="text-[10px] text-slate-400">Kelly Stake</div>
                      <div className="font-bold text-emerald-400">${kelly.stakeDollars} ({kelly.units}u)</div>
                    </div>
                  </div>

                  {/* Algorithmic Reason */}
                  <div className="mt-2.5 text-[11px] font-mono text-slate-400 flex items-center space-x-1.5">
                    <span className="text-cyan-500">▶</span>
                    <span className="truncate">{opp.algorithmicDriver}</span>
                  </div>

                  {/* Action Buttons */}
                  <div className="mt-3 pt-2.5 border-t border-[#182338] flex items-center justify-between">
                    <button
                      onClick={() => toggleLockSlip(opp)}
                      className={`px-3 py-1 rounded-lg text-xs font-mono font-bold flex items-center space-x-1.5 transition-all cursor-pointer ${
                        isLocked
                          ? 'bg-amber-500 text-slate-950 shadow-md shadow-amber-500/20'
                          : 'bg-[#141d2f] hover:bg-[#1c2942] text-slate-300 border border-[#243350]'
                      }`}
                    >
                      {isLocked ? <BookmarkCheck className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                      <span>{isLocked ? 'LOCKED IN SLIP' : 'LOCK PICK'}</span>
                    </button>

                    {opp.sport === 'TABLE_TENNIS' ? (
                      <button
                        onClick={onNavigateToTableTennis}
                        className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                      >
                        <span>Open 50k MC Simulator</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </button>
                    ) : (
                      opp.gameId && (
                        <button
                          onClick={() => onNavigateToGame(opp.gameId!, opp.sport as SportType)}
                          className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center space-x-1"
                        >
                          <span>Open Game Hub</span>
                          <ArrowUpRight className="w-3 h-3" />
                        </button>
                      )
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Slip Drawer (if any picks locked) */}
      {lockedList.length > 0 && (
        <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/40 via-slate-900 to-amber-950/40 border border-amber-500/50 shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold font-mono shrink-0">
              {lockedList.length}
            </div>
            <div>
              <div className="text-xs font-mono font-bold text-white uppercase tracking-wider">
                Portfolio Bet Slip Active
              </div>
              <div className="text-xs font-mono text-slate-400">
                Total Recommended Portfolio Stake: $
                {lockedList.reduce((acc: number, curr: ValueOpportunity) => acc + calculateKellyStake(curr).stakeDollars, 0)}{' '}
                ({(lockedList.reduce((acc: number, curr: ValueOpportunity) => acc + parseFloat(calculateKellyStake(curr).units), 0)).toFixed(1)}u)
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={handleCopySlip}
              className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-all shadow-md cursor-pointer"
            >
              {copiedSlip ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedSlip ? 'COPIED TO CLIPBOARD' : 'EXPORT SLIP'}</span>
            </button>
            <button
              onClick={() => setLockedSlips({})}
              className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-mono"
            >
              Clear All
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
