"use client";

import { useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { MenuIcon, CloseIcon } from "@/components/ui/icons";
import type { Store } from "@/lib/types/store";
import type { CreditCardCategoryPage } from "@/lib/types/credit-card";
import type { SaleEvent } from "@/lib/types/sale-event";

interface MobileMenuProps {
  stores: Store[];
  categoryPages: CreditCardCategoryPage[];
  saleEvents: SaleEvent[];
}

export function MobileMenu({ stores, categoryPages, saleEvents }: MobileMenuProps) {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open menu"
        className="flex h-9 w-9 flex-none items-center justify-center rounded-full border border-border-subtle bg-bg-sunken text-text-primary md:hidden"
      >
        <MenuIcon width={18} height={18} />
      </button>
      <AnimatePresence>
        {open ? (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40"
              onClick={close}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.28, ease: [0.34, 1.56, 0.64, 1] }}
              className="fixed inset-y-0 right-0 z-50 flex w-[300px] flex-col overflow-y-auto bg-bg-surface-raised p-5"
            >
              <div className="mb-5 flex items-center justify-between">
                <span className="font-display text-lg font-bold text-text-primary">Menu</span>
                <button type="button" onClick={close} aria-label="Close menu" className="text-text-secondary">
                  <CloseIcon />
                </button>
              </div>
              <MenuSection title="Stores" items={stores.map((s) => ({ label: s.name, href: `/${s.slug}` }))} onNavigate={close} />
              <MenuSection
                title="Finance"
                items={[{ label: "All Credit Cards", href: "/credit-card-offers" }, ...categoryPages.map((c) => ({ label: c.title, href: `/${c.slug}` }))]}
                onNavigate={close}
              />
              <MenuSection title="Sale Events" items={saleEvents.map((e) => ({ label: e.name, href: `/${e.slug}` }))} onNavigate={close} />
              <MenuSection
                title="Company"
                items={[
                  { label: "About Us", href: "/about-us" },
                  { label: "Teams of Us", href: "/teams-of-us" },
                  { label: "Contact Us", href: "/contact-us" },
                ]}
                onNavigate={close}
              />
              <Link
                href="/coupon-codes"
                onClick={close}
                className="mt-2 rounded-md bg-brand-pink-deep px-4 py-3 text-center text-sm font-extrabold text-white"
              >
                Coupon Codes
              </Link>
            </motion.div>
          </>
        ) : null}
      </AnimatePresence>
    </>
  );
}

function MenuSection({ title, items, onNavigate }: { title: string; items: { label: string; href: string }[]; onNavigate: () => void }) {
  return (
    <div className="mb-5">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-wide text-text-muted">{title}</div>
      <div className="flex flex-col gap-0.5">
        {items.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            className="rounded-sm px-2 py-2 text-sm font-semibold text-text-secondary hover:bg-bg-sunken hover:text-text-primary"
          >
            {item.label}
          </Link>
        ))}
      </div>
    </div>
  );
}
