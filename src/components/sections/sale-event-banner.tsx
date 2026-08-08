import { Button } from "@/components/ui/button";
import { Chip } from "@/components/ui/chip";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { SaleEvent } from "@/lib/types/sale-event";

export function SaleEventBanner({ event }: { event: SaleEvent }) {
  return (
    <section className="border-t border-border-subtle px-5 py-10">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div
            className="flex flex-col items-start justify-between gap-4 rounded-lg p-6 sm:flex-row sm:items-center"
            style={{ background: `linear-gradient(120deg, ${event.heroFrom}, ${event.heroTo})` }}
          >
            <div>
              {event.isLive ? <Chip tone="active" className="mb-2">Live now</Chip> : null}
              <h3 className="text-xl text-brand-navy">{event.name}</h3>
              <p className="mt-1 text-[13px] font-semibold text-brand-navy/70">/{event.slug}/</p>
            </div>
            <Button href={`/${event.slug}`}>Shop the sale</Button>
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
