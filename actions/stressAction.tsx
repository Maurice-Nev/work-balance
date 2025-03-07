"use server";

import { createClient } from "@/supabase/server";
import {
  Stress,
  NewStress,
  UpdateStress,
} from "../supabase/types/database.models";

export async function getStressAction({ stress_id }: { stress_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("id", stress_id)
      .single();

    if (error) throw error;

    return data as Stress;
  } catch (error) {
    throw error;
  }
}

export async function getAllStressEntriesAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("stress").select("*");
    if (error) throw error;
    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function getStressForUserAction({ user_id }: { user_id: string }) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("user_id", user_id);

    if (error) throw error;

    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function getStressForDepartmentAction({
  department_id,
}: {
  department_id: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("stress")
      .select("*")
      .eq("department_id", department_id);

    if (error) throw error;

    return data as Stress[];
  } catch (error) {
    throw error;
  }
}

export async function createStressAction(newStress: NewStress) {
  const supabase = await createClient();

  try {
    const { error } = await supabase.from("stress").insert(newStress);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function updateStressAction(
  stress_id: string,
  updates: UpdateStress
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("stress")
      .update(updates)
      .eq("id", stress_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteStressAction(stress_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("stress")
      .delete()
      .eq("id", stress_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
