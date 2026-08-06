import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";

const browser = await chromium.launch({ headless: true });
const findings = [];
const routeDurations = [];

async function auditAccessibility(page, label) {
  const accessibility = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();

  for (const violation of accessibility.violations) {
    const affectedTargets = violation.nodes
      .flatMap((node) => node.target)
      .join(", ");
    findings.push(
      `${label}: accesibilidad ${violation.id} (${violation.nodes.length} nodos: ${affectedTargets})`,
    );
  }
}

async function dropDemoFile(page, filename) {
  await page.evaluate((demoFilename) => {
    const dropZone = document.querySelector(
      '[aria-label="Arrastrar o seleccionar archivos para simular la importación"]',
    );
    if (!dropZone) throw new Error("No se encontró la zona de importación");

    const transfer = new DataTransfer();
    transfer.items.add(
      new File(["demostración"], demoFilename, {
        type: "application/x-demostracion",
      }),
    );
    dropZone.dispatchEvent(
      new DragEvent("dragenter", { bubbles: true, dataTransfer: transfer }),
    );
    dropZone.dispatchEvent(
      new DragEvent("drop", { bubbles: true, dataTransfer: transfer }),
    );
  }, filename);
}

const warmedContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const warmedPage = await warmedContext.newPage();
warmedPage.on("pageerror", (error) =>
  findings.push(`espacio precargado: ${error.message}`),
);
await warmedPage.goto("http://127.0.0.1:5173/acceso", {
  waitUntil: "networkidle",
});
await warmedPage
  .getByRole("button", { name: "Entrar a la demostración" })
  .click();
await warmedPage.waitForURL("**/app");
await warmedPage.waitForTimeout(320);
const scriptsAfterLogin = await warmedPage.evaluate(
  () =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.initiatorType === "script").length,
);

for (const route of [
  { link: "Aspirantes", pathname: "/app/aspirantes", heading: "Aspirantes" },
  {
    link: "Evaluación",
    pathname: "/app/evaluacion",
    heading: "Evaluación de aspirantes",
  },
  {
    link: "Bitácora",
    pathname: "/app/bitacora",
    heading: "Bitácora de actividad",
  },
]) {
  const startedAt = performance.now();
  await warmedPage.getByRole("link", { name: route.link, exact: true }).click();
  await warmedPage.waitForURL(`**${route.pathname}`);
  await warmedPage
    .getByRole("heading", { name: route.heading })
    .waitFor({ state: "attached" });
  routeDurations.push(performance.now() - startedAt);

  if (await warmedPage.getByText("Preparando la vista…").isVisible()) {
    findings.push(`${route.pathname}: apareció el fallback de carga`);
  }

  if (route.pathname === "/app/aspirantes") {
    const motionSamples = [];
    for (let sampleIndex = 0; sampleIndex < 12; sampleIndex += 1) {
      await warmedPage.waitForTimeout(40);
      motionSamples.push(
        await warmedPage.evaluate(() => ({
          totalCards: document.querySelectorAll("[data-candidate-card]").length,
          visibleCards: Array.from(
            document.querySelectorAll("[data-candidate-card]"),
          ).filter((card) => Number(getComputedStyle(card).opacity) > 0.02)
            .length,
          visibleContent: Array.from(
            document.querySelectorAll("[data-candidate-content]"),
          ).filter(
            (content) => Number(getComputedStyle(content).opacity) > 0.02,
          ).length,
        })),
      );
    }
    const hasLateralEntrance = motionSamples.some(
      (sample) =>
        sample.totalCards > 0 &&
        sample.visibleCards > 0 &&
        sample.visibleCards < sample.totalCards &&
        sample.visibleContent === 0,
    );
    if (!hasLateralEntrance) {
      findings.push(
        `aspirantes: la fase de entrada lateral no es perceptible (${JSON.stringify(motionSamples)})`,
      );
    }

    const overlapState = await warmedPage.evaluate(() => ({
      visibleCards: Array.from(
        document.querySelectorAll("[data-candidate-card]"),
      ).filter((card) => Number(getComputedStyle(card).opacity) > 0.02).length,
      visibleContent: Array.from(
        document.querySelectorAll("[data-candidate-content]"),
      ).filter((content) => Number(getComputedStyle(content).opacity) > 0.02)
        .length,
    }));
    if (overlapState.visibleCards < 2 || overlapState.visibleContent === 0) {
      findings.push(
        "aspirantes: no se solaparon tarjeta siguiente y contenido anterior",
      );
    }
    await warmedPage.screenshot({
      path: "visual-audit/desktop-aspirantes-solapadas.png",
      fullPage: false,
    });

    await warmedPage.waitForTimeout(2200);
    const hiddenFinalContent = await warmedPage
      .locator("[data-candidate-content]")
      .evaluateAll(
        (contents) =>
          contents.filter(
            (content) => getComputedStyle(content).visibility === "hidden",
          ).length,
      );
    if (hiddenFinalContent > 0) {
      findings.push("aspirantes: quedó contenido oculto después de la cascada");
    }
    await warmedPage.screenshot({
      path: "visual-audit/desktop-aspirantes-cascada-final.png",
      fullPage: false,
    });
  }
  await warmedPage.waitForTimeout(320);
}
const scriptsAfterNavigation = await warmedPage.evaluate(
  () =>
    performance
      .getEntriesByType("resource")
      .filter((entry) => entry.initiatorType === "script").length,
);
if (scriptsAfterNavigation !== scriptsAfterLogin) {
  findings.push("navegación precargada: se solicitaron módulos adicionales");
}
await warmedContext.close();

const mobileContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const mobilePage = await mobileContext.newPage();
mobilePage.on("pageerror", (error) => findings.push(`móvil: ${error.message}`));
await mobilePage.goto("http://127.0.0.1:5173/app", {
  waitUntil: "networkidle",
});
await mobilePage.getByRole("button", { name: "Abrir menú" }).click();
await mobilePage.waitForTimeout(350);
await auditAccessibility(mobilePage, "drawer móvil abierto");
await mobilePage.screenshot({
  path: "visual-audit/mobile-drawer-abierto.png",
  fullPage: false,
});
await mobilePage.keyboard.press("Escape");
await mobilePage.waitForTimeout(320);
if (
  (await mobilePage.locator(":focus").getAttribute("id")) !==
  "mobile-menu-trigger"
) {
  findings.push("drawer móvil: el foco no volvió al botón de apertura");
}
await mobileContext.close();

const desktopContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const desktopPage = await desktopContext.newPage();
desktopPage.on("pageerror", (error) =>
  findings.push(`escritorio: ${error.message}`),
);
await desktopPage.goto("http://127.0.0.1:5173/app/documentos", {
  waitUntil: "networkidle",
});
await desktopPage.getByRole("button", { name: "Generar documento" }).click();
await desktopPage.waitForTimeout(350);
await auditAccessibility(desktopPage, "modal de documento abierto");
await desktopPage.screenshot({
  path: "visual-audit/desktop-modal-documento.png",
  fullPage: false,
});
await desktopPage.keyboard.press("Escape");

await desktopPage.getByRole("link", { name: "Aspirantes" }).click();
await desktopPage.waitForURL("**/app/aspirantes");
await desktopPage.getByRole("link", { name: "Evaluación" }).click();
await desktopPage.waitForURL("**/app/evaluacion");
await desktopPage.getByRole("link", { name: "Historial" }).click();
await desktopPage.waitForURL("**/app/historial");
await desktopPage.waitForTimeout(1100);
await desktopContext.close();

const importContext = await browser.newContext({
  viewport: { width: 1440, height: 1000 },
});
const importPage = await importContext.newPage();
importPage.on("pageerror", (error) =>
  findings.push(`importación simulada: ${error.message}`),
);
await importPage.goto("http://127.0.0.1:5173/app/importar", {
  waitUntil: "networkidle",
});
await importPage.waitForTimeout(1200);
await dropDemoFile(importPage, "lote-coordinacion.archivo");
await importPage
  .getByRole("region", { name: "Procesando expedientes" })
  .waitFor();
await importPage.waitForTimeout(1900);
if (!(await importPage.getByText("Extrayendo información").isVisible())) {
  findings.push("importación simulada: no avanzaron las palabras clave");
}
await importPage.screenshot({
  path: "visual-audit/desktop-importacion-procesando.png",
  fullPage: false,
});
await importPage
  .getByRole("heading", {
    name: "El lote ya tiene una primera lectura útil.",
  })
  .waitFor({ timeout: 8000 });
await importPage.waitForTimeout(1800);
await auditAccessibility(importPage, "resultados de importación simulada");
if (!(await importPage.getByText("lote-coordinacion.archivo").isVisible())) {
  findings.push(
    "importación simulada: no conservó la trazabilidad del archivo",
  );
}
await importPage.screenshot({
  path: "visual-audit/desktop-importacion-resultados.png",
  fullPage: false,
});
await importContext.close();

const mobileImportContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
});
const mobileImportPage = await mobileImportContext.newPage();
mobileImportPage.on("pageerror", (error) =>
  findings.push(`importación móvil: ${error.message}`),
);
await mobileImportPage.goto("http://127.0.0.1:5173/app/importar", {
  waitUntil: "networkidle",
});
await mobileImportPage.waitForTimeout(1200);
await dropDemoFile(mobileImportPage, "expedientes-movil.zip");
await mobileImportPage
  .getByRole("region", { name: "Procesando expedientes" })
  .waitFor();
await mobileImportPage.waitForTimeout(1900);
await mobileImportPage.screenshot({
  path: "visual-audit/mobile-importacion-procesando.png",
  fullPage: false,
});
await mobileImportPage
  .getByRole("heading", {
    name: "El lote ya tiene una primera lectura útil.",
  })
  .waitFor({ timeout: 8000 });
await mobileImportPage.waitForTimeout(1800);
await auditAccessibility(mobileImportPage, "resultados de importación móvil");
const mobileImportOverflows = await mobileImportPage.evaluate(
  () => document.documentElement.scrollWidth > window.innerWidth + 1,
);
if (mobileImportOverflows) {
  findings.push("importación móvil: existe desbordamiento horizontal");
}
await mobileImportPage.screenshot({
  path: "visual-audit/mobile-importacion-resultados.png",
  fullPage: false,
});
await mobileImportContext.close();

const reducedMotionContext = await browser.newContext({
  viewport: { width: 390, height: 844 },
  reducedMotion: "reduce",
});
const reducedMotionPage = await reducedMotionContext.newPage();
await reducedMotionPage.goto("http://127.0.0.1:5173/acceso", {
  waitUntil: "networkidle",
});
const hiddenMotionItems = await reducedMotionPage
  .locator("[data-motion-item]")
  .evaluateAll(
    (elements) =>
      elements.filter((element) => {
        const style = getComputedStyle(element);
        return style.visibility === "hidden" || Number(style.opacity) < 0.99;
      }).length,
  );
if (hiddenMotionItems > 0) {
  findings.push(
    `movimiento reducido: ${hiddenMotionItems} elementos quedaron ocultos`,
  );
}
await reducedMotionContext.close();

await browser.close();

if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Interacciones validadas: drawer, modal, foco, navegación precargada (${Math.max(...routeDurations).toFixed(0)} ms máximo) y movimiento reducido.`,
  );
}
