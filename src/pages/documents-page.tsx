import {
  Download,
  Eye,
  FileOutput,
  FileText,
  LockKeyhole,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { reviewBatches } from "@/data/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { InlineAlert } from "@/components/ui/feedback";

const templates = [
  {
    name: "Listado de aspirantes por estado",
    version: "v2.1",
    updated: "01 ago 2026",
    status: "Vigente",
  },
  {
    name: "Resumen de revisión por lote",
    version: "v1.4",
    updated: "18 jul 2026",
    status: "Vigente",
  },
  {
    name: "Reporte de seguimiento de perfiles",
    version: "v3.0",
    updated: "04 jun 2026",
    status: "Pendiente de validar",
  },
];

export function DocumentsPage() {
  const [open, setOpen] = useState(false);
  const [template, setTemplate] = useState(templates[0].name);
  return (
    <>
      <PageHeader
        eyebrow="CU-009 · Plantillas autorizadas"
        title="Documentos de apoyo"
        description="Genera salidas internas sobre la revisión realizada por Idiomas. No produce documentos de contratación ni sustituye formatos de Recursos Humanos."
        action={
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="size-4" />
                Generar documento
              </Button>
            </DialogTrigger>
            <DialogContent
              title="Preparar documento"
              description="Los campos de este flujo son simulados hasta contar con plantillas institucionales autorizadas."
            >
              <div className="space-y-4">
                <div>
                  <label className="field-label" htmlFor="template">
                    Plantilla
                  </label>
                  <select
                    id="template"
                    value={template}
                    onChange={(event) => setTemplate(event.target.value)}
                    className="input-base"
                  >
                    {templates.map((currentTemplate) => (
                      <option key={currentTemplate.name}>
                        {currentTemplate.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="batch-document">
                    Lote recibido
                  </label>
                  <select id="batch-document" className="input-base">
                    {reviewBatches.map((batch) => (
                      <option key={batch.id}>{batch.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="field-label" htmlFor="cutoff">
                    Fecha de corte
                  </label>
                  <Input id="cutoff" type="date" defaultValue="2026-08-04" />
                </div>
                <InlineAlert title="Vista previa obligatoria">
                  Podrás revisar el contenido antes de descargar la versión
                  simulada.
                </InlineAlert>
                <div className="flex justify-end gap-2">
                  <Button variant="ghost" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button
                    onClick={() => {
                      toast.success("Vista previa generada");
                      setOpen(false);
                    }}
                  >
                    <Eye className="size-4" />
                    Generar vista previa
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        }
      />
      <div className="grid gap-5 lg:grid-cols-3">
        {templates.map((template) => (
          <Card key={template.name} className="p-5 shadow-none">
            <div className="flex items-start justify-between">
              <div className="grid size-11 place-items-center rounded-xl bg-lavender">
                <FileText className="size-5" />
              </div>
              <Badge
                tone={template.status === "Vigente" ? "success" : "warning"}
              >
                {template.status}
              </Badge>
            </div>
            <h2 className="mt-6 text-lg font-extrabold leading-tight">
              {template.name}
            </h2>
            <p className="mt-2 text-xs text-ink/50">
              Versión {template.version} · {template.updated}
            </p>
            <div className="mt-6 flex gap-2 border-t border-ink/10 pt-4">
              <Button variant="secondary" size="sm">
                <Eye className="size-4" />
                Vista previa
              </Button>
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Descargar ${template.name}`}
                disabled={template.status !== "Vigente"}
              >
                <Download className="size-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
      <Card className="mt-7 flex flex-col gap-4 bg-ink p-6 text-white shadow-none sm:flex-row sm:items-center">
        <div className="grid size-11 shrink-0 place-items-center rounded-xl bg-white/10">
          <LockKeyhole className="size-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-lg font-extrabold">Control de versiones</h2>
          <p className="mt-1 text-sm leading-6 text-white/60">
            Cada documento conserva plantilla, versión, responsable y fecha de
            generación para evitar formatos vencidos.
          </p>
        </div>
        <FileOutput className="hidden size-8 text-white/30 sm:block" />
      </Card>
    </>
  );
}
