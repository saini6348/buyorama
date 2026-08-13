import type { Metadata } from "next";
import { getAllCoupons } from "@/lib/content/get-coupons";
import { getAllStores } from "@/lib/content/get-store";
import { CouponCard } from "@/components/deals/coupon-card";
import { Chip } from "@/components/ui/chip";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export const metadata: Metadata = {
  title: "Coupon Codes",
  description: "The latest verified coupon codes from Amazon, Flipkart, Myntra, Ajio, mCaffeine and more.",
};

export const revalidate = 120;

export default async function CouponCodesPage({ searchParams }: PageProps<"/coupon-codes">) {
  const { store: storeFilterParam } = await searchParams;
  const storeFilter = Array.isArray(storeFilterParam) ? storeFilterParam[0] : storeFilterParam;

  const [coupons, stores] = await Promise.all([getAllCoupons(), getAllStores()]);

  const filtered = storeFilter ? coupons.filter((c) => c.storeSlug === storeFilter) : coupons;
  const storesWithCoupons = stores.filter((s) => coupons.some((c) => c.storeSlug === s.slug));

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <RevealOnScroll>
        <h1 className="text-3xl">Coupon Codes</h1>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">Copy the code, land on the store with it already in hand.</p>
      </RevealOnScroll>

      <div className="mt-6 flex flex-wrap gap-2">
        <Chip tone={!storeFilter ? "active" : "ghost"} href="/coupon-codes">
          All Stores
        </Chip>
        {storesWithCoupons.map((s) => (
          <Chip key={s.slug} tone={storeFilter === s.slug ? "active" : "ghost"} href={`/coupon-codes?store=${s.slug}`}>
            {s.name}
          </Chip>
        ))}
      </div>

      <div className="mt-7 grid gap-4 sm:grid-cols-2">
        {filtered.map((c) => (
          <CouponCard key={c.id} coupon={c} showCode={false} />
        ))}
      </div>
      {filtered.length === 0 ? <p className="py-10 text-center text-sm text-text-muted">No coupons for this store right now.</p> : null}
    </div>
  );
}
