import { getAllDepartmentsAction } from "@/actions/departmentAction";
import UserLayout from "@/components/general/userLayout/userLayout";
import { MakeCommentsPage } from "@/features/(user-only)/make-comments/pages/make-comments-page";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Page() {
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
}
