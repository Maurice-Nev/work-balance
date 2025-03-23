"use client";

import {
  createUserAction,
  deleteUserAction,
  getAllUsersAction,
  getUserAction,
  updateUserAction,
} from "@/actions/userAction";
import { NewUser, UpdateUser, User } from "@/supabase/types/database.models";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useGetUser = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["getUser", user_id],
    queryFn: async () => {
      const user: User = await getUserAction({ user_id });
      return user;
    },
    enabled: !!user_id, // Nur ausführen, wenn `user_id` vorhanden ist
  });
  return query;
};

export const useGetAllUsers = () => {
  const query = useQuery({
    queryKey: ["getAllUsers"],
    queryFn: async () => {
      const user = await getAllUsersAction();
      return user;
    },
    staleTime: 1000 * 30,
  });
  return query;
};

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({ newUser }: { newUser: NewUser }) => {
      return await createUserAction(newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] }); // Cache für User aktualisieren
    },
  });
  return mutation;
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      user_id,
      updates,
    }: {
      user_id: string;
      updates: UpdateUser;
    }) => {
      return await updateUserAction(user_id, updates);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] }); // Aktualisiert den User-Cache
    },
  });
  return mutation;
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (user_id: string) => {
      return await deleteUserAction(user_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllUsers"] }); // Cache für alle User löschen
    },
  });
  return mutation;
};
