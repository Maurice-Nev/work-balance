"use client";

import * as React from "react";
import {
  FolderIcon,
  GalleryVerticalEnd,
  ListIcon,
  UsersIcon,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { NavUser } from "./navUser";
import { getSelf } from "@/hooks/useAuth";
import { NavMain } from "./navMain";
import Link from "next/link";

let data = {
  user: {
    name: `shadcn`,
    email: "e@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navMain: [
    {
      title: "Departments",
      url: "/departments",
      icon: ListIcon,
    },
    {
      title: "Comments",
      url: "/comments",
      icon: FolderIcon,
    },
    {
      title: "Team",
      url: "/team",
      icon: UsersIcon,
    },
  ],
};

export function AdminSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const { data: userData } = getSelf();

  if (userData?.user) {
    data = {
      ...data,
      user: {
        name: `${userData?.user?.name} ${userData?.user?.surname}`,
        email: userData?.user?.email as string,
        avatar: "/avatars/shadcn.jpg",
      },
    };
  }
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link
                href="#"
                className="flex items-center gap-2 self-center mt-5 h-10 font-medium"
              >
                <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
                  <GalleryVerticalEnd className="size-4" />
                </div>
                <span className="text-lg font-semibold">Roccomedia</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
