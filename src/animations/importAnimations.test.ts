import { describe, expect, it } from "vitest";
import { resolveImportResultElements } from "@/animations/importAnimations";

describe("resolveImportResultElements", () => {
  it("separa encabezado, métricas, contenido y paneles", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <header data-import-result-heading></header>
      <article data-import-result-card>
        <span data-import-result-content></span>
        <p data-import-result-content></p>
      </article>
      <section data-import-result-panel></section>
    `;

    const result = resolveImportResultElements(container);
    expect(result.heading).not.toBeNull();
    expect(result.metrics).toHaveLength(1);
    expect(result.metricContent).toHaveLength(2);
    expect(result.panels).toHaveLength(1);
  });
});
