"use client";
import {
  getAverageStressPerDepartment,
  getHighStressDepartments,
  getStressChangesOverTime,
} from "@/actions/departmentAnalyticsAction";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useCallback } from "react";

export type Period = "week" | "month" | "8_weeks";

export const useGetAverageStressPerDepartment = ({
  period,
}: {
  period: Period;
}) => {
  const queryKey = useMemo(
    () => ["getAverageStressPerDepartment", period],
    [period]
  );
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getAverageStressPerDepartment(period);
    }, []),
    staleTime: 1000 * 30, // Cache for 30 seconds
  });

  return query;
};

export const useGetHighStressDepartments = ({ period }: { period: Period }) => {
  const queryKey = useMemo(
    () => ["getHighStressDepartments", period],
    [period]
  );
  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getHighStressDepartments(period);
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
