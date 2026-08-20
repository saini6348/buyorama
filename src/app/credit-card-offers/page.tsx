import { Suspense } from "react";
import type { Metadata } from "next";
import { CreditCardOffersClient } from "@/components/credit-cards/credit-card-offers-client";

export const metadata: Metadata = {
  title: "Credit Card Offers",
  description: "Compare cashback, travel, airport lounge, fuel and lifetime-free credit cards from every major Indian bank.",
  alternates: { canonical: "/credit-card-offers" },
};

export default function CreditCardOffersPage() {
  return (
    <Suspense fallback={<CardsFeedSkeleton />}>
      <CreditCardOffersClient />
    </Suspense>
  );
}

function CardsFeedSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-5 py-12 text-sm text-text-muted">
      Loading credit card offers…
    </div>
  );
}
