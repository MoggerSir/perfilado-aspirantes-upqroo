export const motionDurations = {
  fast: 0.14,
  normal: 0.26,
  slow: 0.48,
  entrance: 0.52,
} as const;

export const motionEases = {
  standard: "power3.out",
  soft: "power2.out",
  exit: "power2.in",
} as const;

export const motionDistances = {
  desktop: 16,
  compact: 10,
} as const;

export const motionScale = 0.985;
export const staggerIntervals = {
  fast: 0.04,
  normal: 0.055,
} as const;

export const MAX_STAGGERED_ELEMENTS = 12;

export function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    typeof window.matchMedia === "function" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function isCompactViewport() {
  return typeof window !== "undefined" && window.innerWidth < 640;
}
