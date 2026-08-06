import { act, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { Router } from "@/lib/router-components";
import { ImportPage } from "@/pages/import-page";
import {
  IMPORT_STAGE_DURATION,
  importSimulationStages,
} from "@/features/import/import-simulation";

describe("ImportPage", () => {
  afterEach(() => vi.useRealTimers());

  it("acepta un formato cualquiera y completa toda la simulación", async () => {
    vi.useFakeTimers();
    render(
      <Router>
        <ImportPage />
      </Router>,
    );
    const dropZone = screen.getByRole("button", {
      name: "Arrastrar o seleccionar archivos para simular la importación",
    });
    const unknownFile = new File(["contenido"], "lote.demostracion", {
      type: "application/x-demostracion",
    });

    fireEvent.drop(dropZone, {
      dataTransfer: { files: [unknownFile], dropEffect: "copy" },
    });

    expect(
      screen.getByRole("region", { name: "Procesando expedientes" }),
    ).toBeInTheDocument();
    expect(screen.getByText("Recibiendo archivos")).toBeInTheDocument();

    await act(async () => {
      await vi.advanceTimersByTimeAsync(
        IMPORT_STAGE_DURATION * importSimulationStages.length,
      );
    });

    expect(
      screen.getByRole("heading", {
        name: "El lote ya tiene una primera lectura útil.",
      }),
    ).toBeInTheDocument();
    expect(screen.getByText("18")).toBeInTheDocument();
    expect(screen.getByText("lote.demostracion")).toBeInTheDocument();
  });
});
