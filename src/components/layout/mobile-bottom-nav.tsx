"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { HomeIcon, StoreIcon, TicketIcon, CreditCardIcon, SearchIcon } from "@/components/ui/icons";
import { MobileSearchOverlay } from "@/components/search/mobile-search-overlay";
import type { SearchResult } from "@/lib/search/search-index";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "home", label: "Home", href: "/", icon: HomeIcon },
  { key: "stores", label: "Stores", href: "/stores", icon: StoreIcon },
  { key: "coupons", label: "Coupons", href: "/coupon-codes", icon: TicketIcon },
  { key: "cards", label: "Cards", href: "/credit-card-offers", icon: CreditCardIcon },
] as const;

export function MobileBottomNav({ searchIndex }: { searchIndex: SearchResult[] }) {
  const pathname = usePathname();
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <>
      <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-border-subtle bg-bg-surface-raised pb-[env(safe-area-inset-bottom)] md:hidden">
        {TABS.map((tab) => {
          const active = tab.href === "/" ? pathname === "/" : pathname.startsWith(tab.href);
          const Icon = tab.icon;
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold",
                active ? "text-brand-pink-deep dark:text-[#ff6fa9]" : "text-text-muted"
              )}
            >
              <Icon width={20} height={20} />
              {tab.label}
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setSearchOpen(true)}
          className="flex flex-1 flex-col items-center gap-1 py-2.5 text-[10px] font-bold text-text-muted"
        >
          <SearchIcon width={20} height={20} />
          Search
        </button>
      </nav>
      <MobileSearchOverlay index={searchIndex} open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
