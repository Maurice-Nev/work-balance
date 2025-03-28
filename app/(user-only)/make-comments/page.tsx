// "use server";

import { getAllDepartmentsAction } from "@/actions/departmentAction";
import UserLayout from "@/components/general/userLayout/userLayout";
import { MakeCommentsPage } from "@/features/(user-only)/make-comments/pages/make-comments-page";
import { getSelf } from "@/hooks/useAuth";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
// import { headers } from "next/headers";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Page() {
  // const headerList = await headers();

  // const userRole = headerList.get("X-User-Role") || "Guest";

  // const adminDashboardRoles = ["Admin", "Superadmin"];
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getAllDepartments"],
    queryFn: getAllDepartmentsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <UserLayout>
        <MakeCommentsPage />
      </UserLayout>
    </HydrationBoundary>
  );
  // return <div>test</div>;
}
