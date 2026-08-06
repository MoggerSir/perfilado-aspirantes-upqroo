import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import type { ButtonHTMLAttributes } from "react";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-xl border px-4 text-sm font-bold disabled:pointer-events-none disabled:opacity-45",
  {
    variants: {
      variant: {
        primary:
          "border-ink bg-ink text-white shadow-[3px_3px_0_#a8b7aa] hover:bg-sage",
        secondary:
          "border-ink/25 bg-white text-ink hover:border-ink hover:bg-mist/60",
        ghost:
          "border-transparent bg-transparent text-ink/75 hover:bg-ink/5 hover:text-ink",
        danger:
          "border-clay bg-clay-soft text-[#713928] hover:bg-clay hover:text-white",
      },
      size: {
        default: "h-11",
        sm: "min-h-9 rounded-lg px-3 text-xs",
        icon: "size-11 px-0",
      },
    },
    defaultVariants: { variant: "primary", size: "default" },
  },
);

interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({
  className,
  variant,
  size,
  asChild,
  ...props
}: ButtonProps) {
  const Component = asChild ? Slot : "button";
  return (
    <Component
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  );
}
