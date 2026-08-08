import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { ContactForm } from "@/components/pages/contact-form";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Questions about a deal, a coupon, or a partnership — here's how to reach BUY-O-RAMA.",
};

const FAQS = [
  {
    q: "A coupon code didn't work — what now?",
    a: "Use the \"Still working?\" note on the coupon card, or email us the code and store name — we re-verify flagged codes within a few hours.",
  },
  {
    q: "How fast do store pages update?",
    a: "Store feeds refresh continuously through the day. Nothing here is a one-time blog post — old deals age out automatically.",
  },
  {
    q: "Do you take a cut when I use a deal?",
    a: "Sometimes, via affiliate links — it's how we keep the site free and ad-light. It never changes the price you pay.",
  },
  {
    q: "Can my brand or bank get listed?",
    a: "Yes — use the form and pick \"Partnership\" as the subject, or email partnerships@buyorama.com directly.",
  },
  {
    q: "I found a bug on the site.",
    a: "Please tell us! Include the page URL and what you expected to happen — screenshots help even more.",
  },
];

export default function ContactUsPage() {
  return (
    <div>
      <section className="border-b border-border-subtle px-5 py-16 text-center sm:py-20">
        <RevealOnScroll>
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl">Talk to us.</h1>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] text-text-secondary">
            Flag a dead coupon, pitch a partnership, or just tell us which store to add next.
          </p>
        </RevealOnScroll>
      </section>

      <section className="border-b border-border-subtle px-5 py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr]">
          <RevealOnScroll>
            <Panel className="p-6">
              <h2 className="mb-4 text-xl">Send a message</h2>
              <ContactForm />
            </Panel>
          </RevealOnScroll>

          <RevealOnScroll delay={0.1}>
            <div className="flex flex-col gap-4">
              <Panel>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-text-muted">Office</h3>
                <p className="mt-2 text-[14px] text-text-secondary">
                  BUY&#8209;O&#8209;RAMA Technologies Pvt. Ltd.
                  <br />
                  4th Floor, Prestige Tech Park
                  <br />
                  Outer Ring Road, Bengaluru, Karnataka 560103
                </p>
              </Panel>
              <Panel>
                <h3 className="text-[13px] font-extrabold uppercase tracking-wide text-text-muted">Email &amp; Phone</h3>
                <p className="mt-2 text-[14px] text-text-secondary">
                  <a href="mailto:support@buyorama.com" className="font-bold text-brand-teal-deep">
                    support@buyorama.com
                  </a>
                  <br />
                  <a href="tel:+918022345678" className="font-bold text-brand-teal-deep">
                    +91 80 2234 5678
                  </a>
                  <br />
                  Mon–Sat, 10am–7pm IST
                </p>
              </Panel>
              <Panel className="flex h-40 items-center justify-center bg-bg-sunken text-center">
                <span className="text-[13px] font-semibold text-text-muted">Map placeholder — Bengaluru HQ</span>
              </Panel>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-bg-sunken px-5 py-14">
        <div className="mx-auto max-w-3xl">
          <RevealOnScroll>
            <h2 className="mb-6 text-center text-2xl">Frequently asked</h2>
          </RevealOnScroll>
          <div className="flex flex-col gap-2.5">
            {FAQS.map((f) => (
              <details key={f.q} className="group rounded-lg border border-border-subtle bg-bg-surface p-4">
                <summary className="cursor-pointer text-[14.5px] font-bold text-text-primary [&::-webkit-details-marker]:hidden">
                  {f.q}
                </summary>
                <p className="mt-2.5 text-[13.5px] text-text-secondary">{f.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-brand-navy px-5 py-14 text-center text-white">
        <RevealOnScroll>
          <h2 className="text-2xl">Still stuck?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-white/75">Email us directly — a real person reads every message.</p>
          <Button href="mailto:support@buyorama.com" className="mt-5">
            Email support@buyorama.com
          </Button>
        </RevealOnScroll>
      </section>
    </div>
  );
}
