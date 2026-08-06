import { describe, expect, it } from "vitest";
import { filterCandidates } from "@/core/domain/filter-candidates";
import { candidates } from "@/data/mock-data";

describe("filterCandidates", () => {
  it("combina texto, estado y lote sobre la copia conservada", () => {
    const matches = filterCandidates(candidates, {
      search: "lenguas modernas",
      status: "En evaluación",
      batchId: "lote-2026-03",
    });

    expect(matches.map((candidate) => candidate.id)).toEqual(["asp-001"]);
  });

  it("devuelve todos los registros cuando no hay restricciones", () => {
    const matches = filterCandidates(candidates, {
      search: "",
      status: "Todos",
      batchId: "Todos",
    });

    expect(matches).toHaveLength(candidates.length);
  });
});
