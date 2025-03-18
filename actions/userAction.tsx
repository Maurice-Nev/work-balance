"use server";

import { createClient } from "@/supabase/server";
import {
  User,
  Role,
  UpdateUser,
  NewUser,
} from "../supabase/types/database.models";

export async function getUserAction({ user_id }: { user_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user")
      .select("*, role:role_id(*)")
      .eq("id", user_id)
      .single();

    if (error) throw error;

    const userWithRole = data as User & { role: Role | null };

    return userWithRole;
  } catch (error) {
    throw error;
  }
}

export async function createUserAction(newUser: NewUser) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("user")
      .insert(newUser)
      .select("*, role:role_id(*)")
      .single();
    if (error) throw error;
    return data as User;
  } catch (error) {
    throw error;
  }
}

export async function updateUserAction(user_id: string, updates: UpdateUser) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("user")
      .update(updates)
      .eq("id", user_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteUserAction(user_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("user").delete().eq("id", user_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
