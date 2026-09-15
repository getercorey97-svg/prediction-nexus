import React, { useState, useEffect, useRef } from 'react';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { LandingPage } from './components/LandingPage';
import { AuthGateway } from './components/AuthGateway';
import { PersonalHomePage } from './components/PersonalHomePage';
import { AuthModal } from './components/AuthModal';
import { MasterDashboard } from './components/MasterDashboard';
import { SportDashboard } from './components/SportDashboard';
import { LiveStreamViewer } from './components/LiveStreamViewer';
import { BacktestCalibrationHub } from './components/BacktestCalibrationHub';
import { SelfModificationViewer } from './components/SelfModificationViewer';
import { MonorepoViewer } from './components/MonorepoViewer';
import { AccuracyAndLearningHub } from './components/AccuracyAndLearningHub';
import { AutonomousLearningHub } from './components/AutonomousLearningHub';
import { ValueBetsRadarHub } from './components/ValueBetsRadarHub';
import { CalendarPage } from './components/CalendarPage';
import { TennisDashboard } from './components/TennisDashboard';
import { AfterHoursDiscoveryHub } from './components/AfterHoursDiscoveryHub';
import { MatchSearchModal } from './components/MatchSearchModal';
import { PlayerLookupModal } from './components/PlayerLookupModal';
import { AutoBacktestEngineModal } from './components/AutoBacktestEngineModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { PanelController } from './components/PanelController';
import { Game, SportType, CalibrationMetrics, UserSession, CalibratedWeights } from './types';

