"use client";

import { useActionState } from "react";
import { subscribeNewsletter, type NewsletterState } from "@/lib/actions/newsletter";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: NewsletterState = { status: "idle", message: "" };

export function NewsletterSignup() {
  const [state, formAction, pending] = useActionState(subscribeNewsletter, initialState);

  return (
    <section className="border-t border-border-subtle bg-brand-navy px-5 py-10 text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 sm:flex-row">
        <div>
          <h3 className="text-lg">Never miss a 70%-off moment.</h3>
          <p className="mt-1 text-[13px] text-white/75">One email a day, only the best drops.</p>
        </div>
        <form action={formAction} className="flex w-full max-w-sm flex-col gap-2 sm:w-auto sm:flex-row">
          <input
            type="email"
            name="email"
            required
            placeholder="you@email.com"
            className="min-w-0 flex-1 rounded-full px-4 py-3 text-sm text-brand-navy outline-none placeholder:text-text-muted"
          />
          <Button type="submit" size="sm" disabled={pending} className="flex-none">
            {pending ? "Sending…" : "Notify Me"}
          </Button>
        </form>
      </div>
      {state.message ? (
        <p className={cn("mx-auto mt-3 max-w-7xl text-center text-[12.5px]", state.status === "error" ? "text-red-300" : "text-emerald-300")}>
          {state.message}
        </p>
      ) : null}
    </section>
  );
}
