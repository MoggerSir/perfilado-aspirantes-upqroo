import { describe, expect, it, vi } from "vitest";
import {
  EvaluateCandidate,
  ImportCandidateFiles,
  SearchCandidates,
} from "./use-cases";
import type {
  CandidateRepository,
  ImportRepository,
} from "@/core/domain/contracts";

describe("EvaluateCandidate", () => {
  const repository: CandidateRepository = {
    findAll: vi.fn(),
    findById: vi.fn(),
    saveEvaluation: vi.fn(
      async (input) =>
        ({ id: input.candidateId, status: input.status }) as never,
    ),
  };
  const useCase = new EvaluateCandidate(repository);

  it("rechaza un descarte sin motivo explicable", () => {
    expect(() =>
      useCase.execute({
        candidateId: "asp-1",
        status: "Perfil no viable",
        observations: "No cumple",
        ratings: { c1: "No cumple" },
      }),
    ).toThrow("motivo claro");
  });

  it("requiere al menos una valoración", () => {
    expect(() =>
      useCase.execute({
        candidateId: "asp-1",
        status: "Perfil viable",
        observations: "Cumple con la evidencia disponible.",
        ratings: {},
      }),
    ).toThrow("al menos un criterio");
  });

  it("delega una evaluación válida al repositorio", async () => {
    await useCase.execute({
      candidateId: "asp-1",
      status: "Perfil viable",
      observations: "Cumple con la evidencia disponible.",
      ratings: { c1: "Cumple" },
    });
    expect(repository.saveEvaluation).toHaveBeenCalledOnce();
  });
});

describe("ImportCandidateFiles", () => {
  const repository: ImportRepository = {
    process: vi.fn(async () => ({
      processed: 1,
      incidents: 0,
      duplicates: 0,
      files: ["cv.pdf"],
      candidatesIdentified: 1,
      previousUniversityExperience: 0,
      minimumRequirementsMet: 1,
      historicalMatches: 0,
      completeProfiles: 1,
      pendingDocuments: 0,
      averageCompleteness: 100,
    })),
  };
  it("acepta cualquier tamaño durante la simulación", async () => {
    const useCase = new ImportCandidateFiles(repository);
    const file = new File(["x"], "expedientes.zip");
    Object.defineProperty(file, "size", { value: 21 * 1024 * 1024 });
    await expect(useCase.execute("lote-1", [file])).resolves.toMatchObject({
      processed: 1,
    });
  });
  it("procesa archivos dentro del límite", async () => {
    const useCase = new ImportCandidateFiles(repository);
    await expect(
      useCase.execute("lote-1", [new File(["cv"], "cv.pdf")]),
    ).resolves.toMatchObject({ processed: 1 });
  });
});

describe("SearchCandidates", () => {
  it("envía los filtros al repositorio", async () => {
    const repository: CandidateRepository = {
      findAll: vi.fn(async () => []),
      findById: vi.fn(),
      saveEvaluation: vi.fn(),
    };
    const filters = {
      search: "Ana",
      status: "Todos" as const,
      batchId: "Todos" as const,
    };
    await new SearchCandidates(repository).execute(filters);
    expect(repository.findAll).toHaveBeenCalledWith(filters);
  });
});
