export interface Store {
  slug: string;
  name: string;
  categoryLine: string;
  logoBg: string;
  logoFg: string;
  monogram: string;
  /** shown by EmptyFeedState when this store has zero deals in lib/data/deals.ts */
  fallbackOfferText?: string;
  officialUrl: string;
}
