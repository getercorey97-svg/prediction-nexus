import React, { useState, useEffect } from 'react';
import { 
  Database, 
  GitBranch, 
  FileCode, 
  Copy, 
  Check, 
  ExternalLink, 
  Cpu, 
  Table, 
  Layers, 
  Folder, 
  FileText,
  Search,
  Code2
} from 'lucide-react';
import { SportType } from '../types';

export const MonorepoViewer: React.FC = () => {
  const [tab, setTab] = useState<'FILES' | 'MLB_DB' | 'NFL_META' | 'SUPABASE_SQL' | 'ACTIONS_YML'>('FILES');
  const [selectedSport, setSelectedSport] = useState<'MLB' | 'NFL' | 'CFB'>('MLB');
  const [fileList, setFileList] = useState<any[]>([]);
  const [selectedFile, setSelectedFile] = useState<string>('engine_f5_props.py');
  const [fileContent, setFileContent] = useState<string>('');
  const [fileGithubUrl, setFileGithubUrl] = useState<string>('');
  const [fileLoading, setFileLoading] = useState(false);

  // MLB DB State
  const [mlbDbData, setMlbDbData] = useState<{
    f5: any[];
    props: any[];
    modifiers: any[];
    forecasts: any[];
  } | null>(null);
  const [dbTableTab, setDbTableTab] = useState<'f5' | 'props' | 'modifiers' | 'forecasts'>('f5');

  // NFL Meta State
  const [nflMeta, setNflMeta] = useState<any>(null);

  // Copied indicator
  const [copied, setCopied] = useState<string | null>(null);

  const repos = [
    {
      sport: 'MLB',
      name: 'mlb-engine',
      url: 'https://github.com/getercorey97-svg/mlb-engine',
      desc: 'F5 forecasts, pitcher strikeouts, aerodynamics, biological modifiers',
    },
    {
      sport: 'NFL',
      name: 'nfl-sota-prediction-engine',
      url: 'https://github.com/getercorey97-svg/nfl-sota-prediction-engine',
      desc: 'Dixon-Coles bivariate Poisson, team DNA, adaptive learning rates',
    },
    {
      sport: 'CFB',
      name: 'College-football-pred',
      url: 'https://github.com/getercorey97-svg/College-football-pred',
      desc: 'Markov drive simulation, Skew-Normal QB yardage, roster intelligence',
    },
  ];

  // Fetch file list when sport changes
  useEffect(() => {
    fetch(`/api/engines/files?sport=${selectedSport}`)
      .then(res => res.json())
      .then(files => {
        setFileList(files);
        if (files.length > 0) {
          const defaultFile = selectedSport === 'MLB' 
            ? 'engine_f5_props.py' 
            : selectedSport === 'NFL' 
            ? 'brain.py' 
            : 'markets.py';
          const match = files.find((f: any) => f.filename === defaultFile) || files[0];
          loadFile(selectedSport, match.filename);
        }
      })
      .catch(console.error);
  }, [selectedSport]);

  const loadFile = (sport: string, filename: string) => {
    setSelectedFile(filename);
    setFileLoading(true);
    fetch(`/api/engines/file-content?sport=${sport}&filename=${filename}`)
      .then(res => res.json())
      .then(data => {
        setFileContent(data.content || '');
        setFileGithubUrl(data.githubUrl || '');
      })
      .catch(console.error)
      .finally(() => setFileLoading(false));
  };

  const loadMlbDb = () => {
    fetch('/api/engines/mlb-db')
      .then(res => res.json())
      .then(data => setMlbDbData(data))
      .catch(console.error);
  };

  const loadNflMeta = () => {
    fetch('/api/engines/nfl-meta')
      .then(res => res.json())
      .then(data => setNflMeta(data))
      .catch(console.error);
  };

  useEffect(() => {
    if (tab === 'MLB_DB' && !mlbDbData) loadMlbDb();
    if (tab === 'NFL_META' && !nflMeta) loadNflMeta();
  }, [tab]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopied(id);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div id="monorepo-viewer-container" className="space-y-6">
      {/* Monorepo Header & Official GitHub Links */}
      <div className="p-5 rounded-xl bg-[#0e1320] border border-cyan-500/40 shadow-lg">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-700">
                <GitBranch className="w-3 h-3 mr-1 text-cyan-400" />
                OFFICIAL MONOREPO // PREDICTION-NEXUS
              </span>
              <span className="text-xs font-mono text-slate-400">
                PYTHON FASTAPI + SUPABASE + VERCEL + ACTIONS
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-bold text-white uppercase tracking-wide">
              Isolated Prediction Engines & Schema Hub
            </h2>
            <p className="text-xs text-slate-300 font-sans mt-0.5">
              Direct access to live repositories, underlying SQLite databases, team DNA configurations, and automated cron pipelines.
            </p>
          </div>

          {/* GitHub Repos Badges */}
          <div className="flex flex-wrap items-center gap-2">
            {repos.map(r => (
              <a
                key={r.name}
                href={r.url}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-1.5 rounded-lg bg-[#141b2b] hover:bg-[#1a2338] border border-[#25334d] text-xs font-mono text-cyan-300 hover:text-white flex items-center space-x-1.5 transition-colors"
              >
                <span>{r.name}</span>
                <ExternalLink className="w-3 h-3 text-cyan-400" />
              </a>
            ))}
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 pt-3 border-t border-[#1a2438]">
          <button
            onClick={() => setTab('FILES')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              tab === 'FILES'
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Code2 className="w-3.5 h-3.5" />
            <span>Python Engines Explorer</span>
          </button>

          <button
            onClick={() => setTab('MLB_DB')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              tab === 'MLB_DB'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Database className="w-3.5 h-3.5" />
            <span>MLB SQLite Database Viewer</span>
          </button>

          <button
            onClick={() => setTab('NFL_META')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              tab === 'NFL_META'
                ? 'bg-blue-500/20 text-blue-300 border border-blue-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Cpu className="w-3.5 h-3.5" />
            <span>NFL Team DNA Metadata</span>
          </button>

          <button
            onClick={() => setTab('SUPABASE_SQL')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              tab === 'SUPABASE_SQL'
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5" />
            <span>Supabase PostgreSQL Schema</span>
          </button>

          <button
            onClick={() => setTab('ACTIONS_YML')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-mono transition-all flex items-center space-x-1.5 ${
              tab === 'ACTIONS_YML'
                ? 'bg-purple-500/20 text-purple-300 border border-purple-500/40'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>GitHub Actions scrape.yml</span>
          </button>
        </div>
      </div>

      {/* TAB 1: PYTHON ENGINES EXPLORER */}
      {tab === 'FILES' && (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* File Tree Sidebar */}
          <div className="lg:col-span-1 p-4 rounded-xl bg-[#0f1422] border border-[#1e273a] space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono text-slate-300 font-bold uppercase">Engine Select:</span>
              <div className="flex bg-[#141b2b] p-0.5 rounded border border-[#23314a]">
                {(['MLB', 'NFL', 'CFB'] as const).map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSport(s)}
                    className={`px-2 py-0.5 text-[11px] font-mono rounded ${
                      selectedSport === s ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="text-[10px] font-mono text-slate-500">
              Files in backend/engines/{selectedSport.toLowerCase()}/:
            </div>

            <div className="space-y-1 max-h-[500px] overflow-y-auto pr-1">
              {fileList.map((f) => (
                <button
                  key={f.filename}
                  onClick={() => loadFile(selectedSport, f.filename)}
                  className={`w-full text-left px-2.5 py-2 rounded-lg text-xs font-mono transition-colors flex items-center justify-between border ${
                    selectedFile === f.filename
                      ? 'bg-cyan-950/60 border-cyan-500 text-cyan-300 font-bold'
                      : 'border-transparent text-slate-400 hover:text-slate-200 hover:bg-[#151c2d]'
                  }`}
                >
                  <span className="truncate">{f.filename}</span>
                  <span className="text-[9px] text-slate-600 shrink-0 ml-1">
                    {(f.sizeBytes / 1024).toFixed(1)}k
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* File Content Viewer */}
          <div className="lg:col-span-3 p-4 rounded-xl bg-[#0b0e17] border border-[#1e273a] flex flex-col justify-between">
            <div className="flex items-center justify-between pb-3 mb-3 border-b border-[#1a2336]">
              <div className="flex items-center space-x-2">
                <FileCode className="w-4 h-4 text-cyan-400" />
                <span className="font-mono text-xs font-bold text-white">
                  backend/engines/{selectedSport.toLowerCase()}/{selectedFile}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                {fileGithubUrl && (
                  <a
                    href={fileGithubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 rounded bg-[#141c2c] hover:bg-[#1a2438] text-[11px] font-mono text-cyan-400 flex items-center space-x-1"
                  >
                    <span>View on GitHub</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                <button
                  onClick={() => handleCopy(fileContent, 'file-content')}
                  className="px-2.5 py-1 rounded bg-[#141c2c] hover:bg-cyan-500 hover:text-slate-950 text-[11px] font-mono text-slate-300 flex items-center space-x-1 transition-colors"
                >
                  {copied === 'file-content' ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                  <span>{copied === 'file-content' ? 'Copied' : 'Copy'}</span>
                </button>
              </div>
            </div>

            <pre className="p-3 bg-[#080b12] rounded-lg border border-[#151d2e] overflow-x-auto text-xs font-mono text-slate-200 max-h-[500px] leading-relaxed">
              {fileLoading ? 'Loading code...' : fileContent}
            </pre>
          </div>
        </div>
      )}

      {/* TAB 2: MLB SQLITE DB VIEWER */}
      {tab === 'MLB_DB' && (
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                AUTHENTIC MLB SQLITE DATABASE VIEWER (mlb_engine.db)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Live query directly from the user's authentic local SQLite store.
              </p>
            </div>

            <div className="flex bg-[#141b2b] p-1 rounded-lg border border-[#23314a]">
              {[
                { id: 'f5', label: 'F5 Forecasts' },
                { id: 'props', label: 'Pitcher Props' },
                { id: 'modifiers', label: 'Dynamic Modifiers' },
                { id: 'forecasts', label: 'Model Forecasts' },
              ].map(t => (
                <button
                  key={t.id}
                  onClick={() => setDbTableTab(t.id as any)}
                  className={`px-3 py-1 text-xs font-mono rounded transition-all ${
                    dbTableTab === t.id ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          {!mlbDbData ? (
            <div className="p-8 text-center font-mono text-xs text-slate-500">
              Querying mlb_engine.db...
            </div>
          ) : (
            <div className="overflow-x-auto">
              {dbTableTab === 'f5' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c2536] text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">Game PK</th>
                      <th className="pb-2">Matchup</th>
                      <th className="pb-2">Starters</th>
                      <th className="pb-2">F5 Home Prob</th>
                      <th className="pb-2">F5 Away Prob</th>
                      <th className="pb-2">Expected Runs (F5)</th>
                      <th className="pb-2">F5 Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#182030]">
                    {mlbDbData.f5.map((row, i) => (
                      <tr key={i} className="hover:bg-[#141b2b]">
                        <td className="py-2 text-slate-500">{row.pk}</td>
                        <td className="py-2 text-white font-semibold">{row.away} @ {row.home}</td>
                        <td className="py-2 text-slate-300">{row.away_sp} vs {row.home_sp}</td>
                        <td className="py-2 text-cyan-400 font-bold">{(row.home_prob * 100).toFixed(1)}%</td>
                        <td className="py-2 text-amber-400 font-bold">{(row.away_prob * 100).toFixed(1)}%</td>
                        <td className="py-2 text-slate-300">{row.exp_h?.toFixed(2)} - {row.exp_a?.toFixed(2)}</td>
                        <td className="py-2 text-emerald-400 font-bold">{row.total?.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbTableTab === 'props' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c2536] text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">Pitcher Name</th>
                      <th className="pb-2">Team</th>
                      <th className="pb-2">Projected Outs</th>
                      <th className="pb-2">Projected Strikeouts</th>
                      <th className="pb-2">Over 4.5 K Prob</th>
                      <th className="pb-2">Over 5.5 K Prob</th>
                      <th className="pb-2">Over 6.5 K Prob</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#182030]">
                    {mlbDbData.props.map((row, i) => (
                      <tr key={i} className="hover:bg-[#141b2b]">
                        <td className="py-2 text-white font-semibold">{row.pitcher}</td>
                        <td className="py-2 text-slate-400">{row.team}</td>
                        <td className="py-2 text-slate-300">{row.outs?.toFixed(1)}</td>
                        <td className="py-2 text-cyan-400 font-bold">{row.strikeouts?.toFixed(2)}</td>
                        <td className="py-2 text-emerald-400">{(row.over45 * 100).toFixed(1)}%</td>
                        <td className="py-2 text-amber-400">{(row.over55 * 100).toFixed(1)}%</td>
                        <td className="py-2 text-rose-400">{(row.over65 * 100).toFixed(1)}%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbTableTab === 'modifiers' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c2536] text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">Team Name</th>
                      <th className="pb-2">Offensive Modifier</th>
                      <th className="pb-2">Pitching Modifier</th>
                      <th className="pb-2">Last Updated</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#182030]">
                    {mlbDbData.modifiers.map((row, i) => (
                      <tr key={i} className="hover:bg-[#141b2b]">
                        <td className="py-2 text-white font-semibold">{row.team}</td>
                        <td className="py-2 text-emerald-400 font-bold">{row.off_mod?.toFixed(3)}x</td>
                        <td className="py-2 text-cyan-400 font-bold">{row.pitch_mod?.toFixed(3)}x</td>
                        <td className="py-2 text-slate-500">{row.updated}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}

              {dbTableTab === 'forecasts' && (
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-[#1c2536] text-[10px] text-slate-400 uppercase">
                      <th className="pb-2">Game PK</th>
                      <th className="pb-2">Matchup</th>
                      <th className="pb-2">Home Prob</th>
                      <th className="pb-2">Away Prob</th>
                      <th className="pb-2">Edge</th>
                      <th className="pb-2">Exp Runs</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#182030]">
                    {mlbDbData.forecasts.map((row, i) => (
                      <tr key={i} className="hover:bg-[#141b2b]">
                        <td className="py-2 text-slate-500">{row.pk}</td>
                        <td className="py-2 text-white font-semibold">{row.away} @ {row.home}</td>
                        <td className="py-2 text-cyan-400 font-bold">{(row.home_prob * 100).toFixed(1)}%</td>
                        <td className="py-2 text-slate-400">{(row.away_prob * 100).toFixed(1)}%</td>
                        <td className="py-2 text-emerald-400 font-bold">{(row.edge * 100).toFixed(2)}%</td>
                        <td className="py-2 text-slate-300">{row.exp_h} - {row.exp_a}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 3: NFL TEAM DNA METADATA */}
      {tab === 'NFL_META' && (
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                NFL META ENGINE STATE (engine_metadata.json)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                32 Team DNA parameter weights, adaptive learning rate, Dixon-Coles rho parameter, and fatigue decay.
              </p>
            </div>
            <button
              onClick={() => handleCopy(JSON.stringify(nflMeta, null, 2), 'nfl-meta')}
              className="px-3 py-1.5 rounded bg-[#141c2c] hover:bg-cyan-500 hover:text-slate-950 text-xs font-mono text-slate-300 flex items-center space-x-1"
            >
              {copied === 'nfl-meta' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'nfl-meta' ? 'Copied' : 'Copy JSON'}</span>
            </button>
          </div>

          {nflMeta && (
            <div className="space-y-4">
              <div className="p-3 bg-[#121824] rounded-lg border border-[#1e283b] grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
                <div>
                  <span className="text-slate-500">Learning Rate:</span>
                  <div className="text-white font-bold">{nflMeta.model_params?.learning_rate}</div>
                </div>
                <div>
                  <span className="text-slate-500">Dixon-Coles Rho:</span>
                  <div className="text-cyan-400 font-bold">{nflMeta.model_params?.dixon_coles_rho}</div>
                </div>
                <div>
                  <span className="text-slate-500">QB-WR Correlation:</span>
                  <div className="text-emerald-400 font-bold">{nflMeta.model_params?.qb_wr_correlation}</div>
                </div>
                <div>
                  <span className="text-slate-500">Fatigue Decay:</span>
                  <div className="text-purple-400 font-bold">{nflMeta.model_params?.fatigue_decay}</div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-2">
                {Object.entries(nflMeta.team_params || {}).map(([team, val]: any) => (
                  <div key={team} className="p-2.5 bg-[#0b0e17] rounded border border-[#1c2538] text-[11px] font-mono">
                    <div className="font-bold text-white mb-1">{team}</div>
                    <div className="text-slate-400 text-[10px]">wt: {val.weight?.toFixed(3)}</div>
                    <div className="text-cyan-400 text-[10px]">pass: {val.bias?.pass?.toFixed(2)}</div>
                    <div className="text-amber-400 text-[10px]">rush: {val.bias?.rush?.toFixed(2)}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SUPABASE SQL */}
      {tab === 'SUPABASE_SQL' && (
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                SUPABASE POSTGRESQL PRODUCTION DDL (schema.sql)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Contains users, games, predictions, weights, calibration_logs, and row-level security (RLS) policies.
              </p>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/export/schema');
                const sql = await res.text();
                handleCopy(sql, 'supabase-sql');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
            >
              {copied === 'supabase-sql' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'supabase-sql' ? 'SQL Copied!' : 'Copy SQL Schema'}</span>
            </button>
          </div>

          <div className="p-4 bg-[#090d16] rounded-lg border border-[#182030] text-xs font-mono text-slate-300 max-h-[500px] overflow-y-auto space-y-2">
            <p className="text-emerald-400 font-bold">-- =========================================================================</p>
            <p className="text-emerald-400 font-bold">-- THE PREDICTION NEXUS: PRODUCTION POSTGRESQL SCHEMA (SUPABASE)</p>
            <p className="text-emerald-400 font-bold">-- =========================================================================</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.users (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.games (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.predictions (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.calibration_logs (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.stateful_weights (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.factual_post_mortems (...);</p>
            <p className="text-slate-400">CREATE TABLE IF NOT EXISTS public.self_refactoring_audit (...);</p>
            <p className="text-slate-500">-- Row-Level Security Enabled on all tables</p>
          </div>
        </div>
      )}

      {/* TAB 5: GITHUB ACTIONS */}
      {tab === 'ACTIONS_YML' && (
        <div className="p-5 rounded-xl bg-[#0f1422] border border-[#1e273a] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display font-bold text-sm sm:text-base text-white uppercase tracking-wide">
                GITHUB ACTIONS AUTOMATION WORKFLOW (.github/workflows/scrape.yml)
              </h3>
              <p className="text-xs text-slate-400 font-sans mt-0.5">
                Hourly cron tasks for upcoming lines and 10-minute cron tasks for live telemetry feeds.
              </p>
            </div>
            <button
              onClick={async () => {
                const res = await fetch('/api/export/github-action');
                const yml = await res.text();
                handleCopy(yml, 'actions-yml');
              }}
              className="px-3.5 py-1.5 rounded-lg bg-purple-500 hover:bg-purple-400 text-slate-950 text-xs font-mono font-bold flex items-center space-x-1.5 transition-colors"
            >
              {copied === 'actions-yml' ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied === 'actions-yml' ? 'YAML Copied!' : 'Copy scrape.yml'}</span>
            </button>
          </div>

          <pre className="p-4 bg-[#090d16] rounded-lg border border-[#182030] text-xs font-mono text-slate-300 max-h-[500px] overflow-y-auto leading-relaxed">
{`name: The Prediction Nexus Data Scraping Pipeline

on:
  schedule:
    # Upcoming matches: Run hourly at minute 0
    - cron: '0 * * * *'
    # Live matches: Run every 10 minutes
    - cron: '*/10 * * * *'
  workflow_dispatch:

jobs:
  scrape-and-predict:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout Code
        uses: actions/checkout@v4

      - name: Set up Python 3.11
        uses: actions/setup-python@v5
        with:
          python-version: '3.11'
          cache: 'pip'

      - name: Install Dependencies
        run: |
          pip install -r backend/engines/mlb/requirements.txt
          pip install -r backend/engines/nfl/requirements.txt
          pip install -r backend/engines/cfb/requirements.txt

      - name: Execute MLB Pipeline & Factual Post-Mortem
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          python backend/engines/mlb/factual_post_mortem.py
          python backend/engines/mlb/engine_f5_props.py

      - name: Execute NFL & CFB SOTA Engines
        env:
          SUPABASE_URL: \${{ secrets.SUPABASE_URL }}
          SUPABASE_SERVICE_ROLE_KEY: \${{ secrets.SUPABASE_SERVICE_ROLE_KEY }}
        run: |
          python backend/engines/nfl/pipeline.py
          python backend/engines/cfb/engine_zero.py`}
          </pre>
        </div>
      )}
    </div>
  );
};
