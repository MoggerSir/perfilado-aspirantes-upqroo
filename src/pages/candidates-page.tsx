import { Filter, Search, Users } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { CandidateFilters, CandidateStatus } from "@/core/domain/models";
import { filterCandidates } from "@/core/domain/filter-candidates";
import { reviewBatches } from "@/data/mock-data";
import { CandidateCard } from "@/components/data-display/candidate-card";
import { PageHeader } from "@/components/layout/page-header";
import { Input } from "@/components/ui/input";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import { useCandidateCardsAnimation } from "@/hooks/use-candidate-cards-animation";
import { allCandidatesQueryOptions } from "@/features/candidates/candidate-queries";

const statuses: Array<CandidateStatus | "Todos"> = [
  "Todos",
  "Por revisar",
  "En evaluación",
  "Pendiente de información",
  "Perfil viable",
  "Perfil no viable",
];

export function CandidatesPage() {
  const [filters, setFilters] = useState<CandidateFilters>({
    search: "",
    status: "Todos",
    batchId: "Todos",
  });
  const candidatesQuery = useQuery(allCandidatesQueryOptions);
  const candidates = filterCandidates(candidatesQuery.data ?? [], filters);
  const resultKey = candidates.map((candidate) => candidate.id).join("|");
  const resultsScope = useCandidateCardsAnimation<HTMLDivElement>([
    candidatesQuery.isPending,
    resultKey,
  ]);
  return (
    <>
      <PageHeader
        eyebrow="Expedientes centralizados"
        title="Aspirantes"
        description="Localiza los perfiles recibidos por lote y estado. Las coincidencias históricas aparecen como evidencia, no como decisiones automáticas."
      />
      <div className="mb-6 grid gap-3 rounded-2xl border border-ink/20 bg-white p-4 sm:grid-cols-[1fr_220px_240px]">
        <label className="relative">
          <span className="sr-only">Buscar aspirante</span>
          <Search className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
          <Input
            value={filters.search}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                search: event.target.value,
              }))
            }
            className="pl-10"
            placeholder="Nombre, formación o etiqueta…"
          />
        </label>
        <label>
          <span className="sr-only">Filtrar por estado</span>
          <select
            value={filters.status}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                status: event.target.value as CandidateFilters["status"],
              }))
            }
            className="input-base"
          >
            {statuses.map((status) => (
              <option key={status}>{status}</option>
            ))}
          </select>
        </label>
        <label>
          <span className="sr-only">Filtrar por lote recibido</span>
          <select
            value={filters.batchId}
            onChange={(event) =>
              setFilters((current) => ({
                ...current,
                batchId: event.target.value,
              }))
            }
            className="input-base"
          >
            <option value="Todos">Todos los lotes recibidos</option>
            {reviewBatches.map((batch) => (
              <option key={batch.id} value={batch.id}>
                {batch.name}
              </option>
            ))}
          </select>
        </label>
      </div>
      <div className="mb-4 flex items-center justify-between text-xs text-ink/55">
        <p className="flex items-center gap-2">
          <Users className="size-4" />
          <strong className="text-ink">{candidates.length}</strong> resultados
        </p>
        <p className="flex items-center gap-2">
          <Filter className="size-4" />
          Filtros actualizados en tiempo real
        </p>
      </div>
      {candidatesQuery.isPending ? (
        <LoadingState label="Consultando expedientes…" />
      ) : candidatesQuery.isError ? (
        <EmptyState
          title="No fue posible consultar los expedientes"
          description="La información conservada no está disponible. Intenta volver a entrar a la vista."
        />
      ) : candidates.length === 0 ? (
        <EmptyState
          title="No encontramos coincidencias"
          description="Amplía el texto de búsqueda o cambia los filtros de lote y estado."
        />
      ) : (
        <div
          ref={resultsScope}
          className="grid gap-5 md:grid-cols-2 2xl:grid-cols-3"
          data-motion-skip
        >
          {candidates.map((candidate) => (
            <CandidateCard key={candidate.id} candidate={candidate} />
          ))}
        </div>
      )}
    </>
  );
}
