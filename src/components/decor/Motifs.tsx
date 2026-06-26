/**
 * Decorative line-art motifs (no image asset). Stroke uses currentColor — set
 * color/size/opacity via className, e.g. "w-16 text-yellow-600/15".
 * Meant as faint background accents (pointer-events-none, behind content).
 */

type MotifProps = { className?: string };

const common = {
  viewBox: "0 0 64 64",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 2,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
  "aria-hidden": true as const,
};

/** Stacked coins */
export function CoinMotif({ className = "" }: MotifProps) {
  return (
    <svg {...common} className={className}>
      <ellipse cx="32" cy="18" rx="18" ry="8" />
      <path d="M14 18v10c0 4.4 8.1 8 18 8s18-3.6 18-8V18" />
      <path d="M14 28v10c0 4.4 8.1 8 18 8s18-3.6 18-8V28" />
      <path d="M28 16h8M30 13l-2 6" />
    </svg>
  );
}

/** Office building */
export function BuildingMotif({ className = "" }: MotifProps) {
  return (
    <svg {...common} className={className}>
      <rect x="14" y="12" width="24" height="42" rx="1.5" />
      <rect x="38" y="26" width="14" height="28" rx="1.5" />
      <path d="M20 20h4M28 20h4M20 28h4M28 28h4M20 36h4M28 36h4M43 34h4M43 42h4" />
      <path d="M10 54h44" />
    </svg>
  );
}

/** Document with lines */
export function DocumentMotif({ className = "" }: MotifProps) {
  return (
    <svg {...common} className={className}>
      <path d="M18 8h20l10 10v36a2 2 0 0 1-2 2H18a2 2 0 0 1-2-2V10a2 2 0 0 1 2-2Z" />
      <path d="M38 8v10h10" />
      <path d="M23 30h18M23 38h18M23 46h12" />
    </svg>
  );
}

/** Pie / analytics */
export function ChartMotif({ className = "" }: MotifProps) {
  return (
    <svg {...common} className={className}>
      <circle cx="32" cy="32" r="20" />
      <path d="M32 12v20l14 10" />
    </svg>
  );
}
