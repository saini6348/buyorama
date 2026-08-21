"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { BrandProfileSidebar } from "@/components/brand-profile/brand-profile-sidebar";
import { ChipFilterGroup } from "@/components/brand-profile/chip-filter-group";
import { FeedPost } from "@/components/brand-profile/feed-post";
import { Badge } from "@/components/ui/badge";
import { PulseDot } from "@/components/ui/pulse-dot";
import { publicApiPost, PUBLIC_API_BASE_URL } from "@/lib/public-api";
import { resolveImageUrlWithBase } from "@/lib/image-url";
import { CREDIT_CARD_CATEGORIES, BANK_NAMES } from "@/lib/types/credit-card";

// ---------- API response types ----------

export interface PublicCardsFeedItem {
  id: string;
  title: string;
  description: string | null;
  image: string | null;
  link: string | null;
  bank: { id: string; name: string } | null;
  categories: { id: string; name: string }[];
  tags: { id: string; name: string }[];
  status: number;
  createdAt: string;
}

interface CardsFeedResponse {
  data: PublicCardsFeedItem[];
  total: number;
  message?: string;
}

// ---------- helpers ----------

function toList(value: string | string[] | null | undefined): string[] {
  if (!value) return [];
  return Array.isArray(value) ? value : [value];
}

function toggle(list: string[], opt: string): string[] {
  return list.some((x) => x.toLowerCase() === opt.toLowerCase())
    ? list.filter((x) => x.toLowerCase() !== opt.toLowerCase())
    : [...list, opt];
}

function buildHref(categories: string[], banks: string[], tags: string[]) {
  const params = new URLSearchParams();
  categories.forEach((c) => params.append("category", c));
  banks.forEach((b) => params.append("bank", b));
  tags.forEach((t) => params.append("tag", t));
  const qs = params.toString();
  return `/credit-card-offers${qs ? `?${qs}` : ""}`;
}

const TAG_NAMES = [
  "Airport Lounge Credit Cards",
  "Cashback Credit Cards",
  "Fuel Credit Cards",
  "Lifetime Free Credit Cards",
  "Low Forex Credit Cards",
  "RuPay Credit Cards",
  "Travel Credit Cards",
];

