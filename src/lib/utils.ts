import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString("en-IN")}`;
}

export function formatDiscount(percent: number): string {
  return `${percent}% OFF`;
}

const ACCENT_COLORS = [
  "#7c3aed", // purple
  "#06b6d4", // cyan
  "#ec4899", // pink
  "#f59e0b", // amber
  "#10b981", // emerald
  "#ef4444", // red
  "#3b82f6", // blue
  "#8b5cf6", // violet
  "#14b8a6", // teal
  "#f97316", // orange
  "#6366f1", // indigo
  "#d946ef", // fuchsia
];

export function colorForId(id: string): string {
  const hash = id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0);
  return ACCENT_COLORS[hash % ACCENT_COLORS.length];
}

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/&/g, "and")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-+|-+$)/g, "");
}

export function getTimeRemaining(expiresAt: string | Date) {
  const target = new Date(expiresAt).getTime();
  const diff = target - Date.now();
  if (diff <= 0) {
    return { hours: 0, minutes: 0, seconds: 0, expired: true };
  }
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { hours, minutes, seconds, expired: false };
}

export function formatCountdown(expiresAt: string | Date): string {
  const { hours, minutes, seconds, expired } = getTimeRemaining(expiresAt);
  if (expired) return "Expired";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
}

export function timeAgo(dateInput: string | Date): string {
  const date = new Date(dateInput).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - date) / 1000));
  if (diffSeconds < 60) return "just now";
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hr ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
}

export function isExpiringSoon(expiresAt: string | Date, withinHours = 24): boolean {
  const { hours, expired } = getTimeRemaining(expiresAt);
  return !expired && hours < withinHours;
}
