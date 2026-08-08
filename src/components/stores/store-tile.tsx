import Link from "next/link";
import { StoreLogo } from "@/components/ui/store-logo";
import { cn } from "@/lib/utils";
import type { Store } from "@/lib/types/store";

export function StoreTile({ store, subtitle, stacked = false }: { store: Store; subtitle?: string; stacked?: boolean }) {
  return (
    <Link
      href={`/${store.slug}`}
      className={cn(
        "flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-surface p-3.5 shadow-brand-sm transition-transform duration-200 hover:-translate-y-1 hover:shadow-brand-md",
        stacked && "flex-col justify-center gap-1.5 p-2.5 text-center"
      )}
    >
      <StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={stacked ? 34 : 44} />
      <div>
        <div className={cn("font-extrabold leading-tight text-text-primary", stacked ? "text-[10.5px]" : "text-sm")}>{store.name}</div>
        {!stacked ? <div className="text-[11px] font-semibold text-text-muted">{subtitle ?? "Deals"}</div> : null}
      </div>
    </Link>
  );
}
