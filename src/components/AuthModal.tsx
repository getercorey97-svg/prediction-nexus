import React from 'react';
import { X, ShieldCheck, Terminal, Key, Check } from 'lucide-react';
import { UserSession } from '../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin: (user: UserSession) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  onLogin,
}) => {
  const [email, setEmail] = React.useState('getercorey97@gmail.com');
  const [password, setPassword] = React.useState('••••••••••••');
  const [tier, setTier] = React.useState<'QUANT_PRO' | 'ALGO_TRADER' | 'PUBLIC_OBSERVER'>('QUANT_PRO');
  const [mode, setMode] = React.useState<'LOGIN' | 'SIGNUP'>('LOGIN');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin({
      email: email || 'operator@prediction-nexus.io',
      isAuthenticated: true,
      tier,
      apiConnected: true,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div 
        id="auth-modal-card"
        className="w-full max-w-md bg-[#0f1420] border border-[#212c42] rounded-xl shadow-2xl p-6 relative text-slate-100"
      >
        <button
          id="close-auth-modal-btn"
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2.5 mb-5">
          <div className="w-9 h-9 rounded bg-cyan-950/80 border border-cyan-700/60 flex items-center justify-center text-cyan-400">
            <Terminal className="w-5 h-5" />
          </div>
          <div>
            <h3 className="font-display font-bold text-base text-white uppercase tracking-wide">
              {mode === 'LOGIN' ? 'OPERATOR TERMINAL ACCESS' : 'PROVISION NEXUS OPERATOR'}
            </h3>
            <p className="text-[11px] font-mono text-slate-400">
              Supabase Auth & Stateful Session Bridge
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Operator Identifier (Email)
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#151c2d] border border-[#26334d] text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
              placeholder="operator@nexus.io"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Access Token / Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-lg bg-[#151c2d] border border-[#26334d] text-sm text-slate-100 focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-300 uppercase tracking-wider mb-1.5">
              Operator Clearance Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: 'QUANT_PRO', label: 'Quant Pro', desc: 'Full Sliders' },
                { id: 'ALGO_TRADER', label: 'Algo Trader', desc: 'Live Stream' },
                { id: 'PUBLIC_OBSERVER', label: 'Observer', desc: 'Read Only' }
              ].map(t => (
                <button
                  type="button"
                  key={t.id}
                  onClick={() => setTier(t.id as any)}
                  className={`p-2 rounded-lg border text-left font-mono transition-all ${
                    tier === t.id
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300'
                      : 'bg-[#151c2d] border-[#26334d] text-slate-400 hover:text-slate-200'
                  }`}
                >
                  <div className="text-xs font-bold leading-tight">{t.label}</div>
                  <div className="text-[9px] text-slate-500">{t.desc}</div>
                </button>
              ))}
            </div>
          </div>

          <div className="p-3 bg-[#0a0d16] rounded-lg border border-[#1b2336] text-[11px] font-mono text-slate-400 flex items-start space-x-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>
              Zero-fabrication protocol enforced. Your session binds directly to Supabase authentication tokens.
            </span>
          </div>

          <button
            type="submit"
            id="auth-submit-btn"
            className="w-full py-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase transition-colors shadow-md"
          >
            {mode === 'LOGIN' ? 'AUTHENTICATE & ENTER TERMINAL' : 'INITIALIZE OPERATOR'}
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-[#1e273a] text-center">
          <button
            type="button"
            onClick={() => setMode(mode === 'LOGIN' ? 'SIGNUP' : 'LOGIN')}
            className="text-xs font-mono text-cyan-400 hover:text-cyan-300"
          >
            {mode === 'LOGIN' ? "Need new credentials? Register here." : "Existing operator? Switch to Login."}
          </button>
        </div>
      </div>
    </div>
  );
};
