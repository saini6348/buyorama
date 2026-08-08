import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** One of the doc's exactly-3 permitted infinite loops — decorative only. */
export function FloatBadge({ className, delay, children }: { className?: string; delay?: string; children: ReactNode }) {
  return (
    <div
      className={cn("motion-safe:animate-[bob_3.2s_ease-in-out_infinite] rounded-sm shadow-brand-sm", className)}
      style={delay ? { animationDelay: delay } : undefined}
    >
      {children}
    </div>
  );
}
