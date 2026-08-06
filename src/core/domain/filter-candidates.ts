import type { Candidate, CandidateFilters } from "@/core/domain/models";

export function filterCandidates(
  candidates: Candidate[],
  filters: CandidateFilters,
) {
  const normalizedSearch = filters.search.trim().toLocaleLowerCase("es");

  return candidates.filter((candidate) => {
    const matchesSearch =
      !normalizedSearch ||
      `${candidate.name} ${candidate.education} ${candidate.tags.join(" ")}`
        .toLocaleLowerCase("es")
        .includes(normalizedSearch);
    const matchesStatus =
      filters.status === "Todos" || candidate.status === filters.status;
    const matchesBatch =
      filters.batchId === "Todos" || candidate.batchId === filters.batchId;

    return matchesSearch && matchesStatus && matchesBatch;
  });
}
