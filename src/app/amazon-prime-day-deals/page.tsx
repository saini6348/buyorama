import type { Metadata } from "next";
import { getSaleEvent } from "@/lib/content/get-sale-event";
import { SaleEventPageView } from "@/components/pages/sale-event-page-view";

const SLUG = "amazon-prime-day-deals";

export async function generateMetadata(): Promise<Metadata> {
  const event = await getSaleEvent(SLUG);
  return { title: event?.name, description: event?.description };
}

export const revalidate = 300;

export default function Page() {
  return <SaleEventPageView slug={SLUG} />;
}
