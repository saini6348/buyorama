import { SITE_URL, SITE_NAME, SITE_TAGLINE } from "@/lib/seo/constants";
import type { Deal, BrandOfferDeal } from "@/lib/types/deal";
import type { CreditCard } from "@/lib/types/credit-card";
import type { Store } from "@/lib/types/store";

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    slogan: SITE_TAGLINE,
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/search?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function breadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: `${SITE_URL}${item.url}`,
    })),
  };
}

export function storeDealsJsonLd(store: Store, deals: Deal[]) {
  const offers = deals.filter((d): d is BrandOfferDeal => d.type === "brandOffer");

  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${store.name} Deals`,
    url: `${SITE_URL}/${store.slug}`,
    itemListElement: offers.map((d, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "Offer",
        name: d.title,
        price: d.price,
        priceCurrency: "INR",
        url: `${SITE_URL}/${store.slug}`,
        availability: "https://schema.org/InStock",
      },
    })),
  };
}

export function creditCardJsonLd(card: CreditCard) {
  return {
    "@context": "https://schema.org",
    "@type": "FinancialProduct",
    name: card.cardName,
    provider: { "@type": "BankOrCreditUnion", name: card.bankName },
    url: `${SITE_URL}/credit-card-offers/${card.slug}`,
    feesAndCommissionsSpecification: card.annualFee,
    description: card.highlights[0],
  };
}
