import { useParams, Link, useNavigate } from "react-router-dom";
import { ArrowLeft, Mail, Calendar, Clock, CheckCircle2, RotateCw, FileText, Image as ImageIcon, ArrowRight, Check, PauseCircle, X } from "lucide-react";
import { AppShell } from "@/components/AppShell";
import { candidates, stageBadgeClass } from "@/lib/data";
import { toast } from "sonner";

function ScoreDonut({ value }: { value: number }) {
  const r = 56;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <div className="relative h-36 w-36">
      <svg viewBox="0 0 140 140" className="h-full w-full -rotate-90">
        <circle cx="70" cy="70" r={r} stroke="hsl(var(--secondary))" strokeWidth="12" fill="none" />
        <circle
          cx="70" cy="70" r={r}
          stroke="hsl(var(--warning))" strokeWidth="12" fill="none" strokeLinecap="round"
          strokeDasharray={`${dash} ${c - dash}`}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-semibold tabular-nums leading-none">{value}</span>
        <span className="mt-1 text-xs text-muted-foreground">/ 100</span>
      </div>
    </div>
  );
}

interface RadarPoint { label: string; value: number; benchmark: number; }

function RadarChart({ points }: { points: RadarPoint[] }) {
  const size = 280;
  const cx = size / 2, cy = size / 2;
  const radius = 100;
  const angle = (i: number) => (Math.PI * 2 * i) / points.length - Math.PI / 2;

  const toXY = (i: number, val: number) => {
    const r = (val / 100) * radius;
    return [cx + r * Math.cos(angle(i)), cy + r * Math.sin(angle(i))];
  };

  const polygon = (vals: number[]) => vals.map((v, i) => toXY(i, v).join(",")).join(" ");

  const grid = [25, 50, 75, 100].map((g) =>
    points.map((_, i) => toXY(i, g).join(",")).join(" ")
  );

  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-72 w-72">
      {grid.map((g, i) => (
        <polygon key={i} points={g} fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
      ))}
      {points.map((_, i) => {
        const [x, y] = toXY(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="hsl(var(--border))" strokeWidth="1" />;
      })}
      <polygon
        points={polygon(points.map((p) => p.benchmark))}
        fill="none" stroke="hsl(var(--muted-foreground))" strokeWidth="1.5"
        strokeDasharray="4 4" opacity="0.7"
      />
      <polygon
        points={polygon(points.map((p) => p.value))}
        fill="hsl(var(--primary))" fillOpacity="0.18"
        stroke="hsl(var(--primary))" strokeWidth="2"
      />
      {points.map((p, i) => {
        const [x, y] = toXY(i, p.value);
        return <circle key={i} cx={x} cy={y} r="3.5" fill="hsl(var(--primary))" stroke="hsl(var(--card))" strokeWidth="2" />;
      })}
      {points.map((p, i) => {
        const [x, y] = toXY(i, 118);
        return (
          <g key={p.label}>
            <text x={x} y={y - 4} textAnchor="middle" fontSize="11" fontWeight="600" fill="hsl(var(--foreground))">
              {p.label}
            </text>
            <text x={x} y={y + 9} textAnchor="middle" fontSize="10" fill="hsl(var(--muted-foreground))">
              {p.value}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

const CandidateDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const candidate = candidates.find((c) => c.id === id) ?? candidates[1]; // default Thu Huong

  const decide = (verdict: "Advance" | "Hold" | "Reject") => {
    if (verdict === "Advance") toast.success(`${candidate.name} advanced`, { description: "Moved to next stage. Candidate will be notified." });
    else if (verdict === "Hold") toast(`${candidate.name} placed on hold`, { description: "Decision logged. Revisit when ready." });
    else toast.error(`${candidate.name} rejected`, { description: "Rejection logged. Candidate will receive a courteous email." });
    setTimeout(() => navigate("/"), 900);
  };

  const radarPoints: RadarPoint[] = [
    { label: "Task Accuracy",   value: candidate.competencies.taskAccuracy,   benchmark: 75 },
    { label: "Soft Skills",     value: candidate.competencies.softSkills,     benchmark: 70 },
    { label: "Speed",           value: candidate.competencies.speed,          benchmark: 72 },
    { label: "Communication",   value: candidate.competencies.communication,  benchmark: 70 },
    { label: "Problem Solving", value: 77,                                    benchmark: 73 },
  ];

  const initial = candidate.name.charAt(0);

  return (
    <AppShell title="Candidate Review">
      <div className="mx-auto max-w-[1400px] animate-fade-in">
        <Link
          to="/"
          className="mb-4 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" /> Back to dashboard
        </Link>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
          {/* LEFT 60% */}
          <div className="flex flex-col gap-6 lg:col-span-3">
            {/* Header card */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex items-start gap-5">
                <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-funnel-3 to-funnel-4 text-2xl font-semibold text-primary-foreground">
                  {initial}
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-h1">{candidate.name}</h2>
                    <span className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-medium ${stageBadgeClass(candidate.stage)}`}>
                      {candidate.stage}
                    </span>
                  </div>
                  <div className="mt-1 text-sm text-muted-foreground">{candidate.role}</div>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="inline-flex items-center gap-1.5"><Mail className="h-3.5 w-3.5" />{candidate.email}</span>
                    <span className="inline-flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Completed Apr 20, 2026</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Score + Radar */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex shrink-0 flex-col items-center gap-3 md:w-56">
                  <ScoreDonut value={candidate.score} />
                  <div className="text-center">
                    <div className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Overall score</div>
                    <div className="mt-1 text-xs text-muted-foreground">
                      Role benchmark: <span className="font-semibold text-foreground">70</span>
                    </div>
                    <div className="mt-1 inline-flex items-center gap-1 rounded bg-warning-soft px-2 py-0.5 text-xs font-medium text-warning">
                      Just above threshold
                    </div>
                  </div>
                </div>

                <div className="flex flex-1 flex-col items-center">
                  <div className="mb-2 self-start">
                    <h3 className="text-h2">Competency profile</h3>
                    <p className="text-xs text-muted-foreground">Candidate vs role benchmark</p>
                  </div>
                  <RadarChart points={radarPoints} />
                  <div className="mt-2 flex items-center gap-5 text-xs">
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-2.5 w-2.5 rounded-sm bg-primary" /> Candidate
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <span className="h-0.5 w-3 border-t border-dashed border-muted-foreground" /> Benchmark
                    </span>
                  </div>
                </div>
              </div>

              {/* Sim stats chips */}
              <div className="mt-6 flex flex-wrap gap-2 border-t border-border pt-5">
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">
                  <Clock className="h-3.5 w-3.5 text-muted-foreground" /> Time spent: <span className="text-foreground">38 min</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">
                  <CheckCircle2 className="h-3.5 w-3.5 text-success" /> Tasks completed: <span className="text-foreground">4 / 4</span>
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium">
                  <RotateCw className="h-3.5 w-3.5 text-muted-foreground" /> Attempts: <span className="text-foreground">1</span>
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT 40% */}
          <div className="flex flex-col gap-6 lg:col-span-2">
            {/* AI Feedback */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <div className="flex items-center justify-between">
                <h3 className="text-h2">AI feedback summary</h3>
                <span className="rounded bg-primary-soft px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-accent-foreground">
                  Generated
                </span>
              </div>

              <div className="mt-4 space-y-3">
                <div className="rounded-md border border-border border-l-4 border-l-success bg-success-soft/40 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-success">Strengths</div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    Strong analytical reasoning in task 2. Clear, structured communication in written outputs.
                  </p>
                </div>
                <div className="rounded-md border border-border border-l-4 border-l-warning bg-warning-soft/40 p-3">
                  <div className="text-xs font-semibold uppercase tracking-wider text-warning">Areas for improvement</div>
                  <p className="mt-1 text-sm leading-relaxed text-foreground">
                    Speed below benchmark in task 3. Limited stakeholder management signals.
                  </p>
                </div>
              </div>
            </div>

            {/* Evidence */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="text-h2">Evidence</h3>
              <div className="mt-4 grid grid-cols-2 gap-3">
                <button className="group flex flex-col items-start gap-2 rounded-md border border-border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-soft text-primary">
                    <FileText className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-semibold text-foreground">Task 2 — Written output</div>
                  <div className="text-[11px] text-muted-foreground">DOCX · 2 pages</div>
                </button>
                <button className="group flex flex-col items-start gap-2 rounded-md border border-border bg-background p-3 text-left transition-colors hover:border-primary/40 hover:bg-primary-soft/40">
                  <div className="flex h-10 w-10 items-center justify-center rounded bg-primary-soft text-primary">
                    <ImageIcon className="h-5 w-5" />
                  </div>
                  <div className="text-xs font-semibold text-foreground">Task 3 — Process diagram</div>
                  <div className="text-[11px] text-muted-foreground">PNG · 1.2 MB</div>
                </button>
              </div>
              <button className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80">
                View all evidence <ArrowRight className="h-3 w-3" />
              </button>
            </div>

            {/* Reviewer notes */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="text-h2">Reviewer notes</h3>
              <div className="mt-3 rounded-md border border-border bg-background/60 p-3 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-foreground">Linh Tran</span>
                  <span className="text-muted-foreground">Apr 20, 4:12 PM</span>
                </div>
                <p className="mt-1 text-foreground/80">
                  Solid written analysis. Want to check stakeholder framing in interview round.
                </p>
              </div>
              <textarea
                placeholder="Add your notes here..."
                rows={4}
                className="mt-3 w-full resize-none rounded-md border border-border bg-card p-3 text-sm placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
              />
            </div>

            {/* Decision panel */}
            <div className="rounded-lg border border-border bg-card p-6 shadow-card">
              <h3 className="text-h2">Decision</h3>
              <div className="mt-4 grid grid-cols-3 gap-2">
                <button onClick={() => decide("Advance")} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md bg-success text-sm font-semibold text-success-foreground shadow-card transition-colors hover:bg-success/90">
                  <Check className="h-4 w-4" /> Advance
                </button>
                <button onClick={() => decide("Hold")} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-border bg-card text-sm font-semibold text-foreground transition-colors hover:bg-secondary">
                  <PauseCircle className="h-4 w-4" /> Hold
                </button>
                <button onClick={() => decide("Reject")} className="inline-flex h-11 items-center justify-center gap-1.5 rounded-md border border-danger/30 bg-card text-sm font-semibold text-danger transition-colors hover:bg-danger-soft">
                  <X className="h-4 w-4" /> Reject
                </button>
              </div>
              <p className="mt-3 text-xs text-muted-foreground">
                Decision will be logged and the candidate notified automatically.
              </p>
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
};

export default CandidateDetail;
