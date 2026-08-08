import type { Metadata } from "next";
import { getAllCreditCards } from "@/lib/content/get-credit-card";
import { CreditCardOfferCard } from "@/components/deals/credit-card-offer-card";
import { Chip } from "@/components/ui/chip";
import { Panel } from "@/components/ui/panel";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { CREDIT_CARD_CATEGORIES, BANK_NAMES } from "@/lib/types/credit-card";

export const metadata: Metadata = {
  title: "Credit Card Offers",
  description: "Compare cashback, travel, airport lounge, fuel and lifetime-free credit cards from every major Indian bank.",
  // filtered ?category=/&bank= views canonicalize back here — the 7 dedicated
  // category pages are the real canonical target for those filter states.
  alternates: { canonical: "/credit-card-offers" },
};

export const revalidate = 180;

function buildHref(category?: string, bank?: string) {
  const params = new URLSearchParams();
  if (category) params.set("category", category);
  if (bank) params.set("bank", bank);
  const qs = params.toString();
  return `/credit-card-offers${qs ? `?${qs}` : ""}`;
}

export default async function CreditCardOffersPage({ searchParams }: PageProps<"/credit-card-offers">) {
  const sp = await searchParams;
  const category = Array.isArray(sp.category) ? sp.category[0] : sp.category;
  const bank = Array.isArray(sp.bank) ? sp.bank[0] : sp.bank;

  const allCards = await getAllCreditCards();
  const filtered = allCards.filter(
    (c) => (!category || c.categories.some((cc) => cc === category)) && (!bank || c.bankName === bank)
  );

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <RevealOnScroll>
        <h1 className="text-3xl">Credit Card Offers</h1>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">Finance, kept visually calmer than the deals feed — but just as easy to filter.</p>
      </RevealOnScroll>

      <div className="mt-7 flex flex-wrap gap-2">
        <Chip tone={!category ? "active" : "ghost"} href={buildHref(undefined, bank)}>
          All Categories
        </Chip>
        {CREDIT_CARD_CATEGORIES.map((c) => (
          <Chip key={c} tone={category === c ? "active" : "ghost"} href={buildHref(c, bank)}>
            {c}
          </Chip>
        ))}
      </div>

      <Panel className="mt-4">
        <div className="mb-2.5 text-[11px] font-bold uppercase tracking-wide text-text-muted">Filter by issuing bank</div>
        <div className="flex flex-wrap gap-2">
          <Chip tone={!bank ? "active" : "ghost"} href={buildHref(category, undefined)}>
            All Banks
          </Chip>
          {BANK_NAMES.map((b) => (
            <Chip key={b} tone={bank === b ? "active" : "ghost"} href={buildHref(category, b)}>
              {b}
            </Chip>
          ))}
        </div>
      </Panel>

      <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {filtered.map((c) => (
          <CreditCardOfferCard key={c.slug} card={c} />
        ))}
      </div>
      {filtered.length === 0 ? <p className="py-10 text-center text-sm text-text-muted">No cards match this filter yet.</p> : null}
    </div>
  );
}
