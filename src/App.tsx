import { lazy, Suspense, type ComponentType } from "react";
import { Route, Router, Switch } from "@/lib/router-components";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/app-shell";
import { LoadingState } from "@/components/ui/feedback";
import { WelcomePage } from "@/pages/welcome-page";
import { LoginPage } from "@/pages/login-page";
import { applicationRouteLoaders } from "@/app/route-loaders";

function createPreloadedPage<RouteModule>(
  routeLoader: {
    load: () => Promise<RouteModule>;
    getLoadedModule: () => RouteModule | undefined;
  },
  selectPage: (routeModule: RouteModule) => ComponentType,
) {
  const LazyPage = lazy(() =>
    routeLoader.load().then((routeModule) => ({
      default: selectPage(routeModule),
    })),
  );

  return function PreloadedPage() {
    const loadedModule = routeLoader.getLoadedModule();
    if (!loadedModule) return <LazyPage />;

    const Page = selectPage(loadedModule);
    return <Page />;
  };
}

const DashboardPage = createPreloadedPage(
  applicationRouteLoaders.dashboard,
  (module) => module.DashboardPage,
);
const ImportPage = createPreloadedPage(
  applicationRouteLoaders.import,
  (module) => module.ImportPage,
);
const CandidatesPage = createPreloadedPage(
  applicationRouteLoaders.candidates,
  (module) => module.CandidatesPage,
);
const CandidateDetailPage = createPreloadedPage(
  applicationRouteLoaders.candidateDetail,
  (module) => module.CandidateDetailPage,
);
const EvaluationPage = createPreloadedPage(
  applicationRouteLoaders.evaluation,
  (module) => module.EvaluationPage,
);
const HistoryPage = createPreloadedPage(
  applicationRouteLoaders.history,
  (module) => module.HistoryPage,
);
const DocumentsPage = createPreloadedPage(
  applicationRouteLoaders.documents,
  (module) => module.DocumentsPage,
);
const ReportsPage = createPreloadedPage(
  applicationRouteLoaders.reports,
  (module) => module.ReportsPage,
);
const AuditPage = createPreloadedPage(
  applicationRouteLoaders.audit,
  (module) => module.AuditPage,
);
const SettingsPage = createPreloadedPage(
  applicationRouteLoaders.settings,
  (module) => module.SettingsPage,
);
const NotFoundPage = createPreloadedPage(
  applicationRouteLoaders.notFound,
  (module) => module.NotFoundPage,
);

export function App() {
  return (
    <Router>
      <a
        href="#contenido-principal"
        className="fixed left-3 top-3 z-[100] -translate-y-20 rounded-lg bg-ink px-4 py-2 text-sm font-bold text-white focus:translate-y-0"
      >
        Saltar al contenido
      </a>
      <Suspense fallback={<LoadingState label="Preparando la vista…" />}>
        <Switch>
          <Route path="/" component={WelcomePage} />
          <Route path="/acceso" component={LoginPage} />
          <Route path="/app">
            <AppShell>
              <DashboardPage />
            </AppShell>
          </Route>
          <Route path="/app/importar">
            <AppShell>
              <ImportPage />
            </AppShell>
          </Route>
          <Route path="/app/aspirantes/:candidateId">
            <AppShell>
              <CandidateDetailPage />
            </AppShell>
          </Route>
          <Route path="/app/aspirantes">
            <AppShell>
              <CandidatesPage />
            </AppShell>
          </Route>
          <Route path="/app/evaluacion">
            <AppShell>
              <EvaluationPage />
            </AppShell>
          </Route>
          <Route path="/app/historial">
            <AppShell>
              <HistoryPage />
            </AppShell>
          </Route>
          <Route path="/app/documentos">
            <AppShell>
              <DocumentsPage />
            </AppShell>
          </Route>
          <Route path="/app/reportes">
            <AppShell>
              <ReportsPage />
            </AppShell>
          </Route>
          <Route path="/app/bitacora">
            <AppShell>
              <AuditPage />
            </AppShell>
          </Route>
          <Route path="/app/configuracion">
            <AppShell>
              <SettingsPage />
            </AppShell>
          </Route>
          <Route>
            <NotFoundPage />
          </Route>
        </Switch>
      </Suspense>
      <Toaster
        position="top-right"
        richColors
        closeButton
        toastOptions={{
          classNames: {
            success: "!text-[#005f29]",
          },
        }}
      />
    </Router>
  );
}
