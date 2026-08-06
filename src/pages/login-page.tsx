import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Eye, EyeOff, LockKeyhole } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link } from "@/lib/router-components";
import { useNavigate } from "@/lib/router-hooks";
import { z } from "zod";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FieldError, Input } from "@/components/ui/input";
import { useEntranceAnimation } from "@/hooks/use-entrance-animation";
import { preloadWorkspace } from "@/app/preload-workspace";

const loginSchema = z.object({
  email: z.email("Ingresa un correo institucional válido."),
  password: z
    .string()
    .min(6, "La contraseña debe contener al menos 6 caracteres."),
});
type LoginValues = z.infer<typeof loginSchema>;

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const motionScope = useEntranceAnimation<HTMLElement>(["login"]);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "coordinacion.idiomas@upqroo.edu.mx",
      password: "demo2026",
    },
  });
  const submit = async () => {
    try {
      await Promise.all([
        new Promise((resolve) => setTimeout(resolve, 550)),
        preloadWorkspace(),
      ]);
      navigate("/app");
    } catch {
      toast.error(
        "No fue posible preparar todos los módulos. Intenta ingresar nuevamente.",
      );
    }
  };
  return (
    <main
      ref={motionScope}
      className="grid min-h-screen bg-paper lg:grid-cols-[.85fr_1.15fr]"
    >
      <section className="flex items-center px-5 py-12 sm:px-10 lg:px-[10vw]">
        <div className="w-full max-w-md">
          <Link
            to="/"
            className="mb-12 inline-flex items-center gap-2 text-sm font-bold text-ink/60 hover:text-ink"
            data-motion-item
          >
            <ArrowLeft className="size-4" />
            Volver
          </Link>
          <p className="eyebrow" data-motion-item>
            Acceso interno
          </p>
          <h1
            className="mt-3 text-4xl font-extrabold sm:text-5xl"
            data-motion-item
          >
            Continuemos con la revisión.
          </h1>
          <p className="mt-4 text-sm leading-6 text-ink/60" data-motion-item>
            Acceso simulado para presentar el flujo del Director de Idiomas.
          </p>
          <form
            onSubmit={handleSubmit(submit)}
            className="mt-9 space-y-5"
            noValidate
            data-motion-item
          >
            <div>
              <label className="field-label" htmlFor="email">
                Correo institucional
              </label>
              <Input
                id="email"
                type="email"
                autoComplete="username"
                {...register("email")}
                aria-invalid={Boolean(errors.email)}
              />
              <FieldError>{errors.email?.message}</FieldError>
            </div>
            <div>
              <label className="field-label" htmlFor="password">
                Contraseña
              </label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  className="pr-12"
                  {...register("password")}
                  aria-invalid={Boolean(errors.password)}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-1 top-1 grid size-9 place-items-center rounded-lg hover:bg-mist"
                  aria-label={
                    showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
              <FieldError>{errors.password?.message}</FieldError>
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting
                ? "Preparando tu espacio…"
                : "Entrar a la demostración"}
            </Button>
          </form>
          <p
            className="mt-5 rounded-xl border border-ink/15 bg-white p-3 text-xs leading-relaxed text-ink/55"
            data-motion-item
          >
            Las credenciales están precargadas. Este acceso no autentica contra
            servicios institucionales.
          </p>
        </div>
      </section>
      <aside
        className="relative hidden overflow-hidden bg-ink p-12 text-white lg:flex lg:flex-col lg:justify-between"
        data-motion-item
      >
        <div className="absolute -right-24 top-24 size-80 rounded-full border-[55px] border-sage/60" />
        <div className="relative flex items-center gap-3">
          <div className="grid size-10 place-items-center rounded-xl bg-sage font-bold">
            NI
          </div>
          <span className="font-display text-xl font-extrabold">
            Nexo Idiomas
          </span>
        </div>
        <div className="relative max-w-xl">
          <LockKeyhole className="mb-8 size-9 text-[#b8c9ba]" />
          <blockquote className="font-display text-4xl font-bold leading-tight">
            “La herramienta organiza la evidencia; la decisión sigue siendo
            humana.”
          </blockquote>
          <p className="mt-6 text-sm text-white/55">
            Principio de diseño · RN-003 y RN-010
          </p>
        </div>
        <p className="relative text-xs text-white/40">
          Mockup funcional · Datos simulados · Agosto 2026
        </p>
      </aside>
    </main>
  );
}
