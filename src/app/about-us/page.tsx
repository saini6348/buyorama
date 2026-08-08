import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { CheckIcon } from "@/components/ui/icons";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";

export const metadata: Metadata = {
  title: "About Us",
  description: "Why BUY-O-RAMA exists, and how we keep 11+ Indian stores' deals fresh, all day, every day.",
};

const STATS = [
  { value: "11", label: "Stores tracked live" },
  { value: "2.4M+", label: "Deals grabbed this month" },
  { value: "50K+", label: "Coupons verified" },
  { value: "24/7", label: "Scanning, not sleeping" },
];

const WHY_US = [
  { title: "Always fresh", body: "Every store page is a live feed, not a blog post — new deals join the top, stale ones get pruned." },
  { title: "Verified codes", body: "Coupons get checked before they're published, and again if they start expiring soon." },
  { title: "No spam, no dark patterns", body: "One email a day if you want it. No fake countdown timers, no fake stock warnings." },
  { title: "Built for India", body: "Amazon, Flipkart, Myntra, Ajio, Meesho and the rest — plus the credit cards that make the cashback stack higher." },
];

export default function AboutUsPage() {
  return (
    <div>
      <section className="border-b border-border-subtle px-5 py-16 text-center sm:py-20">
        <RevealOnScroll>
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl">
            We built BUY&#8209;O&#8209;RAMA because deal-hunting shouldn&rsquo;t feel like a part-time job.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] text-text-secondary">
            One team, scanning eleven stores, so you don&rsquo;t have to keep fourteen tabs open every sale season.
          </p>
        </RevealOnScroll>
      </section>

      <section className="border-b border-border-subtle px-5 py-14">
        <div className="mx-auto grid max-w-5xl gap-10 lg:grid-cols-[1.1fr_1fr] lg:items-start">
          <RevealOnScroll>
            <h2 className="text-2xl">Our story</h2>
            <div className="mt-4 flex flex-col gap-4 text-[15px] leading-relaxed text-text-secondary">
              <p>
                It started the boring way: comparing the same pair of headphones across Amazon, Flipkart and a
                WhatsApp forward, three tabs deep, during last year&rsquo;s festive sale. The price kept changing
                between refreshes. The coupon in the group chat had expired an hour earlier. There had to be a
                calmer way to do this.
              </p>
              <p>
                So we built a small scanning engine that watches store pages instead of us doing it manually, and
                a coupons desk that actually checks a code before it goes live. BUY&#8209;O&#8209;RAMA is the
                result — one permanent page per store that stays current, instead of a new blog post for every
                offer that goes stale the next morning.
              </p>
              <p>
                Today that same engine tracks eleven stores and a growing shelf of credit cards, and it still
                runs on the same idea: less searching, more saving.
              </p>
            </div>
          </RevealOnScroll>
          <RevealOnScroll delay={0.1}>
            <div className="grid grid-cols-2 gap-3.5">
              {STATS.map((s) => (
                <Panel key={s.label} className="text-center">
                  <div className="tabular font-display text-2xl text-brand-pink-deep dark:text-[#ff6fa9]">{s.value}</div>
                  <div className="mt-1 text-[11.5px] font-semibold text-text-muted">{s.label}</div>
                </Panel>
              ))}
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-bg-sunken px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <div className="grid gap-8 sm:grid-cols-2">
              <Panel>
                <h3 className="text-lg">Mission</h3>
                <p className="mt-2 text-[14px] text-text-secondary">
                  Turn the ten minutes people spend comparing prices into ten seconds — without hiding how we
                  make money doing it.
                </p>
              </Panel>
              <Panel>
                <h3 className="text-lg">Vision</h3>
                <p className="mt-2 text-[14px] text-text-secondary">
                  The one bookmark Indian shoppers keep for every sale, coupon, and credit-card offer worth
                  knowing about.
                </p>
              </Panel>
            </div>
          </RevealOnScroll>
        </div>
      </section>

      <section className="border-b border-border-subtle px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-6 text-center text-2xl">Why choose us</h2>
          </RevealOnScroll>
          <StaggerList className="grid gap-4 sm:grid-cols-2">
            {WHY_US.map((item) => (
              <StaggerItem key={item.title}>
                <Panel className="flex gap-3">
                  <CheckIcon width={20} height={20} className="mt-0.5 flex-none text-brand-green" />
                  <div>
                    <h3 className="text-[15px] font-extrabold text-text-primary">{item.title}</h3>
                    <p className="mt-1 text-[13.5px] text-text-secondary">{item.body}</p>
                  </div>
                </Panel>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-bg-sunken px-5 py-14 text-center">
        <RevealOnScroll>
          <h2 className="text-2xl">The people running the scans</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-text-secondary">
            A small team of engineers, deal curators, and one very persistent partnerships lead.
          </p>
          <Button href="/teams-of-us" variant="secondary" className="mt-5">
            Meet the team →
          </Button>
        </RevealOnScroll>
      </section>

      <section className="bg-brand-navy px-5 py-14 text-center text-white">
        <RevealOnScroll>
          <h2 className="text-2xl">Ready to start saving?</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-white/75">Your first coupon is one click away.</p>
          <Button href="/coupon-codes" className="mt-5">
            Browse coupon codes
          </Button>
        </RevealOnScroll>
      </section>
    </div>
  );
}
