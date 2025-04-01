"use client";

import { SidebarProvider } from "../../ui/sidebar";
import { AdminSidebar } from "./adminSidebar";
import { AdminHeader } from "./adminHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ScrollToTopButton from "../scrollToTopButton";

export default function AdminLayout({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main className="w-full overflow-hidden">
        <Card className="m-4 pt-0 gap-0 overflow-hidden">
          <CardHeader className="px-0 relative">
            <AdminHeader /> {/* Header bleibt sticky */}
          </CardHeader>
          <CardContent className="h-screen-minus-header w-full overflow-y-auto overflow-x-hidden">
            {props.children}
          </CardContent>
        </Card>
        <ScrollToTopButton />
      </main>
    </SidebarProvider>
  );
}
