import { ArrowLeft } from "lucide-react";
import { Link } from "@/lib/router-components";
import { Button } from "@/components/ui/button";

export function NotFoundPage() {
  return (
    <main className="grid min-h-screen place-items-center bg-paper p-5 text-center">
      <div>
        <p className="eyebrow">Error 404</p>
        <h1 className="mt-3 text-5xl font-extrabold">Esta vista no existe.</h1>
        <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-ink/60">
          La ruta puede haber cambiado o no formar parte del alcance del mockup.
        </p>
        <Button asChild className="mt-7">
          <Link to="/app">
            <ArrowLeft className="size-4" />
            Volver al resumen
          </Link>
        </Button>
      </div>
    </main>
  );
}
