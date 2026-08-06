import {
  ArrowRight,
  Briefcase,
  Clock3,
  GraduationCap,
  History,
  Mail,
  MessageCircle,
} from "lucide-react";
import { Link } from "@/lib/router-components";
import type { Candidate } from "@/core/domain/models";
import { Badge, StatusBadge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";

function createWhatsAppUrl(candidate: Candidate) {
  const phone = candidate.phone.replace(/\D/g, "");
  const message = encodeURIComponent(
    `Hola, ${candidate.name}. Me comunico desde la Dirección de Idiomas para dar seguimiento a tu expediente.`,
  );

  return `https://wa.me/52${phone}?text=${message}`;
}

function createEmailUrl(candidate: Candidate) {
  const subject = encodeURIComponent("Seguimiento a tu expediente");
  const message = encodeURIComponent(
    `Hola, ${candidate.name}:\n\nMe comunico desde la Dirección de Idiomas para dar seguimiento a tu expediente.`,
  );

  return `mailto:${candidate.email}?subject=${subject}&body=${message}`;
}

export function CandidateCard({ candidate }: { candidate: Candidate }) {
  return (
    <article
      className="editorial-card motion-card-interactive group flex h-full flex-col p-5"
      data-candidate-card
    >
      <div
        className="flex items-start justify-between gap-3"
        data-candidate-content
      >
        <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-slateblue/30 bg-[#e3ebf0] font-display font-extrabold text-slateblue">
          {candidate.initials}
        </div>
        <StatusBadge status={candidate.status} />
      </div>
      <div data-candidate-content>
        <h2 className="mt-4 text-lg font-extrabold leading-tight">
          {candidate.name}
        </h2>
        <p className="mt-1 text-xs text-ink/55">{candidate.batchName}</p>
      </div>
      <div
        className="mt-4 space-y-2.5 text-xs text-ink/70"
        data-candidate-content
      >
        <p className="flex gap-2">
          <GraduationCap className="size-4 shrink-0 text-sage" />
          {candidate.education}
        </p>
        <p className="flex gap-2">
          <Briefcase className="size-4 shrink-0 text-sage" />
          {candidate.experienceYears} años de experiencia
        </p>
        {candidate.previousParticipation && (
          <p className="flex gap-2 font-semibold text-slateblue">
            <History className="size-4 shrink-0" />
            Participación anterior identificada
          </p>
        )}
      </div>
      <div className="mt-4 flex flex-wrap gap-1.5" data-candidate-content>
        {candidate.tags.slice(0, 3).map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>
      <div className="mt-auto pt-5" data-candidate-content>
        <Progress value={candidate.completeness} label="Expediente" />
        <div className="mt-4 border-t border-ink/10 pt-4">
          <p className="mb-2 text-[.68rem] font-bold uppercase tracking-[.13em] text-ink/45">
            Contactar aspirante
          </p>
          <div className="grid grid-cols-2 gap-2">
            <Button
              asChild
              size="sm"
              variant="secondary"
              className="border-sage/35 bg-sage-soft text-[#36543d] hover:border-sage hover:bg-sage hover:text-white"
            >
              <a
                href={createWhatsAppUrl(candidate)}
                target="_blank"
                rel="noreferrer"
                aria-label={`Contactar a ${candidate.name} por WhatsApp`}
              >
                <MessageCircle className="size-3.5" />
                WhatsApp
              </a>
            </Button>
            <Button asChild size="sm" variant="secondary">
              <a
                href={createEmailUrl(candidate)}
                aria-label={`Enviar correo a ${candidate.name}`}
              >
                <Mail className="size-3.5" />
                Correo
              </a>
            </Button>
          </div>
        </div>
        <div className="mt-4 flex items-center justify-between border-t border-ink/10 pt-4">
          <span className="flex items-center gap-1.5 text-xs text-ink/50">
            <Clock3 className="size-3.5" />
            {candidate.lastUpdated}
          </span>
          <Link
            to={`/app/aspirantes/${candidate.id}`}
            className="inline-flex min-h-10 items-center gap-1.5 rounded-lg px-2 text-xs font-bold text-sage hover:bg-sage-soft"
          >
            Ver expediente <ArrowRight className="motion-icon-shift size-3.5" />
          </Link>
        </div>
      </div>
    </article>
  );
}
