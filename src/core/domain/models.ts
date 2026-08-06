export type CandidateStatus =
  | "Por revisar"
  | "En evaluación"
  | "Pendiente de información"
  | "Perfil viable"
  | "Perfil no viable";

export type DocumentState = "Vigente" | "Faltante" | "Por revisar";

export interface Criterion {
  id: string;
  name: string;
  description: string;
  required: boolean;
  version: string;
}

export interface CandidateDocument {
  id: string;
  name: string;
  type: string;
  state: DocumentState;
  receivedAt: string;
}

export interface HistoryEvent {
  id: string;
  date: string;
  title: string;
  description: string;
  author: string;
  tone: "neutral" | "success" | "warning" | "danger";
}

export interface Candidate {
  id: string;
  initials: string;
  name: string;
  email: string;
  phone: string;
  status: CandidateStatus;
  batchId: string;
  batchName: string;
  education: string;
  experienceYears: number;
  englishLevel: string;
  availability: string;
  previousParticipation: boolean;
  previousEmployment: boolean;
  completeness: number;
  lastUpdated: string;
  tags: string[];
  documents: CandidateDocument[];
  history: HistoryEvent[];
}

export interface ReviewBatch {
  id: string;
  name: string;
  receivedAt: string;
  sourceReference: string;
  profileReference: string;
  candidateCount: number;
  criteria: Criterion[];
}

export interface AuditEvent {
  id: string;
  date: string;
  user: string;
  action: string;
  resource: string;
  detail: string;
}

export interface CandidateFilters {
  search: string;
  status: CandidateStatus | "Todos";
  batchId: string | "Todos";
}

export interface EvaluationInput {
  candidateId: string;
  status: CandidateStatus;
  observations: string;
  ratings: Record<string, "Cumple" | "Parcial" | "No cumple">;
}

export interface ImportResult {
  processed: number;
  incidents: number;
  duplicates: number;
  files: string[];
  candidatesIdentified: number;
  previousUniversityExperience: number;
  minimumRequirementsMet: number;
  historicalMatches: number;
  completeProfiles: number;
  pendingDocuments: number;
  averageCompleteness: number;
}
