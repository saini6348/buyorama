import Link from "next/link";
import { CouponCard } from "@/components/deals/coupon-card";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { Coupon } from "@/lib/types/coupon";

export function CouponsStrip({ coupons }: { coupons: Coupon[] }) {
  return (
    <section className="border-t border-border-subtle px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <div className="mb-5 flex items-baseline justify-between">
            <h2 className="text-2xl">Latest Coupons</h2>
            <Link href="/coupon-codes" className="text-[13px] font-bold text-brand-teal-deep">
              /coupon-codes/ →
            </Link>
          </div>
        </RevealOnScroll>
        <div className="grid gap-4 sm:grid-cols-2">
          {coupons.map((c) => (
            <CouponCard key={c.id} coupon={c} />
          ))}
        </div>
      </div>
    </section>
  );
}
