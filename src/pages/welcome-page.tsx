import {
  ArrowRight,
  CheckCircle2,
  FileSearch,
  History,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import { Link } from "@/lib/router-components";
import { Button } from "@/components/ui/button";
import { useEntranceAnimation } from "@/hooks/use-entrance-animation";

function getTimeBasedGreeting(date = new Date()) {
  const hour = date.getHours();

  if (hour < 12) return "Buenos días";
  if (hour < 19) return "Buenas tardes";
  return "Buenas noches";
}

export function WelcomePage() {
  const motionScope = useEntranceAnimation<HTMLElement>(["welcome"]);
  const greeting = getTimeBasedGreeting();

  return (
    <main ref={motionScope} className="min-h-screen overflow-hidden bg-paper">
      <div className="mx-auto max-w-7xl px-5 py-6 sm:px-8">
        <header className="flex items-center justify-between" data-motion-item>
          <div className="flex items-center gap-3">
            <div className="grid size-11 place-items-center rounded-xl border border-ink bg-sage text-sm font-extrabold text-white shadow-[3px_3px_0_#cbd6cc]">
              NI
            </div>
            <div>
              <p className="font-display text-lg font-extrabold leading-none">
                Nexo Idiomas
              </p>
              <p className="mt-1 text-[.62rem] font-bold uppercase tracking-[.16em] text-ink/50">
                Demostración académica
              </p>
            </div>
          </div>
          <Button asChild variant="secondary">
            <Link to="/acceso">Ingresar</Link>
          </Button>
        </header>
        <section className="grid min-h-[calc(100vh-100px)] items-center gap-10 py-16 lg:grid-cols-[1.1fr_.9fr]">
          <div data-motion-item>
            <p className="eyebrow flex items-center gap-2">
              <Sparkles className="size-4" />
              Dirección de Idiomas
            </p>
            <h1 className="mt-5 max-w-4xl font-display text-[clamp(3rem,7vw,6.7rem)] font-extrabold leading-[.91] tracking-[-.065em]">
              {greeting},
              <span className="block text-sage">Director de Idiomas.</span>
            </h1>
            <p className="mt-7 max-w-2xl text-base leading-7 text-ink/65 sm:text-lg">
              Una herramienta interna para organizar los expedientes que recibe
              Idiomas, revisar aspirantes y conservar evidencia histórica, sin
              sustituir la decisión humana ni las atribuciones de Recursos
              Humanos.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/acceso">
                  Recorrer el mockup <ArrowRight className="size-4" />
                </Link>
              </Button>
              <a
                href="#alcance"
                className="inline-flex min-h-11 items-center rounded-xl px-4 text-sm font-bold text-ink/65 hover:bg-ink/5"
              >
                Conocer el alcance
              </a>
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs text-ink/50">
              <ShieldCheck className="size-4" />
              Todos los datos mostrados son simulados para fines de
              demostración.
            </p>
          </div>
          <div className="relative lg:pl-10" data-motion-item>
            <div className="absolute -right-20 -top-20 size-64 rounded-full bg-lavender/80" />
            <div className="relative editorial-card rotate-[-1deg] bg-white p-5 sm:p-7">
              <div className="flex items-center justify-between border-b border-ink/15 pb-5">
                <div>
                  <p className="eyebrow">Expediente activo</p>
                  <p className="mt-2 text-xl font-extrabold">
                    Ana Sofía Martínez
                  </p>
                </div>
                <span className="rounded-full border border-sage/30 bg-sage-soft px-3 py-1 text-xs font-bold text-[#36543d]">
                  En evaluación
                </span>
              </div>
              <div className="grid gap-3 py-6 sm:grid-cols-2">
                {[
                  ["Formación académica", "Cumple"],
                  ["Dominio de inglés", "Cumple"],
                  ["Experiencia docente", "Por validar"],
                  ["Disponibilidad", "Cumple"],
                ].map(([label, state]) => (
                  <div
                    key={label}
                    className="rounded-xl border border-ink/15 bg-paper p-4"
                  >
                    <p className="text-xs text-ink/55">{label}</p>
                    <p className="mt-2 flex items-center gap-2 text-sm font-bold">
                      <CheckCircle2 className="size-4 text-sage" />
                      {state}
                    </p>
                  </div>
                ))}
              </div>
              <div className="rounded-xl border border-slateblue/25 bg-[#e8eff3] p-4">
                <p className="flex items-center gap-2 text-sm font-bold">
                  <History className="size-4" />
                  Trazabilidad encontrada
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/65">
                  Trabajó previamente en la universidad durante Primavera 2025.
                </p>
              </div>
            </div>
          </div>
        </section>
        <section id="alcance" className="grid gap-4 pb-20 md:grid-cols-3">
          {[
            {
              icon: FileSearch,
              title: "Expedientes claros",
              text: "Documentos, incidencias y datos relevantes en una sola vista.",
            },
            {
              icon: CheckCircle2,
              title: "Evaluación explicable",
              text: "Criterios visibles, observaciones y confirmación humana.",
            },
            {
              icon: History,
              title: "Memoria institucional",
              text: "Participaciones, evaluaciones y cambios conservados.",
            },
          ].map(({ icon: Icon, title, text }) => (
            <article
              key={title}
              className="rounded-2xl border border-ink/20 bg-white p-6"
              data-motion-item
            >
              <Icon className="size-6 text-sage" />
              <h2 className="mt-5 text-xl font-extrabold">{title}</h2>
              <p className="mt-2 text-sm leading-6 text-ink/60">{text}</p>
            </article>
          ))}
        </section>
      </div>
    </main>
  );
}
