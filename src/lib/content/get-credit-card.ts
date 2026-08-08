import {
  creditCards,
  creditCardCategoryPages,
  getCreditCardBySlug,
  getCreditCardsByCategory as getCreditCardsByCategoryFixture,
  getCreditCardsByBank as getCreditCardsByBankFixture,
} from "@/lib/data/credit-cards";
import type { CreditCard, CreditCardCategoryPage } from "@/lib/types/credit-card";

export async function getAllCreditCards(): Promise<CreditCard[]> {
  return creditCards;
}

export async function getCreditCard(slug: string): Promise<CreditCard | undefined> {
  return getCreditCardBySlug(slug);
}

export async function getCreditCardsByCategory(name: string): Promise<CreditCard[]> {
  return getCreditCardsByCategoryFixture(name);
}

export async function getCreditCardsByBank(bankName: string): Promise<CreditCard[]> {
  return getCreditCardsByBankFixture(bankName);
}

export async function getCreditCardCategoryPages(): Promise<CreditCardCategoryPage[]> {
  return creditCardCategoryPages;
}

export async function getCreditCardCategoryPage(slug: string): Promise<CreditCardCategoryPage | undefined> {
  return creditCardCategoryPages.find((c) => c.slug === slug);
}

export async function getFeaturedCreditCards(limit = 3): Promise<CreditCard[]> {
  return [...creditCards].sort((a, b) => (b.featured ? 1 : 0) - (a.featured ? 1 : 0)).slice(0, limit);
}
