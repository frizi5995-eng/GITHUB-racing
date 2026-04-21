"use client";

import { useState } from "react";

export function ShareButton({ title }: { title: string }) {
  const [status, setStatus] = useState<"idle" | "copied">("idle");

  return (
    <button
      type="button"
      onClick={async () => {
        const url = window.location.href;

        try {
          if (navigator.share) {
            await navigator.share({ title, url });
            return;
          }

          await navigator.clipboard.writeText(url);
          setStatus("copied");
          window.setTimeout(() => setStatus("idle"), 1800);
        } catch {
          try {
            await navigator.clipboard.writeText(url);
            setStatus("copied");
            window.setTimeout(() => setStatus("idle"), 1800);
          } catch {
            setStatus("idle");
          }
        }
      }}
      className="rounded-2xl border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/75 transition hover:bg-white/10"
    >
      {status === "copied" ? "Copied link" : "Share"}
    </button>
  );
}
