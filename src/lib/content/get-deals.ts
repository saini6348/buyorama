import { getDealsByStore as getDealsByStoreFixture, getTrendingDeals as getTrendingDealsFixture } from "@/lib/data/deals";
import type { Deal } from "@/lib/types/deal";

export async function getStoreDeals(storeSlug: string): Promise<Deal[]> {
  return getDealsByStoreFixture(storeSlug);
}

export async function getTrendingDeals(limit = 4): Promise<Deal[]> {
  return getTrendingDealsFixture(limit);
}
