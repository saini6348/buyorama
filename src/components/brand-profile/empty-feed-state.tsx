import { StoreLogo } from "@/components/ui/store-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Store } from "@/lib/types/store";

export function EmptyFeedState({ store }: { store: Store }) {
  return (
    <div className="flex flex-col items-center gap-3.5 px-6 py-16 text-center">
      <StoreLogo bg={store.logoBg} fg={store.logoFg} monogram={store.monogram} size={88} rounded="rounded-lg" />
      <h3 className="font-display text-xl text-text-primary">{store.name}</h3>
      <Badge tone="discount" className="px-4 py-2 text-[15px]">
        {store.fallbackOfferText ?? "Check back soon for live deals"}
      </Badge>
      <p className="max-w-sm text-[13.5px] text-text-secondary">
        We haven&rsquo;t caught a fresh individual deal from this store yet — their site-wide offer is still live, so it&rsquo;s worth a look.
      </p>
      <Button href={store.officialUrl}>Visit Official Website →</Button>
    </div>
  );
}
