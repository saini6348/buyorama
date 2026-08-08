"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import adminStyles from "../../admin.module.css";
import styles from "../brand-feeds.module.css";
import { loadBrandBySlug, loadCoupons, loadFeeds } from "@/lib/admin/brand-feeds-api";
import type { AdminUser, Brand, BrandCoupon, BrandFeed } from "@/lib/types/admin";
import { ChevronLeftIcon } from "@/components/ui/icons";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { Tabs, type TabKey } from "./_components/Tabs";
import { CouponsPanel } from "./_components/CouponsPanel";
import { FeedsPanel } from "./_components/FeedsPanel";
import { Toast, type ToastState } from "./_components/Toast";

interface BrandFeedsPageProps {
  params: Promise<{ brandSlug: string }>;
}

export default function BrandFeedsPage({ params }: BrandFeedsPageProps) {
  const { brandSlug } = use(params);
  const router = useRouter();

  const [user, setUser] = useState<AdminUser | null>(null);
  const [authChecked, setAuthChecked] = useState(false);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    const userData = localStorage.getItem("user");

    if (!authToken) {
      router.push("/admin-backoffice");
      return;
    }

    if (userData) {
      // Reading the session out of localStorage has to happen post-hydration (it doesn't
      // exist during SSR), and the authChecked gate below already keeps the first paint
      // identical on server and client, so this doesn't cause the cascading-render the
      // rule is guarding against.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUser(JSON.parse(userData));
    }

    setAuthChecked(true);
  }, [router]);

  const [brand, setBrand] = useState<Brand | null>(null);
  const [brandLoading, setBrandLoading] = useState(true);
  const [brandNotFound, setBrandNotFound] = useState(false);

  useEffect(() => {
    if (!authChecked) return;
    let ignore = false;

    loadBrandBySlug(brandSlug)
      .then((found) => {
        if (ignore) return;
        if (found) {
          setBrand(found);
        } else {
          setBrandNotFound(true);
        }
      })
      .catch((error) => {
        console.error("Error resolving brand:", error);
        if (!ignore) setBrandNotFound(true);
      })
      .finally(() => {
        if (!ignore) setBrandLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [authChecked, brandSlug]);

  const [coupons, setCoupons] = useState<BrandCoupon[]>([]);
  const [feeds, setFeeds] = useState<BrandFeed[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    if (!brand) return;
    let ignore = false;

    Promise.all([loadCoupons(brand.id), loadFeeds(brand.id)])
      .then(([couponList, feedList]) => {
        if (ignore) return;
        setCoupons(couponList);
        setFeeds(feedList);
      })
      .catch((error) => console.error("Error loading coupons/feeds:", error))
      .finally(() => {
        if (!ignore) setDataLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, [brand]);

  const [activeTab, setActiveTab] = useState<TabKey>("coupons");
  const [toast, setToast] = useState<ToastState | null>(null);
  const showToast = (variant: "success" | "error", message: string) => {
    setToast({ id: Date.now(), variant, message });
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("user");
    router.push("/admin-backoffice");
  };

  if (!authChecked || brandLoading) {
    return (
      <div className={adminStyles.loadingContainer}>
        <div className={adminStyles.spinner}></div>
        <p>Loading...</p>
      </div>
    );
  }

  if (brandNotFound || !brand) {
    return (
      <div className={adminStyles.container}>
        <AdminHeader user={user} onLogout={handleLogout} />
        <div className={styles.notFoundWrap}>
          <h2>Brand not found</h2>
          <p>We couldn&apos;t find a brand matching this URL.</p>
          <Link href="/admin-backoffice/brands" className={styles.btnPrimary}>
            Back to Brands
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={adminStyles.container}>
      <AdminHeader user={user} onLogout={handleLogout} />

      <div className={adminStyles.mainContent}>
        <div className={styles.breadcrumbs}>
          <Link href="/admin-backoffice/brands" className={styles.breadcrumbLink}>
            <ChevronLeftIcon width={14} height={14} />
            Brands
          </Link>
          <span className={styles.breadcrumbSep}>/</span>
          <span className={styles.breadcrumbCurrent}>{brand.brandName}</span>
        </div>

        <div className={styles.heroPanel}>
          {brand.logo ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={brand.logo} alt={brand.brandName} className={styles.heroLogo} />
          ) : (
            <div className={styles.heroInitial}>{brand.brandName.charAt(0).toUpperCase()}</div>
          )}
          <div>
            <h1 className={styles.heroTitle}>{brand.brandName}</h1>
            <p className={styles.heroSlug}>/{brand.slug}</p>
          </div>
        </div>

        <div className={styles.tabsRow}>
          <Tabs active={activeTab} onChange={setActiveTab} couponCount={coupons.length} feedCount={feeds.length} />
        </div>

        {activeTab === "coupons" ? (
          <CouponsPanel
            brandId={brand.id}
            coupons={coupons}
            loading={dataLoading}
            onCouponsChange={setCoupons}
            showToast={showToast}
          />
        ) : (
          <FeedsPanel
            brandId={brand.id}
            feeds={feeds}
            loading={dataLoading}
            onFeedsChange={setFeeds}
            showToast={showToast}
          />
        )}
      </div>

      <footer className={adminStyles.footer}>
        <p>&copy; 2026 Buyorama Admin Panel. All rights reserved.</p>
      </footer>

      <Toast toast={toast} onDismiss={() => setToast(null)} />
    </div>
  );
}
