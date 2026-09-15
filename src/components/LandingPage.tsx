import React from 'react';
import { 
  ShieldCheck, 
  Cpu, 
  Terminal, 
  LineChart, 
  GitBranch, 
  Database, 
  ArrowRight, 
  Sparkles, 
  Layers, 
  BarChart3,
  Scale,
  RefreshCw
} from 'lucide-react';

interface LandingPageProps {
  onEnterApp: () => void;
  onOpenAuth: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({
  onEnterApp,
  onOpenAuth,
}) => {
  return (
    <div id="landing-page-container" className="min-h-[calc(100vh-5.25rem)] bg-[#090c13] nexus-grid-bg text-slate-100 flex flex-col justify-between">
      {/* Hero Technical Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 pb-16 w-full">
        {/* Sub-header badges */}
        <div className="flex flex-wrap items-center gap-2 mb-6">
          <span className="px-2.5 py-1 rounded bg-cyan-950/80 border border-cyan-700/60 text-cyan-300 font-mono text-xs font-semibold tracking-wider uppercase flex items-center">
            <Cpu className="w-3.5 h-3.5 mr-1.5" />
            THE PREDICTION NEXUS: FINAL PROJECT BIBLE
          </span>
          <span className="px-2.5 py-1 rounded bg-emerald-950/80 border border-emerald-700/60 text-emerald-300 font-mono text-xs font-semibold tracking-wider uppercase flex items-center">
            <ShieldCheck className="w-3.5 h-3.5 mr-1.5" />
            ZERO-FABRICATION DIRECTIVE
          </span>
          <span className="px-2.5 py-1 rounded bg-amber-950/80 border border-amber-700/60 text-amber-300 font-mono text-xs font-semibold tracking-wider uppercase">
            THE GETER PRINCIPLE
          </span>
        </div>

        {/* Title */}
        <div className="max-w-4xl mb-8">
          <h1 className="text-3xl sm:text-5xl font-display font-extrabold tracking-tight text-white uppercase leading-tight mb-4">
            Zero-Fabrication Sports Prediction & Algorithmic Betting Platform
          </h1>
          <p className="text-base sm:text-lg text-slate-300 leading-relaxed font-sans font-normal">
            Independent, isolated predictive engines (MLB, CFB, NFL) powered entirely by open-source data streams. 
            Bypassing the <span className="text-cyan-400 font-semibold font-mono">"Ego Engine"</span> of public betting lines to uncover root-level mathematical truth with continuous Brier Score and Expected Calibration Error (ECE) self-refactoring.
          </p>
        </div>

        {/* CTA Actions */}
        <div className="flex flex-wrap items-center gap-4 mb-14">
          <button
            id="enter-nexus-terminal-btn"
            onClick={onEnterApp}
            className="px-6 py-3.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold tracking-wider uppercase text-sm flex items-center space-x-2 transition-all shadow-lg shadow-cyan-500/20"
          >
            <span>LAUNCH NEXUS TERMINAL</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          <button
            id="auth-portal-btn"
            onClick={onOpenAuth}
            className="px-6 py-3.5 rounded-lg bg-[#141b2b] hover:bg-[#1a2338] border border-[#263552] text-slate-200 font-mono font-medium text-sm flex items-center space-x-2 transition-all"
          >
            <Terminal className="w-4 h-4 text-cyan-400" />
            <span>AUTHENTICATE OPERATOR</span>
          </button>
        </div>

        {/* The 5 Mandates of The Geter Principle */}
        <div className="mb-14">
          <div className="flex items-center space-x-3 mb-6">
            <div className="h-px bg-cyan-500/30 flex-1"></div>
            <span className="font-mono text-xs text-cyan-400 font-bold uppercase tracking-widest px-2">
              THE GETER PRINCIPLE: OPERATIONAL MANDATES
            </span>
            <div className="h-px bg-cyan-500/30 flex-1"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Mandate 1 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-3">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                1. Zero-Fabrication Directive
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The codebase is strictly forbidden from falsifying or simulating live data, scores, or telemetry. Every probability calculation is empirically bound to verified open-source statistics.
              </p>
            </div>

            {/* Mandate 2 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-3">
                <Scale className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                2. Deconstructing Consensus Bias
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The algorithmic models strip out public bandwagon betting volume and bookmaker vig, exposing true mathematical fair odds and expected value (EV) edges.
              </p>
            </div>

            {/* Mandate 3 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
                <LineChart className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                3. Dual Backtesting & Post-Mortem
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Pre-match forecasting is frozen and strictly decoupled from post-match evaluation. Automated hourly cron backtesting and on-demand backtests track Brier Scores and ECE.
              </p>
            </div>

            {/* Mandate 4 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-3">
                <GitBranch className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                4. Elastic Variable Discovery
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                The mathematical output dynamically flexes with data variable density. An automated pipeline autonomously identifies and tests new predictive variables without manual input.
              </p>
            </div>

            {/* Mandate 5 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-3">
                <RefreshCw className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                5. Self-Refactoring Code
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                A built-in redundancy check prevents compounding errors. If calibration error degrades, the engine is authorized to programmatically alter its own code parameters and weights.
              </p>
            </div>

            {/* Mandate 6 */}
            <div className="p-5 rounded-lg bg-[#101522] border border-[#1d273a] relative overflow-hidden">
              <div className="w-8 h-8 rounded bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h3 className="font-display font-bold text-sm text-white uppercase mb-2">
                6. AI Insights (Math Grounding)
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed font-sans">
                Google Gemini API translates complex odds variances, Brier distributions, and weather models into natural language. Strictly forbidden from hallucinating predictions.
              </p>
            </div>
          </div>
        </div>

        {/* Monorepo Architecture Blueprint */}
        <div className="p-6 rounded-lg bg-[#0d121c] border border-[#1f2a3f]">
          <div className="flex items-center justify-between mb-4">
            <span className="font-mono text-xs text-slate-400 uppercase tracking-wider">
              MONOREPO ARCHITECTURE BLUEPRINT (prediction-nexus)
            </span>
            <span className="font-mono text-[11px] text-cyan-400">
              SUPABASE + RENDER + VERCEL + ACTIONS
            </span>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 font-mono text-xs">
            <div className="p-3 bg-[#131926] rounded border border-[#222d42]">
              <div className="text-cyan-400 font-bold mb-1">backend/engines/</div>
              <div className="text-slate-400 text-[11px]">
                Isolated Python prediction engines (MLB, NFL, CFB) executing Brier Score & ECE calibration loops.
              </div>
            </div>
            <div className="p-3 bg-[#131926] rounded border border-[#222d42]">
              <div className="text-emerald-400 font-bold mb-1">frontend/</div>
              <div className="text-slate-400 text-[11px]">
                SportsCenter technical UI with sliders, visible optimal calibration markers, and live telemetry.
              </div>
            </div>
            <div className="p-3 bg-[#131926] rounded border border-[#222d42]">
              <div className="text-amber-400 font-bold mb-1">.github/workflows/</div>
              <div className="text-slate-400 text-[11px]">
                scrape.yml cron tasks executing hourly upcoming scrapes and 10-minute live event feeds.
              </div>
            </div>
            <div className="p-3 bg-[#131926] rounded border border-[#222d42]">
              <div className="text-purple-400 font-bold mb-1">supabase/schema.sql</div>
              <div className="text-slate-400 text-[11px]">
                Stateful weight tracking, prediction logs, empirical post-mortems, and RLS security policies.
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
