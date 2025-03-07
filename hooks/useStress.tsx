"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  UpdateStress,
  Stress,
  NewStress,
} from "@/supabase/types/database.models";
import {
  getStressForDepartmentAction,
  getAllStressEntriesAction,
  getStressForUserAction,
  deleteStressAction,
  updateStressAction,
  createStressAction,
  getStressAction,
} from "@/actions/stressAction";

export const useGetStress = ({ stress_id }: { stress_id: string }) => {
  return useQuery({
    queryKey: ["getStress", stress_id],
    queryFn: async () => {
      const stress: Stress = await getStressAction({ stress_id });
      return stress;
    },
    enabled: !!stress_id, // Nur ausführen, wenn `stress_id` vorhanden ist
  });
};

export const useGetAllStressEntries = () => {
  return useQuery({
    queryKey: ["getAllStress"],
    queryFn: async () => {
      const stress: Stress[] = await getAllStressEntriesAction();
      return stress;
    },
  });
};

export const useGetStressForUser = ({ user_id }: { user_id: string }) => {
  return useQuery({
    queryKey: ["getStressForUser", user_id],
    queryFn: async () => {
      const stress: Stress[] = await getStressForUserAction({ user_id });
      return stress;
    },
    enabled: !!user_id,
  });
};

export const useGetStressForDepartment = ({
  department_id,
}: {
  department_id: string;
}) => {
  const query = useQuery({
    queryKey: ["getStressForDepartment", department_id],
    queryFn: async () => {
      const stress: Stress[] = await getStressForDepartmentAction({
        department_id,
      });
      return stress;
    },
    enabled: !!department_id,
  });
  return query;
};

export const useCreateStress = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newStress: NewStress) => {
      return await createStressAction(newStress);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStress"] }); // Aktualisiert den Cache
    },
  });
  return mutation;
};

export const useUpdateStress = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      stress_id,
      updates,
    }: {
      stress_id: string;
      updates: UpdateStress;
    }) => {
      return await updateStressAction(stress_id, updates);
    },
    onSuccess: (_, { stress_id }) => {
      queryClient.invalidateQueries({ queryKey: ["getStress", stress_id] }); // Aktualisiert nur diesen Eintrag
    },
  });
  return mutation;
};

export const useDeleteStress = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (stress_id: string) => {
      return await deleteStressAction(stress_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllStress"] }); // Cache für alle Stress-Einträge löschen
    },
  });
  return mutation;
};
