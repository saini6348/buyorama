"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "@/app/admin-backoffice/admin.module.css";
import {
  CreditCardIcon,
  FilterIcon,
  LogoutIcon,
  StoreIcon,
  TagIcon,
  TicketIcon,
} from "@/components/ui/icons";
import type { AdminUser } from "@/lib/types/admin";

interface AdminHeaderProps {
  user: AdminUser | null;
  onLogout: () => void;
}

interface SidebarItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ width?: number; height?: number; className?: string }>;
  isActive: (path: string) => boolean;
}

interface SidebarGroup {
  title?: string;
  items: SidebarItem[];
}

const NAV_GROUPS: SidebarGroup[] = [
  {
    items: [
      {
        href: "/admin-backoffice/brands",
        label: "Brands",
        icon: StoreIcon,
        isActive: (path: string) => path.startsWith("/admin-backoffice/brand"),
      },
      {
        href: "/admin-backoffice/coupons",
        label: "Coupons",
        icon: TicketIcon,
        isActive: (path: string) => path.startsWith("/admin-backoffice/coupons"),
      },
      {
        href: "/admin-backoffice/cards",
        label: "Cards",
        icon: CreditCardIcon,
        isActive: (path: string) =>
          path === "/admin-backoffice/cards" || path.startsWith("/admin-backoffice/cards/"),
      },
      {
        href: "/admin-backoffice/content",
        label: "Content",
        icon: TagIcon,
        isActive: (path: string) => path.startsWith("/admin-backoffice/content"),
      },
    ],
  },
  {
    title: "Configuration",
    items: [
      {
        href: "/admin-backoffice/cardsSettings",
        label: "Cards Settings",
        icon: FilterIcon,
        isActive: (path: string) => path.startsWith("/admin-backoffice/cardsSettings"),
      },
    ],
  },
];

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const initial = (user?.name || "Admin").trim().charAt(0).toUpperCase();

  return (
    <>
      {/* Top bar */}
      <header className={styles.topBar}>
        <button
          type="button"
          className={styles.navLogo}
          onClick={() => router.push("/admin-backoffice/brands")}
        >
          <span className={styles.navLogoMark}>B</span>
          <span className={styles.navLogoText}>
            <span className={styles.navLogoTitle}>Buyorama</span>
            <span className={styles.navLogoSubtitle}>Admin Panel</span>
          </span>
        </button>

        <div className={styles.userSection}>
          <span className={styles.userAvatar}>{initial}</span>
          <span className={styles.userInfo}>{user?.name || "Admin"}</span>
          <button type="button" onClick={onLogout} className={styles.logoutBtn}>
            <LogoutIcon width={15} height={15} />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Left sidebar */}
      <aside className={styles.sidebar}>
        <nav className={styles.sidebarNav} aria-label="Admin navigation">
          {NAV_GROUPS.map((group, gi) => {
            const groupHasActive = group.items.some((item) => item.isActive(pathname));
            return (
              <div key={gi} className={styles.sidebarGroup}>
                {group.title ? (
                  <span className={styles.sidebarGroupTitle}>{group.title}</span>
                ) : null}
                {group.items.map((item) => {
                  const active = item.isActive(pathname);
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.href}
                      type="button"
                      onClick={() => router.push(item.href)}
                      className={`${styles.sidebarItem} ${active ? styles.sidebarItemActive : ""}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {active ? (
                        <motion.span
                          layoutId="admin-sidebar-pill"
                          className={styles.sidebarPill}
                          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                        />
                      ) : null}
                      <span className={styles.sidebarItemIcon}>
                        <Icon width={17} height={17} />
                      </span>
                      <span className={styles.sidebarItemLabel}>{item.label}</span>
                    </button>
                  );
                })}
              </div>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
