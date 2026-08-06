import { act, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useReducedMotion } from "@/hooks/use-reduced-motion";

type MotionListener = (event: MediaQueryListEvent) => void;

function installMotionPreference(initialPreference: boolean) {
  let listener: MotionListener | undefined;
  const mediaQuery = {
    matches: initialPreference,
    media: "(prefers-reduced-motion: reduce)",
    onchange: null,
    addEventListener: vi.fn(
      (_eventName: string, nextListener: MotionListener) => {
        listener = nextListener;
      },
    ),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  };

  vi.mocked(window.matchMedia).mockReturnValue(
    mediaQuery as unknown as MediaQueryList,
  );

  return {
    mediaQuery,
    changePreference(matches: boolean) {
      listener?.({ matches } as MediaQueryListEvent);
    },
  };
}

describe("useReducedMotion", () => {
  afterEach(() => vi.clearAllMocks());

  it("lee y actualiza la preferencia del sistema", () => {
    const motionPreference = installMotionPreference(true);
    const { result, unmount } = renderHook(() => useReducedMotion());

    expect(result.current).toBe(true);
    act(() => motionPreference.changePreference(false));
    expect(result.current).toBe(false);

    unmount();
    expect(motionPreference.mediaQuery.removeEventListener).toHaveBeenCalled();
  });
});
