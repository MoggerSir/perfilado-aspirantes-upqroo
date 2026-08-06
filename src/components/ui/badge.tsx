import type { CandidateStatus, DocumentState } from "@/core/domain/models";
import { cn } from "@/lib/utils";

type BadgeTone = "neutral" | "success" | "warning" | "danger" | "info";
const tones: Record<BadgeTone, string> = {
  neutral: "border-ink/20 bg-mist text-ink/75",
  success: "border-sage/35 bg-sage-soft text-[#36543d]",
  warning: "border-[#c69a4a]/40 bg-[#f8edcf] text-[#72531b]",
  danger: "border-clay/35 bg-clay-soft text-[#7b3d2d]",
  info: "border-slateblue/30 bg-[#e3ebf0] text-[#425b6c]",
};

export function Badge({
  children,
  tone = "neutral",
  className,
}: {
  children: React.ReactNode;
  tone?: BadgeTone;
  className?: string;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-1 text-[.68rem] font-bold leading-none",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function StatusBadge({
  status,
}: {
  status: CandidateStatus | DocumentState;
}) {
  const tone: BadgeTone = ["Perfil viable", "Vigente"].includes(status)
    ? "success"
    : ["Pendiente de información", "Por revisar"].includes(status)
      ? "warning"
      : ["Perfil no viable", "Faltante"].includes(status)
        ? "danger"
        : ["En evaluación"].includes(status)
          ? "info"
          : "neutral";
  return <Badge tone={tone}>{status}</Badge>;
}
