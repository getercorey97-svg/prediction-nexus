"""
SOTA Table Tennis Backtester & Continuous Optimizer
Evaluates historical predictions against realized match outcomes, calculates Brier loss,
and dynamically recalibrates style-rubber interaction weights.
Author: The Prediction Nexus & Corey Geter
Repository: https://github.com/getercorey97-svg/tt-oracle
"""

import pandas as pd
import numpy as np
import json
import os
from oracle import TTOracleSOTA

class SOTABacktester:
    def __init__(self, history_path='history.csv', db_path='players.json'):
        self.history_path = history_path
        self.oracle = TTOracleSOTA(db_path=db_path)
        if not os.path.exists(self.history_path):
            from seed_history import generate_factual_seed
            generate_factual_seed(self.history_path)
        self.history = pd.read_csv(self.history_path)

    def calculate_brier_score(self, predictions, actuals):
        """Calculates quadratic Brier Score (lower is better, < 0.20 is strong)."""
        if not predictions or len(predictions) == 0:
            return 1.0
        return float(np.mean((np.array(predictions) - np.array(actuals)) ** 2))

    def run_backtest_audit(self, sample_size=200):
        """Audits current engine accuracy against historical match records."""
        data = self.history.tail(sample_size)
        predictions = []
        actuals = []
        correct_count = 0

        for _, row in data.iterrows():
            p = self.oracle.calculate_sota_point_prob(row['p1_name'], row['p2_name'])
            # Convert point prob to match win prob via fast sigmoid logistic mapping
            # (In table tennis, point prob 0.53 equates to ~67% match win prob)
            win_prob = 1 / (1 + np.exp(-14.2 * (p - 0.50)))
            actual = 1 if row['winner'] == row['p1_name'] else 0

            predictions.append(win_prob)
            actuals.append(actual)

            if (win_prob >= 0.5 and actual == 1) or (win_prob < 0.5 and actual == 0):
                correct_count += 1

        brier = self.calculate_brier_score(predictions, actuals)
        acc_rate = correct_count / len(data) if len(data) > 0 else 0.0

        return {
            "sample_size": len(data),
            "accuracy_rate": acc_rate,
            "brier_score": brier,
            "predictions_count": len(predictions)
        }

    def optimize_math(self):
        """Grid search optimization for style matrix weights against historical matches."""
        print("SOTA Optimization: Searching for best Calibration...")
        best_score = float('inf')
        current_matrix = self.oracle.db.get('style_matrix', {})
        best_l = current_matrix.get('lefty_vs_righty_bonus', 0.024)
        best_p = current_matrix.get('long_pips_vs_attacker_penalty', 0.038)
        best_f = current_matrix.get('fatigue_decay_rate', 0.008)

        if len(self.history) >= 20:
            test_data = self.history.tail(150)
            for l_w in [0.018, 0.024, 0.030]:
                for p_w in [0.030, 0.038, 0.046]:
                    for f_w in [0.006, 0.008, 0.010]:
                        self.oracle.db['style_matrix']['lefty_vs_righty_bonus'] = l_w
                        self.oracle.db['style_matrix']['long_pips_vs_attacker_penalty'] = p_w
                        self.oracle.db['style_matrix']['fatigue_decay_rate'] = f_w

                        preds = []
                        actuals = []
                        for _, row in test_data.iterrows():
                            p = self.oracle.calculate_sota_point_prob(row['p1_name'], row['p2_name'])
                            win_prob = 1 / (1 + np.exp(-14.2 * (p - 0.50)))
                            preds.append(win_prob)
                            actuals.append(1 if row['winner'] == row['p1_name'] else 0)

                        score = self.calculate_brier_score(preds, actuals)
                        if score < best_score:
                            best_score = score
                            best_l, best_p, best_f = l_w, p_w, f_w

        # Save the best weights found
        self.oracle.db['style_matrix']['lefty_vs_righty_bonus'] = best_l
        self.oracle.db['style_matrix']['long_pips_vs_attacker_penalty'] = best_p
        self.oracle.db['style_matrix']['fatigue_decay_rate'] = best_f
        self.oracle.save_state()
        print(f"Calibration Complete. Optimal weights: Lefty: {best_l}, Pips: {best_p}, Fatigue: {best_f}. Brier: {best_score:.4f}")

if __name__ == "__main__":
    tester = SOTABacktester()
    audit = tester.run_backtest_audit(100)
    print(f"Pre-Optimization Audit: Accuracy: {audit['accuracy_rate']:.1%}, Brier: {audit['brier_score']:.4f}")
    tester.optimize_math()
