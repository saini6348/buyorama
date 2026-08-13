"use client";

import { useState } from "react";
import type { Store } from "@/lib/types/store";
import type { Deal } from "@/lib/types/deal";
import type { BrandCoupon } from "@/lib/content/get-coupons";
import { BrandProfileSidebar } from "@/components/brand-profile/brand-profile-sidebar";
import { OtherBrandsRail } from "@/components/brand-profile/other-brands-rail";
import { EmptyFeedState } from "@/components/brand-profile/empty-feed-state";
import { StoreFeed } from "@/components/brand-profile/store-feed";
import { StoreLogo } from "@/components/ui/store-logo";
import { CouponRowCard } from "@/components/brand-profile/brand-coupon-card";
import { SidebarNavButton } from "@/components/brand-profile/sidebar-nav-button";

type Tab = "feeds" | "coupons";

/** Returns true when there is a usable external/affiliate link to open. */
function hasDealLink(url?: string): boolean {
  return !!url && url.trim() !== "" && url.trim() !== "#";
}

interface BrandProfileViewProps {
  store: Store;
  stats: { totalPosts: number; totalCoupons: number; hasLiveFeed: boolean };
  deals: Deal[];
  brandCoupons: BrandCoupon[];
  otherStores: (Store & { liveDealsCount: number })[];
}

export function BrandProfileView({ store, stats, deals, brandCoupons, otherStores }: BrandProfileViewProps) {
  const [activeTab, setActiveTab] = useState<Tab>("feeds");

  const slugPillLabel = `/${store.slug}/`;

  return (
    <div className="mx-auto grid max-w-7xl profile:grid-cols-[240px_1fr_260px]">
      <BrandProfileSidebar
        logo={<StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={72} rounded="rounded-lg" />}
        title={store.name}
        subtitle={store.categoryLine}
        slugPillLabel={slugPillLabel}
        stats={[
          { label: "Total Feeds", value: stats.totalPosts },
          { label: "Total Coupons", value: stats.totalCoupons },
        ]}
        navLinks={[
          { label: "All Stores", href: "/stores" },
          { label: "About Store", href: store.officialUrl },
        ]}
      >
        {/* Tab switcher for Feeds / Coupons */}
        <nav className="-mt-1 flex flex-col gap-0.5 border-b border-border-subtle pb-4">
          <SidebarNavButton active={activeTab === "feeds"} onClick={() => setActiveTab("feeds")}>
            Live Feed
          </SidebarNavButton>
          <SidebarNavButton active={activeTab === "coupons"} onClick={() => setActiveTab("coupons")}>
            Coupons
          </SidebarNavButton>
        </nav>

        {activeTab === "feeds" && (
          <>
            {brandCoupons.length > 0 ? (
              <div>
                <div className="mb-2.5 text-[13.5px] font-extrabold text-text-primary">Latest Coupons</div>
                <div className="flex flex-col gap-2.5">
                  {brandCoupons.slice(0, 5).map((c) => (
                    <CouponRowCard key={c.id} coupon={c} storeName={store.name} />
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-bg-sunken p-4 text-center text-[12.5px] text-text-secondary">
                No coupons logged yet for this store.
              </div>
            )}
          </>
        )}

        {activeTab === "coupons" && (
          <>
            {deals.length > 0 ? (
              <div>
                <div className="mb-2.5 text-[13.5px] font-extrabold text-text-primary">Feeds</div>
                <div className="flex flex-col gap-2.5">
                  {deals.slice(0, 5).map((d) =>
                    hasDealLink(d.affiliateUrl) ? (
                      <FeedNameLinkCard key={d.id} name={d.title} href={d.affiliateUrl} />
                    ) : (
                      <div
                        key={d.id}
                        className="rounded-lg border border-border-subtle bg-bg-sunken px-3.5 py-3 text-[13px] font-semibold text-text-primary"
                      >
                        {d.title}
                      </div>
                    ),
                  )}
                </div>
              </div>
            ) : (
              <div className="rounded-lg border border-border-subtle bg-bg-sunken p-4 text-center text-[12.5px] text-text-secondary">
                No individual feeds logged yet for this store.
              </div>
            )}
          </>
        )}
      </BrandProfileSidebar>

      <div className="border-b border-border-subtle profile:border-b-0 profile:border-r">
        {activeTab === "feeds" ? (
          deals.length > 0 ? (
            <StoreFeed store={store} deals={deals} brandCoupons={brandCoupons} />
          ) : (
            <div>
              <div className="flex items-center justify-between px-5 pt-5">
                <h2 className="text-xl">Feeds</h2>
                <span className="text-[11px] font-bold text-text-muted">No live deals right now</span>
              </div>
              {/* Show the official-website CTA only when there is no feed AND no coupon. */}
              <EmptyFeedState store={store} showVisit={deals.length === 0} />
            </div>
          )
        ) : (
          <BrandCouponsSection
            store={store}
            coupons={brandCoupons}
            onViewFeeds={() => setActiveTab("feeds")}
          />
        )}
      </div>

      <OtherBrandsRail stores={otherStores} monthlySavingsStat="2.4M+" />
    </div>
  );
}

function BrandCouponsSection({
  store,
  coupons,
  onViewFeeds,
}: {
  store: Store;
  coupons: BrandCoupon[];
  onViewFeeds: () => void;
}) {
  return (
    <div>
      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-xl">Coupons</h2>
        <span className="text-[11px] font-bold text-text-muted">{coupons.length} available</span>
      </div>
      {coupons.length === 0 ? (
        <div className="flex flex-col items-center gap-3.5 px-6 py-16 text-center">
          <StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={60} rounded="rounded-lg" />
          <p className="max-w-sm text-[13.5px] text-text-secondary">
            No brand coupons available for {store.name} right now.
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3.5 p-5">
          {coupons.map((c) => (
            <CouponRowCard key={c.id} coupon={c} storeName={store.name} />
          ))}
        </div>
      )}
    </div>
  );
}

/** Small sidebar card showing a feed's name, linking out to its link in a new tab. */
function FeedNameLinkCard({ name, href }: { name: string; href: string }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="rounded-lg border border-border-subtle bg-bg-surface px-3.5 py-3 text-[13px] font-semibold text-text-primary transition-colors hover:bg-bg-sunken"
    >
      {name}
    </a>
  );
}
