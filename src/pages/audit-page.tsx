import { LockKeyhole, Search, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { LoadingState } from "@/components/ui/feedback";
import { useStaggerAnimation } from "@/hooks/use-stagger-animation";
import { auditEventsQueryOptions } from "@/features/audit/audit-queries";

export function AuditPage() {
  const [search, setSearch] = useState("");
  const auditQuery = useQuery(auditEventsQueryOptions);
  const events = auditQuery.data ?? [];
  const visible = events.filter((event) =>
    `${event.user} ${event.action} ${event.resource}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );
  const visibleEventKey = visible.map((event) => event.id).join("|");
  const rowsScope = useStaggerAnimation<HTMLTableSectionElement>([
    auditQuery.isPending,
    visibleEventKey,
  ]);
  return (
    <>
      <PageHeader
        eyebrow="RNF-004 · 100% trazable"
        title="Bitácora de actividad"
        description="Consulta eventos autorizados de altas, modificaciones, evaluaciones, estados y accesos a documentos. Los registros no pueden editarse desde esta vista."
      />
      <Card className="overflow-hidden shadow-none">
        <div className="flex flex-col gap-4 border-b border-ink/15 p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
          <label className="relative w-full max-w-md">
            <span className="sr-only">Buscar en bitácora</span>
            <Search className="absolute left-3.5 top-3.5 size-4 text-ink/40" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              className="pl-10"
              placeholder="Usuario, acción o expediente…"
            />
          </label>
          <Badge tone="success">
            <ShieldCheck className="mr-1.5 size-3" />
            Registro íntegro
          </Badge>
        </div>
        {auditQuery.isPending ? (
          <LoadingState />
        ) : auditQuery.isError ? (
          <div className="p-5">
            <p role="alert" className="text-sm font-semibold text-clay">
              No se pudo recuperar la bitácora conservada.
            </p>
          </div>
        ) : (
          <div
            className="overflow-x-auto"
            tabIndex={0}
            aria-label="Registros de la bitácora"
          >
            <table className="w-full min-w-[760px] text-left text-sm">
              <thead className="bg-mist/55 text-[.68rem] uppercase tracking-wider text-ink/50">
                <tr>
                  <th className="px-5 py-3">Fecha</th>
                  <th className="px-5 py-3">Usuario</th>
                  <th className="px-5 py-3">Acción</th>
                  <th className="px-5 py-3">Recurso</th>
                  <th className="px-5 py-3">Detalle</th>
                </tr>
              </thead>
              <tbody ref={rowsScope} className="divide-y divide-ink/10">
                {visible.map((event) => (
                  <tr key={event.id} className="hover:bg-mist/30">
                    <td className="whitespace-nowrap px-5 py-4 text-xs text-ink/50">
                      {event.date}
                    </td>
                    <td className="px-5 py-4 font-semibold">{event.user}</td>
                    <td className="px-5 py-4">
                      <Badge>{event.action}</Badge>
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {event.resource}
                    </td>
                    <td className="px-5 py-4 text-xs text-ink/60">
                      {event.detail}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>
      <div className="mt-5 flex items-start gap-3 rounded-xl bg-ink p-4 text-xs text-white/65">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-[#b8c9ba]" />
        <p>
          Vista restringida. En producción, los permisos y cada intento de
          acceso no autorizado deberán registrarse.
        </p>
      </div>
    </>
  );
}
