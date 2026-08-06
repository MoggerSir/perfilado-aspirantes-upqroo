import type {
  AuditRepository,
  CandidateRepository,
  ImportRepository,
} from "@/core/domain/contracts";
import type {
  AuditEvent,
  Candidate,
  CandidateFilters,
  EvaluationInput,
  ImportResult,
} from "@/core/domain/models";
import { filterCandidates } from "@/core/domain/filter-candidates";
import { auditEvents, candidates } from "@/data/mock-data";

const delay = (milliseconds = 180) =>
  new Promise((resolve) => setTimeout(resolve, milliseconds));

export class InMemoryCandidateRepository implements CandidateRepository {
  private readonly candidates: Candidate[] = structuredClone(candidates);

  async findAll(filters?: CandidateFilters): Promise<Candidate[]> {
    await delay();
    if (!filters) return structuredClone(this.candidates);
    return structuredClone(filterCandidates(this.candidates, filters));
  }

  async findById(id: string): Promise<Candidate | undefined> {
    await delay(120);
    const candidate = this.candidates.find(
      (currentCandidate) => currentCandidate.id === id,
    );
    return candidate ? structuredClone(candidate) : undefined;
  }

  async saveEvaluation(input: EvaluationInput): Promise<Candidate> {
    await delay(550);
    const candidate = this.candidates.find(
      (currentCandidate) => currentCandidate.id === input.candidateId,
    );
    if (!candidate) throw new Error("No se encontró el expediente solicitado.");
    candidate.status = input.status;
    candidate.lastUpdated = "Ahora";
    candidate.history.unshift({
      id: `history-${Date.now()}`,
      date: "04 ago 2026",
      title: "Evaluación registrada",
      description: input.observations,
      author: "Josué Reyes",
      tone: input.status === "Perfil viable" ? "success" : "neutral",
    });
    return structuredClone(candidate);
  }
}

export class SimulatedImportRepository implements ImportRepository {
  async process(batchId: string, files: File[]): Promise<ImportResult> {
    await delay(850);
    if (!batchId)
      throw new Error(
        "Selecciona el lote recibido antes de procesar los archivos.",
      );
    if (files.length === 0)
      throw new Error("Selecciona al menos un archivo ZIP, PDF o DOCX.");
    return {
      processed: 54,
      incidents: 3,
      duplicates: 2,
      files: files.map((file) => file.name),
      candidatesIdentified: 18,
      previousUniversityExperience: 6,
      minimumRequirementsMet: 12,
      historicalMatches: 5,
      completeProfiles: 11,
      pendingDocuments: 4,
      averageCompleteness: 86,
    };
  }
}

export class InMemoryAuditRepository implements AuditRepository {
  async findAll(): Promise<AuditEvent[]> {
    await delay(150);
    return structuredClone(auditEvents);
  }
}
