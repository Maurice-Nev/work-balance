"use server";

import UserLayout from "@/components/general/userLayout/userLayout";
// import { headers } from "next/headers";
export default async function Page() {
  // const headerList = await headers();

  // const userRole = headerList.get("X-User-Role") || "Guest";

  // const adminDashboardRoles = ["Admin", "Superadmin"];

  return <UserLayout>test</UserLayout>;
  // return <div>test</div>;
}
