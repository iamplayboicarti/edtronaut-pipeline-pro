import { useState } from "react";
import { ChevronDown, Download, Send, RotateCcw, FileSpreadsheet, FileText } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ROLES, STAGES, SIM_STATUS } from "@/lib/data";
import { toast } from "sonner";

export function FilterBar() {
  const [range, setRange] = useState<[number, number]>([0, 100]);
  const [role, setRole] = useState("all");
  const [sim, setSim] = useState("Any");
  const [stage, setStage] = useState("all");

  const reset = () => {
    setRange([0, 100]); setRole("all"); setSim("Any"); setStage("all");
    toast("Filters reset");
  };

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card p-3 shadow-card">
      <Select value={role} onValueChange={setRole}>
        <SelectTrigger className="h-9 w-[180px] bg-card text-sm">
          <span className="text-muted-foreground mr-1">Role:</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All roles</SelectItem>
          {ROLES.map(r => <SelectItem key={r} value={r}>{r}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={sim} onValueChange={setSim}>
        <SelectTrigger className="h-9 w-[170px] bg-card text-sm">
          <span className="text-muted-foreground mr-1">Sim status:</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {SIM_STATUS.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <Select value={stage} onValueChange={setStage}>
        <SelectTrigger className="h-9 w-[170px] bg-card text-sm">
          <span className="text-muted-foreground mr-1">Stage:</span>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All stages</SelectItem>
          {STAGES.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>

      <div className="flex h-9 items-center gap-3 rounded-md border border-border bg-background px-3">
        <span className="text-xs font-medium text-muted-foreground">Score</span>
        <Slider
          value={range}
          onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
          min={0}
          max={100}
          step={1}
          className="w-40"
        />
        <span className="w-14 text-xs font-semibold tabular-nums text-foreground">
          {range[0]}–{range[1]}
        </span>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <button
          onClick={reset}
          className="inline-flex h-9 items-center gap-1.5 rounded-md px-2.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset filters
        </button>
        <button
          onClick={() => toast.success("Simulation invitations sent", { description: "Selected candidates will receive an email shortly." })}
          className="inline-flex h-9 items-center gap-2 rounded-md bg-primary px-3.5 text-sm font-semibold text-primary-foreground shadow-card transition-colors hover:bg-primary/90"
        >
          <Send className="h-3.5 w-3.5" />
          Send simulation
        </button>
        <DropdownMenu>
          <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-sm font-medium text-foreground hover:bg-secondary">
            <Download className="h-3.5 w-3.5" />
            Export
            <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => toast.success("Exporting CSV…")}>
              <FileSpreadsheet className="mr-2 h-4 w-4 text-success" /> Export as CSV
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => toast.success("Exporting PDF…")}>
              <FileText className="mr-2 h-4 w-4 text-danger" /> Export as PDF
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
}
