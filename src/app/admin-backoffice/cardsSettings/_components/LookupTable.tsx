"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { LockIcon, PencilIcon, UnlockIcon } from "@/components/ui/icons";
import type { LookupItem } from "@/lib/types/admin";
import adminStyles from "../../admin.module.css";
import styles from "../cardsSettings.module.css";

interface LookupTableProps {
  items: LookupItem[];
  loading: boolean;
  emptyLabel: string;
  onEdit: (item: LookupItem) => void;
  onToggleStatus: (item: LookupItem) => void;
}

function formatDate(value: string) {
  return new Date(value).toLocaleDateString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function LookupTable({ items, loading, emptyLabel, onEdit, onToggleStatus }: LookupTableProps) {
  if (loading) {
    return (
      <div className={styles.tableWrap}>
        <div className={styles.skeletonRows}>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className={styles.skeletonRow}>
              <Skeleton className={styles.skeletonLine} />
              <Skeleton className={styles.skeletonLineShort} />
              <Skeleton className={styles.skeletonLineShort} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <div className={styles.tableEmpty}>
        <p>{emptyLabel}</p>
      </div>
    );
  }

  const renderActions = (item: LookupItem) => (
    <div className={styles.rowActions}>
      <button type="button" onClick={() => onEdit(item)} aria-label="Edit" className={adminStyles.iconBtn}>
        <PencilIcon width={15} height={15} />
      </button>
      <button
        type="button"
        onClick={() => onToggleStatus(item)}
        aria-label={item.status === 1 ? "Disable" : "Enable"}
        title={item.status === 1 ? "Disable" : "Enable"}
        className={item.status === 1 ? adminStyles.iconBtnDanger : adminStyles.iconBtnSuccess}
      >
        {item.status === 1 ? <LockIcon width={15} height={15} /> : <UnlockIcon width={15} height={15} />}
      </button>
    </div>
  );

  const renderStatusBadge = (item: LookupItem) => (
    <span
      className={`${adminStyles.statusBadge} ${
        item.status === 1 ? adminStyles.statusActive : adminStyles.statusInactive
      }`}
    >
      {item.status === 1 ? "Active" : "Disabled"}
    </span>
  );

  return (
    <>
      <div className={`${styles.tableWrap} ${styles.tableDesktop}`}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Created Date</th>
              <th>Status</th>
              <th className={styles.thActions}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr key={item.id}>
                <td className={styles.tdName}>{item.name}</td>
                <td className={styles.tdMuted}>{formatDate(item.createdAt)}</td>
                <td>{renderStatusBadge(item)}</td>
                <td>{renderActions(item)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.tableMobile}>
        {items.map((item) => (
          <div key={item.id} className={styles.lookupMobileCard}>
            <div className={styles.lookupMobileHeader}>
              <span className={styles.tdName}>{item.name}</span>
              {renderStatusBadge(item)}
            </div>
            <div className={styles.lookupMobileFooter}>
              <span className={styles.tdMuted}>{formatDate(item.createdAt)}</span>
              {renderActions(item)}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}
