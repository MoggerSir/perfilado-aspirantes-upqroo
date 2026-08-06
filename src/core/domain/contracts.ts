import type {
  AuditEvent,
  Candidate,
  CandidateFilters,
  EvaluationInput,
  ImportResult,
} from "./models";

export interface CandidateRepository {
  findAll(filters?: CandidateFilters): Promise<Candidate[]>;
  findById(id: string): Promise<Candidate | undefined>;
  saveEvaluation(input: EvaluationInput): Promise<Candidate>;
}

export interface ImportRepository {
  process(batchId: string, files: File[]): Promise<ImportResult>;
}

export interface AuditRepository {
  findAll(): Promise<AuditEvent[]>;
}
