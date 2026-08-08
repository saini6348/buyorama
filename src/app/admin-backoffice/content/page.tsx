"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import styles from "../admin.module.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Toast, type ToastState } from "@/components/admin/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { listBrands } from "@/lib/admin/brands-api";
import {
  createContent,
  deleteContent,
  listContent,
  updateContent,
  updateContentStatus,
} from "@/lib/admin/content-api";
import { colorForId } from "@/lib/utils";
import {
  ChevronDownIcon,
  ImageIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TagIcon,
  TrashIcon,
} from "@/components/ui/icons";
import type { AdminUser, Brand, ContentItem } from "@/lib/types/admin";

export default function ContentPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!authToken) {
      router.push("/admin-backoffice");
      return;
    }

    if (userData) {
      // Reading the session out of localStorage has to happen post-hydration (it doesn't
      // exist during SSR), and the isLoading gate above already keeps the first paint
      // identical on server and client, so this doesn't cause the cascading-render the
      // rule is guarding against.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/admin-backoffice");
  };

  if (isLoading) {
    return (
      <div className={styles.loadingContainer}>
        <div className={styles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className={styles.mainContent}>
        <ContentSection />
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

const EMPTY_FORM = {
  brandId: "",
  title: "",
  description: "",
  imagePreview: "",
  status: 1 as 0 | 1,
};

function ContentSection() {
  const [content, setContent] = useState<ContentItem[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrandFilter, setSelectedBrandFilter] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState<ContentItem | null>(null);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [imageError, setImageError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<ContentItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (variant: ToastState["variant"], message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  useEffect(() => {
    let ignore = false;

    listBrands()
      .then((list) => {
        if (!ignore) setBrands(list.filter((b) => b.status === 1));
      })
      .catch((error) => console.error("Error fetching brands:", error));

    listContent()
      .then((list) => {
        if (!ignore) setContent(list);
      })
      .catch((error) => console.error("Error fetching content:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const filteredContent = useMemo(() => {
    const query = search.trim().toLowerCase();
    return content.filter((item) => {
      const matchesBrand = !selectedBrandFilter || item.brandId === selectedBrandFilter;
      const matchesQuery = !query || item.title.toLowerCase().includes(query);
      return matchesBrand && matchesQuery;
    });
  }, [content, search, selectedBrandFilter]);

  const openCreate = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setImageError("");
    setShowModal(true);
  };

  const openEdit = (item: ContentItem) => {
    setEditingItem(item);
    setFormData({
      brandId: item.brandId,
      title: item.title,
      description: item.description,
      imagePreview: item.image_path || "",
      status: item.status,
    });
    setImageError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingItem(null);
    setFormData(EMPTY_FORM);
    setImageError("");
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem && !formData.brandId) {
      showToast("error", "Please select a brand");
      return;
    }
    if (!formData.title.trim() || !formData.description.trim()) {
      showToast("error", "Title and description are required");
      return;
    }

    try {
      setSubmitLoading(true);
      if (editingItem) {
        const updated = await updateContent({
          id: editingItem.id,
          title: formData.title,
          description: formData.description,
          imagePath: formData.imagePreview,
          status: formData.status,
        });
        setContent((prev) => prev.map((item) => (item.id === updated.id ? updated : item)));
        showToast("success", "Content updated successfully");
      } else {
        const created = await createContent({
          brandId: formData.brandId,
          title: formData.title,
          description: formData.description,
          imagePath: formData.imagePreview,
          status: formData.status,
        });
        setContent((prev) => [created, ...prev]);
        showToast("success", "Content created successfully");
      }
      handleCloseModal();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (item: ContentItem) => {
    try {
      const updated = await updateContentStatus(item.id, item.status === 1 ? 0 : 1);
      setContent((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteContent(deleteTarget.id);
      setContent((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("success", "Content deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete content");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.section}>
      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h1 className={styles.pageTitle}>Content</h1>
          <p className={styles.pageSubtitle}>
            {loading
              ? "Loading content…"
              : `${filteredContent.length} of ${content.length} item${content.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <div className={styles.pageHeaderActions}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <SearchIcon width={15} height={15} />
            </span>
            <input
              type="search"
              placeholder="Search content…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search content"
            />
          </div>
          <div className={styles.selectWrap}>
            <select
              value={selectedBrandFilter}
              onChange={(e) => setSelectedBrandFilter(e.target.value)}
              className={styles.filterSelect}
              aria-label="Filter by brand"
            >
              <option value="">All Brands</option>
              {brands.map((brand) => (
                <option key={brand.id} value={brand.id}>
                  {brand.brandName}
                </option>
              ))}
            </select>
            <span className={styles.selectChevron}>
              <ChevronDownIcon width={14} height={14} />
            </span>
          </div>
          <button onClick={openCreate} className={styles.btnPrimary}>
            <PlusIcon width={16} height={16} />
            Add Content
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.contentGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={styles.skeletonContentCard} />
          ))}
        </div>
      ) : filteredContent.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <TagIcon width={22} height={22} />
          </span>
          <p className={styles.emptyTitle}>
            {content.length === 0 ? "No content yet" : "No content found"}
          </p>
          <p className={styles.emptyText}>
            {content.length === 0
              ? "Create your first content item to get started."
              : "Try a different search term or brand filter."}
          </p>
        </div>
      ) : (
        <div className={styles.contentGrid}>
          <AnimatePresence mode="popLayout">
            {filteredContent.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -3 }}
                transition={{ duration: 0.18 }}
                className={styles.contentCard}
              >
                <div className={styles.contentMedia}>
                  {item.image_path ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.image_path} alt={item.title} className={styles.contentImage} />
                  ) : (
                    <div className={styles.contentMediaFallback}>
                      <ImageIcon width={26} height={26} />
                    </div>
                  )}
                  <div className={styles.contentCardActions}>
                    <button
                      type="button"
                      onClick={() => openEdit(item)}
                      className={styles.iconBtn}
                      aria-label="Edit content"
                      title="Edit content"
                    >
                      <PencilIcon width={14} height={14} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(item)}
                      className={styles.iconBtnDanger}
                      aria-label="Delete content"
                      title="Delete content"
                    >
                      <TrashIcon width={14} height={14} />
                    </button>
                  </div>
                </div>

                <div className={styles.contentBody}>
                  <div className={styles.contentHeadRow}>
                    {item.brand ? (
                      <span
                        className={styles.brandTag}
                        style={{ backgroundColor: colorForId(item.brandId) }}
                      >
                        {item.brand.brandName}
                      </span>
                    ) : null}
                  </div>
                  <h3 className={styles.contentTitle}>{item.title}</h3>
                  <p className={styles.contentDescription}>{item.description}</p>

                  <div className={styles.contentFooter}>
                    <small className={styles.date}>
                      {new Date(item.created_at).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </small>
                    <button
                      type="button"
                      onClick={() => handleToggleStatus(item)}
                      className={`${styles.contentStatus} ${
                        item.status === 1 ? styles.contentPublished : styles.contentNotPublished
                      }`}
                      title={item.status === 1 ? "Click to unpublish" : "Click to publish"}
                    >
                      {item.status === 1 ? "Published" : "Not Published"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        title={editingItem ? "Edit Content" : "Add New Content"}
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              className={styles.btnSecondary}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="content-form"
              className={styles.btnPrimary}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving…" : editingItem ? "Save Changes" : "Create Content"}
            </button>
          </>
        }
      >
        <form id="content-form" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Brand</label>
            {editingItem ? (
              <span className={styles.staticField}>
                <TagIcon width={14} height={14} />
                {editingItem.brand?.brandName ?? "—"}
              </span>
            ) : (
              <div className={styles.selectWrap} style={{ width: "100%" }}>
                <select
                  id="brand"
                  value={formData.brandId}
                  onChange={(e) => setFormData((prev) => ({ ...prev, brandId: e.target.value }))}
                  required
                  className={styles.filterSelect}
                  style={{ width: "100%" }}
                >
                  <option value="">Choose a brand…</option>
                  {brands.map((brand) => (
                    <option key={brand.id} value={brand.id}>
                      {brand.brandName}
                    </option>
                  ))}
                </select>
                <span className={styles.selectChevron}>
                  <ChevronDownIcon width={14} height={14} />
                </span>
              </div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="title" className={styles.formLabel}>
              Title
            </label>
            <input
              id="title"
              type="text"
              placeholder="Content title"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description" className={styles.formLabel}>
              Description
            </label>
            <textarea
              id="description"
              placeholder="Write your content description here…"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
              className={styles.formTextarea}
            ></textarea>
          </div>

          <ImageUploadField
            preview={formData.imagePreview}
            error={imageError}
            onChange={(dataUrl) => setFormData((prev) => ({ ...prev, imagePreview: dataUrl }))}
            onError={setImageError}
          />

          <div className={styles.formGroup}>
            <label className={styles.formLabel}>Status</label>
            <div className={styles.statusSwitch}>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: 1 }))}
                className={`${styles.statusSwitchBtn} ${
                  formData.status === 1 ? `${styles.statusSwitchBtnActive} ${styles.statusSwitchBtnActivePublish}` : ""
                }`}
              >
                Publish
              </button>
              <button
                type="button"
                onClick={() => setFormData((prev) => ({ ...prev, status: 0 }))}
                className={`${styles.statusSwitchBtn} ${
                  formData.status === 0 ? `${styles.statusSwitchBtnActive} ${styles.statusSwitchBtnActiveDraft}` : ""
                }`}
              >
                Not Publish
              </button>
            </div>
          </div>
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete content?"
        message={`This will permanently remove "${deleteTarget?.title ?? ""}". This can't be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
