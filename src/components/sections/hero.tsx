import { SearchBar } from "@/components/search/search-bar";
import { FloatBadge } from "@/components/ui/float-badge";
import { Chip } from "@/components/ui/chip";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import type { SearchResult } from "@/lib/search/search-index";
import type { Store } from "@/lib/types/store";

export function Hero({ searchIndex, popularStores }: { searchIndex: SearchResult[]; popularStores: Store[] }) {
  return (
    <section
      className="relative overflow-hidden px-5 py-16 sm:py-20"
      style={{ backgroundImage: "radial-gradient(circle at 90% 0%, rgba(255,201,74,.18), transparent 45%)" }}
    >
      <FloatBadge className="absolute right-[18%] top-6 hidden bg-brand-yellow px-3 py-2 font-display text-[13px] font-bold text-brand-navy sm:block">
        NEW
      </FloatBadge>
      <FloatBadge
        delay="0.6s"
        className="absolute right-[6%] top-24 hidden bg-gradient-to-br from-brand-pink-deep to-brand-orange px-3.5 py-2.5 font-display text-[13px] font-bold text-white sm:block"
      >
        60% OFF
      </FloatBadge>
      <div className="mx-auto max-w-3xl text-center">
        <RevealOnScroll>
          <h1 className="text-4xl sm:text-5xl">
            We Do the Searching.
            <br />
            You Do the Saving.
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-[15.5px] text-text-secondary">
            Amazon, Flipkart, Myntra, Ajio, Meesho &amp; more — updated all day, every day.
          </p>
          <div className="mx-auto mt-7 max-w-xl">
            <SearchBar index={searchIndex} size="lg" />
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-bold uppercase tracking-wide text-text-muted">Popular:</span>
            {popularStores.slice(0, 6).map((s, i) => (
              <Chip key={s.slug} tone={i === 0 ? "active" : "ghost"} href={`/${s.slug}`}>
                {s.name}
              </Chip>
            ))}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
