import { cn } from "@/lib/utils";

interface ResultCardProps {
  label: string;
  value: string;
  unit?: string;
  className?: string;
  large?: boolean;
  colorClass?: string;
}

export function ResultCard({
  label,
  value,
  unit,
  className,
  large,
  colorClass,
}: ResultCardProps) {
  return (
    <div
      className={cn(
        "flex flex-col gap-0.5 p-3 rounded bg-muted/40 border border-border",
        className,
      )}
    >
      <span className="text-xs text-muted-foreground uppercase tracking-wider font-medium">
        {label}
      </span>
      <div className="flex items-baseline gap-1">
        <span
          className={cn(
            "num font-bold",
            large ? "text-2xl" : "text-base",
            colorClass ?? "text-foreground",
          )}
        >
          {value}
        </span>
        {unit && (
          <span className="text-xs text-muted-foreground num">{unit}</span>
        )}
      </div>
    </div>
  );
}
