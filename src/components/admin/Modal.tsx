"use client";

import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { CloseIcon } from "@/components/ui/icons";
import styles from "@/app/admin-backoffice/admin.module.css";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
  panelClassName?: string;
}

export function Modal({ open, onClose, title, children, footer, panelClassName }: ModalProps) {
  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open ? (
        <div className={styles.modalRoot} role="dialog" aria-modal="true" aria-label={title}>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className={styles.modalBackdrop}
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: 8 }}
            transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
            className={`${styles.modalPanel} ${panelClassName ?? ""}`}
          >
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>{title}</h2>
              <button type="button" onClick={onClose} aria-label="Close dialog" className={styles.modalCloseBtn}>
                <CloseIcon width={18} height={18} />
              </button>
            </div>
            <div className={styles.modalBody}>{children}</div>
            {footer ? <div className={styles.modalFooter}>{footer}</div> : null}
          </motion.div>
        </div>
      ) : null}
    </AnimatePresence>
  );
}

