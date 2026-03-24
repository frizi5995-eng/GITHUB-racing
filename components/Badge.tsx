export function Badge({
  children,
  tone = "neutral",
}: {
  children: React.ReactNode;
  tone?: "neutral" | "hot" | "lv" | "world";
}) {
  const base =
    "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-semibold border";
  const map: Record<string, string> = {
    neutral: "border-white/15 text-white/80 bg-white/5",
    hot: "border-orange-500/30 text-orange-200 bg-orange-500/10",
    lv: "border-red-500/30 text-red-200 bg-red-500/10",
    world: "border-sky-500/30 text-sky-200 bg-sky-500/10",
  };
  return <span className={`${base} ${map[tone]}`}>{children}</span>;
}