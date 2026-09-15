"""
SOTA Table Tennis Oracle (TT-Oracle)
Vectorized 50,000-Iteration Monte Carlo, Point-Level Markov Chain, and Dynamic Glicko-2 Engine
Author: The Prediction Nexus & Corey Geter
Repository: https://github.com/getercorey97-svg/tt-oracle
"""

import numpy as np
import json
import requests
import os
from datetime import datetime
try:
    from glicko2 import Player
except ImportError:
    # Standalone fallback Glicko-2 if package not installed
    class Player:
        def __init__(self, rating=1500, rd=350, vol=0.06):
            self.rating = rating
            self.rd = rd
            self.vol = vol

class TTOracleSOTA:
    def __init__(self, db_path='players.json', ledger_path='active_matches.json'):
        self.db_path = db_path
        self.ledger_path = ledger_path
        self.ntfy_url = "https://ntfy.sh/" + os.getenv("NTFY_TOPIC", "tt_engine_alerts")
        self.load_db()
        self.load_ledger()

    def load_db(self):
        if os.path.exists(self.db_path):
            with open(self.db_path, 'r') as f:
                self.db = json.load(f)
        else:
            self.db = {
                "players": {},
                "style_matrix": {
                    "lefty_vs_righty_bonus": 0.024,
                    "long_pips_vs_attacker_penalty": 0.038,
                    "anti_spin_vs_power_bonus": 0.029,
                    "short_pips_table_close_bonus": 0.018,
                    "fatigue_decay_rate": 0.008
                },
                "league_multipliers": {
                    "WTT": 1.45,
                    "TT_Elite": 1.15,
                    "Setka": 1.0,
                    "Czech_Liga": 1.05,
                    "Default": 0.95
                }
            }

    def load_ledger(self):
        if os.path.exists(self.ledger_path):
            with open(self.ledger_path, 'r') as f:
                self.ledger = json.load(f)
        else:
            self.ledger = []

    def save_state(self):
        with open(self.db_path, 'w') as f:
            json.dump(self.db, f, indent=4)
        with open(self.ledger_path, 'w') as f:
            json.dump(self.ledger, f, indent=4)

    def save_db(self):
        """Alias for save_state to ensure compatibility with backtester."""
        self.save_state()

    def get_player(self, name):
        """Fetches player or synthesizes a cold-start Bayesian prior."""
        if name not in self.db['players']:
            # Cold-start Bayesian prior estimation
            self.db['players'][name] = {
                "name": name,
                "rating": 1550,
                "rd": 120,
                "vol": 0.065,
                "style": "Attacker",
                "hand": "Right",
                "rubber_fh": "Inverted",
                "rubber_bh": "Inverted",
                "league": "Default",
                "matches_today": 0,
                "serve_win_rate": 0.55,
                "return_win_rate": 0.48
            }
        p = self.db['players'][name]
        return Player(p.get('rating', 1500), p.get('rd', 100), p.get('vol', 0.06)), p

    def calculate_sota_point_prob(self, p1_name, p2_name):
        """
        Calculates the pure single-point win probability for Player 1
        integrating Glicko-2 ratings, style interactions, rubber dynamics, and fatigue.
        """
        p1_obj, p1_d = self.get_player(p1_name)
        p2_obj, p2_d = self.get_player(p2_name)

        # 1. Glicko-2 differential
        diff = (p1_obj.rating - p2_obj.rating)
        p_pt = 0.50 + (1 / (1 + 10 ** (-diff / 400)) - 0.5) * 0.22

        matrix = self.db.get('style_matrix', {})
        l_bonus = matrix.get('lefty_vs_righty_bonus', 0.024)
        pips_penalty = matrix.get('long_pips_vs_attacker_penalty', 0.038)
        anti_bonus = matrix.get('anti_spin_vs_power_bonus', 0.029)
        fatigue_decay = matrix.get('fatigue_decay_rate', 0.008)

        # 2. Lefty vs Righty dynamic
        if p1_d.get('hand') == 'Left' and p2_d.get('hand') == 'Right':
            p_pt += l_bonus
        elif p2_d.get('hand') == 'Left' and p1_d.get('hand') == 'Right':
            p_pt -= l_bonus

        # 3. Long Pips spin-reversal penalty on attacker
        p1_bh = p1_d.get('rubber_bh', p1_d.get('rubber', 'Inverted'))
        p2_bh = p2_d.get('rubber_bh', p2_d.get('rubber', 'Inverted'))

        if p2_bh == 'Long Pips' and p1_d.get('style') == 'Attacker':
            p_pt -= pips_penalty
        elif p1_bh == 'Long Pips' and p2_d.get('style') == 'Attacker':
            p_pt += pips_penalty

        # 4. Anti-spin dead ball dampening
        if p1_bh == 'Anti-Spin' and p2_d.get('style') in ['Attacker', 'Looper']:
            p_pt += anti_bonus
        elif p2_bh == 'Anti-Spin' and p1_d.get('style') in ['Attacker', 'Looper']:
            p_pt -= anti_bonus

        # 5. Circuit Fatigue (matches played today)
        m1 = p1_d.get('matches_today', 0)
        m2 = p2_d.get('matches_today', 0)
        if m1 > 1:
            p_pt -= (m1 - 1) * fatigue_decay
        if m2 > 1:
            p_pt += (m2 - 1) * fatigue_decay

        return np.clip(p_pt, 0.25, 0.75)

    def vectorized_monte_carlo(self, p1_name, p2_name, iterations=50000, market_total_line=74.5):
        """
        Runs 50,000 vectorized match simulations tracking:
        - Match Winner Probability
        - Total Points Over/Under distribution
        - Exact Set Scores (3-0, 3-1, 3-2, etc.)
        """
        p_pt = self.calculate_sota_point_prob(p1_name, p2_name)
        p1_obj, p1_d = self.get_player(p1_name)
        p2_obj, p2_d = self.get_player(p2_name)

        # Serve advantage modifications
        srv_adv_1 = (p1_d.get('serve_win_rate', 0.55) - 0.50) * 0.12
        srv_adv_2 = (p2_d.get('serve_win_rate', 0.55) - 0.50) * 0.12

        p1_srv_prob = np.clip(p_pt + srv_adv_1, 0.30, 0.80)
        p2_srv_prob = np.clip((1 - p_pt) + srv_adv_2, 0.30, 0.80)

        p1_sets = np.zeros(iterations, dtype=int)
        p2_sets = np.zeros(iterations, dtype=int)
        total_points = np.zeros(iterations, dtype=int)

        # Run sets until a player reaches 3 sets (Best of 5)
        for set_idx in range(5):
            active_matches = (p1_sets < 3) & (p2_sets < 3)
            if not np.any(active_matches):
                break

            p1_pts = np.zeros(iterations, dtype=int)
            p2_pts = np.zeros(iterations, dtype=int)
            active_sets = active_matches.copy()

            # Starting server rotates per set
            set_starter = 1 if (set_idx % 2 == 0) else 2

            # Point loop
            point_in_set = 0
            while np.any(active_sets):
                # Serve rotates every 2 points, unless deuce (10-10) where it rotates every 1 point
                deuce_mask = active_sets & (p1_pts >= 10) & (p2_pts >= 10)
                standard_mask = active_sets & (~deuce_mask)

                # Determine who is serving
                p1_serving = np.zeros(iterations, dtype=bool)
                if set_starter == 1:
                    p1_serving[standard_mask] = ((point_in_set // 2) % 2 == 0)
                    p1_serving[deuce_mask] = (point_in_set % 2 == 0)
                else:
                    p1_serving[standard_mask] = ((point_in_set // 2) % 2 == 1)
                    p1_serving[deuce_mask] = (point_in_set % 2 == 1)

                rolls = np.random.random(iterations)
                # If P1 is serving: wins if roll < p1_srv_prob
                # If P2 is serving: P1 wins if roll >= p2_srv_prob
                p1_point_win = np.where(p1_serving, rolls < p1_srv_prob, rolls >= p2_srv_prob)

                p1_pts[active_sets & p1_point_win] += 1
                p2_pts[active_sets & (~p1_point_win)] += 1
                point_in_set += 1

                # Check set end condition: >= 11 points and diff >= 2
                set_ended = active_sets & (((p1_pts >= 11) | (p2_pts >= 11)) & (np.abs(p1_pts - p2_pts) >= 2))
                p1_sets[set_ended & (p1_pts > p2_pts)] += 1
                p2_sets[set_ended & (p2_pts > p1_pts)] += 1
                total_points[set_ended] += (p1_pts[set_ended] + p2_pts[set_ended])

                active_sets[set_ended] = False

        # Calculate metrics from 50,000 simulations
        p1_win_prob = float(np.mean(p1_sets >= 3))
        p2_win_prob = 1.0 - p1_win_prob

        mean_total_pts = float(np.mean(total_points))
        over_prob = float(np.mean(total_points > market_total_line))
        under_prob = 1.0 - over_prob

        # Set score distributions
        scores_3_0 = float(np.mean((p1_sets == 3) & (p2_sets == 0)))
        scores_3_1 = float(np.mean((p1_sets == 3) & (p2_sets == 1)))
        scores_3_2 = float(np.mean((p1_sets == 3) & (p2_sets == 2)))
        scores_2_3 = float(np.mean((p1_sets == 2) & (p2_sets == 3)))
        scores_1_3 = float(np.mean((p1_sets == 1) & (p2_sets == 3)))
        scores_0_3 = float(np.mean((p1_sets == 0) & (p2_sets == 3)))

        return {
            "p1_win_prob": p1_win_prob,
            "p2_win_prob": p2_win_prob,
            "point_prob": p_pt,
            "mean_total_points": mean_total_pts,
            "over_prob": over_prob,
            "under_prob": under_prob,
            "market_total_line": market_total_line,
            "set_scores": {
                "3-0": scores_3_0,
                "3-1": scores_3_1,
                "3-2": scores_3_2,
                "2-3": scores_2_3,
                "1-3": scores_1_3,
                "0-3": scores_0_3
            }
        }

    def predict_and_store(self, p1, p2, market_odds_p1=1.90, market_odds_p2=1.90, total_line=74.5, league="Default"):
        """Runs 50k simulations, calculates edge, updates ledger, and fires alerts."""
        sim = self.vectorized_monte_carlo(p1, p2, iterations=50000, market_total_line=total_line)

        winner = p1 if sim['p1_win_prob'] > 0.5 else p2
        confidence = sim['p1_win_prob'] if winner == p1 else sim['p2_win_prob']

        market_implied = (1 / market_odds_p1) if winner == p1 else (1 / market_odds_p2)
        edge = confidence - market_implied

        record = {
            "p1": p1,
            "p2": p2,
            "predicted_winner": winner,
            "win_probability": confidence,
            "edge": edge,
            "mean_points": sim['mean_total_points'],
            "total_line": total_line,
            "over_prob": sim['over_prob'],
            "under_prob": sim['under_prob'],
            "set_scores": sim['set_scores'],
            "timestamp": datetime.now().isoformat(),
            "status": "Live"
        }

        self.ledger.append(record)
        self.send_alert(record)
        self.save_state()
        return record

    def send_alert(self, record):
        msg = (
            f"🏓 SOTA TT ORACLE (50,000 SIMS)\n"
            f"Match: {record['p1']} vs {record['p2']}\n"
            f"Pick: {record['predicted_winner']} ({record['win_probability']:.1%})\n"
            f"Edge: +{record['edge']:.1%}\n"
            f"Total Points: O/U {record['total_line']} (Mean: {record['mean_points']:.1f})\n"
            f"Over: {record['over_prob']:.1%} | Under: {record['under_prob']:.1%}"
        )
        try:
            requests.post(self.ntfy_url, data=msg.encode('utf-8'), timeout=5)
        except Exception:
            pass

if __name__ == "__main__":
    oracle = TTOracleSOTA()
    if os.path.exists('queue_predict.json'):
        with open('queue_predict.json', 'r') as f:
            matches = json.load(f)
            for m in matches:
                oracle.predict_and_store(
                    m['p1'], 
                    m['p2'], 
                    m.get('odds_p1', 1.90), 
                    m.get('odds_p2', 1.90),
                    m.get('total_line', 74.5),
                    m.get('league', 'Default')
                )
        os.remove('queue_predict.json')
    else:
        # Demo simulation
        print("Running benchmark 50,000 simulation...")
        res = oracle.predict_and_store("Truls Moregard", "Hugo Calderano", 2.05, 1.78, 76.5)
        print(f"Result: {res['predicted_winner']} win prob: {res['win_probability']:.1%}, Mean pts: {res['mean_points']:.1f}")
