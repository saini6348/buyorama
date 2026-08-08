"use client";

import { motion } from "framer-motion";
import styles from "../cardsSettings.module.css";

export type TabKey = "categories" | "banks" | "tags";

interface TabsProps {
  active: TabKey;
  onChange: (tab: TabKey) => void;
  categoryCount?: number;
  bankCount?: number;
  tagCount?: number;
}

const TAB_ITEMS: { key: TabKey; label: string }[] = [
  { key: "categories", label: "Credit Card Categories" },
  { key: "banks", label: "Banks" },
  { key: "tags", label: "Tags" },
];

export function Tabs({ active, onChange, categoryCount, bankCount, tagCount }: TabsProps) {
  const countFor = (key: TabKey) => {
    if (key === "categories") return categoryCount;
    if (key === "banks") return bankCount;
    return tagCount;
  };

  return (
    <div className={styles.tabsRoot} role="tablist">
      {TAB_ITEMS.map((tab) => {
        const count = countFor(tab.key);
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
                layoutId="cards-settings-tab-pill"
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
