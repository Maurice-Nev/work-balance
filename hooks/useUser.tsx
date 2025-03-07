"use client";

import {
  createUserAction,
  deleteUserAction,
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

export const useCreateUser = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newUser: NewUser) => {
      return await createUserAction(newUser);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getUser"] }); // Cache für User aktualisieren
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
    onSuccess: (_, { user_id }) => {
      queryClient.invalidateQueries({ queryKey: ["getUser", user_id] }); // Aktualisiert den User-Cache
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
      queryClient.invalidateQueries({ queryKey: ["getUser"] }); // Cache für alle User löschen
    },
  });
  return mutation;
};
