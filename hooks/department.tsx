"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  getAllDepartmentsAction,
  getDepartmentAction,
  updateDepartmentAction,
} from "@/actions/departmentAction";
import {
  Department,
  NewDepartment,
  UpdateDepartment,
} from "@/supabase/types/database.models";
import { DepartmentPageProps } from "@/features/department/pages/departmentPage";
import { useCallback, useMemo } from "react";

export const useGetDepartment = ({
  department_id,
}: {
  department_id: string;
}) => {
  const query = useQuery({
    queryKey: ["getDepartment", department_id],
    queryFn: async () => {
      const department: Department = await getDepartmentAction({
        department_id,
      });
      return department;
    },
    enabled: !!department_id, // Nur ausführen, wenn `department_id` vorhanden ist
  });
  return query;
};

export const useGetAllDepartments = ({
  initialDepartments,
}: DepartmentPageProps) => {
  const queryKey = useMemo(() => "getAllDepartments", []);
  const query = useQuery({
    initialData: initialDepartments,
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      const departments: Department[] = await getAllDepartmentsAction();
      return departments;
    }, []),
  });
  return query;
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newDepartment: NewDepartment) => {
      const test = await createDepartmentAction(newDepartment);
      window.location.reload();
      return test;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllDepartments"] }); // Aktualisiert den Cache
    },
  });
  return mutation;
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => "getAllDepartments", []);

  const mutation = useMutation({
    mutationFn: useCallback(
      async ({
        department_id,
        updates,
      }: {
        department_id: string;
        updates: UpdateDepartment;
      }) => {
        const test = await updateDepartmentAction(department_id, updates);
        queryClient.invalidateQueries({
          queryKey: [queryKey],
        });
        return test;
      },
      []
    ),
  });
  return mutation;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => "getAllDepartments", []);

  const mutation = useMutation({
    mutationFn: useCallback(async (department_id: string) => {
      return await deleteDepartmentAction(department_id);
    }, []),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey] }); // Cache für alle Abteilungen löschen
    },
  });
  return mutation;
};
