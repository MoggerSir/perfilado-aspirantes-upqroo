import { describe, expect, it, vi } from "vitest";
import {
  getImportProgress,
  IMPORT_STAGE_DURATION,
  importSimulationStages,
  waitForImportStage,
} from "@/features/import/import-simulation";

describe("importSimulation", () => {
  it("distribuye el progreso hasta completar todas las etapas", () => {
    expect(getImportProgress(0)).toBe(14);
    expect(getImportProgress(importSimulationStages.length - 1)).toBe(100);
  });

  it("mantiene cada palabra clave el periodo configurado", async () => {
    vi.useFakeTimers();
    const stage = waitForImportStage();

    await vi.advanceTimersByTimeAsync(IMPORT_STAGE_DURATION);
    await expect(stage).resolves.toBeUndefined();
    vi.useRealTimers();
  });
});
