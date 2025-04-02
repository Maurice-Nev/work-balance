"use client";
import React, { useState } from "react";
import {
  Period,
  useGetAverageStressPerDepartment,
  useGetHighStressDepartments,
  useGetStressChangesOverTime,
} from "@/hooks/useDepartmentAnalytics";
import HighStressBarChart, {
  HighStressDataProps,
} from "../components/highStressBarChart";
import { DepartmentGrid } from "../components/departmentGrid";

export const AdminDashboard = () => {
  const [period, setPeriod] = useState<Period>("week");

  // Lade alle notwendigen Daten mit den React Query Hooks
  const { data: averageStressData, isLoading: isLoadingAverage } =
    useGetAverageStressPerDepartment({ period: "week" });
  const { data: stressChangesData, isLoading: isLoadingChanges } =
    useGetStressChangesOverTime({ period: period }); // Beispielhaft "month"
  const { data: highStressDepartments, isLoading: isLoadingHighStress } =
    useGetHighStressDepartments({ period: "8_weeks" });

  return (
    <div className="h-full overflow-hidden relative">
      <HighStressBarChart
        highStressData={highStressDepartments as HighStressDataProps[]}
      />
      <DepartmentGrid
        averageStressData={averageStressData}
        stressChangesData={stressChangesData}
        period={period}
        setPeriod={setPeriod}
      />
    </div>
  );
};
