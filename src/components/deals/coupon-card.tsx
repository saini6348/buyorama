import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CopyCodeButton } from "@/components/deals/copy-code-button";
import { timeAgo, getTimeRemaining } from "@/lib/utils";
import type { Coupon } from "@/lib/types/coupon";

export function CouponCard({ coupon }: { coupon: Coupon }) {
  const remaining = coupon.expiresAt ? getTimeRemaining(coupon.expiresAt) : null;
  const expiringSoon = remaining && !remaining.expired && remaining.hours < 24;

  return (
    <div className="relative flex overflow-hidden rounded-lg border border-border-subtle bg-bg-surface shadow-brand-sm">
      <div
        className="relative flex w-24 flex-none items-center justify-center whitespace-pre-line p-2.5 text-center font-display text-[13px] text-white"
        style={{ background: `linear-gradient(160deg, ${coupon.stubFrom}, ${coupon.stubTo})` }}
      >
        {coupon.stubLabel}
        <div
          aria-hidden
          className="absolute inset-y-0 right-0 w-px"
          style={{
            backgroundImage: "radial-gradient(circle, var(--color-bg-page) 3.5px, transparent 3.6px)",
            backgroundSize: "16px 16px",
            backgroundPosition: "center",
            backgroundRepeat: "repeat-y",
          }}
        />
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-2.5 p-4">
        <div className="flex items-start justify-between gap-2.5">
          <div>
            <h4 className="text-[15px] font-bold leading-snug text-text-primary">{coupon.headline}</h4>
            <div className="mt-0.5 text-xs text-text-muted">{coupon.description}</div>
          </div>
          {coupon.verified ? (
            <Badge tone="verified" className="flex-none">
              ✓ Verified today
            </Badge>
          ) : expiringSoon ? (
            <Badge tone="expiring" className="flex-none">
              Expires in {remaining!.hours}h
            </Badge>
          ) : (
            <Badge tone="new" className="flex-none">
              {timeAgo(coupon.publishedAt)}
            </Badge>
          )}
        </div>
        <div className="flex flex-wrap items-center gap-2.5">
          <span className="rounded-sm border border-dashed border-border-strong bg-bg-sunken px-3 py-1.5 font-mono-brand text-sm font-bold tracking-wide text-text-primary">
            {coupon.code}
          </span>
          <CopyCodeButton code={coupon.code} />
        </div>
        <Button href={coupon.affiliateUrl} variant="secondary" size="sm" className="w-fit">
          Shop Now →
        </Button>
      </div>
    </div>
  );
}
