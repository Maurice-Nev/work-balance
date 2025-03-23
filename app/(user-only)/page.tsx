"use server";

import AdminLayout from "@/components/general/userLayout/userLayout";
import { headers } from "next/headers";
export default async function Home() {
  const headerList = await headers();

  const userRole = headerList.get("X-User-Role") || "Guest";

  const adminDashboardRoles = ["Admin", "Superadmin"];

  return <AdminLayout>{userRole}</AdminLayout>;
}
