"use client";
import { useGetAllUsers } from "@/hooks/useUser";
import React from "react";
import { CommentTable } from "../components/dataTable";
import { useGetAllRatings } from "@/hooks/useRating";
import { Rating } from "@/supabase/types/database.models";

export default function CommentPage() {
  const { data: CommentData, isLoading } = useGetAllRatings();

  return (
    <div className="h-screen-minus-header flex py-8 flex-col gap-8">
      {/* <span>teamPage</span> */}
      <CommentTable data={CommentData ?? []} />
      {/* <pre>{JSON.stringify(userData, null, 2)}</pre> */}
    </div>
  );
}
