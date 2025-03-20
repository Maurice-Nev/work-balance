"use server";

import AdminLayout from "@/components/general/adminLayout/adminLayout";
import { RoleEnum } from "@/supabase/types/database.models";
import { headers } from "next/headers";
import { UserDashboard } from "@/features/dashboard/components/userDashboard";
import { DepartmentPage } from "@/features/department/pages/departmentPage";
import { getAllDepartmentsAction } from "@/actions/departmentAction";
export default async function Page() {
  const headerList = await headers();

  const userRole = headerList.get("X-User-Role") || "Guest";

  const adminDashboardRoles = ["Admin", "Superadmin"];

  const departments = await getAllDepartmentsAction();
  if (userRole && adminDashboardRoles.includes(userRole)) {
    return (
      <AdminLayout>
        {/* <UserDashboard /> */}
        <DepartmentPage initialDepartments={departments} />
      </AdminLayout>
    );
  } else {
    return <>{userRole}</>;
  }
}
