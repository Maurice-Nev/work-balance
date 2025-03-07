"use server";

import { createClient } from "@/supabase/server";
import {
  Session,
  NewSession,
  UpdateSession,
} from "../supabase/types/database.models";

export async function getSessionAction({ session_id }: { session_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("id", session_id)
      .single();

    if (error) throw error;

    return data as Session;
  } catch (error) {
    throw error;
  }
}

export async function getAllSessionsAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("session").select("*");
    if (error) throw error;
    return data as Session[];
  } catch (error) {
    throw error;
  }
}

export async function getSessionsForUserAction({
  user_id,
}: {
  user_id: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("session")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data as Session[];
  } catch (error) {
    throw error;
  }
}

export async function createSessionAction(newSession: NewSession) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("session")
      .insert(newSession)
      .select()
      .single();
    if (error) throw error;
    return data as Session;
  } catch (error) {
    throw error;
  }
}

export async function updateSessionAction(
  session_id: string,
  updates: UpdateSession
) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("session")
      .update(updates)
      .eq("id", session_id)
      .select()
      .single();

    if (error) throw error;
    return data as Session;
  } catch (error) {
    throw error;
  }
}

export async function deleteSessionAction(session_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("session")
      .delete()
      .eq("id", session_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
