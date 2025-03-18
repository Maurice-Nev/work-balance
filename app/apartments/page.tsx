"use server";

import AdminLayout from "@/components/general/adminLayout/adminLayout";
import { RoleEnum } from "@/supabase/types/database.models";
import { headers } from "next/headers";
import { UserDashboard } from "@/features/dashboard/components/userDashboard";
export default async function Home() {
  const headerList = await headers();

  const userRole = headerList.get("X-User-Role") || "Guest";

  const adminDashboardRoles = ["Admin", "Superadmin"];

  if (userRole && adminDashboardRoles.includes(userRole)) {
    return (
      <AdminLayout>
        <UserDashboard />
      </AdminLayout>
    );
  } else {
    return <>{userRole}</>;
  }
}
