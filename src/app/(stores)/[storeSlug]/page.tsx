import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStores, getStore, getStoreStats, getOtherStores } from "@/lib/content/get-store";
import { getStoreDeals } from "@/lib/content/get-deals";
import { getStoreBrandCoupons } from "@/lib/content/get-coupons";
import { BrandProfileView } from "@/components/brand-profile/brand-profile-view";
import { JsonLd } from "@/components/seo/json-ld";
import { breadcrumbJsonLd, storeDealsJsonLd } from "@/lib/seo/json-ld";

export async function generateStaticParams() {
  const stores = await getAllStores();
  return stores.map((s) => ({ storeSlug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/[storeSlug]">): Promise<Metadata> {
  const { storeSlug } = await params;
  const store = await getStore(storeSlug);
  if (!store) return {};
  return {
    title: `${store.name} Deals — Live Feed`,
    description: `Live, continuously-updated deals from ${store.name}. ${store.categoryLine}.`,
    alternates: { canonical: `/${store.slug}` },
  };
}

export const revalidate = 120;

export default async function StorePage({ params }: PageProps<"/[storeSlug]">) {
  const { storeSlug } = await params;
  const store = await getStore(storeSlug);
  if (!store) notFound();

  const [stats, deals, brandCoupons, otherStores] = await Promise.all([
    getStoreStats(storeSlug),
    getStoreDeals(storeSlug),
    getStoreBrandCoupons(storeSlug),
    getOtherStores(storeSlug, 6),
  ]);
  return (
    <>
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Stores", url: "/stores" },
          { name: store.name, url: `/${store.slug}` },
        ])}
      />
      {deals.length > 0 ? <JsonLd data={storeDealsJsonLd(store, deals)} /> : null}
      <BrandProfileView
        store={store}
        stats={stats}
        deals={deals}
        brandCoupons={brandCoupons}
        otherStores={otherStores}
      />
    </>
  );
}

