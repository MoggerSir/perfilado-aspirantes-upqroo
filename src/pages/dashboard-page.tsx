import {
  ArrowRight,
  CircleOff,
  FileWarning,
  History,
  Inbox,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { Link } from "@/lib/router-components";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { PageHeader } from "@/components/layout/page-header";
import { candidates } from "@/data/mock-data";

export function DashboardPage() {
  const stats = [
    {
      label: "Expedientes recibidos",
      value: "54",
      note: "Organizados en 3 lotes",
      icon: Inbox,
      color: "bg-lavender",
    },
    {
      label: "Pendientes de revisión",
      value: "7",
      note: "3 con prioridad",
      icon: Users,
      color: "bg-[#e3ebf0]",
    },
    {
      label: "Expedientes incompletos",
      value: "3",
      note: "Requieren seguimiento",
      icon: FileWarning,
      color: "bg-clay-soft",
    },
    {
      label: "Coincidencias históricas",
      value: "5",
      note: "En los lotes recibidos",
      icon: History,
      color: "bg-sage-soft",
    },
  ];
  return (
    <>
      <PageHeader
        eyebrow="Martes · 4 de agosto"
        title="Buenos días, Josué."
        description="Aquí está lo importante para continuar el perfilado sin perder contexto ni trazabilidad."
        action={
          <Button asChild>
            <Link to="/app/importar">Importar expedientes</Link>
          </Button>
        }
      />
      <section
        aria-label="Indicadores"
        className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(({ label, value, note, icon: Icon, color }) => (
          <Card
            key={label}
            className="relative overflow-hidden p-5 shadow-none"
          >
            <div
              className={`absolute right-[-25px] top-[-30px] size-28 rounded-full ${color}`}
            />
            <div
              className={`relative grid size-10 place-items-center rounded-xl ${color}`}
            >
              <Icon className="size-5" />
            </div>
            <p className="relative mt-6 text-4xl font-extrabold">{value}</p>
            <p className="relative mt-1 text-sm font-bold">{label}</p>
            <p className="relative mt-1 text-xs text-ink/50">{note}</p>
          </Card>
        ))}
      </section>
      <div className="mt-7 grid gap-6 xl:grid-cols-[1.35fr_.65fr]">
        <Card className="overflow-hidden">
          <div className="flex items-center justify-between border-b border-ink/15 p-5 sm:p-6">
            <div>
              <p className="eyebrow">Siguiente paso</p>
              <h2 className="mt-1 text-xl font-extrabold">
                Aspirantes que requieren atención
              </h2>
            </div>
            <Button asChild variant="ghost" size="sm">
              <Link to="/app/aspirantes">
                Ver todos <ArrowRight className="size-3.5" />
              </Link>
            </Button>
          </div>
          <div className="divide-y divide-ink/10">
            {candidates.slice(0, 3).map((candidate) => (
              <Link
                key={candidate.id}
                to={`/app/aspirantes/${candidate.id}`}
                className="flex items-center gap-3 p-4 transition-colors hover:bg-mist/45 sm:px-6"
              >
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-[#e3ebf0] text-xs font-extrabold text-slateblue">
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold">{candidate.name}</p>
                  <p className="mt-1 truncate text-xs text-ink/50">
                    {candidate.education} · {candidate.completeness}% completo
                  </p>
                </div>
                <StatusBadge status={candidate.status} />
                <ArrowRight className="motion-icon-shift hidden size-4 text-ink/35 sm:block" />
              </Link>
            ))}
          </div>
        </Card>
        <Card className="bg-sage text-white">
          <div className="p-5 sm:p-6">
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-white/15">
                <Sparkles className="size-5" />
              </div>
              <Badge className="border-white/20 bg-white/10 text-white">
                Trazabilidad
              </Badge>
            </div>
            <h2 className="mt-8 text-2xl font-extrabold">
              5 perfiles ya tienen historia.
            </h2>
            <p className="mt-3 text-sm leading-6 text-white/75">
              El sistema detectó participaciones o trabajo previo en la
              universidad. Revísalos antes de tomar una decisión.
            </p>
            <Button
              asChild
              variant="secondary"
              className="mt-7 border-white/30 bg-white text-ink"
            >
              <Link to="/app/historial">
                Consultar historial <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </Card>
      </div>
      <section className="mt-7 grid gap-4 lg:grid-cols-2">
        <Card className="flex gap-4 p-5 shadow-none sm:p-6">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-sage-soft">
            <ShieldCheck className="size-5 text-sage" />
          </div>
          <div>
            <p className="eyebrow">Alcance de Idiomas</p>
            <h2 className="mt-1 text-lg font-extrabold">
              Revisar y dar seguimiento
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Organizar expedientes recibidos, evaluar perfiles, consultar
              antecedentes y registrar observaciones.
            </p>
          </div>
        </Card>
        <Card className="flex gap-4 p-5 shadow-none sm:p-6">
          <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-clay-soft">
            <CircleOff className="size-5 text-clay" />
          </div>
          <div>
            <p className="eyebrow text-clay">Fuera de alcance</p>
            <h2 className="mt-1 text-lg font-extrabold">
              Procesos de Recursos Humanos
            </h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              La plataforma no publica convocatorias, no recibe postulaciones
              formales y no autoriza contrataciones.
            </p>
          </div>
        </Card>
      </section>
    </>
  );
}
