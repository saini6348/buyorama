import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { CopyIcon } from "@/components/ui/icons";
import { BrandProfileStat } from "@/components/brand-profile/brand-profile-stat";
import { SidebarNavLink } from "@/components/brand-profile/sidebar-nav-link";

interface BrandProfileSidebarProps {
  logo?: ReactNode;
  title: string;
  subtitle: string;
  slugPillLabel?: string;
  applyHref?: string;
  stats: { label: string; value: string | number }[];
  navLinks: { label: string; href: string; active?: boolean }[];
  children?: ReactNode;
}

export function BrandProfileSidebar({ logo, title, subtitle, slugPillLabel, applyHref, stats, navLinks, children }: BrandProfileSidebarProps) {
  return (
    <aside className="flex flex-col gap-5 border-b border-border-subtle p-5 lg:border-b-0 lg:border-r">
      <div className="text-center">
        {logo ? <div className="mb-3 flex justify-center">{logo}</div> : null}
        <h3 className="font-display text-lg text-text-primary">{title}</h3>
        <div className="mt-0.5 text-xs font-semibold text-text-muted">{subtitle}</div>
        {slugPillLabel ? (
          <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-border-subtle bg-bg-sunken px-3 py-1 font-mono-brand text-[10.5px] text-text-secondary">
            {slugPillLabel}
            <CopyIcon width={12} height={12} />
          </div>
        ) : null}
        {applyHref ? (
          <Button href={applyHref} className="mt-3 w-full">
            Apply Now
          </Button>
        ) : null}
      </div>
      <div className="flex border-y border-border-subtle py-3.5">
        {stats.map((s) => (
          <BrandProfileStat key={s.label} {...s} />
        ))}
      </div>
      <nav className="flex flex-col gap-0.5">
        {navLinks.map((l) => (
          <SidebarNavLink key={l.href} href={l.href} active={l.active}>
            {l.label}
          </SidebarNavLink>
        ))}
      </nav>
      {children}
    </aside>
  );
}

