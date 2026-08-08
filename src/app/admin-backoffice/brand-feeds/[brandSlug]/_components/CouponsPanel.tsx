"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { Skeleton } from "@/components/ui/skeleton";
import { deleteCoupon } from "@/lib/admin/brand-feeds-api";
import type { BrandCoupon } from "@/lib/types/admin";
import { AddCouponCard } from "./AddCouponCard";
import { CouponCard } from "./CouponCard";
import { CouponForm } from "./CouponForm";
import { Modal } from "./Modal";
import { ConfirmDialog } from "./ConfirmDialog";
import styles from "../../brand-feeds.module.css";

interface CouponsPanelProps {
  brandId: string;
  coupons: BrandCoupon[];
  loading: boolean;
  onCouponsChange: (updater: (coupons: BrandCoupon[]) => BrandCoupon[]) => void;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function CouponsPanel({ brandId, coupons, loading, onCouponsChange, showToast }: CouponsPanelProps) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editingCoupon, setEditingCoupon] = useState<BrandCoupon | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<BrandCoupon | null>(null);
  const [deleting, setDeleting] = useState(false);

  const openCreate = () => {
    setEditingCoupon(null);
    setModalOpen(true);
  };

  const openEdit = (coupon: BrandCoupon) => {
    setEditingCoupon(coupon);
    setModalOpen(true);
  };

  const handleSuccess = (coupon: BrandCoupon, mode: "create" | "edit") => {
    if (mode === "create") {
      onCouponsChange((prev) => [coupon, ...prev]);
      showToast("success", "Coupon created successfully");
    } else {
      onCouponsChange((prev) => prev.map((c) => (c.id === coupon.id ? coupon : c)));
      showToast("success", "Coupon updated successfully");
    }
    setModalOpen(false);
    setEditingCoupon(null);
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      setDeleting(true);
      await deleteCoupon(deleteTarget.id);
      onCouponsChange((prev) => prev.filter((c) => c.id !== deleteTarget.id));
      showToast("success", "Coupon deleted");
      setDeleteTarget(null);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Failed to delete coupon");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.couponGrid}>
      <AddCouponCard onClick={openCreate} />

      {loading
        ? Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className={styles.couponSkeleton} />)
        : null}

      <AnimatePresence mode="popLayout">
        {!loading &&
          coupons.map((coupon) => (
            <CouponCard
              key={coupon.id}
              coupon={coupon}
              onEdit={() => openEdit(coupon)}
              onDelete={() => setDeleteTarget(coupon)}
            />
          ))}
      </AnimatePresence>

      <Modal
        open={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingCoupon(null);
        }}
        title={editingCoupon ? "Edit Coupon" : "Add New Coupon"}
      >
        <CouponForm
          mode={editingCoupon ? "edit" : "create"}
          brandId={brandId}
          initial={editingCoupon ?? undefined}
          onSuccess={handleSuccess}
          onCancel={() => {
            setModalOpen(false);
            setEditingCoupon(null);
          }}
          showToast={showToast}
        />
      </Modal>

      <ConfirmDialog
        open={Boolean(deleteTarget)}
        title="Delete coupon?"
        message={`This will permanently remove "${deleteTarget?.title ?? ""}". This can't be undone.`}
        busy={deleting}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
      />
    </div>
  );
}
