import { beforeEach, describe, expect, it } from "vitest";
import { appQueryClient } from "@/app/query-client";
import { preloadWorkspace } from "@/app/preload-workspace";
import { auditQueryKeys } from "@/features/audit/audit-queries";
import {
  candidateDetailQueryOptions,
  candidateQueryKeys,
} from "@/features/candidates/candidate-queries";
import type { AuditEvent, Candidate } from "@/core/domain/models";

describe("preloadWorkspace", () => {
  beforeEach(() => appQueryClient.clear());

  it("reutiliza una sola preparación y llena las consultas principales", async () => {
    const firstPreload = preloadWorkspace();
    const repeatedPreload = preloadWorkspace();

    expect(repeatedPreload).toBe(firstPreload);
    await firstPreload;

    const cachedCandidates = appQueryClient.getQueryData<Candidate[]>(
      candidateQueryKeys.all,
    );
    const cachedAudit = appQueryClient.getQueryData<AuditEvent[]>(
      auditQueryKeys.all,
    );

    expect(cachedCandidates?.length).toBeGreaterThan(0);
    expect(cachedAudit?.length).toBeGreaterThan(0);
    expect(
      appQueryClient.getQueryData(candidateQueryKeys.detail("asp-001")),
    ).toBeDefined();

    appQueryClient.removeQueries({
      queryKey: candidateQueryKeys.detail("asp-001"),
    });
    const refetchedDetail = await appQueryClient.fetchQuery(
      candidateDetailQueryOptions("asp-001"),
    );
    expect(refetchedDetail?.id).toBe("asp-001");
  });
});
