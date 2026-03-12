import { type ReactNode, createContext, useContext, useState } from "react";

export interface TradingState {
  accountBalance: number;
  riskPercentage: number;
  entryPrice: number;
  stopLossPrice: number;
  takeProfitPrice: number;
  lotSize: number;
  pairSymbol: string;
  accountCurrency: string;
}

interface TradingContextType {
  state: TradingState;
  setState: (updates: Partial<TradingState>) => void;
  resetState: () => void;
}

const DEFAULT_STATE: TradingState = {
  accountBalance: 10000,
  riskPercentage: 1,
  entryPrice: 1.085,
  stopLossPrice: 1.08,
  takeProfitPrice: 1.095,
  lotSize: 0.1,
  pairSymbol: "EURUSD",
  accountCurrency: "USD",
};

const TradingContext = createContext<TradingContextType | null>(null);

export function TradingProvider({ children }: { children: ReactNode }) {
  const [state, setStateRaw] = useState<TradingState>(DEFAULT_STATE);

  const setState = (updates: Partial<TradingState>) => {
    setStateRaw((prev) => ({ ...prev, ...updates }));
  };

  const resetState = () => setStateRaw(DEFAULT_STATE);

  return (
    <TradingContext.Provider value={{ state, setState, resetState }}>
      {children}
    </TradingContext.Provider>
  );
}

export function useTradingContext() {
  const ctx = useContext(TradingContext);
  if (!ctx)
    throw new Error("useTradingContext must be used inside TradingProvider");
  return ctx;
}
