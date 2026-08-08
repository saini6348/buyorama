import type { Brand } from "@/lib/types/admin";
import { postJson } from "./http";

export async function listBrands(limit = 100, offset = 0): Promise<Brand[]> {
  const data = await postJson<{ data: Brand[] }>("/api/brands/list", { limit, offset });
  return data.data ?? [];
}

export async function createBrand(payload: {
  brandName: string;
  slug: string;
  logo?: string;
}): Promise<Brand> {
  const data = await postJson<{ data: Brand }>("/api/brands/create", payload);
  return data.data;
}

export async function updateBrand(payload: {
  id: string;
  brandName: string;
  slug: string;
  logo?: string;
}): Promise<Brand> {
  const data = await postJson<{ data: Brand }>("/api/brands/update", payload);
  return data.data;
}

export async function updateBrandStatus(id: string, status: 0 | 1): Promise<Brand> {
  const data = await postJson<{ data: Brand }>("/api/brands/update-status", { id, status });
  return data.data;
}
