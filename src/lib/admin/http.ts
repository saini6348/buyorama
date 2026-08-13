import { ADMIN_API_BASE_URL } from "@/lib/admin-api";

export async function postJson<T>(path: string, body: unknown): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  // Attach the auth token on every request if present (C-01 / M-01)
  if (typeof window !== "undefined") {
    const authToken = window.localStorage.getItem("authToken");
    if (authToken) {
      headers["Authorization"] = `Bearer ${authToken}`;
    }
  }

  const response = await fetch(`${ADMIN_API_BASE_URL}${path}`, {
    method: "POST",
    headers,
    body: JSON.stringify(body),
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }
  return data as T;
}
