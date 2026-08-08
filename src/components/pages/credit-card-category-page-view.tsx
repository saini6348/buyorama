import { notFound } from "next/navigation";
import { getCreditCardCategoryPage, getCreditCardsByCategory } from "@/lib/content/get-credit-card";
import { CreditCardOfferCard } from "@/components/deals/credit-card-offer-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export async function CreditCardCategoryPageView({ slug }: { slug: string }) {
  const page = await getCreditCardCategoryPage(slug);
  if (!page) notFound();
  const cards = await getCreditCardsByCategory(page.name);

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <RevealOnScroll>
        <h1 className="text-3xl">{page.title}</h1>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">{page.description}</p>
      </RevealOnScroll>
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((c) => (
          <CreditCardOfferCard key={c.slug} card={c} />
        ))}
      </div>
      {cards.length === 0 ? <p className="py-10 text-center text-sm text-text-muted">No cards in this category yet.</p> : null}
    </div>
  );
}
