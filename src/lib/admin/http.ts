import { ADMIN_API_BASE_URL } from "@/lib/admin-api";

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
}
