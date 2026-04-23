import { useState } from "react";
import { ChevronDown, Download, Send, RotateCcw } from "lucide-react";

function Dropdown({ label, value }: { label: string; value: string }) {
  return (
    <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground shadow-card transition-colors hover:bg-secondary">
      <span className="text-muted-foreground">{label}:</span>
      <span>{value}</span>
      <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
    </button>
  );
}

export function FilterBar() {
  const [range, setRange] = useState<[number, number]>([0, 100]);
  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card">
      <Dropdown label="Role" value="All roles" />
      <Dropdown label="Sim status" value="Any" />
      <Dropdown label="Stage" value="All stages" />

      <div className="flex items-center gap-3 rounded-md border border-border bg-background px-3 py-1.5">
        <span className="text-xs font-medium text-muted-foreground">Score range</span>
        <div className="relative h-1.5 w-40 rounded-full bg-secondary">
          <div
            className="absolute h-1.5 rounded-full bg-primary"
            style={{ left: `${range[0]}%`, right: `${100 - range[1]}%` }}
          />
          <button
            className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-card"
            style={{ left: `${range[0]}%` }}
            aria-label="min score"
          />
          <button
            className="absolute -top-1.5 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-primary bg-card shadow-card"
            style={{ left: `${range[1]}%` }}
            aria-label="max score"
          />
        </div>
        <span className="w-14 text-xs font-semibold tabular-nums text-foreground">
          {range[0]}–{range[1]}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={() => setRange([0, 100])}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset filters
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90">
          <Send className="h-3.5 w-3.5" />
          Send simulation
        </button>
        <button className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-secondary">
          <Download className="h-3.5 w-3.5" />
          Export
          <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
        </button>
      </div>
    </div>
  );
}
