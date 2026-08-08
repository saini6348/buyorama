/**
 * Base URL for the standalone backoffice API (see /buyorama/backendAdmin).
 * Override with NEXT_PUBLIC_ADMIN_API_BASE_URL once that service has a real address.
 */
export const ADMIN_API_BASE_URL = process.env.NEXT_PUBLIC_ADMIN_API_BASE_URL ?? "http://localhost:3011";
