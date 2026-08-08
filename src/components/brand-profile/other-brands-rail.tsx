import Link from "next/link";
import { StoreLogo } from "@/components/ui/store-logo";
import { ArrowRightIcon } from "@/components/ui/icons";
import { Panel } from "@/components/ui/panel";
import type { Store } from "@/lib/types/store";

export function OtherBrandsRail({ stores, monthlySavingsStat }: { stores: (Store & { liveDealsCount: number })[]; monthlySavingsStat?: string }) {
  return (
    <aside className="flex flex-col gap-4 border-t border-border-subtle p-5 lg:border-t-0 lg:border-l">
      <div className="font-extrabold text-text-primary">Other Brands</div>
      <div className="flex flex-col gap-3.5">
        {stores.map((s) => (
          <Link key={s.slug} href={`/${s.slug}`} className="flex items-center gap-2.5">
            <StoreLogo bg={s.logoBg} fg={s.logoFg} monogram={s.monogram} size={36} />
            <div className="min-w-0 flex-1">
              <div className="text-[13px] font-extrabold text-text-primary">{s.name}</div>
              <div className="text-[11px] font-semibold text-text-muted">{s.liveDealsCount} live deals</div>
            </div>
            <ArrowRightIcon width={16} height={16} className="flex-none text-text-muted" />
          </Link>
        ))}
      </div>
      <Link href="/stores" className="text-center text-[12.5px] font-bold text-brand-teal-deep">
        View All →
      </Link>
      {monthlySavingsStat ? (
        <Panel className="p-4 text-center">
          <div className="font-display text-lg text-text-primary">{monthlySavingsStat}</div>
          <div className="text-[11.5px] font-semibold text-text-muted">deals grabbed across all stores this month</div>
        </Panel>
      ) : null}
    </aside>
  );
}
