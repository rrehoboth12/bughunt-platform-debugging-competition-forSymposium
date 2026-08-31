import { cn } from "@/lib/utils";

export function BrandMark({ className }: { className?: string }) {
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <span className="relative grid size-9 place-items-center rounded-[var(--radius-sm)] border border-primary/50 bg-primary/10 glow-cyan">
        <span className="font-mono text-xs font-semibold tracking-widest text-primary">BH</span>
      </span>
      <div className="leading-tight">
        <div className="font-display text-sm font-semibold tracking-wide">MIRAI</div>
        <div className="text-[10px] uppercase tracking-[0.18em] text-muted">Bug Hunt</div>
      </div>
    </div>
  );
}

export function GridBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "linear-gradient(to right, color-mix(in oklab, var(--color-primary) 10%, transparent) 1px, transparent 1px), linear-gradient(to bottom, color-mix(in oklab, var(--color-primary) 10%, transparent) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,color-mix(in_oklab,var(--color-primary)_16%,transparent)_0%,var(--color-bg)_70%)]" />
    </div>
  );
}
