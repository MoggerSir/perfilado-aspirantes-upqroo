import { useRef, type DependencyList } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { animateStaggeredItems } from "@/animations/staggerAnimations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

export function useStaggerAnimation<T extends HTMLElement>(
  dependencies: DependencyList = [],
) {
  const scope = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      if (reducedMotion) {
        gsap.set(scope.current.children, { clearProps: "all" });
        return;
      }

      animateStaggeredItems(scope.current);
    },
    {
      scope,
      dependencies: [reducedMotion, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return scope;
}
