import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PriceRow } from "@/components/deals/price-row";
import { TimerChip } from "@/components/deals/timer-chip";
import { cn, formatPrice, timeAgo } from "@/lib/utils";
import type { Deal, BrandOfferDeal, CollectionDeal, QuickDeal } from "@/lib/types/deal";

type Layout = "grid" | "feed";

interface DealCardProps {
  deal: Deal;
  layout?: Layout;
  /** resolved store name for the ".store · category" label — passed by the caller, which already fetched the Store */
  storeName?: string;
  /** overrides the grid layout's fixed 250px width, e.g. for a narrow sidebar preview */
  className?: string;
}

/** Single entry point for all four deal shapes; dispatches by deal.type. */
export function DealCard({ deal, layout = "grid", storeName, className }: DealCardProps) {
  switch (deal.type) {
    case "brandOffer":
      return <BrandOfferCard deal={deal} layout={layout} storeName={storeName} className={className} />;
    case "collection":
      return <CollectionCard deal={deal} layout={layout} className={className} />;
    case "quickDeal":
      return <QuickDealCard deal={deal} layout={layout} className={className} />;
  }
}

function ThumbPattern() {
  return (
    <div
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-50"
      style={{ backgroundImage: "radial-gradient(circle, rgba(255,255,255,.35) 1.5px, transparent 1.5px)", backgroundSize: "14px 14px" }}
    />
  );
}

function BrandOfferCard({
  deal,
  layout,
  storeName,
  className,
}: {
  deal: BrandOfferDeal;
  layout: Layout;
  storeName?: string;
  className?: string;
}) {
  if (layout === "feed") {
    return (
      <div className="flex items-start gap-4 border-b border-border-subtle py-4 last:border-b-0">
        <div
          className="relative h-[76px] w-[96px] flex-none overflow-hidden rounded-sm"
          style={{ background: `linear-gradient(135deg, ${deal.thumbFrom}, ${deal.thumbTo})` }}
        >
          <ThumbPattern />
          <span className="absolute inset-0 flex items-center justify-center p-1.5 text-center text-[9.5px] font-display font-bold text-white">
            {deal.thumbLabel}
          </span>
        </div>
        <div className="min-w-0 flex-1">
          <div className="mb-1 flex flex-wrap items-center gap-2">
            <Badge tone="discount">{deal.discountPercent}% OFF</Badge>
            <span className="text-[11.5px] text-text-muted">Added {timeAgo(deal.publishedAt)}</span>
          </div>
          <h4 className="text-[14.5px] font-bold leading-snug text-text-primary">{deal.title}</h4>
          <div className="mt-1.5">
            <PriceRow price={deal.price} originalPrice={deal.originalPrice} />
          </div>
        </div>
        <Button href={deal.affiliateUrl} size="sm" className="flex-none">
          Get Deal
        </Button>
      </div>
    );
  }

  return (
    <Card className={cn("w-[250px] flex-none overflow-hidden transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-brand-lg", className)}>
      <div className="relative aspect-[4/3]">
        <div className="absolute inset-0" style={{ background: `linear-gradient(135deg, ${deal.thumbFrom}, ${deal.thumbTo})` }} />
        <ThumbPattern />
        <div className="absolute left-2.5 top-2.5 z-10 flex flex-wrap gap-1.5">
          <Badge tone="discount">{deal.discountPercent}% OFF</Badge>
          {deal.isNew ? <Badge tone="new">NEW</Badge> : null}
          {deal.isVerified ? <Badge tone="verified">✓ Verified</Badge> : null}
        </div>
        <span className="absolute inset-0 flex items-center justify-center p-4 text-center text-[15px] font-display font-bold text-white">
          {deal.thumbLabel}
        </span>
      </div>
      <div className="flex flex-col gap-2 p-4">
        <div className="text-[11.5px] font-bold uppercase tracking-wide text-text-muted">
          {storeName ? `${storeName} · ${deal.category}` : deal.category}
        </div>
        <h4 className="text-[15.5px] font-bold leading-snug text-text-primary">{deal.title}</h4>
        <PriceRow price={deal.price} originalPrice={deal.originalPrice} />
        {deal.expiresAt ? <TimerChip expiresAt={deal.expiresAt} /> : null}
      </div>
    </Card>
  );
}

function CollectionCard({ deal, layout, className }: { deal: CollectionDeal; layout: Layout; className?: string }) {
  return (
    <Card className={cn("flex-none overflow-hidden", layout === "grid" ? "w-[250px]" : "w-full", className)}>
      <div className="p-3.5 pb-1 text-[13.5px] font-extrabold text-text-primary">{deal.collectionTitle}</div>
      <div className="grid grid-cols-3 gap-2 p-3.5">
        {deal.items.map((item) => (
          <a
            key={item.title}
            href={item.affiliateUrl}
            className="overflow-hidden rounded-sm border border-border-subtle bg-bg-sunken transition-transform hover:-translate-y-0.5"
          >
            <div
              className="flex aspect-square items-center justify-center p-1 text-center text-[9px] font-display font-bold text-brand-navy"
              style={{ background: item.thumbBg }}
            >
              {item.title}
            </div>
            <div className="px-2 py-1.5">
              <div className="tabular text-xs font-extrabold text-brand-pink-deep dark:text-[#ff6fa9]">{formatPrice(item.price)}</div>
            </div>
          </a>
        ))}
      </div>
    </Card>
  );
}

function QuickDealCard({ deal, layout, className }: { deal: QuickDeal; layout: Layout; className?: string }) {
  return (
    <Card className={cn("flex-none overflow-hidden", layout === "grid" ? "w-[250px]" : "w-full", className)}>
      <div className="p-3.5 pb-1 text-[13.5px] font-extrabold text-text-primary">{deal.listTitle}</div>
      <ul className="flex flex-col">
        {deal.items.map((item) => (
          <li
            key={item.name}
            className="flex items-center justify-between gap-3 border-t border-dashed border-border-subtle px-3.5 py-3 first:border-t-0"
          >
            <div>
              <div className="text-[14.5px] font-bold text-text-primary">{item.name}</div>
              {item.price ? <div className="tabular text-xs font-semibold text-text-muted">{formatPrice(item.price)}</div> : null}
            </div>
            <Button href={item.affiliateUrl} variant="secondary" size="sm">
              Buy
            </Button>
          </li>
        ))}
      </ul>
    </Card>
  );
}
