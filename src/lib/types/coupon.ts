export interface Coupon {
  id: string;
  storeSlug: string;
  storeName: string;
  headline: string;
  description: string;
  code: string;
  stubLabel: string;
  stubFrom: string;
  stubTo: string;
  expiresAt?: string;
  publishedAt: string;
  affiliateUrl: string;
  verified?: boolean;
}
