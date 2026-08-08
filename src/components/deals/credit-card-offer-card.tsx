import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import type { CreditCard } from "@/lib/types/credit-card";

export function CreditCardOfferCard({ card }: { card: CreditCard }) {
  return (
    <Card className="flex flex-none flex-col overflow-hidden transition-transform duration-200 hover:-translate-y-1.5 hover:shadow-brand-lg">
      <Link
        href={`/credit-card-offers/${card.slug}`}
        className="relative flex h-[150px] flex-col justify-between overflow-hidden p-4 text-white"
        style={{ background: `linear-gradient(135deg, ${card.artFrom}, ${card.artTo})` }}
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0"
          style={{ backgroundImage: "repeating-linear-gradient(120deg, rgba(255,255,255,.06) 0 2px, transparent 2px 26px)" }}
        />
        <div className="relative z-10 text-[11px] font-bold uppercase tracking-wider opacity-90">{card.bankName}</div>
        <div className="relative z-10 font-display text-lg">{card.cardName}</div>
      </Link>
      <div className="flex flex-1 flex-col gap-3 p-4">
        <ul className="flex flex-col gap-1.5">
          {card.highlights.slice(0, 3).map((h) => (
            <li key={h} className="flex gap-2 text-[13.5px] text-text-secondary">
              <span className="font-black text-brand-green">✓</span>
              {h}
            </li>
          ))}
        </ul>
        <div className="mt-auto flex justify-between border-t border-border-subtle pt-2.5 text-[12.5px] text-text-muted">
          <span>
            Annual fee: <b className="text-text-primary">{card.annualFee}</b>
          </span>
        </div>
        <Button href={card.applyUrl} className="w-full">
          Apply Now
        </Button>
      </div>
    </Card>
  );
}
