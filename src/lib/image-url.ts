/**
 * Shared helpers for resolving backend image paths.
 *
 * Backend uploads return/stored as a RELATIVE path (e.g. "/uploads/2026/aug/x.jpg")
 * so the DB column stays host-agnostic. These helpers pin that path to whichever
 * backend origin is serving it (admin vs public base URL) at render time.
 */

/** Build a fully-qualified URL for a backend image path against a given base URL. */
export function resolveImageUrlWithBase(
  urlOrPath: string | null | undefined,
  baseUrl: string,
): string {
  if (!urlOrPath) return "";
  if (/^https?:\/\//i.test(urlOrPath)) return urlOrPath;
  return `${baseUrl}${urlOrPath}`;
}
