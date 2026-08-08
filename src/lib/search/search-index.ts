import { stores } from "@/lib/data/stores";
import { deals } from "@/lib/data/deals";
import { coupons } from "@/lib/data/coupons";
import { creditCards } from "@/lib/data/credit-cards";
import { saleEvents } from "@/lib/data/sale-events";

export type SearchResultType = "store" | "deal" | "coupon" | "creditCard" | "saleEvent";

export interface SearchResult {
  type: SearchResultType;
  title: string;
  subtitle: string;
  href: string;
}

export function buildSearchIndex(): SearchResult[] {
  const storeResults: SearchResult[] = stores.map((s) => ({
    type: "store",
    title: s.name,
    subtitle: s.categoryLine,
    href: `/${s.slug}`,
  }));

  const dealResults: SearchResult[] = deals.map((d) => {
    const store = stores.find((s) => s.slug === d.storeSlug);
    return { type: "deal", title: d.title, subtitle: store?.name ?? d.category, href: `/${d.storeSlug}` };
  });

  const couponResults: SearchResult[] = coupons.map((c) => ({
    type: "coupon",
    title: c.headline,
    subtitle: `${c.storeName} · ${c.code}`,
    href: "/coupon-codes",
  }));

  const creditCardResults: SearchResult[] = creditCards.map((c) => ({
    type: "creditCard",
    title: c.cardName,
    subtitle: c.bankName,
    href: `/credit-card-offers/${c.slug}`,
  }));

  const saleEventResults: SearchResult[] = saleEvents.map((e) => ({
    type: "saleEvent",
    title: e.name,
    subtitle: e.dateRange,
    href: `/${e.slug}`,
  }));

  return [...storeResults, ...dealResults, ...couponResults, ...creditCardResults, ...saleEventResults];
}

export function searchIndex(index: SearchResult[], query: string, limit = 8): SearchResult[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return index.filter((r) => r.title.toLowerCase().includes(q) || r.subtitle.toLowerCase().includes(q)).slice(0, limit);
}

export const TRENDING_SEARCHES = ["Diwali Sale", "HDFC Millennia", "Myntra 80% off", "Croma TVs"];
