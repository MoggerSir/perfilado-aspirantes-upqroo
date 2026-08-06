import type {
  CandidateRepository,
  ImportRepository,
} from "@/core/domain/contracts";
import type { CandidateFilters, EvaluationInput } from "@/core/domain/models";

export class SearchCandidates {
  constructor(private readonly repository: CandidateRepository) {}
  execute(filters: CandidateFilters) {
    return this.repository.findAll(filters);
  }
}

export class EvaluateCandidate {
  constructor(private readonly repository: CandidateRepository) {}
  execute(input: EvaluationInput) {
    const requiresReason = [
      "Perfil no viable",
      "Pendiente de información",
    ].includes(input.status);
    if (requiresReason && input.observations.trim().length < 12)
      throw new Error(
        "Registra un motivo claro de al menos 12 caracteres para este estado.",
      );
    if (Object.keys(input.ratings).length === 0)
      throw new Error("Valora al menos un criterio antes de guardar.");
    return this.repository.saveEvaluation(input);
  }
}

export class ImportCandidateFiles {
  constructor(private readonly repository: ImportRepository) {}
  execute(batchId: string, files: File[]) {
    return this.repository.process(batchId, files);
  }
}
