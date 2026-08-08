export interface AdminUser {
  id: string;
  name: string;
  email: string;
}

export interface Brand {
  id: string;
  brandName: string;
  slug: string;
  logo?: string;
  status: 0 | 1;
}

export interface ContentItem {
  id: string;
  brandId: string;
  brand?: { brandName: string };
  title: string;
  description: string;
  image_path?: string | null;
  status: 0 | 1;
  created_at: string;
}

export interface BrandCoupon {
  id: string;
  brandId: string;
  title: string;
  description: string;
  link: string;
  image?: string | null;
  status: 0 | 1;
  createdAt: string;
}

export interface BrandFeed {
  id: string;
  brandId: string;
  title: string;
  subtitle?: string | null;
  description: string;
  image?: string | null;
  status: 0 | 1;
  createdAt: string;
}

export interface LookupItem {
  id: string;
  name: string;
  status: 0 | 1;
  createdAt: string;
}

export type CreditCardCategoryItem = LookupItem;
export type Bank = LookupItem;
export type Tag = LookupItem;
