export const CREDIT_CARD_CATEGORIES = [
  "Cashback",
  "Rewards",
  "Shopping",
  "Travel",
  "Airport Lounge",
  "Fuel",
  "Lifetime Free",
  "RuPay (UPI)",
  "Low Forex",
  "Premium",
] as const;

export type CreditCardCategory = (typeof CREDIT_CARD_CATEGORIES)[number];

export const BANK_NAMES = [
  "SBI Card",
  "HDFC Bank",
  "ICICI Bank",
  "Axis Bank",
  "IDFC FIRST Bank",
  "IndusInd Bank",
  "AU Small Finance Bank",
  "Kotak Mahindra Bank",
  "YES Bank",
  "HSBC",
  "Standard Chartered",
  "American Express",
  "BOBCARD",
  "Federal Bank",
  "RBL Bank",
] as const;

export type BankName = (typeof BANK_NAMES)[number];

export interface CreditCard {
  slug: string;
  bankName: BankName;
  cardName: string;
  artFrom: string;
  artTo: string;
  categories: CreditCardCategory[];
  annualFee: string;
  renewalFee: string;
  joiningFeeWaiver?: string;
  maxCashback?: string;
  eligibility: string;
  requiredDocuments: string;
  highlights: string[];
  latestUpdate?: { text: string; postedAt: string };
  likeCount?: number;
  commentCount?: number;
  applyUrl: string;
  /** whether this card has been individually verified/authored vs. seeded placeholder */
  featured?: boolean;
}

export interface CreditCardCategoryPage {
  slug: string;
  name: CreditCardCategory;
  title: string;
  description: string;
}
