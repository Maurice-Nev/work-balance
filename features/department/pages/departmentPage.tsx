"use client";
import { DataTable } from "@/features/department/components/dataTable";
import React, { useEffect, useState } from "react";
import data from "./data.json";
import DepartmentForm from "../forms/departmentForm";
import { DepartmentModal } from "../components/departmentModal";
import { useGetAllDepartments } from "@/hooks/department";

export interface DepartmentPageProps {
  initialDepartments?: Array<{
    id: string;
    name: string | null;
    created_at: string;
    rating: Array<{
      id: string;
      rating: number | null;
      comment: string | null;
      created_at: string;
    }>;
  }>;
}

export const DepartmentPage = ({ initialDepartments }: DepartmentPageProps) => {
  const { data: departments, isLoading } = useGetAllDepartments({
    initialDepartments,
  });

  return (
    <div className="h-screen-minus-header pt-8 items-center">
      {/* {departments && JSON.stringify(departments[0], null, 2)} */}
      {departments && departments?.length > 0 && (
        <DataTable
          data={
            departments as Array<{
              id: string;
              name: string | null;
              created_at: string;
              rating: Array<{
                id: string;
                rating: number | null;
                comment: string | null;
                created_at: string;
              }>;
            }>
          }
        />
      )}
    </div>
  );
};

export default DepartmentPage;
