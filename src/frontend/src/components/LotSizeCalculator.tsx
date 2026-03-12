import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Copy, RotateCcw } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { useTradingContext } from "../context/TradingContext";
import { calcLotSize, formatNumber } from "../utils/calculatorUtils";
import { ACCOUNT_CURRENCIES } from "../utils/tradingPairs";
import { PairSelector } from "./PairSelector";
import { ResultCard } from "./ResultCard";

export function LotSizeCalculator() {
  const { state, setState, resetState } = useTradingContext();

  const result = useMemo(
    () =>
      calcLotSize(
        state.accountBalance,
        state.riskPercentage,
        state.entryPrice,
        state.stopLossPrice,
        state.pairSymbol,
      ),
    [
      state.accountBalance,
      state.riskPercentage,
      state.entryPrice,
      state.stopLossPrice,
      state.pairSymbol,
    ],
  );

  const handleCopy = () => {
    const text = [
      `Lot Size Calculator - ${state.pairSymbol}`,
      `Account Balance: ${state.accountCurrency} ${formatNumber(state.accountBalance)}`,
      `Risk: ${formatNumber(state.riskPercentage)}%`,
      `Entry: ${state.entryPrice}`,
      `Stop Loss: ${state.stopLossPrice}`,
      "---",
      `Lot Size: ${formatNumber(result.lotSize, 4)}`,
      `Risk Amount: $${formatNumber(result.riskAmount)}`,
      `Stop Loss Pips: ${formatNumber(result.stopLossPips, 1)}`,
      `Position Size: ${formatNumber(result.positionSize)}`,
      `Pip Value: $${formatNumber(result.pipValue)}`,
    ].join("\n");
    navigator.clipboard.writeText(text);
    toast.success("Results copied to clipboard!");
  };

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Inputs */}
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
              data-ocid="lot_size.pair.select"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
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
                data-ocid="lot_size.balance.input"
              />
            </div>
            <div className="space-y-1">
              <Label className="text-xs text-muted-foreground">Currency</Label>
              <Select
                value={state.accountCurrency}
                onValueChange={(v) => setState({ accountCurrency: v })}
              >
                <SelectTrigger
                  className="bg-input border-border text-sm"
                  data-ocid="lot_size.currency.select"
                >
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-popover border-border">
                  {ACCOUNT_CURRENCIES.map((c) => (
                    <SelectItem key={c} value={c} className="font-mono">
                      {c}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-xs text-muted-foreground">
                Risk Percentage
              </Label>
              <span className="num text-sm text-primary font-semibold">
                {formatNumber(state.riskPercentage, 1)}%
              </span>
            </div>
            <Slider
              min={0.1}
              max={10}
              step={0.1}
              value={[state.riskPercentage]}
              onValueChange={([v]) => setState({ riskPercentage: v })}
              className="py-1"
            />
            <Input
              type="number"
              value={state.riskPercentage}
              onChange={(e) =>
                setState({
                  riskPercentage: Number.parseFloat(e.target.value) || 0,
                })
              }
              className="num bg-input border-border text-sm"
              step="0.1"
              data-ocid="lot_size.risk_pct.input"
            />
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
                data-ocid="lot_size.entry.input"
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
                data-ocid="lot_size.stop_loss.input"
              />
            </div>
          </div>
        </div>

        {/* Outputs */}
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider pb-1 border-b border-border">
            Results
          </h3>

          <ResultCard
            label="Recommended Lot Size"
            value={formatNumber(result.lotSize, 4)}
            unit="lots"
            large
            colorClass="text-neutral-accent glow-cyan"
          />

          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              label="Risk Amount"
              value={`$${formatNumber(result.riskAmount)}`}
              colorClass="text-loss"
            />
            <ResultCard
              label="Stop Loss Pips"
              value={formatNumber(result.stopLossPips, 1)}
              unit="pips"
            />
            <ResultCard
              label="Position Size"
              value={formatNumber(result.positionSize)}
              unit="units"
            />
            <ResultCard
              label="Pip Value"
              value={`$${formatNumber(result.pipValue)}`}
              unit="/ pip"
            />
          </div>

          <div className="flex gap-2 mt-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-border text-muted-foreground hover:text-foreground"
              onClick={resetState}
              data-ocid="lot_size.reset.button"
            >
              <RotateCcw className="h-3 w-3 mr-1" /> Reset
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1 border-primary/40 text-primary hover:bg-primary/10"
              onClick={handleCopy}
              data-ocid="lot_size.copy.button"
            >
              <Copy className="h-3 w-3 mr-1" /> Copy Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
