"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ChevronLeftIcon, SearchIcon } from "@/components/ui/icons";
import { searchIndex, TRENDING_SEARCHES, type SearchResult } from "@/lib/search/search-index";

const RECENT_SEARCHES = ["Myntra sale", "Airdopes"];

interface MobileSearchOverlayProps {
  index: SearchResult[];
  open: boolean;
  onClose: () => void;
}

export function MobileSearchOverlay({ index, open, onClose }: MobileSearchOverlayProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  if (!open) return null;

  const results = query.trim() ? searchIndex(index, query, 10) : [];

  function goTo(href: string) {
    onClose();
    setQuery("");
    router.push(href);
  }

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-bg-page md:hidden">
      <div className="flex items-center gap-3 border-b border-border-subtle p-4">
        <button type="button" onClick={onClose} aria-label="Close search" className="flex-none text-text-primary">
          <ChevronLeftIcon />
        </button>
        <div className="flex flex-1 items-center gap-2 rounded-full border-2 border-brand-navy bg-bg-surface px-4 py-2.5 dark:border-brand-teal">
          <SearchIcon width={16} height={16} className="flex-none text-text-muted" />
          <input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search deals, stores…"
            className="w-full bg-transparent text-sm text-text-primary outline-none placeholder:text-text-muted"
          />
        </div>
      </div>
      <div className="flex-1 overflow-y-auto p-4">
        {results.length > 0 ? (
          <div className="flex flex-col gap-1">
            {results.map((r) => (
              <button
                key={`${r.type}-${r.title}`}
                onClick={() => goTo(r.href)}
                className="flex items-center justify-between gap-2 rounded-sm px-2 py-2.5 text-left text-sm font-semibold text-text-primary hover:bg-bg-sunken"
              >
                <span className="truncate">{r.title}</span>
                <span className="flex-none text-xs font-bold text-text-muted">{r.subtitle}</span>
              </button>
            ))}
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">Recent Searches</div>
              <div className="flex flex-wrap gap-2">
                {RECENT_SEARCHES.map((r) => (
                  <button
                    key={r}
                    onClick={() => setQuery(r)}
                    className="rounded-full border border-border-subtle bg-bg-sunken px-3.5 py-1.5 text-[13px] font-bold text-text-secondary"
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">Trending</div>
              <div className="flex flex-wrap gap-2">
                {TRENDING_SEARCHES.map((t) => (
                  <button
                    key={t}
                    onClick={() => setQuery(t)}
                    className="rounded-full border border-border-subtle bg-bg-sunken px-3.5 py-1.5 text-[13px] font-bold text-text-secondary"
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
