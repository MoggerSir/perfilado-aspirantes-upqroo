import {
  ArrowRight,
  BriefcaseBusiness,
  History,
  Search,
  UserRoundCheck,
} from "lucide-react";
import { useState } from "react";
import { Link } from "@/lib/router-components";
import { candidates } from "@/data/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { EmptyState } from "@/components/ui/feedback";

export function HistoryPage() {
  const [search, setSearch] = useState("");
  const historical = candidates.filter(
    (candidate) =>
      candidate.previousParticipation &&
      candidate.name.toLowerCase().includes(search.toLowerCase()),
  );
  return (
    <>
      <PageHeader
        eyebrow="CU-006 · Memoria institucional"
        title="Historial de candidatos"
        description="Reconoce si una persona participó o trabajó previamente y recupera la evidencia disponible antes de una nueva evaluación."
      />
      <div className="mb-6 max-w-xl">
        <label className="relative">
          <span className="sr-only">Buscar en historial</span>
          <Search className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="pl-10"
            placeholder="Buscar por nombre…"
          />
        </label>
      </div>
      {historical.length === 0 ? (
        <EmptyState
          title="Sin coincidencias históricas"
          description="Prueba con un nombre distinto o elimina parte del texto de búsqueda."
        />
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {historical.map((candidate) => (
            <Card key={candidate.id} className="p-5 shadow-none sm:p-6">
              <div className="flex items-start gap-4">
                <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-sage-soft font-extrabold text-sage">
                  {candidate.initials}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-lg font-extrabold">{candidate.name}</h2>
                    {candidate.previousEmployment && (
                      <Badge tone="success">Trabajó previamente</Badge>
                    )}
                  </div>
                  <p className="mt-1 text-xs text-ink/50">
                    {candidate.education}
                  </p>
                </div>
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <div className="rounded-xl border border-ink/15 bg-paper p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45">
                    <BriefcaseBusiness className="size-4" />
                    Participaciones
                  </p>
                  <p className="mt-2 text-2xl font-extrabold">
                    {candidate.history.length}
                  </p>
                </div>
                <div className="rounded-xl border border-ink/15 bg-paper p-4">
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-ink/45">
                    <UserRoundCheck className="size-4" />
                    Relación laboral
                  </p>
                  <p className="mt-2 text-sm font-bold">
                    {candidate.previousEmployment
                      ? "Confirmada"
                      : "No identificada"}
                  </p>
                </div>
              </div>
              <div className="mt-5 border-l-2 border-sage/40 pl-4">
                <p className="flex items-center gap-2 text-xs font-bold text-ink/45">
                  <History className="size-4" />
                  Último antecedente
                </p>
                <p className="mt-2 text-sm font-bold">
                  {candidate.history[0]?.title}
                </p>
                <p className="mt-1 text-xs leading-5 text-ink/60">
                  {candidate.history[0]?.description}
                </p>
              </div>
              <Link
                to={`/app/aspirantes/${candidate.id}`}
                className="mt-5 inline-flex min-h-10 items-center gap-2 rounded-lg text-sm font-bold text-sage hover:underline"
              >
                Abrir expediente completo <ArrowRight className="size-4" />
              </Link>
            </Card>
          ))}
        </div>
      )}
    </>
  );
}
