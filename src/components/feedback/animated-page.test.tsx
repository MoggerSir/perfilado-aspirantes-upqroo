import { render } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AnimatedPage } from "@/components/feedback/animated-page";

describe("AnimatedPage", () => {
  it("monta el contenido y limpia la animación al desmontarse", () => {
    vi.mocked(window.matchMedia).mockReturnValue({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    } as unknown as MediaQueryList);

    const { container, unmount } = render(
      <AnimatedPage routeKey="/app">
        <header data-motion-item>Encabezado</header>
        <section data-motion-item>Contenido</section>
      </AnimatedPage>,
    );

    expect(container).toHaveTextContent("Encabezado");
    expect(container).toHaveTextContent("Contenido");
    expect(() => unmount()).not.toThrow();
  });
});
