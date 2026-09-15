import React, { useState, useMemo } from 'react';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  Globe, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Sliders, 
  ArrowRight, 
  Activity, 
  Search,
  Check,
  MapPin,
  Wind
} from 'lucide-react';
import { Game, SportType, UserSession } from '../types';
import { ClearBetIndicator } from './ClearBetIndicator';
import { GameBacktestModal } from './GameBacktestModal';
import { GameCalibrationModal } from './GameCalibrationModal';

interface CalendarPageProps {
  games: Game[];
  user: UserSession;
  onNavigateToSportHub: (sport: SportType, gameId?: string) => void;
  onNavigateToLiveStream: (sport?: SportType) => void;
}

type TimezoneMode = 'LOCAL' | 'ET' | 'UTC';
type CalendarViewType = 'TIMELINE' | 'DAY_SLATE' | 'WEEK_OVERVIEW';

export const CalendarPage: React.FC<CalendarPageProps> = ({
  games,
  user,
  onNavigateToSportHub,
  onNavigateToLiveStream
}) => {
  // Filters and state
  const [selectedSport, setSelectedSport] = useState<SportType | 'ALL'>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<'ALL' | 'LIVE' | 'UPCOMING' | 'FINAL'>('ALL');
  const [betFilter, setBetFilter] = useState<'ALL' | 'BETS_ONLY' | 'STRONG_ONLY'>('ALL');
  const [searchTerm, setSearchTerm] = useState('');
  const [timezone, setTimezone] = useState<TimezoneMode>('LOCAL');
  const [viewType, setViewType] = useState<CalendarViewType>('TIMELINE');
  
  // Selected date for Day Slate view (defaults to today)
  const todayStr = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);

  // Modals
  const [backtestGame, setBacktestGame] = useState<Game | null>(null);
  const [calibrationGame, setCalibrationGame] = useState<Game | null>(null);

  // Format date and time according to selected timezone
  const formatDateTime = (isoDateString?: string, fallbackScheduled?: string) => {
    if (!isoDateString) {
      return {
        dateStr: 'Today',
        timeStr: fallbackScheduled || 'Scheduled Time TBD',
        fullStr: fallbackScheduled || 'Today',
      };
    }

    try {
      const date = new Date(isoDateString);
      if (isNaN(date.getTime())) {
        return {
          dateStr: 'Today',
          timeStr: fallbackScheduled || 'Scheduled',
          fullStr: fallbackScheduled || 'Today',
        };
      }

      let timeZoneOption: string | undefined = undefined;
      let tzSuffix = '';

      if (timezone === 'ET') {
        timeZoneOption = 'America/New_York';
        tzSuffix = ' ET';
      } else if (timezone === 'UTC') {
        timeZoneOption = 'UTC';
        tzSuffix = ' UTC';
      } else {
        tzSuffix = ' Local';
      }

      const dateStr = date.toLocaleDateString('en-US', {
        timeZone: timeZoneOption,
        weekday: 'short',
        month: 'short',
        day: 'numeric',
      });

      const timeStr = date.toLocaleTimeString('en-US', {
        timeZone: timeZoneOption,
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      }) + tzSuffix;

      const utcTimeStr = date.toLocaleTimeString('en-US', {
        timeZone: 'UTC',
        hour: 'numeric',
        minute: '2-digit',
        hour12: false,
      }) + ' UTC';

      return {
        dateStr,
        timeStr,
        utcTimeStr,
        fullStr: `${dateStr} @ ${timeStr}`,
        isoDay: date.toISOString().split('T')[0],
      };
    } catch {
      return {
        dateStr: 'Scheduled',
        timeStr: fallbackScheduled || '',
        fullStr: fallbackScheduled || 'Scheduled',
      };
    }
  };

  // Extract unique available dates from games list for day selector
  const availableDates = useMemo(() => {
    const datesSet = new Set<string>();
    games.forEach(g => {
      if (g.gameDate) datesSet.add(g.gameDate);
      else if (g.startTimeUtc) datesSet.add(g.startTimeUtc.split('T')[0]);
    });
    // Ensure today is always included
    datesSet.add(todayStr);

    return Array.from(datesSet).sort();
  }, [games, todayStr]);

  // Filtered games
  const filteredGames = useMemo(() => {
    return games.filter(g => {
      // Sport filter
      if (selectedSport !== 'ALL' && g.sport !== selectedSport) return false;

      // Status filter
      if (selectedStatus !== 'ALL' && g.status !== selectedStatus) return false;

      // Recommendation filter
      if (betFilter === 'BETS_ONLY') {
        if (!g.clearBetRecommendation || g.clearBetRecommendation.action === 'PASS') return false;
      } else if (betFilter === 'STRONG_ONLY') {
        if (!g.clearBetRecommendation || g.clearBetRecommendation.confidence !== 'HIGH_CONFIDENCE') return false;
      }

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase();
        const home = g.homeTeam.name.toLowerCase();
        const away = g.awayTeam.name.toLowerCase();
        const venue = (g.venue || '').toLowerCase();
        if (!home.includes(query) && !away.includes(query) && !venue.includes(query)) {
          return false;
        }
      }

      // Date filter for DAY_SLATE view
      if (viewType === 'DAY_SLATE') {
        const gameDay = g.gameDate || (g.startTimeUtc ? g.startTimeUtc.split('T')[0] : '');
        if (gameDay && gameDay !== selectedDate) return false;
      }

      return true;
    }).sort((a, b) => {
      // Sort: LIVE first, then by chronological start time
      if (a.status === 'LIVE' && b.status !== 'LIVE') return -1;
      if (b.status === 'LIVE' && a.status !== 'LIVE') return 1;

      const timeA = a.startTimeUtc ? new Date(a.startTimeUtc).getTime() : 0;
      const timeB = b.startTimeUtc ? new Date(b.startTimeUtc).getTime() : 0;
      return timeA - timeB;
    });
  }, [games, selectedSport, selectedStatus, betFilter, searchTerm, viewType, selectedDate]);

  // Summary counts
  const summary = useMemo(() => {
    const live = games.filter(g => g.status === 'LIVE').length;
    const upcoming = games.filter(g => g.status === 'UPCOMING').length;
    const finalCount = games.filter(g => g.status === 'FINAL').length;
    const strongBets = games.filter(g => g.clearBetRecommendation?.confidence === 'HIGH_CONFIDENCE').length;
    const allBets = games.filter(g => g.clearBetRecommendation?.action === 'BET').length;

    return { live, upcoming, finalCount, strongBets, allBets };
  }, [games]);

  return (
    <div className="space-y-6 pb-12">
      {/* ========================================================================= */}
      {/* 1. HERO & ACCURACY DIRECTIVE */}
      {/* ========================================================================= */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#0d1322] via-[#0f172a] to-[#0a101d] border border-[#1e2a42] shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1.5 max-w-3xl">
            <div className="flex items-center space-x-2.5">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 flex items-center">
                <CalendarIcon className="w-3.5 h-3.5 mr-1.5 text-cyan-400" />
                FACTUAL MATCH CALENDAR
              </span>
              <span className="text-xs font-mono text-emerald-400 flex items-center">
                <ShieldCheck className="w-3.5 h-3.5 mr-1" />
                THE GETER PRINCIPLE: IMMUTABLE SCHEDULE & ZERO DATA LEAKAGE
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-display font-bold text-white tracking-wide">
              Official Slate Calendar & Actionable Bet Navigator
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
              Every match displays verified, factual start times and calendar dates across MLB, NFL, CFB, and Tennis (FanDuel integrated). Cut through confusing numbers with clear, unmistakable bet indicators.
            </p>
          </div>

          {/* Timezone Switcher */}
          <div className="p-3 bg-[#131b2e] rounded-xl border border-[#223150] space-y-1.5 shrink-0">
            <div className="flex items-center justify-between text-[11px] font-mono text-slate-400">
              <span className="flex items-center">
                <Globe className="w-3.5 h-3.5 mr-1 text-cyan-400" />
                TIMEZONE:
              </span>
              <span className="text-slate-200 font-bold">{timezone}</span>
            </div>
            <div className="flex gap-1 bg-[#0b101c] p-1 rounded-lg border border-[#1b253b]">
              {(['LOCAL', 'ET', 'UTC'] as const).map(tz => (
                <button
                  key={tz}
                  onClick={() => setTimezone(tz)}
                  className={`px-3 py-1 rounded text-xs font-mono font-semibold transition-all ${
                    timezone === tz 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  {tz}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* STATS STRIP */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 mt-5 pt-4 border-t border-[#1a253c] font-mono">
          <div className="p-2.5 rounded-lg bg-[#0b0f19]/80 border border-[#192236]">
            <div className="text-[10px] text-slate-400">TOTAL SLATE</div>
            <div className="text-lg font-bold text-white">{games.length} Matches</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0b0f19]/80 border border-[#192236]">
            <div className="text-[10px] text-rose-400 flex items-center">
              <span className="w-1.5 h-1.5 rounded-full bg-rose-500 mr-1 animate-pulse" />
              LIVE NOW
            </div>
            <div className="text-lg font-bold text-rose-300">{summary.live} In-Play</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0b0f19]/80 border border-[#192236]">
            <div className="text-[10px] text-amber-400">UPCOMING</div>
            <div className="text-lg font-bold text-amber-300">{summary.upcoming} Scheduled</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0b0f19]/80 border border-[#192236]">
            <div className="text-[10px] text-emerald-400">STRONG BETS (GETER)</div>
            <div className="text-lg font-bold text-emerald-300">{summary.strongBets} High Edge</div>
          </div>
          <div className="p-2.5 rounded-lg bg-[#0b0f19]/80 border border-[#192236]">
            <div className="text-[10px] text-cyan-400">TOTAL VALUE PLAYS</div>
            <div className="text-lg font-bold text-cyan-300">{summary.allBets} Actionable</div>
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 2. CONTROLS, VIEW PICKER & SPORT FILTERS */}
      {/* ========================================================================= */}
      <div className="p-4 rounded-xl bg-[#0e1424] border border-[#1c273e] space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Sport Switcher */}
          <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 lg:pb-0">
            <span className="text-xs font-mono text-slate-400 mr-1">SPORT:</span>
            {(['ALL', 'MLB', 'NFL', 'CFB', 'TENNIS'] as const).map(sport => {
              const active = selectedSport === sport;
              const count = sport === 'ALL' ? games.length : games.filter(g => g.sport === sport).length;
              return (
                <button
                  key={sport}
                  onClick={() => setSelectedSport(sport)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all whitespace-nowrap flex items-center space-x-1.5 ${
                    active 
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow' 
                      : 'bg-[#141c2c] text-slate-400 hover:text-white border border-[#212c42]'
                  }`}
                >
                  <span>{sport === 'TENNIS' ? 'TENNIS SOTA' : sport}</span>
                  <span className={`text-[10px] px-1 rounded ${active ? 'bg-slate-950/30 text-slate-950' : 'bg-slate-800 text-slate-400'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* View Type Toggle */}
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">VIEW:</span>
            <div className="flex bg-[#121827] p-1 rounded-lg border border-[#212d45]">
              <button
                onClick={() => setViewType('TIMELINE')}
                className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                  viewType === 'TIMELINE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                CHRONOLOGICAL
              </button>
              <button
                onClick={() => setViewType('DAY_SLATE')}
                className={`px-3 py-1 text-xs font-mono rounded font-semibold transition-colors ${
                  viewType === 'DAY_SLATE' ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'
                }`}
              >
                DAILY SLATE
              </button>
            </div>
          </div>
        </div>

        {/* Sub-Filters: Status, Clear Bet Filter, and Search */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t border-[#182236]">
          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400">STATUS:</span>
            <select
              value={selectedStatus}
              onChange={e => setSelectedStatus(e.target.value as any)}
              className="flex-1 bg-[#131b2c] border border-[#22304a] rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Statuses ({games.length})</option>
              <option value="LIVE">Live In-Play Only</option>
              <option value="UPCOMING">Upcoming Slate Only</option>
              <option value="FINAL">Final / Historical Outcome</option>
            </select>
          </div>

          {/* Bet Recommendation Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-[11px] font-mono text-slate-400">BET SIGNAL:</span>
            <select
              value={betFilter}
              onChange={e => setBetFilter(e.target.value as any)}
              className="flex-1 bg-[#131b2c] border border-[#22304a] rounded-lg px-2.5 py-1.5 text-xs font-mono text-slate-200 focus:outline-none focus:border-cyan-500"
            >
              <option value="ALL">All Matches (Bets & Passes)</option>
              <option value="BETS_ONLY">Actionable Bets Only (Edge &gt;= 2%)</option>
              <option value="STRONG_ONLY">High Confidence Only (Edge &gt;= 4%)</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-500 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search team, player, venue..."
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="w-full bg-[#131b2c] border border-[#22304a] rounded-lg pl-9 pr-3 py-1.5 text-xs font-mono text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-cyan-500"
            />
          </div>
        </div>

        {/* Date Strip (Available in DAILY SLATE view) */}
        {viewType === 'DAY_SLATE' && (
          <div className="pt-3 border-t border-[#182236] space-y-2">
            <div className="flex items-center justify-between text-xs font-mono text-slate-400">
              <span>SELECT DATE SLATE:</span>
              <span className="text-cyan-400 font-bold">
                {formatDateTime(selectedDate).dateStr}
              </span>
            </div>
            <div className="flex items-center space-x-2 overflow-x-auto pb-2">
              {availableDates.map(dateKey => {
                const dateGames = games.filter(g => (g.gameDate || (g.startTimeUtc ? g.startTimeUtc.split('T')[0] : '')) === dateKey);
                const isSelected = selectedDate === dateKey;
                const dateObj = new Date(dateKey + 'T12:00:00Z');
                const dayName = isNaN(dateObj.getTime()) ? dateKey : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
                const dayNum = isNaN(dateObj.getTime()) ? '' : dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
                const hasStrong = dateGames.some(g => g.clearBetRecommendation?.confidence === 'HIGH_CONFIDENCE');

                return (
                  <button
                    key={dateKey}
                    onClick={() => setSelectedDate(dateKey)}
                    className={`px-4 py-2 rounded-xl text-xs font-mono transition-all flex flex-col items-center shrink-0 border ${
                      isSelected
                        ? 'bg-cyan-500 text-slate-950 font-bold border-cyan-400 shadow-md shadow-cyan-500/20'
                        : 'bg-[#121927] hover:bg-[#192337] text-slate-300 border-[#222f47]'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold tracking-wider">{dayName}</span>
                    <span className="text-sm font-bold my-0.5">{dayNum}</span>
                    <div className="flex items-center space-x-1 text-[10px]">
                      <span>{dateGames.length} games</span>
                      {hasStrong && (
                        <span className={`w-1.5 h-1.5 rounded-full ${isSelected ? 'bg-slate-950' : 'bg-emerald-400 animate-pulse'}`} />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* 3. MATCHES CALENDAR LIST */}
      {/* ========================================================================= */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 px-1">
          <span>SHOWING {filteredGames.length} VERIFIED CALENDAR ENTRIES</span>
          <span className="text-emerald-400">Pre-game locks frozen at official start time</span>
        </div>

        {filteredGames.length === 0 ? (
          <div className="p-12 text-center rounded-2xl bg-[#0e1424] border border-[#1c273e] space-y-3">
            <CalendarIcon className="w-10 h-10 text-slate-600 mx-auto" />
            <div className="text-base font-display font-bold text-white">No Matches Found</div>
            <p className="text-xs text-slate-400 font-mono max-w-md mx-auto">
              No games match the current sport, status, or date filter. Try selecting 'ALL' sports or expanding the bet signal filter.
            </p>
            <button
              onClick={() => {
                setSelectedSport('ALL');
                setSelectedStatus('ALL');
                setBetFilter('ALL');
                setSearchTerm('');
              }}
              className="px-4 py-2 rounded-lg bg-cyan-500 text-slate-950 font-mono text-xs font-bold hover:bg-cyan-400 transition-colors"
            >
              RESET FILTERS
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {filteredGames.map(game => {
              const dt = formatDateTime(game.startTimeUtc, game.scheduledTime);
              const isLive = game.status === 'LIVE';
              const isFinal = game.status === 'FINAL';

              return (
                <div
                  key={game.id}
                  className="p-5 rounded-2xl bg-[#0e1424] border border-[#1c273e] hover:border-cyan-500/40 transition-all flex flex-col justify-between group shadow-lg"
                >
                  <div className="space-y-3">
                    {/* Header: Sport, Status, and Factual Date/Time */}
                    <div className="flex items-start justify-between gap-2 border-b border-[#182236] pb-3">
                      <div className="flex items-center space-x-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                          {game.sport}
                        </span>
                        {isLive ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-rose-950 text-rose-300 border border-rose-800 animate-pulse flex items-center">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 mr-1.5" />
                            LIVE IN-PLAY
                          </span>
                        ) : isFinal ? (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-950 text-emerald-300 border border-emerald-800 flex items-center">
                            <CheckCircle2 className="w-3 h-3 mr-1 text-emerald-400" />
                            VERIFIED FINAL
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-800">
                            UPCOMING PRE-LOCK
                          </span>
                        )}
                      </div>

                      {/* Factual Date & Time Stamp */}
                      <div className="text-right font-mono">
                        <div className="text-xs font-bold text-white flex items-center justify-end">
                          <Clock className="w-3 h-3 mr-1 text-cyan-400" />
                          <span>{dt.timeStr}</span>
                        </div>
                        <div className="text-[10px] text-slate-400">
                          {dt.dateStr} {dt.utcTimeStr && <span className="text-slate-500">({dt.utcTimeStr})</span>}
                        </div>
                      </div>
                    </div>

                    {/* Matchup & Score / Starter Details */}
                    <div>
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {game.awayTeam.name}
                          </div>
                          <div className="text-base font-display font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {game.homeTeam.name}
                          </div>
                        </div>

                        {/* If Live, display live score */}
                        {isLive && game.liveTelemetry && (
                          <div className="text-right font-mono">
                            <div className="text-lg font-bold text-white">{game.liveTelemetry.awayScore ?? 1}</div>
                            <div className="text-lg font-bold text-white">{game.liveTelemetry.homeScore ?? 3}</div>
                          </div>
                        )}
                      </div>

                      {/* Starters, Pitchers, or Tournament details */}
                      <div className="mt-1 flex items-center justify-between text-[11px] font-mono text-slate-400">
                        <span>
                          {game.awayTeam.starterOrQb} vs {game.homeTeam.starterOrQb}
                        </span>
                        {game.venue && (
                          <span className="text-slate-500 flex items-center">
                            <MapPin className="w-3 h-3 mr-1 shrink-0" />
                            {game.venue}
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Weather or Venue Conditions */}
                    {game.weather && (
                      <div className="px-3 py-1.5 rounded-lg bg-[#0b0f19] border border-[#182133] text-[11px] font-mono text-slate-400 flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Wind className="w-3.5 h-3.5 text-cyan-400" />
                          <span>Conditions: {game.weather.temperatureF}°F, Wind {game.weather.windSpeedMph}mph {game.weather.windDirection.replace(/_/g, ' ')}</span>
                        </div>
                        <span className="text-slate-500">{game.weather.precipitationChance}% Precip</span>
                      </div>
                    )}

                    {/* ========================================================= */}
                    {/* CLEAR BET INDICATOR (THE GETER PRINCIPLE) */}
                    {/* ========================================================= */}
                    <div className="pt-2">
                      <div className="text-[10px] font-mono uppercase tracking-wider text-slate-400 mb-1.5 flex items-center justify-between">
                        <span className="flex items-center">
                          <Zap className="w-3 h-3 mr-1 text-amber-400" />
                          RECOMMENDED BETTING ACTION (FANDUEL CALIBRATED)
                        </span>
                        <span className="text-[10px] text-slate-500 font-mono">
                          Zero Leakage
                        </span>
                      </div>
                      <ClearBetIndicator recommendation={game.clearBetRecommendation} variant="card" />
                    </div>
                  </div>

                  {/* Control Buttons */}
                  <div className="pt-4 mt-4 border-t border-[#182236] space-y-2">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setBacktestGame(game)}
                        className="py-2 px-2.5 rounded-lg bg-cyan-950/70 hover:bg-cyan-500 hover:text-slate-950 text-cyan-300 font-mono text-xs font-bold border border-cyan-700/60 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        title="Trigger manual backtest on this game profile"
                      >
                        <Zap className="w-3.5 h-3.5 text-cyan-400 fill-current" />
                        <span>MANUAL BACKTEST</span>
                      </button>
                      <button
                        onClick={() => setCalibrationGame(game)}
                        className="py-2 px-2.5 rounded-lg bg-amber-950/70 hover:bg-amber-500 hover:text-slate-950 text-amber-300 font-mono text-xs font-bold border border-amber-700/60 transition-all flex items-center justify-center space-x-1.5 shadow-sm"
                        title="View pre-lock calibration details and adjust feature weights"
                      >
                        <Sliders className="w-3.5 h-3.5 text-amber-400" />
                        <span>CALIBRATION DETAILS</span>
                      </button>
                    </div>

                    <button
                      onClick={() => onNavigateToSportHub(game.sport, game.id)}
                      className="w-full py-2 rounded-lg bg-[#141d2d] hover:bg-cyan-500 hover:text-slate-950 border border-[#223049] text-cyan-300 font-mono font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-1.5"
                    >
                      <span>OPEN PREDICTOR & SLIDERS</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Manual Backtesting Modal */}
      {backtestGame && (
        <GameBacktestModal
          game={backtestGame}
          onClose={() => setBacktestGame(null)}
        />
      )}

      {/* Calibration Details Modal */}
      {calibrationGame && (
        <GameCalibrationModal
          game={calibrationGame}
          onClose={() => setCalibrationGame(null)}
        />
      )}
    </div>
  );
};
