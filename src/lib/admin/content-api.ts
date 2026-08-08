import type { ContentItem } from "@/lib/types/admin";
import { postJson } from "./http";

interface RawContentItem {
  id: string;
  brand_id: string;
  brand?: { brandName: string };
  title: string;
  description: string;
  image_path?: string | null;
  status: 0 | 1;
  created_at: string;
}

function mapContentItem(raw: RawContentItem): ContentItem {
  return {
    id: raw.id,
    brandId: raw.brand_id,
    brand: raw.brand,
    title: raw.title,
    description: raw.description,
    image_path: raw.image_path,
    status: raw.status,
    created_at: raw.created_at,
  };
}

export async function listContent(limit = 100, offset = 0): Promise<ContentItem[]> {
  const data = await postJson<{ data: RawContentItem[] }>("/api/content/getAllListing", {
    limit,
    offset,
  });
  return (data.data ?? []).map(mapContentItem);
}

export async function createContent(payload: {
  brandId: string;
  title: string;
  description: string;
  imagePath?: string | null;
  status: 0 | 1;
}): Promise<ContentItem> {
  const data = await postJson<{ data: RawContentItem }>("/api/content/create", {
    brand_id: payload.brandId,
    title: payload.title,
    description: payload.description,
    image_path: payload.imagePath || undefined,
    status: payload.status,
  });
  return mapContentItem(data.data);
}

export async function updateContent(payload: {
  id: string;
  title: string;
  description: string;
  imagePath?: string | null;
  status: 0 | 1;
}): Promise<ContentItem> {
  const data = await postJson<{ data: RawContentItem }>("/api/content/update", {
    id: payload.id,
    title: payload.title,
    description: payload.description,
    image_path: payload.imagePath || undefined,
    status: payload.status,
  });
  return mapContentItem(data.data);
}

export async function updateContentStatus(id: string, status: 0 | 1): Promise<ContentItem> {
  const data = await postJson<{ data: RawContentItem }>("/api/content/update-status", { id, status });
  return mapContentItem(data.data);
}

export async function deleteContent(id: string): Promise<void> {
  await postJson<{ message: string }>("/api/content/delete", { id });
}
