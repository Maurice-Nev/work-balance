"use client";

import React from "react";
import { ModeToggle } from "../modeToggle";
import { LogoutButton } from "@/features/auth/components/logoutButton";
import { Separator } from "@/components/ui/separator";
import { GalleryVerticalEnd } from "lucide-react";
import { getSelf } from "@/hooks/useAuth";
import Link from "next/link";

export const UserHeader = () => {
  const { data: user } = getSelf();

  return (
    <header className="w-full h-16 bg-sidebar relative border-b mb-4 flex justify-between items-center px-6">
      <div className="flex items-center md:gap-0 gap-4">
        <Link
          href="#"
          className="flex items-center gap-2 self-center font-medium"
        >
          <div className="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <GalleryVerticalEnd className="size-4" />
          </div>
          <span className="text-lg font-semibold">Roccomedia</span>
        </Link>
        <Separator
          orientation="vertical"
          className="mx-4 md:block hidden data-[orientation=vertical]:h-6"
        />
        <span className="text-lg pl-2">
          Welcome {user?.user?.name} {user?.user?.surname}
        </span>
      </div>
      <div className="flex gap-4 transition-all duration-300">
        <ModeToggle />
        <LogoutButton variant={"secondary"}>Logout</LogoutButton>
      </div>
    </header>
  );
};
