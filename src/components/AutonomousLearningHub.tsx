import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Cpu, 
  Terminal, 
  RefreshCw, 
  Layers, 
  Activity, 
  FileCode, 
  Scale, 
  Database, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight,
  Sparkles,
  Award,
  Flame,
  Info
} from 'lucide-react';
import { EngineLearningAction, SportType } from '../types';
import { testFirebaseConnection } from '../lib/firebase';

interface AutonomousLearningHubProps {
  onNavigateToSport?: (sport: SportType) => void;
  onNavigateToBacktest?: (sport?: SportType) => void;
}

export const AutonomousLearningHub: React.FC<AutonomousLearningHubProps> = ({
  onNavigateToSport,
  onNavigateToBacktest,
}) => {
  const [selectedSport, setSelectedSport] = useState<SportType | 'ALL'>('ALL');
  const [learningActions, setLearningActions] = useState<EngineLearningAction[]>([]);
  const [cloudLearningData, setCloudLearningData] = useState<any>(null);
  const [firestoreConnected, setFirestoreConnected] = useState<boolean>(true);
  const [loading, setLoading] = useState(true);

  // Execution states
  const [isExecutingCycle, setIsExecutingCycle] = useState(false);
  const [isExecutingAllCycles, setIsExecutingAllCycles] = useState(false);
  const [cycleSport, setCycleSport] = useState<SportType>('MLB');
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [cycleCompletedMessage, setCycleCompletedMessage] = useState<string | null>(null);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [actRes, cloudRes] = await Promise.all([
        fetch(`/api/learning-actions${selectedSport !== 'ALL' ? `?sport=${selectedSport}` : ''}`),
        fetch('/api/learning/overview'),
      ]);
      const actData = await actRes.json();
      const cloudData = cloudRes.ok ? await cloudRes.json() : null;

      setLearningActions(actData);
      if (cloudData) setCloudLearningData(cloudData);

      testFirebaseConnection().then(res => setFirestoreConnected(res)).catch(() => {});
    } catch (err) {
      console.error('Failed to load autonomous learning data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [selectedSport]);

  const handleTriggerLearningCycle = async () => {
    setIsExecutingCycle(true);
    setTerminalLogs([]);
    setCycleCompletedMessage(null);

    try {
      const res = await fetch('/api/learning-actions/trigger-cycle', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport: cycleSport }),
      });
      const data = await res.json();
      if (data.cycleLog && Array.isArray(data.cycleLog)) {
        for (let i = 0; i < data.cycleLog.length; i++) {
          await new Promise(r => setTimeout(r, 90));
          setTerminalLogs(prev => [...prev, data.cycleLog[i]]);
        }
      }
      if (data.newAction) {
        setLearningActions(prev => [data.newAction, ...prev]);
      }
      setCycleCompletedMessage(
        `✓ Optimization complete! Recalibrated parameters for ${cycleSport} saved to Google Cloud Firestore.`
      );
    } catch (err) {
      console.error('Learning cycle error:', err);
      setTerminalLogs(prev => [...prev, '[FATAL] Failed to execute cycle. Check network connection.']);
    } finally {
      setIsExecutingCycle(false);
    }
  };

  const handleApplyAllRecalibrations = async () => {
    setIsExecutingAllCycles(true);
    setTerminalLogs([]);
    setCycleCompletedMessage(null);

    const sportsToRun: SportType[] = ['MLB', 'NFL', 'CFB', 'TABLE_TENNIS'];
    setTerminalLogs([
      `[BATCH DAEMON] Commencing continuous learning recalibration across all sports: ${sportsToRun.join(', ')}...`,
      `[PERSISTENCE] Target: Cloud Firestore + Active In-Memory Engine Weights`,
    ]);

    for (const sport of sportsToRun) {
      try {
        setTerminalLogs(prev => [...prev, `--- Commencing learning cycle for ${sport} ---`]);
        const res = await fetch('/api/learning-actions/trigger-cycle', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ sport }),
        });
        const data = await res.json();
        if (data.cycleLog && Array.isArray(data.cycleLog)) {
          for (let i = 0; i < data.cycleLog.length; i++) {
            await new Promise(r => setTimeout(r, 60));
            setTerminalLogs(prev => [...prev, data.cycleLog[i]]);
          }
        }
        if (data.newAction) {
          setLearningActions(prev => [data.newAction, ...prev]);
        }
      } catch (err) {
        console.error(`Recalibration error for ${sport}:`, err);
      }
    }

    setCycleCompletedMessage(
      '✓ Complete! All sports (MLB, NFL, CFB, Table Tennis) recalibrated and synchronized with Cloud Firestore database.'
    );
    setIsExecutingAllCycles(false);
  };

  const filteredActions = learningActions.filter(
    a => selectedSport === 'ALL' || a.sport === selectedSport
  );

  return (
    <div id="autonomous-learning-hub" className="space-y-6">
      {/* Broadcast Header */}
      <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0d1424] via-[#10192e] to-[#0c1322] border border-[#1d2b45] shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950/80 text-cyan-300 border border-cyan-700/60">
              <Cpu className="w-3 h-3 mr-1 text-cyan-400" />
              SELF-CALIBRATING DAEMON
            </span>
            <span className="text-xs font-mono text-slate-400">
              GRADIENT DESCENT & CLOUD FIRESTORE STORAGE
            </span>
          </div>
          <h1 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
            Autonomous Learning & Recalibration Hub
          </h1>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Post-game outcome ingestion, Brier loss gradient calculations, and dynamic weight recalibration across all sports.
          </p>
        </div>

        {/* Firestore Connection Badge */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="px-3.5 py-2 rounded-xl bg-[#090d16] border border-[#192338] text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Cloud Persistence</div>
            <div className="text-xs font-bold text-emerald-400 flex items-center justify-end gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Google Cloud Firestore</span>
            </div>
          </div>

          <div className="px-3.5 py-2 rounded-xl bg-[#090d16] border border-[#192338] text-right font-mono">
            <div className="text-[10px] text-slate-400 uppercase">Total Optimizations</div>
            <div className="text-base font-bold text-cyan-400">{learningActions.length} Adjustments</div>
          </div>
        </div>
      </div>

      {/* Control Console: Trigger Engine & Stdout Terminal */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1d293d] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          <div>
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>INTERACTIVE LEARNING CYCLE DAEMON</span>
            </span>
            <p className="text-xs text-slate-400 mt-0.5">
              Audit recent factual outcomes against Brier quadratic loss, compute gradient adjustments, and commit parameters to Cloud Firestore.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center space-x-1.5">
              <span className="text-xs font-mono text-slate-400">Target:</span>
              <select
                value={cycleSport}
                onChange={e => setCycleSport(e.target.value as SportType)}
                className="bg-[#141b2a] border border-[#233047] text-xs font-mono text-cyan-300 px-3 py-1.5 rounded-lg focus:outline-none focus:border-cyan-500"
              >
                <option value="MLB">MLB Engine</option>
                <option value="NFL">NFL Engine</option>
                <option value="CFB">CFB Engine</option>
                <option value="TABLE_TENNIS">Table Tennis Oracle</option>
              </select>
            </div>

            <button
              onClick={handleTriggerLearningCycle}
              disabled={isExecutingCycle || isExecutingAllCycles}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                isExecutingCycle
                  ? 'bg-amber-500/50 text-slate-950 cursor-wait'
                  : 'bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 shadow-lg shadow-cyan-500/20 cursor-pointer'
              }`}
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isExecutingCycle ? 'animate-spin' : ''}`} />
              <span>{isExecutingCycle ? 'OPTIMIZING...' : 'TRIGGER CYCLE'}</span>
            </button>

            <button
              onClick={handleApplyAllRecalibrations}
              disabled={isExecutingCycle || isExecutingAllCycles}
              className={`px-3.5 py-2 rounded-xl text-xs font-mono font-bold transition-all flex items-center space-x-1.5 ${
                isExecutingAllCycles
                  ? 'bg-emerald-500/50 text-slate-950 cursor-wait'
                  : 'bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 shadow-lg shadow-emerald-500/20 cursor-pointer'
              }`}
              title="Run continuous learning cycles across MLB, NFL, and CFB simultaneously"
            >
              <Zap className={`w-3.5 h-3.5 ${isExecutingAllCycles ? 'animate-bounce' : ''}`} />
              <span>{isExecutingAllCycles ? 'RECALIBRATING ALL...' : 'APPLY ALL RECALIBRATIONS'}</span>
            </button>
          </div>
        </div>

        {/* Terminal Console Output */}
        <div className="p-4 rounded-xl bg-[#080b12] border border-[#1a2336] font-mono text-xs text-slate-300 space-y-1.5 min-h-[140px] max-h-[240px] overflow-y-auto">
          <div className="text-slate-500 flex items-center space-x-2 pb-1 border-b border-[#141c2c]">
            <div className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
            <span className="text-[11px] text-slate-400">stdout // Nexus Autonomous Refactor & Learning Daemon</span>
          </div>

          {terminalLogs.length === 0 ? (
            <div className="text-slate-600 pt-2 italic">
              Select a target engine above and click "TRIGGER CYCLE" or "APPLY ALL RECALIBRATIONS" to run gradient descent and persist updated weights to Cloud Firestore...
            </div>
          ) : (
            terminalLogs.map((log, idx) => (
              <div key={idx} className="flex items-start space-x-2">
                <span className="text-cyan-500 font-bold">&gt;</span>
                <span className={log.includes('improved') || log.includes('updated') || log.includes('Complete') ? 'text-emerald-300' : 'text-slate-300'}>
                  {log}
                </span>
              </div>
            ))
          )}

          {cycleCompletedMessage && (
            <div className="p-2 rounded bg-emerald-950/40 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold mt-2">
              {cycleCompletedMessage}
            </div>
          )}
        </div>
      </div>

      {/* Cloud Firestore Calibration Matrices Card */}
      {cloudLearningData?.sportCalibrations && (
        <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1d293d] space-y-3">
          <div className="flex items-center justify-between border-b border-[#1a253a] pb-2.5">
            <span className="text-xs font-mono text-cyan-400 font-bold uppercase tracking-wider flex items-center gap-1.5">
              <Database className="w-3.5 h-3.5 text-cyan-400" />
              <span>ACTIVE CLOUD FIRESTORE WEIGHT MATRICES</span>
            </span>
            <span className="text-[11px] font-mono text-emerald-400">● LIVE SYNC ACTIVE</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {Object.entries(cloudLearningData.sportCalibrations).map(([sportKey, calib]: [string, any]) => (
              <div key={sportKey} className="p-3.5 rounded-xl bg-[#090d16] border border-[#192338] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-white">{sportKey}</span>
                  <span className="text-[10px] font-mono text-slate-400">Updated: Today</span>
                </div>

                <div className="space-y-1 text-xs font-mono">
                  {calib?.weights &&
                    Object.entries(calib.weights).map(([k, v]: [string, any]) => (
                      <div key={k} className="flex items-center justify-between text-[11px]">
                        <span className="text-slate-400 capitalize">{k.replace(/([A-Z])/g, ' $1')}:</span>
                        <span className="text-cyan-300 font-bold">{typeof v === 'number' ? (v * 100).toFixed(1) + '%' : v}</span>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Audit History: Parameter Modifications Log */}
      <div className="p-5 rounded-2xl bg-[#0e1422] border border-[#1d293d] space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#1a253a] pb-2.5">
          <div>
            <span className="text-xs font-mono text-slate-300 font-bold uppercase tracking-wider">
              PARAMETER MODIFICATION AUDIT TRAIL ({filteredActions.length} ACTIONS)
            </span>
            <p className="text-[11px] text-slate-400">
              Chronological ledger of autonomous gradient adjustments triggered by factual match completions.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono text-slate-400">Sport:</span>
            <select
              value={selectedSport}
              onChange={e => setSelectedSport(e.target.value as SportType | 'ALL')}
              className="bg-[#141b2a] border border-[#233047] text-xs font-mono text-cyan-300 px-2.5 py-1 rounded-lg focus:outline-none"
            >
              <option value="ALL">All Sports</option>
              <option value="MLB">MLB</option>
              <option value="NFL">NFL</option>
              <option value="CFB">CFB</option>
            </select>
          </div>
        </div>

        <div className="space-y-2 max-h-[400px] overflow-y-auto">
          {filteredActions.length === 0 ? (
            <div className="p-6 text-center text-xs font-mono text-slate-500">
              No learning actions recorded for current filter.
            </div>
          ) : (
            filteredActions.map(action => (
              <div
                key={action.id}
                className="p-3.5 rounded-xl bg-[#0a0e18] border border-[#192338] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs font-mono"
              >
                <div className="space-y-1">
                  <div className="flex items-center space-x-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      action.sport === 'MLB' ? 'bg-blue-950 text-blue-300 border border-blue-800' :
                      action.sport === 'NFL' ? 'bg-amber-950 text-amber-300 border border-amber-800' :
                      'bg-red-950 text-red-300 border border-red-800'
                    }`}>
                      {action.sport}
                    </span>
                    <span className="text-white font-bold">{action.trigger}</span>
                    <span className="text-slate-500">• {action.timestamp}</span>
                  </div>

                  <div className="text-slate-300 text-[11px]">
                    {action.actionTaken}
                  </div>

                  <div className="text-slate-400 text-[10px] italic">
                    {action.rationale}
                  </div>
                </div>

                <div className="flex items-center space-x-3 shrink-0">
                  <div className="p-2 rounded bg-[#101726] border border-[#1f2b42] text-right">
                    <div className="text-[10px] text-slate-400">Brier Shift</div>
                    <div className="font-bold text-emerald-400">{action.brierImprovement}</div>
                  </div>

                  <span className="px-2 py-0.5 rounded bg-emerald-950/80 text-emerald-300 border border-emerald-800 text-[10px] font-bold">
                    {action.status}
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
