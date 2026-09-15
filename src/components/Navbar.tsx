import React from 'react';
import { 
  Activity, 
  ShieldCheck, 
  Terminal, 
  User, 
  LogOut, 
  Cpu, 
  Clock, 
  Radio, 
  Search, 
  Users, 
  Zap,
  ChevronUp,
  Calendar
} from 'lucide-react';
import { SportType, UserSession } from '../types';

interface NavbarProps {
  activeSport: SportType | 'ALL';
  onSelectSport: (sport: SportType | 'ALL') => void;
  user: UserSession;
  onOpenAuth: () => void;
  onLogout: () => void;
  onNavigate: (view: string) => void;
  onOpenMatchSearch?: () => void;
  onOpenPlayerLookup?: () => void;
  onOpenAutoBacktest?: () => void;
  onCollapseTop?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeSport,
  onSelectSport,
  user,
  onOpenAuth,
  onLogout,
  onNavigate,
  onOpenMatchSearch,
  onOpenPlayerLookup,
  onOpenAutoBacktest,
  onCollapseTop,
}) => {
  const [timeString, setTimeString] = React.useState('');

  React.useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeString(now.toTimeString().split(' ')[0] + ' EST');
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <header id="nexus-header" className="sticky top-0 z-40 w-full bg-[#0d111a]/95 border-b border-[#1e2738] backdrop-blur-md">
      {/* Top Technical Broadcast Ticker */}
      <div className="h-7 bg-[#080a10] border-b border-[#161d2b] px-4 flex items-center justify-between text-[11px] font-mono tracking-wider text-slate-400">
        <div className="flex items-center space-x-4 overflow-hidden">
          <span className="flex items-center text-cyan-400 font-semibold uppercase">
            <Radio className="w-3 h-3 mr-1.5 animate-pulse text-cyan-400" />
            LIVE TELEMETRY STREAM
          </span>
          <span className="text-slate-600">|</span>
          <span className="truncate">
            THE GETER PRINCIPLE: ZERO-FABRICATION DIRECTIVE ACTIVE
          </span>
          <span className="text-slate-600 hidden sm:inline">|</span>
          <span className="text-emerald-400 hidden sm:inline flex items-center">
            <ShieldCheck className="w-3 h-3 mr-1 inline" />
            CONSENSUS BIAS DECONSTRUCTED
          </span>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="hidden md:flex items-center text-slate-300">
            <span className="text-slate-500 mr-1.5">ECE:</span>
            <span className="text-cyan-400 font-semibold">0.0384</span>
            <span className="text-slate-600 mx-2">/</span>
            <span className="text-slate-500 mr-1.5">BRIER:</span>
            <span className="text-emerald-400 font-semibold">0.1712</span>
          </div>
          <span className="text-slate-600 hidden md:inline">|</span>
          <span className="text-slate-400 flex items-center">
            <Clock className="w-3 h-3 mr-1 text-slate-500" />
            {timeString}
          </span>
        </div>
      </div>

      {/* Main Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-14 flex items-center justify-between">
        {/* Brand / Logo */}
        <div className="flex items-center space-x-3">
          <button 
            id="brand-logo-button"
            onClick={() => onNavigate(user.isAuthenticated ? 'PERSONAL_HOME' : 'AUTH')}
            className="flex items-center space-x-2.5 text-left group"
          >
            <div className="w-8 h-8 rounded bg-gradient-to-br from-cyan-500/20 to-blue-600/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:border-cyan-400 transition-colors">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <span className="font-display font-bold text-base text-white tracking-wide">
                  THE PREDICTION NEXUS
                </span>
                <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-800">
                  v3.8 QUANT
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-mono tracking-tight -mt-0.5">
                ISOLATED ENGINES // ZERO-FABRICATION
              </p>
            </div>
          </button>
        </div>

        {/* Sport Navigation Selectors */}
        <div className="hidden lg:flex items-center space-x-1 bg-[#121724] p-1 rounded-md border border-[#20293d]">
          <button
            id="nav-home-btn"
            onClick={() => onNavigate('PERSONAL_HOME')}
            className="px-3 py-1 text-xs font-mono font-medium rounded text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/60 cursor-pointer"
          >
            ★ MY HOME
          </button>
          <button
            id="nav-value-bets-btn"
            onClick={() => onNavigate('VALUE_BETS')}
            className="px-3 py-1 text-xs font-mono font-medium rounded text-amber-300 hover:bg-amber-950/40 border border-amber-800/60 flex items-center space-x-1 cursor-pointer"
            title="Active pure +EV plays and Kelly bet sizing"
          >
            <Zap className="w-3.5 h-3.5 mr-1 text-amber-400" />
            <span>VALUE BETS</span>
          </button>
          <button
            id="nav-calendar-btn"
            onClick={() => onNavigate('CALENDAR')}
            className="px-3 py-1 text-xs font-mono font-medium rounded text-cyan-300 hover:bg-cyan-950/40 border border-cyan-800/60 flex items-center space-x-1 cursor-pointer"
            title="Factual Match Calendar with accurate dates, times & clear bet signals"
          >
            <Calendar className="w-3.5 h-3.5 mr-1 text-cyan-400" />
            <span>CALENDAR</span>
          </button>
          <button
            id="nav-accuracy-btn"
            onClick={() => onNavigate('ACCURACY_LEDGER')}
            className="px-3 py-1 text-xs font-mono font-medium rounded text-emerald-300 hover:bg-emerald-950/40 border border-emerald-800/60 flex items-center space-x-1 cursor-pointer"
            title="View strict accurate vs inaccurate prediction record"
          >
            <ShieldCheck className="w-3.5 h-3.5 mr-1 text-emerald-400" />
            <span>ACCURACY: 552W-301L (62.7%)</span>
          </button>
          {([
            { id: 'ALL', label: 'MASTER NEXUS' },
            { id: 'MLB', label: 'MLB HUB' },
            { id: 'NFL', label: 'NFL HUB' },
            { id: 'CFB', label: 'CFB HUB' },
            { id: 'TENNIS', label: 'TENNIS SOTA' },
          ] as const).map(({ id: sport, label }) => {
            const isActive = activeSport === sport;
            return (
              <button
                key={sport}
                id={`sport-selector-${sport.toLowerCase()}`}
                onClick={() => {
                  onSelectSport(sport);
                  if (sport === 'ALL') {
                    onNavigate('MASTER');
                  } else {
                    onNavigate(sport);
                  }
                }}
                className={`px-3.5 py-1 text-xs font-mono font-medium rounded transition-all whitespace-nowrap ${
                  isActive
                    ? 'bg-cyan-500/15 text-cyan-300 border border-cyan-500/40 shadow-sm'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        {/* User Account / Auth Actions */}
        <div className="flex items-center space-x-2">
          {/* Universal Quick Search Trigger */}
          {onOpenMatchSearch && (
            <button
              id="navbar-match-search-btn"
              onClick={onOpenMatchSearch}
              className="px-2.5 py-1.5 rounded-lg bg-[#141b28] hover:bg-[#1c2637] border border-[#233146] text-slate-300 hover:text-white text-xs font-mono flex items-center space-x-1.5 transition-colors"
              title="Search matches across all circuits"
            >
              <Search className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Search</span>
            </button>
          )}

          {/* Continuous Auto-Backtest Monitor Trigger */}
          {onOpenAutoBacktest && (
            <button
              id="navbar-auto-backtest-btn"
              onClick={onOpenAutoBacktest}
              className="px-2.5 py-1.5 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/40 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-semibold flex items-center space-x-1.5 transition-colors"
              title="Autonomous multi-sport backtesting monitor"
            >
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="hidden sm:inline">Auto-BT</span>
            </button>
          )}

          {/* Player Information Lookup Trigger */}
          {onOpenPlayerLookup && (
            <button
              id="navbar-player-lookup-btn"
              onClick={onOpenPlayerLookup}
              className="px-2.5 py-1.5 rounded-lg bg-purple-950/40 hover:bg-purple-900/40 border border-purple-500/40 text-purple-300 text-xs font-mono flex items-center space-x-1.5 transition-colors"
              title="Always-updating player database lookup"
            >
              <Users className="w-3.5 h-3.5 text-purple-400" />
              <span className="hidden sm:inline">Players</span>
            </button>
          )}

          {user.isAuthenticated ? (
            <div className="flex items-center space-x-2 pl-1 border-l border-[#1d273a]">
              <div className="hidden sm:block text-right">
                <div className="text-xs font-medium text-slate-200 truncate max-w-[130px]">
                  {user.email.split('@')[0]}
                </div>
                <div className="text-[10px] font-mono text-cyan-400 font-semibold">
                  {user.tier}
                </div>
              </div>
              <div className="w-8 h-8 rounded bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center text-cyan-300">
                <User className="w-4 h-4" />
              </div>
              <button
                id="logout-btn"
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded text-slate-400 hover:text-rose-400 hover:bg-rose-950/20 transition-colors"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="login-btn"
              onClick={onOpenAuth}
              className="px-3.5 py-1.5 rounded text-xs font-mono font-semibold bg-cyan-500 text-slate-950 hover:bg-cyan-400 transition-colors shadow-sm flex items-center space-x-1.5"
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL AUTH</span>
            </button>
          )}

          {/* Quick Slide-Away Button */}
          {onCollapseTop && (
            <button
              id="btn-navbar-slide-away"
              onClick={onCollapseTop}
              title="Slide top panel away (Focus Mode)"
              className="p-1.5 rounded-lg bg-[#151c2a] hover:bg-cyan-950/80 text-slate-400 hover:text-cyan-300 border border-[#212d42] transition-colors ml-1 hidden sm:flex items-center space-x-1"
            >
              <ChevronUp className="w-4 h-4" />
              <span className="text-[10px] font-mono pr-0.5">Slide</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
