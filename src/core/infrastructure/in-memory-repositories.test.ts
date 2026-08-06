import { describe, expect, it } from "vitest";
import {
  InMemoryAuditRepository,
  InMemoryCandidateRepository,
  SimulatedImportRepository,
} from "./in-memory-repositories";

describe("InMemoryCandidateRepository", () => {
  it("combina filtros de texto, estado y lote recibido", async () => {
    const repository = new InMemoryCandidateRepository();
    const matches = await repository.findAll({
      search: "Ana",
      status: "En evaluación",
      batchId: "lote-2026-03",
    });
    expect(matches).toHaveLength(1);
    expect(matches[0]?.name).toContain("Ana");
  });

  it("devuelve una lista vacía cuando no hay coincidencias", async () => {
    const repository = new InMemoryCandidateRepository();
    expect(
      await repository.findAll({
        search: "Nombre inexistente",
        status: "Todos",
        batchId: "Todos",
      }),
    ).toEqual([]);
  });

  it("devuelve todos los perfiles cuando no recibe filtros", async () => {
    expect(
      (await new InMemoryCandidateRepository().findAll()).length,
    ).toBeGreaterThan(3);
  });

  it("consulta una copia del expediente por identificador", async () => {
    const repository = new InMemoryCandidateRepository();
    expect((await repository.findById("asp-001"))?.name).toContain("Ana");
    expect(await repository.findById("inexistente")).toBeUndefined();
  });

  it("actualiza estado e historial en una evaluación", async () => {
    const repository = new InMemoryCandidateRepository();
    const updated = await repository.saveEvaluation({
      candidateId: "asp-001",
      status: "Perfil viable",
      observations: "Evidencia suficiente.",
      ratings: { "cri-1": "Cumple" },
    });
    expect(updated.status).toBe("Perfil viable");
    expect(updated.history[0]?.title).toBe("Evaluación registrada");
  });

  it("controla un identificador inexistente al evaluar", async () => {
    await expect(
      new InMemoryCandidateRepository().saveEvaluation({
        candidateId: "no-existe",
        status: "Perfil viable",
        observations: "Evidencia suficiente.",
        ratings: { c1: "Cumple" },
      }),
    ).rejects.toThrow("No se encontró");
  });
});

describe("SimulatedImportRepository", () => {
  it("rechaza una carga vacía", async () => {
    const repository = new SimulatedImportRepository();
    await expect(repository.process("lote-1", [])).rejects.toThrow(
      "al menos un archivo",
    );
  });

  it("requiere un lote recibido", async () => {
    await expect(
      new SimulatedImportRepository().process("", [new File(["cv"], "cv.pdf")]),
    ).rejects.toThrow("lote recibido");
  });

  it("devuelve el mismo escenario demostrativo para cualquier tipo de archivo", async () => {
    const files = [
      new File(["a"], "cv.pdf"),
      new File(["b"], "archivo-protegido.pdf"),
      new File(["c"], "titulo.docx"),
    ];
    await expect(
      new SimulatedImportRepository().process("lote-1", files),
    ).resolves.toMatchObject({
      processed: 54,
      incidents: 3,
      duplicates: 2,
      candidatesIdentified: 18,
      minimumRequirementsMet: 12,
    });
  });
});

describe("Repositorios auxiliares", () => {
  it("consulta los registros de auditoría", async () => {
    expect(
      (await new InMemoryAuditRepository().findAll())[0]?.action,
    ).toBeTruthy();
  });
});
