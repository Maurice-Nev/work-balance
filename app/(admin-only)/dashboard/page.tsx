"use server";

import { headers } from "next/headers";
import { UserDashboard } from "@/features/dashboard/components/userDashboard";
import { AdminDashboard } from "@/features/dashboard/pages/adminDashboard";
import UserLayout from "@/components/general/userLayout/userLayout";
import AdminLayout from "@/components/general/adminLayout/adminLayout";
export default async function Home() {
  const headerList = await headers();

  const userRole = headerList.get("X-User-Role") || "Guest";

  const adminDashboardRoles = ["Admin", "Superadmin"];

  return (
    <AdminLayout>
      <AdminDashboard />
    </AdminLayout>
  );
}
