import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { Copy, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useTradingContext } from "../context/TradingContext";
import { calcProfit, formatNumber, getRRColor } from "../utils/calculatorUtils";
import { PairSelector } from "./PairSelector";
import { ResultCard } from "./ResultCard";

export function ProfitCalculator() {
  const { state, setState, resetState } = useTradingContext();

  const result = useMemo(
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

  const handleCopy = () => {
    const text = [
      `Profit Calculator - ${state.pairSymbol}`,
      `Lot Size: ${state.lotSize}`,
      `Entry: ${state.entryPrice}`,
      `Take Profit: ${state.takeProfitPrice}`,
      "---",
      `Expected Profit: $${formatNumber(result.profit)}`,
      `Pips Gain: ${formatNumber(result.pipsGain, 1)}`,
      `R:R Ratio: ${result.rrRatio !== null ? `1:${formatNumber(result.rrRatio, 2)}` : "N/A"}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Results copied!");
  };

  const rrColor =
    result.rrRatio !== null
      ? getRRColor(result.rrRatio)
      : "text-muted-foreground";

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
              data-ocid="profit_calc.pair.select"
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
                data-ocid="profit_calc.lot_size.input"
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
                className="num bg-input border-border text-sm"
                step="0.00001"
                data-ocid="profit_calc.entry.input"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Take Profit Price
              </Label>
              <Input
                type="number"
                value={state.takeProfitPrice}
                onChange={(e) =>
                  setState({
                    takeProfitPrice: Number.parseFloat(e.target.value) || 0,
                  })
                }
                className="num bg-input border-border text-sm"
                step="0.00001"
                data-ocid="profit_calc.take_profit.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">
                Stop Loss (for R:R)
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
              Risk / Reward Ratio
            </div>
            {result.rrRatio !== null ? (
              <div className={cn("num text-4xl font-bold", rrColor)}>
                1:{formatNumber(result.rrRatio, 2)}
              </div>
            ) : (
              <div className="num text-2xl font-bold text-muted-foreground">
                N/A
              </div>
            )}
            {result.rrRatio !== null && (
              <div className="text-xs text-muted-foreground mt-1">
                {result.rrRatio >= 2
                  ? "EXCELLENT"
                  : result.rrRatio >= 1
                    ? "ACCEPTABLE"
                    : "POOR"}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              label="Expected Profit"
              value={`$${formatNumber(result.profit)}`}
              large
              colorClass="text-profit"
            />
            <ResultCard
              label="Pips Gain"
              value={formatNumber(result.pipsGain, 1)}
              unit="pips"
            />
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border text-muted-foreground"
              onClick={resetState}
              data-ocid="profit_calc.reset.button"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleCopy}
              data-ocid="profit_calc.copy.button"
            >
              <Copy className="h-3 w-3 mr-1" /> Copy
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
