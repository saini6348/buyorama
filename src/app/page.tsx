import { getAllStores } from "@/lib/content/get-store";
import { getTrendingDeals } from "@/lib/content/get-deals";
import { getLatestCoupons } from "@/lib/content/get-coupons";
import { getFeaturedCreditCards } from "@/lib/content/get-credit-card";
import { getLiveSaleEvent } from "@/lib/content/get-sale-event";
import { getSearchIndex } from "@/lib/content/get-search-index";
import { Hero } from "@/components/sections/hero";
import { TrendingDealsRail } from "@/components/sections/trending-deals-rail";
import { PopularStoresGrid } from "@/components/sections/popular-stores-grid";
import { CouponsStrip } from "@/components/sections/coupons-strip";
import { CreditCardOffersGrid } from "@/components/sections/credit-card-offers-grid";
import { SaleEventBanner } from "@/components/sections/sale-event-banner";
import { NewsletterSignup } from "@/components/sections/newsletter-signup";

export default async function HomePage() {
  const [stores, trendingDeals, coupons, creditCards, liveEvent, searchIdx] = await Promise.all([
    getAllStores(),
    getTrendingDeals(4),
    getLatestCoupons(4),
    getFeaturedCreditCards(3),
    getLiveSaleEvent(),
    getSearchIndex(),
  ]);

  return (
    <>
      <Hero searchIndex={searchIdx} popularStores={stores} />
      <TrendingDealsRail deals={trendingDeals} stores={stores} />
      <PopularStoresGrid stores={stores} />
      <CouponsStrip coupons={coupons} />
      <CreditCardOffersGrid cards={creditCards} />
      {liveEvent ? <SaleEventBanner event={liveEvent} /> : null}
      <NewsletterSignup />
    </>
  );
}
