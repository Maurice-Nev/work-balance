"use client";
import React from "react";
import {
  useGetAverageStressPerDepartment,
  useGetHighStressDepartments,
  useGetStressChangesOverTime,
} from "@/hooks/useDepartmentAnalytics";
import HighStressBarChart, {
  HighStressDataProps,
} from "../components/highStressBarChart";

export const AdminDashboard = () => {
  // Lade alle notwendigen Daten mit den React Query Hooks
  const { data: averageStressData, isLoading: isLoadingAverage } =
    useGetAverageStressPerDepartment();
  const { data: stressChangesData, isLoading: isLoadingChanges } =
    useGetStressChangesOverTime({ period: "8_weeks" as const }); // Beispielhaft "month"
  const { data: highStressDepartments, isLoading: isLoadingHighStress } =
    useGetHighStressDepartments();

  return (
    <div className="h-full overflow-hidden relative">
      <HighStressBarChart
        highStressData={highStressDepartments as HighStressDataProps[]}
      />
    </div>
  );
};
