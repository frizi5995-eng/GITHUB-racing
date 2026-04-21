export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "hot" | "lv" | "world";
}) {
  const base = "inline-flex items-center rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-[0.14em] uppercase";
  const map: Record<string, string> = {
    neutral: "border-white/10 bg-white/5 text-white/70",
    hot: "border-orange-400/30 bg-orange-500/12 text-orange-100",
    lv: "border-red-400/30 bg-red-500/12 text-red-100",
    world: "border-sky-400/30 bg-sky-500/12 text-sky-100",
  };

  return <span className={`${base} ${map[tone]}`}>{children}</span>;
}
