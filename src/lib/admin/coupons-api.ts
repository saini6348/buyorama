import { postJson } from "./http";

export interface AllCoupon {
  id: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;
  createdAt: string;
}

export async function listAllCoupons(limit = 200, offset = 0): Promise<AllCoupon[]> {
  const data = await postJson<{ data: AllCoupon[] }>("/api/coupons/list", {
    limit,
    offset,
  });
  return data.data ?? [];
}

export async function createAllCoupon(payload: {
  title: string;
  description: string;
  link: string;
  image?: string;
}): Promise<AllCoupon> {
  const data = await postJson<{ data: AllCoupon }>("/api/coupons/create", payload);
  return data.data;
}

export async function updateAllCoupon(payload: {
  id: string;
  title?: string;
  description?: string;
  link?: string;
  image?: string;
}): Promise<AllCoupon> {
  const data = await postJson<{ data: AllCoupon }>("/api/coupons/update", payload);
  return data.data;
}

export async function deleteAllCoupon(id: string): Promise<void> {
  await postJson<{ message: string }>("/api/coupons/delete", { id });
}
