/**
 * Base URL for the public, read-only API served by the standalone Nest
 * backoffice (publicApis module). Override in production with
 * NEXT_PUBLIC_PUBLIC_API_BASE_URL.
 */
export const PUBLIC_API_BASE_URL =
  process.env.NEXT_PUBLIC_PUBLIC_API_BASE_URL ?? "http://localhost:3011";

/** Small helper to GET a public endpoint and throw on non-2xx. */
export async function publicApiGet<T>(path: string): Promise<T> {
  const response = await fetch(`${PUBLIC_API_BASE_URL}${path}`, {
    method: "GET",
    headers: { "Content-Type": "application/json" },
    // Allow the response to be revalidated on each request so dynamic content updates.
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Public API request failed: ${response.status} ${path}`);
  }

  return (await response.json()) as T;
}
