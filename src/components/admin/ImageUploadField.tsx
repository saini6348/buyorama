"use client";

import { useState } from "react";
import { ImageIcon, UploadIcon, TrashIcon } from "@/components/ui/icons";
import { ConfirmDialog } from "@/components/admin/ConfirmDialog";
import { uploadImage, deleteUploadedImage, resolveImageUrl } from "@/lib/admin/uploads-api";
import styles from "@/app/admin-backoffice/admin.module.css";

interface ImageUploadFieldProps {
  label?: string;
  /** The current image URL (e.g. "/uploads/xxx.png") or empty string. */
  preview: string;
  error: string;
  maxSizeBytes?: number;
  onChange: (value: string) => void;
  onError: (message: string) => void;
}

export function ImageUploadField({
  label = "Image (Max 1MB)",
  preview,
  error,
  maxSizeBytes = 1048576,
  onChange,
  onError,
}: ImageUploadFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onError("");

    // Allow re-selecting the same file after a change/error.
    e.target.value = "";

    if (!file) return;

    if (file.size > maxSizeBytes) {
      onError(`Image size cannot be greater than ${Math.round(maxSizeBytes / 1024 / 1024) || 1}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }

    try {
      setUploading(true);
      // Read the file locally, then upload it to the server /uploads folder.
      const dataUrl = await new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Could not read the selected file"));
        reader.readAsDataURL(file);
      });

      if (!dataUrl) throw new Error("Could not read the selected file");

      const url = await uploadImage(dataUrl);
      onChange(url);
      onError("");
    } catch (err) {
      onError(err instanceof Error ? err.message : "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleConfirmDelete = async () => {
    try {
      setDeleting(true);
      // Delete the file from the /uploads folder on the server.
      await deleteUploadedImage(preview);
      onChange("");
      setConfirmDelete(false);
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete image");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>

      {/* Small preview card with a delete (X) button in the top-right corner */}
      {preview ? (
        <div className={styles.uploadedCard}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={resolveImageUrl(preview)} alt="Preview" className={styles.uploadedCardImg} />
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            className={styles.uploadedCardDelete}
            aria-label="Remove image"
            title="Remove image"
            disabled={deleting}
          >
            <TrashIcon width={14} height={14} />
          </button>
        </div>
      ) : null}

      <label className={styles.uploadDropzone}>
        {uploading ? (
          <span className={styles.uploadSpinner} aria-hidden="true" />
        ) : preview ? (
          <UploadIcon width={18} height={18} />
        ) : (
          <ImageIcon width={18} height={18} />
        )}
        <span>
          {uploading
            ? "Uploading…"
            : preview
              ? "Replace image"
              : "Click to upload an image"}
        </span>
        <input
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className={styles.uploadInput}
          disabled={uploading}
        />
      </label>

      {error ? <small className={styles.fieldError}>{error}</small> : null}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete image?"
        message="Are you sure you want to delete this image? This will permanently remove it from the uploads folder."
        confirmLabel="Delete"
        busy={deleting}
        onConfirm={handleConfirmDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}
