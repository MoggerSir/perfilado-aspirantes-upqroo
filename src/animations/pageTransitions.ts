import { prefersReducedMotion } from "@/animations/motionConfig";

export function navigateWithPageTransition(updateRoute: () => void) {
  const startViewTransition = document.startViewTransition?.bind(document);

  if (prefersReducedMotion() || !startViewTransition) {
    updateRoute();
    return;
  }

  startViewTransition(updateRoute);
}
