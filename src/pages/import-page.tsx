import {
  FileSearch2,
  History,
  ScanLine,
  Sparkles,
  UploadCloud,
  UsersRound,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import type { ImportResult } from "@/core/domain/models";
import { services } from "@/core/infrastructure/container";
import { reviewBatches } from "@/data/mock-data";
import { PageHeader } from "@/components/layout/page-header";
import { Card } from "@/components/ui/card";
import { InlineAlert } from "@/components/ui/feedback";
import { ImportProcessingOverlay } from "@/features/import/components/import-processing-overlay";
import { ImportResults } from "@/features/import/components/import-results";
import {
  importSimulationStages,
  waitForImportStage,
} from "@/features/import/import-simulation";

function uniqueFiles(selectedFiles: File[]) {
  return selectedFiles.filter(
    (file, index, collection) =>
      collection.findIndex(
        (currentFile) =>
          currentFile.name === file.name && currentFile.size === file.size,
      ) === index,
  );
}

export function ImportPage() {
  const fileInput = useRef<HTMLInputElement>(null);
  const activeRun = useRef(0);
  const [batchId, setBatchId] = useState(reviewBatches[0].id);
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [processing, setProcessing] = useState(false);
  const [stageIndex, setStageIndex] = useState(0);
  const [result, setResult] = useState<ImportResult>();

  useEffect(
    () => () => {
      activeRun.current += 1;
    },
    [],
  );

  const startSimulation = async (selectedFiles: File[]) => {
    const nextFiles = uniqueFiles(selectedFiles);
    if (nextFiles.length === 0 || processing) {
      if (nextFiles.length === 0)
        toast.error("Suelta al menos un archivo para iniciar la simulación.");
      return;
    }

    const runId = activeRun.current + 1;
    activeRun.current = runId;
    setFiles(nextFiles);
    setResult(undefined);
    setStageIndex(0);
    setProcessing(true);

    const resultPromise = services.importCandidateFiles.execute(
      batchId,
      nextFiles,
    );

    try {
      for (let index = 0; index < importSimulationStages.length; index += 1) {
        if (activeRun.current !== runId) return;
        setStageIndex(index);
        await waitForImportStage();
      }

      const nextResult = await resultPromise;
      if (activeRun.current !== runId) return;
      setResult(nextResult);
      setProcessing(false);
      toast.success("Lectura simulada completada");
    } catch (error) {
      if (activeRun.current !== runId) return;
      setProcessing(false);
      toast.error(
        error instanceof Error
          ? error.message
          : "No se pudo completar la simulación.",
      );
    }
  };

  const resetSimulation = () => {
    activeRun.current += 1;
    setFiles([]);
    setResult(undefined);
    setProcessing(false);
    setStageIndex(0);
  };

  return (
    <>
      <PageHeader
        eyebrow="CU-002 · Importación controlada"
        title="Importar expedientes"
        description="Arrastra cualquier archivo para recorrer una simulación completa de recepción, extracción, cruce histórico y perfilado. El resultado demuestra el comportamiento esperado, no procesa información real."
      />

      {result ? (
        <ImportResults result={result} onReset={resetSimulation} />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_380px]">
          <Card className="overflow-hidden p-5 sm:p-7">
            <div className="flex flex-col gap-5 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-xl">
                <label className="field-label" htmlFor="batch">
                  Lote recibido
                </label>
                <select
                  id="batch"
                  value={batchId}
                  onChange={(event) => setBatchId(event.target.value)}
                  className="input-base sm:min-w-80"
                >
                  {reviewBatches.map((batch) => (
                    <option key={batch.id} value={batch.id}>
                      {batch.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center gap-2 text-xs font-semibold text-ink/50">
                <Sparkles className="size-4 text-sage" />
                Resultado constante de demostración
              </div>
            </div>

            <button
              type="button"
              onClick={() => fileInput.current?.click()}
              onDragEnter={(event) => {
                event.preventDefault();
                setDragActive(true);
              }}
              onDragLeave={(event) => {
                if (
                  event.relatedTarget instanceof Node &&
                  event.currentTarget.contains(event.relatedTarget)
                )
                  return;
                setDragActive(false);
              }}
              onDrop={(event) => {
                event.preventDefault();
                setDragActive(false);
                void startSimulation(Array.from(event.dataTransfer.files));
              }}
              onDragOver={(event) => {
                event.preventDefault();
                event.dataTransfer.dropEffect = "copy";
              }}
              className={`import-drop-zone group relative mt-6 flex min-h-[330px] w-full flex-col items-center justify-center overflow-hidden rounded-[1.6rem] border-2 border-dashed px-6 text-center transition-colors ${
                dragActive
                  ? "border-sage bg-sage-soft/70"
                  : "border-slateblue/40 bg-[#edf2f4] hover:border-sage hover:bg-sage-soft/40"
              }`}
              aria-label="Arrastrar o seleccionar archivos para simular la importación"
            >
              <span className="import-drop-orbit absolute size-56 rounded-full border border-slateblue/10" />
              <span className="import-drop-orbit import-drop-orbit-delayed absolute size-40 rounded-full border border-dashed border-slateblue/20" />
              <div
                className={`relative grid size-20 place-items-center rounded-[1.7rem] border bg-white shadow-[5px_5px_0_rgba(34,38,34,.1)] transition-transform ${
                  dragActive
                    ? "scale-105 border-sage text-sage"
                    : "border-slateblue/25 text-slateblue group-hover:-translate-y-1"
                }`}
              >
                <UploadCloud className="size-9" />
              </div>
              <p className="relative mt-7 text-xl font-extrabold sm:text-2xl">
                {dragActive
                  ? "Suéltalo para iniciar"
                  : "Arrastra cualquier archivo aquí"}
              </p>
              <p className="relative mt-3 max-w-lg text-sm leading-6 text-ink/55">
                PDF, ZIP, imágenes, hojas de cálculo o cualquier otro formato
                servirán para activar el mismo recorrido demostrativo.
              </p>
              <span className="relative mt-6 rounded-xl border border-ink/20 bg-white px-4 py-2.5 text-xs font-bold shadow-sm">
                Seleccionar desde el equipo
              </span>
              <div className="relative mt-7 flex flex-wrap justify-center gap-2 text-[.66rem] font-bold uppercase tracking-[.12em] text-ink/45">
                <span>Extracción</span>
                <span>·</span>
                <span>Historial</span>
                <span>·</span>
                <span>Requisitos</span>
                <span>·</span>
                <span>Trazabilidad</span>
              </div>
            </button>
            <input
              ref={fileInput}
              type="file"
              multiple
              className="sr-only"
              onChange={(event) => {
                void startSimulation(Array.from(event.target.files ?? []));
                event.target.value = "";
              }}
              aria-label="Seleccionar archivos para simular la importación"
            />
          </Card>

          <aside className="space-y-4">
            <Card className="p-5 shadow-none sm:p-6">
              <p className="eyebrow">Recorrido simulado</p>
              <h2 className="mt-2 text-lg font-extrabold">
                De archivos a una revisión ordenada
              </h2>
              <ol className="mt-6 space-y-5">
                {[
                  {
                    icon: FileSearch2,
                    title: "Lectura documental",
                    text: "Reconoce datos, documentos y posibles incidencias.",
                  },
                  {
                    icon: UsersRound,
                    title: "Agrupación por aspirante",
                    text: "Organiza la evidencia en expedientes probables.",
                  },
                  {
                    icon: History,
                    title: "Cruce institucional",
                    text: "Señala participación y experiencia anteriores.",
                  },
                  {
                    icon: ScanLine,
                    title: "Perfilado preliminar",
                    text: "Contrasta requisitos sin tomar la decisión final.",
                  },
                ].map(({ icon: Icon, title, text }, index) => (
                  <li key={title} className="flex gap-3">
                    <div className="grid size-9 shrink-0 place-items-center rounded-xl bg-mist text-sage">
                      <Icon className="size-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold">
                        <span className="mr-2 text-ink/35">0{index + 1}</span>
                        {title}
                      </p>
                      <p className="mt-1 text-xs leading-5 text-ink/55">
                        {text}
                      </p>
                    </div>
                  </li>
                ))}
              </ol>
            </Card>
            <InlineAlert title="Demostración segura">
              El archivo solo activa la animación local. No se carga a un
              servidor ni se extraen datos reales.
            </InlineAlert>
          </aside>
        </div>
      )}

      {processing && (
        <ImportProcessingOverlay stageIndex={stageIndex} files={files} />
      )}
    </>
  );
}
