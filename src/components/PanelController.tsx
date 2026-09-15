import React, { useState, useEffect, useRef } from 'react';
import { 
  ChevronDown, 
  ChevronUp, 
  ChevronRight, 
  ChevronLeft, 
  Maximize2, 
  Minimize2, 
  Lock, 
  Unlock, 
  LayoutGrid, 
  Sliders, 
  X, 
  Eye, 
  EyeOff,
  Sparkles,
  ArrowRight
} from 'lucide-react';

interface PanelControllerProps {
  topPanelOpen: boolean;
  leftPanelOpen: boolean;
  bottomPanelOpen: boolean;
  onToggleTop: () => void;
  onToggleLeft: () => void;
  onToggleBottom: () => void;
  onToggleAll: (forceOpen?: boolean) => void;
  countdown: number | null; // null when not counting down
  onCancelCountdown: () => void;
  onInstantCollapse: () => void;
  isPinned: boolean;
  onTogglePin: () => void;
}

export const PanelController: React.FC<PanelControllerProps> = ({
  topPanelOpen,
  leftPanelOpen,
  bottomPanelOpen,
  onToggleTop,
  onToggleLeft,
  onToggleBottom,
  onToggleAll,
  countdown,
  onCancelCountdown,
  onInstantCollapse,
  isPinned,
  onTogglePin
}) => {
  const [hudMenuOpen, setHudMenuOpen] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const toastTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Trigger brief toast when panels slide away
  useEffect(() => {
    if (!topPanelOpen && !leftPanelOpen && !bottomPanelOpen && countdown === null) {
      setToastMessage('Focus Mode Active · Tap or slide handles to reveal panels');
      setShowToast(true);
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
      toastTimeoutRef.current = setTimeout(() => {
        setShowToast(false);
      }, 4000);
    }
    return () => {
      if (toastTimeoutRef.current) clearTimeout(toastTimeoutRef.current);
    };
  }, [topPanelOpen, leftPanelOpen, bottomPanelOpen, countdown]);

  const allPanelsHidden = !topPanelOpen && !leftPanelOpen && !bottomPanelOpen;
  const allPanelsOpen = topPanelOpen && leftPanelOpen && bottomPanelOpen;

  return (
    <>
      {/* ========================================================================= */}
      {/* 5-SECOND AUTO-SLIDE COUNTDOWN BANNER (WHEN APP FIRST OPENS) */}
      {/* ========================================================================= */}
      {countdown !== null && countdown > 0 && (
        <div 
          id="panel-countdown-banner"
          className="fixed top-14 left-1/2 -translate-x-1/2 z-50 max-w-md w-[92%] sm:w-auto bg-[#0f172a]/95 border border-cyan-500/60 backdrop-blur-xl shadow-2xl shadow-cyan-500/20 rounded-2xl px-4 py-2.5 flex items-center justify-between gap-3 text-xs font-sans animate-in fade-in slide-in-from-top-4 duration-300"
        >
          <div className="flex items-center space-x-2.5">
            <div className="relative flex items-center justify-center w-7 h-7 rounded-full bg-cyan-950 border border-cyan-500/80 text-cyan-300 font-mono font-bold text-xs">
              <span>{countdown}</span>
              <span className="absolute inset-0 rounded-full border border-cyan-400 animate-ping opacity-30" />
            </div>
            <div>
              <div className="text-white font-semibold flex items-center space-x-1.5">
                <span>Panels sliding away in {countdown}s</span>
                <span className="text-[10px] font-mono px-1.5 py-0.2 bg-cyan-900/60 text-cyan-300 rounded border border-cyan-700/50">
                  Focus View
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                Right panel will slide over to be your main home screen
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              id="btn-countdown-slide-now"
              onClick={onInstantCollapse}
              className="px-2.5 py-1 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-mono font-bold text-[11px] rounded-lg transition-all shadow active:scale-95"
            >
              Slide Now
            </button>
            <button
              id="btn-countdown-keep-open"
              onClick={onCancelCountdown}
              className="px-2.5 py-1 bg-[#1e293b] hover:bg-[#28394f] text-slate-200 hover:text-white font-mono text-[11px] rounded-lg border border-slate-700 transition-all active:scale-95"
              title="Pin all panels open"
            >
              Keep Open
            </button>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* TEMPORARY TOAST NOTICE WHEN PANELS SLIDE AWAY */}
      {/* ========================================================================= */}
      {showToast && (
        <div 
          id="panel-focus-toast"
          className="fixed top-3 left-1/2 -translate-x-1/2 z-40 bg-[#0f172a]/90 border border-[#23334d] text-cyan-300 px-4 py-1.5 rounded-full text-xs font-mono backdrop-blur-md shadow-lg flex items-center space-x-2 animate-in fade-in slide-in-from-top-2 duration-300"
        >
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>{toastMessage}</span>
          <button 
            onClick={() => setShowToast(false)}
            className="text-slate-400 hover:text-white ml-1"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* 1. TOP PANEL EDGE HANDLE (TAP OR SLIDE TO SHOW / HIDE) */}
      {/* ========================================================================= */}
      <button
        id="btn-edge-toggle-top"
        onClick={onToggleTop}
        title={topPanelOpen ? 'Slide top panel away' : 'Tap or slide down to show top panel'}
        className={`fixed top-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 flex items-center space-x-1.5 px-3 py-1 rounded-b-xl border border-t-0 text-[11px] font-mono font-semibold shadow-xl group ${
          topPanelOpen
            ? 'bg-[#131b2b]/80 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border-[#223048] hover:border-red-800/80 -translate-y-0.5'
            : 'bg-[#0f1a2e]/95 hover:bg-cyan-950 text-cyan-400 border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/20 hover:shadow-cyan-500/40 translate-y-0 animate-pulse'
        }`}
      >
        {topPanelOpen ? (
          <>
            <ChevronUp className="w-3.5 h-3.5 group-hover:-translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Hide Top Bar</span>
          </>
        ) : (
          <>
            <ChevronDown className="w-3.5 h-3.5 text-cyan-400 group-hover:translate-y-0.5 transition-transform" />
            <span>Top Bar</span>
          </>
        )}
      </button>

      {/* ========================================================================= */}
      {/* 2. LEFT PANEL EDGE HANDLE (TAP OR SLIDE TO SHOW / HIDE SIDEBAR) */}
      {/* ========================================================================= */}
      <button
        id="btn-edge-toggle-left"
        onClick={onToggleLeft}
        title={leftPanelOpen ? 'Slide left panel away' : 'Tap or slide right to show sidebar'}
        className={`fixed left-0 top-1/2 -translate-y-1/2 z-50 transition-all duration-300 flex flex-col items-center space-y-1 py-3 px-1.5 rounded-r-xl border border-l-0 text-[10px] font-mono font-semibold shadow-xl group ${
          leftPanelOpen
            ? 'bg-[#131b2b]/80 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border-[#223048] hover:border-red-800/80 -translate-x-0.5'
            : 'bg-[#0f1a2e]/95 hover:bg-cyan-950 text-cyan-400 border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/20 hover:shadow-cyan-500/40 translate-x-0'
        }`}
      >
        {leftPanelOpen ? (
          <>
            <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="[writing-mode:vertical-lr] tracking-wider uppercase text-[9px]">
              Hide
            </span>
          </>
        ) : (
          <>
            <ChevronRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-0.5 transition-transform" />
            <span className="[writing-mode:vertical-lr] tracking-widest uppercase text-[9px] text-cyan-300">
              Nav
            </span>
          </>
        )}
      </button>

      {/* ========================================================================= */}
      {/* 3. BOTTOM PANEL EDGE HANDLE (TAP OR SLIDE TO SHOW / HIDE BOTTOM DOCK) */}
      {/* ========================================================================= */}
      <button
        id="btn-edge-toggle-bottom"
        onClick={onToggleBottom}
        title={bottomPanelOpen ? 'Slide bottom panel away' : 'Tap or slide up to show bottom panel'}
        className={`fixed bottom-0 left-1/2 -translate-x-1/2 z-50 transition-all duration-300 flex items-center space-x-1.5 px-3 py-1 rounded-t-xl border border-b-0 text-[11px] font-mono font-semibold shadow-xl group ${
          bottomPanelOpen
            ? 'bg-[#131b2b]/80 hover:bg-red-950/80 text-slate-400 hover:text-red-300 border-[#223048] hover:border-red-800/80 translate-y-0.5'
            : 'bg-[#0f1a2e]/95 hover:bg-cyan-950 text-cyan-400 border-cyan-500/50 hover:border-cyan-400 shadow-cyan-500/20 hover:shadow-cyan-500/40 translate-y-0 animate-pulse'
        }`}
      >
        {bottomPanelOpen ? (
          <>
            <ChevronDown className="w-3.5 h-3.5 group-hover:translate-y-0.5 transition-transform" />
            <span className="hidden sm:inline">Hide Bottom Bar</span>
          </>
        ) : (
          <>
            <ChevronUp className="w-3.5 h-3.5 text-cyan-400 group-hover:-translate-y-0.5 transition-transform" />
            <span>Bottom Bar</span>
          </>
        )}
      </button>

      {/* ========================================================================= */}
      {/* 4. FLOATING HUD PANEL CONTROLLER (CORNER BUTTON WITH QUICK MENU) */}
      {/* ========================================================================= */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col items-end space-y-2">
        {/* HUD Quick Menu Popover */}
        {hudMenuOpen && (
          <div 
            id="panel-hud-popover"
            className="w-56 bg-[#0c1322]/95 border border-[#22334f] rounded-2xl p-3 shadow-2xl backdrop-blur-xl space-y-2.5 animate-in fade-in zoom-in-95 duration-200 font-sans"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-[#1b293f]">
              <span className="text-xs font-mono font-bold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <Sliders className="w-3.5 h-3.5 text-cyan-400" />
                <span>Panels Controller</span>
              </span>
              <button
                onClick={() => setHudMenuOpen(false)}
                className="text-slate-400 hover:text-white p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Quick Master Toggle */}
            <button
              onClick={() => {
                onToggleAll();
                setHudMenuOpen(false);
              }}
              className="w-full py-1.5 px-2.5 rounded-xl bg-[#172338] hover:bg-[#1f314f] text-white font-mono text-xs font-semibold flex items-center justify-between transition-colors"
            >
              <span className="flex items-center space-x-1.5">
                {allPanelsHidden ? (
                  <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                ) : (
                  <Minimize2 className="w-3.5 h-3.5 text-amber-400" />
                )}
                <span>{allPanelsHidden ? 'Show All Panels' : 'Hide All Panels'}</span>
              </span>
              <span className="text-[10px] text-slate-400 font-normal">
                {allPanelsHidden ? 'Default' : 'Focus'}
              </span>
            </button>

            {/* Individual Panel Toggles */}
            <div className="space-y-1 font-mono text-xs">
              <button
                onClick={onToggleTop}
                className={`w-full py-1 px-2 rounded-lg flex items-center justify-between transition-colors ${
                  topPanelOpen ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'bg-[#121929] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Top Panel (Header)</span>
                <span>{topPanelOpen ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={onToggleLeft}
                className={`w-full py-1 px-2 rounded-lg flex items-center justify-between transition-colors ${
                  leftPanelOpen ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'bg-[#121929] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Left Panel (Sidebar)</span>
                <span>{leftPanelOpen ? 'ON' : 'OFF'}</span>
              </button>

              <button
                onClick={onToggleBottom}
                className={`w-full py-1 px-2 rounded-lg flex items-center justify-between transition-colors ${
                  bottomPanelOpen ? 'bg-cyan-950/60 text-cyan-300 border border-cyan-800/60' : 'bg-[#121929] text-slate-400 hover:text-slate-200'
                }`}
              >
                <span>Bottom Panel (Dock)</span>
                <span>{bottomPanelOpen ? 'ON' : 'OFF'}</span>
              </button>
            </div>

            {/* Pin Panels Toggle */}
            <div className="pt-1.5 border-t border-[#1b293f] flex items-center justify-between">
              <button
                onClick={onTogglePin}
                className={`w-full py-1.5 px-2 rounded-lg text-xs font-mono flex items-center justify-center space-x-1.5 transition-all ${
                  isPinned 
                    ? 'bg-amber-950/60 text-amber-300 border border-amber-800/60' 
                    : 'bg-[#141c2c] text-slate-300 hover:text-white'
                }`}
              >
                {isPinned ? (
                  <>
                    <Lock className="w-3.5 h-3.5 text-amber-400" />
                    <span>Panels Pinned Open</span>
                  </>
                ) : (
                  <>
                    <Unlock className="w-3.5 h-3.5 text-slate-400" />
                    <span>Auto-Collapse Active</span>
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {/* Floating Trigger Button */}
        <button
          id="btn-floating-hud-toggle"
          onClick={() => setHudMenuOpen(prev => !prev)}
          title="Toggle Panels & Focus View Controller"
          className={`h-10 px-3 rounded-full border flex items-center space-x-2 text-xs font-mono font-bold shadow-2xl backdrop-blur-md transition-all active:scale-95 ${
            allPanelsHidden
              ? 'bg-[#0e1726]/90 hover:bg-cyan-950 border-cyan-500/70 text-cyan-300 shadow-cyan-500/25'
              : 'bg-[#0f172a]/90 hover:bg-[#1a263c] border-[#22324c] text-slate-300'
          }`}
        >
          {allPanelsHidden ? (
            <>
              <Maximize2 className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Focus View</span>
            </>
          ) : (
            <>
              <LayoutGrid className="w-4 h-4 text-cyan-400" />
              <span className="hidden sm:inline">Panels</span>
            </>
          )}
          {isPinned && (
            <Lock className="w-3 h-3 text-amber-400 ml-0.5" />
          )}
        </button>
      </div>
    </>
  );
};
