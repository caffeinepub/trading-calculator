import { getPair } from "./tradingPairs";

export interface LotSizeResult {
  lotSize: number;
  riskAmount: number;
  stopLossPips: number;
  positionSize: number;
  pipValue: number;
}

export interface RiskResult {
  riskAmount: number;
  riskPercentage: number;
  pipDistance: number;
}

export interface ProfitResult {
  profit: number;
  pipsGain: number;
  rrRatio: number | null;
}

export interface MarginResult {
  requiredMargin: number;
  marginLevel: number;
}

export interface PipValueResult {
  pipValuePerLot: number;
  totalPipValue: number;
}

export interface SpreadImpactResult {
  spreadCost: number;
  spreadPips: number;
}

export function calcLotSize(
  accountBalance: number,
  riskPct: number,
  entryPrice: number,
  stopLossPrice: number,
  symbol: string,
): LotSizeResult {
  const pair = getPair(symbol);
  const stopLossPips = Math.abs(entryPrice - stopLossPrice) / pair.pipSize;
  const riskAmount = accountBalance * (riskPct / 100);
  const pipValue = pair.pipValuePerLot;
  const lotSize =
    stopLossPips > 0 && pipValue > 0
      ? riskAmount / (stopLossPips * pipValue)
      : 0;
  const positionSize = lotSize * pair.contractSize;
  return {
    lotSize: Math.max(0, lotSize),
    riskAmount,
    stopLossPips,
    positionSize,
    pipValue,
  };
}

export function calcRisk(
  lotSize: number,
  entryPrice: number,
  stopLossPrice: number,
  symbol: string,
  accountBalance: number,
): RiskResult {
  const pair = getPair(symbol);
  const pipDistance = Math.abs(entryPrice - stopLossPrice) / pair.pipSize;
  const riskAmount = lotSize * pipDistance * pair.pipValuePerLot;
  const riskPercentage =
    accountBalance > 0 ? (riskAmount / accountBalance) * 100 : 0;
  return { riskAmount, riskPercentage, pipDistance };
}

export function calcProfit(
  lotSize: number,
  entryPrice: number,
  takeProfitPrice: number,
  symbol: string,
  stopLossPrice?: number,
): ProfitResult {
  const pair = getPair(symbol);
  const pipsGain = Math.abs(entryPrice - takeProfitPrice) / pair.pipSize;
  const profit = lotSize * pipsGain * pair.pipValuePerLot;
  let rrRatio: number | null = null;
  if (stopLossPrice !== undefined && stopLossPrice !== 0) {
    const slPips = Math.abs(entryPrice - stopLossPrice) / pair.pipSize;
    rrRatio = slPips > 0 ? pipsGain / slPips : null;
  }
  return { profit, pipsGain, rrRatio };
}

export function calcMargin(
  lotSize: number,
  entryPrice: number,
  symbol: string,
  leverage: number,
): MarginResult {
  const pair = getPair(symbol);
  const notionalValue = pair.contractSize * lotSize * entryPrice;
  const requiredMargin = leverage > 0 ? notionalValue / leverage : 0;
  return { requiredMargin, marginLevel: leverage };
}

export function calcPipValue(symbol: string, lotSize: number): PipValueResult {
  const pair = getPair(symbol);
  return {
    pipValuePerLot: pair.pipValuePerLot,
    totalPipValue: pair.pipValuePerLot * lotSize,
  };
}

export function calcSpreadImpact(
  symbol: string,
  lotSize: number,
  spreadPips: number,
): SpreadImpactResult {
  const pair = getPair(symbol);
  const spreadCost = spreadPips * pair.pipValuePerLot * lotSize;
  return { spreadCost, spreadPips };
}

export function formatNumber(value: number, decimals = 2): string {
  if (!Number.isFinite(value) || Number.isNaN(value)) return "0.00";
  return value.toFixed(decimals);
}

export function getRiskColor(riskPct: number): string {
  if (riskPct > 2) return "text-loss";
  if (riskPct >= 1) return "text-warning-accent";
  return "text-profit";
}

export function getRRColor(rr: number): string {
  if (rr >= 2) return "text-profit";
  if (rr >= 1) return "text-warning-accent";
  return "text-loss";
}
