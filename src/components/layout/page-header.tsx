export function PageHeader({
  eyebrow,
  title,
  description,
  action,
}: {
  eyebrow: string;
  title: string;
  description: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="mb-7 flex flex-col gap-5 sm:mb-9 lg:flex-row lg:items-end lg:justify-between">
      <div className="max-w-3xl">
        <p className="eyebrow" data-motion-item>
          {eyebrow}
        </p>
        <h1 className="page-title mt-2" data-motion-item>
          {title}
        </h1>
        <p
          className="mt-3 max-w-2xl text-sm leading-6 text-ink/65 sm:text-base"
          data-motion-item
        >
          {description}
        </p>
      </div>
      {action && (
        <div className="shrink-0" data-motion-item>
          {action}
        </div>
      )}
    </div>
  );
}
