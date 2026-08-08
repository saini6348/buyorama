import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { getAllStores, getStore, getStoreStats, getOtherStores } from "@/lib/content/get-store";
import { getStoreDeals } from "@/lib/content/get-deals";
import { BrandProfileSidebar } from "@/components/brand-profile/brand-profile-sidebar";
import { OtherBrandsRail } from "@/components/brand-profile/other-brands-rail";
import { EmptyFeedState } from "@/components/brand-profile/empty-feed-state";
import { StoreFeed } from "@/components/brand-profile/store-feed";
import { StoreLogo } from "@/components/ui/store-logo";
import { DealCard } from "@/components/deals/deal-card";
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

  const [stats, deals, otherStores] = await Promise.all([getStoreStats(storeSlug), getStoreDeals(storeSlug), getOtherStores(storeSlug, 6)]);

  return (
    <div className="mx-auto grid max-w-7xl profile:grid-cols-[240px_1fr_260px]">
      <JsonLd
        data={breadcrumbJsonLd([
          { name: "Home", url: "/" },
          { name: "Stores", url: "/stores" },
          { name: store.name, url: `/${store.slug}` },
        ])}
      />
      {deals.length > 0 ? <JsonLd data={storeDealsJsonLd(store, deals)} /> : null}
      <BrandProfileSidebar
        logo={<StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={72} rounded="rounded-lg" />}
        title={store.name}
        subtitle={store.categoryLine}
        slugPillLabel={`/${store.slug}/`}
        stats={[
          { label: "Total Posts", value: stats.totalPosts },
          { label: "Total Coupons", value: stats.totalCoupons },
        ]}
        navLinks={[
          { label: "Live Feed", href: `/${store.slug}`, active: true },
          { label: "Coupons", href: "/coupon-codes" },
          { label: "Categories", href: "/stores" },
          { label: "About Store", href: store.officialUrl },
        ]}
      >
        {deals.length > 0 ? (
          <div>
            <div className="mb-2.5 text-[13.5px] font-extrabold text-text-primary">Deals</div>
            <div className="flex flex-col gap-2.5">
              {deals.slice(0, 2).map((d) => (
                <DealCard key={d.id} deal={d} className="w-full" />
              ))}
            </div>
          </div>
        ) : (
          <div className="rounded-lg border border-border-subtle bg-bg-sunken p-4 text-center text-[12.5px] text-text-secondary">
            No individual deals logged yet for this store — check back soon, or browse their site-wide offer.
          </div>
        )}
      </BrandProfileSidebar>

      <div className="border-b border-border-subtle profile:border-b-0 profile:border-r">
        {deals.length > 0 ? (
          <StoreFeed store={store} deals={deals} />
        ) : (
          <div>
            <div className="flex items-center justify-between px-5 pt-5">
              <h2 className="text-xl">Feeds</h2>
              <span className="text-[11px] font-bold text-text-muted">No live deals right now</span>
            </div>
            <EmptyFeedState store={store} />
          </div>
        )}
      </div>

      <OtherBrandsRail stores={otherStores} monthlySavingsStat="2.4M+" />
    </div>
  );
}
