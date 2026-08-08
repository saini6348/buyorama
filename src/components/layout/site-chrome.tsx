"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

interface SiteChromeProps {
  header: ReactNode;
  footer: ReactNode;
  mobileNav: ReactNode;
  children: ReactNode;
}

/**
 * The admin backoffice is its own product surface — no public nav/footer/bottom-nav.
 * Everything else keeps the full site chrome.
 */
export function SiteChrome({ header, footer, mobileNav, children }: SiteChromeProps) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin-backoffice");

  if (isAdmin) {
    return <main className="flex-1">{children}</main>;
  }

  return (
    <>
      {header}
      <main className="flex-1 pb-20 md:pb-0">{children}</main>
      {footer}
      {mobileNav}
    </>
  );
}
