"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { AuthUser } from "@/lib/types";

const baseItems = [
  { href: "/", label: "Home" },
  { href: "/calendar", label: "Calendar" },
  { href: "/events", label: "Events" },
  { href: "/drivers", label: "Drivers" },
  { href: "/series", label: "Series" },
  { href: "/favorites", label: "Favorites" },
  { href: "/feedback", label: "Feedback" },
  { href: "/about", label: "About" },
];

export function NavClient({ user }: { user: AuthUser | null }) {
  const pathname = usePathname();
  const items = [
    ...baseItems,
    ...(user?.role === "admin" ? [{ href: "/admin", label: "Admin" }] : []),
    ...(!user ? [{ href: "/register", label: "Register" }, { href: "/login", label: "Login" }] : []),
  ];

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-[#090d12]/82 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-4 md:px-6">
        <Link href="/" className="flex items-center gap-3">
          <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-orange-400/20 bg-[radial-gradient(circle_at_28%_30%,rgba(248,113,113,0.42),transparent_32%),radial-gradient(circle_at_72%_68%,rgba(251,146,60,0.4),transparent_38%),linear-gradient(145deg,rgba(255,255,255,0.08),rgba(255,255,255,0.02))] text-sm font-black tracking-[0.28em] text-white">
            RH
          </span>
          <div>
            <div className="text-xs uppercase tracking-[0.28em] text-white/45">Motorsport platform</div>
            <div className="text-lg font-black tracking-[0.18em] text-white">
              RACE<span className="text-orange-300">HUB</span>
            </div>
          </div>
        </Link>

        <nav className="flex flex-wrap items-center justify-end gap-2 text-sm">
          {items.map((item) => {
            const active = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                className={`rounded-2xl px-4 py-2 transition ${
                  active
                    ? "bg-orange-500/16 text-white"
                    : "text-white/70 hover:bg-white/6 hover:text-white"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
          <ThemeToggle />
        </nav>
      </div>
    </header>
  );
}
