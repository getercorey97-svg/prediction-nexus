import fs from 'fs';
import path from 'path';
import { exec } from 'child_process';
import util from 'util';

const execPromise = util.promisify(exec);

export interface RepoEngineMeta {
  repoName: string;
  sport: 'MLB' | 'NFL' | 'CFB' | 'TABLE_TENNIS';
  githubUrl: string;
  localPath: string;
}

export const REPO_CONFIGS: Record<string, RepoEngineMeta> = {
  MLB: {
    repoName: 'mlb-engine',
    sport: 'MLB',
    githubUrl: 'https://github.com/getercorey97-svg/mlb-engine',
    localPath: path.join(process.cwd(), 'backend/engines/mlb'),
  },
  NFL: {
    repoName: 'nfl-sota-prediction-engine',
    sport: 'NFL',
    githubUrl: 'https://github.com/getercorey97-svg/nfl-sota-prediction-engine',
    localPath: path.join(process.cwd(), 'backend/engines/nfl'),
  },
  CFB: {
    repoName: 'College-football-pred',
    sport: 'CFB',
    githubUrl: 'https://github.com/getercorey97-svg/College-football-pred',
    localPath: path.join(process.cwd(), 'backend/engines/cfb'),
  },
  TABLE_TENNIS: {
    repoName: 'tt-oracle',
    sport: 'TABLE_TENNIS',
    githubUrl: 'https://github.com/getercorey97-svg/tt-oracle',
    localPath: path.join(process.cwd(), 'backend/engines/tt'),
  },
};

export function listEngineFiles(sport?: string) {
  const results: Array<{
    sport: string;
    repoName: string;
    githubUrl: string;
    filename: string;
    relativePath: string;
    sizeBytes: number;
    lastModified: string;
  }> = [];

  const targets = sport && REPO_CONFIGS[sport] ? [REPO_CONFIGS[sport]] : Object.values(REPO_CONFIGS);

  for (const config of targets) {
    if (!fs.existsSync(config.localPath)) continue;
    const files = fs.readdirSync(config.localPath);
    for (const file of files) {
      const fullPath = path.join(config.localPath, file);
      try {
        const stats = fs.statSync(fullPath);
        if (stats.isFile()) {
          results.push({
            sport: config.sport,
            repoName: config.repoName,
            githubUrl: `${config.githubUrl}/blob/main/${file}`,
            filename: file,
            relativePath: `backend/engines/${config.sport.toLowerCase()}/${file}`,
            sizeBytes: stats.size,
            lastModified: stats.mtime.toISOString(),
          });
        }
      } catch (e) {
        // ignore unreadable
      }
    }
  }

  return results.sort((a, b) => a.sport.localeCompare(b.sport) || a.filename.localeCompare(b.filename));
}

export function getEngineFileContent(sport: string, filename: string): {
  content: string;
  githubUrl: string;
  sport: string;
  repoName: string;
} | null {
  const config = REPO_CONFIGS[sport.toUpperCase()];
  if (!config) return null;

  // sanitize filename to avoid traversal
  const safeName = path.basename(filename);
  const fullPath = path.join(config.localPath, safeName);

  if (!fs.existsSync(fullPath)) return null;

  try {
    const content = fs.readFileSync(fullPath, 'utf-8');
    return {
      content,
      githubUrl: `${config.githubUrl}/blob/main/${safeName}`,
      sport: config.sport,
      repoName: config.repoName,
    };
  } catch (error) {
    return null;
  }
}

export async function queryMlbSqliteData(): Promise<{
  f5Forecasts: any[];
  pitcherProps: any[];
  dynamicModifiers: any[];
  modelForecasts: any[];
}> {
  const dbPath = path.join(process.cwd(), 'backend/engines/mlb/mlb_engine.db');
  if (!fs.existsSync(dbPath)) {
    return { f5Forecasts: [], pitcherProps: [], dynamicModifiers: [], modelForecasts: [] };
  }

  const script = `
import sqlite3, json
conn = sqlite3.connect('${dbPath}')
c = conn.cursor()

def fetch(q):
    try:
        c.execute(q)
        return c.fetchall()
    except Exception as e:
        return []

f5 = fetch("SELECT game_pk, home_team, away_team, home_starter, away_starter, f5_home_prob, f5_away_prob, f5_tie_prob, f5_exp_home_runs, f5_exp_away_runs, f5_total_runs FROM F5_Forecasts LIMIT 8")
props = fetch("SELECT game_pk, pitcher_name, team_name, projected_outs, projected_strikeouts, over_4_5_k_prob, over_5_5_k_prob, over_6_5_k_prob FROM Pitcher_Props LIMIT 8")
mods = fetch("SELECT team_name, offensive_modifier, pitching_modifier, last_updated FROM Dynamic_Modifiers LIMIT 10")
forecasts = fetch("SELECT game_pk, home_team, away_team, home_prob, away_prob, edge, exp_home_runs, exp_away_runs, generated_at FROM Model_Forecasts LIMIT 8")

print(json.dumps({
    "f5": [{"pk": r[0], "home": r[1], "away": r[2], "home_sp": r[3], "away_sp": r[4], "home_prob": r[5], "away_prob": r[6], "tie_prob": r[7], "exp_h": r[8], "exp_a": r[9], "total": r[10]} for r in f5],
    "props": [{"pk": r[0], "pitcher": r[1], "team": r[2], "outs": r[3], "strikeouts": r[4], "over45": r[5], "over55": r[6], "over65": r[7]} for r in props],
    "modifiers": [{"team": r[0], "off_mod": r[1], "pitch_mod": r[2], "updated": r[3]} for r in mods],
    "forecasts": [{"pk": r[0], "home": r[1], "away": r[2], "home_prob": r[3], "away_prob": r[4], "edge": r[5], "exp_h": r[6], "exp_a": r[7], "date": r[8]} for r in forecasts]
}))
`;

  try {
    const { stdout } = await execPromise(`python3 -c "${script.replace(/"/g, '\\"')}"`);
    return JSON.parse(stdout);
  } catch (err) {
    console.error("Failed to query MLB sqlite db:", err);
    return { f5Forecasts: [], pitcherProps: [], dynamicModifiers: [], modelForecasts: [] };
  }
}

export function getNflEngineMetadata(): any {
  const metaPath = path.join(process.cwd(), 'backend/engines/nfl/engine_metadata.json');
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, 'utf-8'));
  } catch (err) {
    return null;
  }
}
