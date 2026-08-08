"use client";

import { useState } from "react";
import { createCoupon, updateCoupon } from "@/lib/admin/brand-feeds-api";
import type { BrandCoupon } from "@/lib/types/admin";
import { ImageUploadField } from "./ImageUploadField";
import styles from "../../brand-feeds.module.css";

interface CouponFormProps {
  mode: "create" | "edit";
  brandId: string;
  initial?: BrandCoupon;
  onSuccess: (coupon: BrandCoupon, mode: "create" | "edit") => void;
  onCancel: () => void;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function CouponForm({ mode, brandId, initial, onSuccess, onCancel, showToast }: CouponFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [link, setLink] = useState(initial?.link ?? "");
  const [imagePreview, setImagePreview] = useState(initial?.image ?? "");
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim() || !link.trim()) return;

    try {
      setSubmitting(true);
      const coupon =
        mode === "edit" && initial
          ? await updateCoupon({
              id: initial.id,
              title,
              description,
              link,
              image: imagePreview || undefined,
            })
          : await createCoupon({
              brandId,
              title,
              description,
              link,
              image: imagePreview || undefined,
            });

      onSuccess(coupon, mode);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="coupon-title" className={styles.formLabel}>
          Title *
        </label>
        <input
          id="coupon-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Flat 50% off on all orders"
          required
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="coupon-description" className={styles.formLabel}>
          Description *
        </label>
        <textarea
          id="coupon-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe the coupon offer…"
          required
          className={styles.formTextarea}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="coupon-link" className={styles.formLabel}>
          Link URL *
        </label>
        <input
          id="coupon-link"
          type="url"
          value={link}
          onChange={(e) => setLink(e.target.value)}
          placeholder="https://example.com/deal"
          required
          className={styles.formInput}
        />
      </div>

      <ImageUploadField
        preview={imagePreview}
        error={imageError}
        onChange={setImagePreview}
        onError={setImageError}
      />

      <div className={styles.formFooter}>
        <button type="button" onClick={onCancel} className={styles.btnSecondary} disabled={submitting}>
          Cancel
        </button>
        <button type="submit" className={styles.btnPrimary} disabled={submitting}>
          {submitting ? "Saving…" : mode === "edit" ? "Save Changes" : "Save Coupon"}
        </button>
      </div>
    </form>
  );
}
