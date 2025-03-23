// "use server";

import AdminLayout from "@/components/general/adminLayout/adminLayout";
// import { RoleEnum } from "@/supabase/types/database.models";
// import { headers } from "next/headers";
// import { UserDashboard } from "@/features/dashboard/components/userDashboard";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import { getAllRatingsAction } from "@/actions/ratingAction";
import CommentPage from "@/features/comments/pages/commentPage";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Home() {
  // const headerList = await headers();

  // const userRole = headerList.get("X-User-Role") || "Guest";

  // const adminDashboardRoles = ["Admin", "Superadmin"];

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getAllRatings"],
    queryFn: getAllRatingsAction,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        <CommentPage />
      </AdminLayout>
    </HydrationBoundary>
  );
}
