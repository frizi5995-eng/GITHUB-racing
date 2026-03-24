export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-end justify-between gap-3">
      <h2 className="text-lg font-bold tracking-wide">{children}</h2>
      <div className="h-px flex-1 bg-white/10" />
    </div>
  );
}