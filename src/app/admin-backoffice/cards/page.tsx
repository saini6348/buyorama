"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import adminStyles from "../admin.module.css";
import styles from "./cards.module.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Toast, type ToastState } from "@/components/admin/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { RichTextEditor } from "./_components/RichTextEditor";
import {
  createCardsFeed,
  deleteCardsFeed,
  listActiveBanks,
  listActiveCardCategories,
  listActiveTags,
  listCardsFeeds,
  updateCardsFeed,
  updateCardsFeedStatus,
  type CardsFeed,
} from "@/lib/admin/cards-feed-api";
import type { LookupItem } from "@/lib/types/admin";
import {
  CreditCardIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TrashIcon,
} from "@/components/ui/icons";
import type { AdminUser } from "@/lib/types/admin";

const PAGE_SIZE = 9;

const emptyForm = {
  title: "",
  description: "",
  image: "",
  link: "",
  bankId: "",
  categoryIds: [] as string[],
  tagIds: [] as string[],
};

export default function CardsPage() {
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
      <div className={adminStyles.loadingContainer}>
        <div className={adminStyles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={adminStyles.container}>
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className={adminStyles.mainContent}>
        <CardsSection />
      </div>

      <footer className={adminStyles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CardsSection() {
  const [cards, setCards] = useState<CardsFeed[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  // Lookup data (active only)
  const [banks, setBanks] = useState<LookupItem[]>([]);
  const [categories, setCategories] = useState<LookupItem[]>([]);
  const [tags, setTags] = useState<LookupItem[]>([]);

  // Filters + pagination
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"" | "1" | "0">("");
  const [bankFilter, setBankFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [tagFilter, setTagFilter] = useState<string[]>([]);
  const [tagsOpen, setTagsOpen] = useState(false);
  const [page, setPage] = useState(1);

  // Modal state
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<CardsFeed | null>(null);
  const [formData, setFormData] = useState(emptyForm);
  const [imageError, setImageError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<CardsFeed | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (variant: ToastState["variant"], message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  useEffect(() => {
    let ignore = false;
    Promise.all([listActiveBanks(), listActiveCardCategories(), listActiveTags()])
      .then(([b, c, t]) => {
        if (!ignore) {
          setBanks(b);
          setCategories(c);
          setTags(t);
        }
      })
      .catch((error) => console.error("Error fetching lookups:", error));
    return () => {
      ignore = true;
    };
  }, []);

  useEffect(() => {
    let ignore = false;
    setLoading(true);
    listCardsFeeds({
      status: statusFilter ? Number(statusFilter) as 0 | 1 : undefined,
      bankId: bankFilter || undefined,
      categoryIds: categoryFilter ? [categoryFilter] : undefined,
      tagIds: tagFilter.length ? tagFilter : undefined,
      limit: PAGE_SIZE,
      offset: (page - 1) * PAGE_SIZE,
    })
      .then((res) => {
        if (!ignore) {
          setCards(res.data);
          setTotal(res.total);
        }
      })
      .catch((error) => console.error("Error fetching cards:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, [statusFilter, bankFilter, categoryFilter, tagFilter, page]);

  // Search filter is client-side over current page data
  const filteredCards = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return cards;
    return cards.filter(
      (c) =>
        c.title.toLowerCase().includes(query) ||
        (c.description ?? "").toLowerCase().includes(query)
    );
  }, [cards, search]);

  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const openCreate = () => {
    setEditingCard(null);
    setFormData(emptyForm);
    setImageError("");
    setShowModal(true);
  };

  const openEdit = (card: CardsFeed) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      description: card.description ?? "",
      image: card.image ?? "",
      link: card.link ?? "",
      bankId: card.bankId ?? "",
      categoryIds: (card.creditCardCategories ?? []).map((c) => c.id),
      tagIds: (card.tags ?? []).map((t) => t.id),
    });
    setImageError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    if (submitLoading) return;
    setEditingCard(null);
    setFormData(emptyForm);
    setImageError("");
    setShowModal(false);
  };

  const normalizeDescription = (html: string): string | undefined => {
    // contentEditable yields "<br>" (or "<div><br></div>") when left empty
    const stripped = html.replace(/<br\s*\/?>/gi, "").replace(/<div>\s*<\/div>/gi, "").trim();
    return stripped ? html : undefined;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    try {
      setSubmitLoading(true);
      const payload = {
        title: formData.title.trim(),
        description: normalizeDescription(formData.description || ""),
        image: formData.image || undefined,
        link: formData.link.trim() || undefined,
        bankId: formData.bankId || undefined,
        creditCardCategoryIds: formData.categoryIds,
        tagIds: formData.tagIds,
      };

      if (editingCard) {
        const updated = await updateCardsFeed({ id: editingCard.id, ...payload });
        setCards((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, bank: banks.find((b) => b.id === updated.bankId) ?? null } : c)));
        showToast("success", "Card updated successfully");
      } else {
        const created = await createCardsFeed(payload);
        setCards((prev) => [
          { ...created, bank: banks.find((b) => b.id === created.bankId) ?? null },
          ...prev,
        ]);
        setTotal((t) => t + 1);
        showToast("success", "Card created successfully");
      }
      handleCloseModal();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (card: CardsFeed) => {
    const next: 0 | 1 = card.status === 1 ? 0 : 1;
    try {
      const updated = await updateCardsFeedStatus(card.id, next);
      setCards((prev) => prev.map((c) => (c.id === updated.id ? { ...updated, bank: c.bank } : c)));
      showToast("success", next === 1 ? "Card activated" : "Card deactivated");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update status");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCardsFeed(deleteTarget.id);
      setCards((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      setTotal((t) => t - 1);
      showToast("success", "Card deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete card");
    } finally {
      setDeleting(false);
    }
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("");
    setBankFilter("");
    setCategoryFilter("");
    setTagFilter([]);
    setPage(1);
  };

  const activeFilterCount =
    (statusFilter ? 1 : 0) +
    (bankFilter ? 1 : 0) +
    (categoryFilter ? 1 : 0) +
    (tagFilter.length > 0 ? 1 : 0) +
    (search ? 1 : 0);

  return (
    <div className={adminStyles.section}>
      {/* Hero panel */}
      <div className={styles.heroPanel}>
        <div className={styles.heroIcon}>
          <CreditCardIcon width={30} height={30} />
        </div>
        <div>
          <h1 className={styles.heroTitle}>Cards</h1>
          <p className={styles.heroSubtitle}>
            {loading ? "Loading cards…" : `${total} card${total === 1 ? "" : "s"} total`}
          </p>
        </div>
      </div>

      {/* Page header actions */}
      <div className={adminStyles.pageHeader}>
        <div className={adminStyles.pageHeaderText}>
          <h2 className={adminStyles.pageTitle}>Credit Cards</h2>
          <p className={adminStyles.pageSubtitle}>Manage all credit card feed posts.</p>
        </div>
        <div className={adminStyles.pageHeaderActions}>
          <div className={adminStyles.searchBox}>
            <span className={adminStyles.searchIcon}>
              <SearchIcon width={15} height={15} />
            </span>
            <input
              type="search"
              placeholder="Search cards…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={adminStyles.searchInput}
              aria-label="Search cards"
            />
          </div>
          <button onClick={openCreate} className={adminStyles.btnPrimary} type="button">
            <PlusIcon width={16} height={16} />
            Add Card
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className={adminStyles.filterContainer}>
        <div className={adminStyles.selectWrap}>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value as "" | "1" | "0");
              setPage(1);
            }}
            className={adminStyles.filterSelect}
            aria-label="Filter by status"
          >
            <option value="">All Status</option>
            <option value="1">Active</option>
            <option value="0">Inactive</option>
          </select>
        </div>
        <div className={adminStyles.selectWrap}>
          <select
            value={bankFilter}
            onChange={(e) => {
              setBankFilter(e.target.value);
              setPage(1);
            }}
            className={adminStyles.filterSelect}
            aria-label="Filter by bank"
          >
            <option value="">All Banks</option>
            {banks.map((b) => (
              <option key={b.id} value={b.id}>
                {b.name}
              </option>
            ))}
          </select>
        </div>
        <div className={adminStyles.selectWrap}>
          <select
            value={categoryFilter}
            onChange={(e) => {
              setCategoryFilter(e.target.value);
              setPage(1);
            }}
            className={adminStyles.filterSelect}
            aria-label="Filter by category"
          >
            <option value="">All Categories</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* Tags multi-select filter */}
        <div className={styles.tagFilterWrap}>
          <button
            type="button"
            onClick={() => setTagsOpen((o) => !o)}
            className={`${styles.tagFilterTrigger} ${tagFilter.length > 0 ? styles.tagFilterTriggerActive : ""}`}
            aria-haspopup="true"
            aria-expanded={tagsOpen}
            aria-label="Filter by tags"
          >
            <span>
              {tagFilter.length > 0
                ? `${tagFilter.length} tag${tagFilter.length === 1 ? "" : "s"} selected`
                : "All Tags"}
            </span>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginLeft: 8, flex: "none" }}>
              <polyline points={tagsOpen ? "18 15 12 9 6 15" : "6 9 12 15 18 9"} />
            </svg>
          </button>

          {tagsOpen ? (
            <>
              <div className={styles.tagFilterBackdrop} onClick={() => setTagsOpen(false)} />
              <div className={styles.tagFilterMenu} role="menu">
                <div className={styles.tagFilterHeader}>
                  <span className={styles.tagFilterTitle}>Filter by Tags</span>
                  {tagFilter.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setTagFilter([])}
                      className={styles.tagFilterClear}
                    >
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className={styles.tagFilterList}>
                  {tags.length === 0 ? (
                    <p className={styles.tagFilterEmpty}>No tags available</p>
                  ) : (
                    tags.map((tag) => {
                      const checked = tagFilter.includes(tag.id);
                      return (
                        <label
                          key={tag.id}
                          className={`${styles.tagFilterItem} ${checked ? styles.tagFilterItemOn : ""}`}
                        >
                          <input
                            type="checkbox"
                            checked={checked}
                            onChange={(e) =>
                              setTagFilter((prev) =>
                                e.target.checked
                                  ? [...prev, tag.id]
                                  : prev.filter((id) => id !== tag.id)
                              )
                            }
                          />
                          <span>#{tag.name}</span>
                        </label>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          ) : null}
        </div>

        {activeFilterCount > 0 ? (
          <button type="button" onClick={resetFilters} className={adminStyles.btnSecondary}>
            Clear ({activeFilterCount})
          </button>
        ) : null}
      </div>

      {/* Grid */}
      {loading ? (
        <div className={styles.cardGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={styles.cardSkeleton} />
          ))}
        </div>
      ) : filteredCards.length === 0 ? (
        <div className={adminStyles.emptyState}>
          <span className={adminStyles.emptyIcon}>
            <CreditCardIcon width={22} height={22} />
          </span>
          <p className={adminStyles.emptyTitle}>
            {total === 0 ? "No cards yet" : "No matching cards"}
          </p>
          <p className={adminStyles.emptyText}>
            {total === 0 ? "Create your first card to get started." : "Try adjusting your filters or search."}
          </p>
        </div>
      ) : (
        <div className={styles.cardGrid}>
          <button type="button" onClick={openCreate} className={styles.addCardCard}>
            <span className={styles.addCardIcon}>
              <PlusIcon width={24} height={24} />
            </span>
            <span className={styles.addCardLabel}>Add New Card</span>
          </button>

          <AnimatePresence mode="popLayout">
            {filteredCards.map((card) => {
              const bankName = card.bank?.name;
              return (
                <motion.div
                  key={card.id}
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96 }}
                  whileHover={{ y: -4 }}
                  transition={{ duration: 0.2 }}
                  className={styles.card}
                >
                  <div className={styles.cardMedia}>
                    {card.image ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={card.image} alt={card.title} className={styles.cardImage} />
                    ) : (
                      <div className={styles.cardMediaFallback}>
                        <CreditCardIcon width={30} height={30} />
                      </div>
                    )}
                    <span
                      className={`${styles.statusBadge} ${card.status === 1 ? styles.statusActive : styles.statusInactive}`}
                    >
                      {card.status === 1 ? "Active" : "Inactive"}
                    </span>
                    <div className={styles.cardActions}>
                      <button
                        type="button"
                        onClick={() => openEdit(card)}
                        aria-label="Edit card"
                        title="Edit card"
                        className={styles.iconBtn}
                      >
                        <PencilIcon width={15} height={15} />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleToggleStatus(card)}
                        aria-label={card.status === 1 ? "Deactivate card" : "Activate card"}
                        title={card.status === 1 ? "Deactivate" : "Activate"}
                        className={styles.iconBtnSuccess}
                      >
                        {card.status === 1 ? "Deactivate" : "Activate"}
                      </button>
                      <button
                        type="button"
                        onClick={() => setDeleteTarget(card)}
                        aria-label="Delete card"
                        title="Delete card"
                        className={styles.iconBtnDanger}
                      >
                        <TrashIcon width={15} height={15} />
                      </button>
                    </div>
                  </div>
                  <div className={styles.cardBody}>
                    <h3 className={styles.cardTitle}>{card.title}</h3>
                    {bankName ? (
                      <span className={styles.cardBank}>{bankName}</span>
                    ) : null}
                    {(card.creditCardCategories ?? []).length > 0 ? (
                      <div className={styles.chipRow}>
                        {(card.creditCardCategories ?? []).map((cat) => (
                          <span key={cat.id} className={styles.chip}>
                            {cat.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    {(card.tags ?? []).length > 0 ? (
                      <div className={styles.chipRow}>
                        {(card.tags ?? []).map((tag) => (
                          <span key={tag.id} className={`${styles.chip} ${styles.chipTag}`}>
                            #{tag.name}
                          </span>
                        ))}
                      </div>
                    ) : null}
                    <span className={styles.cardDate}>
                      {new Date(card.createdAt).toLocaleDateString(undefined, {
                        year: "numeric",
                        month: "short",
                        day: "numeric",
                      })}
                    </span>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Pagination */}
      {!loading && totalPages > 1 ? (
        <div className={styles.pagination}>
          <button
            type="button"
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className={adminStyles.btnSecondary}
          >
            Previous
          </button>
          <span className={styles.pageInfo}>
            Page {page} of {totalPages}
          </span>
          <button
            type="button"
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className={adminStyles.btnSecondary}
          >
            Next
          </button>
        </div>
      ) : null}

      {/* Add/Edit modal */}
      <Modal
        open={showModal}
        onClose={handleCloseModal}
        title={editingCard ? "Edit Card" : "Add New Card"}
        panelClassName={styles.wideModal}
        footer={
          <>
            <button
              type="button"
              onClick={handleCloseModal}
              className={adminStyles.btnSecondary}
              disabled={submitLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              form="card-form"
              className={adminStyles.btnPrimary}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving…" : editingCard ? "Save Changes" : "Save Card"}
            </button>
          </>
        }
      >
        <form id="card-form" onSubmit={handleSubmit} className={adminStyles.form}>
          <div className={adminStyles.formGroup}>
            <label htmlFor="card-title" className={adminStyles.formLabel}>
              Title *
            </label>
            <input
              id="card-title"
              type="text"
              placeholder="e.g., HDFC Millennia Credit Card"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className={adminStyles.formInput}
            />
          </div>

          <div className={adminStyles.formGroup}>
            <label htmlFor="card-description" className={adminStyles.formLabel}>
              Description
            </label>
            <RichTextEditor
              value={formData.description}
              onChange={(html) => setFormData((prev) => ({ ...prev, description: html }))}
              placeholder="Describe this card…"
            />
          </div>

          {/* Bank — single select */}
          <div className={adminStyles.formGroup}>
            <label htmlFor="card-bank" className={adminStyles.formLabel}>
              Bank
            </label>
            <select
              id="card-bank"
              value={formData.bankId}
              onChange={(e) => setFormData((prev) => ({ ...prev, bankId: e.target.value }))}
              className={adminStyles.filterSelect}
              style={{ width: "100%" }}
            >
              <option value="">Select a bank</option>
              {banks.map((b) => (
                <option key={b.id} value={b.id}>
                  {b.name}
                </option>
              ))}
            </select>
          </div>

          {/* Credit Card Categories — multi-select */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.formLabel}>Credit Card Categories</label>
            <div className={styles.checkGrid}>
              {categories.map((cat) => {
                const checked = formData.categoryIds.includes(cat.id);
                return (
                  <label
                    key={cat.id}
                    className={`${styles.checkCard} ${checked ? styles.checkCardOn : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          categoryIds: e.target.checked
                            ? [...prev.categoryIds, cat.id]
                            : prev.categoryIds.filter((id) => id !== cat.id),
                        }))
                      }
                    />
                    <span>{cat.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Tags — multi-select */}
          <div className={adminStyles.formGroup}>
            <label className={adminStyles.formLabel}>Tags</label>
            <div className={styles.checkGrid}>
              {tags.map((tag) => {
                const checked = formData.tagIds.includes(tag.id);
                return (
                  <label
                    key={tag.id}
                    className={`${styles.checkCard} ${checked ? styles.checkCardOn : ""}`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          tagIds: e.target.checked
                            ? [...prev.tagIds, tag.id]
                            : prev.tagIds.filter((id) => id !== tag.id),
                        }))
                      }
                    />
                    <span>#{tag.name}</span>
                  </label>
                );
              })}
            </div>
          </div>

          <div className={adminStyles.formGroup}>
            <label htmlFor="card-link" className={adminStyles.formLabel}>
              Link URL
            </label>
            <input
              id="card-link"
              type="url"
              placeholder="https://example.com/card"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              className={adminStyles.formInput}
            />
          </div>

          <ImageUploadField
            preview={formData.image}
            error={imageError}
            onChange={(dataUrl) => setFormData((prev) => ({ ...prev, image: dataUrl }))}
            onError={setImageError}
          />
        </form>
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete card?"
        message={`This will permanently remove "${deleteTarget?.title ?? ""}". This can't be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
