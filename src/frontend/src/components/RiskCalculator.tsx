import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useTradingContext } from "../context/TradingContext";
import { calcRisk, formatNumber, getRiskColor } from "../utils/calculatorUtils";
import { PairSelector } from "./PairSelector";
import { ResultCard } from "./ResultCard";

export function RiskCalculator() {
  const { state, setState, resetState } = useTradingContext();

  const result = useMemo(
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

  const handleCopy = () => {
    const text = [
      `Risk Calculator - ${state.pairSymbol}`,
      `Lot Size: ${state.lotSize}`,
      `Entry: ${state.entryPrice}`,
      `Stop Loss: ${state.stopLossPrice}`,
      "---",
      `Total Risk: $${formatNumber(result.riskAmount)}`,
      `Risk %: ${formatNumber(result.riskPercentage)}%`,
      `Pip Distance: ${formatNumber(result.pipDistance, 1)}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Results copied!");
  };

  const riskColor = getRiskColor(result.riskPercentage);

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Inputs
          </h3>

          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">
              Trading Pair
            </Label>
            <PairSelector
              value={state.pairSymbol}
              onValueChange={(v) => setState({ pairSymbol: v })}
              data-ocid="risk_calc.pair.select"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Lot Size</Label>
              <Input
                type="number"
                value={state.lotSize}
                onChange={(e) =>
                  setState({ lotSize: Number.parseFloat(e.target.value) || 0 })
                }
                className="num bg-input border-border text-sm"
                step="0.01"
                data-ocid="risk_calc.lot_size.input"
              />
            </div>
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
                className="num bg-input border-border text-sm"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                className="num bg-input border-border text-sm"
                step="0.00001"
                data-ocid="risk_calc.entry.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Stop Loss Price
              </Label>
              <Input
                type="number"
                value={state.stopLossPrice}
                onChange={(e) =>
                  setState({
                    stopLossPrice: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-sm"
                step="0.00001"
                data-ocid="risk_calc.stop_loss.input"
              />
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Results
          </h3>

          <div className="p-4 rounded-lg border border-border bg-muted/30 text-center">
            <div className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              Risk Percentage
            </div>
            <div className={cn("num text-4xl font-bold", riskColor)}>
              {formatNumber(result.riskPercentage, 2)}%
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              {result.riskPercentage > 2
                ? "HIGH RISK"
                : result.riskPercentage >= 1
                  ? "MODERATE"
                  : "LOW RISK"}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              label="Total Risk Amount"
              value={`$${formatNumber(result.riskAmount)}`}
              colorClass="text-loss"
            />
            <ResultCard
              label="Pip Distance"
              value={formatNumber(result.pipDistance, 1)}
              unit="pips"
            />
          </div>

          {/* Risk meter */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Safe (0-1%)</span>
              <span>Moderate (1-2%)</span>
              <span>High (2%+)</span>
            </div>
            <div className="h-2 rounded-full bg-muted overflow-hidden">
              <div
                className={cn(
                  "h-full rounded-full transition-all duration-500",
                  {
                    "bg-profit": result.riskPercentage <= 1,
                    "bg-warning-accent":
                      result.riskPercentage > 1 && result.riskPercentage <= 2,
                    "bg-loss": result.riskPercentage > 2,
                  },
                )}
                style={{
                  width: `${Math.min(100, (result.riskPercentage / 5) * 100)}%`,
                }}
              />
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border text-muted-foreground"
              onClick={resetState}
              data-ocid="risk_calc.reset.button"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleCopy}
              data-ocid="risk_calc.copy.button"
            >
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
