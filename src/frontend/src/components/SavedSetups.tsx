import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { FolderOpen, LogIn, Save, Trash2 } from "lucide-react";
import { useState } from "react";
import type { TradingSetup } from "../backend.d";
import { useTradingContext } from "../context/TradingContext";
import { useInternetIdentity } from "../hooks/useInternetIdentity";
import {
  useDeleteSetup,
  useGetSetups,
  useSaveSetup,
} from "../hooks/useQueries";
import { calcProfit, formatNumber } from "../utils/calculatorUtils";

export function SavedSetups() {
  const { identity, login, loginStatus } = useInternetIdentity();
  const isAuthenticated = !!identity;
  const { state, setState } = useTradingContext();

  const [setupName, setSetupName] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);

  const { data: setups = [], isLoading } = useGetSetups(isAuthenticated);
  const saveMutation = useSaveSetup(isAuthenticated);
  const deleteMutation = useDeleteSetup(isAuthenticated);

  const handleSave = () => {
    if (!setupName.trim()) return;
    const setup: TradingSetup = {
      name: setupName.trim(),
      pairSymbol: state.pairSymbol,
      accountBalance: state.accountBalance,
      accountCurrency: state.accountCurrency,
      riskPercentage: state.riskPercentage,
      entryPrice: state.entryPrice,
      stopLossPrice: state.stopLossPrice,
      takeProfitPrice: state.takeProfitPrice,
      lotSize: state.lotSize,
    };
    saveMutation.mutate(setup, {
      onSuccess: () => {
        setDialogOpen(false);
        setSetupName("");
      },
    });
  };

  const handleLoad = (setup: TradingSetup) => {
    setState({
      pairSymbol: setup.pairSymbol,
      accountBalance: setup.accountBalance,
      accountCurrency: setup.accountCurrency,
      riskPercentage: setup.riskPercentage,
      entryPrice: setup.entryPrice,
      stopLossPrice: setup.stopLossPrice,
      takeProfitPrice: setup.takeProfitPrice,
      lotSize: setup.lotSize,
    });
  };

  return (
    <div className="space-y-4 animate-slide-up">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
            Saved Setups
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            {isAuthenticated
              ? "Synced to cloud"
              : "Stored locally (login to sync)"}
          </p>
        </div>
        <div className="flex gap-2">
          {!isAuthenticated && (
            <Button
              variant="outline"
              size="sm"
              className="border-primary/40 text-primary hover:bg-primary/10"
              onClick={() => login()}
              disabled={loginStatus === "logging-in"}
            >
              <LogIn className="h-3 w-3 mr-1" />
              {loginStatus === "logging-in" ? "Connecting..." : "Login"}
            </Button>
          )}
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="bg-primary/20 text-primary border border-primary/40 hover:bg-primary/30"
                data-ocid="saved_setups.save.button"
              >
                <Save className="h-3 w-3 mr-1" /> Save Current Setup
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-card border-border">
              <DialogHeader>
                <DialogTitle>Save Trading Setup</DialogTitle>
              </DialogHeader>
              <div className="space-y-3 py-2">
                <div className="space-y-1">
                  <Label className="text-xs text-muted-foreground">
                    Setup Name
                  </Label>
                  <Input
                    value={setupName}
                    onChange={(e) => setSetupName(e.target.value)}
                    placeholder="e.g. EURUSD Swing Long"
                    className="bg-input border-border"
                    onKeyDown={(e) => e.key === "Enter" && handleSave()}
                  />
                </div>
                <div className="text-xs text-muted-foreground space-y-0.5">
                  <div>
                    Pair:{" "}
                    <span className="num text-foreground">
                      {state.pairSymbol}
                    </span>
                  </div>
                  <div>
                    Balance:{" "}
                    <span className="num text-foreground">
                      ${formatNumber(state.accountBalance)}
                    </span>
                  </div>
                  <div>
                    Entry:{" "}
                    <span className="num text-foreground">
                      {state.entryPrice}
                    </span>{" "}
                    | SL:{" "}
                    <span className="num text-foreground">
                      {state.stopLossPrice}
                    </span>{" "}
                    | TP:{" "}
                    <span className="num text-foreground">
                      {state.takeProfitPrice}
                    </span>
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-border"
                  onClick={() => setDialogOpen(false)}
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!setupName.trim() || saveMutation.isPending}
                  className="bg-primary text-primary-foreground"
                >
                  {saveMutation.isPending ? "Saving..." : "Save Setup"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* List */}
      {isLoading ? (
        <div
          className="text-center py-8 text-muted-foreground text-sm"
          data-ocid="saved_setups.loading_state"
        >
          Loading setups...
        </div>
      ) : setups.length === 0 ? (
        <div
          className="text-center py-12 border border-dashed border-border rounded-lg"
          data-ocid="saved_setups.empty_state"
        >
          <FolderOpen className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">No saved setups yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Save your current calculator state to recall it later
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {setups.map(([id, setup], idx) => {
            const profit = calcProfit(
              setup.lotSize,
              setup.entryPrice,
              setup.takeProfitPrice,
              setup.pairSymbol,
              setup.stopLossPrice,
            );
            const ocidIdx = idx + 1;
            return (
              <div
                key={id.toString()}
                className="flex items-center gap-3 p-3 rounded-lg border border-border bg-card hover:bg-muted/30 transition-colors"
                data-ocid={`saved_setups.item.${ocidIdx}`}
              >
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-sm truncate">
                      {setup.name}
                    </span>
                    <Badge variant="outline" className="text-xs num shrink-0">
                      {setup.pairSymbol}
                    </Badge>
                  </div>
                  <div className="flex gap-3 mt-0.5">
                    <span className="text-xs text-muted-foreground num">
                      Balance: ${formatNumber(setup.accountBalance)}
                    </span>
                    <span className="text-xs text-muted-foreground num">
                      Entry: {setup.entryPrice}
                    </span>
                    {profit.rrRatio !== null && (
                      <span
                        className={cn(
                          "text-xs num",
                          profit.rrRatio >= 2
                            ? "text-profit"
                            : profit.rrRatio >= 1
                              ? "text-warning-accent"
                              : "text-loss",
                        )}
                      >
                        R:R 1:{formatNumber(profit.rrRatio, 2)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex gap-1 shrink-0">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-primary hover:bg-primary/10"
                    onClick={() => handleLoad(setup)}
                    data-ocid={`saved_setups.load.button.${ocidIdx}`}
                  >
                    <FolderOpen className="h-3 w-3 mr-1" /> Load
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-7 px-2 text-xs text-destructive hover:bg-destructive/10"
                    onClick={() => deleteMutation.mutate(id)}
                    disabled={deleteMutation.isPending}
                    data-ocid={`saved_setups.delete.button.${ocidIdx}`}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
