"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import styles from "../admin.module.css";
import brandsStyles from "./brands.module.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Modal } from "@/components/admin/Modal";
import { Toast, type ToastState } from "@/components/admin/Toast";
import { Skeleton } from "@/components/ui/skeleton";
import { createBrand, listBrands, updateBrand, updateBrandStatus } from "@/lib/admin/brands-api";
import { colorForId, slugify } from "@/lib/utils";
import {
  LockIcon,
  PencilIcon,
  PlusIcon,
  SearchIcon,
  StoreIcon,
  UnlockIcon,
} from "@/components/ui/icons";
import type { AdminUser, Brand } from "@/lib/types/admin";

export default function BrandsPage() {
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
        <BrandsSection />
      </div>

      <footer className={styles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>
    </div>
  );
}

const EMPTY_FORM = { brandName: "", slug: "", logo: "", siteUrl: "" };

function BrandsSection() {
  const router = useRouter();
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editingBrand, setEditingBrand] = useState<Brand | null>(null);
  const [slugTouched, setSlugTouched] = useState(false);
  const [formData, setFormData] = useState(EMPTY_FORM);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [toast, setToast] = useState<ToastState | null>(null);

  const showToast = (variant: ToastState["variant"], message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  useEffect(() => {
    let ignore = false;
    listBrands()
      .then((list) => {
        if (!ignore) setBrands(list);
      })
      .catch((error) => console.error("Error fetching brands:", error))
      .finally(() => {
        if (!ignore) setLoading(false);
      });
    return () => {
      ignore = true;
    };
  }, []);

  const filteredBrands = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return brands;
    return brands.filter(
      (brand) =>
        brand.brandName.toLowerCase().includes(query) || brand.slug.toLowerCase().includes(query)
    );
  }, [brands, search]);

  const handleAddClick = () => {
    setEditingBrand(null);
    setFormData(EMPTY_FORM);
    setSlugTouched(false);
    setShowModal(true);
  };

  const handleEditClick = (brand: Brand) => {
    setEditingBrand(brand);
    setFormData({
      brandName: brand.brandName,
      slug: brand.slug,
      logo: brand.logo || "",
      siteUrl: brand.siteUrl || "",
    });
    setSlugTouched(true);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setEditingBrand(null);
    setFormData(EMPTY_FORM);
    setShowModal(false);
    setSubmitLoading(false);
  };

  const handleNameChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      brandName: value,
      slug: slugTouched ? prev.slug : slugify(value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.brandName.trim() || !formData.slug.trim()) return;

    try {
      setSubmitLoading(true);
      if (editingBrand) {
        const updated = await updateBrand({ id: editingBrand.id, ...formData });
        setBrands((prev) => prev.map((brand) => (brand.id === updated.id ? updated : brand)));
        showToast("success", "Brand updated successfully");
      } else {
        const created = await createBrand(formData);
        setBrands((prev) => [created, ...prev]);
        showToast("success", "Brand created successfully");
      }
      handleCloseModal();
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitLoading(false);
    }
  };

  const handleToggleStatus = async (brand: Brand) => {
    try {
      const updated = await updateBrandStatus(brand.id, brand.status === 1 ? 0 : 1);
      setBrands((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
      showToast("success", updated.status === 1 ? "Brand activated" : "Brand deactivated");
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to update status");
    }
  };

  return (
    <div className={styles.section}>
      {/* Hero panel */}
      <div className={brandsStyles.heroPanel}>
        <div className={brandsStyles.heroIcon}>
          <StoreIcon width={30} height={30} />
        </div>
        <div>
          <h1 className={brandsStyles.heroTitle}>Brands</h1>
          <p className={brandsStyles.heroSubtitle}>
            {loading ? "Loading brands…" : `${brands.length} brand${brands.length === 1 ? "" : "s"} total`}
          </p>
        </div>
      </div>

      <div className={styles.pageHeader}>
        <div className={styles.pageHeaderText}>
          <h2 className={styles.pageTitle}>
            {loading ? "Loading brands…" : `${filteredBrands.length} of ${brands.length}`}
          </h2>
          <p className={styles.pageSubtitle}>Manage all brands across the site.</p>
        </div>
        <div className={styles.pageHeaderActions}>
          <div className={styles.searchBox}>
            <span className={styles.searchIcon}>
              <SearchIcon width={15} height={15} />
            </span>
            <input
              type="search"
              placeholder="Search brands…"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className={styles.searchInput}
              aria-label="Search brands"
            />
          </div>
          <button onClick={handleAddClick} className={styles.btnPrimary}>
            <PlusIcon width={16} height={16} />
            Add Brand
          </button>
        </div>
      </div>

      {loading ? (
        <div className={brandsStyles.brandGrid}>
          {Array.from({ length: 8 }).map((_, i) => (
            <Skeleton key={i} className={brandsStyles.brandSkeleton} />
          ))}
        </div>
      ) : filteredBrands.length === 0 ? (
        <div className={brandsStyles.emptyState}>
          <span className={brandsStyles.emptyIcon}>
            <StoreIcon width={22} height={22} />
          </span>
          <p className={brandsStyles.emptyTitle}>
            {brands.length === 0 ? "No brands yet" : "No matching brands"}
          </p>
          <p className={brandsStyles.emptyText}>
            {brands.length === 0
              ? "Create your first brand to get started."
              : "Try a different search term."}
          </p>
        </div>
      ) : (
        <div className={brandsStyles.brandGrid}>
          <button type="button" onClick={handleAddClick} className={brandsStyles.addBrandCard}>
            <span className={brandsStyles.addBrandIcon}>
              <PlusIcon width={24} height={24} />
            </span>
            <span className={brandsStyles.addBrandLabel}>Add New Brand</span>
          </button>

          <AnimatePresence mode="popLayout">
            {filteredBrands.map((brand) => (
              <motion.div
                key={brand.id}
                layout
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.96 }}
                whileHover={{ y: -4 }}
                transition={{ duration: 0.2 }}
                className={brandsStyles.brandCard}
                role="button"
                tabIndex={0}
                onClick={() => router.push(`/admin-backoffice/brand-feeds/${brand.slug}`)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    router.push(`/admin-backoffice/brand-feeds/${brand.slug}`);
                  }
                }}
              >
                <div className={brandsStyles.brandMedia}>
                  {brand.logo ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={brand.logo}
                      alt={brand.brandName}
                      className={brandsStyles.brandLogo}
                      onError={(e) => {
                        (e.target as HTMLImageElement).style.display = "none";
                      }}
                    />
                  ) : (
                    <div
                      className={brandsStyles.brandInitial}
                      style={{ backgroundColor: colorForId(brand.id) }}
                    >
                      {brand.brandName.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span
                    className={`${brandsStyles.statusDot} ${
                      brand.status === 1
                        ? brandsStyles.statusDotActive
                        : brandsStyles.statusDotInactive
                    }`}
                  />
                  <div className={brandsStyles.brandCardActions}>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleEditClick(brand);
                      }}
                      className={brandsStyles.iconBtn}
                      aria-label="Edit brand"
                      title="Edit brand"
                    >
                      <PencilIcon width={14} height={14} />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleToggleStatus(brand);
                      }}
                      className={
                        brand.status === 1
                          ? brandsStyles.iconBtnDanger
                          : brandsStyles.iconBtnSuccess
                      }
                      aria-label={brand.status === 1 ? "Deactivate brand" : "Activate brand"}
                      title={brand.status === 1 ? "Deactivate" : "Activate"}
                    >
                      {brand.status === 1 ? (
                        <LockIcon width={14} height={14} />
                      ) : (
                        <UnlockIcon width={14} height={14} />
                      )}
                    </button>
                  </div>
                </div>

                <div className={brandsStyles.brandBody}>
                  <h3 className={brandsStyles.brandName}>{brand.brandName}</h3>
                  <span className={brandsStyles.brandSlug}>/{brand.slug}</span>

                  <div className={brandsStyles.cardFooter}>
                    <span
                      className={`${brandsStyles.statusBadge} ${
                        brand.status === 1
                          ? brandsStyles.statusActive
                          : brandsStyles.statusInactive
                      }`}
                    >
                      {brand.status === 1 ? "Active" : "Inactive"}
                    </span>
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
        title={editingBrand ? "Edit Brand" : "Add New Brand"}
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
              form="brand-form"
              className={styles.btnPrimary}
              disabled={submitLoading}
            >
              {submitLoading ? "Saving…" : editingBrand ? "Save Changes" : "Create Brand"}
            </button>
          </>
        }
      >
        <form id="brand-form" onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="brandName" className={styles.formLabel}>
              Brand Name
            </label>
            <input
              id="brandName"
              type="text"
              placeholder="e.g., Ajio"
              value={formData.brandName}
              onChange={(e) => handleNameChange(e.target.value)}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <div className={styles.formRow}>
              <label htmlFor="slug" className={styles.formLabel}>
                Slug
              </label>
              {!slugTouched && formData.slug ? (
                <span className={styles.formHint}>Auto-generated</span>
              ) : null}
            </div>
            <input
              id="slug"
              type="text"
              placeholder="e.g., ajio-deals"
              value={formData.slug}
              onChange={(e) => {
                setSlugTouched(true);
                setFormData((prev) => ({ ...prev, slug: e.target.value }));
              }}
              required
              className={styles.formInput}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="logo" className={styles.formLabel}>
              Logo URL
            </label>
            <input
              id="logo"
              type="url"
              placeholder="https://example.com/logo.png"
              value={formData.logo}
              onChange={(e) => setFormData((prev) => ({ ...prev, logo: e.target.value }))}
              className={styles.formInput}
            />
            {formData.logo ? (
              <div className={styles.imagePreviewWrap}>
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={formData.logo}
                  alt="Logo preview"
                  className={styles.imagePreview}
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            ) : null}
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="siteUrl" className={styles.formLabel}>
              Brand Site URL
            </label>
            <input
              id="siteUrl"
              type="text"
              placeholder="e.g., amazon.in"
              value={formData.siteUrl}
              onChange={(e) => setFormData((prev) => ({ ...prev, siteUrl: e.target.value }))}
              className={styles.formInput}
            />
          </div>
        </form>
      </Modal>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
