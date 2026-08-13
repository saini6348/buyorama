import { publicApiGet } from "@/lib/public-api";
import type { Store } from "@/lib/types/store";

/**
 * Content accessor layer — fetches live data from the public Nest API
 * (publicApis module). These become the single source of truth for the
 * public site.
 */

interface PublicStore {
  slug: string;
  name: string;
  logo: string | null;
  categoryLine: string;
  logoBg: string;
  logoFg: string;
  monogram: string;
  officialUrl: string;
  fallbackOfferText?: string;
}

interface PublicCoupon {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;
  createdAt: string;
}

interface PublicStoreStats {
  brandId: string;
  totalDeals: number;
  totalCoupons: number;
  hasLiveFeed: boolean;
}

// Stable, brand-style defaults so tiles render even when the Brand record has no
// logo colors. Derived deterministically from the store name.
const DEFAULT_PALETTES = [
  { logoBg: "#2d3748", logoFg: "#ffffff" },
  { logoBg: "#7c3aed", logoFg: "#ffffff" },
  { logoBg: "#0e7490", logoFg: "#ffffff" },
  { logoBg: "#b91c1c", logoFg: "#ffffff" },
  { logoBg: "#4d7c0f", logoFg: "#ffffff" },
  { logoBg: "#9d174d", logoFg: "#ffffff" },
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

export function mapStore(publicStore: PublicStore): Store {
  const palette =
    publicStore.logoBg && publicStore.logoFg
      ? { logoBg: publicStore.logoBg, logoFg: publicStore.logoFg }
      : DEFAULT_PALETTES[hashString(publicStore.name) % DEFAULT_PALETTES.length];

  return {
    slug: publicStore.slug,
    name: publicStore.name,
    categoryLine: publicStore.categoryLine || "Electronics · Fashion · Home",
    logoBg: palette.logoBg,
    logoFg: palette.logoFg,
    monogram: publicStore.monogram || (publicStore.name ? publicStore.name.charAt(0).toUpperCase() : ""),
    officialUrl: publicStore.officialUrl || "",
    fallbackOfferText: publicStore.fallbackOfferText,
  };
}

export async function getAllStores(): Promise<Store[]> {
  const res = await publicApiGet<{ data: PublicStore[] }>("/api/public/stores");
  const stores = res.data ?? [];
  // Map and prioritise stores that actually have data first, otherwise keep order.
  return stores.map(mapStore);
}

export async function getStore(slug: string): Promise<Store | undefined> {
  const res = await publicApiGet<{ data: PublicStore }>(`/api/public/stores/${encodeURIComponent(slug)}`);
  return mapStore(res.data);
}

export async function getStoreStats(slug: string) {
  const res = await publicApiGet<{ data: PublicStoreStats }>(
    `/api/public/stores/${encodeURIComponent(slug)}/stats`,
  );
  const stats = res.data;
  return {
    totalPosts: stats.totalDeals,
    totalCoupons: stats.totalCoupons,
    hasLiveFeed: stats.hasLiveFeed,
  };
}

export async function getOtherStores(excludeSlug: string, limit = 6) {
  const res = await publicApiGet<{ data: PublicStore[] }>("/api/public/stores");
  const stores = res.data ?? [];
  return stores
    .filter((s) => s.slug !== excludeSlug)
    .map((s) => ({ ...mapStore(s), liveDealsCount: 0 }))
    .slice(0, limit);
}
