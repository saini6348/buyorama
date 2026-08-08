import Link from "next/link";
import { DealCard } from "@/components/deals/deal-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Deal } from "@/lib/types/deal";
import type { Store } from "@/lib/types/store";

export function TrendingDealsRail({ deals, stores }: { deals: Deal[]; stores: Store[] }) {
  return (
    <section className="border-t border-border-subtle px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl">Trending Deals</h2>
            <Link href="/stores" className="text-[13px] font-bold text-brand-teal-deep">
              See all →
            </Link>
          </div>
        </RevealOnScroll>
        <div className="flex gap-4 overflow-x-auto pb-2">
          {deals.map((d) => (
            <DealCard key={d.id} deal={d} storeName={stores.find((s) => s.slug === d.storeSlug)?.name} />
          ))}
        </div>
      </div>
    </section>
  );
}
