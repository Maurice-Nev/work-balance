"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createDepartmentAction,
  deleteDepartmentAction,
  getAllDepartmentsAction,
  getAllDepartmentsWithoutRatings,
  getDepartmentAction,
  updateDepartmentAction,
} from "@/actions/departmentAction";
import {
  Department,
  NewDepartment,
  UpdateDepartment,
} from "@/supabase/types/database.models";
import { DepartmentPageProps } from "@/features/(admin-only)/department/pages/departmentPage";
import { useCallback, useMemo } from "react";
import { toast } from "sonner";

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

export const useGetAllDepartments = () => {
  const queryKey = useMemo(() => "getAllDepartments", []);

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getAllDepartmentsAction();
    }, []),
    staleTime: 1000 * 30,
  });
  return query;
};

export const useGetAllDepartmentsWithoutRatings = () => {
  const queryKey = useMemo(() => "getAllDepartmentsWithoutRatings", []);

  const query = useQuery({
    queryKey: [queryKey],
    queryFn: useCallback(async () => {
      return await getAllDepartmentsWithoutRatings();
    }, []),
    staleTime: 1000 * 30,
  });
  return query;
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (newDepartment: NewDepartment) => {
      const res = await createDepartmentAction(newDepartment);
      return res;
    },
    onSuccess: (res) => {
      if (res) {
        toast.success("Create successfull!", {});
        queryClient.invalidateQueries({ queryKey: ["getAllDepartments"] });
      }
    },
    onError: (err) => {
      toast.error("Create error", {
        description: <pre>{JSON.stringify(err, null, 2)}</pre>,
      });
    },
  });
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();
  // const queryKey = useMemo(() => "getAllDepartments", []);

  const mutation = useMutation({
    mutationFn: async ({
      department_id,
      updates,
    }: {
      department_id: string;
      updates: UpdateDepartment;
    }) => {
      return await updateDepartmentAction(department_id, updates);
    },
    onSuccess: (res) => {
      if (res) {
        toast.success("Update successfull!", {
          // description: <pre>{JSON.stringify(res, null, 2)}</pre>,
        });
        queryClient.invalidateQueries({
          queryKey: ["getAllDepartments"],
        });
      }
    },
    onError: (err) => {
      toast.error("Update error", {
        description: <pre>{JSON.stringify(err, null, 2)}</pre>,
      });
    },
  });
  return mutation;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();
  // const queryKey = useMemo(() => "getAllDepartments", []);

  const mutation = useMutation({
    mutationFn: useCallback(async (department_id: string) => {
      return await deleteDepartmentAction(department_id);
    }, []),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllDepartments"] }); // Cache für alle Abteilungen löschen
    },
  });
  return mutation;
};
