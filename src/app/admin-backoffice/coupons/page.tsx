"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import adminStyles from "../admin.module.css";
import styles from "./coupons.module.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal } from "@/components/admin/Modal";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { ImageUploadField } from "@/components/admin/ImageUploadField";
import { Toast, type ToastState } from "@/components/admin/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createAllCoupon,
  deleteAllCoupon,
  listAllCoupons,
  updateAllCoupon,
  type AllCoupon,
} from "@/lib/admin/coupons-api";
import {
  PencilIcon,
  PlusIcon,
  SearchIcon,
  TicketIcon,
  TrashIcon,
} from "@/components/ui/icons";
import type { AdminUser } from "@/lib/types/admin";

export default function CouponsPage() {
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
        <CouponsSection />
      </div>

      <footer className={adminStyles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

function CouponsSection() {
  const [coupons, setCoupons] = useState<AllCoupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<AllCoupon | null>(null);
  const [formData, setFormData] = useState({ title: "", description: "", link: "", image: "" });
  const [imageError, setImageError] = useState("");
  const [submitLoading, setSubmitLoading] = useState(false);

  const [deleteTarget, setDeleteTarget] = useState<AllCoupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (variant: ToastState["variant"], message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  useEffect(() => {
    let ignore = false;
    listAllCoupons()
      .then((list) => {
        if (!ignore) setCoupons(list);
      })
      .catch((error) => console.error("Error fetching coupons:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredCoupons = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return coupons;
    return coupons.filter(
      (coupon) =>
        coupon.title.toLowerCase().includes(query) ||
        coupon.description.toLowerCase().includes(query)
    );
  }, [coupons, search]);

  const openCreate = () => {
    setEditingCoupon(null);
    setFormData({ title: "", description: "", link: "", image: "" });
    setImageError("");
    setShowModal(true);
  };

  const openEdit = (coupon: AllCoupon) => {
    setEditingCoupon(coupon);
    setFormData({
      title: coupon.title,
      description: coupon.description,
      link: coupon.link,
      image: coupon.image || "",
    });
    setImageError("");
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingCoupon(null);
    setFormData({ title: "", description: "", link: "", image: "" });
    setImageError("");
    setShowModal(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.description.trim() || !formData.link.trim()) return;

    try {
      setSubmitLoading(true);
      if (editingCoupon) {
        const updated = await updateAllCoupon({
          id: editingCoupon.id,
          title: formData.title,
          description: formData.description,
          link: formData.link,
          image: formData.image || undefined,
        });
        setCoupons((prev) => prev.map((c) => (c.id === updated.id ? updated : c)));
        showToast("success", "Coupon updated successfully");
      } else {
        const created = await createAllCoupon({
          title: formData.title,
          description: formData.description,
          link: formData.link,
          image: formData.image || undefined,
        });
        setCoupons((prev) => [created, ...prev]);
        showToast("success", "Coupon created successfully");
      }
      handleCloseModal();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteAllCoupon(deleteTarget.id);
      setCoupons((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("success", "Coupon deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={adminStyles.section}>
      {/* Hero panel */}
      <div className={styles.heroPanel}>
        <div className={styles.heroIcon}>
          <TicketIcon width={30} height={30} />
        </div>
        <div>
          <h1 className={styles.heroTitle}>Coupons</h1>
          <p className={styles.heroSubtitle}>
            {loading ? "Loading coupons…" : `${coupons.length} coupon${coupons.length === 1 ? "" : "s"} total`}
          </p>
        </div>
      </div>

      {/* Page header actions */}
      <div className={adminStyles.pageHeader}>
        <div className={adminStyles.pageHeaderText}>
          <h2 className={adminStyles.pageTitle}>
            {loading ? "Loading coupons…" : `${filteredCoupons.length} of ${coupons.length}`}
          </h2>
          <p className={adminStyles.pageSubtitle}>Manage all coupons across the site.</p>
        </div>
        <div className={adminStyles.pageHeaderActions}>
          <div className={adminStyles.searchBox}>
            <span className={adminStyles.searchIcon}>
              <SearchIcon width={15} height={15} />
            </span>
            <input
              type="search"
              placeholder="Search coupons…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={adminStyles.searchInput}
              aria-label="Search coupons"
            />
          </div>
          <button onClick={openCreate} className={adminStyles.btnPrimary}>
            <PlusIcon width={16} height={16} />
            Add Coupon
          </button>
        </div>
      </div>

      {loading ? (
        <div className={styles.couponGrid}>
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className={styles.couponSkeleton} />
          ))}
        </div>
      ) : filteredCoupons.length === 0 ? (
        <div className={styles.emptyState}>
          <span className={styles.emptyIcon}>
            <TicketIcon width={22} height={22} />
          </span>
          <p className={styles.emptyTitle}>
            {coupons.length === 0 ? "No coupons yet" : "No matching coupons"}
          </p>
          <p className={styles.emptyText}>
            {coupons.length === 0
              ? "Create your first coupon to get started."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className={styles.couponGrid}>
          <button type="button" onClick={openCreate} className={styles.addCouponCard}>
            <span className={styles.addCouponIcon}>
              <PlusIcon width={24} height={24} />
            </span>
            <span className={styles.addCouponLabel}>Add New Coupon</span>
          </button>

          <AnimatePresence mode="popLayout">
            {filteredCoupons.map((coupon) => (
              <motion.div
                key={coupon.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={styles.couponCard}
              >
                <div className={styles.couponMedia}>
                  {coupon.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={coupon.image} alt={coupon.title} className={styles.couponImage} />
                  ) : (
                    <div className={styles.couponMediaFallback}>
                      <TicketIcon width={28} height={28} />
                    </div>
                  )}
                  <div className={styles.couponCardActions}>
                    <button
                      type="button"
                      onClick={() => openEdit(coupon)}
                      aria-label="Edit coupon"
                      title="Edit coupon"
                      className={styles.iconBtn}
                    >
                      <PencilIcon width={15} height={15} />
                    </button>
                    <button
                      type="button"
                      onClick={() => setDeleteTarget(coupon)}
                      aria-label="Delete coupon"
                      title="Delete coupon"
                      className={styles.iconBtnDanger}
                    >
                      <TrashIcon width={15} height={15} />
                    </button>
                  </div>
                </div>
                <div className={styles.couponBody}>
                  <h3 className={styles.couponTitle}>{coupon.title}</h3>
                  <p className={styles.couponDescription}>{coupon.description}</p>
                  <a
                    href={coupon.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.couponLink}
                    title={coupon.link}
                  >
                    {coupon.link}
                  </a>
                  <span className={styles.couponDate}>
                    {new Date(coupon.createdAt).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    })}
                  </span>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <Modal
        open={showModal}
        onClose={handleCloseModal}
        title={editingCoupon ? "Edit Coupon" : "Add New Coupon"}
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
              form="coupon-form"
              className={adminStyles.btnPrimary}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving…" : editingCoupon ? "Save Changes" : "Save Coupon"}
            </button>
          </>
        }
      >
        <form id="coupon-form" onSubmit={handleSubmit} className={adminStyles.form}>
          <div className={adminStyles.formGroup}>
            <label htmlFor="coupon-title" className={adminStyles.formLabel}>
              Title *
            </label>
            <input
              id="coupon-title"
              type="text"
              placeholder="e.g., Flat 50% off on all orders"
              value={formData.title}
              onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
              required
              className={adminStyles.formInput}
            />
          </div>

          <div className={adminStyles.formGroup}>
            <label htmlFor="coupon-description" className={adminStyles.formLabel}>
              Description *
            </label>
            <textarea
              id="coupon-description"
              placeholder="Describe the coupon offer…"
              value={formData.description}
              onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
              required
              className={adminStyles.formTextarea}
            />
          </div>

          <div className={adminStyles.formGroup}>
            <label htmlFor="coupon-link" className={adminStyles.formLabel}>
              Link URL *
            </label>
            <input
              id="coupon-link"
              type="url"
              placeholder="https://example.com/deal"
              value={formData.link}
              onChange={(e) => setFormData((prev) => ({ ...prev, link: e.target.value }))}
              required
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
        title="Delete coupon?"
        message={`This will permanently remove "${deleteTarget?.title ?? ""}". This can't be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
