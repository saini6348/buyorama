import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/seo/constants";
import { getAllStores } from "@/lib/content/get-store";
import { getStoreDeals } from "@/lib/content/get-deals";
import { getAllCreditCards, getCreditCardCategoryPages } from "@/lib/content/get-credit-card";
import { getAllSaleEvents } from "@/lib/content/get-sale-event";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [stores, creditCards, categoryPages, saleEvents] = await Promise.all([
    getAllStores(),
    getAllCreditCards(),
    getCreditCardCategoryPages(),
    getAllSaleEvents(),
  ]);

  const storeEntries = await Promise.all(
    stores.map(async (s) => {
      const deals = await getStoreDeals(s.slug);
      const latest = deals[0]?.publishedAt;
      return {
        url: `${SITE_URL}/${s.slug}`,
        lastModified: latest ? new Date(latest) : new Date(),
        changeFrequency: "hourly" as const,
        priority: 0.8,
      };
    })
  );

  const staticEntries: MetadataRoute.Sitemap = [
    { url: SITE_URL, changeFrequency: "hourly", priority: 1 },
    { url: `${SITE_URL}/stores`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/coupon-codes`, changeFrequency: "hourly", priority: 0.8 },
    { url: `${SITE_URL}/credit-card-offers`, changeFrequency: "daily", priority: 0.7 },
    { url: `${SITE_URL}/about-us`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/teams-of-us`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/contact-us`, changeFrequency: "monthly", priority: 0.3 },
  ];

  const creditCardEntries: MetadataRoute.Sitemap = creditCards.map((c) => ({
    url: `${SITE_URL}/credit-card-offers/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.6,
  }));

  const categoryEntries: MetadataRoute.Sitemap = categoryPages.map((c) => ({
    url: `${SITE_URL}/${c.slug}`,
    changeFrequency: "weekly",
    priority: 0.5,
  }));

  const saleEventEntries: MetadataRoute.Sitemap = saleEvents.map((e) => ({
    url: `${SITE_URL}/${e.slug}`,
    changeFrequency: "daily",
    priority: e.isLive ? 0.9 : 0.4,
  }));

  return [...staticEntries, ...storeEntries, ...creditCardEntries, ...categoryEntries, ...saleEventEntries];
}
