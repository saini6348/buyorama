import { notFound } from "next/navigation";
import { getSaleEvent } from "@/lib/content/get-sale-event";
import { getStoreDeals } from "@/lib/content/get-deals";
import { getStore } from "@/lib/content/get-store";
import { Chip } from "@/components/ui/chip";
import { Button } from "@/components/ui/button";
import { DealCard } from "@/components/deals/deal-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export async function SaleEventPageView({ slug }: { slug: string }) {
  const event = await getSaleEvent(slug);
  if (!event) notFound();

  const [store, deals] = await Promise.all([getStore(event.storeSlug), getStoreDeals(event.storeSlug)]);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <RevealOnScroll>
        <div className="rounded-lg p-8 sm:p-10" style={{ background: `linear-gradient(120deg, ${event.heroFrom}, ${event.heroTo})` }}>
          {event.isLive ? (
            <Chip tone="active" className="mb-3">
              Live now
            </Chip>
          ) : (
            <Chip tone="ghost" className="mb-3">
              {event.dateRange}
            </Chip>
          )}
          <h1 className="text-3xl text-brand-navy sm:text-4xl">{event.name}</h1>
          <p className="mt-3 max-w-2xl text-[15px] text-brand-navy/80">{event.description}</p>
          <Button href={`/${event.storeSlug}`} className="mt-5">
            Shop {event.storeName} deals →
          </Button>
        </div>
      </RevealOnScroll>

      <div className="mt-10">
        <h2 className="mb-5 text-2xl">{event.isLive ? `Live deals from ${event.storeName}` : `While you wait — live ${event.storeName} deals`}</h2>
        {deals.length > 0 ? (
          <div className="flex flex-wrap gap-4">
            {deals.map((d) => (
              <DealCard key={d.id} deal={d} storeName={store?.name} />
            ))}
          </div>
        ) : (
          <p className="text-sm text-text-muted">Check back once the sale goes live.</p>
        )}
      </div>
    </div>
  );
}
