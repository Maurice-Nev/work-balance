"use client";

import { useGetAllDepartments } from "@/hooks/useDepartment";
import { DepartmentWithRatings } from "@/supabase/types/database.models";
import React from "react";
import { DepartmentGrid } from "../components/departmentGrid";
import { StressComponent } from "../../stressTracking/components/stress";
import { getSelf } from "@/hooks/useAuth";

export const MakeCommentsPage = () => {
  const { data: departments, error, isLoading } = useGetAllDepartments();

  return (
    <div>
      <StressComponent />
      <DepartmentGrid departments={departments as DepartmentWithRatings[]} />
    </div>
  );
};
