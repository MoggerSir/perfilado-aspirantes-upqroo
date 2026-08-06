import * as ProgressPrimitive from "@radix-ui/react-progress";
export function Progress({ value, label }: { value: number; label?: string }) {
  return (
    <div>
      {label && (
        <div className="mb-2 flex justify-between text-xs font-semibold">
          <span>{label}</span>
          <span>{value}%</span>
        </div>
      )}
      <ProgressPrimitive.Root
        className="h-2 overflow-hidden rounded-full bg-ink/10"
        value={value}
        aria-label={label ?? "Progreso"}
      >
        <ProgressPrimitive.Indicator
          className="h-full rounded-full bg-sage transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${100 - value}%)` }}
        />
      </ProgressPrimitive.Root>
    </div>
  );
}
