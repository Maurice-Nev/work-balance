"use client";

import { SidebarProvider } from "../../ui/sidebar";
import { UserSidebar } from "./userSidebar";
import { UserHeader } from "./userHeader";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import ScrollToTopButton from "../scrollToTopButton";

export default function UserLayout({
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <SidebarProvider>
      <UserSidebar />
      <main className="w-full">
        <Card className="mx-4 mt-4 pt-0 gap-0 overflow-hidden">
          <CardHeader className="px-0 relative">
            <UserHeader /> {/* Header bleibt sticky */}
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
