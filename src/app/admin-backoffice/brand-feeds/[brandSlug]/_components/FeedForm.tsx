"use client";

import { useState } from "react";
import { createFeed, updateFeed } from "@/lib/admin/brand-feeds-api";
import type { BrandFeed } from "@/lib/types/admin";
import { ImageUploadField } from "./ImageUploadField";
import styles from "../../brand-feeds.module.css";

interface FeedFormProps {
  mode: "create" | "edit";
  brandId: string;
  initial?: BrandFeed;
  onSuccess: (feed: BrandFeed, mode: "create" | "edit") => void;
  onCancel: () => void;
  showToast: (variant: "success" | "error", message: string) => void;
}

export function FeedForm({ mode, brandId, initial, onSuccess, onCancel, showToast }: FeedFormProps) {
  const [title, setTitle] = useState(initial?.title ?? "");
  const [subtitle, setSubtitle] = useState(initial?.subtitle ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [imagePreview, setImagePreview] = useState(initial?.image ?? "");
  const [imageError, setImageError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    try {
      setSubmitting(true);
      const feed =
        mode === "edit" && initial
          ? await updateFeed({
              id: initial.id,
              title,
              subtitle: subtitle || undefined,
              description,
              image: imagePreview || undefined,
            })
          : await createFeed({
              brandId,
              title,
              subtitle: subtitle || undefined,
              description,
              image: imagePreview || undefined,
            });

      onSuccess(feed, mode);
    } catch (error) {
      showToast("error", error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.formGroup}>
        <label htmlFor="feed-title" className={styles.formLabel}>
          Title *
        </label>
        <input
          id="feed-title"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g., Big Billion Days Sale"
          required
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="feed-subtitle" className={styles.formLabel}>
          Subtitle
        </label>
        <input
          id="feed-subtitle"
          type="text"
          value={subtitle}
          onChange={(e) => setSubtitle(e.target.value)}
          placeholder="e.g., 80% off on all categories"
          className={styles.formInput}
        />
      </div>

      <div className={styles.formGroup}>
        <label htmlFor="feed-description" className={styles.formLabel}>
          Description *
        </label>
        <textarea
          id="feed-description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Describe this feed post…"
          required
          className={styles.formTextarea}
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
          {submitting ? "Saving…" : mode === "edit" ? "Save Changes" : "Save Feed"}
        </button>
      </div>
    </form>
  );
}
