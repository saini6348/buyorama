interface DealBase {
  id: string;
  storeSlug: string;
  category: string;
  title: string;
  affiliateUrl: string;
  publishedAt: string;
  expiresAt?: string;
}

export interface BrandOfferDeal extends DealBase {
  type: "brandOffer";
  thumbFrom: string;
  thumbTo: string;
  thumbLabel: string;
  price: number;
  originalPrice: number;
  discountPercent: number;
  isNew?: boolean;
  isVerified?: boolean;
  likeCount?: number;
  commentCount?: number;
}

export interface CollectionItem {
  title: string;
  price: number;
  affiliateUrl: string;
  thumbBg: string;
}

export interface CollectionDeal extends DealBase {
  type: "collection";
  collectionTitle: string;
  items: CollectionItem[];
}

export interface QuickDealItem {
  name: string;
  price?: number;
  affiliateUrl: string;
}

export interface QuickDeal extends DealBase {
  type: "quickDeal";
  listTitle: string;
  items: QuickDealItem[];
}

export type Deal = BrandOfferDeal | CollectionDeal | QuickDeal;
