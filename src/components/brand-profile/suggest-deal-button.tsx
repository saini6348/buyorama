"use client";

import { useActionState, useState } from "react";
import { suggestDeal, type SuggestDealState } from "@/lib/actions/suggest-a-deal";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: SuggestDealState = { status: "idle", message: "" };

export function SuggestDealButton() {
  const [open, setOpen] = useState(false);
  const [state, formAction, pending] = useActionState(suggestDeal, initialState);

  return (
    <div className="relative flex-none">
      <Button size="sm" variant="outline" type="button" onClick={() => setOpen((o) => !o)}>
        + Suggest a Deal
      </Button>
      {open ? (
        <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-72 rounded-md border border-border-subtle bg-bg-surface-raised p-4 shadow-brand-lg">
          <form action={formAction} className="flex flex-col gap-2.5">
            <label htmlFor="deal-url" className="text-[12px] font-bold text-text-secondary">
              Product link
            </label>
            <input
              id="deal-url"
              name="url"
              placeholder="https://…"
              className="rounded-md border border-border-subtle bg-bg-sunken px-3 py-2 text-sm text-text-primary outline-none focus:border-brand-teal"
            />
            <Button type="submit" size="sm" disabled={pending}>
              {pending ? "Sending…" : "Send to curators"}
            </Button>
            {state.message ? (
              <p className={cn("text-[12px]", state.status === "error" ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}>
                {state.message}
              </p>
            ) : null}
          </form>
        </div>
      ) : null}
    </div>
  );
}
