import { queryOptions } from "@tanstack/react-query";
import { services } from "@/core/infrastructure/container";

export const auditQueryKeys = {
  all: ["audit-events"] as const,
};

export const auditEventsQueryOptions = queryOptions({
  queryKey: auditQueryKeys.all,
  queryFn: () => services.auditRepository.findAll(),
});
