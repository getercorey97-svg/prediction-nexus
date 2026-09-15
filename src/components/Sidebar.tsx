import React from 'react';
import { 
  Home,
  LayoutDashboard, 
  Activity, 
  LineChart, 
  GitBranch, 
  Database, 
  Terminal, 
  Layers, 
  Sparkles, 
  TrendingUp, 
  Workflow,
  ShieldCheck,
  Trophy,
  ChevronLeft,
  Moon
} from 'lucide-react';
import { SportType } from '../types';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  activeSport: SportType | 'ALL';
  onSelectSport: (sport: SportType | 'ALL') => void;
  liveCount: number;
  onCollapseLeft?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onNavigate,
  activeSport,
  onSelectSport,
  liveCount,
  onCollapseLeft,
}) => {
  const navItems = [
    {
      id: 'PERSONAL_HOME',
      label: 'Personal Homepage',
      badge: 'MY HUB',
      icon: Home,
      description: 'Top picks, live & upcoming games, engine upgrades',
    },
    {
      id: 'ACCURACY_LEDGER',
      label: 'Accuracy Ledger & Learning',
      badge: '552W - 301L (62.7%)',
      icon: ShieldCheck,
      description: 'Strict accurate vs inaccurate record & self-learning math',
    },
    {
      id: 'TABLE_TENNIS',
      label: 'Table Tennis Oracle',
      badge: '50K MC SIM',
      icon: Trophy,
      description: 'Pandora Circuit, Glicko-2, Style-Rubber Prior',
    },
    {
      id: 'MLB',
      label: 'MLB Prediction Hub',
      badge: 'ISOLATED',
      icon: TrendingUp,
      description: 'F5 ML, Pitcher Ks, Totals, Backtest Lab',
    },
    {
      id: 'NFL',
      label: 'NFL Prediction Hub',
      badge: 'ISOLATED',
      icon: Activity,
      description: 'Dixon-Coles, EPA Spreads, Props & Backtest',
    },
    {
      id: 'CFB',
      label: 'CFB Prediction Hub',
      badge: 'ISOLATED',
      icon: Layers,
      description: 'Markov Drive Simulator, Props & Backtest',
    },
    {
      id: 'MASTER',
      label: 'Master Nexus Dashboard',
      badge: 'AGGREGATED',
      icon: LayoutDashboard,
      description: 'Cross-sport edges & consensus divergence',
    },
    {
      id: 'LIVE_STREAM',
      label: 'Game Event Stream',
      badge: `${liveCount} ACTIVE`,
      icon: Workflow,
      description: 'Structured zero-fabrication play feed',
    },
    {
      id: 'BACKTEST_CALIBRATION',
      label: 'Brier & ECE Calibration',
      badge: 'DUAL BACKTEST',
      icon: LineChart,
      description: 'Empirical post-mortems & reliability curves',
    },
    {
      id: 'AFTER_HOURS_DISCOVERY',
      label: 'After-Hours Alpha Lab',
      badge: 'DARK SLATE',
      icon: Moon,
      description: 'Hypothesis sandbox, circadian & variable discovery',
    },
    {
      id: 'DYNAMIC_LEARNING',
      label: 'Dynamic Self-Modification',
      badge: 'AUTO-REFACTOR',
      icon: GitBranch,
      description: 'Forward progression & elastic discovery',
    },
    {
      id: 'MONOREPO_CODE',
      label: 'Monorepo & Supabase SQL',
      badge: 'CODE REPO',
      icon: Database,
      description: 'PostgreSQL DDL, Python engines, scrape.yml',
    },
  ];

  return (
    <aside 
      id="nexus-persistent-sidebar"
      className="w-64 bg-[#0c0f18] border-r border-[#1a2233] flex flex-col shrink-0 min-h-[calc(100vh-5.25rem)] select-none"
    >
      {/* Sidebar Header Section */}
      <div className="p-4 border-b border-[#182030]">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[11px] font-mono tracking-wider text-slate-400 uppercase">
            OPERATIONAL STACK
          </span>
          <div className="flex items-center space-x-1">
            <span className="inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-emerald-950/80 text-emerald-400 border border-emerald-800">
              SECURE
            </span>
            {onCollapseLeft && (
              <button
                id="btn-sidebar-slide-away"
                onClick={onCollapseLeft}
                title="Slide sidebar away (Focus Mode)"
                className="p-1 rounded hover:bg-slate-800 text-slate-400 hover:text-cyan-300 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
        <p className="text-xs text-slate-300 font-medium">
          The Geter Principle Core
        </p>
        <p className="text-[10px] font-mono text-slate-500 mt-0.5">
          Render · Supabase · Vercel · Actions
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-2.5 py-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isCurrent = currentView === item.id;
          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id.toLowerCase()}`}
              onClick={() => {
                onNavigate(item.id);
                if (item.id === 'MLB' || item.id === 'NFL' || item.id === 'CFB' || item.id === 'TABLE_TENNIS') {
                  onSelectSport(item.id);
                } else if (item.id === 'MASTER') {
                  onSelectSport('ALL');
                }
              }}
              className={`w-full text-left px-3 py-2.5 rounded-lg text-xs font-medium transition-all group flex flex-col space-y-0.5 border ${
                isCurrent
                  ? 'bg-cyan-950/40 text-cyan-200 border-cyan-500/40 shadow-sm'
                  : 'text-slate-300 hover:text-white hover:bg-slate-800/40 border-transparent'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Icon className={`w-4 h-4 ${isCurrent ? 'text-cyan-400' : 'text-slate-400 group-hover:text-cyan-300'}`} />
                  <span className="font-semibold">{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[9px] font-mono px-1.5 py-0.2 rounded border ${
                    isCurrent 
                      ? 'bg-cyan-900/60 text-cyan-300 border-cyan-700' 
                      : 'bg-slate-900 text-slate-400 border-slate-700'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] text-slate-400 font-mono pl-6 leading-tight">
                {item.description}
              </span>
            </button>
          );
        })}
      </nav>

      {/* Persistent Algorithmic Health Box */}
      <div className="p-3 m-2.5 rounded-lg bg-[#111624] border border-[#1f293d] text-[11px] font-mono space-y-2">
        <div className="flex items-center justify-between text-slate-300">
          <span className="text-slate-400">ENGINE STATUS:</span>
          <span className="text-emerald-400 font-bold flex items-center">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mr-1.5 animate-pulse"></span>
            ACTIVE
          </span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>CONSENSUS BIAS:</span>
          <span className="text-cyan-400 font-semibold">BYPASSED</span>
        </div>
        <div className="flex items-center justify-between text-slate-400">
          <span>ZERO-FABRICATION:</span>
          <span className="text-emerald-400 font-semibold">ENFORCED</span>
        </div>
        <div className="pt-1.5 border-t border-[#1d273a] flex items-center justify-between text-[10px] text-slate-500">
          <span>Gemini AI Grounding:</span>
          <span className="text-slate-300">Math-Only (T=0.1)</span>
        </div>
      </div>
    </aside>
  );
};
