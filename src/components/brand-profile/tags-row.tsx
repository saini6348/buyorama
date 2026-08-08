import { Chip } from "@/components/ui/chip";
import type { CreditCardCategoryPage } from "@/lib/types/credit-card";

export function TagsRow({ tags, activeSlug }: { tags: CreditCardCategoryPage[]; activeSlug?: string }) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto border-b border-border-subtle px-5 py-3.5">
      <span className="flex-none text-[11px] font-bold uppercase tracking-wide text-text-muted">Tags</span>
      {tags.map((t) => (
        <Chip key={t.slug} tone={t.slug === activeSlug ? "active" : "ghost"} href={`/${t.slug}`} className="flex-none">
          {t.title}
        </Chip>
      ))}
    </div>
  );
}
