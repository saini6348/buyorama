"use client";

import { motion } from "framer-motion";
import { PencilIcon, TrashIcon, TicketIcon } from "@/components/ui/icons";
import type { BrandCoupon } from "@/lib/types/admin";
import { resolveImageUrl } from "@/lib/admin/uploads-api";
import styles from "../../brand-feeds.module.css";

interface CouponCardProps {
  coupon: BrandCoupon;
  onEdit: () => void;
  onDelete: () => void;
}

export function CouponCard({ coupon, onEdit, onDelete }: CouponCardProps) {
  return (
    <motion.div
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
          <img src={resolveImageUrl(coupon.image)} alt={coupon.title} className={styles.couponImage} />
        ) : (
          <div className={styles.couponMediaFallback}>
            <TicketIcon width={28} height={28} />
          </div>
        )}
        <div className={styles.couponCardActions}>
          <button type="button" onClick={onEdit} aria-label="Edit coupon" className={styles.iconBtn}>
            <PencilIcon width={15} height={15} />
          </button>
          <button type="button" onClick={onDelete} aria-label="Delete coupon" className={styles.iconBtnDanger}>
            <TrashIcon width={15} height={15} />
          </button>
        </div>
      </div>
      <div className={styles.couponBody}>
        <h3 className={styles.couponTitle}>{coupon.title}</h3>
        <p className={styles.couponDescription}>{coupon.description}</p>
        <span className={styles.couponDate}>
          {new Date(coupon.createdAt).toLocaleDateString(undefined, {
            year: "numeric",
            month: "short",
            day: "numeric",
          })}
        </span>
      </div>
    </motion.div>
  );
}
