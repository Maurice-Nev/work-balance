"use server";

import { createClient } from "@/supabase/server";
import {
  Department,
  NewDepartment,
  UpdateDepartment,
} from "../supabase/types/database.models";

export async function getDepartmentAction({
  department_id,
}: {
  department_id: string;
}) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("department")
      .select("*")
      .eq("id", department_id)
      .single();

    if (error) throw error;

    return data as Department;
  } catch (error) {
    throw error;
  }
}

export async function getAllDepartmentsAction() {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase.from("department").select("*");
    if (error) throw error;
    return data as Department[];
  } catch (error) {
    throw error;
  }
}

export async function createDepartmentAction(newDepartment: NewDepartment) {
  const supabase = await createClient();

  try {
    const { data, error } = await supabase
      .from("department")
      .insert(newDepartment)
      .select()
      .single();
    if (error) throw error;
    return data as Department;
  } catch (error) {
    throw error;
  }
}

export async function updateDepartmentAction(
  department_id: string,
  updates: UpdateDepartment
) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("department")
      .update(updates)
      .eq("id", department_id);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}

export async function deleteDepartmentAction(department_id: string) {
  const supabase = await createClient();

  try {
    const { error } = await supabase
      .from("department")
      .delete()
      .eq("id", department_id);
    if (error) throw error;
    return { success: true };
  } catch (error) {
    throw error;
  }
}
