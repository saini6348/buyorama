"use client";

import { useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { deleteFeed } from "@/lib/admin/brand-feeds-api";
import type { BrandFeed } from "@/lib/types/admin";
import { FeedsTable } from "./FeedsTable";
import { FeedForm } from "./FeedForm";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "../../brand-feeds.module.css";

interface FeedsPanelProps {
  brandId: string;
  feeds: BrandFeed[];
  loading: boolean;
  onFeedsChange: (updater: (feeds: BrandFeed[]) => BrandFeed[]) => void;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function FeedsPanel({ brandId, feeds, loading, onFeedsChange, showToast }: FeedsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingFeed, setEditingFeed] = useState<BrandFeed | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandFeed | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingFeed(null);
    setModalOpen(true);
  };

  const openEdit = (feed: BrandFeed) => {
    setEditingFeed(feed);
    setModalOpen(true);
  };

  const handleSuccess = (feed: BrandFeed, mode: "create" | "edit") => {
    if (mode === "create") {
      onFeedsChange((prev) => [feed, ...prev]);
      showToast("success", "Feed created successfully");
    } else {
      onFeedsChange((prev) => prev.map((f) => (f.id === feed.id ? feed : f)));
      showToast("success", "Feed updated successfully");
    }
    setModalOpen(false);
    setEditingFeed(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteFeed(deleteTarget.id);
      onFeedsChange((prev) => prev.filter((f) => f.id !== deleteTarget.id));
      showToast("success", "Feed deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete feed");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <h3 className={styles.panelHeading}>Feeds</h3>
        <button type="button" onClick={openCreate} className={styles.btnPrimary}>
          <PlusIcon width={16} height={16} />
          Add New Feed
        </button>
      </div>

      <FeedsTable feeds={feeds} loading={loading} onEdit={openEdit} onDelete={setDeleteTarget} />

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingFeed(null);
        }}
        title={editingFeed ? "Edit Feed" : "Add New Feed"}
      >
        <FeedForm
          mode={editingFeed ? "edit" : "create"}
          brandId={brandId}
          initial={editingFeed ?? undefined}
          onSuccess={handleSuccess}
          onCancel={() => {
            setModalOpen(false);
            setEditingFeed(null);
          }}
          showToast={showToast}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete feed?"
        message={`This will permanently remove "${deleteTarget?.title ?? ""}". This can't be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
