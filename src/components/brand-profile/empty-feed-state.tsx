import { StoreLogo } from "@/components/ui/store-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/types/store";

export function EmptyFeedState({ store, showVisit = true }: { store: Store; showVisit?: boolean }) {

  console.log("EmptyFeedState store:", store);
  return (
    <div className="flex flex-col items-center gap-3.5 px-6 py-16 text-center">
      <StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={88} rounded="rounded-lg" />
      <h3 className="font-display text-xl text-text-primary">{store.name}</h3>
      <Badge tone="discount" className="px-4 py-2 text-[15px]">
        {store.fallbackOfferText ?? "Check back soon for live deals"}
      </Badge>
      {showVisit ? (
        <>
          <p className="max-w-sm text-[13.5px] text-text-secondary">
            We haven&rsquo;t caught a fresh individual deal from this store yet — their site-wide offer is still live, so it&rsquo;s worth a look.
          </p>
          {hasOfficialUrl(store.officialUrl) ? (
            <Button href={store.officialUrl}>Visit Official Website →</Button>
          ) : null}
        </>
      ) : null}
    </div>
  );
}

/** Only render the CTA when the brand's official/site URL is usable. */
function hasOfficialUrl(url?: string): boolean {
  return !!url && url.trim() !== "" && url.trim() !== "#";
}
