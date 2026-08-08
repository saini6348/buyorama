import { cn } from "@/lib/utils";

export function Skeleton({ className }: { className?: string }) {
  return (
    <div className={cn("relative overflow-hidden rounded-sm bg-bg-sunken", className)}>
      <div className="motion-safe:animate-[shimmer_1.6s_infinite] absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/55 to-transparent dark:via-white/10" />
    </div>
  );
}
