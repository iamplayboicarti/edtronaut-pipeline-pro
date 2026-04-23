import { funnelStages } from "@/lib/data";

export function PipelineFunnel() {
  return (
    <section className="rounded-lg border border-border bg-card p-6 shadow-card">
      <div className="mb-5 flex items-end justify-between">
        <div>
          <h2 className="text-h2">Pipeline funnel</h2>
          <p className="text-xs text-muted-foreground">Conversion across hiring stages — last 30 days</p>
        </div>
        <div className="text-xs text-muted-foreground">
          Overall conversion: <span className="font-semibold text-foreground">1.6%</span>
        </div>
      </div>

      <div className="flex w-full items-stretch gap-1.5">
        {funnelStages.map((stage, i) => {
          const prev = i === 0 ? null : funnelStages[i - 1];
          const pct = prev ? Math.round((stage.count / prev.count) * 100) : null;
          // Trapezoid heights narrowing: 96 -> 56
          const top = 96 - i * 8;
          const bottom = top - 12;
          return (
            <div key={stage.label} className="flex flex-1 flex-col items-stretch">
              <div className="relative" style={{ height: 96 }}>
                <svg viewBox="0 0 100 96" preserveAspectRatio="none" className="absolute inset-0 h-full w-full">
                  <polygon
                    points={`0,${(96 - top) / 2} 100,${(96 - bottom) / 2} 100,${96 - (96 - bottom) / 2} 0,${96 - (96 - top) / 2}`}
                    fill={`hsl(var(--${stage.color}))`}
                    opacity={0.92}
                  />
                </svg>
                <div className="relative flex h-full flex-col items-center justify-center text-primary-foreground">
                  <div className="text-[11px] font-medium uppercase tracking-wider opacity-90">
                    {stage.label}
                  </div>
                  <div className="text-2xl font-semibold tabular-nums leading-none">{stage.count}</div>
                </div>
              </div>
              <div className="mt-2 flex items-center justify-center gap-1 text-[11px]">
                {pct !== null ? (
                  <>
                    <span className="font-semibold text-foreground tabular-nums">{pct}%</span>
                    <span className="text-muted-foreground">vs prev</span>
                  </>
                ) : (
                  <span className="text-muted-foreground">Top of funnel</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
