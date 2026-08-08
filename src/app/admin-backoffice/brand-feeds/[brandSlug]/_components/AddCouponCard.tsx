"use client";

import { motion } from "framer-motion";
import { PlusIcon } from "@/components/ui/icons";
import styles from "../../brand-feeds.module.css";

interface AddCouponCardProps {
  onClick: () => void;
}

export function AddCouponCard({ onClick }: AddCouponCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.97 }}
      transition={{ duration: 0.18 }}
      className={styles.addCouponCard}
    >
      <span className={styles.addCouponIcon}>
        <PlusIcon width={26} height={26} />
      </span>
      <span className={styles.addCouponLabel}>Add Coupon</span>
    </motion.button>
  );
}
