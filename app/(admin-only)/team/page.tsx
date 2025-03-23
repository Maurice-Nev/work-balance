// "use server";

import AdminLayout from "@/components/general/adminLayout/adminLayout";
import { headers } from "next/headers";
import TeamPage from "@/features/team/pages/teamPage";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllUsersAction } from "@/actions/userAction";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Home() {
  const headerList = await headers();

  const userRole = headerList.get("X-User-Role") || "Guest";

  const adminDashboardRoles = ["Admin", "Superadmin"];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getAllUsers"],
    queryFn: getAllUsersAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        <TeamPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
