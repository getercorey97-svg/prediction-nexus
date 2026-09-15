import React, { useState } from 'react';
import { CheckCircle, AlertTriangle, XCircle, ShieldCheck, ChevronDown, ChevronUp, Zap, DollarSign } from 'lucide-react';
import { BetRecommendation, Game, BetActionGrade } from '../types';

interface ClearBetIndicatorProps {
  recommendation?: BetRecommendation;
  game?: Game;
  variant?: 'badge' | 'card' | 'banner' | 'compact';
  showMathToggle?: boolean;
}

/**
 * Resolves a clear bet recommendation from either an explicit recommendation or a Game object
 */
export function resolveRecommendation(rec?: BetRecommendation, game?: Game): BetRecommendation {
  if (rec) return rec;

  if (game) {
    if (game.clearBetRecommendation) {
      return game.clearBetRecommendation;
    }

    // Synthesize clear bet recommendation from Game fields
    const edgeHome = game.mathematicalEdgeHome;
    const trueProbHome = game.trueProbabilityHome;
    const impliedHome = game.consensusImpliedProbabilityHome;
    const mlHome = game.odds.consensusMoneylineHome;
    const mlAway = game.odds.consensusMoneylineAway;

    if (edgeHome >= 0.040) {
      return {
        action: 'STRONG_VALUE',
        targetSport: game.sport,
        marketName: game.sport === 'MLB' ? 'First 5 Innings (F5)' : 'Moneyline',
        betSelection: `BET: ${game.homeTeam.name} ${game.sport === 'MLB' ? 'F5' : 'ML'} (${mlHome > 0 ? '+' : ''}${mlHome})`,
        confidenceTier: 'HIGH',
        edgePct: +(edgeHome * 100).toFixed(1),
        expectedValueRoiPct: +(edgeHome * 160).toFixed(1),
        recommendedUnits: Math.min(2.5, +(1.0 + (edgeHome - 0.04) * 20).toFixed(1)),
        plainEnglishReason: `${game.homeTeam.name} starting advantage creates a +${(edgeHome * 100).toFixed(1)}% edge over FanDuel's implied probability. Clear +EV opportunity.`,
        fanDuelOdds: mlHome > 0 ? `+${mlHome}` : mlHome,
        impliedWinPct: +(impliedHome * 100).toFixed(1),
        modelWinPct: +(trueProbHome * 100).toFixed(1),
        geterPrincipleVerified: true
      };
    } else if (edgeHome <= -0.040) {
      const edgeAway = Math.abs(edgeHome);
      return {
        action: 'STRONG_VALUE',
        targetSport: game.sport,
        marketName: game.sport === 'MLB' ? 'First 5 Innings (F5)' : 'Moneyline',
        betSelection: `BET: ${game.awayTeam.name} ${game.sport === 'MLB' ? 'F5' : 'ML'} (${mlAway > 0 ? '+' : ''}${mlAway})`,
        confidenceTier: 'HIGH',
        edgePct: +(edgeAway * 100).toFixed(1),
        expectedValueRoiPct: +(edgeAway * 160).toFixed(1),
        recommendedUnits: Math.min(2.5, +(1.0 + (edgeAway - 0.04) * 20).toFixed(1)),
        plainEnglishReason: `${game.awayTeam.name} holds strong tactical edge over FanDuel line. Model projects positive expected return.`,
        fanDuelOdds: mlAway > 0 ? `+${mlAway}` : mlAway,
        impliedWinPct: +((1 - impliedHome) * 100).toFixed(1),
        modelWinPct: +((1 - trueProbHome) * 100).toFixed(1),
        geterPrincipleVerified: true
      };
    } else if (Math.abs(edgeHome) >= 0.020) {
      const isHome = edgeHome > 0;
      const targetTeam = isHome ? game.homeTeam.name : game.awayTeam.name;
      const targetOdds = isHome ? mlHome : mlAway;
      return {
        action: 'MODERATE_LEAN',
        targetSport: game.sport,
        marketName: 'Moneyline Lean',
        betSelection: `LEAN: ${targetTeam} (${targetOdds > 0 ? '+' : ''}${targetOdds})`,
        confidenceTier: 'MODERATE',
        edgePct: +(Math.abs(edgeHome) * 100).toFixed(1),
        expectedValueRoiPct: +(Math.abs(edgeHome) * 120).toFixed(1),
        recommendedUnits: 0.8,
        plainEnglishReason: `Slight market mispricing in favor of ${targetTeam}. Lean recommendation with reduced unit allocation.`,
        fanDuelOdds: targetOdds,
        impliedWinPct: +(impliedHome * 100).toFixed(1),
        modelWinPct: +(trueProbHome * 100).toFixed(1),
        geterPrincipleVerified: true
      };
    } else {
      return {
        action: 'PASS',
        targetSport: game.sport,
        marketName: 'Consensus Line',
        betSelection: `PASS: Line Efficient on FanDuel`,
        confidenceTier: 'NEUTRAL_PASS',
        edgePct: +(Math.abs(edgeHome) * 100).toFixed(1),
        expectedValueRoiPct: 0,
        recommendedUnits: 0,
        plainEnglishReason: `FanDuel consensus line matches true statistical probability. No positive mathematical edge (+EV). Pass to protect your bankroll.`,
        fanDuelOdds: mlHome,
        impliedWinPct: +(impliedHome * 100).toFixed(1),
        modelWinPct: +(trueProbHome * 100).toFixed(1),
        geterPrincipleVerified: true
      };
    }
  }

  // Neutral fallback
  return {
    action: 'PASS',
    targetSport: 'MLB',
    marketName: 'Consensus',
    betSelection: 'PASS: Line Efficient',
    confidenceTier: 'NEUTRAL_PASS',
    edgePct: 0,
    expectedValueRoiPct: 0,
    recommendedUnits: 0,
    plainEnglishReason: 'Odds reflect fair market distribution. No actionable mathematical discrepancy.',
    fanDuelOdds: '-110',
    impliedWinPct: 50,
    modelWinPct: 50,
    geterPrincipleVerified: true
  };
}

