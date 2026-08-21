import { postJson } from "./http";
import { ADMIN_API_BASE_URL } from "@/lib/admin-api";
import { resolveImageUrlWithBase } from "@/lib/image-url";

/** Build a fully-qualified URL for a backend image path (e.g. "/uploads/x.png"). */
export function resolveImageUrl(urlOrPath?: string | null): string {
  return resolveImageUrlWithBase(urlOrPath, ADMIN_API_BASE_URL);
}

/**
 * Uploads a base64 data-URL image to the backoffice API /uploads folder and
 * returns the RELATIVE file path (e.g. "/uploads/2026/aug/x.png") — no domain.
 * We keep just the path in state/DB and let `resolveImageUrl()` add the backend
 * origin when rendering, so the stored column stays host-agnostic.
 */
export async function uploadImage(dataUrl: string): Promise<string> {
  const res = await postJson<{ url: string; message: string }>("/api/uploads", {
    dataUrl,
  });
  return res.url;
}

/**
 * Deletes an uploaded image file from the backoffice /uploads folder by its URL.
 */
export async function deleteUploadedImage(url: string): Promise<void> {
  await postJson<{ message: string }>("/api/uploads/delete", { url });
}

