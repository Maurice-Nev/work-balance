import { AdminDashboard } from "@/features/(admin-only)/dashboard/pages/adminDashboard";
import AdminLayout from "@/components/general/adminLayout/adminLayout";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import {
  getAverageStressPerDepartment,
  getHighStressDepartments,
  getStressChangesOverTime,
} from "@/actions/departmentAnalyticsAction";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Home() {
  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["getHighStressDepartments"],
    queryFn: getHighStressDepartments,
  });
  await queryClient.prefetchQuery({
    queryKey: ["getStressChangesOverTime", "8_weeks"],
    queryFn: async () => await getStressChangesOverTime("8_weeks"),
  });
  await queryClient.prefetchQuery({
    queryKey: ["getAverageStressPerDepartment"],
    queryFn: getAverageStressPerDepartment,
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <AdminLayout>
        <AdminDashboard />
      </AdminLayout>
    </HydrationBoundary>
  );
}
