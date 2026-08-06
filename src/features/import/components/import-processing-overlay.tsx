import { createPortal } from "react-dom";
import {
  Check,
  CircleDashed,
  FileStack,
  Layers3,
  LockKeyhole,
} from "lucide-react";
import {
  getImportProgress,
  importSimulationStages,
} from "@/features/import/import-simulation";

export function ImportProcessingOverlay({
  stageIndex,
  files,
}: {
  stageIndex: number;
  files: File[];
}) {
  const currentStage = importSimulationStages[stageIndex];
  const CurrentStageIcon = currentStage.icon;
  const progress = getImportProgress(stageIndex);

  return createPortal(
    <section
      className="import-processing-surface fixed inset-x-0 bottom-0 top-[4.5rem] z-40 overflow-y-auto bg-paper lg:left-[260px]"
      aria-label="Procesando expedientes"
      aria-live="polite"
      aria-busy="true"
    >
      <div className="mx-auto flex min-h-full w-full max-w-6xl items-center px-5 py-10 sm:px-8 lg:px-12">
        <div className="w-full">
          <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="eyebrow">Simulación de pipeline documental</p>
              <h2 className="mt-2 text-2xl font-extrabold sm:text-3xl">
                Estamos preparando el lote para revisión.
              </h2>
            </div>
            <div className="flex items-center gap-2 rounded-full border border-sage/30 bg-sage-soft px-3 py-2 text-xs font-bold text-[#36543d]">
              <span className="import-live-dot size-2 rounded-full bg-sage" />
              Proceso activo
            </div>
          </div>

          <div className="editorial-card grid overflow-hidden lg:grid-cols-[.78fr_1.22fr]">
            <div className="relative grid min-h-72 place-items-center overflow-hidden border-b border-ink/15 bg-ink p-8 text-white lg:min-h-[430px] lg:border-b-0 lg:border-r">
              <div className="import-scan-line absolute inset-x-0 top-0 h-px bg-[#b8c9ba]" />
              <div className="relative grid size-52 place-items-center sm:size-60">
                <span className="import-orbit-ring absolute inset-0 rounded-full border border-white/15" />
                <span className="import-orbit-ring import-orbit-ring-reverse absolute inset-7 rounded-full border border-dashed border-white/25" />
                <span className="import-core-pulse absolute inset-[4.2rem] rounded-full bg-sage/40 sm:inset-20" />
                <div className="relative grid size-20 place-items-center rounded-[1.7rem] border border-white/25 bg-white/10 shadow-[0_0_0_10px_rgba(255,255,255,.035)]">
                  <CurrentStageIcon className="size-9 text-[#dce6dc]" />
                </div>
                <span className="absolute right-5 top-1/2 grid size-8 place-items-center rounded-full border border-white/20 bg-ink">
                  <FileStack className="size-3.5" />
                </span>
                <span className="absolute bottom-7 left-8 grid size-7 place-items-center rounded-full border border-white/20 bg-sage">
                  <Layers3 className="size-3" />
                </span>
              </div>
              <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between text-xs text-white/60">
                <span>{files.length} archivo(s) de entrada</span>
                <span>Canal simulado</span>
              </div>
            </div>

            <div className="flex min-h-[430px] flex-col justify-between p-6 sm:p-8 lg:p-10">
              <div>
                <div className="flex items-center justify-between text-xs font-bold uppercase tracking-[.15em] text-ink/50">
                  <span>
                    Fase {stageIndex + 1} de {importSimulationStages.length}
                  </span>
                  <span>{progress}%</span>
                </div>
                <div className="mt-4 h-2 overflow-hidden rounded-full bg-ink/10">
                  <div
                    className="import-progress h-full origin-left rounded-full bg-sage"
                    style={{ transform: `scaleX(${progress / 100})` }}
                  />
                </div>

                <div
                  key={currentStage.label}
                  className="import-stage-enter mt-9"
                >
                  <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[.16em] text-sage">
                    <CircleDashed className="size-4" />
                    {currentStage.detail}
                  </p>
                  <p className="mt-3 font-display text-[clamp(2.2rem,5vw,4.6rem)] font-extrabold leading-[.95] tracking-[-.055em]">
                    {currentStage.label}
                  </p>
                  <p className="mt-5 max-w-xl text-sm leading-6 text-ink/60 sm:text-base">
                    {currentStage.description}
                  </p>
                </div>
              </div>

              <ol
                className="mt-10 grid grid-cols-4 gap-2 sm:grid-cols-7"
                aria-label="Avance del proceso"
              >
                {importSimulationStages.map((stage, index) => {
                  const completed = index < stageIndex;
                  const current = index === stageIndex;
                  return (
                    <li key={stage.label} className="min-w-0 text-center">
                      <span
                        className={`mx-auto grid size-8 place-items-center rounded-full border text-[.65rem] font-bold transition-colors ${
                          completed
                            ? "border-sage bg-sage text-white"
                            : current
                              ? "border-ink bg-ink text-white"
                              : "border-ink/20 bg-white text-ink/40"
                        }`}
                      >
                        {completed ? <Check className="size-3.5" /> : index + 1}
                      </span>
                      <span className="mt-2 hidden truncate text-[.6rem] font-semibold text-ink/45 sm:block">
                        {stage.label.split(" ")[0]}
                      </span>
                    </li>
                  );
                })}
              </ol>
            </div>
          </div>

          <p className="mt-5 flex items-center justify-center gap-2 text-center text-xs text-ink/50">
            <LockKeyhole className="size-3.5" />
            Los resultados son simulados y todavía requerirán confirmación
            humana.
          </p>
        </div>
      </div>
    </section>,
    document.body,
  );
}
