import type { Metadata } from "next";
import { getCreditCardCategoryPage } from "@/lib/content/get-credit-card";
import { CreditCardCategoryPageView } from "@/components/pages/credit-card-category-page-view";

const SLUG = "lifetime-free-credit-cards";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getCreditCardCategoryPage(SLUG);
  return { title: page?.title, description: page?.description };
}

export const revalidate = 3600;

export default function Page() {
  return <CreditCardCategoryPageView slug={SLUG} />;
}
