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
    // Alle Departments mit den dazugehörigen Ratings abrufen und nach Datum sortieren
    const { data, error } = await supabase
      .from("department")
      .select("*, rating(id, rating, comment, created_at)")
      .order("created_at", { ascending: false }); // Departments nach Erstellungsdatum sortieren
    // .order("created_at", { foreignTable: "rating", ascending: false }); // Ratings nach Datum sortieren

    if (error) throw error;

    return data as Array<{
      id: string;
      name: string | null;
      created_at: string;
      rating: Array<{
        id: string;
        rating: number | null;
        comment: string | null;
        created_at: string;
      }>;
    }>;
  } catch (error) {
    throw error;
  }
}

// try {
//   const { data, error } = await supabase.from("department").select("*");
//   if (error) throw error;
//   return data as Department[];
// } catch (error) {
//   throw error;
// }

export async function getAllDepartmentsWithRatings() {
  const supabase = await createClient();

  try {
    // Alle Departments mit den dazugehörigen Ratings abrufen
    const { data, error } = await supabase
      .from("department")
      .select("*, rating(id, rating, comment, created_at)");

    if (error) throw error;

    return data as Array<{
      id: string;
      name: string | null;
      created_at: string;
      rating: Array<{
        id: string;
        rating: number | null;
        comment: string | null;
        created_at: string;
      }>;
    }>;
  } catch (error) {
    console.error("Fehler beim Abrufen der Departments mit Ratings:", error);
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
