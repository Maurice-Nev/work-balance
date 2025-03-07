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
  const query = useQuery({
    queryKey: ["getAllDepartments"],
    queryFn: async () => {
      const departments: Department[] = await getAllDepartmentsAction();
      return departments;
    },
  });
  return query;
};

export const useCreateDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newDepartment: NewDepartment) => {
      return await createDepartmentAction(newDepartment);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllDepartments"] }); // Aktualisiert den Cache
    },
  });
  return mutation;
};

export const useUpdateDepartment = () => {
  const queryClient = useQueryClient();

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
    onSuccess: (_, { department_id }) => {
      queryClient.invalidateQueries({
        queryKey: ["getDepartment", department_id],
      }); // Aktualisiert nur diese Abteilung
    },
  });
  return mutation;
};

export const useDeleteDepartment = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (department_id: string) => {
      return await deleteDepartmentAction(department_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllDepartments"] }); // Cache für alle Abteilungen löschen
    },
  });
  return mutation;
};
