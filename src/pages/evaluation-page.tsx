import {
  AlertCircle,
  CheckCircle2,
  ChevronLeft,
  ChevronRight,
  ClipboardCheck,
  FileText,
  History,
} from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "@/lib/router-hooks";
import { toast } from "sonner";
import type {
  Candidate,
  CandidateStatus,
  EvaluationInput,
} from "@/core/domain/models";
import { services } from "@/core/infrastructure/container";
import { candidates, reviewBatches } from "@/data/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { FieldError, Textarea } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/feedback";
import { candidateQueryKeys } from "@/features/candidates/candidate-queries";

type EvaluationForm = {
  status: CandidateStatus;
  observations: string;
  ratings: Record<string, "Cumple" | "Parcial" | "No cumple" | "">;
};
const evaluationStatuses: CandidateStatus[] = [
  "En evaluación",
  "Pendiente de información",
  "Perfil viable",
  "Perfil no viable",
];

export function EvaluationPage() {
  const queryClient = useQueryClient();
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedId = searchParams.get("candidate");
  const initialIndex = Math.max(
    0,
    candidates.findIndex((candidate) => candidate.id === requestedId),
  );
  const [candidateIndex, setCandidateIndex] = useState(initialIndex);
  const candidate = candidates[candidateIndex];
  const criteria =
    reviewBatches.find((batch) => batch.id === candidate.batchId)?.criteria ??
    reviewBatches[0].criteria;
  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<EvaluationForm>({
    defaultValues: {
      status: candidate.status,
      observations: "",
      ratings: Object.fromEntries(
        criteria.map((criterion) => [criterion.id, ""]),
      ),
    },
  });
  useEffect(() => {
    reset({
      status: candidate.status,
      observations: "",
      ratings: Object.fromEntries(
        criteria.map((criterion) => [criterion.id, ""]),
      ),
    });
    setSearchParams({ candidate: candidate.id }, { replace: true });
  }, [candidate.id, candidate.status, criteria, reset, setSearchParams]);
  const ratings = watch("ratings");
  const submit = async (form: EvaluationForm) => {
    try {
      const cleanedRatings = Object.fromEntries(
        Object.entries(form.ratings).filter(
          (entry): entry is [string, "Cumple" | "Parcial" | "No cumple"] =>
            entry[1] !== "",
        ),
      );
      const input: EvaluationInput = {
        candidateId: candidate.id,
        status: form.status,
        observations: form.observations,
        ratings: cleanedRatings,
      };
      const updatedCandidate = await services.evaluateCandidate.execute(input);
      queryClient.setQueryData(
        candidateQueryKeys.detail(updatedCandidate.id),
        updatedCandidate,
      );
      queryClient.setQueryData<Candidate[]>(candidateQueryKeys.all, (current) =>
        current?.map((currentCandidate) =>
          currentCandidate.id === updatedCandidate.id
            ? updatedCandidate
            : currentCandidate,
        ),
      );
      toast.success("Evaluación e historial actualizados");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "No fue posible guardar la evaluación.",
      );
    }
  };
  return (
    <>
      <PageHeader
        eyebrow="CU-005 · Decisión humana"
        title="Evaluación de aspirantes"
        description="Valora evidencia frente a criterios vigentes. El sistema registra tu decisión y su contexto; nunca decide por ti."
      />
      <form
        onSubmit={handleSubmit(submit)}
        className="grid gap-6 xl:grid-cols-[340px_1fr]"
        noValidate
      >
        <aside className="space-y-5">
          <Card className="p-5 shadow-none">
            <div className="flex items-start justify-between gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-[#e3ebf0] font-extrabold text-slateblue">
                {candidate.initials}
              </div>
              <StatusBadge status={candidate.status} />
            </div>
            <h2 className="mt-4 text-xl font-extrabold">{candidate.name}</h2>
            <p className="mt-1 text-xs leading-5 text-ink/55">
              {candidate.education} · {candidate.experienceYears} años
            </p>
            <div className="mt-5 space-y-3 border-t border-ink/10 pt-5 text-xs">
              <p className="flex justify-between gap-3">
                <span className="text-ink/50">Dominio</span>
                <strong>{candidate.englishLevel}</strong>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-ink/50">Disponibilidad</span>
                <strong className="text-right">{candidate.availability}</strong>
              </p>
              <p className="flex justify-between gap-3">
                <span className="text-ink/50">Expediente</span>
                <strong>{candidate.completeness}%</strong>
              </p>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-2">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCandidateIndex((index) => Math.max(0, index - 1))
                }
                disabled={candidateIndex === 0}
              >
                <ChevronLeft className="size-4" />
                Anterior
              </Button>
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() =>
                  setCandidateIndex((index) =>
                    Math.min(candidates.length - 1, index + 1),
                  )
                }
                disabled={candidateIndex === candidates.length - 1}
              >
                Siguiente
                <ChevronRight className="size-4" />
              </Button>
            </div>
          </Card>
          {candidate.previousParticipation && (
            <InlineAlert title="Existe historial previo" tone="success">
              <span className="inline-flex items-start gap-2">
                <History className="mt-0.5 size-4 shrink-0" />
                Revisa participaciones anteriores antes de concluir.
              </span>
            </InlineAlert>
          )}
          <Card className="p-5 shadow-none">
            <p className="flex items-center gap-2 text-sm font-bold">
              <FileText className="size-4 text-sage" />
              Evidencia disponible
            </p>
            <p className="mt-2 text-xs leading-5 text-ink/55">
              {
                candidate.documents.filter(
                  (document) => document.state === "Vigente",
                ).length
              }{" "}
              de {candidate.documents.length} documentos vigentes.
            </p>
          </Card>
        </aside>
        <div className="space-y-6">
          <Card className="p-5 sm:p-7">
            <div className="flex items-center justify-between">
              <div>
                <p className="eyebrow">Criterios · v1.2</p>
                <h2 className="mt-1 text-xl font-extrabold">
                  Valoración explicable
                </h2>
              </div>
              <ClipboardCheck className="size-6 text-sage" />
            </div>
            <div className="mt-6 space-y-4">
              {criteria.map((criterion) => (
                <fieldset
                  key={criterion.id}
                  className="rounded-2xl border border-ink/15 bg-white p-4"
                >
                  <legend className="sr-only">{criterion.name}</legend>
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="max-w-xl">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">{criterion.name}</p>
                        {criterion.required && (
                          <Badge tone="warning">Obligatorio</Badge>
                        )}
                      </div>
                      <p className="mt-1 text-xs leading-5 text-ink/55">
                        {criterion.description}
                      </p>
                    </div>
                    <div className="grid shrink-0 grid-cols-3 gap-1 rounded-xl bg-mist p-1">
                      {(["Cumple", "Parcial", "No cumple"] as const).map(
                        (rating) => (
                          <button
                            key={rating}
                            type="button"
                            onClick={() =>
                              setValue(`ratings.${criterion.id}`, rating, {
                                shouldDirty: true,
                              })
                            }
                            className={`min-h-9 rounded-lg px-2 text-[.68rem] font-bold transition-colors ${ratings[criterion.id] === rating ? (rating === "Cumple" ? "bg-sage text-white" : rating === "No cumple" ? "bg-clay text-white" : "bg-white text-ink shadow-sm") : "text-ink/55 hover:bg-white/70"}`}
                            aria-pressed={ratings[criterion.id] === rating}
                          >
                            {rating}
                          </button>
                        ),
                      )}
                    </div>
                  </div>
                </fieldset>
              ))}
            </div>
          </Card>
          <Card className="p-5 sm:p-7">
            <h2 className="text-xl font-extrabold">Resultado de la revisión</h2>
            <div className="mt-5 grid gap-5 lg:grid-cols-[240px_1fr]">
              <div>
                <label className="field-label" htmlFor="status">
                  Estado resultante
                </label>
                <select
                  id="status"
                  className="input-base"
                  {...register("status")}
                >
                  {evaluationStatuses.map((status) => (
                    <option key={status}>{status}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="field-label" htmlFor="observations">
                  Observaciones y motivo
                </label>
                <Textarea
                  id="observations"
                  placeholder="Describe la evidencia considerada y cualquier seguimiento necesario…"
                  {...register("observations", {
                    required:
                      "Registra una observación para conservar el contexto.",
                  })}
                />
                <FieldError>{errors.observations?.message}</FieldError>
                <p className="field-help">
                  Es obligatorio explicar estados de descarte o información
                  pendiente.
                </p>
              </div>
            </div>
            <div className="mt-6 flex flex-col-reverse gap-3 border-t border-ink/10 pt-5 sm:flex-row sm:items-center sm:justify-between">
              <p className="flex items-center gap-2 text-xs text-ink/50">
                <AlertCircle className="size-4" />
                Se registrarán autor, fecha y valores anteriores.
              </p>
              <Button type="submit" disabled={isSubmitting}>
                <CheckCircle2 className="size-4" />
                {isSubmitting ? "Guardando evaluación…" : "Guardar evaluación"}
              </Button>
            </div>
          </Card>
        </div>
      </form>
    </>
  );
}
