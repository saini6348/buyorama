import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ChipTone = "ghost" | "teal" | "pink" | "orange" | "yellow" | "green" | "active";

const tones: Record<ChipTone, string> = {
  ghost: "bg-bg-sunken text-text-secondary border border-border-subtle",
  teal: "bg-brand-teal-tint text-brand-teal-deep",
  pink: "bg-brand-pink-tint text-brand-pink-deep",
  orange: "bg-brand-orange-tint text-[#8a4400] dark:text-[#ffc98a]",
  yellow: "bg-brand-yellow-tint text-[#7a4a00] dark:text-[#ffe29b]",
  green: "bg-brand-green-tint text-[#0f6c4c] dark:text-[#8de8c0]",
  active: "bg-brand-navy text-white dark:bg-white dark:text-brand-navy",
};

interface ChipProps {
  tone?: ChipTone;
  size?: "md" | "xs";
  className?: string;
  children: ReactNode;
  onClick?: () => void;
  href?: string;
}

export function Chip({ tone = "ghost", size = "md", className, children, onClick, href }: ChipProps) {
  const classes = cn(
    "inline-flex items-center justify-center gap-1.5 rounded-full font-bold",
    size === "md" ? "px-3.5 py-1.5 text-[13px]" : "rounded-sm px-1.5 py-1.5 text-center text-[10px] leading-tight",
    tones[tone],
    className
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }
  if (onClick) {
    return (
      <button type="button" onClick={onClick} className={classes}>
        {children}
      </button>
    );
  }
  return <span className={classes}>{children}</span>;
}

export function ChipGrid3({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("grid grid-cols-3 gap-1.5", className)}>{children}</div>;
}
