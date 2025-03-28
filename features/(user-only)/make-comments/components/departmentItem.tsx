"use client";
import { Button } from "@/components/ui/button";
import { DepartmentWithRatings } from "@/supabase/types/database.models";
import { Star } from "lucide-react";
import React from "react";
import { CommentModal } from "../forms/commentModal";

interface DepartmentItemProps {
  department: DepartmentWithRatings;
  index: number;
}

export const DepartmentItem = ({ department, index }: DepartmentItemProps) => {
  function calculateAvgRating({
    department,
  }: {
    department: DepartmentWithRatings;
  }): number {
    const ratings = department.rating.filter(
      (rating) => rating.rating !== null
    ); // Filtere null-Werte aus
    const totalRating = ratings.reduce(
      (sum, rating) => sum + (rating.rating || 0),
      0
    ); // Falls rating.rating null ist, benutze 0
    const avgRating = totalRating / ratings.length;
    return Math.round(avgRating * 100) / 100;
  }

  const avgRating = calculateAvgRating({
    department: department as DepartmentWithRatings,
  });
  const stars = Array.from({ length: Math.round(avgRating) }, (_, index) => (
    <Star className="fill-foreground" key={index} />
  ));

  return (
    <div
      className="border aspect-video pb-3 rounded-lg px-0 text-lg"
      key={index}
    >
      <div className="grid justify-items-stretch grid-cols-1 grid-rows-3 w-full h-full">
        <div className="border-b h-10 flex items-center">
          <span className="py-2 px-3">{department.name}</span>
        </div>
        <div className="">
          <div className="flex gap-4 px-3 items-center justify-between">
            <div className="flex items-center gap-4">{stars}</div> {avgRating}
          </div>
        </div>
        <div className="flex items-end justify-end px-3">
          <CommentModal department_id={department.id} />
        </div>
      </div>
    </div>
  );
};
