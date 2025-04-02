"use client";

import { Badge } from "@/components/ui/badge";
import { Period } from "@/hooks/useDepartmentAnalytics";
import { useGetRatingsForDepartment } from "@/hooks/useRating";
import { Divide, Loader } from "lucide-react";
import React from "react";

interface CommentsListProps {
  departmentId: string;
  period?: Period;
}

export function CommentsList({ departmentId, period }: CommentsListProps) {
  const { data: comments } = useGetRatingsForDepartment({
    department_id: departmentId,
    period: period,
  });

  return (
    <div className="h-52 w-full overflow-y-auto overflow-x-hidden rounded-xl ">
      {/* <pre>{JSON.stringify(comments, null, 2)}</pre> */}

      {comments?.map((item, index) => {
        return (
          <div
            key={index}
            className="flex justify-between p-4 border-b last:border-b-0 hover:bg-accent"
          >
            <div className="flex gap-4">
              <Badge variant={"outline"}> {item.rating} </Badge>
              {item.comment}{" "}
            </div>
            <div>{new Date(item.created_at).toDateString()}</div>
          </div>
        );
      })}
    </div>
  );
}
