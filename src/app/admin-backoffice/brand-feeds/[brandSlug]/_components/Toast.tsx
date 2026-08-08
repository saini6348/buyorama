"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CheckIcon, CloseIcon } from "@/components/ui/icons";
import styles from "../../brand-feeds.module.css";

export interface ToastState {
  id: number;
  variant: "success" | "error";
  message: string;
}

interface ToastProps {
  toast: ToastState | null;
  onDismiss: () => void;
}

export function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(onDismiss, 3500);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  return (
    <div className={styles.toastRoot}>
      <AnimatePresence>
        {toast ? (
          <motion.div
            key={toast.id}
            initial={{ opacity: 0, y: -16, x: 24 }}
            animate={{ opacity: 1, y: 0, x: 0 }}
            exit={{ opacity: 0, y: -12, x: 24 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.toast} ${toast.variant === "error" ? styles.toastError : styles.toastSuccess}`}
            role="status"
          >
            <span className={styles.toastIcon}>
              {toast.variant === "success" ? <CheckIcon width={16} height={16} /> : <CloseIcon width={16} height={16} />}
            </span>
            <span>{toast.message}</span>
            <button type="button" onClick={onDismiss} aria-label="Dismiss notification" className={styles.toastDismiss}>
              <CloseIcon width={14} height={14} />
            </button>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </div>
  );
}
