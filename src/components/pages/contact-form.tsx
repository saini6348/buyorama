"use client";

import { useActionState } from "react";
import { submitContactForm, type ContactFormState } from "@/lib/actions/contact";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const initialState: ContactFormState = { status: "idle", message: "" };

export function ContactForm() {
  const [state, formAction, pending] = useActionState(submitContactForm, initialState);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name" name="name" required />
        <Field label="Email" name="email" type="email" required />
      </div>
      <Field label="Subject" name="subject" />
      <div>
        <label htmlFor="message" className="mb-1.5 block text-[13px] font-bold text-text-secondary">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          required
          rows={5}
          className="w-full rounded-md border border-border-subtle bg-bg-sunken px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-teal"
        />
      </div>
      <Button type="submit" disabled={pending} className="w-fit">
        {pending ? "Sending…" : "Send Message"}
      </Button>
      {state.message ? (
        <p className={cn("text-[13px]", state.status === "error" ? "text-red-500" : "text-emerald-600 dark:text-emerald-400")}>{state.message}</p>
      ) : null}
    </form>
  );
}

function Field({ label, name, type = "text", required }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label htmlFor={name} className="mb-1.5 block text-[13px] font-bold text-text-secondary">
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        className="w-full rounded-md border border-border-subtle bg-bg-sunken px-3.5 py-2.5 text-sm text-text-primary outline-none focus:border-brand-teal"
      />
    </div>
  );
}
