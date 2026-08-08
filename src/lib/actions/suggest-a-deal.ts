"use server";

export interface SuggestDealState {
  status: "idle" | "success" | "error";
  message: string;
}

export async function suggestDeal(_prevState: SuggestDealState, formData: FormData): Promise<SuggestDealState> {
  const url = String(formData.get("url") ?? "").trim();

  if (!url || !/^https?:\/\//.test(url)) {
    return { status: "error", message: "Paste a valid product link (starting with http:// or https://)." };
  }

  // Mock — lands in a curator review queue once that exists.
  await new Promise((resolve) => setTimeout(resolve, 350));

  return { status: "success", message: "Thanks — our curators will take a look." };
}
