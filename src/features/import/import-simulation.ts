import {
  Binary,
  FileCheck2,
  Files,
  History,
  ScanSearch,
  Sparkles,
  UserRoundSearch,
} from "lucide-react";

export const importSimulationStages = [
  {
    label: "Recibiendo archivos",
    description: "Asociando el material con el lote seleccionado.",
    detail: "Transferencia segura",
    icon: Files,
  },
  {
    label: "Validando estructura",
    description: "Revisando integridad, formato y disponibilidad de lectura.",
    detail: "Control documental",
    icon: FileCheck2,
  },
  {
    label: "Extrayendo información",
    description: "Reconociendo nombres, formación, experiencia y evidencias.",
    detail: "Lectura de campos",
    icon: ScanSearch,
  },
  {
    label: "Procesando documentos",
    description: "Agrupando cada archivo dentro de su expediente probable.",
    detail: "54 documentos",
    icon: Binary,
  },
  {
    label: "Cruzando historial",
    description: "Buscando participaciones y relaciones laborales anteriores.",
    detail: "Memoria institucional",
    icon: History,
  },
  {
    label: "Perfilando aspirantes",
    description: "Contrastando la evidencia con los requisitos mínimos.",
    detail: "Decisión no automática",
    icon: UserRoundSearch,
  },
  {
    label: "Preparando resultados",
    description: "Ordenando hallazgos, incidencias y prioridades de revisión.",
    detail: "Resumen para Dirección",
    icon: Sparkles,
  },
] as const;

export const IMPORT_STAGE_DURATION = 850;

export function getImportProgress(stageIndex: number) {
  return Math.round(((stageIndex + 1) / importSimulationStages.length) * 100);
}

export function waitForImportStage() {
  return new Promise<void>((resolve) => {
    window.setTimeout(resolve, IMPORT_STAGE_DURATION);
  });
}
