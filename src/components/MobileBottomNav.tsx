import React from 'react';
import { 
  Home, 
  Compass, 
  Search, 
  Zap, 
  Users, 
  Cpu,
  ChevronDown
} from 'lucide-react';

interface MobileBottomNavProps {
  currentView: 'PERSONAL_HOMEPAGE' | 'MASTER_DASHBOARD' | 'TABLE_TENNIS';
  onSelectView: (view: 'PERSONAL_HOMEPAGE' | 'MASTER_DASHBOARD' | 'TABLE_TENNIS') => void;
  onOpenMatchSearch: () => void;
  onOpenPlayerLookup: () => void;
  onOpenAutoBacktest: () => void;
  onCollapseBottom?: () => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentView,
  onSelectView,
  onOpenMatchSearch,
  onOpenPlayerLookup,
  onOpenAutoBacktest,
  onCollapseBottom,
}) => {
  return (
    <nav 
      aria-label="Bottom Navigation Dock"
      className="fixed bottom-0 left-0 right-0 z-40 bg-[#0c121d]/95 backdrop-blur-lg border-t border-[#1e2a3e] px-2 py-1.5 pb-safe flex items-center justify-around sm:justify-center sm:gap-6 shadow-2xl transition-all"
    >
      {/* 1. Home */}
      <button
        id="btn-nav-mobile-home"
        onClick={() => onSelectView('PERSONAL_HOMEPAGE')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
          currentView === 'PERSONAL_HOMEPAGE'
            ? 'text-cyan-400 font-bold bg-cyan-950/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Home className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">Home</span>
      </button>

      {/* 2. Master Nexus */}
      <button
        id="btn-nav-mobile-nexus"
        onClick={() => onSelectView('MASTER_DASHBOARD')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
          currentView === 'MASTER_DASHBOARD'
            ? 'text-cyan-400 font-bold bg-cyan-950/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Compass className="w-5 h-5 mb-0.5" />
        <span className="text-[10px] font-mono">Nexus</span>
      </button>

      {/* 3. Universal Match Search */}
      <button
        id="btn-nav-mobile-search"
        onClick={onOpenMatchSearch}
        className="flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
      >
        <div className="relative">
          <Search className="w-5 h-5 mb-0.5 text-amber-400" />
          <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
        </div>
        <span className="text-[10px] font-mono">Search</span>
      </button>

      {/* 4. Table Tennis 50k Hub */}
      <button
        id="btn-nav-mobile-tt"
        onClick={() => onSelectView('TABLE_TENNIS')}
        className={`flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl transition-all ${
          currentView === 'TABLE_TENNIS'
            ? 'text-cyan-400 font-bold bg-cyan-950/40'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Zap className="w-5 h-5 mb-0.5 text-cyan-300" />
        <span className="text-[10px] font-mono">TT Sim</span>
      </button>

      {/* 5. Live Players Lookup */}
      <button
        id="btn-nav-mobile-players"
        onClick={onOpenPlayerLookup}
        className="flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
      >
        <Users className="w-5 h-5 mb-0.5 text-purple-400" />
        <span className="text-[10px] font-mono">Players</span>
      </button>

      {/* 6. Auto-Backtest Monitor */}
      <button
        id="btn-nav-mobile-autobt"
        onClick={onOpenAutoBacktest}
        className="flex flex-col items-center justify-center min-w-[52px] min-h-[48px] py-1 px-2 rounded-xl text-slate-300 hover:text-white transition-all active:scale-95"
      >
        <div className="relative">
          <Cpu className="w-5 h-5 mb-0.5 text-emerald-400" />
          <span className="absolute -top-1 -right-1 w-1.5 h-1.5 rounded-full bg-emerald-400" />
        </div>
        <span className="text-[10px] font-mono">Auto-BT</span>
      </button>

      {/* 7. Slide Away Button */}
      {onCollapseBottom && (
        <button
          id="btn-nav-slide-away-bottom"
          onClick={onCollapseBottom}
          title="Slide bottom panel away (Focus Mode)"
          className="flex flex-col items-center justify-center min-w-[44px] min-h-[48px] py-1 px-1.5 rounded-xl text-slate-400 hover:text-cyan-300 hover:bg-slate-800/60 transition-all active:scale-95"
        >
          <ChevronDown className="w-4 h-4 mb-0.5" />
          <span className="text-[9px] font-mono">Slide</span>
        </button>
      )}
    </nav>
  );
};
