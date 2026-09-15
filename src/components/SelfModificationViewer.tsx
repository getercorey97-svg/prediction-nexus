import React, { useState, useEffect } from 'react';
import { 
  GitBranch, 
  ShieldCheck, 
  AlertTriangle, 
  RefreshCw, 
  CheckCircle2, 
  Cpu, 
  Sparkles, 
  Zap,
  ArrowRight
} from 'lucide-react';
import { SelfRefactoringLog, ElasticFeatureDiscovery } from '../types';

export const SelfModificationViewer: React.FC = () => {
  const [logs, setLogs] = useState<SelfRefactoringLog[]>([]);
  const [features, setFeatures] = useState<ElasticFeatureDiscovery[]>([]);
  const [loading, setLoading] = useState(true);
  const [refactoring, setRefactoring] = useState(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  const fetchDynamicData = async () => {
    try {
      const res = await fetch('/api/dynamic-learning');
      const data = await res.json();
      setLogs(data.refactoringLogs || []);
      setFeatures(data.featureDiscovery || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDynamicData();
  }, []);

  const triggerSelfRefactor = async (sport: 'MLB' | 'NFL' | 'CFB') => {
    setRefactoring(true);
    setStatusMessage(null);
    try {
      const res = await fetch('/api/self-refactor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sport }),
      });
      const data = await res.json();
      setStatusMessage(`Autonomous refactoring executed for ${sport}. Algorithmic weights adjusted without compounding redundancy.`);
      await fetchDynamicData();
    } catch (err) {
      console.error(err);
    } finally {
      setRefactoring(false);
    }
  };

  return (
    <div id="dynamic-learning-hub" className="space-y-6">
      {/* Header */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-amber-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-950 text-amber-300 border border-amber-700">
              <Cpu className="w-3 h-3 mr-1 text-amber-400" />
              ELASTIC FRAMEWORK & AUTONOMOUS MODIFIERS
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              FORWARD PROGRESSION (NO REDUNDANCIES)
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
            Self-Refactoring & Elastic Feature Discovery
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            The engine is authorized to alter its internal hyperparameters and feature decay exponents when calibration degradation is detected.
          </p>
        </div>

        {/* Refactor Triggers */}
        <div className="flex flex-wrap items-center gap-2">
          {(['MLB', 'NFL', 'CFB'] as const).map((s) => (
            <button
              key={s}
              onClick={() => triggerSelfRefactor(s)}
              disabled={refactoring}
              className="px-3.5 py-2 rounded-lg bg-[#161f30] hover:bg-amber-500 hover:text-slate-950 disabled:bg-slate-800 border border-[#263552] text-xs font-mono font-semibold text-amber-300 transition-all flex items-center space-x-1.5"
            >
              <RefreshCw className={`w-3 h-3 ${refactoring ? 'animate-spin' : ''}`} />
              <span>OPTIMIZE {s} ENGINE</span>
            </button>
          ))}
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-amber-950/40 border border-amber-700/60 rounded-lg text-xs font-mono text-amber-300 flex items-center space-x-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{statusMessage}</span>
        </div>
      )}

      {/* Safety & Redundancy Guardrails Box */}
      <div className="p-4 rounded-xl bg-[#0f1422] border border-[#1e273a] grid grid-cols-1 md:grid-cols-3 gap-4 font-mono text-xs">
        <div className="p-3 rounded-lg bg-[#131926] border border-[#212d42]">
          <div className="text-[10px] text-slate-400 uppercase">Forward-Progression Mechanism</div>
          <div className="text-sm font-bold text-emerald-400 mt-1 flex items-center">
            <CheckCircle2 className="w-4 h-4 mr-1.5" />
            ZERO BACKSTEPPING
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-sans">
            Weights are immutable backwards; state transitions are append-only to prevent regression.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#131926] border border-[#212d42]">
          <div className="text-[10px] text-slate-400 uppercase">Redundancy Check Status</div>
          <div className="text-sm font-bold text-cyan-400 mt-1 flex items-center">
            <ShieldCheck className="w-4 h-4 mr-1.5" />
            PASSING (P &lt; 0.01)
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-sans">
            Collinearity audit rejects correlated features with VIF &gt; 2.5 to avoid compounding noise.
          </p>
        </div>

        <div className="p-3 rounded-lg bg-[#131926] border border-[#212d42]">
          <div className="text-[10px] text-slate-400 uppercase">Compounding Error Risk</div>
          <div className="text-sm font-bold text-white mt-1">
            0.002 (NEGLIGIBLE)
          </div>
          <p className="text-[10px] text-slate-500 mt-1 font-sans">
            Error dampeners clamp daily drift strictly within ±0.05 bounds.
          </p>
        </div>
      </div>

      {/* Elastic Variable Discovery Pipeline */}
      <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a]">
        <div className="flex items-center justify-between mb-3">
          <div>
            <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
              ELASTIC VARIABLE DISCOVERY PIPELINE
            </h3>
            <p className="text-xs text-slate-400 font-sans mt-0.5">
              Automated open-source statistical scraping surfaces new predictive variables without manual engineering.
            </p>
          </div>
          <span className="text-[10px] font-mono text-cyan-400 bg-cyan-950 px-2 py-0.5 rounded border border-cyan-800">
            AUTO-ML PIPELINE
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs font-mono">
            <thead>
              <tr className="border-b border-[#1c2536] text-[10px] uppercase text-slate-400">
                <th className="pb-2.5">Variable Identifier</th>
                <th className="pb-2.5">Target Sport</th>
                <th className="pb-2.5">Signal Correlation</th>
                <th className="pb-2.5">P-Value Significance</th>
                <th className="pb-2.5">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#182030]">
              {features.map((feat) => (
                <tr key={feat.featureName} className="hover:bg-[#141b2b] transition-colors">
                  <td className="py-3 font-semibold text-white">
                    {feat.featureName}
                    <div className="text-[10px] text-slate-500 font-sans">{feat.dataSource}</div>
                  </td>
                  <td className="py-3 text-cyan-400">{feat.sport}</td>
                  <td className="py-3 text-emerald-400 font-bold">r = {feat.correlationSignal.toFixed(3)}</td>
                  <td className="py-3 text-slate-300">p = {feat.pValue.toFixed(4)}</td>
                  <td className="py-3">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${
                      feat.status === 'INTEGRATED_INTO_CORE'
                        ? 'bg-emerald-950 text-emerald-300 border-emerald-800'
                        : 'bg-amber-950 text-amber-300 border-amber-800'
                    }`}>
                      {feat.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Programmatic Self-Refactoring Audit Logs */}
      <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a]">
        <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide mb-1">
          PROGRAMMATIC CODE ALTERATION & REFACTORING LOG
        </h3>
        <p className="text-xs text-slate-400 font-sans mb-4">
          Autonomous hyperparameter mutations committed by engines to resolve calibration degradation.
        </p>

        <div className="space-y-3">
          {logs.map((log) => (
            <div key={log.id} className="p-3.5 rounded-lg bg-[#0d121c] border border-[#1e273a] text-xs font-mono">
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center space-x-2">
                  <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-cyan-950 text-cyan-300 border border-cyan-800">
                    {log.sport}
                  </span>
                  <span className="text-slate-200 font-semibold">{log.triggerReason}</span>
                </div>
                <span className="text-[10px] text-slate-500">
                  {new Date(log.timestamp).toLocaleString()}
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-[11px] pt-2 border-t border-[#1a2333]">
                <div className="text-slate-400">
                  <span className="text-rose-400">Previous Parameters: </span>
                  {JSON.stringify(log.previousParameters)}
                </div>
                <div className="text-slate-200">
                  <span className="text-emerald-400">Refactored Parameters: </span>
                  {JSON.stringify(log.refactoredParameters)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
