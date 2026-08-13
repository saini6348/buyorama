import { publicApiGet } from "@/lib/public-api";
import type { Deal } from "@/lib/types/deal";

interface PublicDeal {
  id: string;
  storeSlug: string;
  storeName: string;
  category: string;
  type: string;
  title: string;
  subtitle?: string | null;
  description: string;
  image?: string | null;
  publishedAt: string;
  affiliateUrl: string;
  originalPrice: number;
  price: number;
  discountPercent: number;
}

const DEAL_GRADIENTS: [string, string][] = [
  ["#7c3aed", "#d6266b"],
  ["#0e7490", "#0891b2"],
  ["#b45309", "#d97706"],
  ["#166534", "#16a34a"],
  ["#9d174d", "#db2777"],
  ["#1e3a8a", "#2563eb"],
];

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function thumbLabelFrom(title: string): string {
  const words = title.trim().split(/\s+/);
  if (words.length <= 3) return title.toUpperCase();
  return words.slice(0, 4).join(" ").toUpperCase();
}

export function mapDeal(d: PublicDeal): Deal {
  const [thumbFrom, thumbTo] = DEAL_GRADIENTS[hashString(d.title) % DEAL_GRADIENTS.length];
  return {
    id: d.id,
    storeSlug: d.storeSlug,
    category: d.category || "Deals",
    type: "brandOffer",
    title: d.title,
    thumbFrom,
    thumbTo,
    thumbLabel: thumbLabelFrom(d.title),
    price: d.price || 0,
    originalPrice: d.originalPrice || 0,
    discountPercent: d.discountPercent || 0,
    publishedAt: d.publishedAt,
    affiliateUrl: d.affiliateUrl || "#",
  };
}

export async function getStoreDeals(storeSlug: string): Promise<Deal[]> {
  const res = await publicApiGet<{ data: PublicDeal[] }>(
    `/api/public/stores/${encodeURIComponent(storeSlug)}/deals`,
  );
  return (res.data ?? []).map(mapDeal);
}

export async function getTrendingDeals(limit = 4): Promise<Deal[]> {
  const res = await publicApiGet<{ data: PublicDeal[] }>(`/api/public/deals?limit=${limit}`);
  return (res.data ?? []).map(mapDeal);
}

export async function getDealById(id: string): Promise<Deal | undefined> {
  const res = await publicApiGet<{ data: PublicDeal }>(`/api/public/deals/${encodeURIComponent(id)}`);
  return res.data ? mapDeal(res.data) : undefined;
}
