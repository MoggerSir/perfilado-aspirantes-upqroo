import {
  AlertTriangle,
  ArrowRight,
  BriefcaseBusiness,
  FileCheck2,
  FileClock,
  Files,
  History,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  UserRoundCheck,
  UsersRound,
} from "lucide-react";
import { Link } from "@/lib/router-components";
import type { ImportResult } from "@/core/domain/models";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useImportResultsAnimation } from "@/hooks/use-import-results-animation";

const metricStyles = [
  "bg-lavender",
  "bg-sage-soft",
  "bg-[#e3ebf0]",
  "bg-clay-soft",
];

export function ImportResults({
  result,
  onReset,
}: {
  result: ImportResult;
  onReset: () => void;
}) {
  const motionScope = useImportResultsAnimation<HTMLDivElement>([
    result.files.join("|"),
  ]);
  const metrics = [
    {
      label: "Aspirantes identificados",
      value: result.candidatesIdentified,
      note: "Perfiles agrupados desde el lote",
      icon: UsersRound,
    },
    {
      label: "Con experiencia universitaria",
      value: result.previousUniversityExperience,
      note: "Requieren revisar su historial",
      icon: BriefcaseBusiness,
    },
    {
      label: "Cumplen requisitos mínimos",
      value: result.minimumRequirementsMet,
      note: "Resultado preliminar, no decisión",
      icon: UserRoundCheck,
    },
    {
      label: "Coincidencias históricas",
      value: result.historicalMatches,
      note: "Participación o trabajo previo",
      icon: History,
    },
  ];

  return (
    <div ref={motionScope} data-motion-skip>
      <Card
        className="overflow-hidden border-sage/35 bg-sage p-6 text-white shadow-none sm:p-8"
        data-import-result-heading
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-white/20 bg-white/15">
              <Sparkles className="size-6" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.17em] text-white/70">
                Simulación completada
              </p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                El lote ya tiene una primera lectura útil.
              </h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-white/75">
                Se organizaron {result.processed} documentos en{" "}
                {result.candidatesIdentified} expedientes probables. Los
                hallazgos necesitan revisión del Director antes de
                incorporarse.
              </p>
            </div>
          </div>
          <Badge className="w-fit border-white/25 bg-white/10 text-white">
            <ShieldCheck className="mr-1.5 size-3.5" />
            Trazabilidad preparada
          </Badge>
        </div>
      </Card>

      <section
        className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4"
        aria-label="Resultados principales"
      >
        {metrics.map(({ label, value, note, icon: Icon }, index) => (
          <Card
            key={label}
            className="relative min-h-52 overflow-hidden p-5 shadow-none"
            data-import-result-card
          >
            <div
              className={`absolute -right-8 -top-9 size-28 rounded-full ${metricStyles[index]}`}
            />
            <div
              className={`relative grid size-11 place-items-center rounded-xl ${metricStyles[index]}`}
              data-import-result-content
            >
              <Icon className="size-5" />
            </div>
            <p
              className="relative mt-7 text-4xl font-extrabold"
              data-import-result-content
            >
              {value}
            </p>
            <div className="relative" data-import-result-content>
              <h3 className="mt-1 text-sm font-extrabold leading-5">{label}</h3>
              <p className="mt-1 text-xs leading-5 text-ink/55">{note}</p>
            </div>
          </Card>
        ))}
      </section>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <Card className="p-5 shadow-none sm:p-7" data-import-result-panel>
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="eyebrow">Calidad documental</p>
              <h2 className="mt-2 text-xl font-extrabold">
                Qué tan preparado está el lote
              </h2>
            </div>
            <Badge tone="success">Promedio {result.averageCompleteness}%</Badge>
          </div>
          <div className="mt-7 space-y-6">
            {[
              {
                label: "Integridad documental promedio",
                value: result.averageCompleteness,
                detail: `${result.completeProfiles} expedientes completos`,
              },
              {
                label: "Cumplimiento mínimo preliminar",
                value: Math.round(
                  (result.minimumRequirementsMet /
                    result.candidatesIdentified) *
                    100,
                ),
                detail: `${result.minimumRequirementsMet} de ${result.candidatesIdentified} perfiles`,
              },
              {
                label: "Cobertura de historial institucional",
                value: Math.round(
                  (result.historicalMatches / result.candidatesIdentified) *
                    100,
                ),
                detail: `${result.historicalMatches} coincidencias encontradas`,
              },
            ].map((indicator) => (
              <div key={indicator.label}>
                <div className="mb-2 flex items-end justify-between gap-4 text-xs">
                  <div>
                    <p className="font-bold">{indicator.label}</p>
                    <p className="mt-1 text-ink/50">{indicator.detail}</p>
                  </div>
                  <strong>{indicator.value}%</strong>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="h-full rounded-full bg-sage"
                    style={{ width: `${indicator.value}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </Card>

        <Card className="overflow-hidden shadow-none" data-import-result-panel>
          <div className="border-b border-ink/15 p-5 sm:p-6">
            <p className="eyebrow text-clay">Atención requerida</p>
            <h2 className="mt-2 text-xl font-extrabold">
              Hallazgos para priorizar
            </h2>
          </div>
          <div className="divide-y divide-ink/10">
            {[
              {
                icon: AlertTriangle,
                count: result.incidents,
                title: "Incidencias de lectura",
                text: "Archivos que necesitan comprobación manual.",
              },
              {
                icon: FileClock,
                count: result.pendingDocuments,
                title: "Expedientes incompletos",
                text: "Falta al menos una evidencia requerida.",
              },
              {
                icon: Files,
                count: result.duplicates,
                title: "Posibles duplicados",
                text: "Coincidencias que no deben fusionarse automáticamente.",
              },
            ].map(({ icon: Icon, count, title, text }) => (
              <div key={title} className="flex gap-4 p-5 sm:px-6">
                <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-clay-soft text-clay">
                  <Icon className="size-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold">{title}</p>
                  <p className="mt-1 text-xs leading-5 text-ink/55">{text}</p>
                </div>
                <span className="text-2xl font-extrabold">{count}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="mt-6 p-5 shadow-none sm:p-6" data-import-result-panel>
        <div className="grid gap-6 lg:grid-cols-[1fr_auto] lg:items-center">
          <div>
            <p className="flex items-center gap-2 text-sm font-bold">
              <FileCheck2 className="size-4 text-sage" />
              Archivos vinculados a esta simulación
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {result.files.map((file) => (
                <Badge key={file}>{file}</Badge>
              ))}
            </div>
            <p className="mt-3 text-xs leading-5 text-ink/50">
              La procedencia, fecha, lote y responsable quedarían registrados en
              la bitácora real.
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button variant="secondary" onClick={onReset}>
              <RotateCcw className="size-4" />
              Simular otra carga
            </Button>
            <Button asChild>
              <Link to="/app/aspirantes">
                Revisar aspirantes <ArrowRight className="size-4" />
              </Link>
            </Button>
          </div>
        </div>
      </Card>

      <p className="mt-5 text-center text-xs text-ink/50">
        Esta vista demuestra el resultado esperado; no representa extracción
        real ni una decisión institucional.
      </p>
    </div>
  );
}
