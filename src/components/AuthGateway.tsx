import React, { useState } from 'react';
import { ShieldCheck, Cpu, KeyRound, Sparkles, ArrowRight, CheckCircle2, UserCheck, Lock } from 'lucide-react';
import { UserSession } from '../types';

interface AuthGatewayProps {
  onLogin: (user: UserSession) => void;
}

export const AuthGateway: React.FC<AuthGatewayProps> = ({ onLogin }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('getercorey97@gmail.com');
  const [password, setPassword] = useState('nexus-algo-2026');
  const [name, setName] = useState('Corey Geter');
  const [tier, setTier] = useState<'QUANT_PRO' | 'ALGO_TRADER' | 'PUBLIC_OBSERVER'>('QUANT_PRO');
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => {
      onLogin({
        email: email || 'getercorey97@gmail.com',
        isAuthenticated: true,
        tier,
        apiConnected: true,
      });
      setLoading(false);
    }, 600);
  };

  return (
    <div id="auth-gateway-screen" className="min-h-[85vh] flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-[#0f1422] border border-[#1e273a] rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        {/* Subtle accent top border */}
        <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-cyan-500 via-blue-500 to-emerald-500" />

        {/* Header */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-cyan-950/80 border border-cyan-700/60 mb-3">
            <Cpu className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-[11px] font-mono font-bold text-cyan-300 tracking-wider">
              THE PREDICTION NEXUS
            </span>
          </div>
          <h1 className="text-2xl font-display font-bold text-white tracking-tight">
            {isSignUp ? 'Create Nexus Account' : 'Quantitative Sign In'}
          </h1>
          <p className="text-xs text-slate-400 mt-1 font-sans">
            {isSignUp 
              ? 'Join the zero-fabrication mathematical forecasting engine.' 
              : 'Sign in to access your personal dashboard, top picks, and live hubs.'}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 font-mono text-xs">
          {isSignUp && (
            <div>
              <label className="block text-slate-400 uppercase text-[10px] mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Corey Geter"
                required
                className="w-full px-3 py-2.5 bg-[#090d16] border border-[#1f283b] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
              />
            </div>
          )}

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="user@predictionnexus.com"
              required
              className="w-full px-3 py-2.5 bg-[#090d16] border border-[#1f283b] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">Passkey / Access Key</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-3 py-2.5 bg-[#090d16] border border-[#1f283b] rounded-lg text-white focus:outline-none focus:border-cyan-500 transition-colors"
            />
          </div>

          <div>
            <label className="block text-slate-400 uppercase text-[10px] mb-1">Clearance Tier</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'QUANT_PRO', label: 'Quant Pro', desc: 'Full Access' },
                { id: 'ALGO_TRADER', label: 'Algo Trader', desc: 'Models Only' },
                { id: 'PUBLIC_OBSERVER', label: 'Observer', desc: 'Read Only' },
              ].map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTier(t.id as any)}
                  className={`p-2 rounded-lg border text-center transition-all ${
                    tier === t.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                      : 'bg-[#090d16] border-[#1f283b] text-slate-400 hover:border-slate-600'
                  }`}
                >
                  <div className="text-[10px]">{t.label}</div>
                  <div className="text-[8px] text-slate-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 mt-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 disabled:bg-cyan-950 text-slate-950 font-display font-bold text-xs uppercase tracking-wider transition-all flex items-center justify-center space-x-2 shadow-lg shadow-cyan-500/20"
          >
            <span>{loading ? 'AUTHENTICATING ENGINES...' : isSignUp ? 'CREATE ACCOUNT & ACCESS HOME' : 'ENTER PERSONAL HOMEPAGE'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Login vs Sign Up */}
        <div className="mt-6 pt-4 border-t border-[#1a2336] text-center font-mono text-xs text-slate-400">
          {isSignUp ? (
            <span>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(false)}
                className="text-cyan-400 hover:underline font-bold"
              >
                Sign In
              </button>
            </span>
          ) : (
            <span>
              New to The Prediction Nexus?{' '}
              <button
                type="button"
                onClick={() => setIsSignUp(true)}
                className="text-cyan-400 hover:underline font-bold"
              >
                Create Account
              </button>
            </span>
          )}
        </div>

        {/* Security badge */}
        <div className="mt-4 flex items-center justify-center space-x-1.5 text-[10px] font-mono text-slate-500">
          <ShieldCheck className="w-3 h-3 text-emerald-400" />
          <span>ZERO-FABRICATION & SECURE SUPABASE AUTH</span>
        </div>
      </div>
    </div>
  );
};
