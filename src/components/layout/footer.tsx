import Link from "next/link";
import { getAllStores } from "@/lib/content/get-store";
import { getCreditCardCategoryPages } from "@/lib/content/get-credit-card";
import { getAllSaleEvents } from "@/lib/content/get-sale-event";

export async function Footer() {
  const [stores, categoryPages, saleEvents] = await Promise.all([getAllStores(), getCreditCardCategoryPages(), getAllSaleEvents()]);

  return (
    <footer className="mt-auto border-t border-border-subtle bg-bg-sunken">
      <div className="mx-auto grid max-w-7xl grid-cols-2 gap-8 px-5 py-12 sm:grid-cols-4">
        <FooterColumn title="Stores" links={stores.slice(0, 6).map((s) => ({ label: s.name, href: `/${s.slug}` }))} />
        <FooterColumn
          title="Finance"
          links={[{ label: "Credit Card Offers", href: "/credit-card-offers" }, ...categoryPages.slice(0, 3).map((c) => ({ label: c.title, href: `/${c.slug}` }))]}
        />
        <FooterColumn title="Sale Events" links={saleEvents.map((e) => ({ label: e.name, href: `/${e.slug}` }))} />
        <FooterColumn
          title="Company"
          links={[
            { label: "About Us", href: "/about-us" },
            { label: "Teams of Us", href: "/teams-of-us" },
            { label: "Contact Us", href: "/contact-us" },
          ]}
        />
      </div>
      <div className="border-t border-border-subtle px-5 py-5 text-center text-xs text-text-muted">
        &copy; {new Date().getFullYear()} BUY&#8209;O&#8209;RAMA. We Do the Searching. You Do the Saving.
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { label: string; href: string }[] }) {
  return (
    <div>
      <div className="mb-3 text-[13px] font-extrabold text-text-primary">{title}</div>
      <div className="flex flex-col gap-2">
        {links.map((l) => (
          <Link key={l.href} href={l.href} className="text-[13px] text-text-secondary hover:text-brand-pink-deep">
            {l.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
