import { describe, expect, it } from "vitest";
import { MAX_STAGGERED_ELEMENTS } from "@/animations/motionConfig";
import { resolveEntranceTargets } from "@/animations/entranceAnimations";

describe("resolveEntranceTargets", () => {
  it("prioriza los elementos marcados y conserva el orden visual", () => {
    const scope = document.createElement("div");
    scope.innerHTML = `
      <header>
        <p data-motion-item id="eyebrow"></p>
        <h1 data-motion-item id="title"></h1>
      </header>
      <section id="content"></section>
    `;

    expect(resolveEntranceTargets(scope).map((element) => element.id)).toEqual([
      "eyebrow",
      "title",
      "content",
    ]);
  });

  it("limita el stagger para proteger el rendimiento", () => {
    const scope = document.createElement("div");
    Array.from({ length: MAX_STAGGERED_ELEMENTS + 5 }).forEach((_, index) => {
      const element = document.createElement("div");
      element.id = `row-${index}`;
      scope.append(element);
    });

    expect(resolveEntranceTargets(scope)).toHaveLength(MAX_STAGGERED_ELEMENTS);
  });

  it("omite secciones que administran su propia animación", () => {
    const scope = document.createElement("div");
    scope.innerHTML = `
      <section data-motion-skip>
        <article data-motion-item id="candidate"></article>
      </section>
      <section id="regular"></section>
    `;

    expect(resolveEntranceTargets(scope).map((element) => element.id)).toEqual([
      "regular",
    ]);
  });
});
