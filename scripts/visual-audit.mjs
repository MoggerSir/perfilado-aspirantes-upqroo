import { chromium } from "playwright";
import AxeBuilder from "@axe-core/playwright";
import { mkdir } from "node:fs/promises";

const routes = [
  "/",
  "/acceso",
  "/app",
  "/app/importar",
  "/app/aspirantes",
  "/app/aspirantes/asp-001",
  "/app/evaluacion",
  "/app/historial",
  "/app/documentos",
  "/app/reportes",
  "/app/bitacora",
  "/app/configuracion",
];
const viewports = [
  { name: "desktop", width: 1440, height: 1000 },
  { name: "mobile", width: 390, height: 844 },
];
const findings = [];
await mkdir("visual-audit", { recursive: true });
const browser = await chromium.launch({ headless: true });

for (const viewport of viewports) {
  const context = await browser.newContext({ viewport });
  const page = await context.newPage();
  page.on("console", (message) => {
    if (message.type() === "error")
      findings.push(`${viewport.name} console: ${message.text()}`);
  });
  page.on("pageerror", (error) =>
    findings.push(`${viewport.name} pageerror: ${error.message}`),
  );
  for (const route of routes) {
    await page.goto(`http://127.0.0.1:5173${route}`, {
      waitUntil: "networkidle",
    });
    // Evalúa el estado asentado, no la opacidad transitoria de la entrada.
    await page.waitForTimeout(route === "/app/aspirantes" ? 2700 : 1200);
    const overflow = await page.evaluate(
      () =>
        document.documentElement.scrollWidth -
        document.documentElement.clientWidth,
    );
    if (overflow > 1)
      findings.push(
        `${viewport.name} ${route}: overflow horizontal de ${overflow}px`,
      );
    const accessibility = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
      .analyze();
    for (const violation of accessibility.violations) {
      findings.push(
        `${viewport.name} ${route}: accesibilidad ${violation.id} (${violation.nodes.length} nodos)`,
      );
    }
    const filename =
      route === "/" ? "inicio" : route.replaceAll("/", "-").replace(/^-/, "");
    await page.screenshot({
      path: `visual-audit/${viewport.name}-${filename}.png`,
      fullPage: false,
    });
  }
  await context.close();
}

await browser.close();
if (findings.length > 0) {
  console.error(findings.join("\n"));
  process.exitCode = 1;
} else {
  console.log(
    `Auditoría visual completada: ${routes.length * viewports.length} vistas sin errores de consola, desbordamientos ni violaciones WCAG A/AA detectables.`,
  );
}
