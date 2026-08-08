import type { LookupItem } from "@/lib/types/admin";
import { postJson } from "./http";

function createLookupApi(basePath: string) {
  return {
    list: async (limit = 100, offset = 0): Promise<LookupItem[]> => {
      const data = await postJson<{ data: LookupItem[] }>(`${basePath}/list`, { limit, offset });
      return data.data ?? [];
    },
    create: async (name: string): Promise<LookupItem> => {
      const data = await postJson<{ data: LookupItem }>(`${basePath}/create`, { name });
      return data.data;
    },
    update: async (id: string, name: string): Promise<LookupItem> => {
      const data = await postJson<{ data: LookupItem }>(`${basePath}/update`, { id, name });
      return data.data;
    },
    updateStatus: async (id: string, status: 0 | 1): Promise<LookupItem> => {
      const data = await postJson<{ data: LookupItem }>(`${basePath}/update-status`, { id, status });
      return data.data;
    },
  };
}

export const cardCategoriesApi = createLookupApi("/api/card-categories");
export const banksApi = createLookupApi("/api/banks");
export const tagsApi = createLookupApi("/api/tags");
