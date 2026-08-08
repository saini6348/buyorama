import { saleEvents, getSaleEventBySlug, getLiveSaleEvent as getLiveSaleEventFixture } from "@/lib/data/sale-events";
import type { SaleEvent } from "@/lib/types/sale-event";

export async function getAllSaleEvents(): Promise<SaleEvent[]> {
  return saleEvents;
}

export async function getSaleEvent(slug: string): Promise<SaleEvent | undefined> {
  return getSaleEventBySlug(slug);
}

export async function getLiveSaleEvent(): Promise<SaleEvent | undefined> {
  return getLiveSaleEventFixture();
}
