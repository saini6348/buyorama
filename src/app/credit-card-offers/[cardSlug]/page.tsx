import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllCreditCards, getCreditCard, getCreditCardCategoryPages } from "@/lib/content/get-credit-card";
import { BrandProfileSidebar } from "@/components/brand-profile/brand-profile-sidebar";
import { ChipFilterGroup } from "@/components/brand-profile/chip-filter-group";
import { TagsRow } from "@/components/brand-profile/tags-row";
import { FeedPost } from "@/components/brand-profile/feed-post";
import { CreditCardFeedContent } from "@/components/brand-profile/credit-card-feed-content";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, creditCardJsonLd } from "@/lib/seo/json-ld";
import { timeAgo } from "@/lib/utils";
import { CREDIT_CARD_CATEGORIES, BANK_NAMES } from "@/lib/types/credit-card";

export async function generateStaticParams() {
  const cards = await getAllCreditCards();
  return cards.map((c) => ({ cardSlug: c.slug }));
}

export async function generateMetadata({ params }: PageProps<"/credit-card-offers/[cardSlug]">): Promise<Metadata> {
  const { cardSlug } = await params;
  const card = await getCreditCard(cardSlug);
  if (!card) return {};
  return {
    title: `${card.cardName} — ${card.bankName}`,
    description: `${card.cardName} by ${card.bankName}: ${card.highlights[0] ?? "compare fees, benefits and eligibility"}.`,
    alternates: { canonical: `/credit-card-offers/${card.slug}` },
  };
}

export const revalidate = 300;

export default async function CreditCardDetailPage({ params }: PageProps<"/credit-card-offers/[cardSlug]">) {
  const { cardSlug } = await params;
  const [card, categoryPages] = await Promise.all([getCreditCard(cardSlug), getCreditCardCategoryPages()]);
  if (!card) notFound();

  return (
    <div className="mx-auto grid max-w-7xl profile:grid-cols-[300px_1fr]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Credit Card Offers", url: "/credit-card-offers" },
          { name: card.cardName, url: `/credit-card-offers/${card.slug}` },
        ])}
      />
      <JsonLd data={creditCardJsonLd(card)} />
      <BrandProfileSidebar
        logo={
          <div
            className="flex h-[100px] w-full flex-col justify-between rounded-lg p-3.5 text-white"
            style={{ background: `linear-gradient(135deg, ${card.artFrom}, ${card.artTo})` }}
          >
            <span className="text-[10px] font-bold uppercase tracking-wide opacity-90">{card.bankName}</span>
            <span className="font-display text-base">{card.cardName}</span>
          </div>
        }
        title={card.cardName}
        subtitle={card.bankName}
        applyHref={card.applyUrl}
        stats={[
          { label: "Annual Fee", value: card.annualFee },
          { label: card.maxCashback ? "Max Cashback" : "Categories", value: card.maxCashback ?? card.categories.length },
        ]}
        navLinks={[
          { label: "Live Feed", href: `/credit-card-offers/${card.slug}`, active: true },
          { label: "Coupons", href: "/coupon-codes" },
          { label: "Categories", href: "/credit-card-offers" },
          { label: "About Card", href: card.applyUrl },
        ]}
      >
        <ChipFilterGroup
          label="Credit Card Categories"
          helper={`Each card can belong to multiple categories — ${card.cardName}'s are highlighted.`}
          options={CREDIT_CARD_CATEGORIES}
          activeOptions={card.categories}
          compact
          hrefFor={(opt) => `/credit-card-offers?category=${encodeURIComponent(opt)}`}
        />
        <ChipFilterGroup
          label="Bank Filters"
          helper="Filter every card on the site by issuer."
          options={BANK_NAMES}
          activeOptions={[card.bankName]}
          compact
          hrefFor={(opt) => `/credit-card-offers?bank=${encodeURIComponent(opt)}`}
        />
      </BrandProfileSidebar>

      <div>
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
          <div>
            <h1 className="text-xl">{card.cardName}</h1>
            <div className="mt-0.5 text-xs font-semibold text-text-muted">
              Issued by {card.bankName} · {card.categories.join(" & ")}
            </div>
          </div>
          <Badge tone="verified">✓ Verified today</Badge>
        </div>

        <TagsRow tags={categoryPages} />

        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-xl">Feeds</h2>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
            <PulseDot /> Updated {card.latestUpdate ? timeAgo(card.latestUpdate.postedAt) : "recently"}
          </div>
        </div>

        <div className="p-5">
          <FeedPost
            avatar={
              <div
                className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-sm font-display text-xs font-bold text-white"
                style={{ background: `linear-gradient(135deg, ${card.artFrom}, ${card.artTo})` }}
              >
                {card.bankName[0]}
              </div>
            }
            name={card.cardName}
            meta={card.latestUpdate ? `Verified ${timeAgo(card.latestUpdate.postedAt)}` : "Verified"}
            showFooter
            likeCount={card.likeCount}
            commentCount={card.commentCount}
          >
            <CreditCardFeedContent card={card} />
          </FeedPost>
        </div>
      </div>
    </div>
  );
}
