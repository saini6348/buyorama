import { coupons, getCouponsByStore as getCouponsByStoreFixture, getLatestCoupons as getLatestCouponsFixture } from "@/lib/data/coupons";
import type { Coupon } from "@/lib/types/coupon";

export async function getAllCoupons(): Promise<Coupon[]> {
  return [...coupons].sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export async function getStoreCoupons(storeSlug: string): Promise<Coupon[]> {
  return getCouponsByStoreFixture(storeSlug);
}

export async function getLatestCoupons(limit = 4): Promise<Coupon[]> {
  return getLatestCouponsFixture(limit);
}
