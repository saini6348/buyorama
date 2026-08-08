"use client";

import { useEffect, useState } from "react";
import { PlusIcon } from "@/components/ui/icons";
import { Modal } from "@/components/admin/Modal";
import type { LookupItem } from "@/lib/types/admin";
import { LookupTable } from "./LookupTable";
import adminStyles from "../../admin.module.css";
import styles from "../cardsSettings.module.css";

interface LookupApi {
  list: (limit?: number, offset?: number) => Promise<LookupItem[]>;
  create: (name: string) => Promise<LookupItem>;
  update: (id: string, name: string) => Promise<LookupItem>;
  updateStatus: (id: string, status: 0 | 1) => Promise<LookupItem>;
}

function pluralize(label: string) {
  return label.endsWith("y") ? `${label.slice(0, -1)}ies` : `${label}s`;
}

interface LookupPanelProps {
  title: string;
  singularLabel: string;
  api: LookupApi;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function LookupPanel({ title, singularLabel, api, showToast }: LookupPanelProps) {
  const [items, setItems] = useState<LookupItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<LookupItem | null>(null);
  const [name, setName] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  useEffect(() => {
    let ignore = false;
    api
      .list()
      .then((list) => {
        if (!ignore) setItems(list);
      })
      .catch((error) => console.error(`Error fetching ${title}:`, error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [api, title]);

  const openCreate = () => {
    setEditingItem(null);
    setName("");
    setShowModal(true);
  };

  const openEdit = (item: LookupItem) => {
    setEditingItem(item);
    setName(item.name);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setName("");
    setSubmitLoading(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    try {
      setSubmitLoading(true);
      if (editingItem) {
        const updated = await api.update(editingItem.id, name.trim());
        setItems((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        showToast("success", `${singularLabel} updated successfully`);
      } else {
        const created = await api.create(name.trim());
        setItems((prev) => [created, ...prev]);
        showToast("success", `${singularLabel} created successfully`);
      }
      closeModal();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (item: LookupItem) => {
    try {
      const updated = await api.updateStatus(item.id, item.status === 1 ? 0 : 1);
      setItems((prev) => prev.map((i) => (i.id === updated.id ? updated : i)));
      showToast("success", updated.status === 1 ? `${singularLabel} enabled` : `${singularLabel} disabled`);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update status");
    }
  };

  return (
    <div>
      <div className={styles.panelHeader}>
        <div>
          <h3 className={styles.panelHeading}>{title}</h3>
          <p className={styles.panelSubtitle}>
            {loading
              ? "Loading…"
              : `${items.length} ${items.length === 1 ? singularLabel.toLowerCase() : pluralize(singularLabel.toLowerCase())}`}
          </p>
        </div>
        <button type="button" onClick={openCreate} className={adminStyles.btnPrimary}>
          <PlusIcon width={16} height={16} />
          Add New {singularLabel}
        </button>
      </div>

      <LookupTable
        items={items}
        loading={loading}
        emptyLabel={`No ${title.toLowerCase()} yet.`}
        onEdit={openEdit}
        onToggleStatus={handleToggleStatus}
      />

      <Modal
        open={showModal}
        onClose={closeModal}
        title={editingItem ? `Edit ${singularLabel}` : `Add New ${singularLabel}`}
        footer={
          <>
            <button type="button" onClick={closeModal} className={adminStyles.btnSecondary} disabled={submitLoading}>
              Cancel
            </button>
            <button
              type="submit"
              form="lookup-form"
              className={adminStyles.btnPrimary}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving…" : editingItem ? "Save Changes" : "Create"}
            </button>
          </>
        }
      >
        <form id="lookup-form" onSubmit={handleSubmit} className={adminStyles.form}>
          <div className={adminStyles.formGroup}>
            <label htmlFor="lookup-name" className={adminStyles.formLabel}>
              {singularLabel} Name
            </label>
            <input
              id="lookup-name"
              type="text"
              placeholder={`e.g., ${singularLabel}`}
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className={adminStyles.formInput}
            />
          </div>
        </form>
      </Modal>
    </div>
  );
}
