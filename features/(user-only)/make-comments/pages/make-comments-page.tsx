"use client";

import { useGetAllDepartments } from "@/hooks/department";
import { DepartmentWithRatings } from "@/supabase/types/database.models";
import React from "react";
import { DepartmentGrid } from "../components/departmentGrid";

export const MakeCommentsPage = () => {
  const { data: departments, error, isLoading } = useGetAllDepartments();

  return (
    <div>
      <DepartmentGrid departments={departments as DepartmentWithRatings[]} />
    </div>
  );
};
