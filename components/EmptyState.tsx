export function EmptyState({
  title,
  description,
  actions,
}: {
  title: string;
  description: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="rounded-[28px] border border-dashed border-white/10 bg-white/[0.03] p-6 text-white/65">
      <div className="text-lg font-bold text-white">{title}</div>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-white/60">{description}</p>
      {actions ? <div className="mt-4 flex flex-wrap gap-3">{actions}</div> : null}
    </div>
  );
}
