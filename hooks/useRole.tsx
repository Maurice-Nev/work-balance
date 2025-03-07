"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createRoleAction,
  deleteRoleAction,
  getAllRolesAction,
  getRoleAction,
  updateRoleAction,
} from "@/actions/roleAction";
import { NewRole, Role, UpdateRole } from "@/supabase/types/database.models";

export const useGetRole = ({ role_id }: { role_id: string }) => {
  const query = useQuery({
    queryKey: ["getRole", role_id],
    queryFn: async () => {
      const role: Role = await getRoleAction({ role_id });
      return role;
    },
    enabled: !!role_id, // Nur ausführen, wenn `role_id` vorhanden ist
  });
  return query;
};

export const useGetAllRoles = () => {
  const query = useQuery({
    queryKey: ["getAllRoles"],
    queryFn: async () => {
      const roles: Role[] = await getAllRolesAction();
      return roles;
    },
  });
  return query;
};

export const useCreateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newRole: NewRole) => {
      return await createRoleAction(newRole);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllRoles"] }); // Aktualisiert den Cache
    },
  });
  return mutation;
};

export const useUpdateRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      role_id,
      updates,
    }: {
      role_id: string;
      updates: UpdateRole;
    }) => {
      return await updateRoleAction(role_id, updates);
    },
    onSuccess: (_, { role_id }) => {
      queryClient.invalidateQueries({ queryKey: ["getRole", role_id] }); // Aktualisiert nur diese Rolle
    },
  });
  return mutation;
};

export const useDeleteRole = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (role_id: string) => {
      return await deleteRoleAction(role_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllRoles"] }); // Cache für alle Rollen löschen
    },
  });
  return mutation;
};
