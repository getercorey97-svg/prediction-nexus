# TT-Oracle: State-of-the-Art Table Tennis Outcome & Totals Prediction Engine

A quantitative mathematical engine designed for high-frequency Table Tennis circuits (Pandora / Setka Cup, TT Elite Series, Czech Liga Pro, Moscow Liga Pro, and WTT).

## Mathematical Framework & Algorithmic Stack

1. **Vectorized 50,000-Iteration Monte Carlo Match Simulator**:
   - Point-by-point, set-by-set (best-of-5) simulation.
   - Accurately tracks total match points over/under distributions, exact set score probabilities (3-0, 3-1, 3-2, etc.), set handicap spreads, and Set 1 win rates.

2. **Hierarchical Point-Level Markov Chain**:
   - Serves rotate every 2 points (or every 1 point upon reaching 10-10 deuce).
   - Asymmetric point probabilities: $P(\text{point win} \mid \text{serving}) \neq P(\text{point win} \mid \text{receiving})$.

3. **Dynamic Glicko-2 Elo with Volatility & Rapid Activity Decay**:
   - Tracks rating $R$, rating deviation $RD$, and volatility $\sigma$.
   - Tailored for multi-match tournament days where players contest 4 to 8 matches within hours.

4. **Style-Rubber Bayesian Prior Matrix**:
   - Southpaw angle advantage (Left-handed vs Right-handed).
   - Long Pips spin-reversal penalty on conventional loop attackers.
   - Anti-spin dead-ball absorption against heavy topspin drives.
   - Cold-start Bayesian prior shrinkage for unranked or newly registered circuit players.

5. **Continuous Learning & Backtesting**:
   - Recalibrates style matrix weights on every match conclusion using gradient descent on Brier loss:
     $$w_{new} = w_{old} - \eta \cdot 2 (p_{pred} - y_{actual}) \cdot \nabla_w p$$
   - Verified automated GitHub Actions cron workflow executing continuous backtesting and memory persistence.
