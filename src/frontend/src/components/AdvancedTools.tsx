import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useMemo, useState } from "react";
import {
  calcMargin,
  calcPipValue,
  calcSpreadImpact,
  formatNumber,
} from "../utils/calculatorUtils";
import { getPair } from "../utils/tradingPairs";
import { PairSelector } from "./PairSelector";
import { ResultCard } from "./ResultCard";

export function AdvancedTools() {
  // Position Size sub-calculator
  const [psBalance, setPsBalance] = useState(10000);
  const [psRiskPct, setPsRiskPct] = useState(1);
  const [psSlPips, setPsSlPips] = useState(50);
  const [psPair, setPsPair] = useState("EURUSD");

  // Pip Value sub-calculator
  const [pvPair, setPvPair] = useState("EURUSD");
  const [pvLotSize, setPvLotSize] = useState(1);

  // Margin sub-calculator
  const [mPair, setMPair] = useState("EURUSD");
  const [mLotSize, setMLotSize] = useState(1);
  const [mEntry, setMEntry] = useState(1.085);
  const [mLeverage, setMLeverage] = useState(100);

  // Spread Impact sub-calculator
  const [siPair, setSiPair] = useState("EURUSD");
  const [siLotSize, setSiLotSize] = useState(1);
  const [siSpread, setSiSpread] = useState(1.5);

  // Calculations
  const psResult = useMemo(() => {
    if (psSlPips <= 0)
      return { lotSize: 0, riskAmount: psBalance * (psRiskPct / 100) };
    const riskAmount = psBalance * (psRiskPct / 100);
    const pair = getPair(psPair);
    const lotSize = riskAmount / (psSlPips * pair.pipValuePerLot);
    return { lotSize: Math.max(0, lotSize), riskAmount };
  }, [psBalance, psRiskPct, psSlPips, psPair]);

  const pvResult = useMemo(
    () => calcPipValue(pvPair, pvLotSize),
    [pvPair, pvLotSize],
  );
  const mResult = useMemo(
    () => calcMargin(mLotSize, mEntry, mPair, mLeverage),
    [mLotSize, mEntry, mPair, mLeverage],
  );
  const siResult = useMemo(
    () => calcSpreadImpact(siPair, siLotSize, siSpread),
    [siPair, siLotSize, siSpread],
  );

  const panelClass = "p-4 rounded-lg border border-border bg-card space-y-3";
  const labelClass = "text-xs text-muted-foreground";
  const inputClass = "num bg-input border-border text-sm h-8";

  return (
    <div className="space-y-4 animate-slide-up">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Position Size Calculator */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold text-neutral-accent uppercase tracking-wider">
            Position Size Calculator
          </h3>
          <div className="space-y-1">
            <Label className={labelClass}>Trading Pair</Label>
            <PairSelector value={psPair} onValueChange={setPsPair} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className={labelClass}>Balance ($)</Label>
              <Input
                type="number"
                value={psBalance}
                onChange={(e) =>
                  setPsBalance(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Risk %</Label>
              <Input
                type="number"
                value={psRiskPct}
                onChange={(e) =>
                  setPsRiskPct(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                step="0.1"
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>SL Pips</Label>
              <Input
                type="number"
                value={psSlPips}
                onChange={(e) =>
                  setPsSlPips(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                data-ocid="advanced.leverage.input"
              />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              label="Lot Size"
              value={formatNumber(psResult.lotSize, 4)}
              unit="lots"
              colorClass="text-neutral-accent"
            />
            <ResultCard
              label="Risk Amount"
              value={`$${formatNumber(psResult.riskAmount)}`}
              colorClass="text-loss"
            />
          </div>
        </div>

        {/* Pip Value Calculator */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold text-neutral-accent uppercase tracking-wider">
            Pip Value Calculator
          </h3>
          <div className="space-y-1">
            <Label className={labelClass}>Trading Pair</Label>
            <PairSelector value={pvPair} onValueChange={setPvPair} />
          </div>
          <div className="space-y-1">
            <Label className={labelClass}>Lot Size</Label>
            <Input
              type="number"
              value={pvLotSize}
              onChange={(e) =>
                setPvLotSize(Number.parseFloat(e.target.value) || 0)
              }
              className={inputClass}
              step="0.01"
            />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <ResultCard
              label="Pip Value / Lot"
              value={`$${formatNumber(pvResult.pipValuePerLot, 4)}`}
              colorClass="text-neutral-accent"
            />
            <ResultCard
              label="Total Pip Value"
              value={`$${formatNumber(pvResult.totalPipValue, 4)}`}
              colorClass="text-profit"
            />
          </div>
        </div>

        {/* Margin Calculator */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold text-neutral-accent uppercase tracking-wider">
            Margin Calculator
          </h3>
          <div className="space-y-1">
            <Label className={labelClass}>Trading Pair</Label>
            <PairSelector value={mPair} onValueChange={setMPair} />
          </div>
          <div className="grid grid-cols-3 gap-2">
            <div className="space-y-1">
              <Label className={labelClass}>Lot Size</Label>
              <Input
                type="number"
                value={mLotSize}
                onChange={(e) =>
                  setMLotSize(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                step="0.01"
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Entry Price</Label>
              <Input
                type="number"
                value={mEntry}
                onChange={(e) =>
                  setMEntry(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                step="0.00001"
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Leverage</Label>
              <Input
                type="number"
                value={mLeverage}
                onChange={(e) =>
                  setMLeverage(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
              />
            </div>
          </div>
          <ResultCard
            label="Required Margin"
            value={`$${formatNumber(mResult.requiredMargin)}`}
            large
            colorClass="text-warning-accent"
          />
        </div>

        {/* Spread Impact Calculator */}
        <div className={panelClass}>
          <h3 className="text-sm font-semibold text-neutral-accent uppercase tracking-wider">
            Spread Impact Calculator
          </h3>
          <div className="space-y-1">
            <Label className={labelClass}>Trading Pair</Label>
            <PairSelector value={siPair} onValueChange={setSiPair} />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <Label className={labelClass}>Lot Size</Label>
              <Input
                type="number"
                value={siLotSize}
                onChange={(e) =>
                  setSiLotSize(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                step="0.01"
              />
            </div>
            <div className="space-y-1">
              <Label className={labelClass}>Spread (pips)</Label>
              <Input
                type="number"
                value={siSpread}
                onChange={(e) =>
                  setSiSpread(Number.parseFloat(e.target.value) || 0)
                }
                className={inputClass}
                step="0.1"
                data-ocid="advanced.spread.input"
              />
            </div>
          </div>
          <ResultCard
            label="Spread Cost"
            value={`$${formatNumber(siResult.spreadCost, 4)}`}
            large
            colorClass="text-loss"
          />
        </div>
      </div>
    </div>
  );
}
