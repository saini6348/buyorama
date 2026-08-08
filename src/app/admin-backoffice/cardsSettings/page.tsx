"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import adminStyles from "../admin.module.css";
import styles from "./cardsSettings.module.css";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Toast, type ToastState } from "@/components/admin/Toast";
import { cardCategoriesApi, banksApi, tagsApi } from "@/lib/admin/cards-settings-api";
import { Tabs, type TabKey } from "./_components/Tabs";
import { LookupPanel } from "./_components/LookupPanel";
import type { AdminUser } from "@/lib/types/admin";

export default function CardsSettingsPage() {
  const router = useRouter();
  const [user, setUser] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!authToken) {
      router.push("/admin-backoffice");
      return;
    }

    if (userData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }

    setIsLoading(false);
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/admin-backoffice");
  };

  const [activeTab, setActiveTab] = useState<TabKey>("categories");
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (variant: ToastState["variant"], message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  if (isLoading) {
    return (
      <div className={adminStyles.loadingContainer}>
        <div className={adminStyles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  return (
    <div className={adminStyles.container}>
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className={adminStyles.mainContent}>
        <div className={adminStyles.pageHeader}>
          <div className={adminStyles.pageHeaderText}>
            <h1 className={adminStyles.pageTitle}>Cards Settings</h1>
            <p className={adminStyles.pageSubtitle}>
              Manage credit card categories, banks, and tags used across the site.
            </p>
          </div>
        </div>

        <div className={styles.tabsRow}>
          <Tabs active={activeTab} onChange={setActiveTab} />
        </div>

        {activeTab === "categories" ? (
          <LookupPanel
            title="Credit Card Categories"
            singularLabel="Category"
            api={cardCategoriesApi}
            showToast={showToast}
          />
        ) : activeTab === "banks" ? (
          <LookupPanel title="Banks" singularLabel="Bank" api={banksApi} showToast={showToast} />
        ) : (
          <LookupPanel title="Tags" singularLabel="Tag" api={tagsApi} showToast={showToast} />
        )}
      </div>

      <footer className={adminStyles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
