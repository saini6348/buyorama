"use client";

import { useMemo, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { PencilIcon, TrashIcon, SortIcon, ChevronDownIcon } from "@/components/ui/icons";
import type { BrandFeed } from "@/lib/types/admin";
import { resolveImageUrl } from "@/lib/admin/uploads-api";
import styles from "../../brand-feeds.module.css";

type SortKey = "title" | "createdAt";
type SortDir = "asc" | "desc";

interface FeedsTableProps {
  feeds: BrandFeed[];
  loading: boolean;
  onEdit: (feed: BrandFeed) => void;
  onDelete: (feed: BrandFeed) => void;
}

export function FeedsTable({ feeds, loading, onEdit, onDelete }: FeedsTableProps) {
  const [sortKey, setSortKey] = useState<SortKey>("createdAt");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const sortedFeeds = useMemo(() => {
    const copy = [...feeds];
    copy.sort((a, b) => {
      const cmp =
        sortKey === "title"
          ? a.title.localeCompare(b.title)
          : new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
      return sortDir === "asc" ? cmp : -cmp;
    });
    return copy;
  }, [feeds, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((prev) => (prev === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  };

  const sortIndicator = (key: SortKey) =>
    sortKey === key ? (
      <ChevronDownIcon width={13} height={13} className={sortDir === "asc" ? styles.sortArrowUp : styles.sortArrowDown} />
    ) : (
      <SortIcon width={13} height={13} className={styles.sortIconIdle} />
    );

  if (loading) {
    return (
      <div className={styles.tableWrap}>
        <div className={styles.skeletonRows}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <Skeleton className={styles.skeletonThumb} />
              <Skeleton className={styles.skeletonLine} />
              <Skeleton className={styles.skeletonLineShort} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (feeds.length === 0) {
    return (
      <div className={styles.tableEmpty}>
        <p>No feeds yet.</p>
      </div>
    );
  }

  return (
    <>
      <div className={`${styles.tableWrap} ${styles.tableDesktop}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.thImage}>Image</th>
              <th>
                <button type="button" onClick={() => toggleSort("title")} className={styles.thSortBtn}>
                  Title {sortIndicator("title")}
                </button>
              </th>
              <th>Subtitle</th>
              <th>Description</th>
              <th>
                <button type="button" onClick={() => toggleSort("createdAt")} className={styles.thSortBtn}>
                  Created Date {sortIndicator("createdAt")}
                </button>
              </th>
              <th className={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedFeeds.map((feed) => (
              <tr key={feed.id}>
                <td>
                  {feed.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveImageUrl(feed.image)} alt={feed.title} className={styles.tableThumb} />
                  ) : (
                    <div className={styles.tableThumbFallback} />
                  )}
                </td>
                <td className={styles.tdTitle}>{feed.title}</td>
                <td className={styles.tdMuted}>{feed.subtitle || "—"}</td>
                <td className={styles.tdDescription}>{feed.description}</td>
                <td className={styles.tdMuted}>
                  {new Date(feed.createdAt).toLocaleDateString(undefined, {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </td>
                <td>
                  <div className={styles.rowActions}>
                    <button type="button" onClick={() => onEdit(feed)} aria-label="Edit feed" className={styles.iconBtn}>
                      <PencilIcon width={15} height={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(feed)}
                      aria-label="Delete feed"
                      className={styles.iconBtnDanger}
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tableMobile}>
        {sortedFeeds.map((feed) => (
          <div key={feed.id} className={styles.feedMobileCard}>
            <div className={styles.feedMobileHeader}>
              {feed.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={resolveImageUrl(feed.image)} alt={feed.title} className={styles.tableThumb} />
              ) : (
                <div className={styles.tableThumbFallback} />
              )}
              <div>
                <p className={styles.tdTitle}>{feed.title}</p>
                {feed.subtitle ? <p className={styles.tdMuted}>{feed.subtitle}</p> : null}
              </div>
            </div>
            <p className={styles.tdDescription}>{feed.description}</p>
            <div className={styles.feedMobileFooter}>
              <span className={styles.tdMuted}>
                {new Date(feed.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}
              </span>
              <div className={styles.rowActions}>
                <button type="button" onClick={() => onEdit(feed)} aria-label="Edit feed" className={styles.iconBtn}>
                  <PencilIcon width={15} height={15} />
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(feed)}
                  aria-label="Delete feed"
                  className={styles.iconBtnDanger}
                >
                  <TrashIcon width={15} height={15} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
