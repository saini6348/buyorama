"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

export function CopyCodeButton({ code, className }: { code: string; className?: string }) {
  const [state, setState] = useState<"idle" | "copied" | "failed">("idle");

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code);
      setState("copied");
    } catch {
      setState("failed");
    }
    setTimeout(() => setState("idle"), 1600);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={cn(
        "rounded-sm px-3.5 py-2 text-[12.5px] font-bold transition-colors duration-150",
        state === "copied" ? "bg-brand-green text-white" : "bg-brand-navy text-white hover:bg-brand-pink-deep dark:bg-white dark:text-brand-navy dark:hover:bg-brand-pink-deep dark:hover:text-white",
        className
      )}
    >
      {state === "copied" ? "Copied!" : state === "failed" ? "Copy failed" : "Copy Code"}
    </button>
  );
}
