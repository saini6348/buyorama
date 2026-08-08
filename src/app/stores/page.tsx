import type { Metadata } from "next";
import { getAllStores } from "@/lib/content/get-store";
import { StoreTile } from "@/components/stores/store-tile";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";

export const metadata: Metadata = {
  title: "All Stores",
  description: "Every store BUY-O-RAMA tracks live deals for, in one place.",
};

export const revalidate = 300;

export default async function StoresIndexPage() {
  const stores = await getAllStores();

  return (
    <div className="mx-auto max-w-7xl px-5 py-12">
      <RevealOnScroll>
        <h1 className="text-3xl">All Stores</h1>
        <p className="mt-2 max-w-xl text-[15px] text-text-secondary">One permanent, always-updating live-feed page per store.</p>
      </RevealOnScroll>
      <div className="mt-8 grid grid-cols-2 gap-3.5 sm:grid-cols-3 md:grid-cols-4">
        {stores.map((s) => (
          <StoreTile key={s.slug} store={s} />
        ))}
      </div>
    </div>
  );
}
