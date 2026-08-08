import Link from "next/link";
import { StoreTile } from "@/components/stores/store-tile";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";
import type { Store } from "@/lib/types/store";

export function PopularStoresGrid({ stores }: { stores: Store[] }) {
  return (
    <section className="border-t border-border-subtle bg-bg-sunken px-5 py-12">
      <div className="mx-auto max-w-7xl">
        <RevealOnScroll>
          <h2 className="mb-5 text-2xl">Popular Stores</h2>
        </RevealOnScroll>
        <StaggerList className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {stores.map((s) => (
            <StaggerItem key={s.slug}>
              <StoreTile store={s} />
            </StaggerItem>
          ))}
          <StaggerItem>
            <Link
              href="/stores"
              className="flex h-full items-center justify-center rounded-lg border border-border-subtle bg-bg-surface p-3.5 text-sm font-extrabold text-brand-teal-deep shadow-brand-sm"
            >
              See all stores →
            </Link>
          </StaggerItem>
        </StaggerList>
      </div>
    </section>
  );
}
