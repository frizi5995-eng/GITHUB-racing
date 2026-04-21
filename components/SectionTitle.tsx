export function SectionTitle({
  children,
  subtitle,
}: {
  children: React.ReactNode;
  subtitle?: string;
}) {
  return (
    <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h2 className="text-2xl font-black tracking-tight text-white">{children}</h2>
        {subtitle ? <p className="mt-1 max-w-2xl text-sm text-white/60">{subtitle}</p> : null}
      </div>
      <div className="h-px flex-1 bg-gradient-to-r from-white/10 to-transparent md:ml-6" />
    </div>
  );
}
