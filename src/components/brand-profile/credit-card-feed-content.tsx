import type { ReactNode } from "react";
import { Panel, KVRow } from "@/components/ui/panel";
import { CheckIcon } from "@/components/ui/icons";
import { timeAgo } from "@/lib/utils";
import type { CreditCard } from "@/lib/types/credit-card";

function SectionLabel({ children }: { children: ReactNode }) {
  return <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">{children}</div>;
}

export function CreditCardFeedContent({ card }: { card: CreditCard }) {
  return (
    <div className="flex flex-col gap-4">
      <section>
        <SectionLabel>Product Highlights</SectionLabel>
        <ul className="flex flex-col gap-1.5">
          {card.highlights.map((h) => (
            <li key={h} className="flex gap-2 text-[13.5px] text-text-secondary">
              <CheckIcon width={15} height={15} className="mt-0.5 flex-none text-brand-green" />
              {h}
            </li>
          ))}
        </ul>
      </section>

      <section className="border-t border-dashed border-border-subtle pt-4">
        <SectionLabel>Eligibility &amp; Documents</SectionLabel>
        <div className="grid gap-3 sm:grid-cols-2">
          <Panel className="p-3.5">
            <b className="text-[13px] text-text-primary">Eligibility</b>
            <p className="mt-1.5 text-[13px] text-text-secondary">{card.eligibility}</p>
          </Panel>
          <Panel className="p-3.5">
            <b className="text-[13px] text-text-primary">Required documents</b>
            <p className="mt-1.5 text-[13px] text-text-secondary">{card.requiredDocuments}</p>
          </Panel>
        </div>
      </section>

      <section className="border-t border-dashed border-border-subtle pt-4">
        <SectionLabel>Fees &amp; Charges</SectionLabel>
        <KVRow label="Annual fee" value={card.annualFee} />
        <KVRow label="Renewal fee" value={card.renewalFee} />
        {card.joiningFeeWaiver ? <KVRow label="Joining fee waiver" value={card.joiningFeeWaiver} /> : null}
      </section>

      {card.latestUpdate ? (
        <section className="border-t border-dashed border-border-subtle pt-4">
          <SectionLabel>Latest Update · {timeAgo(card.latestUpdate.postedAt)}</SectionLabel>
          <p className="text-[13.5px] text-text-secondary">{card.latestUpdate.text}</p>
        </section>
      ) : null}
    </div>
  );
}
