import {
  forwardRef,
  type InputHTMLAttributes,
  type TextareaHTMLAttributes,
} from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<
  HTMLInputElement,
  InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
  <input ref={ref} className={cn("input-base", className)} {...props} />
));
Input.displayName = "Input";
export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn("input-base min-h-28 resize-y py-3", className)}
    {...props}
  />
));
Textarea.displayName = "Textarea";

export function FieldError({ children }: { children?: string }) {
  return children ? (
    <p
      className="motion-field-message mt-1.5 text-xs font-semibold text-clay"
      role="alert"
    >
      {children}
    </p>
  ) : null;
}
