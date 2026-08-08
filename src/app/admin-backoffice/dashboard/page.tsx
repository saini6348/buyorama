"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const router = useRouter();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");

    if (!authToken) {
      router.push("/admin-backoffice");
      return;
    }

    router.push("/admin-backoffice/brands");
  }, [router]);

  return null;
}
