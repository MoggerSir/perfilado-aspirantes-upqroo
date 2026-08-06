import type { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("editorial-card", className)}
      data-motion-item
      {...props}
    />
  );
}
export function CardHeader({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pb-3 sm:p-6 sm:pb-3", className)} {...props} />
  );
}
export function CardContent({
  className,
  ...props
}: HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={cn("p-5 pt-2 sm:p-6 sm:pt-3", className)} {...props} />
  );
}
