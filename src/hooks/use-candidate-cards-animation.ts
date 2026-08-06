import { useRef, type DependencyList } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import {
  animateCandidateCards,
  resolveCandidateCards,
  resolveCandidateContent,
} from "@/animations/candidateAnimations";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

gsap.registerPlugin(useGSAP);

export function useCandidateCardsAnimation<T extends HTMLElement>(
  dependencies: DependencyList = [],
) {
  const scope = useRef<T>(null);
  const reducedMotion = useReducedMotion();

  useGSAP(
    () => {
      if (!scope.current) return;

      const cards = resolveCandidateCards(scope.current);
      if (reducedMotion) {
        gsap.set([...cards, ...resolveCandidateContent(cards)], {
          clearProps: "all",
        });
        return;
      }

      animateCandidateCards(scope.current);
    },
    {
      scope,
      dependencies: [reducedMotion, ...dependencies],
      revertOnUpdate: true,
    },
  );

  return scope;
}
