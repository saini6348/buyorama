"use client";

import { ImageIcon, UploadIcon } from "@/components/ui/icons";
import styles from "@/app/admin-backoffice/admin.module.css";

interface ImageUploadFieldProps {
  label?: string;
  preview: string;
  error: string;
  maxSizeBytes?: number;
  onChange: (dataUrl: string) => void;
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
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onError("");

    if (!file) return;

    if (file.size > maxSizeBytes) {
      onError(`Image size cannot be greater than ${Math.round(maxSizeBytes / 1024 / 1024) || 1}MB`);
      return;
    }

    if (!file.type.startsWith("image/")) {
      onError("Please select a valid image file");
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      onChange(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  return (
    <div className={styles.formGroup}>
      <label className={styles.formLabel}>{label}</label>
      {preview ? (
        <div className={styles.imagePreviewWrap}>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={preview} alt="Preview" className={styles.imagePreview} />
        </div>
      ) : null}
      <label className={styles.uploadDropzone}>
        {preview ? <UploadIcon width={18} height={18} /> : <ImageIcon width={18} height={18} />}
        <span>{preview ? "Replace image" : "Click to upload an image"}</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.uploadInput} />
      </label>
      {error ? <small className={styles.fieldError}>{error}</small> : null}
    </div>
  );
}
