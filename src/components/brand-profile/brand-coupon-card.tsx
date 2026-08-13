import { StoreLogo } from "@/components/ui/store-logo";
import { Button } from "@/components/ui/button";
import { timeAgo } from "@/lib/utils";
import type { BrandCoupon } from "@/lib/content/get-coupons";

interface CouponRowCardProps {
  coupon: BrandCoupon;
  storeName: string;
}

/** Row-style card for a brand coupon (used on the brand detail page). */
export function CouponRowCard({ coupon, storeName }: CouponRowCardProps) {
  return (
    <div className="flex items-start gap-3.5 rounded-lg border border-border-subtle bg-bg-surface p-3.5 shadow-brand-sm">
      <div className="flex h-12 w-12 flex-none items-center justify-center overflow-hidden rounded-sm bg-bg-sunken">
        {coupon.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={coupon.image} alt={coupon.title} className="h-full w-full object-cover" />
        ) : (
          <StoreLogo bg="#7c3aed" fg="#ffffff" monogram={storeName ? storeName.charAt(0).toUpperCase() : "C"} size={48} />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className="text-[11px] font-bold uppercase tracking-wide text-text-muted">{storeName}</div>
        <h4 className="text-[14.5px] font-bold leading-snug text-text-primary">{coupon.title}</h4>
        {coupon.description ? (
          <p className="mt-1 text-[12.5px] leading-snug text-text-secondary">{coupon.description}</p>
        ) : null}
        <div className="mt-1.5 text-[11px] font-semibold text-text-muted">
          Added {timeAgo(coupon.createdAt)}
        </div>
      </div>
      {coupon.link ? (
        <Button href={coupon.link} size="sm" className="flex-none">
          Get Coupon
        </Button>
      ) : null}
    </div>
  );
}

