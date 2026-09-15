import React, { useState, useEffect } from 'react';
import { 
  Workflow, 
  ShieldCheck, 
  Radio, 
  Activity, 
  RefreshCw, 
  Wind, 
  TrendingUp, 
  TrendingDown, 
  Clock, 
  CheckCircle2 
} from 'lucide-react';
import { StructuredGameEvent, SportType } from '../types';

interface LiveStreamViewerProps {
  activeSport: SportType | 'ALL';
  onSelectSport: (sport: SportType | 'ALL') => void;
}

export const LiveStreamViewer: React.FC<LiveStreamViewerProps> = ({
  activeSport,
  onSelectSport,
}) => {
  const [events, setEvents] = useState<StructuredGameEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [autoRefresh, setAutoRefresh] = useState(true);

  const fetchEvents = async () => {
    try {
      const res = await fetch(`/api/live-stream?sport=${activeSport}`);
      const data = await res.json();
      setEvents(data);
    } catch (err) {
      console.error('Error fetching stream:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
    if (!autoRefresh) return;
    const interval = setInterval(fetchEvents, 8000);
    return () => clearInterval(interval);
  }, [activeSport, autoRefresh]);

  return (
    <div id="live-stream-viewer" className="space-y-6">
      {/* Stream Header */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-cyan-500/40 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
              <Radio className="w-3 h-3 mr-1 animate-pulse text-cyan-400" />
              STRUCTURED TELEMETRY FEED
            </span>
            <span className="text-xs font-mono text-emerald-400 flex items-center">
              <ShieldCheck className="w-3.5 h-3.5 mr-1" />
              ZERO-FABRICATION PROTOCOL ENFORCED
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
            Real-Time Game Event Stream
          </h2>
          <p className="text-xs text-slate-300 font-sans mt-0.5">
            Streaming exit velocity, pitch counts, launch angles, pass rush speed, EPA differentials, and win probability delta.
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-3">
          {/* Sport Filter */}
          <div className="flex bg-[#141b2b] p-1 rounded-lg border border-[#23314a]">
            {(['ALL', 'MLB', 'NFL', 'CFB'] as const).map((s) => (
              <button
                key={s}
                onClick={() => onSelectSport(s)}
                className={`px-3 py-1 text-xs font-mono font-medium rounded transition-all ${
                  activeSport === s
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                {s}
              </button>
            ))}
          </div>

          <button
            onClick={() => setAutoRefresh(!autoRefresh)}
            className={`px-3 py-1.5 rounded-lg border text-xs font-mono transition-colors flex items-center space-x-1.5 ${
              autoRefresh 
                ? 'bg-cyan-950/60 border-cyan-700 text-cyan-300' 
                : 'bg-[#151c2d] border-[#25334d] text-slate-400'
            }`}
          >
            <RefreshCw className={`w-3 h-3 ${autoRefresh ? 'animate-spin' : ''}`} />
            <span>{autoRefresh ? 'AUTO (8s)' : 'PAUSED'}</span>
          </button>
        </div>
      </div>

      {/* Events List */}
      <div className="space-y-3">
        {loading ? (
          <div className="p-8 text-center font-mono text-xs text-slate-500">
            Connecting to Zero-Fabrication Telemetry Feed...
          </div>
        ) : events.length === 0 ? (
          <div className="p-8 text-center font-mono text-xs text-slate-500">
            No live events recorded in active stream.
          </div>
        ) : (
          events.map((event) => {
            const isPositive = event.deltaWinProbability >= 0;
            const sportBadge = event.sport === 'MLB'
              ? 'bg-amber-950 text-amber-300 border-amber-800'
              : event.sport === 'NFL'
              ? 'bg-blue-950 text-blue-300 border-blue-800'
              : 'bg-emerald-950 text-emerald-300 border-emerald-800';

            return (
              <div 
                key={event.eventId}
                className="p-4 rounded-xl bg-[#0f1422] border border-[#1e273a] hover:border-cyan-800/60 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
              >
                {/* Event Core Info */}
                <div className="flex items-start space-x-3">
                  <div className="w-10 h-10 rounded-lg bg-[#141b2c] border border-[#222f47] flex items-center justify-center text-cyan-400 shrink-0 mt-0.5">
                    <Activity className="w-5 h-5" />
                  </div>

                  <div>
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className={`px-1.5 py-0.2 rounded text-[10px] font-mono font-bold border ${sportBadge}`}>
                        {event.sport}
                      </span>
                      <span className="text-xs font-mono font-semibold text-slate-200">
                        {event.gameId}
                      </span>
                      <span className="text-[10px] font-mono text-slate-500">
                        {event.periodOrInning} · {event.timeRemainingOrOuts}
                      </span>
                    </div>

                    <p className="text-xs text-slate-200 font-sans font-medium">
                      {event.eventDescription}
                    </p>

                    {/* Telemetry metrics row */}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2 text-[10px] font-mono text-slate-400">
                      {Object.entries(event.telemetryMetrics).map(([k, v]) => (
                        <div key={k} className="flex items-center space-x-1">
                          <span className="text-slate-500">{k}:</span>
                          <span className="text-slate-200 font-bold">{v}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Mathematical Probability Delta */}
                <div className="flex items-center space-x-4 self-end md:self-center shrink-0 border-t md:border-t-0 border-[#192233] pt-2 md:pt-0 w-full md:w-auto justify-between md:justify-end">
                  <div className="text-right">
                    <div className="text-[10px] font-mono text-slate-500">Post-Play Prob</div>
                    <div className="text-sm font-mono font-bold text-white">
                      {(event.newTrueProbability * 100).toFixed(1)}%
                    </div>
                  </div>

                  <div className={`px-3 py-1.5 rounded-lg border font-mono text-xs font-bold flex items-center space-x-1 ${
                    isPositive 
                      ? 'bg-emerald-950/60 border-emerald-800 text-emerald-400' 
                      : 'bg-rose-950/60 border-rose-800 text-rose-400'
                  }`}>
                    {isPositive ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                    <span>{isPositive ? `+${(event.deltaWinProbability * 100).toFixed(1)}%` : `${(event.deltaWinProbability * 100).toFixed(1)}%`}</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
