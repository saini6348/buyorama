import type { SaleEvent } from "@/lib/types/sale-event";

/**
 * Only Flipkart Big Billion Days ships with real content from the source
 * design doc. The other three are named real events with illustrative
 * placeholder content (they run periodically and stay dormant/"between
 * cycles" outside their live window) — per the confirmed seed-content
 * decision, so all four permanent event pages render complete.
 */
export const saleEvents: SaleEvent[] = [
  {
    slug: "flipkart-big-billion-days-deals",
    name: "Flipkart Big Billion Days Deals",
    storeSlug: "flipkart-deals",
    storeName: "Flipkart",
    isLive: true,
    dateRange: "Live now",
    description: "Flipkart's flagship annual sale — steep discounts across electronics, fashion, and home, refreshed through the event window.",
    heroFrom: "#FFC94A",
    heroTo: "#FDE1EE",
    shopUrl: "https://www.flipkart.com",
  },
  {
    slug: "amazon-prime-day-deals",
    name: "Amazon Prime Day Deals",
    storeSlug: "amazon-deals",
    storeName: "Amazon",
    isLive: false,
    dateRange: "Typically held in July",
    description: "Prime-member-exclusive deals across every category, usually Amazon's biggest sale outside the festive season.",
    heroFrom: "#FF9900",
    heroTo: "#FFEBD4",
    shopUrl: "https://www.amazon.in",
  },
  {
    slug: "amazon-great-indian-festival-deals",
    name: "Amazon Great Indian Festival Deals",
    storeSlug: "amazon-deals",
    storeName: "Amazon",
    isLive: false,
    dateRange: "Usually held around Diwali (Sept–Oct)",
    description: "Amazon's festive-season flagship sale — bank offers stack with deep category discounts across the site.",
    heroFrom: "#F2790A",
    heroTo: "#FFF4DA",
    shopUrl: "https://www.amazon.in",
  },
  {
    slug: "flipkart-goat-sale-deals",
    name: "Flipkart GOAT Sale Deals",
    storeSlug: "flipkart-deals",
    storeName: "Flipkart",
    isLive: false,
    dateRange: "Runs periodically through the year",
    description: "Flipkart's 'Greatest Of All Time' sale — a mid-cycle event bridging the gap between the two big festive sales.",
    heroFrom: "#17B8C4",
    heroTo: "#DCF6F6",
    shopUrl: "https://www.flipkart.com",
  },
];

export function getSaleEventBySlug(slug: string): SaleEvent | undefined {
  return saleEvents.find((e) => e.slug === slug);
}

export function getLiveSaleEvent(): SaleEvent | undefined {
  return saleEvents.find((e) => e.isLive) ?? saleEvents[0];
}
