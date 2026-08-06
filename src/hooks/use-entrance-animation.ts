import { useRef, type DependencyList } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  animateEntrance,
  resolveEntranceTargets,
} from "@/animations/entranceAnimations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

export function useEntranceAnimation<T extends HTMLElement>(
  dependencies: DependencyList = [],
) {
  const scope = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      const targets = resolveEntranceTargets(scope.current);
      if (reducedMotion) {
        gsap.set(targets, { clearProps: "all" });
        return;
      }

      animateEntrance(targets);
    },
    {
      scope,
      dependencies: [reducedMotion, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return scope;
}
