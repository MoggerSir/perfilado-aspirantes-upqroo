import * as DialogPrimitive from "@radix-ui/react-dialog";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Drawer({
  open,
  onOpenChange,
  title,
  returnFocusId,
  children,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  returnFocusId?: string;
  children: ReactNode;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="motion-overlay fixed inset-0 z-50 bg-ink/45 lg:hidden" />
        <DialogPrimitive.Content
          className={cn(
            "motion-drawer fixed inset-y-0 left-0 z-50 flex w-[min(86vw,320px)] flex-col bg-ink text-white shadow-2xl lg:hidden",
          )}
          onCloseAutoFocus={(event) => {
            if (!returnFocusId) return;
            event.preventDefault();
            document.getElementById(returnFocusId)?.focus();
          }}
        >
          <DialogPrimitive.Title className="sr-only">
            {title}
          </DialogPrimitive.Title>
          <DialogPrimitive.Description className="sr-only">
            Accesos a los módulos de la plataforma.
          </DialogPrimitive.Description>
          {children}
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}
