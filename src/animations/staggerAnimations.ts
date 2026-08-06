import gsap from "gsap";
import {
  isCompactViewport,
  MAX_STAGGERED_ELEMENTS,
  motionDistances,
  motionDurations,
  motionEases,
  staggerIntervals,
} from "@/animations/motionConfig";

export function animateStaggeredItems(container: HTMLElement) {
  const targets = Array.from(container.children)
    .filter((child): child is HTMLElement => child instanceof HTMLElement)
    .slice(0, MAX_STAGGERED_ELEMENTS);

  if (targets.length === 0) return undefined;

  const compact = isCompactViewport();
  return gsap.fromTo(
    targets,
    { autoAlpha: 0, y: compact ? 8 : motionDistances.compact },
    {
      autoAlpha: 1,
      y: 0,
      duration: compact ? motionDurations.normal : motionDurations.slow,
      stagger: compact ? staggerIntervals.fast : staggerIntervals.normal,
      ease: motionEases.soft,
      clearProps: "opacity,transform,visibility",
    },
  );
}
