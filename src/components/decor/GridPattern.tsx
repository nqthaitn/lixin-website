import { useId } from "react";

/**
 * Subtle decorative SVG pattern for section backgrounds (no image asset needed).
 * Color comes from the parent's text color — set e.g. `text-yellow-500/10`.
 * Put inside a `relative overflow-hidden` parent with `absolute inset-0`.
 */
export default function GridPattern({
  className = "",
  variant = "dots",
  size = 26,
}: {
  className?: string;
  variant?: "dots" | "grid";
  size?: number;
}) {
  const id = useId();
  return (
    <svg aria-hidden="true" className={className}>
      <defs>
        <pattern id={id} width={size} height={size} patternUnits="userSpaceOnUse">
          {variant === "dots" ? (
            <circle cx={1.5} cy={1.5} r={1.5} fill="currentColor" />
          ) : (
            <path
              d={`M ${size} 0 L 0 0 0 ${size}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={1}
            />
          )}
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#${id})`} />
    </svg>
  );
}
