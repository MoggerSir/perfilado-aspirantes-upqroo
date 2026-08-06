import {
  ArrowLeft,
  Briefcase,
  CalendarDays,
  Download,
  FileText,
  GraduationCap,
  History,
  Mail,
  MessageSquareText,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@/lib/router-components";
import { useNavigate, useParams } from "@/lib/router-hooks";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, LoadingState } from "@/components/ui/feedback";
import { Progress } from "@/components/ui/progress";
import { candidateDetailQueryOptions } from "@/features/candidates/candidate-queries";

export function CandidateDetailPage() {
  const { candidateId = "" } = useParams();
  const navigate = useNavigate();
  const candidateQuery = useQuery(candidateDetailQueryOptions(candidateId));
  const candidate = candidateQuery.data;

  if (candidateQuery.isPending)
    return <LoadingState label="Abriendo expediente…" />;
  if (!candidate)
    return (
      <EmptyState
        title="Expediente no disponible"
        description="El registro solicitado no existe o tu acceso ya no está vigente."
        action={
          <Button onClick={() => navigate("/app/aspirantes")}>
            Volver a aspirantes
          </Button>
        }
      />
    );
  return (
    <>
      <Link
        to="/app/aspirantes"
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink"
      >
        <ArrowLeft className="size-4" />
        Volver a aspirantes
      </Link>
      <header className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">
        <div className="flex min-w-0 items-start gap-4">
          <div className="grid size-16 shrink-0 place-items-center rounded-2xl border border-slateblue/30 bg-[#e3ebf0] font-display text-xl font-extrabold text-slateblue">
            {candidate.initials}
          </div>
          <div>
            <div className="flex flex-wrap gap-2">
              <StatusBadge status={candidate.status} />
              {candidate.previousEmployment && (
                <Badge tone="success">Trabajó previamente</Badge>
              )}
            </div>
            <h1 className="mt-3 text-3xl font-extrabold leading-tight sm:text-4xl">
              {candidate.name}
            </h1>
            <p className="mt-2 text-sm text-ink/55">{candidate.batchName}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary">
            <MessageSquareText className="size-4" />
            Preparar contacto
          </Button>
          <Button asChild>
            <Link to={`/app/evaluacion?candidate=${candidate.id}`}>
              Continuar evaluación
            </Link>
          </Button>
        </div>
      </header>
      <div className="grid min-w-0 gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <div className="min-w-0 space-y-6">
          <Card className="p-5 sm:p-7">
            <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {[
                {
                  icon: GraduationCap,
                  label: "Formación",
                  value: candidate.education,
                },
                {
                  icon: Briefcase,
                  label: "Experiencia",
                  value: `${candidate.experienceYears} años`,
                },
                {
                  icon: ShieldCheck,
                  label: "Dominio",
                  value: candidate.englishLevel,
                },
                {
                  icon: CalendarDays,
                  label: "Disponibilidad",
                  value: candidate.availability,
                },
              ].map(({ icon: Icon, label, value }) => (
                <div key={label}>
                  <Icon className="size-5 text-sage" />
                  <p className="mt-3 text-xs font-bold uppercase tracking-wider text-ink/45">
                    {label}
                  </p>
                  <p className="mt-1 text-sm font-semibold leading-5">
                    {value}
                  </p>
                </div>
              ))}
            </div>
            <div className="mt-7 grid gap-3 border-t border-ink/10 pt-6 sm:grid-cols-2">
              <p className="flex items-center gap-3 text-sm">
                <Mail className="size-4 text-sage" />
                {candidate.email}
              </p>
              <p className="flex items-center gap-3 text-sm">
                <Phone className="size-4 text-sage" />
                {candidate.phone}
              </p>
            </div>
          </Card>
          {candidate.previousParticipation && (
            <Card className="border-slateblue/35 bg-[#e8eff3] p-5 shadow-none sm:p-6">
              <p className="eyebrow text-slateblue">
                Coincidencia histórica confirmada
              </p>
              <h2 className="mt-2 text-xl font-extrabold">
                Este perfil ya tiene contexto institucional.
              </h2>
              <p className="mt-2 text-sm leading-6 text-ink/65">
                La evidencia muestra una participación anterior
                {candidate.previousEmployment
                  ? " y una relación laboral previa"
                  : ""}
                . Consulta la línea de tiempo antes de registrar una nueva
                decisión.
              </p>
            </Card>
          )}
          <Card className="overflow-hidden">
            <div className="border-b border-ink/15 p-5 sm:px-6">
              <h2 className="text-xl font-extrabold">
                Documentos del expediente
              </h2>
              <p className="mt-1 text-xs text-ink/50">
                Archivos simulados · el acceso real estará sujeto a permisos.
              </p>
            </div>
            <div className="divide-y divide-ink/10">
              {candidate.documents.map((document) => (
                <div
                  key={document.id}
                  className="flex items-center gap-3 p-4 sm:px-6"
                >
                  <div className="grid size-10 shrink-0 place-items-center rounded-xl bg-mist">
                    <FileText className="size-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-bold">
                      {document.name}
                    </p>
                    <p className="mt-1 text-xs text-ink/45">
                      {document.type} · {document.receivedAt}
                    </p>
                  </div>
                  <StatusBadge status={document.state} />
                  {document.state !== "Faltante" && (
                    <Button
                      variant="ghost"
                      size="icon"
                      aria-label={`Descargar ${document.name}`}
                    >
                      <Download className="size-4" />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </Card>
        </div>
        <aside className="min-w-0 space-y-6">
          <Card className="p-5 shadow-none">
            <h2 className="text-lg font-extrabold">
              Integridad del expediente
            </h2>
            <div className="mt-5">
              <Progress
                value={candidate.completeness}
                label="Documentación disponible"
              />
            </div>
            <p className="mt-4 text-xs leading-5 text-ink/55">
              La integridad indica presencia documental, no validez del perfil.
            </p>
          </Card>
          <Card className="p-5 shadow-none">
            <div className="flex items-center gap-2">
              <History className="size-5 text-sage" />
              <h2 className="text-lg font-extrabold">Línea de tiempo</h2>
            </div>
            <ol className="mt-5 space-y-5">
              {candidate.history.map((event) => (
                <li
                  key={event.id}
                  className="relative border-l border-ink/20 pl-5"
                >
                  <span className="absolute -left-1.5 top-0 size-3 rounded-full border-2 border-white bg-sage" />
                  <p className="text-xs font-bold text-ink/45">{event.date}</p>
                  <p className="mt-1 text-sm font-bold">{event.title}</p>
                  <p className="mt-1 text-xs leading-5 text-ink/60">
                    {event.description}
                  </p>
                  <p className="mt-2 text-[.68rem] font-semibold text-ink/40">
                    {event.author}
                  </p>
                </li>
              ))}
            </ol>
          </Card>
        </aside>
      </div>
    </>
  );
}
