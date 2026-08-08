import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type BadgeTone = "discount" | "new" | "expiring" | "verified" | "live";

const tones: Record<BadgeTone, string> = {
  discount: "bg-gradient-to-br from-brand-pink-deep to-brand-orange text-white shadow-glow-pink",
  new: "bg-brand-teal text-brand-navy",
  expiring: "bg-[#ffe0e0] text-[#b3261e] dark:bg-[#4a1e1e] dark:text-[#ff9e9e]",
  verified: "bg-brand-green text-white",
  live: "bg-brand-navy text-white",
};

export function Badge({ tone, className, children }: { tone: BadgeTone; className?: string; children: ReactNode }) {
  return (
    <span className={cn("inline-flex items-center gap-1 rounded-xs px-2.5 py-1 text-[11.5px] font-extrabold tracking-tight", tones[tone], className)}>
      {children}
    </span>
  );
}
