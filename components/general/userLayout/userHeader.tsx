"use client"; // Diese Komponente muss im Client laufen

import { SidebarTrigger } from "@/components/ui/sidebar";
import React from "react";
import { ModeToggle } from "../modeToggle";
import { LogoutButton } from "@/features/auth/components/logoutButton";
import { Separator } from "@/components/ui/separator";
import { usePathname } from "next/navigation"; // ✅ Statt useRouter
import {
  BarChartIcon,
  FolderIcon,
  LayoutDashboardIcon,
  ListIcon,
  UsersIcon,
} from "lucide-react";
import { getSelf } from "@/hooks/useAuth";

// Deine Links mit Titeln
const links = [
  { title: "Welcome", url: "/", icon: LayoutDashboardIcon },
  { title: "Comment", url: "/make-comments", icon: ListIcon },
  // { title: "Analytics", url: "/analytics", icon: BarChartIcon },
  // { title: "Comments", url: "/comments", icon: FolderIcon },
  // { title: "Team", url: "/team", icon: UsersIcon },
];

export const UserHeader = () => {
  const pathname = usePathname(); // ✅ Holt den aktuellen Pfad
  const { data: user } = getSelf();
  // Finde den aktuellen Titel basierend auf der URL
  const currentPage = links.find((link) => link.url === pathname);

  return (
    <header className="w-full h-16 bg-sidebar relative border-b mb-4 flex justify-between items-center px-6">
      <div className="flex items-center md:gap-0 gap-4">
        <SidebarTrigger variant={"secondary"} className="w-10 h-10" />
        <Separator
          orientation="vertical"
          className="mx-4 md:block hidden data-[orientation=vertical]:h-6"
        />
        {/* Zeige den aktuellen Titel oder einen Fallback ("Dashboard") */}
        <span className="text-lg pl-2">
          {user?.user
            ? currentPage?.title === "Welcome"
              ? `Welcome ${user?.user?.name} ${user?.user?.surname}`
              : currentPage?.title
            : ""}
        </span>
      </div>
      <div className="flex gap-4 transition-all duration-300">
        <ModeToggle />
        <LogoutButton variant={"secondary"}>Logout</LogoutButton>
      </div>
    </header>
  );
};
