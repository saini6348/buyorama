import Link from "next/link";
import { CreditCardOfferCard } from "@/components/deals/credit-card-offer-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { CreditCard } from "@/lib/types/credit-card";

export function CreditCardOffersGrid({ cards }: { cards: CreditCard[] }) {
  return (
    <section className="border-t border-border-subtle bg-bg-sunken px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl">Credit Card Offers</h2>
            <Link href="/credit-card-offers" className="text-[13px] font-bold text-brand-teal-deep">
              /credit-card-offers/ →
            </Link>
          </div>
        </RevealOnScroll>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((c) => (
            <CreditCardOfferCard key={c.slug} card={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
