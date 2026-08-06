import type { ReactNode } from "react";
import { useEntranceAnimation } from "@/hooks/use-entrance-animation";
import { cn } from "@/lib/utils";

export function AnimatedPage({
  children,
  routeKey,
  className,
}: {
  children: ReactNode;
  routeKey: string;
  className?: string;
}) {
  const scope = useEntranceAnimation<HTMLDivElement>([routeKey]);

  return (
    <div ref={scope} className={cn("motion-page", className)} data-motion-page>
      {children}
    </div>
  );
}
