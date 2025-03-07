"use server";

import { createClient } from "@/supabase/server";
import { Role, NewRole, UpdateRole } from "../supabase/types/database.models";

export async function getRoleAction({ role_id }: { role_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("role")
      .select("*")
      .eq("id", role_id)
      .single();

    if (error) throw error;

    return data as Role;
  } catch (error) {
    throw error;
  }
}

export async function getAllRolesAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("role").select("*");
    if (error) throw error;
    return data as Role[];
  } catch (error) {
    throw error;
  }
}

export async function createRoleAction(newRole: NewRole) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("role")
      .insert(newRole)
      .select()
      .single();
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function updateRoleAction(role_id: string, updates: UpdateRole) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("role")
      .update(updates)
      .eq("id", role_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteRoleAction(role_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("role").delete().eq("id", role_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
