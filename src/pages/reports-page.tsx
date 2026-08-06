import {
  Archive,
  CalendarRange,
  Download,
  FileSpreadsheet,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reviewBatches } from "@/data/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, InlineAlert } from "@/components/ui/feedback";

export function ReportsPage() {
  const [reportType, setReportType] = useState("Resumen por estado");
  const [generated, setGenerated] = useState(false);
  const generate = () => {
    setGenerated(true);
    toast.success("Reporte simulado generado");
  };
  return (
    <>
      <PageHeader
        eyebrow="CU-010 · Fecha de corte"
        title="Reportes y respaldos"
        description="Prepara listados autorizados y deja visible el alcance de los datos sensibles antes de producir un archivo."
      />
      <div className="grid gap-6 xl:grid-cols-[420px_1fr]">
        <Card className="p-5 shadow-none sm:p-6">
          <h2 className="text-xl font-extrabold">Configurar reporte</h2>
          <div className="mt-6 space-y-4">
            <div>
              <label className="field-label" htmlFor="report-type">
                Tipo de salida
              </label>
              <select
                id="report-type"
                value={reportType}
                onChange={(event) => setReportType(event.target.value)}
                className="input-base"
              >
                <option>Resumen por estado</option>
                <option>Expedientes incompletos</option>
                <option>Historial de evaluaciones</option>
                <option>Respaldo autorizado</option>
              </select>
            </div>
            <div className="motion-content-reveal">
              <label className="field-label" htmlFor="report-batch">
                Lote recibido
              </label>
              <select id="report-batch" className="input-base">
                <option>Todos los lotes recibidos</option>
                {reviewBatches.map((batch) => (
                  <option key={batch.id}>{batch.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="field-label" htmlFor="report-format">
                Formato
              </label>
              <select id="report-format" className="input-base">
                <option>PDF · vista institucional</option>
                <option>CSV · datos tabulares</option>
              </select>
            </div>
            <InlineAlert title="Datos personales incluidos">
              La generación quedará registrada en bitácora y requiere permiso de
              Coordinación.
            </InlineAlert>
            <Button className="w-full" onClick={generate}>
              <FileSpreadsheet className="size-4" />
              Generar reporte
            </Button>
          </div>
        </Card>
        <Card className="min-h-[430px] p-5 shadow-none sm:p-7">
          {generated ? (
            <div>
              <div className="flex items-start justify-between gap-4 border-b border-ink/15 pb-6">
                <div>
                  <p className="eyebrow">Vista previa</p>
                  <h2 className="mt-2 text-2xl font-extrabold">{reportType}</h2>
                  <p className="mt-2 text-xs text-ink/50">
                    Fecha de corte: 04 ago 2026 · 10:15
                  </p>
                </div>
                <Button
                  onClick={() => toast.success("Descarga simulada iniciada")}
                >
                  <Download className="size-4" />
                  Descargar
                </Button>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                {[
                  ["Total de perfiles", "66"],
                  ["En evaluación", "14"],
                  ["Pendientes", "7"],
                ].map(([label, count]) => (
                  <div
                    key={label}
                    className="rounded-2xl border border-ink/15 bg-paper p-5"
                  >
                    <p className="text-xs text-ink/50">{label}</p>
                    <p className="mt-2 text-3xl font-extrabold">{count}</p>
                  </div>
                ))}
              </div>
              <div className="mt-6 rounded-2xl border border-ink/15 p-5">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <CalendarRange className="size-4 text-sage" />
                  Alcance del archivo
                </p>
                <ul className="mt-4 grid gap-2 text-xs text-ink/60 sm:grid-cols-2">
                  <li>• Identificador del expediente</li>
                  <li>• Nombre del aspirante</li>
                  <li>• Lote recibido y estado de revisión</li>
                  <li>• Fecha de última evaluación</li>
                </ul>
              </div>
            </div>
          ) : (
            <EmptyState
              title="Configura y genera una vista previa"
              description="El reporte no se producirá hasta confirmar su tipo, lote recibido, formato y alcance de datos."
              action={<Archive className="mx-auto size-8 text-ink/25" />}
            />
          )}
        </Card>
      </div>
      <div className="mt-6 flex items-start gap-3 rounded-xl border border-ink/15 bg-white p-4 text-xs text-ink/55">
        <LockKeyhole className="mt-0.5 size-4 shrink-0 text-sage" />
        <p>
          Los respaldos reales requerirán política institucional de retención,
          cifrado y eliminación. En este prototipo no se descargan datos
          personales reales.
        </p>
      </div>
    </>
  );
}
