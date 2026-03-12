import { Toaster } from "@/components/ui/sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Activity,
  BookMarked,
  DollarSign,
  LayoutDashboard,
  TrendingUp,
  Wrench,
} from "lucide-react";
import { AdvancedTools } from "./components/AdvancedTools";
import { LotSizeCalculator } from "./components/LotSizeCalculator";
import { ProfitCalculator } from "./components/ProfitCalculator";
import { RiskCalculator } from "./components/RiskCalculator";
import { SavedSetups } from "./components/SavedSetups";
import { TradeSetupPanel } from "./components/TradeSetupPanel";
import { TradingProvider } from "./context/TradingContext";

const NAV_TABS = [
  {
    value: "lot-size",
    label: "Lot Size",
    shortLabel: "Lot Size",
    icon: TrendingUp,
    ocid: "nav.lot_size.tab",
  },
  {
    value: "risk",
    label: "Risk Calc",
    shortLabel: "Risk",
    icon: Activity,
    ocid: "nav.risk.tab",
  },
  {
    value: "profit",
    label: "Profit Calc",
    shortLabel: "Profit",
    icon: DollarSign,
    ocid: "nav.profit.tab",
  },
  {
    value: "trade-setup",
    label: "Trade Setup",
    shortLabel: "Setup",
    icon: LayoutDashboard,
    ocid: "nav.trade_setup.tab",
  },
  {
    value: "advanced",
    label: "Advanced",
    shortLabel: "Adv.",
    icon: Wrench,
    ocid: "nav.advanced.tab",
  },
  {
    value: "saved",
    label: "Saved",
    shortLabel: "Saved",
    icon: BookMarked,
    ocid: "nav.saved.tab",
  },
];

export default function App() {
  return (
    <TradingProvider>
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded bg-primary/20 border border-primary/40 flex items-center justify-center">
                <TrendingUp className="h-4 w-4 text-primary" />
              </div>
              <div>
                <h1 className="font-display font-bold text-base leading-tight text-foreground tracking-tight">
                  TradeCalc <span className="text-primary">Pro</span>
                </h1>
                <p className="text-xs text-muted-foreground leading-none">
                  Forex · Gold · Crypto · Indices
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <div className="hidden sm:flex items-center gap-1.5 px-2 py-1 rounded bg-muted/40 border border-border">
                <span className="w-1.5 h-1.5 rounded-full bg-profit animate-pulse-subtle" />
                <span className="text-xs text-muted-foreground">Live Calc</span>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="max-w-7xl mx-auto px-4 py-4">
          <Tabs defaultValue="lot-size">
            {/* Tab Navigation */}
            <TabsList className="flex w-full mb-4 bg-card border border-border p-1 h-auto gap-0.5 overflow-x-auto">
              {NAV_TABS.map((tab) => (
                <TabsTrigger
                  key={tab.value}
                  value={tab.value}
                  className="flex-1 min-w-0 flex items-center justify-center gap-1.5 py-2 px-2 text-xs data-[state=active]:bg-primary/20 data-[state=active]:text-primary data-[state=active]:shadow-none rounded"
                  data-ocid={tab.ocid}
                >
                  <tab.icon className="h-3.5 w-3.5 shrink-0" />
                  <span className="hidden sm:inline truncate">{tab.label}</span>
                  <span className="sm:hidden">{tab.shortLabel}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            {/* Tab Contents */}
            <div className="bg-card border border-border rounded-lg p-4">
              <TabsContent value="lot-size" className="mt-0">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    Lot Size Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Calculate optimal lot size based on account risk parameters
                  </p>
                </div>
                <LotSizeCalculator />
              </TabsContent>

              <TabsContent value="risk" className="mt-0">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    Risk Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Calculate total risk exposure for a given position
                  </p>
                </div>
                <RiskCalculator />
              </TabsContent>

              <TabsContent value="profit" className="mt-0">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    Profit Calculator
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Estimate expected profit and risk/reward ratio
                  </p>
                </div>
                <ProfitCalculator />
              </TabsContent>

              <TabsContent value="trade-setup" className="mt-0">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    Trade Setup Panel
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Full trade overview with risk/reward visualization
                  </p>
                </div>
                <TradeSetupPanel />
              </TabsContent>

              <TabsContent value="advanced" className="mt-0">
                <div className="mb-3">
                  <h2 className="text-base font-semibold text-foreground">
                    Advanced Tools
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    Position sizing, pip value, margin, and spread calculations
                  </p>
                </div>
                <AdvancedTools />
              </TabsContent>

              <TabsContent value="saved" className="mt-0">
                <SavedSetups />
              </TabsContent>
            </div>
          </Tabs>
        </main>

        {/* Footer */}
        <footer className="border-t border-border mt-8 py-4 px-4">
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
            <span>
              © {new Date().getFullYear()} TradeCalc Pro — Professional Trading
              Calculators
            </span>
            <a
              href={`https://caffeine.ai?utm_source=caffeine-footer&utm_medium=referral&utm_content=${encodeURIComponent(typeof window !== "undefined" ? window.location.hostname : "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground transition-colors"
            >
              Built with ♥ using caffeine.ai
            </a>
          </div>
        </footer>
      </div>
      <Toaster />
    </TradingProvider>
  );
}
