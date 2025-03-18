"use client";

import { SidebarProvider, SidebarTrigger } from "../../ui/sidebar";
import { AdminSidebar } from "./adminSidebar";
import { AdminHeader } from "./adminHeader";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default function AdminLayout(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        {/* <SidebarTrigger className="m-4 absolute top-0  w-10 h-10" /> */}
        <Card className="m-4 pt-0 ">
          <CardHeader className="px-0">
            <CardTitle>
              <AdminHeader />
            </CardTitle>
          </CardHeader>
          <CardContent className="h-screen-minus-header flex flex-col justify-center w-full">
            {props.children}
          </CardContent>
          {/* <CardFooter>
            <p>Card Footer</p>
          </CardFooter> */}
        </Card>
      </main>
    </SidebarProvider>
  );
}
