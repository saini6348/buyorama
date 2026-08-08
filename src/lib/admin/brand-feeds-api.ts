import type { Brand, BrandCoupon, BrandFeed } from "@/lib/types/admin";
import { postJson } from "./http";

export async function loadBrandBySlug(slug: string): Promise<Brand | null> {
  const data = await postJson<{ data: Brand[] }>("/api/brands/list", {
    limit: 200,
    offset: 0,
  });
  return data.data.find((brand) => brand.slug === slug) ?? null;
}

export async function loadCoupons(brandId: string): Promise<BrandCoupon[]> {
  const data = await postJson<{ data: BrandCoupon[] }>("/api/brand-coupons/list", {
    brandId,
    limit: 200,
    offset: 0,
  });
  return data.data;
}

export async function createCoupon(payload: {
  brandId: string;
  title: string;
  description: string;
  link: string;
  image?: string;
}): Promise<BrandCoupon> {
  const data = await postJson<{ data: BrandCoupon }>("/api/brand-coupons/create", payload);
  return data.data;
}

export async function updateCoupon(payload: {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  image?: string;
}): Promise<BrandCoupon> {
  const data = await postJson<{ data: BrandCoupon }>("/api/brand-coupons/update", payload);
  return data.data;
}

export async function deleteCoupon(id: string): Promise<void> {
  await postJson<{ message: string }>("/api/brand-coupons/delete", { id });
}

export async function loadFeeds(brandId: string): Promise<BrandFeed[]> {
  const data = await postJson<{ data: BrandFeed[] }>("/api/brand-feeds/list", {
    brandId,
    limit: 200,
    offset: 0,
  });
  return data.data;
}

export async function createFeed(payload: {
  brandId: string;
  title: string;
  subtitle?: string;
  description: string;
  image?: string;
}): Promise<BrandFeed> {
  const data = await postJson<{ data: BrandFeed }>("/api/brand-feeds/create", payload);
  return data.data;
}

export async function updateFeed(payload: {
  id: string;
  title?: string;
  subtitle?: string;
  description?: string;
  image?: string;
}): Promise<BrandFeed> {
  const data = await postJson<{ data: BrandFeed }>("/api/brand-feeds/update", payload);
  return data.data;
}

export async function deleteFeed(id: string): Promise<void> {
  await postJson<{ message: string }>("/api/brand-feeds/delete", { id });
}
