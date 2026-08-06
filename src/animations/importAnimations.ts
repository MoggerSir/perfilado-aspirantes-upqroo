import gsap from "gsap";
import { motionEases } from "@/animations/motionConfig";

const HEADING_SELECTOR = "[data-import-result-heading]";
const METRIC_SELECTOR = "[data-import-result-card]";
const METRIC_CONTENT_SELECTOR = "[data-import-result-content]";
const PANEL_SELECTOR = "[data-import-result-panel]";

export function resolveImportResultElements(container: HTMLElement) {
  const heading = container.querySelector<HTMLElement>(HEADING_SELECTOR);
  const metrics = Array.from(
    container.querySelectorAll<HTMLElement>(METRIC_SELECTOR),
  );
  const metricContent = metrics.flatMap((metric) =>
    Array.from(metric.querySelectorAll<HTMLElement>(METRIC_CONTENT_SELECTOR)),
  );
  const panels = Array.from(
    container.querySelectorAll<HTMLElement>(PANEL_SELECTOR),
  );

  return { heading, metrics, metricContent, panels };
}

export function animateImportResults(container: HTMLElement) {
  const { heading, metrics, metricContent, panels } =
    resolveImportResultElements(container);
  const timeline = gsap.timeline();

  gsap.set(metrics, { autoAlpha: 0, x: 42, scale: 0.988 });
  gsap.set(metricContent, { autoAlpha: 0, y: 9 });
  gsap.set(panels, { autoAlpha: 0, y: 18, scale: 0.992 });

  if (heading) {
    timeline.fromTo(
      heading,
      { autoAlpha: 0, y: 14 },
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.52,
        ease: motionEases.standard,
        clearProps: "opacity,transform,visibility",
      },
    );
  }

  metrics.forEach((metric, metricIndex) => {
    const cardStart = 0.18 + metricIndex * 0.13;
    const content = Array.from(
      metric.querySelectorAll<HTMLElement>(METRIC_CONTENT_SELECTOR),
    );

    timeline.to(
      metric,
      {
        autoAlpha: 1,
        x: 0,
        scale: 1,
        duration: 0.62,
        ease: motionEases.standard,
        clearProps: "opacity,transform,visibility",
      },
      cardStart,
    );
    timeline.to(
      content,
      {
        autoAlpha: 1,
        y: 0,
        duration: 0.34,
        stagger: 0.065,
        ease: motionEases.soft,
        clearProps: "opacity,transform,visibility",
      },
      cardStart + 0.29,
    );
  });

  timeline.to(
    panels,
    {
      autoAlpha: 1,
      y: 0,
      scale: 1,
      duration: 0.55,
      stagger: 0.11,
      ease: motionEases.standard,
      clearProps: "opacity,transform,visibility",
    },
    0.88,
  );

  return timeline;
}
