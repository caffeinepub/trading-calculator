# Trading Calculator

## Current State
New project with empty frontend and backend.

## Requested Changes (Diff)

### Add
- Lot Size Calculator with inputs (account balance, risk %, entry price, stop loss, currency, pair symbol) and outputs (lot size, risk amount, stop loss in pips, position size, pip value)
- Risk Calculator with inputs (lot size, entry, stop loss, pair) and outputs (total risk, risk %, pip distance)
- Profit Calculator with inputs (lot size, entry, take profit, pair) and outputs (expected profit, pips gain, R:R ratio)
- Trade Setup Panel showing R:R ratio, total risk, potential profit, risk % of account
- Advanced Tools: Position Size Calculator, Pip Value Calculator, Margin Calculator, Spread Impact Calculator
- Trading pair support: Forex (EURUSD, GBPUSD, USDJPY, etc.), Gold (XAUUSD), Crypto (BTCUSDT, ETHUSDT), Indices
- Real-time calculations (reactive, no submit button)
- Risk vs Reward visualization chart (Chart.js/Recharts)
- Save/load favorite trading setups (Motoko backend persistence)
- Copy results to clipboard
- Reset calculator button
- Dark mode MT5-style dashboard UI, mobile responsive

### Modify
- N/A (new project)

### Remove
- N/A

## Implementation Plan
1. Motoko backend: data types for TradingSetup (pair, balance, riskPct, entryPrice, stopLoss, takeProfit, lotSize, accountCurrency), CRUD operations (saveSetup, getSetups, deleteSetup)
2. Frontend app shell: dark dashboard layout with tab navigation (Lot Size, Risk, Profit, Trade Setup, Advanced Tools)
3. Trading pair registry: pip value multipliers, contract sizes for Forex/Gold/Crypto/Indices
4. Lot Size Calculator component with slider for risk %
5. Risk Calculator component
6. Profit Calculator component
7. Trade Setup Panel combining all inputs
8. Advanced Tools section (Position Size, Pip Value, Margin, Spread Impact)
9. Risk/Reward chart visualization using Recharts
10. Saved Setups panel: list, load, delete from backend
11. Copy-to-clipboard and reset functionality
