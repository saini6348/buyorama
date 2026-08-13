import { publicApiGet } from "@/lib/public-api";
import type { Coupon } from "@/lib/types/coupon";

interface PublicCoupon {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;
  createdAt: string;
}

/** Default gradient for the coupon "stub" since public coupons have no brand colours. */
const STUB_GRADIENT: [string, string] = ["#7c3aed", "#d6266b"];

/** Derive a short, legible stub label (e.g. "FLAT" / "OFF") from the title. */
function stubLabelFromTitle(title: string): string {
  const first = title.trim().split(/\s+/)[0]?.toUpperCase() ?? "";
  if (first.length <= 5) return first || "DEAL";
  return first.slice(0, 5);
}

export function mapPublicCoupon(c: PublicCoupon): Coupon {
  return {
    id: c.id,
    storeSlug: "", // generic site-wide coupon; no brand association
    storeName: "",
    headline: c.title,
    description: c.description ?? "",
    code: "",
    stubLabel: stubLabelFromTitle(c.title),
    stubFrom: STUB_GRADIENT[0],
    stubTo: STUB_GRADIENT[1],
    publishedAt: c.createdAt,
    affiliateUrl: c.link,
    verified: false,
  };
}

export async function getAllCoupons(): Promise<Coupon[]> {
  const res = await publicApiGet<{ data: PublicCoupon[] }>("/api/public/coupons?limit=200");
  return (res.data ?? []).map(mapPublicCoupon);
}

export async function getStoreCoupons(storeSlug: string): Promise<Coupon[]> {
  // Public API has no store-scoped coupon endpoint (brand coupons only appear
  // on brand detail pages). Return empty for now.
  return [];
}

export async function getLatestCoupons(limit = 4): Promise<Coupon[]> {
  const res = await publicApiGet<{ data: PublicCoupon[] }>(
    `/api/public/coupons/latest?limit=${limit}`,
  );
  return (res.data ?? []).map(mapPublicCoupon);
}

/** Brand-scoped coupon returned by the public brand-coupons endpoint. */
export interface BrandCoupon {
  id: string;
  brandId: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;
  status: 0 | 1;
  createdAt: string;
}

/** Fetch the brand coupons for a specific store/brand by slug (brand detail page). */
export async function getStoreBrandCoupons(storeSlug: string): Promise<BrandCoupon[]> {
  const res = await publicApiGet<{ data: BrandCoupon[] }>(
    `/api/public/stores/${encodeURIComponent(storeSlug)}/coupons`,
  );
  return res.data ?? [];
}

