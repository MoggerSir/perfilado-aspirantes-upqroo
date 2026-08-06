import { queryOptions } from "@tanstack/react-query";
import { services } from "@/core/infrastructure/container";

export const candidateQueryKeys = {
  all: ["candidates"] as const,
  detail: (candidateId: string) =>
    ["candidates", "detail", candidateId] as const,
};

export const allCandidatesQueryOptions = queryOptions({
  queryKey: candidateQueryKeys.all,
  queryFn: () =>
    services.searchCandidates.execute({
      search: "",
      status: "Todos",
      batchId: "Todos",
    }),
});

export function candidateDetailQueryOptions(candidateId: string) {
  return queryOptions({
    queryKey: candidateQueryKeys.detail(candidateId),
    queryFn: () => services.candidateRepository.findById(candidateId),
  });
}
