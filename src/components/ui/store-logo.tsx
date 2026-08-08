import { cn } from "@/lib/utils";

interface StoreLogoProps {
  bg: string;
  fg: string;
  monogram: string;
  size?: number;
  rounded?: string;
  className?: string;
}

export function StoreLogo({ bg, fg, monogram, size = 44, rounded = "rounded-sm", className }: StoreLogoProps) {
  return (
    <div
      className={cn("flex flex-none items-center justify-center font-display font-bold shadow-brand-sm", rounded, className)}
      style={{
        width: size,
        height: size,
        background: bg,
        color: fg,
        fontSize: Math.max(10, Math.round(size * 0.34)),
      }}
    >
      {monogram}
    </div>
  );
}
