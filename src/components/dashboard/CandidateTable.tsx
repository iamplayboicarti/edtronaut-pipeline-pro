import { Link } from "react-router-dom";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { candidates, scoreColorClass, stageBadgeClass, scoreBgClass } from "@/lib/data";

function Avatar({ name }: { name: string }) {
  const initials = name.split(" ").map((n) => n[0]).slice(0, 2).join("");
  const palette = ["bg-funnel-3", "bg-funnel-4", "bg-funnel-5", "bg-funnel-2", "bg-funnel-6"];
  const color = palette[name.length % palette.length];
  return (
    <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${color} text-xs font-semibold text-primary-foreground`}>
      {initials}
    </div>
  );
}

function CompetencyBars({ values }: { values: number[] }) {
  return (
    <div className="flex items-end gap-1">
      {values.map((v, i) => (
        <div key={i} className="relative h-6 w-2 overflow-hidden rounded-sm bg-secondary">
          <div
            className={`absolute bottom-0 left-0 right-0 ${scoreBgClass(v)}`}
            style={{ height: `${v}%`, opacity: 0.85 }}
          />
        </div>
      ))}
    </div>
  );
}

export function CandidateTable() {
  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div>
          <h2 className="text-h2">Candidates</h2>
          <p className="text-xs text-muted-foreground">248 total · sorted by recent activity</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="w-10 px-5 py-3">
                <input type="checkbox" className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]" />
              </th>
              <th className="py-3 pr-4">Candidate</th>
              <th className="py-3 pr-4">Role</th>
              <th className="py-3 pr-4">Score</th>
              <th className="py-3 pr-4">Competencies</th>
              <th className="py-3 pr-4">Stage</th>
              <th className="py-3 pr-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {candidates.map((c) => {
              const stageBadge = stageBadgeClass(c.stage);
              const isAdvance = c.stage === "Shortlisted";
              const isReview = c.stage === "Awaiting Review" || c.stage === "Sim Completed";
              const noAction = c.stage === "Sim Sent";
              const comp = [c.competencies.taskAccuracy, c.competencies.softSkills, c.competencies.speed, c.competencies.communication];
              return (
                <tr key={c.id} className="border-b border-border last:border-0 transition-colors hover:bg-background/60">
                  <td className="px-5 py-3">
                    <input type="checkbox" className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]" />
                  </td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-3">
                      <Avatar name={c.name} />
                      <div className="leading-tight">
                        <Link to={`/candidates/${c.id}`} className="font-semibold text-foreground hover:text-primary">
                          {c.name}
                        </Link>
                        <div className="text-xs text-muted-foreground">{c.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4">
                    <span className="inline-flex items-center rounded border border-border bg-background px-2 py-0.5 text-xs font-medium text-foreground">
                      {c.role}
                    </span>
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`text-base font-semibold tabular-nums ${scoreColorClass(c.score)}`}>{c.score}</span>
                    <span className="text-xs text-muted-foreground">/100</span>
                  </td>
                  <td className="py-3 pr-4">
                    <CompetencyBars values={comp} />
                  </td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${stageBadge}`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3 pr-5 text-right">
                    {noAction ? (
                      <span className="text-xs text-muted-foreground">—</span>
                    ) : (
                      <Link
                        to={`/candidates/${c.id}`}
                        className={
                          isAdvance
                            ? "inline-flex items-center gap-1 rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground hover:bg-success/90"
                            : isReview
                            ? "inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
                            : "inline-flex items-center gap-1 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
                        }
                      >
                        {isAdvance ? "Advance" : "Review"}
                        <ArrowRight className="h-3 w-3" />
                      </Link>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <span>Showing <span className="font-semibold text-foreground">1–6</span> of <span className="font-semibold text-foreground">248</span></span>
        <div className="flex items-center gap-1">
          <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 font-medium text-foreground hover:bg-secondary disabled:opacity-50" disabled>
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 font-medium text-foreground hover:bg-secondary">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
