import Link from "next/link";
import type { ReactNode } from "react";
import { getAllStores } from "@/lib/content/get-store";
import { getCreditCardCategoryPages } from "@/lib/content/get-credit-card";
import { getAllSaleEvents, getLiveSaleEvent } from "@/lib/content/get-sale-event";
import { getSearchIndex } from "@/lib/content/get-search-index";
import { SearchBar } from "@/components/search/search-bar";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileMenu } from "@/components/layout/mobile-menu";
import { Button } from "@/components/ui/button";
import { ChevronDownIcon } from "@/components/ui/icons";

export async function Header() {
  const [stores, categoryPages, saleEvents, liveEvent, searchIdx] = await Promise.all([
    getAllStores(),
    getCreditCardCategoryPages(),
    getAllSaleEvents(),
    getLiveSaleEvent(),
    getSearchIndex(),
  ]);

  return (
    <header className="sticky top-0 z-40 border-b border-border-subtle bg-bg-surface/95 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-5 px-5 py-3.5">
        <Link href="/" className="flex flex-none items-center gap-2.5">
          <div
            className="flex h-10 w-10 items-center justify-center rounded-sm font-display text-lg font-bold text-white"
            style={{ background: "conic-gradient(from -40deg, #E91E76, #F2790A 40%, #FFC94A 65%, #17B8C4 100%)" }}
          >
            O
          </div>
          <span className="font-display text-lg font-bold text-text-primary">BUY‑O‑RAMA</span>
        </Link>

        <nav className="hidden flex-none items-center gap-6 md:flex">
          <NavDropdown label="Stores">
            {stores.map((s) => (
              <Link
                key={s.slug}
                href={`/${s.slug}`}
                className="rounded-sm px-2.5 py-1.5 text-[13px] font-semibold text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
              >
                {s.name}
              </Link>
            ))}
          </NavDropdown>
          <Link href="/coupon-codes" className="text-sm font-bold text-text-secondary hover:text-text-primary">
            Coupon Codes
          </Link>
          <NavDropdown label="Credit Cards">
            <Link
              href="/credit-card-offers"
              className="rounded-sm px-2.5 py-1.5 text-[13px] font-semibold text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
            >
              All Credit Cards
            </Link>
            {categoryPages.map((c) => (
              <Link
                key={c.slug}
                href={`/${c.slug}`}
                className="rounded-sm px-2.5 py-1.5 text-[13px] font-semibold text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
              >
                {c.title}
              </Link>
            ))}
          </NavDropdown>
          <NavDropdown label="Sale Events">
            {saleEvents.map((e) => (
              <Link
                key={e.slug}
                href={`/${e.slug}`}
                className="rounded-sm px-2.5 py-1.5 text-[13px] font-semibold text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
              >
                {e.name}
              </Link>
            ))}
          </NavDropdown>
        </nav>

        <div className="hidden max-w-xs min-w-0 flex-1 md:block">
          <SearchBar index={searchIdx} size="md" />
        </div>

        {liveEvent ? (
          <Button href={`/${liveEvent.slug}`} size="sm" className="hidden flex-none xl:inline-flex">
            Today&rsquo;s Top Deal
          </Button>
        ) : null}

        <div className="flex flex-none items-center gap-2">
          <ThemeToggle />
          <MobileMenu stores={stores} categoryPages={categoryPages} saleEvents={saleEvents} />
        </div>
      </div>
    </header>
  );
}

function NavDropdown({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="group relative">
      <button type="button" className="flex items-center gap-1 text-sm font-bold text-text-secondary hover:text-text-primary">
        {label}
        <ChevronDownIcon width={14} height={14} />
      </button>
      <div className="invisible absolute left-0 top-full z-20 w-64 pb-2 opacity-0 transition-opacity duration-150 group-hover:visible group-hover:opacity-100">
        {/* Invisible bridge that spans the gap, so moving from the parent into the
            submenu never breaks the :hover and the dropdown doesn't close. */}
        <div className="-mt-2 h-2" />
        <div className="flex max-h-96 flex-col gap-0.5 overflow-y-auto rounded-md border border-border-subtle bg-bg-surface-raised p-2 shadow-brand-lg">
          {children}
        </div>
      </div>
    </div>
  );
}
