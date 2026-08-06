import { useState } from "react";
import { NavLink } from "@/lib/router-components";
import { useLocation, useNavigate } from "@/lib/router-hooks";
import {
  Archive,
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileOutput,
  History,
  LayoutDashboard,
  LogOut,
  Menu,
  Search,
  Settings,
  ShieldCheck,
  Upload,
  Users,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Drawer } from "@/components/ui/drawer";
import { AnimatedPage } from "@/components/feedback/animated-page";
import { cn } from "@/lib/utils";

const navigation = [
  { label: "Resumen", href: "/app", icon: LayoutDashboard },
  { label: "Importar expedientes", href: "/app/importar", icon: Upload },
  { label: "Aspirantes", href: "/app/aspirantes", icon: Users },
  { label: "Evaluación", href: "/app/evaluacion", icon: ClipboardCheck },
  { label: "Historial", href: "/app/historial", icon: History },
  { label: "Documentos", href: "/app/documentos", icon: FileOutput },
  { label: "Reportes", href: "/app/reportes", icon: Archive },
  { label: "Bitácora", href: "/app/bitacora", icon: ShieldCheck },
];

const pageNames: Record<string, string> = {
  importar: "Importar expedientes",
  aspirantes: "Aspirantes",
  evaluacion: "Evaluación",
  historial: "Historial",
  documentos: "Documentos",
  reportes: "Reportes",
  bitacora: "Bitácora",
  configuracion: "Configuración",
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const segment = location.pathname.split("/")[2];
  const currentPage = pageNames[segment] ?? "Resumen";

  const sidebar = (
    <>
      <div className="flex h-20 items-center gap-3 border-b border-white/15 px-5">
        <div className="grid size-10 place-items-center rounded-xl border border-white/35 bg-sage text-sm font-extrabold">
          NI
        </div>
        <div>
          <p className="font-display text-lg font-extrabold leading-none">
            Nexo Idiomas
          </p>
          <p className="mt-1 text-[.64rem] font-bold uppercase tracking-[.16em] text-white/55">
            Perfilado docente
          </p>
        </div>
      </div>
      <nav
        aria-label="Navegación principal"
        className="flex-1 space-y-1 overflow-y-auto px-3 py-5"
      >
        {navigation.map(({ label, href, icon: Icon }) => (
          <NavLink
            key={href}
            to={href}
            end={href === "/app"}
            onClick={() => setMobileOpen(false)}
            className={({ isActive }) =>
              cn(
                "motion-nav-indicator flex min-h-11 items-center gap-3 rounded-xl px-3 text-sm font-semibold",
                isActive
                  ? "bg-paper text-ink"
                  : "text-white/70 hover:bg-white/10 hover:text-white",
              )
            }
          >
            <Icon className="size-[1.1rem]" />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="border-t border-white/15 p-3">
        <button
          onClick={() => navigate("/app/configuracion")}
          className="flex w-full items-center gap-3 rounded-xl p-3 text-left hover:bg-white/10"
        >
          <div className="grid size-9 place-items-center rounded-full bg-lavender font-bold text-ink">
            JR
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-bold">Josué Reyes</p>
            <p className="truncate text-xs text-white/55">
              Director de Idiomas
            </p>
          </div>
          <Settings className="size-4 text-white/60" />
        </button>
        <button
          onClick={() => navigate("/")}
          className="mt-1 flex min-h-10 w-full items-center gap-3 rounded-xl px-3 text-sm text-white/60 hover:bg-white/10 hover:text-white"
        >
          <LogOut className="size-4" />
          Cerrar demostración
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-paper lg:grid lg:grid-cols-[260px_1fr]">
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-[260px] flex-col bg-ink text-white lg:flex">
        {sidebar}
      </aside>
      <Drawer
        open={mobileOpen}
        onOpenChange={setMobileOpen}
        title="Navegación principal"
        returnFocusId="mobile-menu-trigger"
      >
        <aside className="relative flex h-full flex-col">
          {sidebar}
          <button
            className="absolute right-3 top-5 grid size-10 place-items-center rounded-full bg-white/10"
            onClick={() => setMobileOpen(false)}
            aria-label="Cerrar menú"
          >
            <X className="size-5" />
          </button>
        </aside>
      </Drawer>
      <div className="min-w-0 lg:col-start-2">
        <header className="sticky top-0 z-30 flex h-[4.5rem] items-center gap-3 border-b border-ink/15 bg-paper/95 px-4 backdrop-blur sm:px-7 lg:px-10">
          <Button
            id="mobile-menu-trigger"
            variant="secondary"
            size="icon"
            className="lg:hidden"
            onClick={() => setMobileOpen(true)}
            aria-label="Abrir menú"
          >
            <Menu className="size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-1.5 text-[.68rem] font-bold uppercase tracking-[.13em] text-ink/45">
              <span>Dirección</span>
              <ChevronRight className="size-3" />
              <span className="truncate text-ink/70">{currentPage}</span>
            </div>
          </div>
          <button
            className="hidden min-h-10 w-52 items-center gap-2 rounded-xl border border-ink/20 bg-white px-3 text-left text-xs text-ink/50 hover:border-ink/40 sm:flex"
            onClick={() => navigate("/app/aspirantes")}
          >
            <Search className="size-4" />
            Buscar aspirante…
          </button>
          <Button variant="ghost" size="icon" aria-label="Notificaciones">
            <Bell className="size-5" />
            <span className="absolute mt-[-18px] ml-[18px] size-2 rounded-full bg-clay" />
          </Button>
        </header>
        <main
          id="contenido-principal"
          className="mx-auto w-full max-w-[1500px] p-4 pb-16 sm:p-7 lg:p-10"
        >
          <AnimatedPage routeKey={location.pathname}>{children}</AnimatedPage>
        </main>
      </div>
    </div>
  );
}
