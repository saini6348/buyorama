"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { SearchIcon } from "@/components/ui/icons";
import { searchIndex, TRENDING_SEARCHES, type SearchResult } from "@/lib/search/search-index";
import { cn } from "@/lib/utils";

const TYPE_LABEL: Record<SearchResult["type"], string> = {
  store: "Store",
  deal: "Deal",
  coupon: "Coupon",
  creditCard: "Credit Card",
  saleEvent: "Sale Event",
};

interface SearchBarProps {
  index: SearchResult[];
  placeholder?: string;
  size?: "md" | "lg";
  className?: string;
}

export function SearchBar({ index, placeholder = "Search deals, stores, coupons, credit cards…", size = "md", className }: SearchBarProps) {
  const [query, setQuery] = useState("");
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => searchIndex(index, query), [index, query]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  function goTo(href: string) {
    setOpen(false);
    setQuery("");
    router.push(href);
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (results[0]) {
      goTo(results[0].href);
    } else if (query.trim()) {
      goTo(`/search?q=${encodeURIComponent(query.trim())}`);
    }
  }

  return (
    <div ref={containerRef} className={cn("relative w-full", className)}>
      <form
        onSubmit={handleSubmit}
        className={cn(
          "flex items-center gap-2 rounded-full border-[2.5px] border-brand-navy bg-bg-surface shadow-brand-md dark:border-brand-teal",
          size === "lg" ? "p-2 pl-5" : "p-1 pl-4"
        )}
      >
        <SearchIcon className="flex-none text-text-muted" width={18} height={18} />
        <input
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          placeholder={placeholder}
          className={cn("min-w-0 flex-1 bg-transparent text-text-primary outline-none placeholder:text-text-muted", size === "lg" ? "text-[15.5px]" : "text-sm")}
        />
        <button
          type="submit"
          className={cn(
            "flex-none rounded-full bg-brand-pink-deep font-extrabold text-white transition-transform active:scale-95",
            size === "lg" ? "px-5 py-3 text-sm" : "px-4 py-2 text-[13px]"
          )}
        >
          Search
        </button>
      </form>

      {open ? (
        <div className="absolute left-0 right-0 top-[calc(100%+10px)] z-30 rounded-md border border-border-subtle bg-bg-surface-raised p-4 shadow-brand-lg">
          {results.length > 0 ? (
            <div className="mb-3.5">
              <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">Results</div>
              <div className="flex flex-col">
                {results.map((r) => (
                  <Link
                    key={`${r.type}-${r.title}`}
                    href={r.href}
                    onClick={() => goTo(r.href)}
                    className="flex items-center gap-2.5 rounded-sm px-1.5 py-2 text-[14px] font-semibold text-text-primary hover:bg-bg-sunken"
                  >
                    <span className="truncate">{r.title}</span>
                    <span className="ml-auto flex-none rounded-full bg-bg-sunken px-2 py-0.5 text-[11px] font-bold text-text-muted">
                      {TYPE_LABEL[r.type]}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          ) : null}
          <div>
            <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">Trending Searches</div>
            <div className="flex flex-wrap gap-2">
              {TRENDING_SEARCHES.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setQuery(t)}
                  className="rounded-full border border-border-subtle bg-bg-sunken px-3.5 py-1.5 text-[13px] font-bold text-text-secondary"
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
