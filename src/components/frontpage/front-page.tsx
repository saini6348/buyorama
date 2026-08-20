"use client";

import { useEffect, useState } from "react";
import { Hero } from "@/components/sections/hero";
import { TrendingDealsRail } from "@/components/sections/trending-deals-rail";
import { PopularStoresGrid } from "@/components/sections/popular-stores-grid";
import { CouponsStrip } from "@/components/sections/coupons-strip";
import { CreditCardOffersGrid } from "@/components/sections/credit-card-offers-grid";
import { SaleEventBanner } from "@/components/sections/sale-event-banner";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";
import { loadFrontpageData, type FrontpageData } from "@/lib/frontpage-data";
import { getFeaturedCreditCards } from "@/lib/content/get-credit-card";
import { getLiveSaleEvent } from "@/lib/content/get-sale-event";
import { getSearchIndex } from "@/lib/content/get-search-index";
import type { CreditCard } from "@/lib/types/credit-card";
import type { SaleEvent } from "@/lib/types/sale-event";
import type { SearchResult } from "@/lib/search/search-index";

export default function FrontPage() {
  const [data, setData] = useState<FrontpageData>({
    stores: [],
    deals: [],
    coupons: [],
    statuses: {
      stores: { state: "loading" },
      deals: { state: "loading" },
      coupons: { state: "loading" },
    },
  });
  const [fixtures, setFixtures] = useState<{
    creditCards: CreditCard[];
    liveEvent: SaleEvent | undefined;
    searchIndex: SearchResult[];
  }>({ creditCards: [], liveEvent: undefined, searchIndex: [] });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [front, cards, event, search] = await Promise.allSettled([
        loadFrontpageData(),
        getFeaturedCreditCards(3),
        getLiveSaleEvent(),
        getSearchIndex(),
      ]);

      if (cancelled) return;

      if (front.status === "fulfilled") setData(front.value);

      setFixtures({
        creditCards: cards.status === "fulfilled" ? cards.value : [],
        liveEvent: event.status === "fulfilled" ? event.value : undefined,
        searchIndex: search.status === "fulfilled" ? search.value : [],
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const storesLoading = data.statuses.stores.state === "loading";
  const dealsLoading = data.statuses.deals.state === "loading";
  const couponsLoading = data.statuses.coupons.state === "loading";

  return (
    <>
      <Hero searchIndex={fixtures.searchIndex} popularStores={data.stores} />
      {dealsLoading ? (
        <SectionLoading label="Trending Deals" />
      ) : (
        <TrendingDealsRail deals={data.deals} stores={data.stores} />
      )}
      {storesLoading ? (
        <SectionLoading label="Popular Stores" />
      ) : (
        <PopularStoresGrid stores={data.stores} />
      )}
      {couponsLoading ? (
        <SectionLoading label="Latest Coupons" />
      ) : (
        <CouponsStrip coupons={data.coupons} />
      )}
      <CreditCardOffersGrid cards={fixtures.creditCards} />
      {fixtures.liveEvent ? <SaleEventBanner event={fixtures.liveEvent} /> : null}
      <NewsletterSignup />
    </>
  );
}

function SectionLoading({ label }: { label: string }) {
  return (
    <section className="border-t border-border-subtle px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <h2 className="mb-5 text-2xl">{label}</h2>
        <p className="text-sm text-text-muted">Loading from API…</p>
      </div>
    </section>
  );
}
