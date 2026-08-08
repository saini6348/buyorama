import { stores, getStoreBySlug } from "@/lib/data/stores";
import { getDealsByStore } from "@/lib/data/deals";
import { getCouponsByStore } from "@/lib/data/coupons";
import type { Store } from "@/lib/types/store";

/**
 * Content accessor layer — the only seam pages/components should import
 * content through. Swapping the fixture-backed implementation below for a
 * real headless CMS later means rewriting these function bodies only.
 */

export async function getAllStores(): Promise<Store[]> {
  return stores;
}

export async function getStore(slug: string): Promise<Store | undefined> {
  return getStoreBySlug(slug);
}

export async function getStoreStats(slug: string) {
  const deals = getDealsByStore(slug);
  const coupons = getCouponsByStore(slug);
  return {
    totalPosts: deals.length,
    totalCoupons: coupons.length,
    hasLiveFeed: deals.length > 0,
  };
}

export async function getOtherStores(excludeSlug: string, limit = 6) {
  return stores
    .filter((s) => s.slug !== excludeSlug)
    .map((s) => ({ ...s, liveDealsCount: getDealsByStore(s.slug).length }))
    .sort((a, b) => b.liveDealsCount - a.liveDealsCount)
    .slice(0, limit);
}
