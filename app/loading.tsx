export default function Loading() {
  return (
    <main className="space-y-6">
      <section className="animate-pulse rounded-[36px] border border-white/10 bg-white/[0.045] p-8">
        <div className="h-4 w-40 rounded-full bg-white/10" />
        <div className="mt-5 h-12 max-w-3xl rounded-2xl bg-white/10" />
        <div className="mt-4 h-5 max-w-2xl rounded-full bg-white/10" />
      </section>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="h-48 animate-pulse rounded-[28px] border border-white/10 bg-white/[0.045]" />
        ))}
      </div>
    </main>
  );
}
