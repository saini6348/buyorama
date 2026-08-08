import type { Coupon } from "@/lib/types/coupon";

function minutesAgo(n: number) {
  return new Date(Date.now() - n * 60_000).toISOString();
}
function hoursAgo(n: number) {
  return new Date(Date.now() - n * 60 * 60_000).toISOString();
}
function daysAgo(n: number) {
  return new Date(Date.now() - n * 24 * 60 * 60_000).toISOString();
}
function hoursFromNow(n: number) {
  return new Date(Date.now() + n * 60 * 60_000).toISOString();
}

export const coupons: Coupon[] = [
  {
    id: "flipkart-fash200",
    storeSlug: "flipkart-deals",
    storeName: "Flipkart",
    headline: "Flat ₹200 off Fashion",
    description: "Min. order ₹1,499 on apparel & footwear",
    code: "FASH200",
    stubLabel: "FLAT\n200",
    stubFrom: "#2874F0",
    stubTo: "#16213E",
    publishedAt: hoursAgo(2),
    affiliateUrl: "https://www.flipkart.com",
  },
  {
    id: "flipkart-elec500",
    storeSlug: "flipkart-deals",
    storeName: "Flipkart",
    headline: "Flat ₹500 off Electronics",
    description: "Min. order ₹4,000",
    code: "ELEC500",
    stubLabel: "FLAT\n₹500",
    stubFrom: "#F2790A",
    stubTo: "#D6146B",
    publishedAt: minutesAgo(20),
    affiliateUrl: "https://www.flipkart.com",
  },
  {
    id: "mcaffeine-mcaf15",
    storeSlug: "mcaffeine-offers",
    storeName: "mCaffeine",
    headline: "15% off Body Care Combos",
    description: "Sitewide",
    code: "MCAF15",
    stubLabel: "15%\nOFF",
    stubFrom: "#17B8C4",
    stubTo: "#0E7A83",
    publishedAt: hoursAgo(4),
    expiresAt: hoursFromNow(6),
    affiliateUrl: "https://www.mcaffeine.com",
  },
  {
    id: "ajio-ajio200",
    storeSlug: "ajio-deals",
    storeName: "Ajio",
    headline: "₹200 off on first order",
    description: "New users only",
    code: "AJIO200",
    stubLabel: "₹200\nOFF",
    stubFrom: "#E91E76",
    stubTo: "#16213E",
    publishedAt: hoursAgo(1),
    verified: true,
    affiliateUrl: "https://www.ajio.com",
  },
  {
    id: "tmc-tmc25",
    storeSlug: "the-man-company-offers",
    storeName: "The Man Company",
    headline: "25% off Grooming Kits",
    description: "Sitewide",
    code: "TMC25",
    stubLabel: "25%\nOFF",
    stubFrom: "#FFC94A",
    stubTo: "#F2790A",
    publishedAt: hoursAgo(3),
    affiliateUrl: "https://www.themancompany.com",
  },
  {
    id: "tmc-tmc10",
    storeSlug: "the-man-company-offers",
    storeName: "The Man Company",
    headline: "Extra 10% off sitewide",
    description: "No minimum order value",
    code: "TMC10",
    stubLabel: "10%\nOFF",
    stubFrom: "#1A1A1A",
    stubTo: "#37436A",
    publishedAt: hoursAgo(20),
    affiliateUrl: "https://www.themancompany.com",
  },
  {
    id: "tmc-tmcgroom",
    storeSlug: "the-man-company-offers",
    storeName: "The Man Company",
    headline: "Buy 1 Get 1 on Grooming Kits",
    description: "On select grooming combos",
    code: "TMCGROOM",
    stubLabel: "B1G1\nFREE",
    stubFrom: "#D6146B",
    stubTo: "#1A1A1A",
    publishedAt: daysAgo(1),
    affiliateUrl: "https://www.themancompany.com",
  },
  {
    id: "tmc-tmcfreeship",
    storeSlug: "the-man-company-offers",
    storeName: "The Man Company",
    headline: "Free shipping over ₹499",
    description: "Sitewide, no code stacking",
    code: "TMCFREESHIP",
    stubLabel: "FREE\nSHIP",
    stubFrom: "#17B8C4",
    stubTo: "#1A1A1A",
    publishedAt: daysAgo(2),
    affiliateUrl: "https://www.themancompany.com",
  },
  {
    id: "amazon-amz10",
    storeSlug: "amazon-deals",
    storeName: "Amazon",
    headline: "10% off Mobile Accessories",
    description: "On orders above ₹999",
    code: "AMZ10",
    stubLabel: "10%\nOFF",
    stubFrom: "#131921",
    stubTo: "#F2790A",
    publishedAt: hoursAgo(5),
    affiliateUrl: "https://www.amazon.in",
  },
  {
    id: "myntra-myntra300",
    storeSlug: "myntra-deals",
    storeName: "Myntra",
    headline: "Flat ₹300 off on Fashion",
    description: "Min. order ₹1,999",
    code: "MYNTRA300",
    stubLabel: "FLAT\n300",
    stubFrom: "#FF3F6C",
    stubTo: "#16213E",
    publishedAt: hoursAgo(8),
    expiresAt: hoursFromNow(10),
    affiliateUrl: "https://www.myntra.com",
  },
  {
    id: "croma-croma5",
    storeSlug: "croma-deals",
    storeName: "Croma",
    headline: "5% instant discount via Croma Pay",
    description: "On electronics & appliances",
    code: "CROMA5",
    stubLabel: "5%\nOFF",
    stubFrom: "#143C6B",
    stubTo: "#17B8C4",
    publishedAt: daysAgo(1),
    affiliateUrl: "https://www.croma.com",
  },
  {
    id: "dotandkey-dk20",
    storeSlug: "dot-and-key-offers",
    storeName: "Dot & Key",
    headline: "20% off Vitamin C range",
    description: "Sitewide on serums",
    code: "DK20",
    stubLabel: "20%\nOFF",
    stubFrom: "#000000",
    stubTo: "#D4AF37",
    publishedAt: hoursAgo(14),
    affiliateUrl: "https://www.dotandkey.com",
  },
];

export function getCouponsByStore(storeSlug: string): Coupon[] {
  return coupons
    .filter((c) => c.storeSlug === storeSlug)
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
}

export function getLatestCoupons(limit = 4): Coupon[] {
  return [...coupons]
    .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
    .slice(0, limit);
}
