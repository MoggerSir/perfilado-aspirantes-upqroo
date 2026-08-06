import {
  EvaluateCandidate,
  ImportCandidateFiles,
  SearchCandidates,
} from "@/core/application/use-cases";
import {
  InMemoryAuditRepository,
  InMemoryCandidateRepository,
  SimulatedImportRepository,
} from "./in-memory-repositories";

const candidateRepository = new InMemoryCandidateRepository();
const importRepository = new SimulatedImportRepository();

export const services = {
  candidateRepository,
  auditRepository: new InMemoryAuditRepository(),
  searchCandidates: new SearchCandidates(candidateRepository),
  evaluateCandidate: new EvaluateCandidate(candidateRepository),
  importCandidateFiles: new ImportCandidateFiles(importRepository),
};
