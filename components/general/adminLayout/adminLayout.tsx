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
import ScrollToTopButton from "../scrollToTopButton";

export default function AdminLayout(
  props: React.HTMLAttributes<HTMLDivElement>
) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full">
        {/* <SidebarTrigger className="m-4 absolute top-0  w-10 h-10" /> */}
        <Card className="m-4 pt-0 gap-0">
          <CardHeader className="px-0 relative">
            <AdminHeader /> {/* Header bleibt sticky */}
          </CardHeader>
          <CardContent className="h-screen-minus-header w-full overflow-auto">
            {props.children}
          </CardContent>
        </Card>
        <ScrollToTopButton />
      </main>
    </SidebarProvider>
  );
}
