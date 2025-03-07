"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createSessionAction,
  deleteSessionAction,
  getAllSessionsAction,
  getSessionAction,
  getSessionsForUserAction,
  updateSessionAction,
} from "@/actions/sessionAction";
import {
  NewSession,
  Session,
  UpdateSession,
} from "@/supabase/types/database.models";

export const useGetSession = ({ session_id }: { session_id: string }) => {
  const query = useQuery({
    queryKey: ["getSession", session_id],
    queryFn: async () => {
      const session: Session = await getSessionAction({ session_id });
      return session;
    },
    enabled: !!session_id, // Nur ausführen, wenn `session_id` vorhanden ist
  });
  return query;
};

export const useGetAllSessions = () => {
  const query = useQuery({
    queryKey: ["getAllSessions"],
    queryFn: async () => {
      const sessions: Session[] = await getAllSessionsAction();
      return sessions;
    },
  });
  return query;
};

export const useGetSessionsForUser = ({ user_id }: { user_id: string }) => {
  const query = useQuery({
    queryKey: ["getSessionsForUser", user_id],
    queryFn: async () => {
      const sessions: Session[] = await getSessionsForUserAction({ user_id });
      return sessions;
    },
    enabled: !!user_id,
  });
  return query;
};

export const useCreateSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (newSession: NewSession) => {
      return await createSessionAction(newSession);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSessions"] }); // Aktualisiert den Cache
    },
  });
  return mutation;
};

export const useUpdateSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async ({
      session_id,
      updates,
    }: {
      session_id: string;
      updates: UpdateSession;
    }) => {
      return await updateSessionAction(session_id, updates);
    },
    onSuccess: (_, { session_id }) => {
      queryClient.invalidateQueries({ queryKey: ["getSession", session_id] }); // Aktualisiert nur diesen Eintrag
    },
  });
  return mutation;
};

export const useDeleteSession = () => {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async (session_id: string) => {
      return await deleteSessionAction(session_id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["getAllSessions"] }); // Cache für alle Sessions löschen
    },
  });
  return mutation;
};
