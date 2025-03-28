// "use server";

import UserLayout from "@/components/general/userLayout/userLayout";
import { DashboardPage } from "@/features/(user-only)/dashboard/pages/dashboard";

export const dynamic = "force-static";
export const revalidate = 30;

export default async function Home() {
  return (
    <UserLayout>
      <DashboardPage />
    </UserLayout>
  );
}
