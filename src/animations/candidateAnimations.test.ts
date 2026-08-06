import { describe, expect, it } from "vitest";
import {
  candidateAnimationTimings,
  getCandidateCardStart,
  getCandidateContentStart,
  getCandidateSequenceDuration,
  resolveCandidateCards,
  resolveCandidateContent,
} from "@/animations/candidateAnimations";

describe("candidateAnimations", () => {
  it("encuentra las tarjetas y sus grupos internos en orden", () => {
    const container = document.createElement("div");
    container.innerHTML = `
      <article data-candidate-card>
        <div data-candidate-content id="first"></div>
        <div data-candidate-content id="second"></div>
      </article>
      <article data-candidate-card>
        <div data-candidate-content id="third"></div>
      </article>
    `;

    const cards = resolveCandidateCards(container);
    expect(cards).toHaveLength(2);
    expect(resolveCandidateContent(cards).map((item) => item.id)).toEqual([
      "first",
      "second",
      "third",
    ]);
  });

  it("solapa cada tarjeta y su contenido exactamente a la mitad", () => {
    const cardMidpoint = candidateAnimationTimings.cardDuration / 2;

    expect(getCandidateCardStart(0)).toBe(0);
    expect(getCandidateCardStart(1) - getCandidateCardStart(0)).toBeCloseTo(
      cardMidpoint,
    );
    expect(getCandidateContentStart(0)).toBeCloseTo(cardMidpoint);
    expect(getCandidateContentStart(1)).toBeCloseTo(
      getCandidateCardStart(1) + cardMidpoint,
    );
    expect(getCandidateSequenceDuration(0)).toBe(0);
    expect(getCandidateSequenceDuration(3)).toBeCloseTo(
      getCandidateCardStart(2) + candidateAnimationTimings.cardDuration,
    );
  });
});
