import type { Metadata } from "next";
import Link from "next/link";
import { getSearchIndex } from "@/lib/content/get-search-index";
import { searchIndex } from "@/lib/search/search-index";

export const metadata: Metadata = {
  title: "Search",
  robots: { index: false },
};

const TYPE_LABEL: Record<string, string> = {
  store: "Store",
  deal: "Deal",
  coupon: "Coupon",
  creditCard: "Credit Card",
  saleEvent: "Sale Event",
};

export default async function SearchPage({ searchParams }: PageProps<"/search">) {
  const sp = await searchParams;
  const q = Array.isArray(sp.q) ? sp.q[0] : sp.q ?? "";

  const index = await getSearchIndex();
  const results = searchIndex(index, q, 30);

  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <h1 className="text-2xl">
        {q ? (
          <>
            Results for &ldquo;{q}&rdquo;
          </>
        ) : (
          "Search"
        )}
      </h1>
      <p className="mt-2 text-[14px] text-text-secondary">{results.length} match{results.length === 1 ? "" : "es"}</p>

      <div className="mt-6 flex flex-col gap-1">
        {results.map((r) => (
          <Link
            key={`${r.type}-${r.title}`}
            href={r.href}
            className="flex items-center justify-between gap-3 rounded-md px-3 py-3 text-sm font-semibold text-text-primary hover:bg-bg-sunken"
          >
            <span>{r.title}</span>
            <span className="flex-none rounded-full bg-bg-sunken px-2.5 py-1 text-[11px] font-bold text-text-muted">{TYPE_LABEL[r.type]}</span>
          </Link>
        ))}
      </div>

      {results.length === 0 ? (
        <p className="mt-10 text-center text-sm text-text-muted">
          Nothing matched that search. Try a store name, a bank, or a product like &ldquo;airdopes&rdquo;.
        </p>
      ) : null}
    </div>
  );
}
