import type { LookupItem } from "@/lib/types/admin";
import { postJson } from "./http";

export interface CardCategory extends LookupItem {}
export interface BankItem extends LookupItem {}
export interface TagItem extends LookupItem {}

export interface CardsFeed {
  id: string;
  title: string;
  description?: string | null;
  image?: string | null;
  link?: string | null;
  bankId?: string | null;
  bank?: { id: string; name: string } | null;
  creditCardCategories?: CardCategory[];
  tags?: TagItem[];
  status: 0 | 1;
  createdAt: string;
}

export interface CardsFeedListParams {
  status?: 0 | 1;
  bankId?: string;
  categoryIds?: string[];
  tagIds?: string[];
  limit?: number;
  offset?: number;
}

export async function listCardsFeeds(params: CardsFeedListParams = {}): Promise<{ data: CardsFeed[]; total: number }> {
  return postJson("/api/cards-feed/list", params);
}

export async function getCardsFeed(id: string): Promise<CardsFeed> {
  const res = await postJson<{ data: CardsFeed }>("/api/cards-feed/get", { id });
  return res.data;
}

export async function createCardsFeed(payload: {
  title: string;
  description?: string;
  image?: string;
  link?: string;
  bankId?: string;
  creditCardCategoryIds?: string[];
  tagIds?: string[];
}): Promise<CardsFeed> {
  const res = await postJson<{ data: CardsFeed }>("/api/cards-feed/create", payload);
  return res.data;
}

export async function updateCardsFeed(payload: {
  id: string;
  title?: string;
  description?: string;
  image?: string;
  link?: string;
  bankId?: string;
  status?: 0 | 1;
  creditCardCategoryIds?: string[];
  tagIds?: string[];
}): Promise<CardsFeed> {
  const res = await postJson<{ data: CardsFeed }>("/api/cards-feed/update", payload);
  return res.data;
}

export async function updateCardsFeedStatus(id: string, status: 0 | 1): Promise<CardsFeed> {
  const res = await postJson<{ data: CardsFeed }>("/api/cards-feed/update-status", { id, status });
  return res.data;
}

export async function deleteCardsFeed(id: string): Promise<void> {
  await postJson<{ message: string }>("/api/cards-feed/delete", { id });
}

// Lookup helpers (active only)
const cardCategoriesPath = "/api/card-categories";
const banksPath = "/api/banks";
const tagsPath = "/api/tags";

async function lookupList(path: string): Promise<LookupItem[]> {
  const res = await postJson<{ data: LookupItem[] }>(`${path}/list`, { status: 1, limit: 100, offset: 0 });
  return res.data ?? [];
}

export function listActiveCardCategories(): Promise<LookupItem[]> {
  return lookupList(cardCategoriesPath);
}

export function listActiveBanks(): Promise<LookupItem[]> {
  return lookupList(banksPath);
}

export function listActiveTags(): Promise<LookupItem[]> {
  return lookupList(tagsPath);
}
