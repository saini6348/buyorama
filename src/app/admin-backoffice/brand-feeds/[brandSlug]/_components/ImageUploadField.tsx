"use client";

import { UploadIcon } from "@/components/ui/icons";
import styles from "../../brand-feeds.module.css";

interface ImageUploadFieldProps {
  label?: string;
  preview: string;
  error: string;
  onChange: (dataUrl: string) => void;
  onError: (message: string) => void;
}

export function ImageUploadField({
  label = "Image (Max 1MB)",
  preview,
  error,
  onChange,
  onError,
}: ImageUploadFieldProps) {
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    onError("");

    if (!file) return;

    if (file.size > 1048576) {
      onError("Image size cannot be greater than 1MB");
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
        <UploadIcon width={18} height={18} />
        <span>{preview ? "Replace image" : "Click to upload an image"}</span>
        <input type="file" accept="image/*" onChange={handleFileChange} className={styles.uploadInput} />
      </label>
      {error ? <small className={styles.fieldError}>{error}</small> : null}
    </div>
  );
}
