import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import {
  CATEGORY_LABELS,
  type PairCategory,
  TRADING_PAIRS,
} from "../utils/tradingPairs";

interface Props {
  value: string;
  onValueChange: (v: string) => void;
  "data-ocid"?: string;
}

export function PairSelector({
  value,
  onValueChange,
  "data-ocid": ocid,
}: Props) {
  const [search, setSearch] = useState("");

  const filtered = TRADING_PAIRS.filter(
    (p) =>
      p.symbol.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()),
  );

  const categories = ["forex", "gold", "crypto", "indices"] as PairCategory[];

  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger
        className="bg-input border-border font-mono text-sm"
        data-ocid={ocid}
      >
        <SelectValue placeholder="Select pair" />
      </SelectTrigger>
      <SelectContent className="bg-popover border-border">
        <div className="px-2 pb-1">
          <input
            type="text"
            placeholder="Search pair..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-2 py-1 text-xs bg-input border border-border rounded text-foreground placeholder:text-muted-foreground outline-none"
          />
        </div>
        {categories.map((cat) => {
          const pairs = filtered.filter((p) => p.category === cat);
          if (pairs.length === 0) return null;
          return (
            <div key={cat}>
              <div className="px-2 py-1 text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                {CATEGORY_LABELS[cat]}
              </div>
              {pairs.map((p) => (
                <SelectItem
                  key={p.symbol}
                  value={p.symbol}
                  className="font-mono text-sm"
                >
                  <span className="font-semibold">{p.symbol}</span>
                  <span className="ml-2 text-xs text-muted-foreground">
                    {p.description}
                  </span>
                </SelectItem>
              ))}
            </div>
          );
        })}
      </SelectContent>
    </Select>
  );
}
