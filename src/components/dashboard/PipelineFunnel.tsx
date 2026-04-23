import { funnelStages } from "@/lib/data";

/**
 * Connected horizontal funnel: 6 trapezoid blocks fused edge-to-edge,
 * each progressively shorter to convey conversion drop-off.
 */
export function PipelineFunnel() {
  // Funnel block dimensions
  const W = 1200;            // total svg width
  const H = 110;              // svg height
  const segW = W / funnelStages.length;
  const maxH = 96;
  const minH = 44;
  // Compute trapezoid edges (left/right heights)
  const edge = (i: number) => maxH - ((maxH - minH) * i) / funnelStages.length;

  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-h2">Pipeline funnel</h2>
          <p className="text-xs text-muted-foreground">Conversion across hiring stages — last 30 days</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Overall conversion:{" "}
          <span className="font-semibold text-foreground">
            {((funnelStages[funnelStages.length - 1].count / funnelStages[0].count) * 100).toFixed(1)}%
          </span>
        </div>
      </div>

      <div className="relative w-full">
        <svg viewBox={`0 0 ${W} ${H}`} preserveAspectRatio="none" className="block h-28 w-full">
          {funnelStages.map((s, i) => {
            const lh = edge(i);
            const rh = edge(i + 1);
            const x = i * segW;
            const cy = H / 2;
            const points = [
              [x,           cy - lh / 2],
              [x + segW,    cy - rh / 2],
              [x + segW,    cy + rh / 2],
              [x,           cy + lh / 2],
            ].map(p => p.join(",")).join(" ");
            return (
              <polygon
                key={s.label}
                points={points}
                fill={`hsl(var(--${s.color}))`}
                stroke="hsl(var(--card))"
                strokeWidth="1"
              />
            );
          })}
        </svg>

        {/* Labels overlay */}
        <div className="pointer-events-none absolute inset-0 grid" style={{ gridTemplateColumns: `repeat(${funnelStages.length}, minmax(0,1fr))` }}>
          {funnelStages.map((s) => (
            <div key={s.label} className="flex flex-col items-center justify-center text-primary-foreground">
              <div className="text-[10px] font-semibold uppercase tracking-wider opacity-95">{s.label}</div>
              <div className="text-2xl font-semibold leading-none tabular-nums">{s.count}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Conversion captions under each segment */}
      <div className="mt-3 grid" style={{ gridTemplateColumns: `repeat(${funnelStages.length}, minmax(0,1fr))` }}>
        {funnelStages.map((s, i) => {
          const prev = i === 0 ? null : funnelStages[i - 1];
          const pct = prev ? Math.round((s.count / prev.count) * 100) : null;
          return (
            <div key={s.label} className="flex items-center justify-center gap-1 text-[11px]">
              {pct !== null ? (
                <>
                  <span className="font-semibold tabular-nums text-foreground">{pct}%</span>
                  <span className="text-muted-foreground">vs prev</span>
                </>
              ) : (
                <span className="text-muted-foreground">Top of funnel</span>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
