"use client";

import { useEffect, useState } from "react";
import { formatCountdown } from "@/lib/utils";

export function TimerChip({ expiresAt }: { expiresAt: string }) {
  const [display, setDisplay] = useState(() => formatCountdown(expiresAt));

  useEffect(() => {
    const id = setInterval(() => setDisplay(formatCountdown(expiresAt)), 1000);
    return () => clearInterval(id);
  }, [expiresAt]);

  return (
    <span
      aria-live="off"
      className="tabular inline-flex w-fit items-center gap-1.5 rounded-sm border border-border-subtle bg-bg-sunken px-2.5 py-1 font-mono-brand text-xs font-semibold text-text-secondary"
    >
      Ends in <span>{display}</span>
    </span>
  );
}
