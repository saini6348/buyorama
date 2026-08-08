"use client";

import { usePathname, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import styles from "@/app/admin-backoffice/admin.module.css";
import { CreditCardIcon, LogoutIcon, StoreIcon, TagIcon } from "@/components/ui/icons";
import type { AdminUser } from "@/lib/types/admin";

interface AdminHeaderProps {
  user: AdminUser | null;
  onLogout: () => void;
}

const NAV_ITEMS = [
  {
    href: "/admin-backoffice/brands",
    label: "Brands",
    icon: StoreIcon,
    isActive: (path: string) => path.startsWith("/admin-backoffice/brand"),
  },
  {
    href: "/admin-backoffice/content",
    label: "Content",
    icon: TagIcon,
    isActive: (path: string) => path.startsWith("/admin-backoffice/content"),
  },
  {
    href: "/admin-backoffice/cardsSettings",
    label: "Cards Settings",
    icon: CreditCardIcon,
    isActive: (path: string) => path.startsWith("/admin-backoffice/cardsSettings"),
  },
];

export function AdminHeader({ user, onLogout }: AdminHeaderProps) {
  const router = useRouter();
  const pathname = usePathname() ?? "";
  const initial = (user?.name || "Admin").trim().charAt(0).toUpperCase();

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContent}>
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

        <div className={styles.navMenu} role="tablist">
          {NAV_ITEMS.map((item) => {
            const active = item.isActive(pathname);
            const Icon = item.icon;
            return (
              <button
                key={item.href}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => router.push(item.href)}
                className={`${styles.navMenuItem} ${active ? styles.navMenuItemActive : ""}`}
              >
                {active ? (
                  <motion.span
                    layoutId="admin-nav-pill"
                    className={styles.navPill}
                    transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  />
                ) : null}
                <span className={styles.navMenuLabel}>
                  <Icon width={16} height={16} />
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>

        <div className={styles.userSection}>
          <span className={styles.userAvatar}>{initial}</span>
          <span className={styles.userInfo}>{user?.name || "Admin"}</span>
          <button type="button" onClick={onLogout} className={styles.logoutBtn}>
            <LogoutIcon width={15} height={15} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </nav>
  );
}