export function CreditCardOffersClient() {
  const searchParams = useSearchParams();

  // The filter strings. `useSearchParams().toString()` is a stable primitive
  // key — we use it as THE effect dependency so the API is called once per
  // URL change (and only once on first load), never endlessly re-fetched.
  const categories = toList(searchParams.get("category"));
  const banks = toList(searchParams.get("bank"));
  const tags = toList(searchParams.get("tag"));
  const queryKey = searchParams.toString();

  const [cards, setCards] = useState<PublicCardsFeedItem[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch the active card feeds whenever the query string changes.
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    publicApiPost<CardsFeedResponse>("/api/public/cards-feed/list", {
      page: 0,
      limit: 20,
      tags,
      categories,
      banks,
    }).then((res) => {
      if (cancelled) return;
      setCards(res.data ?? []);
      setTotal(res.total ?? 0);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
    // Only re-fetch when the URL query actually changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [queryKey]);

  const activeAny = categories.length > 0 || banks.length > 0 || tags.length > 0;

  const headerDesc = useMemo(() => {
    const parts: string[] = [];
    if (categories.length) parts.push(`in ${categories.join(" + ")}`);
    if (banks.length) parts.push(banks.join(" + "));
    if (tags.length) parts.push(`#${tags.join(" + #")}`);
    return parts.join(" · ");
  }, [categories, banks, tags]);

  return (
    <div className="mx-auto grid max-w-7xl profile:grid-cols-[300px_1fr]">
      <BrandProfileSidebar
        title="Credit Card Offers"
        subtitle={activeAny ? "Filtered results" : "All cards"}
        stats={[{ label: "Matching cards", value: total }]}
        navLinks={[{ label: "All Cards", href: buildHref([], [], []), active: !activeAny }]}
      >
        <ChipFilterGroup
          label="Tags"
          helper="Select multiple tags (click again to remove)."
          options={TAG_NAMES}
          activeOptions={tags}
          compact
          hrefFor={(opt) => buildHref(categories, banks, toggle(tags, opt))}
        />
        <ChipFilterGroup
          label="Credit Card Categories"
          helper="Select multiple categories (click again to remove)."
          options={CREDIT_CARD_CATEGORIES}
          activeOptions={categories}
          compact
          hrefFor={(opt) => buildHref(toggle(categories, opt), banks, tags)}
        />
        <ChipFilterGroup
          label="Bank Filters"
          helper="Select multiple banks (click again to remove)."
          options={BANK_NAMES}
          activeOptions={banks}
          compact
          hrefFor={(opt) => buildHref(categories, toggle(banks, opt), tags)}
        />
      </BrandProfileSidebar>

      <div>
        <div className="flex items-center justify-between gap-3 border-b border-border-subtle px-5 py-4">
          <div>
            <h1 className="text-xl">Credit Card Offers</h1>
            <div className="mt-0.5 text-xs font-semibold text-text-muted">
              {total} card{total === 1 ? "" : "s"}
              {headerDesc ? ` ${headerDesc}` : ""}
            </div>
          </div>
          <Badge tone="verified">✓ Updated</Badge>
        </div>

        <div className="flex items-center justify-between px-5 pt-5">
          <h2 className="text-xl">Feeds</h2>
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-text-muted">
            <PulseDot /> {loading ? "Loading…" : "Live"}
          </div>
        </div>

        {loading ? (
          <p className="px-5 py-10 text-center text-sm text-text-muted">Loading credit card feeds…</p>
        ) : cards.length === 0 ? (
          <div className="px-5 py-10 text-center">
            <p className="text-sm font-semibold text-text-primary">No Card found</p>
            <p className="mt-1 text-xs text-text-muted">Try adjusting the filters or check back later.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4 p-5">
            {cards.map((card) => (
              <CardFeedPost key={card.id} card={card} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CardFeedPost({ card }: { card: PublicCardsFeedItem }) {
  const bankName = card.bank?.name ?? "Unknown Bank";
  const badge = bankName.replace(/\s+Bank$/, "");
  return (
    <FeedPost
      avatar={
        <div className="flex h-[34px] w-[34px] flex-none items-center justify-center rounded-sm bg-brand-teal-deep font-display text-xs font-bold text-white">
          {badge.charAt(0)}
        </div>
      }
      name={card.title}
      meta={`Issued by ${bankName}`}
      showFooter={false}
    >
      {card.image ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={resolveImageUrlWithBase(card.image, PUBLIC_API_BASE_URL)}
          alt={card.title}
          className="mb-3 max-h-48 w-full rounded-lg object-cover"
        />
      ) : null}

      {/* The backend stores the full card detail (Highlights / Eligibility /
          Fees) as rendered HTML in `description` — show it faithfully. */}
      {card.description ? (
        <div
          className="[&_ul]:my-2 [&_ul]:space-y-1.5 [&_li]:text-[13.5px] [&_li]:text-text-secondary card-feed-content"
          dangerouslySetInnerHTML={{ __html: card.description }}
        />
      ) : null}

      <div className="mt-3 flex flex-wrap items-center gap-1.5">
        {card.categories.map((c) => (
          <span
            key={c.id}
            className="rounded-full border border-border-subtle bg-bg-sunken px-2.5 py-0.5 text-[11px] font-semibold text-text-secondary"
          >
            {c.name}
          </span>
        ))}
        {card.tags.map((t) => (
          <span
            key={t.id}
            className="rounded-full bg-brand-teal/10 px-2.5 py-0.5 text-[11px] font-semibold text-brand-teal-deep"
          >
            #{t.name}
          </span>
        ))}
      </div>

      <div className="mt-4 flex items-center gap-3">
        {card.link ? (
          <Link
            href={card.link}
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-md bg-text-primary px-4 py-2 text-[13px] font-bold text-white transition-opacity hover:opacity-90"
          >
            Apply Now
          </Link>
        ) : null}
        <span className="text-[11.5px] font-semibold text-text-muted">
          {card.createdAt
            ? `Added ${new Date(card.createdAt).toLocaleDateString()}`
            : "Active offer"}
        </span>
      </div>
    </FeedPost>
  );
}
