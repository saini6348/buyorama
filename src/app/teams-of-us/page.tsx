import type { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Panel } from "@/components/ui/panel";
import { Chip } from "@/components/ui/chip";
import { RevealOnScroll } from "@/components/motion/reveal-on-scroll";
import { StaggerList, StaggerItem } from "@/components/motion/stagger-list";

export const metadata: Metadata = {
  title: "Teams of Us",
  description: "The engineers, curators and partnership leads who keep BUY-O-RAMA's live feeds fresh.",
};

const LEADERSHIP = [
  { name: "Ananya Rao", role: "Co-founder & CEO", color: "#E91E76" },
  { name: "Vikram Sethi", role: "Co-founder & CTO", color: "#17B8C4" },
  { name: "Priya Nair", role: "Head of Partnerships", color: "#F2790A" },
];

const TEAM_CATEGORIES = ["Engineering", "Deal Curation", "Partnerships", "Support"] as const;

const TEAM_MEMBERS: Record<(typeof TEAM_CATEGORIES)[number], { name: string; role: string; color: string }[]> = {
  Engineering: [
    { name: "Rohan Mehta", role: "Senior Engineer", color: "#16213E" },
    { name: "Sneha Kulkarni", role: "Frontend Engineer", color: "#9F2089" },
    { name: "Arjun Verma", role: "Data Engineer", color: "#1B9C6E" },
  ],
  "Deal Curation": [
    { name: "Ishaan Kapoor", role: "Lead Curator", color: "#FFC94A" },
    { name: "Meera Iyer", role: "Coupon Verification", color: "#D6146B" },
    { name: "Tanvi Deshmukh", role: "Category Curator", color: "#0E7A83" },
  ],
  Partnerships: [
    { name: "Karan Malhotra", role: "Bank Partnerships", color: "#37436A" },
    { name: "Divya Menon", role: "Retail Partnerships", color: "#F2790A" },
  ],
  Support: [{ name: "Farhan Sheikh", role: "Customer Support Lead", color: "#17B8C4" }],
};

function MemberCard({ name, role, color }: { name: string; role: string; color: string }) {
  const initials = name
    .split(" ")
    .map((n) => n[0])
    .join("");
  return (
    <Panel className="text-center">
      <div
        className="mx-auto mb-3 flex h-16 w-16 items-center justify-center rounded-full font-display text-lg font-bold text-white"
        style={{ background: color }}
      >
        {initials}
      </div>
      <div className="text-[14.5px] font-extrabold text-text-primary">{name}</div>
      <div className="mt-0.5 text-[12.5px] font-semibold text-text-muted">{role}</div>
    </Panel>
  );
}

const VALUES = [
  { title: "Speed", body: "A deal that's live for six hours doesn't wait for our next sprint. We ship fast." },
  { title: "Trust", body: "We'd rather show fewer, verified coupons than more, unchecked ones." },
  { title: "Curiosity", body: "Someone's always poking at a new store, a new card, a new way to save someone money." },
  { title: "Directness", body: "Say the plain thing. To each other, and to everyone reading a deal card." },
];

export default function TeamsOfUsPage() {
  return (
    <div>
      <section className="border-b border-border-subtle px-5 py-16 text-center sm:py-20">
        <RevealOnScroll>
          <h1 className="mx-auto max-w-2xl text-4xl sm:text-5xl">The humans (and a few bots) behind the savings.</h1>
          <p className="mx-auto mt-5 max-w-xl text-[15.5px] text-text-secondary">
            Small team, eleven stores, one very opinionated coupon-verification checklist.
          </p>
        </RevealOnScroll>
      </section>

      <section className="border-b border-border-subtle px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-6 text-center text-2xl">Leadership</h2>
          </RevealOnScroll>
          <StaggerList className="grid gap-4 sm:grid-cols-3">
            {LEADERSHIP.map((p) => (
              <StaggerItem key={p.name}>
                <MemberCard {...p} />
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="border-b border-border-subtle bg-bg-sunken px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-3 text-center text-2xl">The full roster</h2>
            <div className="mb-8 flex flex-wrap justify-center gap-2">
              {TEAM_CATEGORIES.map((c) => (
                <Chip key={c} tone="ghost">
                  {c}
                </Chip>
              ))}
            </div>
          </RevealOnScroll>
          <div className="flex flex-col gap-8">
            {TEAM_CATEGORIES.map((category) => (
              <div key={category}>
                <h3 className="mb-3 text-[13px] font-extrabold uppercase tracking-wide text-text-muted">{category}</h3>
                <StaggerList className="grid gap-4 sm:grid-cols-3">
                  {TEAM_MEMBERS[category].map((p) => (
                    <StaggerItem key={p.name}>
                      <MemberCard {...p} />
                    </StaggerItem>
                  ))}
                </StaggerList>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-border-subtle px-5 py-14">
        <div className="mx-auto max-w-5xl">
          <RevealOnScroll>
            <h2 className="mb-6 text-center text-2xl">Culture &amp; values</h2>
          </RevealOnScroll>
          <StaggerList className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <StaggerItem key={v.title}>
                <Panel>
                  <h3 className="text-[15px] font-extrabold text-text-primary">{v.title}</h3>
                  <p className="mt-1.5 text-[13px] text-text-secondary">{v.body}</p>
                </Panel>
              </StaggerItem>
            ))}
          </StaggerList>
        </div>
      </section>

      <section className="bg-brand-navy px-5 py-14 text-center text-white">
        <RevealOnScroll>
          <h2 className="text-2xl">We&rsquo;re hiring.</h2>
          <p className="mx-auto mt-2 max-w-md text-[14px] text-white/75">
            If you&rsquo;d rather build the thing that finds the deal than keep 14 tabs open yourself, talk to us.
          </p>
          <Button href="/contact-us" className="mt-5">
            Get in touch
          </Button>
        </RevealOnScroll>
      </section>
    </div>
  );
}
