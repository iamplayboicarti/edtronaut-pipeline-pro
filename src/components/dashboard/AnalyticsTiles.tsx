import { TrendingUp, TrendingDown, Minus } from "lucide-react";

function Donut({ value }: { value: number }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const dash = (value / 100) * c;
  return (
    <svg viewBox="0 0 56 56" className="h-14 w-14 -rotate-90">
      <circle cx="28" cy="28" r={r} stroke="hsl(var(--secondary))" strokeWidth="6" fill="none" />
      <circle
        cx="28" cy="28" r={r}
        stroke="hsl(var(--primary))" strokeWidth="6" fill="none" strokeLinecap="round"
        strokeDasharray={`${dash} ${c - dash}`}
      />
    </svg>
  );
}

function DistributionBars() {
  const heights = [22, 38, 64, 92, 78, 54, 30];
  return (
    <div className="flex h-14 items-end gap-1">
      {heights.map((h, i) => (
        <div
          key={i}
          className={`w-1.5 rounded-sm ${i === 3 ? "bg-primary" : "bg-secondary"}`}
          style={{ height: `${h}%` }}
        />
      ))}
    </div>
  );
}

function Sparkline() {
  const points = [10, 9, 11, 8, 9, 7, 6.4, 6.2];
  const max = Math.max(...points), min = Math.min(...points);
  const path = points
    .map((p, i) => {
      const x = (i / (points.length - 1)) * 100;
      const y = 40 - ((p - min) / (max - min || 1)) * 36 - 2;
      return `${i === 0 ? "M" : "L"}${x},${y}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 100 40" className="h-14 w-24">
      <path d={`${path} L100,40 L0,40 Z`} fill="hsl(var(--success))" opacity="0.12" />
      <path d={path} fill="none" stroke="hsl(var(--success))" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface TileProps {
  label: string;
  value: string;
  delta: string;
  trend: "up" | "down" | "flat";
  visual: React.ReactNode;
}

function Tile({ label, value, delta, trend, visual }: TileProps) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor =
    trend === "up" ? "text-success" : trend === "down" ? "text-success" : "text-muted-foreground";
  return (
    <div className="rounded-lg border border-border bg-card p-5 shadow-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className={`inline-flex items-center gap-1 text-xs font-semibold ${trendColor}`}>
          <TrendIcon className="h-3.5 w-3.5" />
          {delta}
        </span>
      </div>
      <div className="mt-4 flex items-end justify-between gap-4">
        <div className="text-3xl font-semibold tabular-nums tracking-tight">{value}</div>
        <div className="shrink-0">{visual}</div>
      </div>
    </div>
  );
}

export function AnalyticsTiles() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
      <Tile
        label="Simulation completion rate"
        value="79%"
        delta="+5% vs last month"
        trend="up"
        visual={<Donut value={79} />}
      />
      <Tile
        label="Average simulation score"
        value="68/100"
        delta="stable"
        trend="flat"
        visual={<DistributionBars />}
      />
      <Tile
        label="Time to shortlist"
        value="6.2d"
        delta="-1.4d vs last month"
        trend="down"
        visual={<Sparkline />}
      />
    </div>
  );
}
