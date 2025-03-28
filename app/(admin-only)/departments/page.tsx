// server only
// "use server";

// ✅ Next.js Static Settings
export const dynamic = "force-static";
export const revalidate = 30;

import AdminLayout from "@/components/general/adminLayout/adminLayout";
import { headers } from "next/headers";
import { getAllDepartmentsAction } from "@/actions/departmentAction";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import DepartmentPage from "@/features/(admin-only)/department/pages/departmentPage";

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
        <DepartmentPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
