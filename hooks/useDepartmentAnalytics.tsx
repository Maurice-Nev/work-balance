"use client";
import {
  getAverageStressPerDepartment,
  getHighStressDepartments,
  getStressChangesOverTime,
} from "@/actions/departmentAnalyticsAction";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

type Period = "week" | "month" | "8_weeks";

export const useGetAverageStressPerDepartment = () => {
  const queryKey = useMemo(() => "getAverageStressPerDepartment", []);

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getAverageStressPerDepartment();
    }, []),
    staleTime: 1000 * 30, // Cache for 30 seconds
  });

  return query;
};

export const useGetHighStressDepartments = () => {
  const queryKey = useMemo(() => "getHighStressDepartments", []);

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getHighStressDepartments();
    }, []),
    staleTime: 1000 * 30, // Cache for 30 seconds
  });

  return query;
};

export const useGetStressChangesOverTime = ({ period }: { period: Period }) => {
  const queryKey = useMemo(
    () => ["getStressChangesOverTime", period],
    [period]
  );

  const query = useQuery({
    queryKey: queryKey,
    queryFn: useCallback(async () => {
      return await getStressChangesOverTime(period);
    }, [period]),
    staleTime: 1000 * 30, // Cache for 30 seconds
  });

  return query;
};
