import Link from "next/link";

const items = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Kalendārs" },
  { href: "/events", label: "Sacensības" },
  { href: "/drivers", label: "🇱🇻 Braucēji" },
  { href: "/series", label: "Pasaules top" },
  { href: "/about", label: "Par" },
];

export function Nav() {
  return (
    <header className="sticky top-0 z-20 border-b border-white/10 bg-[#0b0b0f]/80 backdrop-blur">
      <div className="mx-auto max-w-6xl px-4 py-3 flex items-center justify-between gap-4">
        <Link href="/" className="font-black tracking-widest">
          RACE<span className="text-orange-400">HUB</span>
        </Link>
        <nav className="flex gap-2 text-sm flex-wrap justify-end">
          {items.map((i) => (
            <Link
              key={i.href}
              href={i.href}
              className="rounded-lg px-3 py-1.5 text-white/80 hover:text-white hover:bg-white/5"
            >
              {i.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}