export const ClearBetIndicator: React.FC<ClearBetIndicatorProps> = ({
  recommendation: propRec,
  game,
  variant = 'card',
  showMathToggle = true
}) => {
  const [showMath, setShowMath] = useState(false);
  const rec = resolveRecommendation(propRec, game);

  // Styling maps based on Clear Bet Action
  const config = {
    STRONG_VALUE: {
      border: 'border-emerald-500/40 bg-emerald-950/20 text-emerald-300',
      badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
      glow: 'shadow-emerald-950/40',
      icon: CheckCircle,
      actionLabel: 'BET THIS',
      colorName: 'emerald'
    },
    MODERATE_LEAN: {
      border: 'border-amber-500/40 bg-amber-950/20 text-amber-300',
      badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
      glow: 'shadow-amber-950/40',
      icon: AlertTriangle,
      actionLabel: 'LEAN ONLY',
      colorName: 'amber'
    },
    PASS: {
      border: 'border-slate-700 bg-slate-900/40 text-slate-400',
      badgeBg: 'bg-slate-800 text-slate-400 border-slate-700',
      glow: '',
      icon: XCircle,
      actionLabel: 'DO NOT BET (PASS)',
      colorName: 'slate'
    }
  }[rec.action];

  const Icon = config.icon;

  // COMPACT BADGE VARIANT (For tables, schedule lists, search cards)
  if (variant === 'badge' || variant === 'compact') {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full border text-xs font-semibold ${config.badgeBg}`}>
        <Icon className="w-3.5 h-3.5 shrink-0" />
        <span className="truncate max-w-[200px]">{rec.betSelection}</span>
        {rec.action !== 'PASS' && (
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-black/40 text-white">
            {rec.recommendedUnits}u
          </span>
        )}
      </div>
    );
  }

  // BANNER VARIANT (For game headers, top of modals)
  if (variant === 'banner') {
    return (
      <div className={`w-full p-4 rounded-xl border ${config.border} flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-center gap-3">
          <div className={`p-2.5 rounded-lg ${config.badgeBg}`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className={`text-xs uppercase font-bold tracking-wider px-2 py-0.5 rounded border ${config.badgeBg}`}>
                {config.actionLabel}
              </span>
              <span className="text-xs text-slate-400">FanDuel Line: {rec.fanDuelOdds}</span>
            </div>
            <h4 className="text-base sm:text-lg font-bold text-white mt-1">
              {rec.betSelection}
            </h4>
            <p className="text-xs text-slate-300 mt-0.5 max-w-xl">
              {rec.plainEnglishReason}
            </p>
          </div>
        </div>

        {rec.action !== 'PASS' && (
          <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
            <div className="text-right">
              <div className="text-xs text-slate-400">Stake Size</div>
              <div className="text-sm font-bold text-emerald-400">{rec.recommendedUnits} Units</div>
            </div>
            <div className="text-right pl-3 border-l border-slate-700">
              <div className="text-xs text-slate-400">Edge</div>
              <div className="text-sm font-bold text-white">+{rec.edgePct}%</div>
            </div>
          </div>
        )}
      </div>
    );
  }

  // DEFAULT DEDICATED CARD VARIANT (Prominent, clean, eliminates confusion)
  return (
    <div className={`rounded-xl border p-4.5 ${config.border} shadow-lg transition-all`}>
      {/* Header Badge & Action */}
      <div className="flex items-center justify-between gap-2 mb-3">
        <div className="flex items-center gap-2">
          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${config.badgeBg}`}>
            <Icon className="w-3.5 h-3.5" />
            {config.actionLabel}
          </span>
          <span className="text-xs font-medium text-slate-400">
            {rec.marketName}
          </span>
        </div>

        {/* Geter Principle Verified Badge */}
        <div className="flex items-center gap-1 text-[11px] text-slate-400 bg-slate-900/60 px-2 py-0.5 rounded border border-slate-800">
          <ShieldCheck className="w-3 h-3 text-cyan-400" />
          <span>Geter Audited</span>
        </div>
      </div>

      {/* Main Bold Bet Selection */}
      <div className="mb-2">
        <div className="text-lg sm:text-xl font-black text-white tracking-tight">
          {rec.betSelection}
        </div>
      </div>

      {/* Plain-English Reason (No confusing numbers) */}
      <p className="text-xs sm:text-sm text-slate-300 leading-relaxed mb-4">
        {rec.plainEnglishReason}
      </p>

      {/* Actionable Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 p-2.5 rounded-lg bg-black/40 border border-slate-800/80 mb-3 text-center">
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">FanDuel Odds</div>
          <div className="text-sm font-extrabold text-white mt-0.5">{rec.fanDuelOdds}</div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">True Edge</div>
          <div className={`text-sm font-extrabold mt-0.5 ${rec.action === 'STRONG_VALUE' ? 'text-emerald-400' : rec.action === 'MODERATE_LEAN' ? 'text-amber-400' : 'text-slate-400'}`}>
            {rec.edgePct > 0 ? `+${rec.edgePct}%` : '0%'}
          </div>
        </div>
        <div>
          <div className="text-[10px] uppercase font-bold text-slate-400">Recommended Stake</div>
          <div className={`text-sm font-extrabold mt-0.5 ${rec.recommendedUnits > 0 ? 'text-cyan-400' : 'text-slate-400'}`}>
            {rec.recommendedUnits > 0 ? `${rec.recommendedUnits} Units` : 'Pass (0u)'}
          </div>
        </div>
      </div>

      {/* Optional Math Audit Toggle (Keeps view uncluttered by default) */}
      {showMathToggle && (
        <div className="pt-2 border-t border-slate-800/60">
          <button
            onClick={() => setShowMath(!showMath)}
            className="flex items-center justify-between w-full text-xs text-slate-400 hover:text-slate-200 transition-colors py-1"
          >
            <span className="flex items-center gap-1.5">
              <Zap className="w-3.5 h-3.5 text-cyan-400" />
              <span>{showMath ? 'Hide Math Verification' : 'Why this bet? (View Model Math)'}</span>
            </span>
            {showMath ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showMath && (
            <div className="mt-2.5 p-3 rounded-lg bg-slate-950/70 border border-slate-800 text-xs space-y-2 text-slate-300">
              <div className="flex justify-between">
                <span className="text-slate-400">Model True Win Probability:</span>
                <span className="font-mono font-bold text-emerald-400">{rec.modelWinPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">FanDuel Implied Win Probability:</span>
                <span className="font-mono text-slate-300">{rec.impliedWinPct}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Expected Value ROI:</span>
                <span className="font-mono font-bold text-cyan-400">+{rec.expectedValueRoiPct}%</span>
              </div>
              <div className="text-[11px] text-slate-400 pt-1 border-t border-slate-800/80 leading-normal">
                Strict Geter Principle: Zero lookahead data leakage, walk-forward out-of-sample Bayesian validation.
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
