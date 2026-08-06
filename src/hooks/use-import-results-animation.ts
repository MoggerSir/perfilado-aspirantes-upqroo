import { useRef, type DependencyList } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  animateImportResults,
  resolveImportResultElements,
} from "@/animations/importAnimations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

export function useImportResultsAnimation<T extends HTMLElement>(
  dependencies: DependencyList = [],
) {
  const scope = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      if (reducedMotion) {
        const { heading, metrics, metricContent, panels } =
          resolveImportResultElements(scope.current);
        gsap.set(
          [
            ...(heading ? [heading] : []),
            ...metrics,
            ...metricContent,
            ...panels,
          ],
          { clearProps: "all" },
        );
        return;
      }

      animateImportResults(scope.current);
    },
    {
      scope,
      dependencies: [reducedMotion, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return scope;
}
