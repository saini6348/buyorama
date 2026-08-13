"use client";

import { useMemo, useState } from "react";
import { SearchIcon } from "@/components/ui/icons";
import { Chip } from "@/components/ui/chip";
import { PulseDot } from "@/components/ui/pulse-dot";
import { StoreLogo } from "@/components/ui/store-logo";
import { FeedPost } from "@/components/brand-profile/feed-post";
import { SuggestDealButton } from "@/components/brand-profile/suggest-deal-button";
import { DealCard } from "@/components/deals/deal-card";
import { timeAgo } from "@/lib/utils";
import type { BrandCoupon } from "@/lib/content/get-coupons";
import type { Deal } from "@/lib/types/deal";
import type { Store } from "@/lib/types/store";

/** "Updated Xd Ymin ago" from the latest feed/coupon timestamp vs today. */
function updatedText(latestIso: string): string {
  const latest = new Date(latestIso).getTime();
  const diffSeconds = Math.max(0, Math.floor((Date.now() - latest) / 1000));
  if (diffSeconds < 60) return "Updated just now";
  const minutes = Math.floor(diffSeconds / 60);
  if (minutes < 60) return `Updated ${minutes} min${minutes === 1 ? "" : "s"} ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `Updated ${hours} hr${hours === 1 ? "" : "s"} ago`;
  const days = Math.floor(hours / 24);
  const remMinutes = minutes % 60;
  if (remMinutes === 0) return `Updated ${days} day${days === 1 ? "" : "s"} ago`;
  return `Updated ${days} day${days === 1 ? "" : "s"} ${remMinutes} min ago`;
}

export function StoreFeed({ store, deals, brandCoupons }: { store: Store; deals: Deal[]; brandCoupons?: BrandCoupon[] }) {
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [sort, setSort] = useState<"newest" | "discount">("newest");

  // Categories but remove "All" and the generic "Deals" fallback chips (Req 7).
  const categories = useMemo(
    () =>
      Array.from(
        new Set(deals.map((d) => d.category).filter((c) => c && c.trim() !== "" && c !== "All" && c !== "Deals")),
      ),
    [deals],
  );

  // Latest timestamp across feeds and coupons (Req 6).
  const latestUpdated = useMemo(() => {
    const times = [
      ...deals.map((d) => new Date(d.publishedAt).getTime()),
      ...(brandCoupons ?? []).map((c) => new Date(c.createdAt).getTime()),
    ].filter((t) => !Number.isNaN(t));
    if (times.length === 0) return null;
    return new Date(Math.max(...times)).toISOString();
  }, [deals, brandCoupons]);

  const filtered = useMemo(() => {
    let list = deals;
    if (category !== "All") list = list.filter((d) => d.category === category);
    if (query.trim()) {
      const q = query.trim().toLowerCase();
      list = list.filter((d) => d.title.toLowerCase().includes(q));
    }
    if (sort === "discount") {
      list = [...list].sort((a, b) => {
        const da = a.type === "brandOffer" ? a.discountPercent : 0;
        const db = b.type === "brandOffer" ? b.discountPercent : 0;
        return db - da;
      });
    }
    return list;
  }, [deals, category, query, sort]);

  return (
    <div>
      <div className="flex flex-col gap-3 border-b border-border-subtle p-5">
        <div className="flex items-center gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-full border border-border-subtle bg-bg-sunken px-4 py-2.5">
            <SearchIcon width={16} height={16} className="flex-none text-text-muted" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={`Search within ${store.name} deals`}
              className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
            />
          </div>
          <SuggestDealButton />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((c) => (
            <Chip key={c} tone={c === category ? "active" : "ghost"} onClick={() => setCategory(c)}>
              {c}
            </Chip>
          ))}
          <div className="ml-auto flex items-center gap-2 text-xs font-bold text-text-muted">
            Sort:
            <Chip tone={sort === "newest" ? "teal" : "ghost"} onClick={() => setSort("newest")}>
              Newest
            </Chip>
            <Chip tone={sort === "discount" ? "teal" : "ghost"} onClick={() => setSort("discount")}>
              Biggest Discount
            </Chip>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between px-5 pt-5">
        <h2 className="text-xl">Feeds</h2>
        <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
          <PulseDot /> {latestUpdated ? updatedText(latestUpdated) : "Updated just now"}
        </div>
      </div>

      <div className="flex flex-col gap-3.5 p-5">
        {filtered.length === 0 ? (
          <p className="py-10 text-center text-sm text-text-muted">No deals match that search.</p>
        ) : (
          filtered.map((deal) => (
            <FeedPost
              key={deal.id}
              avatar={<StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={34} />}
              name={store.name}
              meta={`Added ${timeAgo(deal.publishedAt)}`}
              showFooter={deal.type === "brandOffer"}
              likeCount={deal.type === "brandOffer" ? deal.likeCount : undefined}
              commentCount={deal.type === "brandOffer" ? deal.commentCount : undefined}
            >
              <DealCard deal={deal} layout="feed" storeName={store.name} />
            </FeedPost>
          ))
        )}
      </div>
    </div>
  );
}
