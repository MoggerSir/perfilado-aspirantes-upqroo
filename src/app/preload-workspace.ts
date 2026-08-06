import { appQueryClient } from "@/app/query-client";
import { preloadApplicationRoutes } from "@/app/route-loaders";
import { auditEventsQueryOptions } from "@/features/audit/audit-queries";
import {
  allCandidatesQueryOptions,
  candidateQueryKeys,
} from "@/features/candidates/candidate-queries";

let workspacePreload: Promise<void> | undefined;

async function warmWorkspace() {
  const [, candidates] = await Promise.all([
    Promise.all([
      preloadApplicationRoutes(),
      appQueryClient.prefetchQuery(auditEventsQueryOptions),
    ]),
    appQueryClient.fetchQuery(allCandidatesQueryOptions),
  ]);

  candidates.forEach((candidate) => {
    appQueryClient.setQueryData(
      candidateQueryKeys.detail(candidate.id),
      candidate,
    );
  });
}

export function preloadWorkspace() {
  workspacePreload ??= warmWorkspace().catch((error: unknown) => {
    workspacePreload = undefined;
    throw error;
  });

  return workspacePreload;
}
