/**
 * Base URL for the public, read-only API served by the standalone Nest
 * backoffice (publicApis module). Override in production with
 * NEXT_PUBLIC_PUBLIC_API_BASE_URL.
 */
export const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ?? "http://localhost:3011";

/**
 * Small helper to GET a public endpoint.
 *
 * On failure (network error or non-2xx) it does NOT throw — it returns an
 * empty list-shaped payload. This keeps the Next.js static build from
 * crashing when the live API is momentarily unreachable during `next build`
 * (e.g. the API deploying separately from the frontend). Runtime consumers
 * already handle an empty `data` array and degrade gracefully.
 */
export async function publicApiGet<T>(path: string): Promise<T> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      // Note: do NOT force per-request no-store here. Next.js 16 requires
      // statically-rendered routes to use cacheable fetches; page-level
      // `revalidate` on each route is what keeps dynamic content fresh
      // (ISR) without breaking `next build`.
    });

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[public-api] ${response.status} for ${path} — returning empty data.`);
      return { data: [] } as T;
    }

  return (await response.json()) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[public-api] request failed for ${path}:`, error);
    // Return an empty list payload so page builders don't crash.
    return { data: [] } as T;
  }
}

/**
 * POST helper for public endpoints (e.g. POST /api/public/cards-feed/list).
 * Like publicApiGet it never throws — on failure it returns an empty
 * list-shaped payload so the UI degrades gracefully.
 */
export async function publicApiPost<T>(path: string, body: unknown): Promise<T> {
  try {
    const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      // eslint-disable-next-line no-console
      console.warn(`[public-api] ${response.status} for POST ${path} — returning empty data.`);
      return { data: [] } as T;
    }

    return (await response.json()) as T;
  } catch (error) {
    // eslint-disable-next-line no-console
    console.warn(`[public-api] POST request failed for ${path}:`, error);
    return { data: [] } as T;
  }
}

