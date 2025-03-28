"use client";
import { useGetAllUsers } from "@/hooks/useUser";
import React from "react";
import { UserTable } from "../components/dataTable";

export default function TeamPage() {
  const { data: userData, isLoading } = useGetAllUsers();

  return (
    <div className="h-screen-minus-header flex py-8 flex-col gap-8">
      {/* <span>teamPage</span> */}
      <UserTable data={userData ?? []} />
      {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
    </div>
  );
}
