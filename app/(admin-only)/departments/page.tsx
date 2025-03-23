"use server";

import AdminLayout from "@/components/general/adminLayout/adminLayout";
import { RoleEnum } from "@/supabase/types/database.models";
import { headers } from "next/headers";
import { UserDashboard } from "@/features/dashboard/components/userDashboard";
import DepartmentPage from "@/features/department/pages/departmentPage";
import { getAllDepartmentsAction } from "@/actions/departmentAction";
import { validateUserSession } from "@/actions/authAction";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Page() {
  const headerList = await headers();
  const userRole = headerList.get("X-User-Role") || "Guest";

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getAllDepartments"],
    queryFn: getAllDepartmentsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        {/* <UserDashboard /> */}
        <DepartmentPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
