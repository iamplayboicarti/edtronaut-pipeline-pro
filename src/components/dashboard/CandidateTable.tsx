import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ArrowUpDown, ChevronLeft, ChevronRight, Search, Send, X, Check } from "lucide-react";
import { candidates, scoreColorClass, stageBadgeClass, scoreBgClass, type Candidate } from "@/lib/data";
import { toast } from "sonner";

type SortKey = "name" | "role" | "score" | "stage";

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

function HeaderCell({ label, sortKey, sort, setSort }: {
  label: string;
  sortKey?: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  setSort: (s: { key: SortKey; dir: "asc" | "desc" }) => void;
}) {
  if (!sortKey) return <th className="py-3 pr-4">{label}</th>;
  const active = sort.key === sortKey;
  return (
    <th className="py-3 pr-4">
      <button
        onClick={() => setSort({ key: sortKey, dir: active && sort.dir === "asc" ? "desc" : "asc" })}
        className={`inline-flex items-center gap-1 transition-colors ${active ? "text-foreground" : "hover:text-foreground"}`}
      >
        {label}
        <ArrowUpDown className={`h-3 w-3 ${active ? "opacity-100" : "opacity-40"}`} />
      </button>
    </th>
  );
}

export function CandidateTable() {
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({ key: "score", dir: "desc" });
  const [selected, setSelected] = useState<Set<string>>(new Set());

  const rows = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = candidates.filter(c =>
      !q || c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q) || c.role.toLowerCase().includes(q)
    );
    const sorted = [...filtered].sort((a, b) => {
      const dir = sort.dir === "asc" ? 1 : -1;
      const av = a[sort.key], bv = b[sort.key];
      if (typeof av === "number" && typeof bv === "number") return (av - bv) * dir;
      return String(av).localeCompare(String(bv)) * dir;
    });
    return sorted;
  }, [query, sort]);

  const allChecked = selected.size > 0 && selected.size === rows.length;
  const someChecked = selected.size > 0 && !allChecked;
  const toggleAll = () => setSelected(allChecked ? new Set() : new Set(rows.map(r => r.id)));
  const toggleOne = (id: string) => {
    const next = new Set(selected);
    next.has(id) ? next.delete(id) : next.add(id);
    setSelected(next);
  };

  const renderAction = (c: Candidate) => {
    if (c.stage === "Sim Sent") return <span className="text-xs text-muted-foreground">—</span>;
    const isAdvance = c.stage === "Shortlisted" || c.stage === "Interviewed";
    return (
      <Link
        to={`/candidates/${c.id}`}
        className={
          isAdvance
            ? "inline-flex items-center gap-1 rounded-md bg-success px-3 py-1.5 text-xs font-semibold text-success-foreground hover:bg-success/90"
            : "inline-flex items-center gap-1 rounded-md border border-border bg-card px-3 py-1.5 text-xs font-semibold text-foreground hover:bg-secondary"
        }
      >
        {isAdvance ? "Advance" : "Review"}
        <ArrowRight className="h-3 w-3" />
      </Link>
    );
  };

  return (
    <section className="overflow-hidden rounded-lg border border-border bg-card shadow-card">
      <div className="flex items-center justify-between gap-4 border-b border-border px-5 py-4">
        <div>
          <h2 className="text-h2">Candidates</h2>
          <p className="text-xs text-muted-foreground">{rows.length} of 248 matching · sorted by {sort.key} ({sort.dir})</p>
        </div>
        <div className="relative w-72 max-w-full">
          <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by name, email, role…"
            className="h-9 w-full rounded-md border border-border bg-background pl-8 pr-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
          />
        </div>
      </div>

      {/* Bulk action bar */}
      {selected.size > 0 && (
        <div className="flex items-center justify-between gap-3 border-b border-border bg-primary-soft/60 px-5 py-2.5 text-sm">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-accent-foreground">{selected.size} selected</span>
            <button onClick={() => setSelected(new Set())} className="text-xs text-muted-foreground hover:text-foreground">
              Clear
            </button>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => { toast.success(`Simulation sent to ${selected.size} candidate(s)`); setSelected(new Set()); }}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/90"
            >
              <Send className="h-3 w-3" /> Send simulation
            </button>
            <button
              onClick={() => { toast.success(`${selected.size} candidate(s) shortlisted`); setSelected(new Set()); }}
              className="inline-flex h-8 items-center gap-1.5 rounded-md bg-success px-3 text-xs font-semibold text-success-foreground hover:bg-success/90"
            >
              <Check className="h-3 w-3" /> Shortlist
            </button>
            <button
              onClick={() => { toast.error(`${selected.size} candidate(s) rejected`); setSelected(new Set()); }}
              className="inline-flex h-8 items-center gap-1.5 rounded-md border border-danger/30 bg-card px-3 text-xs font-semibold text-danger hover:bg-danger-soft"
            >
              <X className="h-3 w-3" /> Reject
            </button>
          </div>
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-border bg-background/60 text-left text-[11px] font-medium uppercase tracking-wider text-muted-foreground">
              <th className="w-10 px-5 py-3">
                <input
                  type="checkbox"
                  checked={allChecked}
                  ref={(el) => { if (el) el.indeterminate = someChecked; }}
                  onChange={toggleAll}
                  className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                />
              </th>
              <HeaderCell label="Candidate" sortKey="name" sort={sort} setSort={setSort} />
              <HeaderCell label="Role" sortKey="role" sort={sort} setSort={setSort} />
              <HeaderCell label="Score" sortKey="score" sort={sort} setSort={setSort} />
              <HeaderCell label="Competencies" sort={sort} setSort={setSort} />
              <HeaderCell label="Stage" sortKey="stage" sort={sort} setSort={setSort} />
              <th className="py-3 pr-5 text-right">Action</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => {
              const comp = [c.competencies.taskAccuracy, c.competencies.softSkills, c.competencies.speed, c.competencies.communication];
              const isSel = selected.has(c.id);
              return (
                <tr
                  key={c.id}
                  className={`border-b border-border last:border-0 transition-colors ${isSel ? "bg-primary-soft/40" : "hover:bg-background/60"}`}
                >
                  <td className="px-5 py-3">
                    <input
                      type="checkbox"
                      checked={isSel}
                      onChange={() => toggleOne(c.id)}
                      className="h-4 w-4 rounded border-border accent-[hsl(var(--primary))]"
                    />
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
                  <td className="py-3 pr-4"><CompetencyBars values={comp} /></td>
                  <td className="py-3 pr-4">
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${stageBadgeClass(c.stage)}`}>
                      {c.stage}
                    </span>
                  </td>
                  <td className="py-3 pr-5 text-right">{renderAction(c)}</td>
                </tr>
              );
            })}
            {rows.length === 0 && (
              <tr><td colSpan={7} className="px-5 py-10 text-center text-sm text-muted-foreground">
                No candidates match your search.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-border px-5 py-3 text-xs text-muted-foreground">
        <span>Showing <span className="font-semibold text-foreground">1–{rows.length}</span> of <span className="font-semibold text-foreground">248</span></span>
        <div className="flex items-center gap-1">
          <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 font-medium text-foreground hover:bg-secondary disabled:opacity-50" disabled>
            <ChevronLeft className="h-3.5 w-3.5" /> Prev
          </button>
          <button className="inline-flex h-7 items-center justify-center rounded-md bg-primary px-2.5 font-semibold text-primary-foreground">1</button>
          <button className="inline-flex h-7 items-center justify-center rounded-md border border-border bg-card px-2.5 font-medium text-foreground hover:bg-secondary">2</button>
          <button className="inline-flex h-7 items-center justify-center rounded-md border border-border bg-card px-2.5 font-medium text-foreground hover:bg-secondary">3</button>
          <span className="px-1">…</span>
          <button className="inline-flex h-7 items-center gap-1 rounded-md border border-border bg-card px-2 font-medium text-foreground hover:bg-secondary">
            Next <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </section>
  );
}
