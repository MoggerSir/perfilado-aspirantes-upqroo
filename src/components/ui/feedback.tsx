import { AlertTriangle, CheckCircle2, Inbox, LoaderCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export function LoadingState({
  label = "Cargando información…",
}: {
  label?: string;
}) {
  return (
    <div
      className="grid min-h-56 place-items-center text-center"
      role="status"
      aria-live="polite"
    >
      <div className="w-full max-w-sm px-6">
        <LoaderCircle className="mx-auto mb-4 size-6 animate-spin text-sage" />
        <p className="text-sm font-semibold">{label}</p>
        <div className="mx-auto mt-5 space-y-2" aria-hidden="true">
          <div className="motion-skeleton h-2.5 w-full rounded-full" />
          <div className="motion-skeleton mx-auto h-2.5 w-4/5 rounded-full" />
        </div>
      </div>
    </div>
  );
}
export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="motion-content-reveal rounded-2xl border border-dashed border-ink/30 bg-white/50 px-5 py-12 text-center">
      <Inbox className="motion-state-icon mx-auto mb-4 size-9 text-sage" />
      <h3 className="text-lg font-bold">{title}</h3>
      <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink/60">
        {description}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
export function InlineAlert({
  title,
  children,
  tone = "warning",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "warning" | "success";
}) {
  const Icon = tone === "success" ? CheckCircle2 : AlertTriangle;
  return (
    <div
      className={cn(
        "motion-content-reveal flex gap-3 rounded-xl border p-4 text-sm",
        tone === "success"
          ? "border-sage/30 bg-sage-soft/60"
          : "border-[#c69a4a]/35 bg-[#fff5d8]",
      )}
    >
      <Icon className="mt-0.5 size-5 shrink-0" />
      <div>
        <p className="font-bold">{title}</p>
        <div className="mt-1 leading-relaxed text-ink/70">{children}</div>
      </div>
    </div>
  );
}
