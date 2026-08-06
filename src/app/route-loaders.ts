function createRouteLoader<RouteModule>(
  importRoute: () => Promise<RouteModule>,
) {
  let loadedModule: RouteModule | undefined;
  let pendingImport: Promise<RouteModule> | undefined;

  return {
    load() {
      pendingImport ??= importRoute().then((routeModule) => {
        loadedModule = routeModule;
        return routeModule;
      });
      return pendingImport;
    },
    getLoadedModule() {
      return loadedModule;
    },
  };
}

export const applicationRouteLoaders = {
  dashboard: createRouteLoader(() => import("@/pages/dashboard-page")),
  import: createRouteLoader(() => import("@/pages/import-page")),
  candidates: createRouteLoader(() => import("@/pages/candidates-page")),
  candidateDetail: createRouteLoader(
    () => import("@/pages/candidate-detail-page"),
  ),
  evaluation: createRouteLoader(() => import("@/pages/evaluation-page")),
  history: createRouteLoader(() => import("@/pages/history-page")),
  documents: createRouteLoader(() => import("@/pages/documents-page")),
  reports: createRouteLoader(() => import("@/pages/reports-page")),
  audit: createRouteLoader(() => import("@/pages/audit-page")),
  settings: createRouteLoader(() => import("@/pages/settings-page")),
  notFound: createRouteLoader(() => import("@/pages/not-found-page")),
} as const;

export function preloadApplicationRoutes() {
  return Promise.all(
    Object.values(applicationRouteLoaders).map((route) => route.load()),
  );
}
