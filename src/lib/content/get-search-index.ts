import { buildSearchIndex, type SearchResult } from "@/lib/search/search-index";

export async function getSearchIndex(): Promise<SearchResult[]> {
  return buildSearchIndex();
}
