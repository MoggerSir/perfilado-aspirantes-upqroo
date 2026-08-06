import gsap from "gsap";
import { isCompactViewport, motionEases } from "@/animations/motionConfig";

const CARD_SELECTOR = "[data-candidate-card]";
const CONTENT_SELECTOR = "[data-candidate-content]";

export const candidateAnimationTimings = {
  cardDuration: 0.68,
  overlapRatio: 0.5,
  contentStartRatio: 0.5,
  contentDuration: 0.36,
  contentStagger: 0.065,
} as const;

export function resolveCandidateCards(container: HTMLElement) {
  return Array.from(container.querySelectorAll<HTMLElement>(CARD_SELECTOR));
}

export function resolveCandidateContent(cards: HTMLElement[]) {
  return cards.flatMap((card) =>
    Array.from(card.querySelectorAll<HTMLElement>(CONTENT_SELECTOR)),
  );
}

export function getCandidateCardStart(cardIndex: number) {
  return (
    cardIndex *
    candidateAnimationTimings.cardDuration *
    (1 - candidateAnimationTimings.overlapRatio)
  );
}

export function getCandidateContentStart(cardIndex: number) {
  return (
    getCandidateCardStart(cardIndex) +
    candidateAnimationTimings.cardDuration *
      candidateAnimationTimings.contentStartRatio
  );
}

export function getCandidateSequenceDuration(cardCount: number) {
  if (cardCount <= 0) return 0;
  return (
    getCandidateCardStart(cardCount - 1) +
    candidateAnimationTimings.cardDuration
  );
}

export function animateCandidateCards(container: HTMLElement) {
  const cards = resolveCandidateCards(container);
  if (cards.length === 0) return undefined;

  const compact = isCompactViewport();
  const allContent = resolveCandidateContent(cards);
  const timeline = gsap.timeline();

  gsap.set(cards, {
    autoAlpha: 0,
    x: compact ? 30 : 48,
    scale: 0.992,
  });
  gsap.set(allContent, {
    autoAlpha: 0,
    x: compact ? 4 : 7,
    y: compact ? 6 : 9,
  });

  cards.forEach((card, cardIndex) => {
    const cardContent = Array.from(
      card.querySelectorAll<HTMLElement>(CONTENT_SELECTOR),
    );

    timeline.to(
      card,
      {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        duration: candidateAnimationTimings.cardDuration,
        ease: motionEases.standard,
        clearProps: "opacity,transform,visibility",
      },
      getCandidateCardStart(cardIndex),
    );

    timeline.to(
      cardContent,
      {
        autoAlpha: 1,
        x: 0,
        y: 0,
        duration: candidateAnimationTimings.contentDuration,
        stagger: candidateAnimationTimings.contentStagger,
        ease: motionEases.soft,
        clearProps: "opacity,transform,visibility",
      },
      getCandidateContentStart(cardIndex),
    );
  });

  return timeline;
}
