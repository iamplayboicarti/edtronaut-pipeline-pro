import { AlertTriangle, ArrowRight } from "lucide-react";

export function ActionBanner() {
  return (
    <div className="flex items-center gap-4 overflow-hidden rounded-lg border border-warning/30 border-l-4 border-l-warning bg-warning-soft/60 p-4 shadow-card">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-warning/15 text-warning">
        <AlertTriangle className="h-[18px] w-[18px]" />
      </div>
      <div className="flex-1 text-sm">
        <span className="font-semibold text-foreground">Action required · </span>
        <span className="text-foreground/80">
          <span className="font-semibold text-foreground">3 candidates</span> awaiting review
          <span className="mx-2 text-warning">·</span>
          <span className="font-semibold text-foreground">2 invitations</span> overdue
          <span className="mx-2 text-warning">·</span>
          <span className="font-semibold text-foreground">1 shortlist</span> pending HM approval
        </span>
      </div>
      <button className="group inline-flex items-center gap-1 text-sm font-semibold text-warning hover:text-warning/80">
        View all
        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