export default function App() {
  // Navigation & View State (Default to Personal Home)
  const [currentView, setCurrentView] = useState<string>('PERSONAL_HOME');
  const [activeSport, setActiveSport] = useState<SportType | 'ALL'>('ALL');
  
  // Modals across entire application
  const [isMatchSearchOpen, setIsMatchSearchOpen] = useState(false);
  const [isPlayerLookupOpen, setIsPlayerLookupOpen] = useState(false);
  const [selectedPlayerName, setSelectedPlayerName] = useState('');
  const [isAutoBacktestOpen, setIsAutoBacktestOpen] = useState(false);
  
  // Data State
  const [games, setGames] = useState<Game[]>([]);
  const [selectedGameId, setSelectedGameId] = useState<string | null>(null);
  const [calibration, setCalibration] = useState<CalibrationMetrics | null>(null);
  const [liveStreamCount, setLiveStreamCount] = useState<number>(3);
  const [loading, setLoading] = useState(true);

  // User Authentication State
  const [user, setUser] = useState<UserSession>({
    email: 'getercorey97@gmail.com',
    isAuthenticated: true,
    tier: 'QUANT_PRO',
    apiConnected: true,
  });
  const [authModalOpen, setAuthModalOpen] = useState(false);

  // Dynamic Collapsible Panels (Top, Left, Bottom)
  const [topPanelOpen, setTopPanelOpen] = useState(true);
  const [leftPanelOpen, setLeftPanelOpen] = useState(true);
  const [bottomPanelOpen, setBottomPanelOpen] = useState(true);
  const [panelsPinned, setPanelsPinned] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(5);
  const autoDismissTimerRef = useRef<NodeJS.Timeout | null>(null);
  const touchStartRef = useRef<{ x: number; y: number; time: number } | null>(null);

  // 5-second countdown to auto-collapse left, top, and bottom panels into Focus Home Mode
  useEffect(() => {
    if (!user.isAuthenticated || currentView !== 'PERSONAL_HOME' || panelsPinned) {
      return;
    }

    if (countdown === null) return;

    if (countdown <= 0) {
      setTopPanelOpen(false);
      setLeftPanelOpen(false);
      setBottomPanelOpen(false);
      setCountdown(null);
      return;
    }

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          setTopPanelOpen(false);
          setLeftPanelOpen(false);
          setBottomPanelOpen(false);
          return null;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [user.isAuthenticated, currentView, panelsPinned, countdown]);

  // Auto-dismiss summoned panels after 8 seconds of inactivity if not pinned
  useEffect(() => {
    if (panelsPinned || countdown !== null) return;

    if (topPanelOpen || leftPanelOpen || bottomPanelOpen) {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
      autoDismissTimerRef.current = setTimeout(() => {
        setTopPanelOpen(false);
        setLeftPanelOpen(false);
        setBottomPanelOpen(false);
      }, 8000);
    }

    return () => {
      if (autoDismissTimerRef.current) clearTimeout(autoDismissTimerRef.current);
    };
  }, [topPanelOpen, leftPanelOpen, bottomPanelOpen, panelsPinned, countdown]);

  // Touch Edge Swipe Gestures (Swipe from edges to slide panels in/out)
  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (e.touches.length === 1) {
        touchStartRef.current = {
          x: e.touches[0].clientX,
          y: e.touches[0].clientY,
          time: Date.now()
        };
      }
    };

    const handleTouchEnd = (e: TouchEvent) => {
      if (!touchStartRef.current || e.changedTouches.length === 0) return;
      const start = touchStartRef.current;
      const end = {
        x: e.changedTouches[0].clientX,
        y: e.changedTouches[0].clientY
      };
      const dx = end.x - start.x;
      const dy = end.y - start.y;
      const dt = Date.now() - start.time;
      touchStartRef.current = null;

      if (dt > 700) return;

      const screenHeight = window.innerHeight;

      // Swipe right from left edge (< 40px) -> open left panel
      if (start.x <= 40 && dx > 40 && Math.abs(dy) < 80) {
        setLeftPanelOpen(true);
        return;
      }
      // Swipe left on left panel to close
      if (leftPanelOpen && dx < -50 && Math.abs(dy) < 80) {
        setLeftPanelOpen(false);
        return;
      }

      // Swipe down from top edge (< 40px) -> open top panel
      if (start.y <= 40 && dy > 40 && Math.abs(dx) < 80) {
        setTopPanelOpen(true);
        return;
      }
      // Swipe up to close top panel
      if (topPanelOpen && dy < -50 && Math.abs(dx) < 80) {
        setTopPanelOpen(false);
        return;
      }

      // Swipe up from bottom edge -> open bottom panel
      if (start.y >= screenHeight - 65 && dy < -40 && Math.abs(dx) < 80) {
        setBottomPanelOpen(true);
        return;
      }
      // Swipe down to close bottom panel
      if (bottomPanelOpen && dy > 50 && Math.abs(dx) < 80) {
        setBottomPanelOpen(false);
        return;
      }
    };

    window.addEventListener('touchstart', handleTouchStart, { passive: true });
    window.addEventListener('touchend', handleTouchEnd, { passive: true });
    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [leftPanelOpen, topPanelOpen, bottomPanelOpen]);

  // Fetch games & calibration on load
  const loadInitialData = async () => {
    try {
      setLoading(true);
      const [gamesRes, calibRes] = await Promise.all([
        fetch('/api/games'),
        fetch('/api/calibration?sport=ALL'),
      ]);
      const gamesData = await gamesRes.json();
      const calibData = await calibRes.json();

      setGames(gamesData);
      setCalibration(calibData);
      if (gamesData.length > 0) {
        setSelectedGameId(gamesData[0].id);
      }
    } catch (err) {
      console.error('Failed to load initial nexus data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInitialData();

    // Auto-poll live game telemetry every 30s so scores & innings stay up to date
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch('/api/games');
        if (res.ok) {
          const freshGames = await res.json();
          if (Array.isArray(freshGames) && freshGames.length > 0) {
            setGames(freshGames);
          }
        }
      } catch (err) {
        // Silent poll fail
      }
    }, 30000);

    return () => clearInterval(pollInterval);
  }, []);

  const handleSyncLiveGames = async () => {
    try {
      const res = await fetch('/api/games/sync-live', { method: 'POST' });
      const data = await res.json();
      if (data.games && Array.isArray(data.games)) {
        setGames(data.games);
        if (!selectedGameId && data.games.length > 0) {
          setSelectedGameId(data.games[0].id);
        }
      }
    } catch (err) {
      console.error('Failed to sync live games:', err);
    }
  };

  // Update Game Weights (from interactive sliders)
  const handleUpdateWeights = async (gameId: string, updatedWeights: CalibratedWeights) => {
    try {
      const res = await fetch(`/api/games/${gameId}/weights`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedWeights),
      });
      const updatedGame: Game = await res.json();
      setGames(prev => prev.map(g => g.id === gameId ? updatedGame : g));
    } catch (err) {
      console.error('Error updating game weights:', err);
    }
  };

  // Reset Game Weights
  const handleResetWeights = async (gameId: string) => {
    const game = games.find(g => g.id === gameId);
    if (!game) return;
    const baseline = {
      weatherWeight: game.weights.weatherOptimal,
      marketOddsWeight: game.weights.marketOddsOptimal,
      pitchingOrQbWeight: game.weights.pitchingOrQbOptimal,
      recentFormWeight: game.weights.recentFormOptimal,
      travelFatigueWeight: game.weights.travelFatigueOptimal,
    };
    handleUpdateWeights(gameId, { ...game.weights, ...baseline });
  };

  // Run On-Demand Manual Backtesting
  const handleRunBacktest = async (sport: SportType | 'ALL') => {
    const res = await fetch('/api/backtest/run', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ sport }),
    });
    const data = await res.json();
    if (data.metrics) {
      setCalibration(data.metrics);
    }
  };

  const selectedGame = games.find(g => g.id === selectedGameId) || games[0];
  const filteredSportGames = activeSport === 'ALL' 
    ? games 
    : games.filter(g => g.sport === activeSport);

  return (
    <div id="nexus-app-root" className="min-h-screen bg-[#090c13] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950 relative overflow-x-hidden">
      {/* Top Navbar Panel (Smooth Slide-Up/Down) */}
      <div 
        id="top-panel-wrapper"
        className={`w-full z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
          topPanelOpen 
            ? 'translate-y-0 opacity-100 max-h-40' 
            : '-translate-y-full opacity-0 max-h-0 pointer-events-none overflow-hidden'
        }`}
      >
        <Navbar
          activeSport={activeSport}
          onSelectSport={(sport) => {
            setActiveSport(sport);
            if (sport === 'ALL') {
              setCurrentView('MASTER');
            } else {
              setCurrentView(sport);
              const firstOfSport = games.find(g => g.sport === sport);
              if (firstOfSport) setSelectedGameId(firstOfSport.id);
            }
            if (!panelsPinned) setTopPanelOpen(false);
          }}
          user={user}
          onOpenAuth={() => {
            if (!user.isAuthenticated) {
              setCurrentView('AUTH');
            } else {
              setAuthModalOpen(true);
            }
          }}
          onLogout={() => {
            setUser({ email: '', isAuthenticated: false, tier: 'PUBLIC_OBSERVER', apiConnected: false });
            setCurrentView('AUTH');
          }}
          onNavigate={(view) => {
            setCurrentView(view);
            if (!panelsPinned) setTopPanelOpen(false);
          }}
          onOpenMatchSearch={() => setIsMatchSearchOpen(true)}
          onOpenPlayerLookup={() => {
            setSelectedPlayerName('');
            setIsPlayerLookupOpen(true);
          }}
          onOpenAutoBacktest={() => setIsAutoBacktestOpen(true)}
          onCollapseTop={() => setTopPanelOpen(false)}
        />
      </div>

      {/* Main Layout Area with Persistent Sidebar */}
      <div className="flex-1 flex w-full relative overflow-hidden">
        {user.isAuthenticated && currentView !== 'LANDING' && currentView !== 'AUTH' && (
          <div 
            id="left-panel-wrapper"
            className={`z-30 shrink-0 h-full transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
              leftPanelOpen 
                ? 'w-64 translate-x-0 opacity-100' 
                : 'w-0 -translate-x-full opacity-0 pointer-events-none overflow-hidden'
            }`}
          >
            <Sidebar
              currentView={currentView}
              onNavigate={(view) => {
                setCurrentView(view);
                if (!panelsPinned) setLeftPanelOpen(false);
              }}
              activeSport={activeSport}
              onSelectSport={(sport) => {
                setActiveSport(sport);
                if (sport !== 'ALL') {
                  const firstOfSport = games.find(g => g.sport === sport);
                  if (firstOfSport) setSelectedGameId(firstOfSport.id);
                }
                if (!panelsPinned) setLeftPanelOpen(false);
              }}
              liveCount={liveStreamCount}
              onCollapseLeft={() => setLeftPanelOpen(false)}
            />
          </div>
        )}

        {/* Main Content View Container (Right Panel that expands smoothly to fill full home screen) */}
        <main 
          id="right-main-panel"
          onClick={() => {
            // Tapping on the main screen dismisses temporarily summoned unpinned panels
            if (!panelsPinned && countdown === null && (topPanelOpen || leftPanelOpen || bottomPanelOpen)) {
              setTopPanelOpen(false);
              setLeftPanelOpen(false);
              setBottomPanelOpen(false);
            }
          }}
          className={`flex-1 w-full max-w-7xl mx-auto p-3 sm:p-6 overflow-y-auto transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            bottomPanelOpen ? 'pb-24 md:pb-12' : 'pb-8'
          }`}
        >
          {/* VIEW: AUTHENTICATION / LOGIN & SIGN UP */}
          {(!user.isAuthenticated || currentView === 'AUTH') && (
            <AuthGateway
              onLogin={(loggedUser) => {
                setUser(loggedUser);
                setCurrentView('PERSONAL_HOME');
              }}
            />
          )}

          {/* VIEW: PERSONAL HOMEPAGE (Games happening right now, upcoming, finished with upgrades, top picks) */}
          {user.isAuthenticated && currentView === 'PERSONAL_HOME' && (
            <PersonalHomePage
              user={user}
              games={games}
              onNavigateToSportHub={(sport, gameId) => {
                setActiveSport(sport);
                setCurrentView(sport);
                if (gameId) {
                  setSelectedGameId(gameId);
                } else {
                  const firstOfSport = games.find(g => g.sport === sport);
                  if (firstOfSport) setSelectedGameId(firstOfSport.id);
                }
              }}
              onNavigateToLiveStream={(sport) => {
                if (sport) setActiveSport(sport);
                setCurrentView('LIVE_STREAM');
              }}
              onNavigateToBacktest={(sport) => {
                if (sport) setActiveSport(sport);
                setCurrentView('BACKTEST_CALIBRATION');
              }}
              onNavigateToAccuracyLedger={() => {
                setCurrentView('ACCURACY_LEDGER');
              }}
              onNavigateToCalendar={() => {
                setCurrentView('CALENDAR');
              }}
              onNavigateToAfterHours={() => {
                setCurrentView('AFTER_HOURS_DISCOVERY');
              }}
              onGameUpdated={(updatedGame) => {
                setGames(prev => prev.map(g => g.id === updatedGame.id ? updatedGame : g));
              }}
              onRefreshLiveGames={handleSyncLiveGames}
            />
          )}

          {/* VIEW: PRE-LOGIN LANDING PAGE */}
          {user.isAuthenticated && currentView === 'LANDING' && (
            <LandingPage
              onEnterApp={() => setCurrentView('PERSONAL_HOME')}
              onOpenAuth={() => setAuthModalOpen(true)}
            />
          )}

          {/* VIEW: MASTER AGGREGATED DASHBOARD */}
          {user.isAuthenticated && currentView === 'MASTER' && calibration && (
            <MasterDashboard
              games={games}
              calibration={calibration}
              onSelectGame={(gameId, sport) => {
                setSelectedGameId(gameId);
                setActiveSport(sport);
                setCurrentView(sport);
              }}
              onNavigateToSport={(sport) => {
                setActiveSport(sport);
                setCurrentView(sport);
                const firstOfSport = games.find(g => g.sport === sport);
                if (firstOfSport) setSelectedGameId(firstOfSport.id);
              }}
            />
          )}

          {/* VIEW: SPORT SPECIFIC DASHBOARDS (MLB, NFL, CFB) */}
          {user.isAuthenticated && (currentView === 'MLB' || currentView === 'NFL' || currentView === 'CFB') && selectedGame && (
            <SportDashboard
              sport={currentView as SportType}
              games={filteredSportGames.length > 0 ? filteredSportGames : games}
              selectedGame={selectedGame}
              onSelectGame={(game) => setSelectedGameId(game.id)}
              onUpdateWeights={handleUpdateWeights}
              onResetWeights={handleResetWeights}
              calibration={calibration}
              onRunBacktest={handleRunBacktest}
              onNavigateToAfterHours={() => setCurrentView('AFTER_HOURS_DISCOVERY')}
            />
          )}

          {/* VIEW: SOTA TENNIS PREDICTION ENGINE (ATP / WTA / FANDUEL) */}
          {user.isAuthenticated && (currentView === 'TENNIS' || currentView === 'TABLE_TENNIS') && (
            <TennisDashboard />
          )}

          {/* VIEW: LIVE TELEMETRY GAME STREAM */}
          {user.isAuthenticated && currentView === 'LIVE_STREAM' && (
            <LiveStreamViewer
              activeSport={activeSport}
              onSelectSport={(sport) => setActiveSport(sport)}
            />
          )}

          {/* VIEW: FACTUAL POST-MORTEM & DUAL BACKTESTING */}
          {user.isAuthenticated && currentView === 'BACKTEST_CALIBRATION' && calibration && (
            <BacktestCalibrationHub
              activeSport={activeSport}
              calibration={calibration}
              onRunBacktest={handleRunBacktest}
            />
          )}

          {/* VIEW: DYNAMIC LEARNING & SELF-MODIFICATION */}
          {user.isAuthenticated && currentView === 'DYNAMIC_LEARNING' && (
            <SelfModificationViewer />
          )}

          {/* VIEW: VALUE BETS & PORTFOLIO SLIP RADAR */}
          {user.isAuthenticated && currentView === 'VALUE_BETS' && (
            <ValueBetsRadarHub
              games={games}
              onNavigateToGame={(gameId, sport) => {
                setSelectedGameId(gameId);
                setActiveSport(sport);
                setCurrentView(sport);
              }}
              onNavigateToTableTennis={() => {
                setActiveSport('TENNIS');
                setCurrentView('TENNIS');
              }}
            />
          )}

          {/* VIEW: FACTUAL MATCH CALENDAR & SLATE NAVIGATOR */}
          {user.isAuthenticated && currentView === 'CALENDAR' && (
            <CalendarPage
              games={games}
              user={user}
              onNavigateToSportHub={(sport, gameId) => {
                if (sport === 'TENNIS' || (sport as string) === 'TABLE_TENNIS') {
                  setActiveSport('TENNIS');
                  setCurrentView('TENNIS');
                } else {
                  setActiveSport(sport);
                  setCurrentView(sport);
                  if (gameId) {
                    setSelectedGameId(gameId);
                  }
                }
              }}
              onNavigateToLiveStream={(sport) => {
                if (sport) setActiveSport(sport);
                setCurrentView('LIVE_STREAM');
              }}
            />
          )}

          {/* VIEW: ACCURACY RECORD & PERFORMANCE AUDIT HUB */}
          {user.isAuthenticated && currentView === 'ACCURACY_LEDGER' && (
            <AccuracyAndLearningHub
              initialSport={activeSport}
              onNavigateToSport={(sport) => {
                setActiveSport(sport);
                setCurrentView(sport);
                const firstOfSport = games.find(g => g.sport === sport);
                if (firstOfSport) setSelectedGameId(firstOfSport.id);
              }}
              onNavigateToBacktest={(sport) => {
                if (sport) setActiveSport(sport);
                setCurrentView('BACKTEST_CALIBRATION');
              }}
              onNavigateToLearningEngine={() => {
                setCurrentView('LEARNING_ENGINE');
              }}
            />
          )}

          {/* VIEW: AUTONOMOUS LEARNING DAEMON & CLOUD WEIGHTS */}
          {user.isAuthenticated && currentView === 'LEARNING_ENGINE' && (
            <AutonomousLearningHub
              onNavigateToSport={(sport) => {
                setActiveSport(sport);
                setCurrentView(sport);
                const firstOfSport = games.find(g => g.sport === sport);
                if (firstOfSport) setSelectedGameId(firstOfSport.id);
              }}
              onNavigateToBacktest={(sport) => {
                if (sport) setActiveSport(sport);
                setCurrentView('BACKTEST_CALIBRATION');
              }}
            />
          )}

          {/* VIEW: MONOREPO & REPOSITORIES HUB */}
          {user.isAuthenticated && currentView === 'MONOREPO_CODE' && (
            <MonorepoViewer />
          )}

          {/* VIEW: AFTER-HOURS QUANT ALPHA & HYPOTHESIS DISCOVERY LAB */}
          {user.isAuthenticated && currentView === 'AFTER_HOURS_DISCOVERY' && (
            <AfterHoursDiscoveryHub
              initialSport={activeSport}
              onNavigateToSport={(sport) => {
                setActiveSport(sport);
                setCurrentView(sport);
                const firstOfSport = games.find(g => g.sport === sport);
                if (firstOfSport) setSelectedGameId(firstOfSport.id);
              }}
            />
          )}
        </main>
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={(loggedUser) => setUser(loggedUser)}
      />

      {/* Global Universal Match Search Modal */}
      <MatchSearchModal
        isOpen={isMatchSearchOpen}
        onClose={() => setIsMatchSearchOpen(false)}
        onSelectMatch={(match) => {
          if (match.sport === 'TENNIS' || (match.sport as string) === 'TABLE_TENNIS') {
            setActiveSport('TENNIS');
            setCurrentView('TENNIS');
          } else {
            setActiveSport(match.sport);
            setCurrentView(match.sport);
            const found = games.find(g => g.id === match.id);
            if (found) setSelectedGameId(found.id);
          }
        }}
        onSelectPlayer={(playerName) => {
          setSelectedPlayerName(playerName);
          setIsPlayerLookupOpen(true);
        }}
      />

      {/* Global Live Player Information Lookup Modal */}
      <PlayerLookupModal
        isOpen={isPlayerLookupOpen}
        onClose={() => setIsPlayerLookupOpen(false)}
        initialPlayerName={selectedPlayerName}
        onSelectForSim={(_playerName) => {
          setActiveSport('TENNIS');
          setCurrentView('TENNIS');
        }}
      />

      {/* Multi-Sport Continuous Automatic Backtesting Engine Monitor */}
      <AutoBacktestEngineModal
        isOpen={isAutoBacktestOpen}
        onClose={() => setIsAutoBacktestOpen(false)}
      />

      {/* Bottom Navigation Dock Panel (Smooth Slide-Down/Up) */}
      {user.isAuthenticated && currentView !== 'AUTH' && (
        <div 
          id="bottom-panel-wrapper"
          className={`fixed bottom-0 left-0 right-0 z-40 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
            bottomPanelOpen 
              ? 'translate-y-0 opacity-100' 
              : 'translate-y-full opacity-0 pointer-events-none overflow-hidden'
          }`}
        >
          <MobileBottomNav
            currentView={
              currentView === 'PERSONAL_HOME'
                ? 'PERSONAL_HOMEPAGE'
                : (currentView === 'TENNIS' || currentView === 'TABLE_TENNIS')
                ? 'TENNIS'
                : 'MASTER_DASHBOARD'
            }
            onSelectView={(view) => {
              if (view === 'PERSONAL_HOMEPAGE') setCurrentView('PERSONAL_HOME');
              else if (view === 'TENNIS' || (view as string) === 'TABLE_TENNIS') {
                setActiveSport('TENNIS');
                setCurrentView('TENNIS');
              }
              else setCurrentView('MASTER');
              if (!panelsPinned) setBottomPanelOpen(false);
            }}
            onOpenMatchSearch={() => setIsMatchSearchOpen(true)}
            onOpenPlayerLookup={() => {
              setSelectedPlayerName('');
              setIsPlayerLookupOpen(true);
            }}
            onOpenAutoBacktest={() => setIsAutoBacktestOpen(true)}
            onCollapseBottom={() => setBottomPanelOpen(false)}
          />
        </div>
      )}

      {/* Edge Handles and Quick HUD Controller (Tap or Slide To Reveal & Dismiss) */}
      {user.isAuthenticated && currentView !== 'AUTH' && (
        <PanelController
          topPanelOpen={topPanelOpen}
          leftPanelOpen={leftPanelOpen}
          bottomPanelOpen={bottomPanelOpen}
          onToggleTop={() => setTopPanelOpen(prev => !prev)}
          onToggleLeft={() => setLeftPanelOpen(prev => !prev)}
          onToggleBottom={() => setBottomPanelOpen(prev => !prev)}
          onToggleAll={(forceOpen) => {
            const open = forceOpen !== undefined ? forceOpen : (!topPanelOpen || !leftPanelOpen || !bottomPanelOpen);
            setTopPanelOpen(open);
            setLeftPanelOpen(open);
            setBottomPanelOpen(open);
          }}
          countdown={countdown}
          onCancelCountdown={() => {
            setCountdown(null);
            setPanelsPinned(true);
            setTopPanelOpen(true);
            setLeftPanelOpen(true);
            setBottomPanelOpen(true);
          }}
          onInstantCollapse={() => {
            setCountdown(null);
            setTopPanelOpen(false);
            setLeftPanelOpen(false);
            setBottomPanelOpen(false);
          }}
          isPinned={panelsPinned}
          onTogglePin={() => setPanelsPinned(prev => !prev)}
        />
      )}
    </div>
  );
}
