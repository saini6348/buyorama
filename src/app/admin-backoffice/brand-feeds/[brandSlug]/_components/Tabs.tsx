"use client";

import { motion } from "framer-motion";
import styles from "../../brand-feeds.module.css";

export type TabKey = "coupons" | "feeds";

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  couponCount?: number;
  feedCount?: number;
}

const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: "coupons", label: "Coupons" },
  { key: "feeds", label: "Feeds" },
];

export function Tabs({ active, onChange, couponCount, feedCount }: TabsProps) {
  return (
    <div className={styles.tabsRoot} role="tablist">
      {TAB_ITEMS.map((tab) => {
        const count = tab.key === "coupons" ? couponCount : feedCount;
        const isActive = active === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.key)}
            className={`${styles.tabButton} ${isActive ? styles.tabButtonActive : ""}`}
          >
            {isActive ? (
              <motion.span
                layoutId="brand-feeds-tab-pill"
                className={styles.tabPill}
                transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              />
            ) : null}
            <span className={styles.tabLabel}>
              {tab.label}
              {typeof count === "number" ? <span className={styles.tabCount}>{count}</span> : null}
            </span>
          </button>
        );
      })}
    </div>
  );
}
