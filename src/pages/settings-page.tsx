import { Bell, LockKeyhole, Save, UserRound } from "lucide-react";
import { toast } from "sonner";
import { PageHeader } from "@/components/layout/page-header";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export function SettingsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Cuenta simulada"
        title="Perfil y configuración"
        description="Preferencias del Coordinador de Idiomas. Los permisos institucionales dependerían de un servicio de identidad real."
      />
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <Card className="p-5 shadow-none sm:p-7">
          <div className="flex items-center gap-3 border-b border-ink/10 pb-5">
            <div className="grid size-11 place-items-center rounded-xl bg-lavender">
              <UserRound className="size-5" />
            </div>
            <div>
              <h2 className="text-lg font-extrabold">Información del perfil</h2>
              <p className="text-xs text-ink/50">
                Visible en evaluaciones y bitácora.
              </p>
            </div>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="profile-name">
                Nombre
              </label>
              <Input id="profile-name" defaultValue="Josué Reyes" />
            </div>
            <div>
              <label className="field-label" htmlFor="profile-role">
                Rol
              </label>
              <Input
                id="profile-role"
                defaultValue="Coordinador de Idiomas"
                disabled
              />
            </div>
            <div className="sm:col-span-2">
              <label className="field-label" htmlFor="profile-email">
                Correo institucional
              </label>
              <Input
                id="profile-email"
                type="email"
                defaultValue="coordinacion.idiomas@upqroo.edu.mx"
              />
            </div>
          </div>
          <Button
            className="mt-6"
            onClick={() => toast.success("Preferencias guardadas")}
          >
            <Save className="size-4" />
            Guardar cambios
          </Button>
        </Card>
        <aside className="space-y-5">
          <Card className="p-5 shadow-none">
            <div className="flex items-center justify-between">
              <Bell className="size-5 text-sage" />
              <Badge tone="success">Activo</Badge>
            </div>
            <h2 className="mt-5 text-lg font-extrabold">Notificaciones</h2>
            <p className="mt-2 text-sm leading-6 text-ink/60">
              Avisos por expedientes incompletos, importaciones e historial
              coincidente.
            </p>
            <label className="mt-5 flex items-center justify-between gap-3 text-sm font-semibold">
              <span>Resumen diario</span>
              <input
                type="checkbox"
                defaultChecked
                className="size-5 accent-[#657b68]"
              />
            </label>
          </Card>
          <Card className="bg-ink p-5 text-white shadow-none">
            <LockKeyhole className="size-5 text-[#b8c9ba]" />
            <h2 className="mt-5 text-lg font-extrabold">Permisos</h2>
            <p className="mt-2 text-sm leading-6 text-white/60">
              Coordinador · consulta y edición de expedientes, evaluaciones y
              documentos.
            </p>
            <button className="mt-4 text-xs font-bold text-white/80 underline underline-offset-4">
              Ver alcance del rol
            </button>
          </Card>
        </aside>
      </div>
    </>
  );
}
