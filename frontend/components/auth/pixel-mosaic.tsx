// Deterministic static mosaic — no client-side randomness, safe for SSR/SSG.
// Intensity values [0-1]: higher = brighter/accent tile.
const GRID: number[] = [
  0.1, 0.3, 0.15, 0.4, 0.2, 0.6, 0.3, 0.1,
  0.2, 0.5, 0.7,  0.3, 0.8, 0.4, 0.2, 0.3,
  0.4, 0.2, 0.8,  0.6, 0.3, 0.7, 0.5, 0.2,
  0.3, 0.7, 0.4,  0.9, 0.5, 0.2, 0.8, 0.4,
  0.6, 0.3, 0.9,  0.4, 0.7, 0.5, 0.3, 0.6,
  0.2, 0.8, 0.5,  0.7, 0.3, 0.9, 0.4, 0.2,
  0.5, 0.4, 0.6,  0.3, 0.8, 0.2, 0.7, 0.5,
  0.3, 0.6, 0.2,  0.8, 0.4, 0.6, 0.3, 0.4,
  0.7, 0.3, 0.5,  0.2, 0.9, 0.4, 0.8, 0.3,
  0.4, 0.7, 0.3,  0.6, 0.2, 0.8, 0.4, 0.6,
  0.2, 0.4, 0.8,  0.5, 0.7, 0.3, 0.6, 0.2,
  0.5, 0.2, 0.6,  0.4, 0.8, 0.5, 0.3, 0.7,
];

const COLS = 12;

// Tile styles use design tokens via Tailwind classes where possible.
// The mosaic is decorative art — mid/low tiles use muted surface tones,
// accent tiles surface the primary token.
function tileClass(intensity: number): string {
  if (intensity > 0.8)  return "bg-primary opacity-90 shadow-[0_0_10px_color-mix(in_oklch,var(--primary)_30%,transparent)]";
  if (intensity > 0.65) return "bg-primary/30";
  return "bg-primary/10";
}

export function PixelMosaic() {
  return (
    <div className="absolute inset-0 w-full h-full overflow-hidden bg-background pointer-events-none select-none">
      {/* Radial ambient layer */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_35%,color-mix(in_oklch,var(--primary)_8%,var(--background))_0%,var(--background)_70%)]" />

      {/* Primary-tinted bloom spots */}
      <div className="absolute top-1/3 right-0 w-72 h-72 bg-primary/10 rounded-full blur-[80px]" />
      <div className="absolute bottom-8 left-8 w-80 h-80 bg-primary/5 rounded-full blur-[90px]" />

      {/* Mosaic grid */}
      <div
        className="relative z-[1] w-full h-full p-6 sm:p-10 opacity-60 mix-blend-screen"
        style={{ display: "grid", gridTemplateColumns: `repeat(${COLS}, 1fr)`, gap: "5px" }}
      >
        {GRID.map((intensity, idx) => {
          const col = idx % COLS;
          const row = Math.floor(idx / COLS);
          return (
            <div
              key={idx}
              style={{
                height: `${20 + ((col + row) % 5) * 12}px`,
                opacity: intensity * 0.9,
                alignSelf: "center",
              }}
              className={`w-full rounded-sm ${tileClass(intensity)}`}
            />
          );
        })}
      </div>

      {/* Vignette overlays — use background token so they blend correctly in both modes */}
      <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/50" />
      <div className="absolute inset-0 [background:radial-gradient(ellipse_at_center,transparent_25%,var(--background)_100%)] opacity-75" />
    </div>
  );
}
