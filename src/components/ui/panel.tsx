import type { HTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

export function Panel({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("rounded-lg border border-border-subtle bg-bg-surface p-5", className)} {...props} />;
}

export function KVRow({ label, value }: { label: ReactNode; value: ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-3 border-b border-border-subtle py-2.5 text-[13.5px] last:border-b-0">
      <span className="text-text-secondary">{label}</span>
      <span className="font-bold text-text-primary">{value}</span>
    </div>
  );
}
