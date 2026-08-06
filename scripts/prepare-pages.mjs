import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const outputDirectory = resolve("dist");

await Promise.all([
  copyFile(
    resolve(outputDirectory, "index.html"),
    resolve(outputDirectory, "404.html"),
  ),
  writeFile(resolve(outputDirectory, ".nojekyll"), "", "utf8"),
]);

console.log("GitHub Pages: fallback SPA y .nojekyll preparados.");
