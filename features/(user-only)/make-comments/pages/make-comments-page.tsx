"use client";

import { useGetAllDepartments } from "@/hooks/department";
import { DepartmentWithRatings } from "@/supabase/types/database.models";
import React from "react";
import { DepartmentGrid } from "../components/departmentGrid";
import { Stress } from "../../dashboard/components/stress";

export const MakeCommentsPage = () => {
  const { data: departments, error, isLoading } = useGetAllDepartments();

  return (
    <div>
      <Stress />
      <DepartmentGrid departments={departments as DepartmentWithRatings[]} />
    </div>
  );
};
