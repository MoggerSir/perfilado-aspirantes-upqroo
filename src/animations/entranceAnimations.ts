import gsap from "gsap";
import {
  isCompactViewport,
  MAX_STAGGERED_ELEMENTS,
  motionDistances,
  motionDurations,
  motionEases,
  motionScale,
  staggerIntervals,
} from "@/animations/motionConfig";

const MOTION_ITEM_SELECTOR = "[data-motion-item]";

export function resolveEntranceTargets(scope: HTMLElement) {
  const targets: HTMLElement[] = [];

  Array.from(scope.children).forEach((child) => {
    if (!(child instanceof HTMLElement)) return;
    if (child.hasAttribute("data-motion-skip")) return;

    const markedDescendants = Array.from(
      child.querySelectorAll<HTMLElement>(MOTION_ITEM_SELECTOR),
    );

    if (markedDescendants.length > 0) targets.push(...markedDescendants);
    else targets.push(child);
  });

  return targets.slice(0, MAX_STAGGERED_ELEMENTS);
}

export function animateEntrance(targets: HTMLElement[]) {
  if (targets.length === 0) return undefined;

  const compact = isCompactViewport();
  return gsap.fromTo(
    targets,
    {
      autoAlpha: 0,
      y: compact ? motionDistances.compact : motionDistances.desktop,
      scale: motionScale,
    },
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: compact
        ? motionDurations.slow - 0.08
        : motionDurations.entrance,
      stagger: compact ? staggerIntervals.fast : staggerIntervals.normal,
      ease: motionEases.standard,
      clearProps: "opacity,transform,visibility",
    },
  );
}
