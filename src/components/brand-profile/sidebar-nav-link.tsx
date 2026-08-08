import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SidebarNavLink({ href, active, children }: { href: string; active?: boolean; children: ReactNode }) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-2.5 rounded-sm px-2.5 py-2 text-[13.5px] font-bold",
        active ? "bg-brand-pink-tint text-brand-pink-deep dark:bg-[rgba(214,20,107,0.18)] dark:text-[#ff6fa9]" : "text-text-secondary hover:bg-bg-sunken"
      )}
    >
      <span className={cn("h-4 w-4 flex-none rounded-[5px]", active ? "bg-brand-pink-deep dark:bg-[#ff6fa9]" : "bg-border-strong")} />
      {children}
    </Link>
  );
}
