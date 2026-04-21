"use client";

import { useEffect, useState } from "react";
import { getCountdownParts } from "@/lib/utils";

export function LiveCountdown({
  targetDate,
  label = "Countdown",
  compact = false,
}: {
  targetDate: string;
  label?: string;
  compact?: boolean;
}) {
  const [parts, setParts] = useState(() => getCountdownParts(targetDate));

  useEffect(() => {
    const interval = window.setInterval(() => {
      setParts(getCountdownParts(targetDate));
    }, 1000);
    return () => window.clearInterval(interval);
  }, [targetDate]);

  if (parts.finished) {
    return (
      <div className={compact ? "text-sm text-white/60" : "rounded-[24px] border border-white/10 bg-[#0b1016] p-4"}>
        <div className={compact ? "" : "text-xs uppercase tracking-[0.18em] text-white/45"}>{label}</div>
        <div className={compact ? "text-sm font-semibold text-white/80" : "mt-2 text-lg font-bold text-white"}>
          Started or completed
        </div>
      </div>
    );
  }

  const content = (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <div className="text-2xl font-black tracking-tight text-white">{parts.days}</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">days</div>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight text-white">{String(parts.hours).padStart(2, "0")}</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">hours</div>
      </div>
      <div>
        <div className="text-2xl font-black tracking-tight text-white">{String(parts.minutes).padStart(2, "0")}</div>
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">minutes</div>
      </div>
      {!compact ? (
        <div>
          <div className="text-2xl font-black tracking-tight text-white">{String(parts.seconds).padStart(2, "0")}</div>
          <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">seconds</div>
        </div>
      ) : null}
    </div>
  );

  if (compact) {
    return (
      <div className="space-y-2">
        <div className="text-[11px] uppercase tracking-[0.18em] text-white/45">{label}</div>
        {content}
      </div>
    );
  }

  return (
    <div className="rounded-[24px] border border-white/10 bg-[#0b1016] p-4">
      <div className="text-xs uppercase tracking-[0.18em] text-white/45">{label}</div>
      <div className="mt-3">{content}</div>
    </div>
  );
}
