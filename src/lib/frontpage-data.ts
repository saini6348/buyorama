"use client";

import { getAllStores } from "@/lib/content/get-store";
import { getTrendingDeals } from "@/lib/content/get-deals";
import { getLatestCoupons } from "@/lib/content/get-coupons";
import type { Store } from "@/lib/types/store";
import type { Deal } from "@/lib/types/deal";
import type { Coupon } from "@/lib/types/coupon";

export type LiveStatus =
  | { state: "ok"; count: number; timeMs: number }
  | { state: "error"; error: string; timeMs: number }
  | { state: "loading" };

export interface FrontpageData {
  stores: Store[];
  deals: Deal[];
  coupons: Coupon[];
  statuses: {
    stores: LiveStatus;
    deals: LiveStatus;
    coupons: LiveStatus;
  };
}

/** Reset shape used before a fresh fetch round. */
function emptyData(): FrontpageData {
  return {
    stores: [],
    deals: [],
    coupons: [],
    statuses: {
      stores: { state: "loading" },
      deals: { state: "loading" },
      coupons: { state: "loading" },
    },
  };
}

/**
 * Client-side data loader used by the homepage. Fetches each public endpoint
 * from the browser (calls run on the front, hitting http://localhost:3015),
 * so API success/failure is visible in the Network tab and the status panel.
 * If an endpoint fails we keep whatever data returned (possibly empty) and
 * record the error — we never throw, so the page always renders.
 */
export async function loadFrontpageData(): Promise<FrontpageData> {
  const data = emptyData();

  const t0 = Date.now();
  const [storesRes, dealsRes, couponsRes] = await Promise.allSettled([
    getAllStores(),
    getTrendingDeals(4),
    getLatestCoupons(4),
  ]);

  if (storesRes.status === "fulfilled") {
    data.stores = storesRes.value;
    data.statuses.stores = { state: "ok", count: data.stores.length, timeMs: Date.now() - t0 };
  } else {
    data.statuses.stores = { state: "error", error: messageOf(storesRes.reason), timeMs: Date.now() - t0 };
  }

  if (dealsRes.status === "fulfilled") {
    data.deals = dealsRes.value;
    data.statuses.deals = { state: "ok", count: data.deals.length, timeMs: Date.now() - t0 };
  } else {
    data.statuses.deals = { state: "error", error: messageOf(dealsRes.reason), timeMs: Date.now() - t0 };
  }

  if (couponsRes.status === "fulfilled") {
    data.coupons = couponsRes.value;
    data.statuses.coupons = { state: "ok", count: data.coupons.length, timeMs: Date.now() - t0 };
  } else {
    data.statuses.coupons = { state: "error", error: messageOf(couponsRes.reason), timeMs: Date.now() - t0 };
  }

  return data;
}

function messageOf(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

