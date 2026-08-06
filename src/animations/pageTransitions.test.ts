import { afterEach, describe, expect, it, vi } from "vitest";
import { navigateWithPageTransition } from "@/animations/pageTransitions";

function setReducedMotionPreference(matches: boolean) {
  vi.mocked(window.matchMedia).mockReturnValue({
    matches,
  } as MediaQueryList);
}

describe("navigateWithPageTransition", () => {
  afterEach(() => {
    vi.restoreAllMocks();
    Reflect.deleteProperty(document, "startViewTransition");
  });

  it("coordina la actualización con View Transitions cuando está disponible", () => {
    setReducedMotionPreference(false);
    const updateRoute = vi.fn();
    const startViewTransition = vi.fn((update: () => void) => update());
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    navigateWithPageTransition(updateRoute);

    expect(startViewTransition).toHaveBeenCalledOnce();
    expect(updateRoute).toHaveBeenCalledOnce();
  });

  it("actualiza de inmediato cuando se solicita reducir movimiento", () => {
    setReducedMotionPreference(true);
    const updateRoute = vi.fn();
    const startViewTransition = vi.fn();
    Object.defineProperty(document, "startViewTransition", {
      configurable: true,
      value: startViewTransition,
    });

    navigateWithPageTransition(updateRoute);

    expect(startViewTransition).not.toHaveBeenCalled();
    expect(updateRoute).toHaveBeenCalledOnce();
  });
});
