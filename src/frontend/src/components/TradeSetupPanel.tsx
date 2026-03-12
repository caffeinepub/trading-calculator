import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import {
  Bar,
  BarChart,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { useTradingContext } from "../context/TradingContext";
import {
  calcProfit,
  calcRisk,
  formatNumber,
  getRRColor,
  getRiskColor,
} from "../utils/calculatorUtils";
import { PairSelector } from "./PairSelector";

const CHART_COLORS = {
  Risk: "oklch(0.52 0.22 20)",
  Reward: "oklch(0.65 0.2 148)",
};

export function TradeSetupPanel() {
  const { state, setState } = useTradingContext();

  const risk = useMemo(
    () =>
      calcRisk(
        state.lotSize,
        state.entryPrice,
        state.stopLossPrice,
        state.pairSymbol,
        state.accountBalance,
      ),
    [
      state.lotSize,
      state.entryPrice,
      state.stopLossPrice,
      state.pairSymbol,
      state.accountBalance,
    ],
  );

  const profit = useMemo(
    () =>
      calcProfit(
        state.lotSize,
        state.entryPrice,
        state.takeProfitPrice,
        state.pairSymbol,
        state.stopLossPrice,
      ),
    [
      state.lotSize,
      state.entryPrice,
      state.takeProfitPrice,
      state.pairSymbol,
      state.stopLossPrice,
    ],
  );

  const chartData = [
    { name: "Risk", value: Math.abs(risk.riskAmount) },
    { name: "Reward", value: Math.abs(profit.profit) },
  ];

  const rrColor =
    profit.rrRatio !== null
      ? getRRColor(profit.rrRatio)
      : "text-muted-foreground";
  const riskColor = getRiskColor(risk.riskPercentage);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Inputs column */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Trade Setup
          </h3>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Trading Pair
            </Label>
            <PairSelector
              value={state.pairSymbol}
              onValueChange={(v) => setState({ pairSymbol: v })}
              data-ocid="trade_setup.pair.select"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Account Balance
              </Label>
              <Input
                type="number"
                value={state.accountBalance}
                onChange={(e) =>
                  setState({
                    accountBalance: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-xs h-8"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Lot Size</Label>
              <Input
                type="number"
                value={state.lotSize}
                onChange={(e) =>
                  setState({ lotSize: Number.parseFloat(e.target.value) || 0 })
                }
                className="num bg-input border-border text-xs h-8"
                step="0.01"
                data-ocid="trade_setup.lot_size.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Entry Price
              </Label>
              <Input
                type="number"
                value={state.entryPrice}
                onChange={(e) =>
                  setState({
                    entryPrice: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-xs h-8"
                step="0.00001"
                data-ocid="trade_setup.entry.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Stop Loss</Label>
              <Input
                type="number"
                value={state.stopLossPrice}
                onChange={(e) =>
                  setState({
                    stopLossPrice: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-xs h-8"
                step="0.00001"
                data-ocid="trade_setup.stop_loss.input"
              />
            </div>
            <div className="col-span-2 space-y-1">
              <Label className="text-xs text-muted-foreground">
                Take Profit
              </Label>
              <Input
                type="number"
                value={state.takeProfitPrice}
                onChange={(e) =>
                  setState({
                    takeProfitPrice: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-xs h-8"
                step="0.00001"
                data-ocid="trade_setup.take_profit.input"
              />
            </div>
          </div>
        </div>

        {/* Key metrics column */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Key Metrics
          </h3>

          <div className="p-4 rounded-lg border border-border bg-muted/20 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Risk / Reward Ratio
            </div>
            {profit.rrRatio !== null ? (
              <div
                className={cn("num text-5xl font-bold tracking-tight", rrColor)}
              >
                1:{formatNumber(profit.rrRatio, 2)}
              </div>
            ) : (
              <div className="num text-3xl font-bold text-muted-foreground">
                N/A
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div className="p-3 rounded border border-border bg-muted/30">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Total Risk
              </div>
              <div className={cn("num font-bold text-lg", riskColor)}>
                ${formatNumber(risk.riskAmount)}
              </div>
            </div>
            <div className="p-3 rounded border border-border bg-muted/30">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Potential Profit
              </div>
              <div className="num font-bold text-lg text-profit">
                ${formatNumber(profit.profit)}
              </div>
            </div>
            <div className="col-span-2 p-3 rounded border border-border bg-muted/30">
              <div className="text-xs text-muted-foreground uppercase tracking-wider">
                Risk % of Account
              </div>
              <div className={cn("num font-bold text-2xl", riskColor)}>
                {formatNumber(risk.riskPercentage, 2)}%
              </div>
            </div>
          </div>
        </div>

        {/* Chart column */}
        <div className="space-y-3 lg:col-span-1">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Risk vs Reward
          </h3>

          <div className="h-48 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                barSize={50}
                margin={{ top: 10, right: 10, left: 0, bottom: 10 }}
              >
                <XAxis
                  dataKey="name"
                  tick={{ fill: "oklch(0.52 0.012 225)", fontSize: 11 }}
                  axisLine={{ stroke: "oklch(0.2 0.01 235)" }}
                  tickLine={false}
                />
                <YAxis
                  tick={{
                    fill: "oklch(0.52 0.012 225)",
                    fontSize: 10,
                    fontFamily: "JetBrains Mono",
                  }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) =>
                    `$${v > 1000 ? `${(v / 1000).toFixed(1)}k` : v.toFixed(0)}`
                  }
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "oklch(0.12 0.01 235)",
                    border: "1px solid oklch(0.2 0.01 235)",
                    borderRadius: "6px",
                    color: "oklch(0.91 0.015 220)",
                    fontFamily: "JetBrains Mono",
                    fontSize: 12,
                  }}
                  formatter={(val: number) => [`$${val.toFixed(2)}`, ""]}
                />
                <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                  {chartData.map((entry) => (
                    <Cell
                      key={entry.name}
                      fill={
                        CHART_COLORS[entry.name as keyof typeof CHART_COLORS]
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          <div className="flex justify-between text-xs text-muted-foreground num">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-loss inline-block" />
              Risk: ${formatNumber(risk.riskAmount)}
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-profit inline-block" />
              Reward: ${formatNumber(profit.profit)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
