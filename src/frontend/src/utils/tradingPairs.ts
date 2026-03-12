export type PairCategory = "forex" | "gold" | "crypto" | "indices";

export interface TradingPair {
  symbol: string;
  category: PairCategory;
  contractSize: number;
  pipSize: number;
  pipValuePerLot: number; // in USD per standard lot
  description: string;
}

export const TRADING_PAIRS: TradingPair[] = [
  // Forex Majors
  {
    symbol: "EURUSD",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 10,
    description: "Euro / US Dollar",
  },
  {
    symbol: "GBPUSD",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 10,
    description: "British Pound / US Dollar",
  },
  {
    symbol: "USDJPY",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.01,
    pipValuePerLot: 9.09,
    description: "US Dollar / Japanese Yen",
  },
  {
    symbol: "USDCHF",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 10.92,
    description: "US Dollar / Swiss Franc",
  },
  {
    symbol: "AUDUSD",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 10,
    description: "Australian Dollar / US Dollar",
  },
  {
    symbol: "USDCAD",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 7.5,
    description: "US Dollar / Canadian Dollar",
  },
  {
    symbol: "NZDUSD",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 10,
    description: "New Zealand Dollar / US Dollar",
  },
  {
    symbol: "EURGBP",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.0001,
    pipValuePerLot: 12.5,
    description: "Euro / British Pound",
  },
  {
    symbol: "EURJPY",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.01,
    pipValuePerLot: 9.09,
    description: "Euro / Japanese Yen",
  },
  {
    symbol: "GBPJPY",
    category: "forex",
    contractSize: 100000,
    pipSize: 0.01,
    pipValuePerLot: 9.09,
    description: "British Pound / Japanese Yen",
  },
  // Gold
  {
    symbol: "XAUUSD",
    category: "gold",
    contractSize: 100,
    pipSize: 0.01,
    pipValuePerLot: 1,
    description: "Gold / US Dollar",
  },
  // Crypto
  {
    symbol: "BTCUSDT",
    category: "crypto",
    contractSize: 1,
    pipSize: 1,
    pipValuePerLot: 1,
    description: "Bitcoin / Tether",
  },
  {
    symbol: "ETHUSDT",
    category: "crypto",
    contractSize: 1,
    pipSize: 0.01,
    pipValuePerLot: 1,
    description: "Ethereum / Tether",
  },
  {
    symbol: "BNBUSDT",
    category: "crypto",
    contractSize: 1,
    pipSize: 0.01,
    pipValuePerLot: 1,
    description: "BNB / Tether",
  },
  {
    symbol: "XRPUSDT",
    category: "crypto",
    contractSize: 1,
    pipSize: 0.0001,
    pipValuePerLot: 1,
    description: "Ripple / Tether",
  },
  // Indices
  {
    symbol: "US30",
    category: "indices",
    contractSize: 1,
    pipSize: 1,
    pipValuePerLot: 1,
    description: "Dow Jones Industrial Average",
  },
  {
    symbol: "SPX500",
    category: "indices",
    contractSize: 1,
    pipSize: 0.1,
    pipValuePerLot: 1,
    description: "S&P 500 Index",
  },
  {
    symbol: "NAS100",
    category: "indices",
    contractSize: 1,
    pipSize: 0.1,
    pipValuePerLot: 1,
    description: "NASDAQ 100 Index",
  },
  {
    symbol: "GER40",
    category: "indices",
    contractSize: 1,
    pipSize: 0.1,
    pipValuePerLot: 1,
    description: "DAX 40 Index",
  },
];

export const PAIR_MAP = new Map<string, TradingPair>(
  TRADING_PAIRS.map((p) => [p.symbol, p]),
);

export function getPair(symbol: string): TradingPair {
  return PAIR_MAP.get(symbol) ?? TRADING_PAIRS[0];
}

export const CATEGORY_LABELS: Record<PairCategory, string> = {
  forex: "Forex",
  gold: "Gold",
  crypto: "Crypto",
  indices: "Indices",
};

export const ACCOUNT_CURRENCIES = [
  "USD",
  "EUR",
  "GBP",
  "JPY",
  "AUD",
  "CAD",
  "CHF",
];
